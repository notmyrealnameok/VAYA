import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Animated,
  Easing,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Ensure you have this package installed
import axios from 'axios';
import { COLORS } from '../constants/colors';
import { auth, db, doc, getDoc } from '../firebase'; // Adjust path if necessary
import Swiper from 'react-native-swiper'; // Import swiper

const WEATHER_API_KEY = 'aedcae139e9f8a45b74afbe74541e7d8';
const IPINFO_API_TOKEN = '86f89e7bb3852b';

const HomeScreen = ({ route, navigation }) => {
  const [userName, setUserName] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState({ area: '', province: '' });

  const [fadeAnim] = useState(new Animated.Value(0)); // Initial opacity for animation

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserName(userData.name || 'No Name Provided');
          } else {
            console.log('No such document!');
          }
        }

        const fetchWeather = async () => {
          try {
            const { data } = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
              params: {
                q: location.area || 'Lagos',
                appid: WEATHER_API_KEY,
                units: 'metric',
              },
            });
            setWeather(data);
          } catch (error) {
            console.error('Error fetching weather data:', error.response ? error.response.data : error.message);
            setError(error.response ? error.response.data.message : error.message);
          }
        };

        const fetchLocation = async () => {
          try {
            const { data } = await axios.get(`https://ipinfo.io?token=${IPINFO_API_TOKEN}`);
            const { city, region } = data;
            setLocation({
              area: city || 'Unknown',
              province: region || 'Unknown',
            });
          } catch (error) {
            console.error('Error fetching location data:', error.message);
            setLocation({
              area: 'Unknown',
              province: 'Unknown',
            });
          }
        };

        // Fetch location first, then weather
        await fetchLocation();
        await fetchWeather();
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }).start();
      }
    };

    fetchData();
  }, [location.area, fadeAnim]);

  const getGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      return 'Good Morning';
    } else if (currentHour < 18) {
      return 'Good Afternoon';
    } else {
      return 'Good Evening';
    }
  };

  const handlePress = (screen) => {
    navigation.navigate(screen);
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.red} />
        </View>
      ) : (
        <Animated.View style={[styles.infoRow, { opacity: fadeAnim }]}>
          <View style={styles.greetingContainer}>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.userName}>{userName}</Text>
          </View>

          <View style={styles.weatherAndLocationContainer}>
            {error ? (
              <Text style={styles.errorText}>Weather info unavailable: {error}</Text>
            ) : (
              <>
                <View style={styles.weatherContainer}>
                  <Icon name="weather-cloudy" size={40} color={COLORS.black} />
                  <Text style={styles.weatherText}>
                    {weather ? `${weather.main.temp}°C` : 'Weather info unavailable'}
                  </Text>
                </View>
                <Text style={styles.locationText}>
                  {`${location.area}, ${location.province}`}
                </Text>
              </>
            )}
          </View>
        </Animated.View>
      )}

      {/* Swiper Component */}
      <Swiper
        style={styles.swiper}
        showsPagination
        paginationStyle={styles.paginationStyle}
        activeDotColor={COLORS.red}
        dotColor={COLORS.gray}
        loop={true}
        autoplay={true}
        autoplayTimeout={8}
      >
        <View style={styles.slide}>
          <Image source={require('../assets/Image1.jpeg')} style={styles.image} />
        </View>
        <View style={styles.slide}>
          <Image source={require('../assets/Image2.jpeg')} style={styles.image} />
        </View>
        <View style={styles.slide}>
          <Image source={require('../assets/Image3.jpeg')} style={styles.image} />
        </View>
      </Swiper>

      <View style={styles.quickActionsContainer}>
        {[
          { icon: 'bus', label: 'Buses', description: 'View bus schedules and routes', screen: 'Buses' },
          { icon: 'ticket', label: 'Tickets', description: 'Purchase and manage tickets', screen: 'Tickets' },
          { icon: 'calendar', label: 'Schedule', description: 'Check upcoming schedules', screen: 'Schedule' },
          { icon: 'map-marker', label: 'Stations', description: 'Find nearby stations', screen: 'Stations' },
        ].map(({ icon, label, description, screen }) => (
          <TouchableOpacity
            key={label}
            style={styles.quickActionButton}
            onPress={() => handlePress(screen)}
          >
            <View style={styles.quickActionIconContainer}>
              <Icon name={icon} size={30} color={COLORS.red} />
            </View>
            <Text style={styles.quickActionText}>{label}</Text>
            <Text style={styles.quickActionDescription}>{description}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 20,
    alignItems: 'flex-start',
    marginTop: 40, // Adjust this to push the infoRow down
  },
  greetingContainer: {
    flex: 1,
    paddingRight: 8,
  },
  greeting: {
    fontSize: 26,
    color: COLORS.black,
    fontWeight: '400',
    
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.black,
    marginTop: 4,
  },
  weatherAndLocationContainer: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingLeft: 8,
  },
  weatherContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  weatherText: {
    fontSize: 20,
    color: COLORS.black,
    marginLeft: 10,
  },
  locationText: {
    fontSize: 18,
    color: COLORS.black,
  },
  swiper: {
    height: 250, // Increased height for more modern look
    marginBottom: 16,
  },
  paginationStyle: {
    bottom: 10, // Adjust bottom position as needed
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  errorText: {
    fontSize: 18,
    color: COLORS.red,
    textAlign: 'center',
    marginVertical: 20,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  quickActionButton: {
    backgroundColor: COLORS.lightGray,
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    width: '48%',
    height: 120, // Fixed height for tile effect
    marginVertical: 8,
    elevation: 5,
  },
  quickActionIconContainer: {
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  quickActionDescription: {
    fontSize: 14,
    color: COLORS.gray,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;
