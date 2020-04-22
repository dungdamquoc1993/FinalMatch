import React, { Component } from 'react'
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Dimensions,  
  DatePickerAndroid,
  TouchableWithoutFeedback,
  Keyboard,
  Modal,
  Image
} from 'react-native'
import TextInputMask from 'react-native-text-input-mask'
import {translate} from '../languages/languageConfigurations'
import MultiLanguageComponent from './MultiLanguageComponent'
import { getSupplierFromStorage, saveSupplierToStorage, alertWithOKButton, alert ,isIOS} from '../helpers/Helpers'
import { insertRefereeService, getSupplierById } from '../server/myServices'
import Header from './Header'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import Geolocation from 'react-native-geolocation-service'
import { connect } from 'react-redux'
import { NavigationActions } from 'react-navigation'
import {MAIN_COLOR} from '../colors/colors'
import FinalMatchDatePicker from './FinalMatchDatePicker'
import Spinner from 'react-native-loading-spinner-overlay'
import { NavigationEvents } from 'react-navigation'

const windowWidth = Dimensions.get('window').width
const windowHeight = Dimensions.get('window').height

import {
  daysBetween2Dates,  
  convertDateToStringYYYYMMDD,   
  convertDateToString,
  convertDateTimeToString,
  convertDateToStringDDMMYYYY
} from '../helpers/Helpers'
import {
  getAddressFromLatLong,
  checkLocationPermission,
} from '../server/googleServices'

export class RefereeService extends MultiLanguageComponent {
  constructor(props) {   
    
    super(props)
  }

  static navigationOptions = {
    headerShown: false,
  }
  state = {
    age: 0,
    price: 100000,
    refereeName: '',
    phoneNumber: '',
    dateOfBirth: new Date(),    
    stringDateOfBirth: '',    
    modalVisible: false,
    currentLocation: {
      address: '',      
      latitude: 0.00,
      longitude: 0.00,
    },
    radius: 0.0,
    spinner: false,
  }

