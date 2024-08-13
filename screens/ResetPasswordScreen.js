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
        placeholder="Enter your email"
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
    fontWeight: 'bold',
    textAlign: 'center',
    color: COLORS.blue,
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: COLORS.blue,
    marginBottom: 12,
    paddingHorizontal: 16,
    borderRadius: 25,
    color: COLORS.black,
    backgroundColor: '#F0F0F0', // Softer gray for a nicer background
    fontSize: 16,
    fontWeight: '500',
    elevation: 3, // Adds subtle shadow for a raised effect
  },
  sendButton: {
    backgroundColor: COLORS.red,
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  sendText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ResetPasswordScreen;
