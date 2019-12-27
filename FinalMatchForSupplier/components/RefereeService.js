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
import { getSupplierFromStorage, saveSupplierToStorage, alertWithOKButton, alert } from '../helpers/Helpers'
import { insertRefereeService, getSupplierById } from '../server/myServices'
import Header from './Header'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Geolocation from 'react-native-geolocation-service'
import { connect } from 'react-redux'
import { NavigationActions } from 'react-navigation'
import {MAIN_COLOR} from '../colors/colors';
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


export class RefereeService extends Component {
  static navigationOptions = {
    header: null,
  };
  state = {
    age: 0,
    refereeName: '',
    phoneNumber: '',
    dateOfBirth: new Date(),
    stringDateOfBirth: '',    
    showIOSDatePicker: false,
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
    const {refereeName, radius, phoneNumber, dateOfBirth} = this.state    
    const {address,latitude, longitude} = this.state.currentLocation
    const { supplierId, email } = await getSupplierFromStorage()      

    if (latitude == 0.0 || longitude == 0.0 || radius == 0.0) {
      alertWithOKButton("Bạn phải nút bấm nút lấy Location và chọn bán kính")
      return
    }
    try {          
      const {message} = await insertRefereeService(refereeName,
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
  _onPressDateTextInput = async () => {
    try {
      ;
      if (isIOS()) {
        this.setState({ showIOSDatePicker: true });
        return;
      }
      const { action, year, month, day } = await DatePickerAndroid.open({
        date: new Date(),
        mode: 'spinner',
      });
      let selectedDate = new Date(year, month, day);
      let today = new Date();
      if (action === DatePickerAndroid.dateSetAction) {
        this.setState({
          dateOfBirth: selectedDate,
          stringDateOfBirth: convertDayMonthYearToString(day, month, year),
          age: daysBetween2Dates(today, selectedDate),
        });
      }
    } catch ({ code, message }) {
      console.warn('Cannot open date picker', message);
    }
  }
  render() {
    const {
      refereeName,
      age,
      dateOfBirth,
      phoneNumber,
      stringDateOfBirth,
      showIOSDatePicker,
      radius
    } = this.state
    const {
      address = '',
      district = '',
      province = '',
    } = this.state.currentLocation

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
            value={refereeName}
            onChangeText={(refereeName) => {
              this.setState({refereeName})
            }}
            placeholder={'Please enter name'}
          />
        </View>
        <View style={styles.personalInformation}>
          <Text style={styles.textLabel}>
            SDT:
          </Text>
          <TextInput
            style={styles.textInput}
            value={phoneNumber}
            onChangeText={(phoneNumber) => {
              this.setState({phoneNumber})
            }}
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
              { width: '40%' },
              isIOS() && { paddingTop: 10 },
            ]}
            onPress={() => {
              this._onPressDateTextInput();
            }}
          >
            <TextInput
              keyboardType={'default'}
              placeholder={'dd/mm/yyyy'}
              editable={false}
              value={stringDateOfBirth}
              onPress={() => {
                this._onPressDateTextInput();
              }}
            // value={"djsijhd"}
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
          && <Text>{address} - {district} - {province}</Text>}
        <View style={styles.radiusInput}>
          <Text style={styles.textLabelRadius}>
            Bán kính phục vụ:
          </Text>
          <View style={styles.dropDownRadius}>
            <TextInput placeholder="Radius ?" 
            onChangeText = {(text) => {
              this.setState({radius: parseInt(text)})
            }}
            value={`${radius}`}>

            </TextInput>
          </View>

        </View>
        <TouchableOpacity style={styles.btnSubmit} onPress={() => {
          this._insertRefereeService()
        }}>
          <Text style={styles.txtSubmit}>Submit</Text>
        </TouchableOpacity>
        {isIOS() &&
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
                  this.setState({ showIOSDatePicker: false });
                }}
              >
                <Text>Save</Text>
              </TouchableOpacity>
            </View>
            <DatePicker
              mode={'date'}
              date={dateOfBirth}
              onDateChange={dateOfBirth => {
                const today = new Date();
                this.setState({
                  dateOfBirth,
                  stringDateOfBirth: convertDateToString(dateOfBirth),
                  age: daysBetween2Dates(today, dateOfBirth),
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
