import React, {Component} from 'react';
import {connect} from 'react-redux';
import {NavigationActions} from 'react-navigation';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Image
} from 'react-native';
import Header from './Header';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Geolocation from 'react-native-geolocation-service';
import {
  getAddressFromLatLong,
  checkLocationPermission,
} from '../server/googleServices';
import {insertStadium} from '../server/myServices';
import {getSupplierFromStorage, alertWithOKButton} from '../helpers/Helpers';
import {MAIN_COLOR, COLOR_BUTTON} from '../colors/colors';

class Stadium extends Component {
  static navigationOptions = {
    header: null,
  };
  state = {
    type: 0,
    stadiumName: '',
    phoneNumber: '',
    supplierId: 0,
    currentLocation: {
      address: '',
      district: '',
      province: '',
      latitude: 0,
      longitude: 0,
    },
  };
  async componentDidMount () {
    const {supplierId} = await getSupplierFromStorage ();
    this.setState ({supplierId});
  }
  _isOnpressSubmit = async () => {
    //test
    const {supplierId, type, stadiumName, phoneNumber} = this.state;
    const {
      address,
      latitude,
      longitude,
      district,
      province,
    } = this.state.currentLocation;
    try {
      const {message} = await insertStadium (
        type,
        stadiumName,
        latitude,
        longitude,
        address,
        phoneNumber,
        supplierId
      );
      if (message.length > 0) {
        alertWithOKButton (`Cannot insert Stadium. Error = ${message}`, null);
      } else {
        alertWithOKButton ('Insert stadium successfully', () => {
          this.props.stackNavigation.dispatch (NavigationActions.back ());
        });
      }
    } catch (error) {
      alert ('Cannot get data from Server' + error);
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

  render () {
    const {type, stadiumName, phoneNumber} = this.state;
    const {
      address,
      latitude,
      longitude,
      district,
      province,
    } = this.state.currentLocation;
    return (
      <SafeAreaView style={styles.container}>
        <Header title={'Stadium'} pressBackButton={() => {}} />
        <View style={{marginTop: 20}} />
        <View style={styles.personalInformation}>
          <Text style={styles.textLabel}>
            Tên Sân Bóng :
          </Text>
          <TextInput
            style={styles.textInput}
            value={stadiumName}
            onChangeText={stadiumName => {
              this.setState ({stadiumName});
            }}
            placeholder={'Tên sân bóng'}
          />
        </View>

        {type == 0
          ? <View style={styles.txtAddresses}>
              <Text style={styles.txtDC}>
                Đ/C:
              </Text>
              <Text style={styles.txtShowAddresses}>
                {address.length > 0 ? address : 'Click get location'}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  this._pressLocation ();
                }}
                style={styles.buttonGetLocation}
              >
                <Image
                  source={require ('../images/placeholder.png')}
                  style={{height: 30, width: 30}}
                />
              </TouchableOpacity>
            </View>
          : <View style={{width: '100%'}}>
              <View style={styles.personalInformation}>
                <Text style={styles.textLabel}>
                  SĐT:
                </Text>
                <TextInput
                  style={styles.textInput}
                  placeholder={'Please enter phone number'}
                  keyboardType={'number-pad'}
                  value={phoneNumber}
                  onChangeText={phoneNumber => {
                    this.setState ({phoneNumber});
                  }}
                />

              </View>
              <View style={styles.personalInformation}>
                <Text style={styles.textLabel}>
                  Đ/C:
                </Text>
                <TextInput
                  style={styles.textInput}
                  value={address}
                  editable={type == 0 ? false : true}
                  onChangeText={address => {
                    let updatedState = {...this.state};
                    updatedState.currentLocation.address = address;
                    this.setState (updatedState);
                  }}
                  placeholder={'Please enter address'}
                />

              </View>
            </View>}
        <Text style={{fontSize: 20, fontWeight: 'bold', marginVertical: 20}}>
          Loại hình
        </Text>
        <View style={styles.positions}>
          <TouchableOpacity
            style={styles.eachPosition}
            onPress={() => {
              this.setState ({type: 0});
            }}
          >
            <Text style={styles.txtFree}>Miễn phí</Text>
            <FontAwesome5
              name={type == 0 ? 'check-square' : 'square'}
              size={35}
              color={MAIN_COLOR}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.eachPosition}
            onPress={() => {
              let updatedState = {...this.state};
              updatedState.currentLocation.address = '';
              updatedState.type = 1;
              this.setState (updatedState);
            }}
          >
            <Text style={styles.txtFree}>Thu phí</Text>
            <FontAwesome5
              name={type == 1 ? 'check-square' : 'square'}
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
const mapStateToProps = state => ({
  //convert "global object"(shared state) => ServiceRegister's props
  stackNavigation: state.navigationReducers.stackNavigation,
  tabNavigation: state.navigationReducers.tabNavigation,
});
export default connect (mapStateToProps) (Stadium);

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
    marginVertical:5
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
    height: 50,
    borderRadius: 5,
    borderColor: 'black',
    marginEnd: 30,
    borderWidth: 1,
    paddingHorizontal: 10,
    color: 'black',
    fontSize: 20,
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
    borderColor: COLOR_BUTTON,
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
    height: 50,
    borderRadius: 5,
    borderColor: 'black',
    marginEnd: 20,
    borderWidth: 1,
    paddingHorizontal: 10,
    color: 'black',
    fontSize: 17,
    lineHeight: 45,
  },
  buttonGetLocation: {
    width: '20%',
  },
  txtFree: {
    marginBottom: 10,
    fontSize: 17,
  },
});
