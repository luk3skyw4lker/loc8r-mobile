import React, { Component, Fragment } from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';

import api from '../../services/api';
import star from '../../assets/star.png';
import { STATIC_API_KEY } from 'react-native-dotenv';

export default class Locations extends Component {
  constructor(props) {
    super(props);

    this.state = {
      locationId: props.navigation.getParam('locationId', 0),
      locationDetails: '',
      error: null
    };
  }

  async componentDidMount() {
    if (this.state.locationId !== 0) {
      const { data, status } = await api.get(
        `/locations/${this.state.locationId}`
      );

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

    return (
      <View
        style={
          locationDetails !== ''
            ? styles.container
            : [
                styles.container,
                { justifyContent: 'center', alignItems: 'center' }
              ]
        }>
        {locationDetails !== '' ? (
          <Fragment>
            <Text style={styles.locationName}>{locationDetails.name}</Text>
            <View style={{ flexDirection: 'row' }}>
              {Array.from({ length: locationDetails.rating }, (...args) => (
                <Image key={args[1]} style={styles.starTop} source={star} />
              ))}
            </View>
            <View style={{ flexDirection: 'row' }}>
              {locationDetails.facilities.map((facility, index) => {
                return (
                  <View style={styles.facilityBox} key={index}>
                    <Text style={styles.facilityText}>
                      {index === 0 ? facility : facility.substr(1)}
                    </Text>
                  </View>
                );
              })}
            </View>
            <Image
              source={{
                uri: `https://maps.googleapis.com/maps/api/staticmap?center=${
                  locationDetails.coords.coordinates[1]
                },${
                  locationDetails.coords.coordinates[0]
                }&zoom=17&size=350x350&sensor=false&markers=${
                  locationDetails.coords.coordinates[1]
                },${
                  locationDetails.coords.coordinates[0]
                }&key${STATIC_API_KEY}=&scale=2`
              }}
              style={{
                height: 350,
                width: 350,
                marginTop: 10,
                borderRadius: 5
              }}
            />
            <View style={styles.reviewBox}>
              <Text style={[styles.locationName, { fontSize: 25 }]}>
                Customer Reviews
              </Text>
              {locationDetails.reviews.map((review, index) => {
                return (
                  <View
                    key={index}
                    style={{
                      borderWidth: 1.5,
                      borderColor: '#ddd',
                      borderRadius: 5
                    }}>
                    <Text
                      style={[styles.text, { fontSize: 17, paddingLeft: 3 }]}>
                      {review.author}{' '}
                      {new Date(review.createdOn).toDateString()}
                    </Text>
                    <View style={{ flexDirection: 'row', paddingLeft: 3 }}>
                      {Array.from({ length: review.rating }, (...args) => (
                        <Image
                          key={args[1]}
                          style={styles.starReview}
                          source={star}
                        />
                      ))}
                    </View>
                    <Text
                      style={[styles.text, { fontSize: 17, paddingLeft: 3 }]}>
                      {review.reviewText}
                    </Text>
                  </View>
                );
              })}
            </View>
          </Fragment>
        ) : (
          <Text style={styles.text}>Getting locations details...</Text>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#108a93',
    padding: 20,
    paddingTop: 5
  },

  text: {
    fontWeight: 'bold',
    color: '#fff',
    fontSize: 20
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
    fontSize: 10
  },

  reviewBox: {
    borderColor: '#222',
    borderWidth: 2,
    borderRadius: 5,
    backgroundColor: '#469ea8',
    padding: 5,
    marginTop: 15,
    width: 350
  },

  starReview: {
    width: 15,
    height: 15,
    marginRight: 3.5
  },

  starTop: {
    width: 25,
    height: 25,
    marginRight: 3.5,
    marginBottom: 5,
    marginTop: 5
  }
});
