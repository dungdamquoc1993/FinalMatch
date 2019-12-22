import React, {Component} from 'react'
import {View, StyleSheet, Image,
    TouchableOpacity,
    Text,
    Dimensions,
    KeyboardAvoidingView, 
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import Icon5 from 'react-native-vector-icons/FontAwesome5'
import { TextInput } from 'react-native-gesture-handler'
import { connect } from 'react-redux'
import {getStackNavigation} from '../redux/actions/actions'
import { Header } from 'react-navigation-stack'
import {registerSupplier, loginSupplier} from '../server/myServices'
import {alert, saveSupplierToStorage, getSupplierFromStorage} from '../helpers/Helpers'
import { LoginManager, LoginResult, AccessToken } from "react-native-fbsdk";

//export = public
//Component = thẻ
class LoginRegister extends Component {
    state = {
        isLogin: true,
        email: 'hoang3@gmail.com', 
        password: '12345',
        retypePassword: '12345'
    }
    _loginWithFacebook = async () => {
        const { email } = this.state
        debugger
        const stackNavigation = this.props.navigation
        //dispatch = call action
        this.props.dispatch(getStackNavigation(stackNavigation))
        
        //* Bo qua login facebook
        this.props.navigation.navigate("MyTabNavigator", { email })
        return
        
        debugger
        LoginManager.logInWithPermissions(["public_profile", "email"]).then(
            (result) => {
                if (result.isCancelled) {
                    console.log("Login cancelled");
                } else {

                    AccessToken.getCurrentAccessToken().then(accessToken => {
                        debugger
                        //alert(accessToken)
                        this.props.navigation.navigate("MyTabNavigator", { email })
                    }).catch(error => {
                        alert(error)
                        console.log("Cannot get access token:" + error)
                    })
                }
            }).catch((error) => {
                alert("Cannot login Facebook: " +error)
                //console.log("Login fail with error: " + error);
            })
        
    }
    _login = async () => {
        this.setState({isLogin: true})
    }
    _register = async () => {
        this.setState({isLogin: false})
    }
    _loginOrRegister = async () => {
        try {
            const { email, password, retypePassword, isLogin } = await this.state
            if(isLogin != true) {
                if(retypePassword != password) {
                    alert('Password and retype password does not match')
                    return
                }
            }            
            const {tokenKey, supplierId, message} = isLogin == true ? await loginSupplier(email, password):
                                                        await registerSupplier(email, password)
            
            if (tokenKey.length > 0) {
                saveSupplierToStorage(tokenKey, supplierId, email)                
                const stackNavigation = this.props.navigation
                //dispatch = call action
                this.props.dispatch(getStackNavigation(stackNavigation))
                this.props.navigation.navigate("MyTabNavigator", { email })
            } else {
                
                alert(message)
            }
        } catch(error) {
            alert(error)
        }
        
    }
    render() {
        const {email, password, isLogin} = this.state
        return <KeyboardAvoidingView style={styles.container} 
            enabled>
            <Image style={styles.logo} source={require('../images/cat.jpeg')} />
            
            <Icon.Button
                style={styles.facebookButton}
                name="facebook"
                backgroundColor="#3b5998"
                onPress={() => {
                    this._loginWithFacebook()
                }}
            >
                Login with Facebook
             </Icon.Button>
            <View style={styles.viewLoginRegister}>
                <View style={styles.viewLogin}>
                    <TouchableOpacity onPress={this._login}>

                        <Text style={styles.twoButton}>
                            Login
                        </Text>
                    </TouchableOpacity>
                    {isLogin === true && <View style={styles.line}></View>}
                </View>
                <View style={styles.viewLogin}>
                    <TouchableOpacity onPress={this._register}>
                        <Text style={styles.twoButton}>
                            Register
                        </Text>
                    </TouchableOpacity>
                    {isLogin === false && <View style={styles.line}></View>}
                </View>
            </View>    
            <KeyboardAvoidingView style={styles.viewInput}>
                <TextInput style={styles.textInput} 
                    onChangeText = {(email) => {
                        this.setState({email})
                    }}
                    value={email}
                    keyboardType={"email-address"}
                    placeholder={"Email:"} />
                <TextInput style={styles.textInput} 
                    onChangeText = {(password) => {
                        this.setState({password})
                    }}
                    value={password}
                    keyboardType={"default"}
                    secureTextEntry
                    placeholder={"Password:"} />
                {isLogin === false && <TextInput style={styles.textInput} 
                    onChangeText = {(retypePassword) => {
                        this.setState({retypePassword})
                    }}
                    value={this.state.retypePassword}
                    keyboardType={"default"}
                    secureTextEntry
                    placeholder={"Retype password:"} />}
            </KeyboardAvoidingView>
            <TouchableOpacity style={styles.loginButton} onPress={() => {
                this._loginOrRegister()
            }}>
                <Text style={{textAlign: 'center'}}>
                    {isLogin === true ? "Login to your account" : "Register new user"}
                </Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>
    }
}
//Redux
const mapStateToProps = state => ({
    stackNavigation: state.stackNavigation,
    tabNavigation: state.tabNavigation
})
export default connect(
    mapStateToProps
)(LoginRegister)

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);
const styles = StyleSheet.create({
    container: {
        flex: 1,                
        flexDirection: 'column',
        justifyContent:'flex-start',
        alignItems: 'center',
    },
    logo: {
        margin: 20,
        width: 100,
        backgroundColor: 'red',
        height: 100,
        borderRadius: 50,
    },
    facebookButton: {
        height: 60,
        width: 0.8*screenWidth,
        backgroundColor: '#3b5998',        
        color: 'white',
        textAlign: 'center',
        lineHeight: 40,
        paddingHorizontal: 15,
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center'
    },
    viewLoginRegister: {
        height: 50,
        // width: '100%',
        alignSelf: 'stretch',
        marginHorizontal: 30,
        flexDirection: 'row',  

    },
    viewLogin: {
        height: 50,
        width: '50%',
        // alignSelf: 'stretch',
        flexDirection: 'column'
    },
    line: {
        height: 2,
        width: '100%',
        backgroundColor: 'black'
    },
    twoButton: {
        height: '100%', 
        fontSize: 25,
        textAlign: 'center', 
        paddingTop:13
    },
    viewInput: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        width: '100%',
    },
    textInput: { 
        height: 45, 
        marginTop: 20,
        width: '90%',
        borderColor: 'gray',      
        borderWidth: 1, 
        alignSelf: 'center',
        borderRadius: 6, 
        paddingHorizontal: 10
    },
    loginButton: { 
        height: 45, 
        marginTop: 20,
        width: '90%',        
        alignSelf: 'center',
        borderRadius: 6, 
        paddingHorizontal: 10,
        fontSize: 17,
        backgroundColor: 'red',
        
        justifyContent: 'center',
        
    }
})

