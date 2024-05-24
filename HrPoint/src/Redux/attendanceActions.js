/* eslint-disable prettier/prettier */
import Geolocation from '@react-native-community/geolocation';

export const recordAttendance = (hasLocationPermission) => {
  if (hasLocationPermission) {
    Geolocation.getCurrentPosition(
      (position) => {
        console.log(position);
        // Envoyer cette position au backend via une API
      },
      (error) => {
        console.error(error.code, error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  }
};
