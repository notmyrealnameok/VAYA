import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingOverlay from '../components/LoadingOverlay';
import { COLORS } from '../constants/colors';

const OnboardingScreen1 = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image source={require('../assets/onboarding1.png')} style={styles.image} />
      <Text style={styles.title}>Find your bus easily</Text>
      <Text style={styles.subtitle}>Find your bus easily and reload your card online.</Text>
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.skipButton} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.nextButton} onPress={() => navigation.navigate('Onboarding2')}>
          <Text style={styles.nextText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const OnboardingScreen2 = ({ navigation }) => {
  const [loading, setLoading] = useState(false);

  const completeOnboarding = async () => {
    setLoading(true);
    try {
      await AsyncStorage.setItem('hasSeenOnboarding', 'true');
      navigation.navigate('SignUp');
    } catch (e) {
      console.error('Failed to save the data to the storage');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LoadingOverlay visible={loading} />
      <Image source={require('../assets/onboarding2.png')} style={styles.image} />
      <Text style={styles.title}>Rea Vaya’s first mobile app!</Text>
      <Text style={styles.subtitle}>Experience Rea Vaya like never before with a newly designed system to make getting where you need faster and easier</Text>
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.skipButton} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.skipText}>Skip </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.getStartedButton} onPress={completeOnboarding}>
          <Text style={styles.getStartedText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: COLORS.white,
  },
  image: {
    width: '100%',
    height: 300,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 10,
    color: COLORS.red,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: COLORS.blue,
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 16,
  },
  skipButton: {
    alignSelf: 'flex-start',
  },
  skipText: {
    color: COLORS.blue,
    fontSize: 16,
  },
  nextButton: {
    backgroundColor: COLORS.red,
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  nextText: {
    color: COLORS.white,
    fontSize: 16,
  },
  getStartedButton: {
    backgroundColor: COLORS.red,
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  getStartedText: {
    color: COLORS.white,
    fontSize: 16,
  },
});

export { OnboardingScreen1, OnboardingScreen2 };
