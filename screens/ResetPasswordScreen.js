import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { auth } from '../firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import LoadingOverlay from '../components/LoadingOverlay';
import { COLORS } from '../constants/colors';

const ResetPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      alert('Password reset link sent!');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error during password reset:', error);
      alert(`Firebase: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LoadingOverlay visible={loading} />
      <Text style={styles.title}>Reset Password</Text>
      <TextInput
        placeholder="Enter the email associated with your account"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        placeholderTextColor={COLORS.blue}
      />
      <TouchableOpacity style={styles.sendButton} onPress={handleResetPassword}>
        <Text style={styles.sendText}>Send</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
    backgroundColor: COLORS.white,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
    color: COLORS.red,
  },
  input: {
    height: 40,
    borderColor: COLORS.red,
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    borderRadius: 25,
    paddingLeft: 16,
  },
  sendButton: {
    backgroundColor: COLORS.red,
    borderRadius: 25,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  sendText: {
    color: COLORS.white,
    fontSize: 16,
  },
});

export default ResetPasswordScreen;
