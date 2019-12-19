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
  Image
} from 'react-native';
import {getSupplierFromStorage, saveSupplierToStorage, alertWithOKButton, alert} from '../helpers/Helpers'
import {insertRefereeService, getSupplierById} from '../server/myServices'
import Header from './Header'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Geolocation from 'react-native-geolocation-service'
import { connect } from 'react-redux'
import {NavigationActions} from 'react-navigation'

import {
  daysBetween2Dates,
  convertDayMonthYearToString,
  isIOS,
  convertDateToString,
} from '../helpers/Helpers';
import {
  getAddressFromLatLong,
  checkLocationPermission,
} from '../server/googleServices';


export class RefereeService extends Component {
  static navigationOptions = {
    header: null,
  };
  state = {
    isAddress: false,
    age: '',
    dateOfBirth: new Date (),
    stringDateOfBirth: '',
    phoneNumber: '',
    showIOSDatePicker: false,
    currentLocation: {
      address: 'giap nhat xx',
      district: '',
      province: '',
      latitude: 12.22, 
      longitude: 11.11, 
    },
    radius: 12
  }
  componentDidMount = async () => {
    try {
      const {supplierId, tokenKey, email} = await getSupplierFromStorage() 
      const { data, message} = await getSupplierById(supplierId)      
      const { phoneNumber, latitude, 
                    longitude, radius, address} = data
      debugger
      this.setState({phoneNumber, currentLocation: {latitude, longitude, address}, radius})      
    } catch(error) {
      alert("Cannot get Supplier information"+error)
    }
  };

