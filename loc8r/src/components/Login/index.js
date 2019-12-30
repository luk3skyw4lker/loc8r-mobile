import React, { Component } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
  Image,
  View
} from 'react-native';

import api from '../../services/api';
import logo from '../../assets/Loc8r.png';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: null,
      password: null,
      error: null
    };

    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
  }

  handlePasswordChange(passwordInput) {
    this.setState({
      password: passwordInput
    });
  }

  handleEmailChange(emailInput) {
    this.setState({
      email: emailInput
    });
  }

  async handleLogin() {
    if (!this.state.email || !this.state.password) {
      this.setState({
        error: 'All fields are required'
      });

      return;
    }

    const { navigation } = this.props;
    const response = await api.post('/login', { email: this.state.email, password: this.state.password });

    const { status } = response;

    if (status === 200) {
      navigation.navigate('Home');
    } else if (status === 404) {
      this.setState({
        error: 'User doesn\'t exists'
      });
    } else {
      this.setState({
        error: 'Unknown error'
      })
    }
  }

  render() {
    return (
      <KeyboardAvoidingView
        enabled={
          Platform.OS === 'ios'
        }
        behavior='padding'
        style={styles.container}
      >

        <Image source={logo} style={styles.image} />
        {
          this.state.error !== null &&
          <View style={styles.error}>
            <Text style={styles.errorText}>
              {this.state.error}
            </Text>
          </View>
        }

        <TextInput
          name="email"
          style={styles.input}
          autoCorrect={false}
          autoCapitalize='none'
          placeholder="Digite seu email"
          placeholderTextColor="#999"
          onChangeText={this.handleEmailChange}
          value={this.state.email}
        />

        <TextInput
          name="password"
          style={[styles.input, { marginTop: 5 }]}
          autoCorrect={false}
          autoCapitalize='none'
          placeholder="Digite sua senha"
          placeholderTextColor="#999"
          onChangeText={this.handlePasswordChange}
          value={this.state.password}
          secureTextEntry={true}
        />

        <TouchableOpacity
          onPress={this.handleLogin}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#108a93',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    paddingTop: 0
  },

  input: {
    height: 46,
    alignSelf: 'stretch',
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#000',
    borderRadius: 5,
    marginTop: 25,
    paddingHorizontal: 15,
    elevation: 5
  },

  button: {
    height: 46,
    width: 180,
    backgroundColor: '#A92323',
    borderRadius: 25,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5
  },

  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16
  },

  image: {
    alignSelf: 'center',
    width: 200,
    height: 100,
    marginBottom: 100,
    marginTop: -20
  },

  errorText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16
  },

  error: {
    height: 46,
    alignSelf: 'stretch',
    backgroundColor: '#A92323',
    borderRadius: 4,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
