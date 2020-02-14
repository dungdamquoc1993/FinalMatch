import React, { Component } from 'react';
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  DatePickerAndroid,
  TextInput,
  Image,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  CameraRoll,
  Alert,
  Platform
} from 'react-native';
import Header from './Header';
import {
  daysBetween2Dates,
  getSupplierFromStorage,
  convertDayMonthYearToString,
  isIOS,
  convertDateToString,
  setPosition,
  getPosition,
  alert,
  convertDateToStringYYYYMMDD
} from '../helpers/Helpers';
import {
  getAddressFromLatLong,
  checkLocationPermission,
} from '../server/googleServices';
import {
  getSupplierServicesOrders,
  postUploadPhoto,
  updateSettings,
} from '../server/myServices'
import { urlGetAvatar } from '../server/urlNames'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import Geolocation from 'react-native-geolocation-service'
import ImagePicker from 'react-native-image-crop-picker';
import { COLOR_BUTTON, COLOR_GREEN, MAIN_COLOR } from '../colors/colors';
import { NavigationEvents } from 'react-navigation'

/**
 * yarn add react-native-date-picker
 * 
 * Down project:
 * 1.rm -rf node_modules
 * 2.yarn install
 * 3.react-native link
 */

export default class Settings extends Component {

  state = {
    supplierId: 0,
    playerPrice: 3000,
    refereePrice: 100000,
    playerId: 0,
    refereeId: 0,
    name: '',
    point: null,
    phoneNumber: '',
    facebookId: '',
    email: '',
    userType: 'default',
    address: '',
    playerName: '',
    position: '0000',
    refereeName: '',
    orderId: 0,
    customerId: '',
    orderPoint: null,
    status: '',
    typeRole: '',
    dateTimeStart: new Date(),
    dateTimeEnd: new Date(),
    avatar: '',
    age: '',
    dateOfBirth: new Date(),
    stringDateOfBirth: '',
    showIOSDatePicker: false,
    isGK: false,
    isCB: false,
    isMF: false,
    isCF: false,
    currentLocation: {
      address: '',
      province: '',
      latitude: 0.0,
      longitude: 0.0,
    },
    radius: 0.0,
  };
  _saveSettings = async () => {
    const { supplierId } = this.state
    const {
      name,
      playerPrice,
      refereePrice,
      avatar,
      dateOfBirth,
      phoneNumber,
      radius,
      playerName,
      refereeName } = this.state
    const { address, latitude, longitude, district, province } = this.state.currentLocation
    let position = getPosition({
      isGK: this.state.isGK,
      isCB: this.state.isCB,
      isMF: this.state.isMF,
      isCF: this.state.isCF
    })

    await updateSettings(
      supplierId,
      playerPrice,
      refereePrice,
      name,
      avatar,
      convertDateToStringYYYYMMDD(dateOfBirth),
      phoneNumber,
      address,
      latitude,
      longitude,
      radius,
      playerName,
      position,
      refereeName)
  }

