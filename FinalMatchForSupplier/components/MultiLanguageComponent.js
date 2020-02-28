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
    this.hasOrder = false
    setI18nConfig() // set initial config
  }
  _pushNotifications(snapshotValue) {    
    debugger
    if(Object.keys(snapshotValue).length == 0) {
      return
    }
    debugger
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
    debugger
    let strDatetimeStart = (new Date(dateTimeStart)).toLocaleString(i18n.locale == 'en' ? "en-US" : "vi-VN")        
    if(orderStatus == PENDING) {
      pushLocalNotification("You have order", 
        `Ban dang co don hang moi pending`) //TRu: accepted, cancelled
    } else if(orderStatus == MISSED) {
      pushLocalNotification("You have order", `Missed`) //TRu: accepted, cancelled
    } else if(orderStatus == COMPLETED) {
      pushLocalNotification("Completed order", `complete`) //TRu: accepted, cancelled
    }
  }
  _checkSupplierIdInFirebase = async (snapshotValue) => {
    //Ex: input: supplierId = 31,snapShotValue =  {"abcx:31": value..., "ttt:32": value...} , output : true
    for (const key in snapshotValue) {            
      const [customerId, supplierID] = key.split (':')
      // console.log("xx"+getSupplierFromStorage().supplierId)
      debugger
      const {supplierId} = await getSupplierFromStorage()
      debugger
      if (supplierId == supplierID) {                
        return true
      }
    }    
    return false
  }

  _readDataFromFirebase = () => {
    debugger
    firebaseDatabase.ref ('/orders').on ('value', async snapshot => {      
      debugger
      let snapshotValue = snapshot.val ()
      debugger
      this.hasOrder = await this._checkSupplierIdInFirebase (snapshotValue) 
      debugger
      if (this.hasOrder == true) {                
        this._pushNotifications(snapshotValue)                
      }
    })
  }
  async componentDidMount() {
    debugger    
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