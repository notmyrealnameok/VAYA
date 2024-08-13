import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Image, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { auth, db, doc, setDoc, getDoc } from '../firebase'; // Adjust path if necessary
import { COLORS } from '../constants/colors';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';

const EditProfileScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserName(userData.name || 'No Name Provided');
            setUserEmail(userData.email || user.email);
            setPhoneNumber(userData.phoneNumber || '');
            setProfilePicture(userData.profilePicture || null);
          } else {
            console.log('No such document!');
          }
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleSelectImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Error', 'Sorry, we need camera roll permissions to make this work!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      console.log('ImagePicker result:', result);

      if (result.canceled) {
        Alert.alert('Error', 'Image selection was cancelled.');
        return;
      }

      const { uri } = result.assets[0];
      console.log('Selected image URI:', uri);

      if (!uri) {
        Alert.alert('Error', 'No image URI returned.');
        return;
      }

      setIsUploading(true);

      const response = await fetch(uri);
      if (!response.ok) {
        throw new Error('Failed to fetch image');
      }

      const blob = await response.blob();

      const storage = getStorage();
      const storageRef = ref(storage, `profilePictures/${auth.currentUser.uid}_${Date.now()}`);

      await uploadBytes(storageRef, blob);
      const url = await getDownloadURL(storageRef);

      setProfilePicture(url);
      console.log('Image uploaded successfully, URL:', url);
    } catch (error) {
      console.error('Error selecting image:', error);
      Alert.alert('Error', `Failed to select image: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    if (!userName.trim() || !userEmail.trim()) {
      Alert.alert('Error', 'Please fill out all fields.');
      return;
    }

    setIsSaving(true);

    try {
      const user = auth.currentUser;
      if (user) {
        await setDoc(doc(db, 'users', user.uid), {
          name: userName,
          email: userEmail,
          phoneNumber: phoneNumber,
          profilePicture: profilePicture,
        }, { merge: true });

        Alert.alert('Success', 'Profile updated successfully!');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'There was a problem updating your profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match.');
      return;
    }

    setIsChangingPassword(true);

    try {
      const user = auth.currentUser;
      if (user) {
        // Reauthenticate the user
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        await reauthenticateWithCredential(user, credential);

        // Update the password
        await user.updatePassword(newPassword);

        // Optionally, update the database with the new password change timestamp
        await setDoc(doc(db, 'users', user.uid), {
          lastPasswordChange: new Date().toISOString(),
        }, { merge: true });

        Alert.alert('Success', 'Password updated successfully!');
        setIsModalVisible(false);
      } else {
        Alert.alert('Error', 'No user logged in.');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      Alert.alert('Error', 'There was a problem changing your password.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.red} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleSelectImage} style={styles.profilePictureContainer}>
        {isUploading && <ActivityIndicator size="large" color={COLORS.red} style={styles.uploadingIndicator} />}
        <Image
          source={profilePicture ? { uri: profilePicture } : require('../assets/defaultProfilePic.jpg')}
          style={styles.profilePicture}
        />
        <Icon name="camera" size={30} color={COLORS.black} style={styles.cameraIcon} />
      </TouchableOpacity>
      
      <View style={styles.form}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={userName}
          onChangeText={setUserName}
          placeholder="Enter your name"
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={userEmail}
          onChangeText={setUserEmail}
          placeholder="Enter your email"
          keyboardType="email-address"
        />

        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          placeholder="Enter your phone number"
          keyboardType="phone-pad"
        />

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          disabled={isSaving}
        >
          <Text style={styles.saveButtonText}>{isSaving ? 'Saving...' : 'Save Changes'}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.changePasswordButton}
          onPress={() => setIsModalVisible(true)}
        >
          <Text style={styles.changePasswordButtonText}>Change Password</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Change Password</Text>
            
            <Text style={styles.modalLabel}>Current Password</Text>
            <TextInput
              style={styles.modalInput}
              value={currentPassword}
              onChangeText={setCurrentPassword}
              placeholder="Enter your current password"
              secureTextEntry
            />

            <Text style={styles.modalLabel}>New Password</Text>
            <TextInput
              style={styles.modalInput}
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="Enter new password"
              secureTextEntry
            />

            <Text style={styles.modalLabel}>Confirm New Password</Text>
            <TextInput
              style={styles.modalInput}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm new password"
              secureTextEntry
            />

            <TouchableOpacity
              style={styles.modalSaveButton}
              onPress={handleChangePassword}
              disabled={isChangingPassword}
            >
              <Text style={styles.modalSaveButtonText}>{isChangingPassword ? 'Changing...' : 'Change Password'}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={styles.modalCancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  profilePictureContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ddd',
  },
  uploadingIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 50,
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  form: {
    width: '100%',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: COLORS.black,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    fontSize: 16,
    borderRadius: 8,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  saveButton: {
    backgroundColor: COLORS.red,
    padding: 15,
    alignItems: 'center',
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  changePasswordButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: COLORS.blue,
    alignItems: 'center',
    borderRadius: 8,
  },
  changePasswordButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalLabel: {
    fontSize: 16,
    marginBottom: 8,
    color: COLORS.black,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    fontSize: 16,
    borderRadius: 8,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  modalSaveButton: {
    backgroundColor: COLORS.red,
    padding: 15,
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 10,
  },
  modalSaveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalCancelButton: {
    padding: 15,
    backgroundColor: COLORS.grey,
    alignItems: 'center',
    borderRadius: 8,
  },
  modalCancelButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default EditProfileScreen;
