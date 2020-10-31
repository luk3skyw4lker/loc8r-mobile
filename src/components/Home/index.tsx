import React, { Component } from 'react';
import { View, StyleSheet, Text, TouchableNativeFeedback } from 'react-native';
import Location from 'expo-location';
import Permissions from 'expo-permissions';

import api from '../../services/api';

interface Region {
	lat: number;
	lng: number;
}

interface HomeState {
	region: Region | any;
	locations: any[];
	error: string;
}

export default class Home extends Component<any, HomeState> {
	constructor(props: any) {
		super(props);
		this.state = {
			region: {},
			locations: [],
			error: ''
		};

		this.handlePress = this.handlePress.bind(this);
	}

	async componentDidMount() {
		const { status: actual } = await Location.requestPermissionsAsync();

		if (actual !== 'granted') {
			const { status } = await Permissions.askAsync(Permissions.LOCATION);

			if (status !== 'granted') {
				console.log('Location permission not allowed');
			}
		}

		const location = await Location.getCurrentPositionAsync({});

		console.log(location);

		const getLocations = async (region: Region) => {
			const url = `/locations?lng=${region.lng}&lat=${region.lat}&maxDistance=20`;

			const response = await api.get(url);

			this.setState({
				locations: response.data
			});
		};
	}

	handlePress(locationId: number) {
		const { navigation } = this.props;

		navigation.navigate('Locations', { locationId });
	}

	render() {
		const { locations, error } = this.state;

		return (
			<View
				style={
					locations.length > 0
						? styles.container
						: [styles.container, { justifyContent: 'center' }]
				}
			>
				{error !== null ? (
					<Text style={styles.errorText}>{error}</Text>
				) : locations.length > 0 ? (
					locations.map(location => {
						return (
							<TouchableNativeFeedback
								key={location.id}
								onPress={() => this.handlePress(location.id)}
							>
								<View style={styles.locationBox}>
									<Text style={styles.locationName}>{location.name}</Text>
									<Text style={[styles.locationName, { fontSize: 15 }]}>
										{location.address}
									</Text>
									<View style={{ flexDirection: 'row' }}>
										{location.facilities.map(
											(facility: string, index: number) => {
												return (
													<View style={styles.facilityBox} key={index}>
														<Text style={styles.facilityText}>
															{index === 0 ? facility : facility.substr(1)}
														</Text>
													</View>
												);
											}
										)}
									</View>
								</View>
							</TouchableNativeFeedback>
						);
					})
				) : (
					<Text style={styles.buttonText}>Getting locations...</Text>
				)}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#108a93',
		alignItems: 'center',
		padding: 15
	},

	button: {
		margin: 20,
		height: 46,
		alignSelf: 'stretch',
		backgroundColor: '#A92323',
		borderRadius: 4,
		marginTop: 10,
		justifyContent: 'center',
		alignItems: 'center'
	},

	buttonText: {
		color: '#fff',
		fontWeight: 'bold',
		fontSize: 14,
		alignSelf: 'center'
	},

	errorText: {
		color: '#FFF',
		fontWeight: 'bold',
		fontSize: 16,
		textAlign: 'center'
	},

	error: {
		height: 46,
		alignSelf: 'stretch',
		backgroundColor: '#A92323',
		borderRadius: 4,
		marginTop: 10,
		justifyContent: 'center',
		alignItems: 'center',
		textAlign: 'left'
	},

	locationBox: {
		padding: 5,
		width: 350,
		height: 105,
		borderColor: '#fff',
		borderRadius: 5,
		borderWidth: 2,
		marginBottom: 8,
		backgroundColor: '#469ea8',
		elevation: 8
	},

	locationName: {
		textAlign: 'left',
		fontWeight: 'bold',
		fontSize: 25,
		color: '#fff',
		marginBottom: 3
	},

	facilityBox: {
		flexDirection: 'row',
		backgroundColor: '#ffc107',
		padding: 4,
		marginRight: 5,
		marginTop: 5,
		borderRadius: 5
	},

	facilityText: {
		color: '#000',
		fontWeight: 'bold',
		fontSize: 10
	}
});
