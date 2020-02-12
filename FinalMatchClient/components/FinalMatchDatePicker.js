import i18n from "i18n-js"
import React, {Component} from 'react'
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,  
} from 'react-native'
import {isIOS} from '../helpers/Helpers'
import {translate} from '../languages/languageConfigurations'
import MultiLanguageComponent from './MultiLanguageComponent'
import { TextInput } from 'react-native-gesture-handler'
import DatePicker from 'react-native-date-picker'

export default class FinalMatchDatePicker extends MultiLanguageComponent {
    state = {
        date: new Date(),
        mode: isIOS ? "datetime" : "date",
        isShow: true
    }
    render() {
        // alert(i18n.locale)
        const {date, mode, isShow} = this.state
        const {updateDateTime, dismissModal} = this.props //GMT+0
        return (<View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>     
               <TouchableOpacity 
                onPress = {dismissModal}
                style={{position: 'absolute', top:0, bottom: 0, left: 0, right: 0, opacity: 0.5, backgroundColor:'black'}} />     
            {isShow && (                
                <View style={{ backgroundColor: 'white', paddingVertical: 20 }}>
                    <DatePicker      
                        locale={i18n.locale}              
                        date={this.state.date}
                        onDateChange={date => this.setState({ date })}
                /></View>
                                
            )}
        </View>)        
    }
}