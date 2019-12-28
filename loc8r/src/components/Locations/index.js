import React, { Component, Fragment } from 'react';
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
    const { locationDetails } = this.state;

    console.log(locationDetails);

    return (
      <View style={locationDetails !== '' ? styles.container : [styles.container, { justifyContent: 'center' }]}>
        {
          locationDetails !== '' ? (
            <Fragment>
              <Text style={styles.locationName}>{locationDetails.name}</Text>
              {/* // TODO: Implement star icons later */}
              <Text style={[styles.locationName, { fontSize: 20 }]}>STARS GOES HERE: {locationDetails.rating}</Text>
              <View style={{ flexDirection: 'row' }}>
                {
                  locationDetails.facilities.map((facility, index) => {
                    return (
                      <View style={styles.facilityBox} key={index}>
                        <Text style={styles.facilityText}>{index === 0 ? facility : facility.substr(1)}</Text>
                      </View>
                    )
                  })
                }
              </View>
              <Text style={[styles.locationName, { fontSize: 35 }]}>MAPS GOES HERE</Text>
            </Fragment>
          ) : (
              <Text style={styles.text}>Getting locations details...</Text>
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
    padding: 30
  },

  text: {
    fontWeight: 'bold',
    color: '#fff'
  },

  locationName: {
    fontSize: 45,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'left'
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
    fontSize: 10,
  }
})
