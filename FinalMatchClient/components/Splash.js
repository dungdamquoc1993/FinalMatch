import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Animated,  
  Dimensions
} from 'react-native'
import {
    MAIN_COLOR, 
} 
from '../colors/colors'
import {getCustomerFromStorage, saveCustomerToStorage} from '../helpers/Helpers'
import {tokenCheckCustomer} from '../server/myServices'

const {height, width} = Dimensions.get('window')
export default class Splash extends Component {
    static navigationOptions = {
        headerShown: false,
    }
    state = {
        logoOpacity: new Animated.Value(0),
        titleMarginTop: new Animated.Value(height / 2)
    }
    async componentDidMount() {
        const {navigate} = this.props.navigation
        //Add animations here        
        Animated.sequence([
            //animations by sequence
            Animated.timing(this.state.logoOpacity,{
                toValue: 1,                  
                //duration: 1500,              
                duration: 1500,              
            }),
            //Animate Text ?
            Animated.timing(this.state.titleMarginTop, {
                toValue: 10,
                //duration: 1000, //1000 miliseconds = 1 second
                duration: 1000,              
            })
        ]).start(async () => {
            //End of animations            
            let {tokenKey, customerId} = await getCustomerFromStorage()                 
            debugger
            let {result} = await tokenCheckCustomer(tokenKey, customerId)           
            debugger
            if(result.toLowerCase().trim() === "failed") {
                await saveCustomerToStorage('', '', '')
                tokenKey = ''
                customerId = '' 
            }            
            debugger
            if(tokenKey.length > 0) {                
                navigate("Service")
            } else {
                navigate("LoginAndSignup")    
            }                                    
        })
    }
    render() {
        return <View style={styles.container}>
            <Animated.Image source={require('../images/soccer.png')} 
                style={{...styles.logo, opacity: this.state.logoOpacity}}>                
            </Animated.Image>
            <Animated.Text style={{...styles.title, 
                                marginTop:this.state.titleMarginTop}}>
                FinalMatch for Client
            </Animated.Text>
        </View>
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: MAIN_COLOR    
    },
    logo: {
        width: 200,
        height: 200,
        borderRadius: 200 / 2,
    },
    title: {        
        color: 'white',
        marginTop: 10,    
        textAlign: 'center',
        width: '90%',
        fontSize: 35
    }
})