import React, {Component} from 'react';
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
} from 'react-native';
import Header from './Header';
import {
  daysBetween2Dates,
  getSupplierFromStorage,
  convertDayMonthYearToString,
  saveSupplierToStorage,
  isIOS,
  convertDateToString,
  setPosition,
  getPosition
} from '../helpers/Helpers';
import {
  getAddressFromLatLong,
  checkLocationPermission,
} from '../server/googleServices';
import {
  getSupplierServicesOrders,
  postUploadPhoto,
} from '../server/myServices'

import DatePicker from 'react-native-date-picker';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import Geolocation from 'react-native-geolocation-service'
import ImagePicker from 'react-native-image-crop-picker';

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
    dateOfBirth: new Date (),
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
  _saveSettings() {
    alert("aa")
  }
  async componentDidMount () {    
    const {supplierId, email} = await getSupplierFromStorage()      
    //call api
    
    try {  
        const { data, message} =  await getSupplierServicesOrders(supplierId)        
        const { name, position, dateOfBirth, phoneNumber, 
                dateOfBirthObject, radius,address, playerName = '',
                refereeName = '',
              } = data
                
        const {day, month, year} = dateOfBirthObject        
        const {isGK, isCB, isMF, isCF} = setPosition(position)
        //
        
        this.setState({
          isGK, isCB, isMF, isCF,          
          name, position, phoneNumber,radius, playerName, refereeName,
          stringDateOfBirth: convertDayMonthYearToString(day, month, year),
          currentLocation: {
            address
          }
        })
    } catch (error) {               
        alert(`Cannot getSupplierServicesOrders. error = ${error}`)
    }
    

  }
  async _chooseAvatar () {
    try {
      let photos = await ImagePicker.openPicker({
        multiple: true
      })
      const { data, message=''} = await postUploadPhoto(photos)      
    } catch(error) {
      alert(`Cannot upload avatar: ${error}`)
    }    
  }  
  _displayAge (age) {
    if (age > 0) {
      return age > 1 ? `${age} ages` : `${age} age`;
    } else {
      return '';
    }
  }
  _onPressDateTextInput = async () => {
    try {
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
  };
  _pressLocation = async () => {
    const hasLocationPermission = await checkLocationPermission ();
    if (hasLocationPermission) {
      Geolocation.getCurrentPosition (
        async position => {
          const {latitude, longitude} = position.coords;
          const {
            address = '',
            district = '',
            province = '',
          } = await getAddressFromLatLong (latitude, longitude);

          this.setState ({
            currentLocation: {address, district, province, latitude, longitude},
          });
        },
        error => {
          console.log (error.code, error.message);
        },
        {enableHighAccuracy: true, timeout: 5000, maximumAge: 10000}
      );
    }
  };
  _navigateToServiceRegister = () => {
    let params = {};
    this.props.navigation.navigate ('ServiceRegister', params);
  };
  render () {
    const {
      name,
      age,
      dateOfBirth,
      phoneNumber,
      radius, avatar,    
      position,  
      isGK, isCB, isMF, isCF,
      playerName,refereeName,
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
        <Header title={'Quản Lý Tài Khoản'} pressBackButton={() => {
          this._saveSettings()
        }}/>
        <View style={styles.avatar}>
          <TouchableOpacity
            onPress={() => {
              this._chooseAvatar ();
            }}
          >
            <Image
              source={
                avatar.length > 0
                  ? {uri: avatar}
                  : require ('../images/defaultAvatar.png')
              }
              style={styles.avatarImage}
            />
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.scrollView}>

          <View style={styles.personalInformation}>
            <Text style={styles.textLabel}>
              Tên:
            </Text>
            <TextInput
              style={styles.textInput}
              placeholder={'Please enter name'}
              value={name}
              onChangeText={name => {
                this.setState ({name});
              }}
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
          <View style={styles.personalInformation}>
            <Text style={styles.textLabel}>
              SĐT:
            </Text>
            <TextInput
              style={styles.textInput}
              placeholder={'Please enter phone'}
              keyboardType={'phone-pad'}
              value={phoneNumber}
              onChangeText={phoneNumber => {
                this.setState ({phoneNumber});
              }}
            />
          </View>
          {/* Quan ly dich vu */}
          <View style={styles.serviceArea}>
            <View style={{height: 50}}>
              <TouchableOpacity
                onPress={() => {
                  this._pressLocation ();
                }}
                style={styles.buttonGetLocation}
              >
              {(address.length > 0 || district.length > 0 || province.length > 0) &&
                <Text>{address} - {district} - {province}</Text>}
                <FontAwesome5
                  name={'map-marker-alt'}
                  size={30}
                  color={'black'}
                />
              </TouchableOpacity>

            </View>
            <View style={styles.radius}>
              <Text style={styles.radiusLabel}>
                Bán kính làm việc:
              </Text>
              <TextInput
                style={styles.radiusInput}
                placeholder={'Enter radius'}
                keyboardType={'numeric'}
                value={`${radius}`}
                onChangeText={radius => {
                  this.setState ({radius});
                }}
              />
            </View>
          </View>
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
          {/* get location  */}
          {/* ban kinh */}
          {playerName.length > 0 && <View
            style={{
              borderRadius: 5,
              borderWidth: 1,
              borderColor: 'black',
              alignItems: 'center',
            }}
          >
            
            <View style={styles.personalInformation}>
              <Text style={styles.textLabel}>Role: </Text>              
              <TextInput style={[styles.textRole, {backgroundColor: 'red'}]} 
                  value={playerName} onChangeText={(playerName) => {
                    this.setState({playerName})
              }} />              
            </View>
            <View style={styles.personalInformation}>
                <Text style={styles.textLableReferee}>Completed : </Text>
                <Text style={styles.textRolereferee}> 11</Text>
              </View>
            <Text style={{marginBottom: 5,fontSize:20}}>Position</Text>
            <View style={styles.positions}>
              <TouchableOpacity
                style={styles.eachPosition}
                onPress={() => {
                  this.setState ({isGK: !this.state.isGK});
                }}
              >
                <Text>GK</Text>
                <FontAwesome5
                  name={isGK == true ? 'check-square' : 'square'}
                  size={35}
                  color={'black'}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.eachPosition}
                onPress={() => {
                  this.setState ({isCB: !this.state.isCB});
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
                  this.setState ({isMF: !this.state.isMF});
                }}
              >
                <Text>MF</Text>
                <FontAwesome5
                  name={isMF == true ? 'check-square' : 'square'}
                  size={35}
                  color={'black'}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.eachPosition}
                onPress={() => {
                  this.setState ({isCF: !this.state.isCF});
                }}
              >
                <Text>CF</Text>
                <FontAwesome5
                  name={isCF == true ? 'check-square' : 'square'}
                  size={35}
                  color={'black'}
                />
              </TouchableOpacity>
            </View>
              </View> }
          {refereeName.length > 0 && <View
            style={{
              borderRadius: 5,
              borderWidth: 1,
              borderColor: 'black',
              alignItems: 'center',
            }}
          >
            <View style={styles.personalInformation}>
              <Text style={styles.textLableReferee}>Referee name: </Text>
              <TextInput style={[styles.textRole, {backgroundColor: 'red'}]} 
                  value={refereeName} onChangeText={(refereeName) => {
                    this.setState({refereeName})
              }} />              
            </View>
            <View style={styles.personalInformation}>
              <Text style={styles.textLableReferee}>Completed : </Text>
              <Text style={styles.textRolereferee}> 11</Text>
            </View>
          </View>}
        </ScrollView>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create ({
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
    height: 60,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  personalInformation: {
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
    fontSize: 20,
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
    paddingStart: 30,
    fontSize: 20,
  },
  radiusInput: {
    height: 40,
    borderRadius: 5,
    borderColor: 'black',
    marginEnd: 30,
    borderWidth: 1,
    paddingHorizontal: 10,
    color: 'black',
    width: 100,
  },
  age: {
    width: '40%',
    height: 60,
    lineHeight: 60,
  },
  textRole: {
    width: '80%',
    height: 40,
    marginEnd: 30,
    color: 'black',
    lineHeight: 40,
    fontSize:15,
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

  textRolereferee: {
    width: '60%',
    height: 40,
    marginEnd: 30,
    color: 'black',
    lineHeight: 40,
    fontSize:20
  },
  textLableReferee: {
    width: '40%',
    height: 40,
    lineHeight: 40,
    paddingStart: 30,
    fontSize:20
  },
});
