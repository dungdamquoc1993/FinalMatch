import React, {Component} from 'react'
import {View, StyleSheet, Image,
    TouchableOpacity,
    Text
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import Icon5 from 'react-native-vector-icons/FontAwesome5'
//export = public
//Component = thẻ
export default class LoginRegister extends Component {
    state = {
        isLogin: true
    }
    _loginWithFacebook = async () => {
        alert("Login Facebook")
    }
    _login = async () => {
        this.setState({isLogin: true})
    }
    _register = async () => {
        this.setState({isLogin: false})
    }
    render() {
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
                    {this.state.isLogin === true && <View style={styles.line}></View>}
                </View>
                <View style={styles.viewLogin}>
                    <TouchableOpacity onPress={this._register}>
                        <Text style={styles.twoButton}>
                            Register
                        </Text>
                    </TouchableOpacity>
                    {this.state.isLogin === false && <View style={styles.line}></View>}
                </View>
            </View>    
        </View>
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,                
        flexDirection: 'column',
        justifyContent:'flex-start',
        alignItems: 'center'
    },
    logo: {
        margin: 20,
        width: 100,
        backgroundColor: 'red',
        height: 100,
        borderRadius: 50,
    },
    facebookButton: {
        height: 50,
        width: '80%',
        backgroundColor: '#3b5998',
        color: 'white',
        textAlign: 'center',
        lineHeight: 40,
        paddingHorizontal: 15,
        borderRadius: 6,
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
    }
})

