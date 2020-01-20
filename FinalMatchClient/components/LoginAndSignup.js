import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Text,
  TextInput,
  Dimensions,
  SafeAreaView
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
export default class LoginAndSignup extends Component {
  state = {
    isLogin: true,
    email: '',
    password: '',
  };
  _login = async () => {
    this.setState ({isLogin: true});
  };
  _register = async () => {
    this.setState ({isLogin: false});
  };
  render () {
    const {navigate} = this.props.navigation;
    const {email, password, isLogin} = this.state
    return (
      <SafeAreaView style={styles.container}>
        <Image style={styles.logo} source={require ('../images/cat.jpeg')} />

        <Icon.Button
          style={styles.facebookButton}
          name="facebook"
          backgroundColor="#3b5998"
          borderRadius={30}
          onPress={() => {
              navigate ('Service');
            }}
          
        >
        <Text style={{fontSize:18,color:'white'}}>Login with Facebook</Text>
          
        </Icon.Button>
        <View style={styles.viewLoginRegister}>
          <View style={styles.viewLogin}>
            <TouchableOpacity onPress={this._login}>

              <Text style={styles.twoButton}>
                Sign in
              </Text>
            </TouchableOpacity>
            {isLogin === true && <View style={styles.line} />}
          </View>
          <View style={styles.viewLogin}>
            <TouchableOpacity onPress={this._register}>
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
              this.setState ({email});
            }}
            value={email}
            keyboardType={'email-address'}
            placeholder={'Email:'}
          />
          <TextInput
            style={styles.textInput}
            onChangeText={password => {
              this.setState ({password});
            }}
            value={password}
            keyboardType={'default'}
            secureTextEntry
            placeholder={'Password:'}
          />
          {isLogin === false &&
            <TextInput
              style={styles.textInput}
              onChangeText={password => {
                this.setState ({password});
              }}
              value={this.state.password}
              keyboardType={'default'}
              secureTextEntry
              placeholder={'Retype password:'}
            />}
        </View>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => {
              navigate ('Service');
            }}
        >
          <Text style={{textAlign: 'center',color:'white',fontSize:20,fontWeight:'bold'}}>
            {isLogin === true ? 'Sign-in' : 'Sign-up'}
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}
const screenWidth = Math.round (Dimensions.get ('window').width);
const screenHeight = Math.round (Dimensions.get ('window').height);
const styles = StyleSheet.create ({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop:'10%'
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
    fontSize:18,
    paddingStart:15
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
