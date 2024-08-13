import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase'; // Adjust import according to your firebase config
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Importing icon library
import { COLORS } from '../constants/colors';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false); // State to track password visibility
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.navigate('HomeTabNavigator');
    } catch (error) {
      if (error.code === 'auth/invalid-email') {
        setError('Invalid email address.');
      } else if (error.code === 'auth/user-not-found') {
        setError('No user found with this email.');
      } else if (error.code === 'auth/wrong-password') {
        setError('Incorrect password.');
      } else if (error.code === 'auth/network-request-failed') {
        setError('Network error. Please try again.');
      } else {
        setError('Error during login: Please check your credentials.');
      }
    } finally {
      setLoading(false);
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
      <Image source={require('../assets/app_logo.png')} style={styles.icon} />
      <Text style={styles.title}>Welcome To Vaya Monate</Text>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
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
            color={COLORS.blue}
          />
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => navigation.navigate('ResetPassword')}>
        <Text style={styles.forgotPassword}>Forgot your password?</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.signUpText}>Don't have an account? <Text style={styles.underline}>Sign Up</Text></Text>
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
  forgotPassword: {
    color: COLORS.blue,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: COLORS.red,
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  loginText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  signUpText: {
    color: COLORS.blue,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  underline: {
    textDecorationLine: 'underline',
    color: COLORS.red,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoginScreen;
