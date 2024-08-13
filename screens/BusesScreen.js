import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Image,
  Alert,
  Linking,
  Platform,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { COLORS } from '../constants/colors';

const reaVayaStations = [
  { id: 1, name: 'Thokoza Park Station', coords: { latitude: -26.2557, longitude: 27.9080 } },
  { id: 2, name: 'Ellis Park East Station', coords: { latitude: -26.1973, longitude: 28.0603 } },
  { id: 3, name: 'Carlton Station', coords: { latitude: -26.1974, longitude: 28.0567 } },
  { id: 4, name: 'Joburg Theatre Station', coords: { latitude: -26.1939, longitude: 28.0326 } },
  { id: 5, name: 'Library Gardens Station', coords: { latitude: -26.2044, longitude: 28.0444 } },
  { id: 6, name: 'Milpark Station', coords: { latitude: -26.1919, longitude: 28.0162 } },
  { id: 7, name: 'Constitution Hill Station', coords: { latitude: -26.1914, longitude: 28.0377 } },
  { id: 8, name: 'Boomtown Station', coords: { latitude: -26.2029, longitude: 28.0340 } },
  { id: 9, name: 'Indingiliza Int.', coords: { latitude: -26.2294, longitude: 27.9756 } },
  { id: 10, name: 'UJ Soweto', coords: { latitude: -26.2488, longitude: 27.8516 } },
  { id: 11, name: 'Chancellor House Station', coords: { latitude: -26.2044, longitude: 28.0406 } },
  { id: 12, name: 'Windsor West', coords: { latitude: -26.1318, longitude: 27.9944 } },
  { id: 13, name: 'Florida North', coords: { latitude: -26.1644, longitude: 27.9003 } },
  { id: 14, name: 'Naledi', coords: { latitude: -26.2816, longitude: 27.8443 } },
  { id: 15, name: 'Protea Glen', coords: { latitude: -26.2847, longitude: 27.8385 } },
  { id: 16, name: 'Protea Court', coords: { latitude: -26.2847, longitude: 27.8387 } },
  { id: 17, name: 'Lakeview Station', coords: { latitude: -26.2531, longitude: 27.8738 } },
  { id: 18, name: 'Jabavu', coords: { latitude: -26.2431, longitude: 27.8758 } },
  { id: 19, name: 'Mofolo', coords: { latitude: -26.2536, longitude: 27.8910 } },
  { id: 20, name: 'Eldorado Park', coords: { latitude: -26.2934, longitude: 27.8767 } },
  { id: 21, name: 'Industria West Station', coords: { latitude: -26.2048, longitude: 27.9814 } },
  { id: 22, name: 'Lea Glen', coords: { latitude: -26.1917, longitude: 27.9103 } },
  { id: 23, name: 'Amalgam', coords: { latitude: -26.2086, longitude: 28.0021 } },
  { id: 24, name: 'Helen Joseph Station', coords: { latitude: -26.1889, longitude: 28.0278 } },
  { id: 25, name: 'Greymont', coords: { latitude: -26.1379, longitude: 27.9977 } },
  { id: 26, name: 'Mapetla', coords: { latitude: -26.2574, longitude: 27.8584 } },
  { id: 27, name: 'Pimville', coords: { latitude: -26.2612, longitude: 27.8797 } },
  { id: 28, name: 'Bellevue East', coords: { latitude: -26.1841, longitude: 28.0577 } },
  { id: 29, name: 'Library Gardens Station', coords: { latitude: -26.2044, longitude: 28.0444 } },
];

