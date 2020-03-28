import React, { Component } from 'react'
import * as RNLocalize from "react-native-localize"
import {setI18nConfig} from '../languages/languageConfigurations'
import { View } from 'react-native'
import {
  firebaseDatabase,
} from '../server/googleServices'

export default class MultiLanguageComponent extends Component {
  constructor(props) {
    super(props)
    setI18nConfig() // set initial config
  }

  _checkCustomerIdInFirebase = async (snapshotValue) => {
    //Ex: input: supplierId = 31,snapShotValue =  {"abcx:31": value..., "ttt:32": value...} , output : true
    for (const key in snapshotValue) {            
      const [customerID, supplierID] = key.split (':')     
      debugger       
      const {customerId} = await getCustomerFromStorage()      
      if (customerId == customerID) {                
        return true
      }
    }    
    return false
  }

  _readDataFromFirebase = () => {
    firebaseDatabase.ref('/orders').on('value', async snapshot => {
      let snapshotValue = snapshot.val()
      this.hasOrder = await this._checkCustomerIdInFirebase(snapshotValue)
      if (this.hasOrder == true) {
        
      }
    })
  }
  async componentDidMount() {
    await this._readDataFromFirebase()
    RNLocalize.addEventListener("change", this.handleLocalizationChange)
  }

  componentWillUnmount() {
    RNLocalize.removeEventListener("change", this.handleLocalizationChange)
  }


  handleLocalizationChange = () => {
    setI18nConfig();
    this.forceUpdate();
  }

  render() {
    return <View>
      {this.props.children}
    </View>
  }
}