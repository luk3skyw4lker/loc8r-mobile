import React from 'react';
import { Image } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Login from '../components/Login';
import Home from '../components/Home';
import Locations from '../components/Locations';

import logo from '../assets/Loc8r.png';

const Stack = createStackNavigator();

const StackNavigator = () => {
	return (
		<Stack.Navigator
			screenOptions={{
				headerStyle: {
					backgroundColor: '#A92323'
				},
				headerTitle: () => (
					<Image
						source={logo}
						style={{ width: 55, height: 25, alignSelf: 'center' }}
					/>
				),
				headerTitleAlign: 'center'
			}}
		>
			<Stack.Screen
				options={{ headerShown: false }}
				name="Login"
				component={Login}
			/>
			<Stack.Screen name="Home" component={Home} />
			<Stack.Screen name="Locations" component={Locations} />
		</Stack.Navigator>
	);
};

const Routes = () => {
	return (
		<NavigationContainer>
			<StackNavigator />
		</NavigationContainer>
	);
};

export default Routes;
