import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { auth, db, doc, setDoc } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import LoadingOverlay from '../components/LoadingOverlay';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Importing icon library
import { COLORS } from '../constants/colors';

const SignUpScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [reaVayaCardNumber, setReaVayaCardNumber] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false); // State to track password visibility
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignUp = async () => {
    if (!name || !phoneNumber || !email || !reaVayaCardNumber || !password) {
      setError('All fields are required.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredentials.user;

      await setDoc(doc(db, 'users', user.uid), {
        name: name,
        phoneNumber: phoneNumber,
        reaVayaCardNumber: reaVayaCardNumber,
        email: email,
      });

      navigation.navigate('Login');
    } catch (error) {
      setError('Error during sign up: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LoadingOverlay visible={loading} />
      <Image source={require('../assets/app_logo.png')} style={styles.icon} />
      <Text style={styles.title}>Sign Up</Text>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
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
        keyboardType="phone-pad"
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        placeholderTextColor={COLORS.blue}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <TextInput
        placeholder="Rea Vaya Card Number"
        value={reaVayaCardNumber}
        onChangeText={setReaVayaCardNumber}
        style={styles.input}
        placeholderTextColor={COLORS.blue}
        keyboardType="number-pad"
      />
      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!passwordVisible}
          style={[styles.input, styles.passwordInput]}
          placeholderTextColor={COLORS.blue}
          autoCapitalize="none"
        />
        <TouchableOpacity
          onPress={() => setPasswordVisible(!passwordVisible)}
          style={styles.eyeIcon}
        >
          <Icon
            name={passwordVisible ? 'eye-off-outline' : 'eye-outline'}
            size={24}
            color={COLORS.black}
          />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.createAccountButton} onPress={handleSignUp}>
        <Text style={styles.createAccountText}>Create Account</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginText}>Already have an account? <Text style={styles.underline}>Log in</Text></Text>
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
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 20,
    borderRadius: 50,
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
  passwordContainer: {
    position: 'relative',
    justifyContent: 'center',
  },
  passwordInput: {
    paddingRight: 40, // Space for the eye icon
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    justifyContent: 'center',
  },
  errorText: {
    color: COLORS.red,
    textAlign: 'center',
    marginBottom: 10,
  },
  createAccountButton: {
    backgroundColor: COLORS.red,
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  createAccountText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginText: {
    color: COLORS.blue,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  underline: {
    textDecorationLine: 'underline',
  },
});

export default SignUpScreen;
