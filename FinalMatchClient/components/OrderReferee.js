import React, {Component} from 'react'
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Modal
} from 'react-native'
import Header from './Header'
import { NavigationEvents } from 'react-navigation'
import {translate} from '../languages/languageConfigurations'
import MultiLanguageComponent from './MultiLanguageComponent'
import {
  getCustomerInformation,
  updateCustomerInformation
} from '../server/myServices'
import {getCustomerFromStorage, convertDateTimeToString} from '../helpers/Helpers'
import FinalMatchDatePicker from './FinalMatchDatePicker'

export default class OrderReferee extends MultiLanguageComponent {
  static navigationOptions = {
    headerShown: false,
  }
  state = {
    name: '',
    place: '',
    dateTimeString: '',
    phoneNumber: '',    
    point: {
      latitude : 0, 
      longitude: 0
    },
    matchTiming: null,
    modalVisible: false,
  }
  sendRequest = async () => {    
    try {
      const {name, phoneNumber} = this.state
      const {navigate} = this.props.navigation
      const {point, matchTiming, dateTimeString} = this.state
      const {latitude, longitude} = point
      
      //1.Update customer's information
      const { message, error } = await updateCustomerInformation(name, phoneNumber)      
      if (!error) {        
        if(name.trim().length == 0 || phoneNumber.trim().length == 0) {
          alert(translate("You must enter order's name or phone number"))
          return
        }        
        if(latitude == 0 || longitude == 0){
          alert(translate("You must enter place"))          
          return
        }
        if(!matchTiming){
            alert(translate("You must enter matching time"))            
            return
        }        
        navigate ('RefereeList', {
          radius: 10,          
          latitude, 
          longitude,
          matchTiming
        })        
      } else {
        alert(translate("Cannot update customer's information:")+error)
      }
    } catch (error) {
      alert(translate("Cannot update customer's information:")+error)
    }
  }
  reloadDataFromServer = async () => {    
    const { customerId, email } = await getCustomerFromStorage()    
    try {
      const { data, message } = await getCustomerInformation(customerId)
      const { 
          name, phoneNumber, tokenKey, userType
      } = data      
      this.setState({
        name, phoneNumber
      })
    } catch (error) {
      alert(translate("Cannot update customer's information:")+error)
    }
  }
  render () {
    const {navigate} = this.props.navigation
    const {name, phoneNumber, point, matchTiming, place, modalVisible, dateTimeString} = this.state    
    return (
      <SafeAreaView style={styles.container}>
        <NavigationEvents
          onWillFocus={payload => {
            this.reloadDataFromServer()
          }}
        />
      <Header title={translate('Order Referee')} 
        hideBack={false}
        hideNext={true}
        pressBackButton={() => {
        this.props.navigation.navigate('Service')
        }}/>
        <View style={styles.personalInformation}>
          <TextInput style={styles.textInput} 
          value={name}            
          onChangeText={(name) => {
            this.setState({name})
          }}
          placeholder={translate("Enter name: ")} />
        </View>
        <View style={styles.personalInformation}>
          <TextInput
            style={styles.textInput}
            value={phoneNumber}
            keyboardType={'phone-pad'}
            onChangeText={(phoneNumber) => {
              this.setState({phoneNumber})
            }}
            placeholder={translate("Enter phone number: ")}
          />
        </View>
        <View style={{borderBottomWidth:1,backgroundColor:'#a9a9a9',width:'80%',marginVertical:25}} />
        <View style={styles.personalInformation}>
            <TouchableOpacity
              onPress={async () => {    
                const {name, phoneNumber} = this.state
                await updateCustomerInformation(name, phoneNumber)      
                navigate ('SearchPlace', {
                  updatePlace: (place, latitude, longitude) => {
                    this.setState ({place, point: {latitude, longitude}})
                  },
                })
              }}              
              style={styles.textInput}
            >
              <Text
                style={{
                  fontSize: 17,                  
                  height: 40,
                  lineHeight: 50,
                  paddingStart: 5,
                  color: place.trim() === ''? '#a9a9a9' : 'black',
                }}                
              >
                {place.trim() === ""? translate("Match's place") : place}
              </Text>
            </TouchableOpacity>

          </View>
          <View style={styles.personalInformation}>
            <TouchableOpacity
              style={styles.textInput}
              onPress={async () => {
                const {name, phoneNumber} = this.state
                await updateCustomerInformation(name, phoneNumber)      
                this.setState ({modalVisible: true})
              }}
            >
              <Text
                style={{
                  fontSize: 17,
                  height: 40,
                  lineHeight: 50,
                  paddingStart: 5,
                  color: dateTimeString.trim () === '' ? '#a9a9a9' : 'black',
                }}
              >                
                {dateTimeString === '' ? translate("Match's timing"): dateTimeString}                
              </Text>
            </TouchableOpacity>
          </View>
        <TouchableOpacity style={styles.buttonSubmit} onPress={async () => {
          await this.sendRequest()
        }}>
          <Text style={styles.textSubmit}>
            {translate("Send a request")}
          </Text>
        </TouchableOpacity>
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            
          }}
        >          
          <FinalMatchDatePicker
            dismissModal={() => {
              this.setState ({modalVisible: false})              
            }}
            updateDateTime={(date)=>{              
              this.setState({
                matchTiming: date,
                modalVisible: false,
                dateTimeString: convertDateTimeToString(date)
              })
            }}
          />
        </Modal>
      </SafeAreaView>
    )
  }
}
const styles = StyleSheet.create ({
  container: {
    marginTop:20,
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  personalInformation: {
    height: 75,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    width: '90%',
    height: 50,
    backgroundColor: '#f5f5f5',
    borderRadius: 25,
    borderColor: '#a9a9a9',
    borderWidth: 1,
    paddingStart:15,
    fontSize: 17,
    
  },
  textInputPosition: {
    width: '90%',
    height: 50,
    backgroundColor: '#f5f5f5',
    borderRadius: 25,
    borderColor: '#a9a9a9',
    borderWidth: 1,
    paddingStart:15,
    fontSize: 17,
    
  },
  buttonSubmit: {
    height: 50,
    marginTop: 20,
    width: '90%',
    alignSelf: 'center',
    borderRadius: 6,
    paddingHorizontal: 10,
    fontSize: 17,
    backgroundColor: '#00CCFF',
    justifyContent: 'center',
    borderRadius: 25,
  },
  textSubmit: {
    lineHeight: 50,
    fontSize: 20,
    
    color: 'white',
    alignSelf: 'center',
  },
})
