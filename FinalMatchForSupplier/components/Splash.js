import React, { Component } from 'react'
import {
    EVENT_PRESS_NOTIFICATION,
    EVENT_INSERT_CUSTOMER_NOTIFICATION,
    EVENT_INSERT_SUPPLIER_NOTIFICATION
} from './eventNames'
import {
  StyleSheet,
  Text,
  View,
  Animated,
  Image,
  Dimensions,
  NativeEventEmitter, 
  NativeModules
} from 'react-native'
import {
    MAIN_COLOR, 
    COLOR_FACEBOOK} 
from '../colors/colors'
import { connect } from 'react-redux'
import {getStackNavigation} from '../redux/actions/actions'
import {getSupplierFromStorage, saveSupplierToStorage} from '../helpers/Helpers'
import {tokenCheck, insertSupplierNotificationToken} from '../server/myServices'
import MultiLanguageComponent from './MultiLanguageComponent'
import {translate} from '../languages/languageConfigurations'
const {height, width} = Dimensions.get('window')
const {AsyncStorage} = NativeModules
class Splash extends MultiLanguageComponent {
    constructor(props){
        super(props)
        
    }
    static navigationOptions = {
        headerShown: false,
    }
    state = {
        logoOpacity: new Animated.Value(0),
        titleMarginTop: new Animated.Value(height / 2)
    }
    
    //Liệu Splash lúc sinh ra có kịp nhận event từ ios/android ko ?. Cái này phải debug    
    reloadEventsFromNative() {                        
        
    }
    componentWillUnmount() {
        this.subsribeEventInsertCustomer.remove()
        this.subsribeEventPressNotification.remove()
    }
    async componentDidMount() {
        await super.componentDidMount()
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
            let {tokenKey, supplierId} = await getSupplierFromStorage()                 
            let {result, data, message, time} = await tokenCheck(tokenKey, supplierId)           
            if(result == "failed") {
                await saveSupplierToStorage('', '', '')
                tokenKey = ''
                supplierId = '' 
            }
            
            if(tokenKey.length > 0) {
                const notificationToken = await AsyncStorage.getItem("notificationToken")
                if(notificationToken != null && notificationToken.length > 0) {
                    insertSupplierNotificationToken(notificationToken)
                }                    
                this.props.navigation.navigate("MyTabNavigator")
            } else {
                this.props.navigation.navigate("LoginRegister")    
            }            
            const stackNavigation = this.props.navigation
            //dispatch = call action
            this.props.dispatch(getStackNavigation(stackNavigation))
        })
    }
    render() {
        return <View style={styles.container}>
            <Animated.Image source={require('../images/logoSupplier.jpg')} 
                style={{...styles.logo, opacity: this.state.logoOpacity}}>                
            </Animated.Image>
            <Animated.Text style={{...styles.title, 
                                marginTop:this.state.titleMarginTop}}>
                {translate("Never miss the FinalMatch")}
            </Animated.Text>
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
)(Splash)
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