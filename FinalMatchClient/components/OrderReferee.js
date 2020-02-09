import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Platform
} from 'react-native';
import Header from './Header'
import { NavigationEvents } from 'react-navigation'
import {translate} from '../languages/languageConfigurations'
import MultiLanguageComponent from './MultiLanguageComponent'
import {
  getCustomerInformation,
  updateCustomerInformation
} from '../server/myServices'
import {getCustomerFromStorage} from '../helpers/Helpers'

export default class OrderReferee extends MultiLanguageComponent {
  static navigationOptions = {
    headerShown: false,
  }
  state = {
    name: '',
    phoneNumber: '',    
    point: {
      latitude : 0, 
      longitude: 0
    },
    matchTiming: {
      day: 0,
      month: 0,
      year: 0,
      hour: 0,
      minute: 0, 
      gmt: 7
    }
  }
  sendRequest = async () => {    
    try {
      const {name, phoneNumber} = this.state
      const {navigate} = this.props.navigation
      const {point, matchTiming} = this.state
      
      //1.Update customer's information
      const { message, error } = await updateCustomerInformation(name, phoneNumber)      
      if (!error) {
        //2.Tim player, ....truyen param sang PlayerLists
        navigate('RefereeList', {point, matchTiming});
      } else {
        alert("Cannot update customer's information "+error)
      }
    } catch (error) {
      alert("Cannot update customer's information: "+error)
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
      alert(`Cannot get customer's information. error = ${JSON.stringify(error)}`)
    }
  }
  render () {
    const {navigate} = this.props.navigation;
    const {name, phoneNumber, point, matchTiming} = this.state    
    return (
      <SafeAreaView style={styles.container}>
        <NavigationEvents
          onWillFocus={payload => {
            this.reloadDataFromServer()
          }}
        />
      <Header title="Đặt Trọng Tài" hideBack={true} pressBackButton={() => {
        this.props.navigation.navigate('Service')
        }}/>
        <View style={styles.personalInformation}>
          <TextInput style={styles.textInput} 
          value={name}            
          onChangeText={(name) => {
            this.setState({name})
          }}
          placeholder={'Nhập tên'} />
        </View>
        <View style={styles.personalInformation}>
          <TextInput
            style={styles.textInput}
            value={phoneNumber}
            keyboardType={'phone-pad'}
            onChangeText={(phoneNumber) => {
              this.setState({phoneNumber})
            }}
            placeholder={translate("Enter telephone number: ")}
          />
        </View>
        <View style={{borderBottomWidth:1,backgroundColor:'#a9a9a9',width:'80%',marginVertical:25}} />
        <View style={styles.personalInformation}>
          <TextInput
            style={styles.textInputPosition}
            placeholder={'Địa điểm thi đấu'}
          />
        </View>
        <View style={styles.personalInformation}>
          <TextInput
            style={styles.textInputPosition}
            placeholder={'Thời gian thi đấu'}
          />
        </View>
        <TouchableOpacity style={styles.buttonSubmit} onPress={async () => {
          await this.sendRequest()
        }}>
          <Text style={styles.textSubmit}>
            {translate("Send a request")}
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
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
});
