import React from 'react';
import { Image, View } from 'react-native';

import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import Login from '../components/Login';
import Home from '../components/Home';
import Locations from '../components/Locations';

import logo from '../assets/Loc8r.png';

const HomeApp = createStackNavigator({
  Home,
  Locations
}, {
  initialRouteName: 'Home',
  defaultNavigationOptions: {
    headerStyle: {
      backgroundColor: '#A92323'
    },
    headerTitle: (
      <Image source={logo} style={{ width: 55, height: 25, alignSelf: 'center' }} />
    )
  },
  headerLayoutPreset: 'center'
});

export default createAppContainer(
  createSwitchNavigator({
    Login,
    HomeApp
  }, {
    initialRouteName: 'Login'
  })
);