  reloadDataFromServer = async () => {    
    try {      
      const { supplierId, tokenKey, email } = await getSupplierFromStorage()
      const { data, message } = await getSupplierById(supplierId)
      const { phoneNumber, latitude,
        dateOfBirth,
        longitude, radius, address } = data             
      this.setState({ 
        phoneNumber, currentLocation: { latitude, longitude, address }, radius,
        stringDateOfBirth: convertDateToStringDDMMYYYY(new Date(dateOfBirth)),
        age: daysBetween2Dates(new Date(), new Date(dateOfBirth)),
      })       
    } catch (error) {
      alertWithOKButton(translate("Cannot get supplier's information") + error)
    }
  }
  _pressLocation = async () => {    
    const hasLocationPermission = await checkLocationPermission()    
    if (hasLocationPermission) {
      this.setState({spinner: true})
      Geolocation.getCurrentPosition(
        async (position) => {

          const { latitude, longitude } = position.coords
          const address = await getAddressFromLatLong(latitude, longitude)
          this.setState({ currentLocation: {address, latitude, longitude},spinner: false  })
        },
        (error) => {
          console.log(error.code, error.message)
          this.setState({spinner: false})
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      )
    }
  }
  _insertRefereeService = async () => {    
    const {refereeName, price,radius, phoneNumber, dateOfBirth} = this.state    
    const {address,latitude, longitude} = this.state.currentLocation
    const { supplierId, email } = await getSupplierFromStorage()      

    if (latitude == 0.0 || longitude == 0.0 || radius == 0.0) {
      alertWithOKButton(translate("You must press Location and choose radius"))
      return
    }
    if(price >= 300000) {
      this.setState({price: 300000})
    } else if(price <= 50000) {
      this.setState({price: 50000})
    }

    try {                
      const {message} = await insertRefereeService(refereeName,
        price,
        phoneNumber,
        supplierId,
        convertDateToStringYYYYMMDD(dateOfBirth),
        latitude,
        longitude,
        address,
        radius)
      if (message.length == 0) {
        alertWithOKButton(translate("Insert player service successfully"), () => {
          this.props.stackNavigation.dispatch(NavigationActions.back())
        })
      } else {
        alertWithOKButton(message, null)
      }
    } catch (error) {
      alertWithOKButton(translate("Cannot get data from Server") + error)
    }

  }
  
  render() {
    const {
      refereeName,
      price,
      age,
      stringDateOfBirth,
      dateOfBirth,
      phoneNumber,      
      radius,
      modalVisible,      
    } = this.state
    const {
      address = '',
      latitude = 0.00,
      longitude = 0.00,
    } = this.state.currentLocation

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>        
        <SafeAreaView style={styles.container}>
          <NavigationEvents
          onWillFocus={payload => {
            this.reloadDataFromServer()
          }}
          />
        <Spinner
          visible={this.state.spinner}
          textContent={translate('Loading')}
          textStyle={{fontWeight: 'bold'}}
        />
        <Header title={translate("Referee Service")} hideNext = {true} pressBackButton={async () => {
          //validate ok
          return true
        }}/>

        <View style={{marginTop:20}}/>
        <View style={styles.personalInformation}>
          <TextInput
            style={styles.textInput}
            value={refereeName}            
            onChangeText={(refereeName) => {
              this.setState({refereeName})
            }}
            placeholder={translate("Your referee's name:")}
          />
        </View>
        <View style={styles.personalInformation}>
            <TextInputMask
                style={styles.textInput}
                placeholder={translate("Phone : ")}
                keyboardType={'number-pad'}
                onChangeText={(formattedValue, originValue) => {                  
                  this.setState ({phoneNumber: originValue})
                }}
                mask={"[999]-[9999]-[9999]"}
                value={`${phoneNumber}`}
              />                    
        </View>
        <View style={styles.personalInformation}>
        <TextInputMask
                style={styles.textInput}
                placeholder={translate("Your service's price(less than 300K):")}
                keyboardType={'number-pad'}    
                onChangeText={(formattedValue, originValue) => {
                  this.setState ({price: isNaN(originValue) == false ? originValue : parseFloat(originValue)})
                }}
                mask={"VND [999] [999]"}                
                value={`${price}`}
              />          
          
        </View>
          <View style={{
                flexDirection: 'row',
                height: 60,   
                width: windowWidth - 30,             
                justifyContent: 'flex-start',
                alignItems: 'center',                
              }}>
            <TouchableOpacity
              style={[styles.textInput, { 
                width: 200,                 
                justifyContent: 'center', 
              }]}
              onPress={() => {
                this.setState({ modalVisible: true })
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  height: 40,                  
                  lineHeight: isIOS == true ? 0 : 40,
                  color: stringDateOfBirth.trim() === '' ? '#a9a9a9' : 'black',
                }}
              >
                {stringDateOfBirth === '' ? translate("Date of birth: dd/mm/yyyy") : stringDateOfBirth}
              </Text>              
          </TouchableOpacity>
            <Text style={{              
              height: 40,              
              lineHeight: 40,
              paddingStart: 10
            }}>
              {this.state.age}
            </Text>
          </View>        
        <TouchableOpacity onPress={() => {
          this._pressLocation()
        }}
          style={styles.buttonGetLocation}
        >
          <Text style={styles.textGetLocation}> Get Location</Text>
          <Image source={require("../images/placeholder.png")} style={{ height: 30, width: 30 }} />
        </TouchableOpacity>
        {address.length > 0
          && <Text numberOfLines={2} 
            style={{ 
              fontSize:16, 
              marginBottom: 10,
              paddingHorizontal: 25,
            }}>{address}</Text>}
          <View style={{
              flexDirection: 'row',
              height: 50,
              width: windowWidth - 30,
              justifyContent: 'center',
              alignItems: 'center',
              marginVertical:10,
              
            }}>
              <TextInput
              style={{    
                height: 50,
                backgroundColor: '#f5f5f5',
                borderRadius: 25,
                borderColor: '#a9a9a9',
                borderWidth: 1,
                paddingStart: 10,
                paddingVertical: isIOS() ? null : 2,
                fontSize: 16,    
                lineHeight:isIOS() == true ? null : 50,
              }}
              placeholder={translate("Enter radius:")}
              value = {`${radius}`}
              keyboardType={'numeric'}
              onChangeText={radius => {
                this.setState ({radius: typeof radius == 'string' ? parseFloat(radius) : radius})
              }}
              />
          <Text style={{
              width: '20%',
              height: 50,
              lineHeight: 50,
              fontSize:16,
              paddingStart: 10,
              textAlign:'left'
            }}>
            KM
          </Text>

        </View>
        <TouchableOpacity style={styles.btnSubmit} onPress={() => {
          this._insertRefereeService()
        }}>
          <Text style={styles.txtSubmit}>Submit</Text>
        </TouchableOpacity>
          <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              // alert('Modal has been closed.')
            }}
          >
            <FinalMatchDatePicker
              dismissModal={() => {
                this.setState({ modalVisible: false })
              }}
              updateDateTime={(date) => {                   
                this.setState({
                  dateOfBirth: date,                  
                  stringDateOfBirth: convertDateToStringDDMMYYYY(date),
                  age: daysBetween2Dates(new Date(), date),
                  modalVisible: false
                })
              }}
            />
          </Modal> 
      </SafeAreaView>
      </TouchableWithoutFeedback>
      
    )
  }
}
const mapStateToProps = state => ({
  //convert "global object"(shared state) => ServiceRegister's props
  stackNavigation: state.navigationReducers.stackNavigation
})
export default connect(
  mapStateToProps
)(RefereeService)

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flex: 1,
  },
  personalInformation: {
    flexDirection: 'row',
    height: 60,
    width: '100%',    
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical:5,
  },
  
  textInput: {
    width: windowWidth - 30,
    height: 50,
    backgroundColor: '#f5f5f5',
    borderRadius: 25,
    borderColor: '#a9a9a9',

    borderWidth: 1,
    paddingStart: 15,
    paddingVertical: isIOS() ? null : 2,
    fontSize: 16,            
    lineHeight: isIOS() ? 0 : 50,
  },
  btnSubmit: {
    height: 50,
    marginTop: 20,
    width: '90%',
    alignSelf: 'center',
    borderRadius: 6,
    paddingHorizontal: 10,
    fontSize: 16,
    backgroundColor: '#00CCFF',
    justifyContent: 'center',
    borderRadius: 25,
  }, txtSubmit: {
    lineHeight: 50,
    fontSize: 20,
    color: 'white',
    alignSelf: 'center',
  },  

  buttonGetLocation: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginVertical: 20,
  },
  textGetLocation: {
    marginRight: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  dropDownRadius: {
    width: 90,
    marginLeft: 8,
    marginBottom: 20,
  },
 
  textLabelRadius: {
    width: '50%',
    height: 40,
    lineHeight: 40,
    paddingStart: 30,
    fontSize:20
  },    
})
