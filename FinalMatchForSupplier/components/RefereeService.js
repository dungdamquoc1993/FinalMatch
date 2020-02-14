import React, { Component } from 'react';
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
  Image
} from 'react-native';
import { getSupplierFromStorage, saveSupplierToStorage, alertWithOKButton, alert } from '../helpers/Helpers'
import { insertRefereeService, getSupplierById } from '../server/myServices'
import Header from './Header'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Geolocation from 'react-native-geolocation-service'
import { connect } from 'react-redux'
import { NavigationActions } from 'react-navigation'
import {MAIN_COLOR} from '../colors/colors';
import {} from './FinalMatchDatePicker'

import {
  daysBetween2Dates,
  convertDayMonthYearToString,
  convertDateToStringYYYYMMDD, 
  isIOS,
  convertDateToString,
} from '../helpers/Helpers';
import {
  getAddressFromLatLong,
  checkLocationPermission,
} from '../server/googleServices';
import DatePicker from 'react-native-date-picker'

export class RefereeService extends Component {
  static navigationOptions = {
    headerShown: false,
  };
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
      alertWithOKButton("Cannot get Supplier information" + error)
    }
  };

  _displayAge(age) {
    if (age > 0) {
      return age > 1 ? `${age} ages` : `${age} age`;
    } else {
      return '';
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
          console.log(error.code, error.message);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    }
  }
  _insertRefereeService = async () => {    
    const {refereeName, price,radius, phoneNumber, dateOfBirth} = this.state    
    const {address,latitude, longitude} = this.state.currentLocation
    const { supplierId, email } = await getSupplierFromStorage()      

    if (latitude == 0.0 || longitude == 0.0 || radius == 0.0) {
      alertWithOKButton("Bạn phải nút bấm nút lấy Location và chọn bán kính")
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
        alertWithOKButton("Insert referee service successfully", () => {
          this.props.stackNavigation.dispatch(NavigationActions.back())
        })
      } else {
        alertWithOKButton(message, null)
      }
    } catch (error) {
      alertWithOKButton('Cannot get data from Server' + error)
    }

  }
  
  render() {
    const {
      refereeName,
      price,
      age,
      dateOfBirth,
      phoneNumber,
      stringDateOfBirth,
      showIOSDatePicker,
      radius,
      modalVisible
    } = this.state
    const {
      address = '',
      district = '',
      province = '',
    } = this.state.currentLocation

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <SafeAreaView style={styles.container}>
        <Header title={'REFEREE SERVICE'} pressBackButton={async () => {
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
            placeholder={'Tên trọng tài của Bạn (còi danh) :)'}
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
            placeholder={'Giá dịch vụ của Bạn (ít hơn 300k)'}
            keyboardType={'number-pad'}
            value={price}
            onChangeText={price => {
              this.setState ({price: isNaN(price) == false ? price : parseFloat(price)});
            }}
          />          
        </View>
          <View style={styles.dateTime}>
            <TouchableOpacity
              style={[
                styles.textInput, { width: '70%' }]}
              onPress={() => {
                this.setState({ modalVisible: true })
              }}
            >
              <Text
                style={{
                  fontSize: 17,
                  height: 40,
                  lineHeight: 50,
                  paddingStart: 5,
                  color: place.trim() === '' ? '#a9a9a9' : 'black',
                }}
              >
                {dateTimeString === '' ? "Ngày sinh: dd/mm/yyyy" : dateTimeString}
              </Text>
              />
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
          <Text style={styles.textLabelRadius}>
            Bán kính phục vụ:
          </Text>
            
              <TextInput
              style={styles.textInputRadius}
              placeholder={'Enter radius'}
              keyboardType={'numeric'}
              onChangeText={radius => {
                this.setState ({radius});
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
              alert('Modal has been closed.');
            }}
          >
            <FinalMatchDatePicker
              dismissModal={() => {
                this.setState({ modalVisible: false });
              }}
              updateDateTime={(date) => {
                this.setState({ dateTimeString: convertDateTimeToString(date) })
                this.setState({
                  dateOfBirth: date,
                  stringDateOfBirth: convertDateToString(dateOfBirth),
                  age: daysBetween2Dates(new Date(), date),
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
  textLabel: {
    width: '40%',
    height: 40,
    lineHeight: 40,
    paddingStart: 30,
    fontSize:20
  },
  textInput: {
    width: '90%',
    height: 50,
    borderRadius: 5,
    borderColor: 'black',
    borderWidth: 1,
    paddingHorizontal: 10,
    color: 'black',
    fontSize: 20
  },
  btnSubmit: {
    height: 60,
    width: 200,
    backgroundColor: MAIN_COLOR,
    borderRadius: 7,
    alignItems: 'center',
    marginTop: 20,
  },
  txtSubmit: {
    lineHeight: 60,
    fontWeight: 'bold',
    fontSize: 20,
    color: 'white'
  },
  radiusInput: {
    flexDirection: 'row',
    height: 60,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical:10
  },
  textLabelRadius: {
    width: '40%',
    height: 40,
    lineHeight: 40,
    paddingStart: 20,
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
  }, textInputRadius: {
    width: '35%',
    height: 50,
    borderRadius: 8,
    borderColor: 'black',
    marginEnd:5,
    borderWidth: 1,
    paddingHorizontal: 10,
    color: 'black',
    fontSize: 20
  },  textLabelRadius: {
    width: '50%',
    height: 40,
    lineHeight: 40,
    paddingStart: 30,
    fontSize:20
  },  textKM:{
    width: '15%',
    height: 40,
    lineHeight: 40,
    fontSize:20
  }
});
