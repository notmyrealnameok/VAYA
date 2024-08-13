import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LoadingOverlay from './components/LoadingOverlay';
import { COLORS } from './constants/colors';

// Import screens
import SignUpScreen from './screens/SignUpScreen';
import LoginScreen from './screens/LoginScreen';
import ResetPasswordScreen from './screens/ResetPasswordScreen';
import { OnboardingScreen1, OnboardingScreen2 } from './screens/OnboardingScreen';
import HomeScreen from './screens/HomeScreen';
import BusesScreen from './screens/BusesScreen';
import StationsScreen from './screens/StationsScreen';
import TicketsScreen from './screens/TicketsScreen';
import ScheduleScreen from './screens/ScheduleScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import WalletScreen from './screens/WalletScreen';
import AccountScreen from './screens/Account';
import EditProfileScreen from './screens/EditProfileScreen';

// Create Stack and Tab Navigators
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const HomeTabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName;

        switch (route.name) {
          case 'Home':
            iconName = 'home';
            break;
          case 'Notifications':
            iconName = 'bell';
            break;
          case 'Account':
            iconName = 'account';
            break;
          case 'Wallet':
            iconName = 'wallet';
            break;
          default:
            iconName = 'home';
        }

        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: COLORS.red,
      tabBarInactiveTintColor: 'gray',
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }}/>
    <Tab.Screen name="Notifications" component={NotificationsScreen} options={{ headerShown: false }}/>
    <Tab.Screen name="Wallet" component={WalletScreen} options={{ headerShown: false }} />
    <Tab.Screen name="Account" component={AccountScreen} options={{ headerShown: false }} />
  </Tab.Navigator>
);

const App = () => {
  const [initialRoute, setInitialRoute] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const hasSeenOnboarding = await AsyncStorage.getItem('hasSeenOnboarding');
        setInitialRoute(hasSeenOnboarding === 'true' ? 'Login' : 'Onboarding1');
      } catch (e) {
        console.error('Failed to load onboarding status:', e);
        setInitialRoute('Onboarding1'); // Default to onboarding on error
      } finally {
        setLoading(false);
      }
    };

    checkOnboardingStatus();
  }, []);

  if (loading) {
    return <LoadingOverlay visible={true} />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen name="Onboarding1" component={OnboardingScreen1} options={{ headerShown: false }}/>
        <Stack.Screen name="Onboarding2" component={OnboardingScreen2} options={{ headerShown: false }} />
        <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} options={{ headerShown: false }} />
        <Stack.Screen name="HomeTabNavigator" component={HomeTabNavigator} options={{ headerShown: false }}/>
        <Stack.Screen name="Account" component={AccountScreen} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen name="Buses" component={BusesScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Stations" component={StationsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Tickets" component={TicketsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Schedule" component={ScheduleScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
