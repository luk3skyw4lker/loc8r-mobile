import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';

import api from '../../services/api';

export default class Locations extends Component {
  constructor(props) {
    super(props);

    this.state = {
      locationId: props.navigation.getParam('locationId', 0),
      locationDetails: '',
      error: null
    }
  }

  async componentDidMount() {
    if (this.state.locationId !== 0) {
      const { data, status } = await api.get(`/locations/${this.state.locationId}`);

      if (status === 200) {
        this.setState({
          locationDetails: data
        });
      } else {
        this.setState({
          error: 'Could not get location details'
        });
      }
    }
  }

  render() {
    const { locationId, locationDetails } = this.state;

    return (
      <View style={styles.container}>
        <Text style={styles.text}>LocationId: {locationId}</Text>
        <Text style={styles.text}>LocationDetails: {JSON.stringify(locationDetails)}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#108a93',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30
  },

  text: {
    fontWeight: 'bold',
    color: '#fff'
  }
})
