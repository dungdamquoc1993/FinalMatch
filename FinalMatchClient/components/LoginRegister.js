import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Text,
  TextInput,
  Dimensions,
  SafeAreaView,
  TouchableWithoutFeedback,
  NativeModules,
  Keyboard
} from 'react-native'
import * as RNLocalize from "react-native-localize"
import {validateEmail, validatePasword} from '../Validations/Validation'
import Icon from 'react-native-vector-icons/FontAwesome'
import {
  insertCustomerNotificationToken,
  registerCustomer, 
  loginCustomer,
  loginFacebookCustomer
} from '../server/myServices'
const {AsyncStorage} = NativeModules
import {saveCustomerToStorage} from '../helpers/Helpers'
import {translate} from '../languages/languageConfigurations'
import MultiLanguageComponent from './MultiLanguageComponent'

export default class LoginRegister extends MultiLanguageComponent {
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
      debugger
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
      debugger                                                                  
      if (tokenKey.length > 0) {            
        await saveCustomerToStorage(tokenKey, customerId, email)
        const notificationToken = await AsyncStorage.getItem("notificationToken")        
        if (notificationToken != null) {
          const {error} = await insertCustomerNotificationToken(notificationToken)
          debugger
          if(!error) {
            navigate('Service') //success
          }          
        }        
      } else {
        alert(message) //failed
      }
    } catch (error) {
      alert(translate("Error login or register Customer: ")+error)
    }
  }
  _getFacebookAvatar = async (accessToken) => {
    return new Promise((resolve, reject) => {
      const avatarRequest = new GraphRequest('/me', {
        accessToken,
        parameters: {
          fields: {
            string: 'picture.type(large)',
          },
        },
      }, (error, avatarObject) => {
        if (error) {
          alert(translate("Cannot get Facebook' avatar: ") + JSON.stringify(error))
          reject(error)
        } else {
          const avatar = avatarObject.picture.data.url
          this.setState({ avatar })
          resolve(avatar)
        }
      })
      new GraphRequestManager().addRequest(avatarRequest).start()
    })
  }
  _getFacebookInfo = async (accessToken, userID) => {
    return new Promise((resolve, reject) => {
      const infoRequest = new GraphRequest(
        `/${userID}`,
        null,
        async (error, facebookUser) => {
          // alert(JSON.stringify(facebookUser))
          if (error) {
            reject(error)
          } else {
            const facebookId = facebookUser.id
            const { name } = facebookUser
            const avatar = await this._getFacebookAvatar(accessToken)
            resolve({ facebookId, name, avatar })
          }
        },
      )
      new GraphRequestManager().addRequest(infoRequest).start()
    })
  }
  _loginWithFacebook = async () => {
    const stackNavigation = this.props.navigation
    //dispatch = call action
    this.props.dispatch(getStackNavigation(stackNavigation))
    try {

      const loginResult = await LoginManager.logInWithPermissions(["public_profile", "email"])

      if (loginResult.isCancelled) {
        console.log("Login cancelled")
      } else {
        const tokenObject = await AccessToken.getCurrentAccessToken()
        const { accessToken, userID } = tokenObject
        const { facebookId, name, avatar } = await this._getFacebookInfo(accessToken, userID)
        const email = generateFakeString()
        const { tokenKey, supplierId, message } = await loginFacebookCustomer(name, email, facebookId, avatar)

        if (tokenKey.length > 0) {
          await saveSupplierToStorage(tokenKey, supplierId, email)
          const notificationToken = await AsyncStorage.getItem("notificationToken")
          if (notificationToken != null) {
            insertSupplierNotificationToken(notificationToken)
          }
          //dispatch = call action                                        
          this.props.navigation.navigate("MyTabNavigator", {})
        } else {
          alert(message)
        }
      }
    } catch (error) {

      alert(translate("Cannot login Facebook: ") + JSON.stringify(error))
    }
  }

  render() {
    const { navigate } = this.props.navigation
    const { email, password, isLogin } = this.state
    return (
      <TouchableWithoutFeedback onPress={() => {        
        Keyboard.dismiss()        
      }} accessible={false}>
      <SafeAreaView style={styles.container}>        
        <Image style={styles.logo} source={require('../images/cat.jpeg')} />
        <Icon.Button
          style={styles.facebookButton}
          name="facebook"
          backgroundColor="#3b5998"
          borderRadius={30}
          onPress={async () => {
            await this._loginWithFacebook()
          }}
        >
          <Text
            style={styles.textLoginFaceBook}
          >
            {translate("Login with Facebook")}
          </Text>

        </Icon.Button>
        <View style={styles.viewLoginRegister}>
          <View style={styles.viewLogin}>
            <TouchableOpacity onPress={() => {
              this.setState({ isLogin: true })
            }}>

              <Text style={styles.twoButton}>
                {translate("Sign in")}                
              </Text>
            </TouchableOpacity>
            {isLogin === true && <View style={styles.line} />}
          </View>
          <View style={styles.viewLogin}>
            <TouchableOpacity onPress={() => {
              this.setState({ isLogin: false })
            }}>
              <Text style={styles.twoButton}>
                {translate("Sign up")}                
              </Text>
            </TouchableOpacity>
            {isLogin === false && <View style={styles.line} />}
          </View>
        </View>
        <View style={styles.viewInput}>
          <TextInput
            style={styles.textInput}
            onChangeText={email => {
              this.setState({ email: email.trim() })
            }}
            value={email}
            keyboardType={'email-address'}
            placeholder={'Email:'}
          />
          <TextInput
            style={styles.textInput}
            onChangeText={password => {
              this.setState({ password })
            }}
            value={password}
            keyboardType={'default'}
            secureTextEntry
            placeholder={translate("Password:")}
          />
          {isLogin === false &&
            <TextInput
              style={styles.textInput}
              onChangeText={retypePassword => {
                this.setState({ retypePassword })
              }}
              value={this.state.retypePassword}
              keyboardType={'default'}
              secureTextEntry
              placeholder={translate("Retype password:")}
            />}
        </View>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => {
            this._loginOrRegister()
          }}
        >
          <Text
            style={styles.textLogin}
          >
            {isLogin === true ? translate("Sign in") : translate("Sign up")}
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
      </TouchableWithoutFeedback>
    )
  }
}
const screenWidth = Math.round(Dimensions.get('window').width)
const screenHeight = Math.round(Dimensions.get('window').height)
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
  textLoginFaceBook:{
    fontSize: 18,
    color: 'white',    
  },
  textLogin:{
    textAlign: 'center',
    color: 'white',
    fontSize: 20,    
  }
})