  onScreenFocus = () => {
    // Screen was focused, our on focus logic goes here    
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    return true
  }
  validateInput() {
    const { phoneNumber } = this.state
    if (phoneNumber.trim().length == 0) {
      alert("Please enter phone number")
      return false
    }
    return true
  }
  componentWillUnmount() {
  }
  componentDidCatch(error, errorInfo) {

  }
  reloadDataFromServer = async () => {
    const { supplierId, email } = await getSupplierFromStorage()
    //call api    
    try {
      const { data, message } = await getSupplierServicesOrders(supplierId)
      const { name,
        playerPrice,
        refereePrice,
        position, phoneNumber, avatar,
        dateOfBirthObject, radius, address, playerName = '',
        refereeName = '', playerId, refereeId,
        latitude, longitude
      } = data
      const { day, month, year } = dateOfBirthObject
      let selectedDate = new Date(year, month, day)
      const { isGK, isCB, isMF, isCF } = setPosition(position)
      this.setState({
        name,
        playerPrice,
        refereePrice,
        isGK, isCB, isMF, isCF,
        avatar, position, phoneNumber, radius, playerName, refereeName, supplierId,
        playerId, refereeId,
        stringDateOfBirth: convertDayMonthYearToString(day, month, year),
        selectedDate,
        dateOfBirth: selectedDate,
        currentLocation: {
          address,
          latitude, longitude
        }
      })
    } catch (error) {
      alert(`Cannot getSupplierServicesOrders. error = ${JSON.stringify(error)}`)
    }
  }
  async componentDidMount() {
    // this.reloadDataFromServer()    
  }
  async _chooseAvatar() {
    try {
      let photos = await ImagePicker.openPicker({
        multiple: true
      })
      const { supplierId } = this.state
      const { data, message = '' } = await postUploadPhoto(photos, supplierId)
      this.setState({ avatar: typeof data == "object" ? data[0] : data })
    } catch (error) {
      alert(`Cannot upload avatar: ${JSON.stringify(error)}`)
    }
  }
  _displayAge(age) {
    if (age > 0) {
      return age > 1 ? `${age} ages` : `${age} age`;
    } else {
      return '';
    }
  }
  _onPressDateTextInput = async () => {
    try {
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
  };
  _pressLocation = async () => {
    const hasLocationPermission = await checkLocationPermission();
    if (hasLocationPermission) {
      Geolocation.getCurrentPosition(
        async position => {
          const { latitude, longitude } = position.coords;
          const {
            address = '',
            district = '',
            province = '',
          } = await getAddressFromLatLong(latitude, longitude);

          this.setState({
            currentLocation: { address, district, province, latitude, longitude },
          });
        },
        error => {
          console.log(error.code, error.message);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 10000 }
      );
    }
  };
  _navigateToServiceRegister = () => {
    let params = {};
    this.props.navigation.navigate('ServiceRegister', params);
  };
  render() {
    const {
      name,
      playerPrice,
      refereePrice,
      age,
      playerId,
      refereeId,
      dateOfBirth,
      phoneNumber,
      radius, avatar,
      position,
      isGK, isCB, isMF, isCF,
      playerName,
      refereeName,
      stringDateOfBirth,
      showIOSDatePicker,
    } = this.state;

    const {
      address = '',
      district = '',
      province = '',
    } = this.state.currentLocation;
    return (
      <SafeAreaView style={styles.container}>
        <Header title={'Quản Lý Tài Khoản'} pressBackButton={async () => {
          if (this.validateInput() == true) {
            await this._saveSettings()
            return true
          }
          return false
        }} />
        <NavigationEvents
          onWillFocus={payload => {
            this.reloadDataFromServer()
          }}
        />
        <View style={styles.avatar}>
          <TouchableOpacity
            onPress={() => {
              this._chooseAvatar();
            }}
          >
            <Image
              source={
                avatar.length > 0
                  ? { uri: urlGetAvatar(avatar) }
                  : require('../images/defaultAvatar.png')
              }
              style={styles.avatarImage}
            />
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.scrollView}>

          <View style={styles.personalInformation}>
            <Text style={styles.textLabel}>
              Tên
            </Text>
            <TextInput
              style={styles.textInput}
              placeholder={'Please enter name'}
              value={name}
              onChangeText={name => {
                this.setState({ name });
              }}
            />
          </View>
          <View style={styles.personalInformation}>
            <Text style={styles.textLabel}>
              Tuổi
            </Text>
            <TouchableOpacity
              style={[
                styles.textInput,
                { width: '40%', zIndex: 100 },
                isIOS() && { paddingTop: 10 },
              ]}
              onPress={() => {
                this._onPressDateTextInput();
              }}
            >
              <Text
                keyboardType={'default'}
                onPress={() => {
                  this._onPressDateTextInput();
                }}
                style={{textAlign:'center',lineHeight:35}}
              // value={"djsijhd"}
              >{stringDateOfBirth.length > 0 ? stringDateOfBirth : 'dd/mm/yyyy'}</Text>
            </TouchableOpacity>
            <Text style={styles.age}>
              {this._displayAge(age)}
            </Text>
          </View>
          <View style={styles.personalInformation}>
            <Text style={styles.textLabel}>
              SĐT
            </Text>
            <TextInput
              style={styles.textInput}
              placeholder={'Please enter phone'}
              keyboardType={'phone-pad'}
              value={phoneNumber}
              onChangeText={phoneNumber => {
                this.setState({ phoneNumber });
              }}
            />
          </View>
          {/* Quan ly dich vu */}
          <View style={styles.serviceArea}>
            <View style={{ height: 50,width:'80%' }}>
              <TouchableOpacity
                onPress={() => {
                  this._pressLocation();
                }}
                style={styles.buttonGetLocation}
              >
                {(address.length > 0 || district.length > 0 || province.length > 0) &&
                  <Text style={{ marginRight: 7, fontSize: 17, }}>{address} - {district} - {province}</Text>}
                <Image source={require("../images/placeholder.png")} style={{ height: 30, width: 30 }} />
              </TouchableOpacity>

            </View>
            <View style={styles.radius}>
              <Text style={styles.radiusLabel}>
                Bán kính làm việc
              </Text>
              <TextInput
                style={styles.radiusInput}
                placeholder={'Radius'}
                keyboardType={'numeric'}
                value={`${radius}`}
                onChangeText={radius => {
                  this.setState({ radius });
                }}
              />
              <Text style={{ fontSize: 17, height: 40, lineHeight: 40, marginLeft: 5,width:'10%' }}>
                KM
              </Text>
            </View>
           
          </View>
          {isIOS() &&
            showIOSDatePicker &&
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  height: 20,
                }}
              >
                <TouchableOpacity
                  style={{
                    backgroundColor: MAIN_COLOR,
                    padding: 10,
                    margin: 10,
                    borderRadius: 5,
                    height: 40,
                    paddingHorizontal: 20,
                    alignItems: 'center'
                  }}
                  onPress={() => {
                    this.setState({ showIOSDatePicker: false });
                  }}
                >
                  <Text style={{ fontSize: 15}}>Save</Text>
                </TouchableOpacity>
              </View>
              <DatePicker
                mode={'date'}
                date={this.state.dateOfBirth}
                style={{
                  justifyContent: "center",
                  alignSelf: "center"
                }}
                onDateChange={dateOfBirth => {
                  const today = new Date();
                  this.setState({
                    dateOfBirth,
                    stringDateOfBirth: convertDateToString(dateOfBirth),
                    age: daysBetween2Dates(today, dateOfBirth),
                  });
                }}
              />

            </View>
          }

