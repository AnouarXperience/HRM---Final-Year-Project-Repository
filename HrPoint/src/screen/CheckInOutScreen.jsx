/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, PermissionsAndroid, ImageBackground } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import CustomAlert from '../components/CustomAlert'; // Ensure this is the correct path
import LoaderScreen from '../components/LoaderScreen';

const backgroundImg = require('../assets/images/background.jpg'); // Ensure this path is correct

const CheckInCheckOutScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [showCustomAlert, setShowCustomAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertButtons, setAlertButtons] = useState([]);

  const handleLocationAction = async (actionType) => {
    setLoading(true); // Show loader
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'This app needs access to your location to record attendance.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        setAlertMessage('You need to enable location permissions to perform this action.');
        setAlertButtons([{ text: 'OK', onPress: () => setShowCustomAlert(false) }]);
        setShowCustomAlert(true);
        setLoading(false); // Hide loader
        return;
      }
      Geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          console.log(`Location: ${latitude}, ${longitude}`); // Log location for verification
          if (actionType === 'Check In') {
            setAlertMessage('Thanks for using our service. Have a nice day at work!');
          } else {
            setAlertMessage('See you tomorrow. Have a great evening!');
          }
          setAlertButtons([{ text: 'OK', onPress: () => setShowCustomAlert(false) }]);
          setShowCustomAlert(true);
          setLoading(false); // Hide loader
        },
        error => {
          setLoading(false); // Hide loader
          setAlertMessage(`Location Error: ${error.message}`);
          setAlertButtons([{ text: 'OK', onPress: () => setShowCustomAlert(false) }]);
          setShowCustomAlert(true);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 1000 }
      );
    } catch (err) {
      setLoading(false); // Hide loader
      setAlertMessage(`Location Permission Error: ${err.message}`);
      setAlertButtons([{ text: 'OK', onPress: () => setShowCustomAlert(false) }]);
      setShowCustomAlert(true);
    }
  };

  return (
    <ImageBackground source={backgroundImg} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.text}>Check In or Check Out</Text>
        <View style={styles.buttonContainer}>
          <Button
            title="Check In"
            onPress={() => handleLocationAction('Check In')}
            color="green"
          />
          <Button
            title="Check Out"
            onPress={() => handleLocationAction('Check Out')}
            color="red"
          />
        </View>
        <CustomAlert
          isVisible={showCustomAlert}
          message={alertMessage}
          buttons={alertButtons}
          onClose={() => setShowCustomAlert(false)}
        />
      </View>
      {loading && (
        <View style={styles.loaderContainer}>
          <LoaderScreen />
        </View>
      )}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 24,
    marginBottom: 20,
    color: '#fff', // Change text color to make it stand out
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginVertical: 20,
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Add a semi-transparent background
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CheckInCheckOutScreen;
