import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { auth, db, doc, getDoc } from '../firebase'; // Adjust path if necessary
import { COLORS } from '../constants/colors';

const AccountScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [profilePicture, setProfilePicture] = useState(null); // Add state for profile picture

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
            setProfilePicture(userData.profilePicture || null); // Set profile picture URL
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

  const handlePress = (screen) => {
    navigation.navigate(screen);
  };

  const handleLogout = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => {
            auth.signOut().then(() => {
              navigation.navigate('Login'); // Replace 'Login' with the name of your login screen
            }).catch((error) => {
              console.error('Error signing out:', error);
            });
          },
        },
      ],
      { cancelable: false }
    );
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
      <View style={styles.profileSection}>
        <Image
          source={profilePicture ? { uri: profilePicture } : require('../assets/defaultProfilePic.jpg')}
          style={styles.profilePicture}
        />
        <Text style={styles.profileName}>{userName}</Text>
        <Text style={styles.profileEmail}>{userEmail}</Text>
      </View>

      <View style={styles.optionsContainer}>
        <TouchableOpacity style={styles.optionButton} onPress={() => handlePress('EditProfile')}>
          <Icon name="account-edit" size={24} color={COLORS.black} />
          <Text style={styles.optionText}>Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionButton} onPress={() => handlePress('Activity')}>
          <Icon name="history" size={24} color={COLORS.black} />
          <Text style={styles.optionText}>Activity</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionButton} onPress={() => handlePress('Settings')}>
          <Icon name="cog" size={24} color={COLORS.black} />
          <Text style={styles.optionText}>Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionButton} onPress={() => handlePress('Privacy')}>
          <Icon name="shield-account" size={24} color={COLORS.black} />
          <Text style={styles.optionText}>Privacy</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.optionButton, styles.logoutButton]} onPress={handleLogout}>
          <Icon name="logout" size={24} color={COLORS.black} />
          <Text style={styles.optionText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>@Vaya Monate2024</Text>
        <Text style={styles.footerText}>v1.0.0.0</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ddd',
  },
  profileName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.black,
    marginTop: 12,
  },
  profileEmail: {
    fontSize: 18,
    color: COLORS.gray,
    marginTop: 4,
  },
  optionsContainer: {
    width: '100%',
    alignItems: 'center', // Center options horizontally
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
    padding: 16,
    borderRadius: 10,
    marginVertical: 8,
    elevation: 3,
    width: '80%', // Set width to make it consistent
  },
  optionText: {
    fontSize: 18,
    marginLeft: 12,
    color: COLORS.black,
  },
  logoutButton: {
    backgroundColor: COLORS.red + '80', // Semi-transparent background
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    alignItems: 'center',
    marginVertical: 20,
    position: 'absolute',
    bottom: 10,
  },
  footerText: {
    fontSize: 14,
    color: COLORS.black,
  },
});

export default AccountScreen;