          {/* get location  */}
          {/* ban kinh */}
          {playerId > 0 && <View
            style={{
              alignItems: 'center',
              borderWidth: 1,
              borderColor: '#d3d3d3',
              borderRadius: 15,
              marginVertical: 10,
              marginHorizontal: 5,
            }}
          >

            <View style={styles.personalInformation}>
              <Text style={styles.textRole}>Cầu thủ</Text>
              <TextInput style={styles.textInputRole}
                value={playerName} onChangeText={(playerName) => {
                  this.setState({ playerName })
                }} />
            </View>
            <View style={styles.personalInformation}>
              <Text style={styles.textRole}>Số trận</Text>
              <Text style={styles.textInputRole}> 0</Text>
            </View>
            <Text style={{ marginBottom: 5, fontSize: 20 }}>Position</Text>
            <View style={styles.positions}>
              <TouchableOpacity
                style={styles.eachPosition}
                onPress={() => {
                  this.setState({ isGK: !this.state.isGK });
                }}
              >
                <Text style={{}}>GK</Text>
                <FontAwesome5
                  name={isGK == true ? 'check-square' : 'square'}
                  size={35}
                  color={'black'}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.eachPosition}
                onPress={() => {
                  this.setState({ isCB: !this.state.isCB });
                }}
              >
                <Text>CB</Text>
                <FontAwesome5
                  name={isCB == true ? 'check-square' : 'square'}
                  size={35}
                  color={'black'}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.eachPosition}
                onPress={() => {
                  this.setState({ isMF: !this.state.isMF });
                }}
              >
                <Text style={{}}>MF</Text>
                <FontAwesome5
                  name={isMF == true ? 'check-square' : 'square'}
                  size={35}
                  color={'black'}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.eachPosition}
                onPress={() => {
                  this.setState({ isCF: !this.state.isCF });
                }}
              >
                <Text style={{}}>CF</Text>
                <FontAwesome5
                  name={isCF == true ? 'check-square' : 'square'}
                  size={35}
                  color={'black'}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.personalInformation}>
              <Text style={styles.textRole}>Giá</Text>
              <TextInput style={styles.textInputRole}
                value={`${playerPrice}`} onChangeText={(playerPrice) => {
                  this.setState({ playerPrice: isNaN(playerPrice) == false ? playerPrice : parseFloat(playerPrice) })
                }} />
            </View>
          </View>}
          
          {refereeId > 0 && <View
            style={{
              alignItems: 'center',
              borderWidth: 1,
              borderColor: '#d3d3d3',
              borderRadius: 15,
              marginVertical: 10,
              marginHorizontal: 5,
            }}
          >
            <View style={styles.personalInformation}>
              <Text style={styles.textRole}>Trọng tài</Text>
              <TextInput style={styles.textInputRole}
                value={refereeName} onChangeText={(refereeName) => {
                  this.setState({ refereeName })
                }} />
            </View>
            <View style={styles.personalInformation}>
              <Text style={styles.textRole}>Số trận</Text>
              <Text style={styles.textInputRole}>0</Text>
            </View>
            <View style={styles.personalInformation}>
              <Text style={styles.textRole}>Giá </Text>
              <TextInput style={styles.textInputRole}
                value={`${refereePrice}`} onChangeText={(refereePrice) => {
                  this.setState({ refereePrice: isNaN(refereePrice) == false ? refereePrice : parseFloat(refereePrice) })
                }} />
            </View>

          </View>}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  scrollView: {
    width: '100%',
    margin: 3,
    padding: 5,
  },

  dateTime: {
    flexDirection: 'row',
    lineHeight:60,
    height: 60,
    width: '100%',
    justifyContent: 'center',
    textAlign: 'center'

  },
  personalInformation: {
    flexDirection: 'row',
    height: 60,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textLabel: {
    width: '30%',
    height: 45,
    lineHeight: 45,
    paddingStart: 30,
    fontSize: 20,
    
  },

  textInput: {
    width: '70%',
    height: 45,
    borderRadius: 10,
    borderColor: '#d3d3d3',
    marginEnd: 30,
    borderWidth: 1,
    paddingHorizontal: 10,
    color: 'black',
    fontSize: 17,
    
  },
  radius: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    height: 50,
    padding: 5,
    margin: 2,
  },
  serviceArea: {
    flexDirection: 'column',
    height: 60,
    width: '100%',
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radiusLabel: {
    height: 40,
    lineHeight: 40,
    fontSize: 20,
    width:'60%',
    paddingStart:10,
    
  },
  radiusInput: {
    height: 45,
    borderRadius: 10,
    borderColor: '#d3d3d3',
    borderWidth: 1,
    textAlign: 'center',
    color: 'black',
    width: '30%',
    fontSize: 17,
    
  },
  age: {
    width: '30%',
    height: 60,
    lineHeight: 60,
    textAlign:'center',
    
  },
  textInputRole: {
    width: '50%',
    height: 45,
    borderRadius: 10,
    borderColor: '#d3d3d3',
    marginEnd: 30,
    borderWidth: 1,
    paddingHorizontal: 20,
    color: 'black',
    fontSize: 17,
    
  },
  textRole: {
    width: '50%',
    height: 45,
    lineHeight: 40,
    paddingStart: 30,
    fontSize: 20,
    
  },
  positions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: 60,
    width: '100%',
    
  },
  eachPosition: {
    flexDirection: 'column',
    width: 90,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonGetLocation: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginVertical: 10,
  },

});
