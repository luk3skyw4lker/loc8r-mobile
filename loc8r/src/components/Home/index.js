import React, { Component } from 'react';
import { View, StyleSheet, Text, TouchableNativeFeedback } from 'react-native';
import Geolocation from '@react-native-community/geolocation';

import api from '../../services/api';

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      region: '',
      locations: [],
      error: null,
      locationId: ''
    };

    this.handlePress = this.handlePress.bind(this);
  }

  async componentDidMount() {
    Geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        console.log('Success!');
        this.setState({
          region: {
            lat: latitude,
            lng: longitude
          }
        }, getLocations);
      },
      (err) => {
        console.log(err);
        this.setState({
          error: 'Could not get location info, clean the application data and open the app again'
        });
      },
      {
        timeout: 10000,
        maximumAge: 1000,
        enableHighAccuracy: true
      }
    );

    const getLocations = async () => {
      const url = `/locations?lng=${this.state.region.lng}&lat=${this.state.region.lat}&maxDistance=20`;

      const response = await api.get(url);

      this.setState({
        locations: response.data
      });
    }
  }

  handlePress(locationId) {
    const { navigation } = this.props;

    this.setState({
      locationId
    }, () => navigation.navigate('Locations', { locationId: this.state.locationId }));
  }

  render() {
    const { locations, error } = this.state;

    return (
      <View style={locations.length > 0 ? styles.container : [styles.container, { justifyContent: 'center' }]}>
        {
          error !== null ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : (
              locations.length > 0 ? (
                locations.map((location) => {
                  console.log(location.facilities);
                  return (
                    <TouchableNativeFeedback onPress={() => this.handlePress(location.id)}>
                      <View key={location.id} style={styles.locationBox}>
                        <Text style={styles.locationName}>{location.name}</Text>
                        <Text style={[styles.locationName, { fontSize: 15 }]}>{location.address}</Text>
                        {
                          location.facilities.map((facility, index) => {
                            return (
                              <View style={styles.facilityBox}>
                                <Text style={[styles.locationName, { fontSize: 10 }]}>{index === 0 ? ` ${facility}` : facility}</Text>
                              </View>
                            )
                          })
                        }
                      </View>
                    </TouchableNativeFeedback>
                  )
                })
              ) : (
                  <Text style={styles.buttonText}>Getting locations...</Text>
                )
            )
        }
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
    height: 110,
    borderColor: '#fff',
    borderRadius: 5,
    borderWidth: 3,
    marginBottom: 5
  },

  locationName: {
    textAlign: 'left',
    fontWeight: 'bold',
    fontSize: 25,
    color: '#fff'
  },

  facilityBox: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start'
  }
});
