import axios from 'axios';
import { decode } from '@mapbox/polyline';

const GOOGLE_API_KEY = 'AIzaSyANepOy-EY60mynMwuQLLwYnMk5_pCzwvE';

export const getDirections = async (origin, destination, mode) => {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&mode=${mode}&key=${GOOGLE_API_KEY}`
    );
    const data = response.data;
    if (data.status === 'OK') {
      const { routes } = data;
      const steps = routes[0].legs[0].steps.map(step => step.html_instructions.replace(/<[^>]*>?/gm, ''));
      return {
        points: routes[0].overview_polyline.points,
        duration: routes[0].legs[0].duration.text,
        steps,
      };
    } else {
      throw new Error('No routes found');
    }
  } catch (error) {
    throw error;
  }
};

export const geocodeAddress = async (address) => {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${GOOGLE_API_KEY}`
    );
    const data = response.data;
    if (data.status === 'OK') {
      const { location } = data.results[0].geometry;
      return {
        latitude: location.lat,
        longitude: location.lng,
      };
    } else {
      throw new Error('No location found');
    }
  } catch (error) {
    throw error;
  }
};

export const getPlaceSuggestions = async (input) => {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&key=${GOOGLE_API_KEY}`
    );
    const data = response.data;
    if (data.status === 'OK') {
      return data.predictions;
    } else {
      throw new Error('No suggestions found');
    }
  } catch (error) {
    throw error;
  }
};
