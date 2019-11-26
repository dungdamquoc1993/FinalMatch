import React, {Component} from 'react'
import {View, StyleSheet, Image,
    TouchableOpacity,
    Text,
    Dimensions
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import Icon5 from 'react-native-vector-icons/FontAwesome5'
import { TextInput } from 'react-native-gesture-handler'
import { connect } from 'react-redux'
import {getStackNavigation} from '../redux/actions/actions'
//export = public
//Component = thẻ
class LoginRegister extends Component {
    state = {
        isLogin: true,
        email: '', 
        password: ''
    }
    _loginWithFacebook = async () => {
        this.props.navigation.navigate('MyTabNavigator')
    }
    _login = async () => {
        this.setState({isLogin: true})
    }
    _register = async () => {
        this.setState({isLogin: false})
    }
    _loginOrRegister = async () => {
        const {email} = this.state
        const stackNavigation = this.props.navigation
        //dispatch = call action
        this.props.dispatch(getStackNavigation(stackNavigation))
        this.props.navigation.navigate("MyTabNavigator", {email})
    }
    render() {
        const {email, password, isLogin} = this.state
        return <View style={styles.container}>
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
            <View style={styles.viewInput}>
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
                    onChangeText = {(password) => {
                        this.setState({password})
                    }}
                    value={this.state.password}
                    keyboardType={"default"}
                    secureTextEntry
                    placeholder={"Retype password:"} />}
            </View>
            <TouchableOpacity style={styles.loginButton} onPress={() => {
                this._loginOrRegister()
            }}>
                <Text style={{textAlign: 'center'}}>
                    {isLogin === true ? "Login to your account" : "Register new user"}
                </Text>
            </TouchableOpacity>
        </View>
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

