/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Image,
  Text,
  View,
  TextInput,
  TouchableHighlight,
  NavigatorIOS,
  Alert
} from 'react-native';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import {login} from 'common/webServices/login';
import * as actionCreators from 'common/actions';
import * as loginactionCreators from 'common/webServices';
import synerzipLogo from '../resources/synerzipLogo.png';
import Groups from './Groups'
import {serverUrl} from 'common/constants/loginConstants.js'
const {SERVER_URL}=serverUrl;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  textEditInputs: {
    height: 40,
    marginRight: 15,
    marginLeft: 15,
    marginTop: 10,
    fontSize: 18,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    color: 'black',
    },
  button: {
    height: 40,
    marginTop: 10,
    backgroundColor: '#F8CA1E',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    justifyContent: 'center'
  },
  buttonText: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    color: 'black'
  },
  image: {
  width: 300,
  height: 50
  }
});

var pused = false
class Login extends Component {

  constructor(props) {
      super(props);
      console.log('in constructor');
      this.state = {
        userName: 'synerzip1',
        password: 'password1'
      };
     }

  componentWillReceiveProps(nextProps) {

  if(nextProps.isAuthenticating === true) {
      //  console.log("isAuthenticating...");
    } else if(nextProps.isAuthenticated === true) {
      console.log("message " + nextProps.message);
      console.log('isAuthenticated ' + nextProps.isAuthenticated);
      console.log('isAuthenticating ' + nextProps.isAuthenticating);
      if (pused == false) {
        pused = true
        let userName = this.state.userName
        let password = this.state.password
        this.props.navigator.push ({
          title: 'Groups',
          component: Groups,
          passProps: {
            userName: userName,
            password: password
          }
        });
      }
    }
    else if(nextProps.isAuthenticated === false ) {
      console.log("nextProps fails");
      // Show alert for failuer
      return (
        Alert.alert(
          'Alert Title',
          'Login failed, please try with valid credentials.',
          [
            {text: 'OK', onPress: () => console.log('OK Pressed!')},
          ]
        )
      );
    }
  }

  successCB(resJson){
    console.log(" in successCB");
    console.log(resJson);

// this is future enhancement....need to take care by login method
// Update login username and password on sucess
// if not error
    this.setState({
      userName: userNameFromResoponse,
      password: passwordFromResoponse
    });
  }

  onLogin() {
    console.log('in onLogin');
      pused = false
      let userName = 'synerzip1';
      let password = 'password1';
      let url = "http://" + userName +':' + password + SERVER_URL;
      this.props.loginactions.login('synerzip1','password1', this.successCB);
  }

  render() {
    return (
      <View style={styles.container}>
      <Image
        style={styles.image}
        source={synerzipLogo}
      />
      <TextInput style={styles.textEditInputs}
        placeholder='User name'
        value = 'a'/>
        <TextInput style={styles.textEditInputs}
          placeholder='Password'
          value = 'a'/>
        <TouchableHighlight style={styles.button}
        underlayColor='#F5FCFF'
        onPress={this.onLogin.bind(this)}>
        <Text style={styles.buttonText}>Login</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticating   : state.login.isAuthenticating,
  isAuthenticated    : state.login.isAuthenticated,
  statusText         : state.login.message
});

const mapDispatchToProps = (dispatch) => ({
  actions : bindActionCreators(actionCreators, dispatch),
  loginactions : bindActionCreators(loginactionCreators, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
