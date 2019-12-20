import React, {Component} from 'react';
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  DatePickerAndroid,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import Header from './Header';
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

import DatePicker from 'react-native-date-picker';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Geolocation from 'react-native-geolocation-service';

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
    age: '',
    dateOfBirth: new Date (),
    stringDateOfBirth: '',
    phoneNumber: '',
    showIOSDatePicker: false,
    isGK: false,
    isCB: false,
    isMF: false,
    isCF: false,
    currentLocation: {
      address: '',
      district: '',
      province: '',
      latitude: 0.0,
      longitude: 0.0,
    },
    radius: 0.0,
  };
  _displayAge (age) {
    if (age > 0) {
      return age > 1 ? `${age} ages` : `${age} age`;
    } else {
      return '';
    }
  }
  _onPressDateTextInput = async () => {
    try {
      ;
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
      stringDateOfBirth,
      showIOSDatePicker,
    } = this.state;
    const {
      address = '',
      district = '',
      province = '',
    } = this.state.currentLocation;
    const {radius} = this.state;
    const {isGK, isCB, isMF, isCF} = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <Header title={'Quản Lý Tài Khoản'} />

        <View style={styles.scrollView}>
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
            <View>

              <TouchableOpacity
                onPress={() => {
                  this._pressLocation();
                }}
                style={styles.buttonGetLocation} >
                <FontAwesome5 name={'map-marker-alt'} size={25} color={'black'} />
              </TouchableOpacity>
            </View>

            <View style = {styles.radius}>

              <Text style={styles.radiusLabel}>
                Bán kính làm việc:
            </Text>

              <TextInput
                style={styles.radiusInput}
                placeholder={'Enter radius'}
                keyboardType={'numeric'}
                value={radius}
                onChangeText={radius => {
                  this.setState({ radius });
                }}
              />
            </View>

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

        <ScrollView style={{width: '100%', height: 200}}>
          <View
            style={{
              borderRadius: 5,
              borderWidth: 1,
              borderColor: 'black',
              alignItems: 'center',
            }}
          >
            <View style={styles.personalInformation}>
              <Text style={styles.textLabel}>Role: </Text>
              <Text style={styles.textRole}>Cầu thủ</Text>
            </View>
            <Text style={{marginBottom: 5}}>Position</Text>
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
          </View>
          <View
            style={{
              borderRadius: 5,
              borderWidth: 1,
              borderColor: 'black',
              alignItems: 'center',
            }}
          >
            <View style={styles.personalInformation}>
              <Text style={styles.textLableReferee}>Role: </Text>
              <Text style={styles.textRolereferee}>Trọng tài</Text>
            </View>
            <View style={styles.personalInformation}>
              <Text style={styles.textLableReferee}>Completed watch: </Text>
              <Text style={styles.textRolereferee}>11</Text>
            </View>

          </View>

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
    backgroundColor: 'red'
  },
  textLabel: {
    width: '20%',
    height: 40,
    lineHeight: 40,
    paddingStart: 30,
    fontSize : 20
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
    justifyContent: "space-around",
    width: '100%',
    padding: 5,
    margin: 2,
    backgroundColor: 'blue'
  },
  radiusLabel: {
    height: 40,
    lineHeight: 40,
    paddingStart: 30,
    fontSize : 20  
  },
  radiusInput: {
    height: 40,
    borderRadius: 5,
    borderColor: 'black',
    marginEnd: 30,
    borderWidth: 1,
    paddingHorizontal: 10,
    color: 'black',
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
  serviceArea: {
    flexDirection: 'column',
    height: 60,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textRolereferee: {
    width: '60%',
    height: 40,
    marginEnd: 30,
    color: 'black',
    lineHeight: 40,
  },
  textLableReferee: {
    width: '40%',
    height: 40,
    lineHeight: 40,
    paddingStart: 30,
  },
});
