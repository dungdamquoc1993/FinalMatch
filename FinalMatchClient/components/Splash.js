import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Animated,  
  Dimensions,
  NativeEventEmitter, 
  NativeModules,
} from 'react-native'
import {
    MAIN_COLOR, 
} 
from '../colors/colors'
import {
    EVENT_PRESS_NOTIFICATION,
    EVENT_INSERT_CUSTOMER_NOTIFICATION,
    EVENT_INSERT_SUPPLIER_NOTIFICATION
} from './eventNames.js'
import {getCustomerFromStorage, saveCustomerToStorage} from '../helpers/Helpers'
import {tokenCheckCustomer, insertCustomerNotificationToken} from '../server/myServices'

const {height, width} = Dimensions.get('window')
export default class Splash extends Component {
    static navigationOptions = {
        headerShown: false,
    }
    constructor(props){
        super(props)                
    }
    state = {
        logoOpacity: new Animated.Value(0),
        titleMarginTop: new Animated.Value(height / 2)
    }
    
    componentWillUnmount() {
        debugger        
        if(this.subsribeEventPressNotification) {
            this.subsribeEventPressNotification.remove()
        }                
    }
    //Liệu Splash lúc sinh ra có kịp nhận event từ ios/android ko ?. Cái này phải debug
    reloadEventsFromNative() {        
        debugger
        /*        
        this.nativeEventEmitter = new NativeEventEmitter()
        debugger
        this.subsribeEventPressNotification = this.nativeEventEmitter.addListener(
            EVENT_PRESS_NOTIFICATION,
            (reminder) => {
                navigate("Orders")  
            }
        ) 
        */       
    }
    async componentDidMount() {
        const {navigate} = this.props.navigation
        debugger
        this.reloadEventsFromNative()
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
            let {result} = await tokenCheckCustomer(tokenKey, customerId)                       
            if(result.toLowerCase().trim() === "failed") {
                await saveCustomerToStorage('', '', '')
                tokenKey = ''
                customerId = '' 
            }                        
            if(tokenKey.length > 0) {                
                
                navigate("Service")
            } else {
                navigate("LoginRegister")    
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