  _displayAge (age) {
    if (age > 0) {
      return age > 1 ? `${age} ages` : `${age} age`;
    } else {
      return '';
    }
  }
  _pressLocation = async () => {
    const hasLocationPermission = await checkLocationPermission()
    debugger
    if (hasLocationPermission) {
      Geolocation.getCurrentPosition(
        async (position) => {
          debugger
          const { latitude, longitude } = position.coords
          debugger
          const { address = '', district = '', province = '' } = await getAddressFromLatLong(latitude, longitude)
          debugger
          this.setState({ currentLocation: { address, district, province } })
        },
        (error) => {
          console.log(error.code, error.message);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    }
  }
  _insertRefereeService = async () => {        
    const {refereeName} = this.state      
    //const {latitude,longitude, address} = this.state.currentLocation
    //fake
    let latitude = 11.22; let longitude = 22.33; let radius = 12.11; let address = "xx11";//nho xoa
    if(latitude == 0.0 || longitude == 0.0 || radius == 0.0) {
      alert("Bạn phải nút bấm nút lấy Location và chọn bán kính")
      return
    }
    
    try {      
      const {supplierId, email} = await getSupplierFromStorage()      
      /* chua test
      await insertRefereeService(refereeName,        
        supplierId,
        latitude,
        longitude,
        address,
        radius)
        */
       /*da test ok */
       const {message } = await insertRefereeService("tt x",        
        supplierId,
        12.22,
        22.33,
        "nha xua x",
        50.00)        
      if(message.length  == 0) {
        alertWithOKButton("Insert referee service successfully", () => {
          this.props.stackNavigation.dispatch(NavigationActions.back())
        })      
      } else {
        alertWithOKButton(message, null)
      }      
    } catch(error) {
      alert('Cannot get data from Server'+error)
    } 
    
  }
  _onPressDateTextInput = async () => {
    try {
      debugger;
      if (isIOS ()) {
        this.setState ({showIOSDatePicker: true});
        return;
      }
      const {action, year, month, day} = await DatePickerAndroid.open ({
        date: new Date (),
        mode: 'spinner',
      });
      let selectedDate = new Date (year, month, day);
      let today = new Date ();
      if (action === DatePickerAndroid.dateSetAction) {
        this.setState ({
          dateOfBirth: selectedDate,
          stringDateOfBirth: convertDayMonthYearToString (day, month, year),
          age: daysBetween2Dates (today, selectedDate),
        });
      }
    } catch ({code, message}) {
      console.warn ('Cannot open date picker', message);
    }
  }
  render() {    
    const {
      name,
      age,
      dateOfBirth,
      phoneNumber,
      stringDateOfBirth,
      showIOSDatePicker,
    } = this.state;
    const {
      address = '',
      district = '',
      province = '',
    } = this.state.currentLocation;
    const { isAddress } = this.state    
    const {radius} = this.state

    return (
      <SafeAreaView style={styles.container}>
        <Header title={'RefereeService'} />
        <Text style={{ fontSize: 20, marginVertical: 20 }}>
          Đăng ký dịch vụ trọng tài
        </Text>
        <View style={styles.personalInformation}>
          <Text style={styles.textLabel}>
            Tên:
          </Text>
          <TextInput
            style={styles.textInput}
            placeholder={'Please enter name'}
          />
        </View>
        <View style={styles.personalInformation}>
          <Text style={styles.textLabel}>
            SDT:
          </Text>
          <TextInput
            style={styles.textInput}
            placeholder={'Please enter phone number'}
            keyboardType={'number-pad'}
          />
        </View>
        <View style={styles.dateTime}>
            <Text style={styles.textLabel}>
              Tuổi:
            </Text>
            <TouchableOpacity
              style={[
                styles.textInput,
                {width: '40%'},
                isIOS () && {paddingTop: 10},
              ]}
              onPress={() => {
                this._onPressDateTextInput ();
              }}
            >
              <TextInput
                keyboardType={'default'}
                placeholder={'dd/mm/yyyy'}
                editable={false}
                value={stringDateOfBirth}
                onPress={() => {
                  this._onPressDateTextInput ();
                }}
                // value={"djsijhd"}
              />
            </TouchableOpacity>
            <Text style={styles.age}>
              {this._displayAge (age)}
            </Text>
          </View>
        <TouchableOpacity onPress={() => {
          this._pressLocation()
        }}
        style={styles.buttonGetLocation}
        >
          <Text style={styles.textGetLocation}> Get Location</Text>
          <Image source={require("../images/placeholder.png")} style={{height:30,width:30}}/>
        </TouchableOpacity>
        {(address.length > 0 || district.length > 0 || province.length > 0)
          && <Text>{address} - {district} - {province}</Text>}
          <View style={styles.radiusInput}>
          <Text style={styles.textLabelRadius}>
            Bán kính phục vụ:
          </Text>
          <View style={styles.dropDownRadius}>            
            <TextInput placeholder="Radius ?"></TextInput>
          </View>

        </View>
        <TouchableOpacity style={styles.btnSubmit} onPress={() => {
          this._insertRefereeService()
        }}>
          <Text style={styles.txtSubmit}>Submit</Text>
        </TouchableOpacity>
        {isIOS () &&
          showIOSDatePicker &&
          <View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                height: 40,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  this.setState ({showIOSDatePicker: false});
                }}
              >
                <Text>Save</Text>
              </TouchableOpacity>
            </View>
            <DatePicker
              mode={'date'}
              date={this.state.dateOfBirth}
              onDateChange={dateOfBirth => {
                const today = new Date ();
                this.setState ({
                  dateOfBirth,
                  stringDateOfBirth: convertDateToString (dateOfBirth),
                  age: daysBetween2Dates (today, dateOfBirth),
                });
              }}
            />
          </View>}
      </SafeAreaView>
    )
  }
}
const mapStateToProps = state => ({
  //convert "global object"(shared state) => ServiceRegister's props
  stackNavigation: state.navigationReducers.stackNavigation,
  tabNavigation: state.navigationReducers.tabNavigation
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
  },
  dateTime: {
    flexDirection: 'row',
    height: 60,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textLabel: {
    width: '20%',
    height: 40,
    lineHeight: 40,
    paddingStart: 30,
  },
  textInput: {
    width: '80%',
    height: 40,
    borderRadius: 5,
    borderColor: 'black',
    marginEnd: 30,
    borderWidth: 1,
    paddingHorizontal: 10,
    color: 'black',
  },
  btnSubmit: {
    height: 60,
    width: 200,
    backgroundColor: '#7FFFD4',
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
    alignItems: 'center'
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
  },
});
