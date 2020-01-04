import React, { Component, Fragment } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Picker
} from 'react-native';

import api from '../../services/api';
import star from '../../assets/star.png';
import { STATIC_API_KEY } from 'react-native-dotenv';
import AsyncStorage from '@react-native-community/async-storage';

import Base64 from '../Base64';

export default class Locations extends Component {
  constructor(props) {
    super(props);

    this.state = {
      locationId: props.navigation.getParam('locationId', 0),
      locationDetails: '',
      error: null,
      token: null,
      reviewText: null,
      rating: 5
    }

    this.handleReviewChange = this.handleReviewChange.bind(this);
    this.handleReviewPost = this.handleReviewPost.bind(this);
    this.handlePickerChange = this.handlePickerChange.bind(this);
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
    } else {
      this.setState({
        error: 'Missing parameter from navigation'
      })
    }

    this.setState({
      token: await AsyncStorage.getItem('loc8r-token')
    });
  }

  handleReviewChange(reviewText) {
    this.setState({
      reviewText
    });
  }

  async handleReviewPost() {
    console.log('Review Post Event');
    if (!this.state.reviewText) {
      this.setState({
        error: 'You should write a review first'
      });

      return;
    }

    const url = `/locations/${this.state.locationId}/reviews`;
    const token = await AsyncStorage.getItem('loc8r-token');
    const { name } = JSON.parse(Base64.atob(token.split('.')[1]));
    const review = {
      author: name,
      rating: this.state.rating,
      reviewText: this.state.reviewText
    };

    const { status } = await api.post(url, review, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (status === 201) {
      const response = await api.get(`/locations/${this.state.locationId}`);
      this.setState({
        locationDetails: response.data,
        reviewText: null
      });
    } else {
      this.setState({
        error: 'Could not add your review'
      });
    }
  }

  handlePickerChange(rating) {
    this.setState({
      rating
    });
  }

  render() {
    const { locationDetails } = this.state;

    return (
      <ScrollView style={styles.container} contentContainerStyle={locationDetails !== '' ? '' : { flexGrow: 1, justifyContent: 'center', alignItems: 'center' }} maintainVisibleContentPosition={true}>
        {
          locationDetails !== '' ? (
            <Fragment>
              <Text style={styles.locationName}>{locationDetails.name}</Text>
              <View style={{ flexDirection: 'row' }}>
                {Array.from({ length: locationDetails.rating }, (...args) => <Image key={args[1]} style={styles.starTop} source={star} />)}
              </View>
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
              <Image
                source={{ uri: `https://maps.googleapis.com/maps/api/staticmap?center=${locationDetails.coords.coordinates[1]},${locationDetails.coords.coordinates[0]}&zoom=16.3&size=350x350&sensor=false&markers=${locationDetails.coords.coordinates[1]},${locationDetails.coords.coordinates[0]}&key=${STATIC_API_KEY}&scale=4` }}
                style={{ height: 350, width: 350, marginTop: 10, borderRadius: 7 }}
              />
              <View style={styles.reviewBox}>
                <Text style={[styles.locationName, { fontSize: 25 }]}>Customer Reviews</Text>
                {
                  locationDetails.reviews.map((review, index) => {
                    return (
                      <View key={index} style={{ borderWidth: 1.5, borderColor: '#ddd', borderRadius: 5, marginBottom: 5 }}>
                        <Text style={[styles.text, { fontSize: 17, paddingLeft: 3 }]}>{review.author} {new Date(review.createdOn).toDateString()}</Text>
                        <View style={{ flexDirection: 'row', paddingLeft: 3, paddingBottom: 3, paddingTop: 3 }}>{Array.from({ length: review.rating }, (...args) => <Image key={args[1]} style={styles.starReview} source={star} />)}</View>
                        <Text style={[styles.text, { fontSize: 17, paddingLeft: 3, paddingBottom: 3 }]}>{review.reviewText}</Text>
                      </View>
                    )
                  })
                }
              </View>
              <View style={[styles.reviewBox, { marginBottom: 10 }]}>
                <Text style={[styles.locationName, { fontSize: 25, marginLeft: 5 }]}>Leave your review</Text>
                <Text style={styles.ratingTitle}>Rating:</Text>
                <View style={styles.ratingPicker}>
                  <Picker onValueChange={this.handlePickerChange} selectedValue={this.state.rating}>
                    <Picker.Item label='1' value={1} />
                    <Picker.Item label='2' value={2} />
                    <Picker.Item label='3' value={3} />
                    <Picker.Item label='4' value={4} />
                    <Picker.Item label='5' value={5} />
                  </Picker>
                </View>
                <TextInput
                  style={styles.reviewInput}
                  numberOfLines={10}
                  multiline={true}
                  placeholder='Type something'
                  placeholderTextColor='#ddd'
                  underlineColorAndroid='transparent'
                  value={this.state.reviewText}
                  onChangeText={this.handleReviewChange}
                />
                <TouchableOpacity style={styles.reviewButton} onPress={this.handleReviewPost}>
                  <Text style={styles.buttonText}>Submit review</Text>
                </TouchableOpacity>
              </View>
            </Fragment>
          ) : (
              <Text style={styles.text}>Getting locations details...</Text>
            )
        }
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#108a93',
    paddingLeft: 20,
    paddingBottom: 5
  },

  text: {
    fontWeight: 'bold',
    color: '#fff',
    fontSize: 20
  },

  locationName: {
    fontFamily: 'Lobster-Regular',
    fontSize: 45,
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
  },

  reviewInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 7,
    textAlignVertical: 'top',
    fontSize: 17,
    margin: 5
  },

  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 15
  },

  reviewButton: {
    height: 40,
    width: 140,
    backgroundColor: '#A92323',
    margin: 5,
    alignSelf: 'flex-end',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    borderRadius: 8
  },

  ratingPicker: {
    height: 50,
    width: 100,
    backgroundColor: '#fff',
    marginLeft: 5,
    borderRadius: 5
  },

  ratingTitle: {
    fontWeight: 'bold',
    fontSize: 15,
    marginLeft: 5,
    marginBottom: 4,
    color: '#fff'
  }
});
