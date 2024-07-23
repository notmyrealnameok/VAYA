import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';

const HomeScreen = ({ route }) => {
  const { userName } = route.params;

  const getGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      return `Good Morning`;
    } else if (currentHour < 18) {
      return `Good Afternoon`;
    } else {
      return `Good Evening`;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>{`${getGreeting()} ${userName}`}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.black,
  },
});

export default HomeScreen;
