import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import { auth, db, doc, setDoc } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import LoadingOverlay from '../components/LoadingOverlay';
import { COLORS } from '../constants/colors';

const SignUpScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [reaVayaCardNumber, setReaVayaCardNumber] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    setLoading(true);
    try {
      const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredentials.user;
      console.log('Registered with:', user.email);

      await setDoc(doc(db, 'users', user.uid), {
        name: name,
        phoneNumber: phoneNumber,
        reaVayaCardNumber: reaVayaCardNumber,
        email: email,
      });

      navigation.navigate('Login');
    } catch (error) {
      console.error('Error during sign up:', error);
      alert(`Firebase: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LoadingOverlay visible={loading} />
      <Image source={require('../assets/app_logo.png')} style={styles.icon} />
      <Text style={styles.title}>Register</Text>
      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
        placeholderTextColor={COLORS.blue}
      />
      <TextInput
        placeholder="Phone Number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        style={styles.input}
        placeholderTextColor={COLORS.blue}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        placeholderTextColor={COLORS.blue}
      />
      <TextInput
        placeholder="Rea Vaya Card Number"
        value={reaVayaCardNumber}
        onChangeText={setReaVayaCardNumber}
        style={styles.input}
        placeholderTextColor={COLORS.blue}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        placeholderTextColor={COLORS.blue}
      />
      <TouchableOpacity style={styles.createAccountButton} onPress={handleSignUp}>
        <Text style={styles.createAccountText}>Create Account</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginText}>Already have an account? Log In</Text>
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
  icon: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    marginBottom: 20,
    borderRadius: 100,
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
  createAccountButton: {
    backgroundColor: COLORS.red,
    borderRadius: 25,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  createAccountText: {
    color: COLORS.white,
    fontSize: 16,
  },
  loginText: {
    color: COLORS.blue,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default SignUpScreen;
