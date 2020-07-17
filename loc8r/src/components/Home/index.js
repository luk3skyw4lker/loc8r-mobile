import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  PermissionsAndroid
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';

import api from '../../services/api';

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      region: '',
      locations: [],
      error: null
    };

    this.handlePress = this.handlePress.bind(this);
  }

  async componentDidMount() {
    const askGeolocation = () => {
      Geolocation.getCurrentPosition(
        ({ coords: { latitude, longitude } }) => {
          this.setState(
            {
              region: {
                lat: latitude,
                lng: longitude
              }
            },
            getLocations
          );
        },
        err => {
          console.log(err);
          this.setState({
            error:
              'Could not get location info, clean the application data and open the app again'
          });
        },
        {
          timeout: 5000,
          enableHighAccuracy: true
        }
      );
    };

    const hasCoarse = await PermissionsAndroid.check(
      'android.permission.ACCESS_COARSE_LOCATION'
    );
    const hasFine = await PermissionsAndroid.check(
      'android.permission.ACCESS_FINE_LOCATION'
    );

    if (hasCoarse && hasFine) {
      askGeolocation();
    } else {
      const coarse = await PermissionsAndroid.request(
        'android.permifssion.ACCESS_COARSE_LOCATION'
      );
      const fine = await PermissionsAndroid.request(
        'android.permission.ACCESS_FINE_LOCATION'
      );

      if (coarse && fine) {
        askGeolocation();
      } else {
        this.setState({
          error:
            'Could not get location info, the app must have all permissions'
        });
      }
    }

    const getLocations = async () => {
      const url = `/locations?lng=${this.state.region.lng}&lat=${
        this.state.region.lat
      }&maxDistance=20`;

      const response = await api.get(url);

      this.setState({
        locations: response.data
      });
    };
  }

  handlePress(locationId) {
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
        }>
        {error !== null ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : locations.length > 0 ? (
          locations.map(location => {
            return (
              <TouchableNativeFeedback
                key={location.id}
                onPress={() => this.handlePress(location.id)}>
                <View style={styles.locationBox}>
                  <Text style={styles.locationName}>{location.name}</Text>
                  <Text style={[styles.locationName, { fontSize: 15 }]}>
                    {location.address}
                  </Text>
                  <View style={{ flexDirection: 'row' }}>
                    {location.facilities.map((facility, index) => {
                      return (
                        <View style={styles.facilityBox} key={index}>
                          <Text style={styles.facilityText}>
                            {index === 0 ? facility : facility.substr(1)}
                          </Text>
                        </View>
                      );
                    })}
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
