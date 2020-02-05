import React, { Component } from 'react'
import * as RNLocalize from "react-native-localize"

import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Text,
  TextInput,
  Dimensions,
  SafeAreaView,
} from 'react-native'
import {validateEmail, validatePasword} from '../Validations/Validation'
import Icon from 'react-native-vector-icons/FontAwesome'
import {registerCustomer, loginCustomer} from '../server/myServices'
import {saveCustomerToStorage} from '../helpers/Helpers'
import {translate} from '../languages/languageConfigurations'
import MultiLanguageComponent from './MultiLanguageComponent'
export default class LoginAndSignup extends MultiLanguageComponent {
  static navigationOptions = {
    headerShown: false,    
  }
  state = {
    isLogin: true,
    name: '',
    facebookId: '', 
    userType: "default", 
    avatar: '', 
    phoneNumber: '',
    email: 'hoang1@gmail.com',
    password: '12345',
    retypePassword: '123456'
  }  
  _loginOrRegister = async () => {
    try {
      const {navigate} = this.props.navigation  
      const { name, email, password,retypePassword, isLogin} = await this.state      
      if (!validateEmail(email) || !validatePasword(password)) {
        alert(translate("Email and password is invalid format"))
        return
      }      
      if (isLogin != true) {
        if (retypePassword != password) {          
          alert(translate('Password and retype password does not match'))
          return
        }
      }      
      const { tokenKey, customerId, message } = isLogin == true ? await loginCustomer(email, password) :
                                                                  await registerCustomer(name, email, password)      
      if (tokenKey.length > 0) {
        debugger
        await saveCustomerToStorage(tokenKey, customerId, email)
        navigate('Service') //success
      } else {
        alert(message)
      }
    } catch (error) {
      alert(translate("Error login or register Customer. Error = ")+error)
    }
  }

  render() {
    const { navigate } = this.props.navigation;
    const { email, password, isLogin } = this.state;
    return (
      <SafeAreaView style={styles.container}>        
        <Image style={styles.logo} source={require('../images/cat.jpeg')} />
        <Icon.Button
          style={styles.facebookButton}
          name="facebook"
          backgroundColor="#3b5998"
          borderRadius={30}
          onPress={() => {
            navigate('Service');
          }}
        >
          <Text
            style={{
              fontSize: 18,
              color: 'white',
              fontFamily: Platform.OS === 'ios'
                ? 'arial'
                : 'JosefinSans-Italic',
            }}
          >
            Login with Facebook
          </Text>

        </Icon.Button>
        <View style={styles.viewLoginRegister}>
          <View style={styles.viewLogin}>
            <TouchableOpacity onPress={() => {
              this.setState({ isLogin: true });
            }}>

              <Text style={styles.twoButton}>
                Sign in
              </Text>
            </TouchableOpacity>
            {isLogin === true && <View style={styles.line} />}
          </View>
          <View style={styles.viewLogin}>
            <TouchableOpacity onPress={() => {
              this.setState({ isLogin: false });
            }}>
              <Text style={styles.twoButton}>
                Sign up
              </Text>
            </TouchableOpacity>
            {isLogin === false && <View style={styles.line} />}
          </View>
        </View>
        <View style={styles.viewInput}>
          <TextInput
            style={styles.textInput}
            onChangeText={email => {
              this.setState({ email: email.trim() });
            }}
            value={email}
            keyboardType={'email-address'}
            placeholder={'Email:'}
          />
          <TextInput
            style={styles.textInput}
            onChangeText={password => {
              this.setState({ password });
            }}
            value={password}
            keyboardType={'default'}
            secureTextEntry
            placeholder={'Password:'}
          />
          {isLogin === false &&
            <TextInput
              style={styles.textInput}
              onChangeText={retypePassword => {
                this.setState({ retypePassword });
              }}
              value={this.state.retypePassword}
              keyboardType={'default'}
              secureTextEntry
              placeholder={'Retype password:'}
            />}
        </View>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => {
            this._loginOrRegister()
          }}
        >
          <Text
            style={{
              textAlign: 'center',
              color: 'white',
              fontSize: 20,
              fontFamily: Platform.OS === 'ios'
                ? 'arial'
                : 'JosefinSans-Bold',
            }}
          >
            {isLogin === true ? 'Sign-in' : 'Sign-up'}
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}
const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: '10%',
  },
  logo: {
    margin: 20,
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  facebookButton: {
    height: 50,
    width: 0.9 * screenWidth,
    backgroundColor: '#3b5998',
    color: 'white',
    textAlign: 'center',
    lineHeight: 40,
    paddingHorizontal: 15,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewLoginRegister: {
    height: 50,
    alignSelf: 'stretch',
    marginHorizontal: 30,
    flexDirection: 'row',
  },
  viewLogin: {
    height: 50,
    width: '50%',
    flexDirection: 'column',
  },
  line: {
    height: 2,
    width: '100%',
    backgroundColor: 'black',
  },
  twoButton: {
    height: '100%',
    fontSize: 25,
    textAlign: 'center',
    paddingTop: 13,
    fontFamily: Platform.OS === 'ios' ? 'arial' : 'JosefinSans-Italic',
  },
  viewInput: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    width: '100%',
  },
  textInput: {
    height: 50,
    marginTop: 20,
    width: '90%',
    borderColor: '#d3d3d3',
    borderWidth: 1,
    alignSelf: 'center',
    borderRadius: 6,
    paddingHorizontal: 10,
    backgroundColor: '#ffffff',
    borderRadius: 25,
    fontSize: 18,
    paddingStart: 15,
    fontFamily: Platform.OS === 'ios' ? 'arial' : 'JosefinSans-Italic',
  },
  loginButton: {
    height: 50,
    marginTop: 20,
    width: '90%',
    alignSelf: 'center',
    borderRadius: 6,
    paddingHorizontal: 10,
    fontSize: 18,
    backgroundColor: '#00CCFF',
    justifyContent: 'center',
    borderRadius: 25,
  },
});
