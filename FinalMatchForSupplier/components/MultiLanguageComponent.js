import React, { Component } from 'react'
import * as RNLocalize from "react-native-localize"
import { setI18nConfig } from '../languages/languageConfigurations'
import { View } from 'react-native'
import i18n from "i18n-js"
import {
  firebaseDatabase,
  getAddressFromLatLong
} from '../server/googleServices'
import {
  getSupplierFromStorage, 
  getColorFromStatus,
  OrderStatus
} from '../helpers/Helpers'

import {pushLocalNotification} from '../helpers/PushNotification'
const { PENDING, ACCEPTED,CANCELLED, COMPLETED, MISSED } = OrderStatus

export default class MultiLanguageComponent extends Component {
  constructor(props) {
    super(props)
    debugger
    this.hasOrder = false
    setI18nConfig() // set initial config
  }
  navigateToOrder= () => {
    const {navigate} = this.props.navigation      
    navigate("Order")
  }
  _pushNotifications(snapshotValue) {    
    
    if(Object.keys(snapshotValue).length == 0) {
      return
    }
    
    const {    
      orderId,
      typeRole,
      orderLatitude,
      orderLongitude,      
      orderStatus,
      createdDate,//convert mysql string to Date object
      dateTimeStart,
      dateTimeEnd,
      supplierId,
      supplierName,
      supplierPhoneNumber,
      supplierDateOfBirth,
      supplierEmail,
      supplierLatitude,
      supplierLongitude,
      supplierAddress,
      supplierRadius,
      supplierAvatar = "",
      playerPrice = 0.0,
      refereePrice = 0.0,
      customerId,
      customerAvatar,
      customerName,
      customerPhoneNumber,
      customerEmail,
      navigate
    } = snapshotValue[Object.keys(snapshotValue)[0]]        
    let strDatetimeStart = (new Date(dateTimeStart)).toLocaleString(i18n.locale == 'en' ? "en-US" : "vi-VN")                
    if(orderStatus == PENDING) {
      pushLocalNotification("You have order", 
        `Ban dang co don hang moi pending`, this.navigateToOrder) //TRu: accepted, cancelled
    } else if(orderStatus == MISSED) {
      pushLocalNotification("You have order", `Missed`,this.navigateToOrder) //TRu: accepted, cancelled
    } else if(orderStatus == COMPLETED) {
      pushLocalNotification("Completed order", `complete`,this.navigateToOrder) //TRu: accepted, cancelled
    }
  }
  _checkSupplierIdInFirebase = async (snapshotValue) => {
    //Ex: input: supplierId = 31,snapShotValue =  {"abcx:31": value..., "ttt:32": value...} , output : true
    for (const key in snapshotValue) {            
      const [customerId, supplierID] = key.split (':')
      // console.log("xx"+getSupplierFromStorage().supplierId)
      
      const {supplierId} = await getSupplierFromStorage()
      
      if (supplierId == supplierID) {                
        return true
      }
    }    
    return false
  }

  _readDataFromFirebase = () => {
    
    firebaseDatabase.ref ('/orders').on ('value', async snapshot => {      
      
      let snapshotValue = snapshot.val ()
      
      this.hasOrder = await this._checkSupplierIdInFirebase (snapshotValue) 
      
      if (this.hasOrder == true) {                
        this._pushNotifications(snapshotValue)                
      }
    })
  }
  async componentDidMount() {
        
    await this._readDataFromFirebase ()        
    RNLocalize.addEventListener("change", this.handleLocalizationChange)    
  }

  componentWillUnmount() {
    RNLocalize.removeEventListener("change", this.handleLocalizationChange)
  }

  handleLocalizationChange = () => {
    setI18nConfig()
    this.forceUpdate()
  }
  render() {
    return <View>
      {this.props.children}
    </View>
  }
}