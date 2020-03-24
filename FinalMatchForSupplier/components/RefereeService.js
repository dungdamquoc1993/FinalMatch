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
import {translate} from '../languages/languageConfigurations'
import { getSupplierFromStorage, saveSupplierToStorage, alertWithOKButton, alert ,isIOS} from '../helpers/Helpers'
import { insertRefereeService, getSupplierById } from '../server/myServices'
import Header from './Header'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import Geolocation from 'react-native-geolocation-service'
import { connect } from 'react-redux'
import { NavigationActions } from 'react-navigation'
import {MAIN_COLOR} from '../colors/colors'
import FinalMatchDatePicker from './FinalMatchDatePicker'

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

export class RefereeService extends Component {
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
      district: '',
      province: '',
      latitude: 0.00,
      longitude: 0.00,
    },
    radius: 0
  }
  componentDidMount = async () => {
    try {      
      const { supplierId, tokenKey, email } = await getSupplierFromStorage()
      const { data, message } = await getSupplierById(supplierId)
      const { phoneNumber, latitude,
        longitude, radius, address } = data      
      this.setState({ phoneNumber, currentLocation: { latitude, longitude, address }, radius })
    } catch (error) {
      alertWithOKButton(translate("Cannot get supplier's information") + error)
    }
  }

  _displayAge(age) {
    if (age > 0) {
      return age > 1 ? `${age} `+translate("ages") : `${age} `+translate("age")
    } else {
      return ''
    }
  }
  _pressLocation = async () => {
    const hasLocationPermission = await checkLocationPermission()

    if (hasLocationPermission) {
      Geolocation.getCurrentPosition(
        async (position) => {

          const { latitude, longitude } = position.coords

          const { address = '', district = '', province = '' } = await getAddressFromLatLong(latitude, longitude)

          this.setState({ currentLocation: { address, district, province, latitude, longitude } })
        },
        (error) => {
          console.log(error.code, error.message)
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
      district = '',
      province = '',
    } = this.state.currentLocation

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <SafeAreaView style={styles.container}>
        <Header title={"Refere Service"} pressBackButton={async () => {
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
          <TextInput
            style={styles.textInput}
            value={phoneNumber}
            onChangeText={(phoneNumber) => {
              this.setState({phoneNumber})
            }}
            placeholder={'Số điện thoại của Bạn '}
            keyboardType={'number-pad'}
          />
        </View>
        <View style={styles.personalInformation}>
          <TextInput
            style={styles.textInput}
            placeholder={translate("Your service's price(less than 300K):")}
            keyboardType={'number-pad'}
            value={price}
            onChangeText={price => {
              this.setState ({price: isNaN(price) == false ? price : parseFloat(price)})
            }}
          />          
        </View>
          <View style={styles.dateTime}>
            <TouchableOpacity
              style={[styles.textInput, { width: '70%' }]}
              onPress={() => {
                this.setState({ modalVisible: true })
              }}
            >
              <Text
                style={{
                  fontSize: 17,
                  height: 40,
                  lineHeight: 40,
                  color: stringDateOfBirth.trim() === '' ? '#a9a9a9' : 'black',
                }}
              >
                {stringDateOfBirth === '' ? translate("Date of birth: dd/mm/yyyy") : stringDateOfBirth}
              </Text>              
          </TouchableOpacity>
            <Text style={styles.age}>
              {this._displayAge(age)}
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
        {(address.length > 0 || district.length > 0 || province.length > 0)
          && <Text style={{ fontSize:16}}>{address} - {district} - {province}</Text>}
          <View style={styles.radiusInput}>
              <TextInput
              style={styles.textInputRadius}
              placeholder={translate("Enter radius:")}
              keyboardType={'numeric'}
              onChangeText={radius => {
                this.setState ({radius})
              }}
              />
          <Text style={styles.textKM}>
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
  dateTime: {
    flexDirection: 'row',
    height: 60,
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
    paddingStart: 15,
    fontSize: 17,
    lineHeight:isIOS?25:50,
  },
  btnSubmit: {
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
  }, txtSubmit: {
    lineHeight: 50,
    fontSize: 20,
    color: 'white',
    alignSelf: 'center',
  },
  radiusInput: {
    flexDirection: 'row',
    height: 50,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical:10,
    
  },

  buttonGetLocation: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginVertical: 30,
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
  },age:{
    width: '20%',
    height: 40,
    lineHeight: 40,
    paddingStart: 5
  }, 
  textInputRadius: {
    width: '60%',
    height: 50,
    backgroundColor: '#f5f5f5',
    borderRadius: 25,
    borderColor: '#a9a9a9',
    borderWidth: 1,
    paddingStart: 15,
    fontSize: 17,
    lineHeight:isIOS?25:50,
  }, 
  textLabelRadius: {
    width: '50%',
    height: 40,
    lineHeight: 40,
    paddingStart: 30,
    fontSize:20
  },  
  textKM:{
    width: '20%',
    height: 50,
    lineHeight: 50,
    fontSize:17,
    textAlign:'center'
  }
})
