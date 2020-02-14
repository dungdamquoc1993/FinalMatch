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
        return (<View style={styles.container}>     
               <TouchableOpacity 
                onPress = {dismissModal}
                style={styles.containerButton} />     
                {isShow && (                
                <View style={styles.subView}>
                    <DatePicker                            
                        locale={i18n.locale}              
                        date={this.state.date}
                        onDateChange={date => this.setState({ date })}
                        />
                    <View >
                        <TouchableOpacity onPress={()=>{                            
                            updateDateTime(date)
                        }}
                        style={styles.btnOK}>
                            <Text style={{fontSize: 15, color: 'white', alignItems: 'center'}}>OK</Text>
                        </TouchableOpacity>
                    </View>  
                </View>                                
            )}
        </View>)        
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        borderRadius: 25,
    },
    subView: { 
        backgroundColor: 'white',
         paddingVertical: 0, 
         flexDirection: 'column', 
         borderRadius: 10 
    },
    containerButton: {
        position: 'absolute', 
        top:0, bottom: 0, left: 0, right: 0, 
        opacity: 0.5, 
        backgroundColor:'black'
    },
    btnOK:{
        justifyContent: 'center', 
        alignItems: 'center', 
        height: 50,
        borderRadius: 10,                                        
        backgroundColor: '#00CCFF'
    }
})