const reaVayaBuses = [
  { id: 1, route: 'T1', destination: 'Ellis Park East Station', stationId: 1, arrivalTime: 'Arrival in 10 mins' },
  { id: 2, route: 'T1', destination: 'Thokoza Park Station', stationId: 2, arrivalTime: 'Arrival in 15 mins' },
  { id: 3, route: 'XT1', destination: 'Carlton Station', stationId: 1, arrivalTime: 'Arrival in 20 mins' },
  { id: 4, route: 'T2', destination: 'Joburg Theatre Station', stationId: 1, arrivalTime: 'Arrival in 5 mins' },
  { id: 5, route: 'T3', destination: 'Library Gardens Station', stationId: 1, arrivalTime: 'Arrival in 12 mins' },
  { id: 6, route: 'T3 Express', destination: 'Milpark Station', stationId: 1, arrivalTime: 'Arrival in 8 mins' },
  { id: 7, route: 'T2', destination: 'Constitution Hill Station', stationId: 1, arrivalTime: 'Arrival in 6 mins' },
  { id: 8, route: 'T3', destination: 'Milpark Station', stationId: 6, arrivalTime: 'Arrival in 18 mins' },
  { id: 9, route: 'XT1', destination: 'Boomtown Station', stationId: 8, arrivalTime: 'Arrival in 25 mins' },
  { id: 10, route: 'C1', destination: 'Ellis Park East Station', stationId: 9, arrivalTime: 'Arrival in 5 mins' },
  { id: 11, route: 'C2', destination: 'UJ Soweto', stationId: 9, arrivalTime: 'Arrival in 12 mins' },
  { id: 12, route: 'C3', destination: 'Chancellor House Station', stationId: 11, arrivalTime: 'Arrival in 8 mins' },
  { id: 13, route: 'C4', destination: 'Library Gardens Station', stationId: 12, arrivalTime: 'Arrival in 6 mins' },
  { id: 14, route: 'C5', destination: 'Florida North', stationId: 13, arrivalTime: 'Arrival in 18 mins' },
  { id: 15, route: 'F1', destination: 'Naledi', stationId: 14, arrivalTime: 'Arrival in 14 mins' },
  { id: 16, route: 'F2', destination: 'Protea Glen', stationId: 15, arrivalTime: 'Arrival in 19 mins' },
  { id: 17, route: 'F3', destination: 'Lakeview Station', stationId: 17, arrivalTime: 'Arrival in 22 mins' },
  { id: 18, route: 'F4', destination: 'Mofolo', stationId: 19, arrivalTime: 'Arrival in 30 mins' },
  { id: 19, route: 'F5', destination: 'Eldorado Park', stationId: 20, arrivalTime: 'Arrival in 7 mins' },
  { id: 20, route: 'F6', destination: 'Industria West Station', stationId: 21, arrivalTime: 'Arrival in 10 mins' },
  { id: 21, route: 'F7', destination: 'Lea Glen', stationId: 22, arrivalTime: 'Arrival in 5 mins' },
  { id: 22, route: 'F8', destination: 'Amalgam', stationId: 23, arrivalTime: 'Arrival in 12 mins' },
  { id: 23, route: 'F9', destination: 'Greymont', stationId: 25, arrivalTime: 'Arrival in 9 mins' },
  { id: 24, route: 'F10', destination: 'Mapetla', stationId: 26, arrivalTime: 'Arrival in 11 mins' },
  { id: 25, route: 'F11', destination: 'Pimville', stationId: 27, arrivalTime: 'Arrival in 13 mins' },
  { id: 26, route: 'F12', destination: 'Bellevue East', stationId: 28, arrivalTime: 'Arrival in 17 mins' },
];

const fares = {
  '0-5': 10,
  '5.1-10': 12.5,
  '10.1-15': 15,
  '15.1-25': 17,
  '25.1-35': 19,
  '35.1-45': 20,
  '45+': 26,
};

