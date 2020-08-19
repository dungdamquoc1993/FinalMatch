import React, {Component} from 'react'
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  FlatList,
  Image,
} from 'react-native'
import {
  firebaseDatabase,
  getAddressFromLatLong
} from '../server/googleServices'
import Header from './Header'
import { NavigationEvents } from 'react-navigation'
import {getSupplierFromStorage, 
  saveSupplierToStorage, 
  alertWithOKButton, 
  getPosition, 
  alert,
  isIOS
} from '../helpers/Helpers'
import { urlGetAvatar } from '../server/urlNames'
import i18n from "i18n-js"
const {width, height} = Dimensions.get ('window')
import {
  getNotificationsBySupplierId,
} from '../server/myServices'
import {translate} from '../languages/languageConfigurations'
import {
  COLOR_ITEM_BACKGROUND,
  COLOR_ITEM_BORDER
} from '../colors/colors'
import Spinner from 'react-native-loading-spinner-overlay'
import MultiLanguageComponent from './MultiLanguageComponent'
import {
  setNotificationById,
  getNotificationById,
  getHoursBetween2Dates
} from '../helpers/Helpers'

export default class Notifications extends MultiLanguageComponent {
  state = {
    notifications: [],
    spinner: false,    
  }
  reloadDataFromServer = async () => {    
    this.setState({spinner: true})
    const {supplierId, tokenKey, email} = await getSupplierFromStorage() 
    let notifications = await getNotificationsBySupplierId(supplierId)        
    notifications.forEach((notification) => {      
      setNotificationById(notification.id)
    });
    
    this.setState({notifications,spinner: false})    
  }
  async componentDidMount () {        
    await super.componentDidMount()
    await this.reloadDataFromServer()
    firebaseDatabase.ref ('/orders').on ('value', async snapshot => {            
      if(super.hasOrder = true) {
        //Goi api load orders        
        await this.reloadDataFromServer()
      }          
    })        
  }

  
  render () {    
    const {notifications} = this.state
    return (
      <SafeAreaView style={styles.container}>
        <Spinner
          visible={this.state.spinner}
          textContent={translate("Loading")}
          textStyle={{fontWeight: 'bold'}}
        />
        <NavigationEvents
          onWillFocus={payload => {            
            this.reloadDataFromServer()
          }}
        />
        <View 
          style={{          
            height: 60,
            width: '100%'
          }}          
        >
          <Header
            title={translate("Notifications")}
            hideBack = {true}
            hideNext = {true}       
            />
        </View>
        
        <FlatList      
          width={'100%'}
          data={notifications}
          renderItem={({ item }) => <Item {...item} />}
          keyExtractor={item => `${item.notificationId}`}
      />
      </SafeAreaView>
    )
  }
}
class Item extends Component {
  
  state = {
    hoursBetween2Dates: ''
  }
  async componentDidMount() {    
    const dateTimeISOString = await getNotificationById(this.props.notificationId)    
    const hoursBetween2Dates = getHoursBetween2Dates(new Date(),new Date(dateTimeISOString))
    debugger
    this.setState({hoursBetween2Dates})
  }
  render() {
    const { 
      bodyEnglish,
      bodyVietnamese,
      createdDate,
      customerAvatar,
      customerEmail,
      customerFacebookId,
      customerId,
      customerIsActive,
      customerName,
      customerPhoneNumber,
      customerTokenKey,
      customerUserType,
      notificationId,
      orderId,
      supplierAddress,
      supplierAvatar,
      supplierDateOfBirth,
      supplierEmail,
      supplierFacebookId,
      supplierId,
      supplierIsActive,
      supplierName,
      supplierPhoneNumber,
      supplierPoint,
      supplierRadius,
      supplierTokenKey,
      supplierUserType,
      titleEnglish,
      titleVietnamese,
    } = this.props 
    debugger   
    const {hoursBetween2Dates} = this.state
    return (
      <TouchableOpacity>
        <View style={
          {          
            paddingHorizontal: 20,
            flexDirection: 'row',            
            alignItems: 'center',
          }
        }>
          <Image
                source={
                  customerAvatar.length > 0
                    ? { uri: urlGetAvatar(customerAvatar) }
                    : require('../images/defaultAvatar.png')
                }
                style={{
                  width: 75,
                  height: 75,
                  borderRadius: 40,    
                }}
              />
          <View style={{
            marginVertical: 10,
            paddingEnd: 10,            
            flexDirection: 'column',
            width: '80%'
          }}>
            <Text style={{
              paddingHorizontal: 10,
              paddingTop: 5,
              fontSize: 16,
              fontWeight: 'bold'
            }}>{i18n.locale == 'en'? titleEnglish : titleVietnamese}</Text>
            <Text style={{
              paddingHorizontal: 10,
              paddingBottom: 5,
              fontSize: 16,
            }}>{i18n.locale == 'en'? bodyEnglish : bodyVietnamese}</Text>
            <Text style={{
              paddingHorizontal: 10,
              paddingBottom: 5,
              fontSize: 16,
            }}>{hoursBetween2Dates}</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create ({
  container: {    
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',    
    flex: 1,
  },  
})
