import React from 'react';
import { View, ActivityIndicator, StyleSheet, Image, Text } from 'react-native';
import { COLORS } from '../constants/colors';

const LoadingOverlay = ({ visible }) => {
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <Image source={require('../assets/app_logo.png')} style={styles.logo} />
      <View style={styles.loadingTextContainer}>
        <Text style={styles.loadingText}>Welcome to Vaya Monate!</Text>
        <Text style={styles.loadingText}>Discover the joy of seamless travel.</Text>
      </View>
      <ActivityIndicator size="large" color={COLORS.red} />
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  loadingTextContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: COLORS.red,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 10,
    paddingVertical: 5,
  },
});

export default LoadingOverlay;
