/* eslint-disable prettier/prettier */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ImageBackground } from 'react-native';
// import CheckInOutButton from '../../components/CheckInOutButton'; 

const backgroundImg = require('../../assets/images/background.jpg');
const data = [
  { id: '1', type: 'Check-In', timestamp: '2023-05-30 08:00 AM', status: 'Completed' },
  { id: '2', type: 'Check-Out', timestamp: '2023-05-29 04:00 PM', status: 'Completed' },
  { id: '3', type: 'Check-In', timestamp: '2023-05-29 08:00 AM', status: 'Completed' },
  { id: '4', type: 'Check-Out', timestamp: '2023-05-28 04:00 PM', status: 'Completed' }
];

const HomeScreen = ({ navigation }) => {
  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      <Text style={styles.cardTitle}>{item.type}</Text>
      <Text style={styles.cardDescription}>{item.timestamp}</Text>
      <Text style={styles.status}>{item.status}</Text>
    </TouchableOpacity>
  );

  return (
    <ImageBackground source={backgroundImg} style={styles.background}>
      <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate('CheckInOut')} style={styles.button}>
  <Text style={styles.buttonText}>Clock In/Out</Text>
</TouchableOpacity>

        {/* <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Clock In/Out</Text>
        </TouchableOpacity> */}
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
        />
      </View>
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
    padding: 20,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  list: {
    flexGrow: 1,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardDescription: {
    fontSize: 14,
  },
  status: {
    fontSize: 12,
    color: 'green',
    marginTop: 5,
  },
});

export default HomeScreen;
