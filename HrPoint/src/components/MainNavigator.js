/* eslint-disable prettier/prettier */
// MainNavigator.js
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import MenuModal from './MenuModal';
import HomeScreen from '../screen/HomeScreen/HomeScreen';
import CheckInOutScreen from '../screen/CheckInOutScreen';
import ConsultHistoryScreen from '../screen/ConsultHistoryScreen';
import HolidaysScreen from '../screen/HolidaysScreen';

const Drawer = createDrawerNavigator();

const MainNavigator = () => {
  return (
    <Drawer.Navigator drawerContent={(props) => <MenuModal {...props} />}>
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="CheckInOut" component={CheckInOutScreen} />
      <Drawer.Screen name="ConsultHistory" component={ConsultHistoryScreen} />
      <Drawer.Screen name="Holidays" component={HolidaysScreen} />
    </Drawer.Navigator>
  );
};

export default MainNavigator;