const BusesScreen = () => {
  const [origin, setOrigin] = useState(null);
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStation, setSelectedStation] = useState(null);
  const [busArrivals, setBusArrivals] = useState([]);

  useEffect(() => {
    const fetchCurrentLocation = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission denied', 'Allow location access to use this feature.');
          return;
        }
        const location = await Location.getCurrentPositionAsync({});
        setOrigin({ latitude: location.coords.latitude, longitude: location.coords.longitude });
      } catch (error) {
        Alert.alert('Error', 'Unable to fetch current location');
      }
    };

    fetchCurrentLocation();
  }, []);

  useEffect(() => {
    if (origin) {
      const sortedStations = reaVayaStations.map(station => ({
        ...station,
        distance: calculateDistance(origin, station.coords),
      })).sort((a, b) => a.distance - b.distance);

      setStations(sortedStations);
      setLoading(false);
    }
  }, [origin]);

  const calculateDistance = (origin, destination) => {
    const radlat1 = Math.PI * origin.latitude / 180;
    const radlat2 = Math.PI * destination.latitude / 180;
    const theta = origin.longitude - destination.longitude;
    const radtheta = Math.PI * theta / 180;
    let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist);
    dist = dist * 180 / Math.PI;
    dist = dist * 60 * 1.1515;
    dist = dist * 1.609344; // Convert miles to km
    return dist.toFixed(2);
  };

  const calculateFare = (distance) => {
    if (distance <= 5) return fares['0-5'];
    if (distance <= 10) return fares['5.1-10'];
    if (distance <= 15) return fares['10.1-15'];
    if (distance <= 25) return fares['15.1-25'];
    if (distance <= 35) return fares['25.1-35'];
    if (distance <= 45) return fares['35.1-45'];
    return fares['45+'];
  };

  const handleStationSelect = (station) => {
    setSelectedStation(station);
    const busesAtStation = reaVayaBuses.filter(bus => bus.stationId === station.id).map(bus => {
      const destinationStation = reaVayaStations.find(st => st.name === bus.destination);
      const distance = calculateDistance(station.coords, destinationStation.coords);
      return {
        ...bus,
        arrivalTime: Math.floor(Math.random() * 30) + 1, // Simulate arrival times between 1 to 30 mins
        cost: calculateFare(distance), // Calculate cost based on distance
      };
    });
    setBusArrivals(busesAtStation);
  };

  const openGPS = (station) => {
    const lat = station.coords.latitude;
    const lon = station.coords.longitude;
    const url = Platform.select({
      ios: `maps:0,0?q=${lat},${lon}`,
      android: `geo:0,0?q=${lat},${lon}`,
    });
    Linking.openURL(url);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.red} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: origin ? origin.latitude : -26.2618,
          longitude: origin ? origin.longitude : 27.8689,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {origin && (
          <Marker coordinate={origin} title="Your Location" />
        )}
        {stations.map(station => (
          <Marker
            key={station.id}
            coordinate={station.coords}
            title={station.name}
            onPress={() => handleStationSelect(station)}
          >
            <Image source={require('../assets/app_logo.png')} style={styles.stationIcon} />
          </Marker>
        ))}
      </MapView>
      {selectedStation && (
        <View style={styles.detailsContainer}>
          <Text style={styles.stationName}>{selectedStation.name}</Text>
          <Text style={styles.subtitle}>Buses arriving at this station:</Text>
          {busArrivals.map(bus => (
            <View key={bus.id} style={styles.busItem}>
              <Image source={require('../assets/bus_icon.png')} style={styles.busIcon} />
              <View style={styles.busDetails}>
                <Text style={styles.busRoute}>{bus.route}</Text>
                <Text style={styles.busText}>Destination: {bus.destination}</Text>
                <Text style={styles.busText}>Arrival in {bus.arrivalTime} mins</Text>
                <Text style={styles.busText}>Estimated Cost: R{bus.cost}</Text>
              </View>
            </View>
          ))}
          <TouchableOpacity style={styles.navigationButton} onPress={() => openGPS(selectedStation)}>
            <Text style={styles.navigationButtonText}>Navigate to station</Text>
          </TouchableOpacity>
        </View>
      )}
      <FlatList
        data={stations}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleStationSelect(item)} style={styles.stationItem}>
            <Image source={require('../assets/app_logo.png')} style={styles.stationIconSmall} />
            <View>
              <Text style={styles.stationText}>{item.name}</Text>
              <Text style={styles.stationTextSmall}>{item.distance} km away</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    width: '100%',
    height: '50%',
  },
  stationIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  stationIconSmall: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 10,
  },
  detailsContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#CCCCCC',
  },
  stationName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    marginVertical: 10,
  },
  busItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  busIcon: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  busDetails: {
    flex: 1,
  },
  busRoute: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FB0C06',
  },
  busText: {
    fontSize: 14,
    color: '#333333',
  },
  navigationButton: {
    backgroundColor: '#030D4F',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  navigationButtonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  stationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
  },
  stationText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  stationTextSmall: {
    fontSize: 14,
    color: '#666666',
  },
});

export default BusesScreen;
