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
import {registerSupplier, loginSupplier, loginFacebook} from '../server/myServices'
import {alert, 
    saveSupplierToStorage,
    generateFakeString, 
    getSupplierFromStorage,
    isIOS} from '../helpers/Helpers'
import { LoginManager, LoginResult, 
    AccessToken, GraphRequest,
    GraphRequestManager, } from "react-native-fbsdk";
import {MAIN_COLOR,COLOR_BUTTON} from '../colors/colors'

//export = public
//Component = thẻ
class LoginRegister extends Component {
    static navigationOptions = {
        header: null,
    }
    state = {
        isLogin: true,        
        email: '', 
        facebookId: '',
        avatar: '',
        name: '',
        password: '',
        retypePassword: '',        
    }
    componentDidMount() {                        
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
                    alert('Error avatar ' + error.toString());
                    reject(error)
                } else {
                    const avatar = avatarObject.picture.data.url
                    this.setState({avatar})                                    
                    resolve(avatar)
                }
            })                                
            new GraphRequestManager().addRequest(avatarRequest).start();    
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
                        console.log('Error fb user: ' + error.toString());
                        reject(error)
                    } else {
                        const facebookId = facebookUser.id
                        const {name} = facebookUser     
                        const avatar = await this._getFacebookAvatar(accessToken)                                                                   
                        resolve({facebookId, name, avatar})                                                                                                
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
                console.log("Login cancelled");
            } else {
                const tokenObject = await AccessToken.getCurrentAccessToken()                
                const { accessToken, userID } = tokenObject                
                const { facebookId, name, avatar } = await this._getFacebookInfo(accessToken, userID)                
                const email = generateFakeString()
                const {tokenKey, supplierId, message} = await loginFacebook(name, email, facebookId, avatar)                         
                alert(`ssss= ${supplierId}`)
                if (tokenKey.length > 0) {                    
                    await saveSupplierToStorage(tokenKey, supplierId, email)
                    //dispatch = call action                                        
                    this.props.navigation.navigate("MyTabNavigator", {})
                } else {
                    alert(message)
                }
            }
        } catch(error) {            
            alert("Cannot login Facebook: " + error)
        }        
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
                await saveSupplierToStorage(tokenKey, supplierId, email)                
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
            <Image style={styles.logo} source={require('../images/LOGO_Dung_2.png')} />
            
            <Icon.Button
                style={styles.facebookButton}
                name="facebook"
                backgroundColor="#3b5998"
                onPress={async () => {
                    await this._loginWithFacebook()
                }}
            >
                <Text style={styles.txtLoginFaceBook}>Login with Facebook</Text>
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
                    autoCapitalize = {false}
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
                <Text style={styles.txtLoginRegister}>
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
        paddingTop: isIOS() ? 80 : 0,
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
        alignSelf: 'stretch',
        marginHorizontal: 30,
        flexDirection: 'row',  
    },
    viewLogin: {
        height: 50,
        width: '50%',
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
        height: 50, 
        marginTop: 20,
        width: '90%',
        borderColor: 'gray',      
        borderWidth: 1, 
        alignSelf: 'center',
        borderRadius: 6, 
        paddingHorizontal: 10,
        fontSize:17
    },
    loginButton: { 
        height: 70, 
        marginTop: 20,
        width: '60%',        
        alignSelf: 'center',
        borderRadius: 15, 
        paddingHorizontal: 10,
        backgroundColor: MAIN_COLOR,
        justifyContent: 'center',
        borderColor: COLOR_BUTTON,
        borderWidth:4
    },
    txtLoginRegister:{
        textAlign: 'center',
        color: 'black',
        fontSize:19
    },txtLoginFaceBook:{
        fontSize:20,
        color:'white'
    }
})

