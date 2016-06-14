/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableHighlight,
  Navigator,
  Alert
} from 'react-native';

import GroupsComponent from './GroupsComponent'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import {login} from 'common/webServices/login';
import * as actionCreators from 'common/actions';
import * as loginactionCreators from 'common/webServices';
import synerzipLogo from '../resources/logo.png';
import backGroundImage from '../resources/nice.png';
import {serverUrl} from 'common/constants/loginConstants.js'
const {SERVER_URL}=serverUrl;
var Dimensions = require('Dimensions');
var width = Dimensions.get('window').width
var height = Dimensions.get('window').height


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  bg: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: width,
        height:height
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
    backgroundColor: '#EEB211',
    borderColor: '#EEB211',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    justifyContent: 'center'
  },
  buttonText: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    color: 'white'
  },
  image: {
  width: 246,
  height: 26,
  }
});

var pused = false
class LoginView extends Component { 

  constructor(props) {
      super(props);
      console.log('in constructor');
      this.state = {
      uName: '',
      pWord: '',
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
        this.props.navigator.push ({
          title: 'Groups',
          component: GroupsComponent,
          passProps: {
            userName: this.state.uName,
            password: this.state.pWord
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
          'Login failed, please try with valid credential.',
          [
            {text: 'OK', onPress: () => console.log('OK Pressed!')},
          ]
        )
      );
    }
  }

  successCB(resJson){
    console.log("In successCB");
    console.log(resJson);
  }

  onLogin() {
    console.log('in onLogin');
      pused = false
      this.props.loginactions.login(this.state.uName,this.state.pWord, this.successCB);
  }


 render() {
    return (
      <View style={styles.container}>
       <Image style={styles.bg}  source={backGroundImage} />
      <Image
        style={styles.image}
        source={synerzipLogo}
       
      />
      <TextInput style={styles.textEditInputs}
      onChangeText={(uName) => this.setState({uName})} 
        
        />
        <TextInput style={styles.textEditInputs}
        onChangeText={(pWord) => this.setState({pWord})} 
        secureTextEntry={true}           
        />
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

export default connect(mapStateToProps, mapDispatchToProps)(LoginView);


