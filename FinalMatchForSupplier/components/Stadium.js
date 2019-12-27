import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import Header from './Header';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Geolocation from 'react-native-geolocation-service';
import {
  getAddressFromLatLong,
  checkLocationPermission,
} from '../server/googleServices';
import {MAIN_COLOR,COLOR_BUTTON} from '../colors/colors';
export default class Stadium extends Component {
  static navigationOptions = {
    header: null,
  };
  state = {
    isFree: false,
    currentLocation: {
      address: '',
      district: '',
      province: '',
    },
  };
  _isOnpressSubmit = () => {
    alert ('hihi');
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
          this.setState ({currentLocation: {address, district, province}});
        },
        error => {
          console.log (error.code, error.message);
        },
        {enableHighAccuracy: true, timeout: 5000, maximumAge: 10000}
      );
    }
  };

  render () {
    const {isFree} = this.state;
    const {address, district, province} = this.state.currentLocation;
    return (
      <SafeAreaView style={styles.container}>
        <Header title={'Stadium'} pressBackButton={() => {
        }} />
        <Text style={{fontSize: 20, marginVertical: 20}}>Đăng ký sân bóng</Text>
        <View style={styles.personalInformation}>
          <Text style={styles.textLabel}>
            Tên:
          </Text>
          <TextInput
            style={styles.textInput}
            placeholder={'Please enter name'}
          />
        </View>

        {isFree === true
          ? 
              <View style={styles.txtAddresses}>
                <Text style={styles.txtDC}>
                  Đ/C:
                </Text>
                <Text
                  style={styles.txtShowAddresses}
                  
                >Click get location</Text>
                <TouchableOpacity
                onPress={() => {
                  this._pressLocation ();
                }}
                style={styles.buttonGetLocation}
              >
                <FontAwesome5
                  name={'map-marker-alt'}
                  size={30}
                  color={MAIN_COLOR}
                />
              </TouchableOpacity>

              {(address.length > 0 ||
                district.length > 0 ||
                province.length > 0) &&
                <Text>{address} - {district} - {province}</Text>}
              </View>
          : 
        <View style={{width:'100%'}}>        
          <View style={styles.personalInformation}>
              <Text style={styles.textLabel}>
                SĐT:
              </Text>
              <TextInput
                style={styles.textInput}
                placeholder={'Please enter phone number'}
                keyboardType={'number-pad'}
              />
              
            </View>
            <View style={styles.personalInformation}>
              <Text style={styles.textLabel}>
                Đ/C:
              </Text>
              <TextInput
                style={styles.textInput}
                placeholder={'Please enter address'}
              />
              
            </View>
        </View>  
            
            }
        <Text style={{fontSize: 20, fontWeight: 'bold', marginVertical: 20}}>
          Loại hình
        </Text>
        <View style={styles.positions}>
          <TouchableOpacity
            style={styles.eachPosition}
            onPress={() => {
              this.setState ({isFree: true});
            }}
          >
            <Text style={styles.txtFree}>Miễn phí</Text>
            <FontAwesome5
              name={isFree == true ? 'check-square' : 'square'}
              size={35}
              color={MAIN_COLOR}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.eachPosition}
            onPress={() => {
              this.setState ({isFree: false});
            }}
          >
            <Text style={styles.txtFree}>Thu phí</Text>
            <FontAwesome5
              name={isFree == false ? 'check-square' : 'square'}
              size={35}
              color={MAIN_COLOR}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.btnSubmit}
          onPress={() => {
            this._isOnpressSubmit ();
          }}
        >
          <Text style={styles.txtSubmit}>Submit</Text>
        </TouchableOpacity>

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
    fontSize: 17,
  },
  textInput: {
    width: '80%',
    height: 45,
    borderRadius: 5,
    borderColor: 'black',
    marginEnd: 30,
    borderWidth: 1,
    paddingHorizontal: 10,
    color: 'black',
    fontSize: 17,
  },
  positions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: 70,
    width: '100%',
  },
  btnSubmit: {
    height: 60,
    width: 200,
    backgroundColor: MAIN_COLOR,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 30,
    borderWidth: 4,
    borderColor:COLOR_BUTTON
  },
  txtSubmit: {
    lineHeight: 60,
    fontWeight: 'bold',
    fontSize: 20,
    color: 'white',
  },
  txtAddresses: {
    flexDirection: 'row',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  txtDC: {
    width: '20%',
    height: 40,
    lineHeight: 40,
    paddingStart: 30,
    fontSize: 17,
  },
  txtShowAddresses: {
    width: '60%',
    height: 45,
    borderRadius: 5,
    borderColor: 'black',
    marginEnd: 20,
    borderWidth: 1,
    paddingHorizontal: 10,
    color: 'black',
    fontSize: 17,
    lineHeight:45
  },buttonGetLocation:{
    width: '20%',
  },txtFree:{
    marginBottom:10,fontSize:17
  }
});
