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
  Image,
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
    headerShown: false,
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
  changeFeeOrFree = type => {
    // let updatedState = {...this.state};
    // updatedState.currentLocation.address = '';
    // updatedState.type = type;
    this.setState (!type);
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
        <Header
          title={'STADIUM'}
          pressBackButton={async () => {
            //validate ok
            return true;
          }}
        />
        <View style={{marginTop: 20}} />
        <View style={styles.personalInformation}>
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
              <Text style={styles.txtShowAddresses}>
                {address.length > 0 ? address : 'Click to get location'}
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
                <TextInput
                  style={styles.textInput}
                  placeholder={'số điện thoại sân bóng 09xxxx...'}
                  keyboardType={'number-pad'}
                  value={phoneNumber}
                  onChangeText={phoneNumber => {
                    this.setState ({phoneNumber});
                  }}
                />

              </View>
              <View style={styles.personalInformation}>
                <TextInput
                  style={styles.textInput}
                  value={address}
                  editable={type == 0 ? false : true}
                  onChangeText={address => {
                    let updatedState = {...this.state};
                    updatedState.currentLocation.address = address;
                    this.setState (updatedState);
                  }}
                  placeholder={'Địa chỉ sân bóng'}
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
              this.changeFeeOrFree (0);
            }}
          >
            <Text
              onPress={() => {
                this.changeFeeOrFree (0);
              }}
              style={styles.txtFree}
            >
              Miễn phí
            </Text>
            <FontAwesome5
              name={type == 0 ? 'check-square' : 'square'}
              size={35}
              color={MAIN_COLOR}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.eachPosition}
            onPress={() => {
              this.changeFeeOrFree (1);
            }}
          >
            <Text
              style={styles.txtFree}
              onPress={() => {
                this.changeFeeOrFree (1);
              }}
            >
              Thu phí
            </Text>
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
    marginVertical: 5,
  },
  textLabel: {
    width: '20%',
    height: 40,
    lineHeight: 40,
    paddingStart: 30,
    fontSize: 20,
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
    lineHeight: 50,
  },
  positions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: 70,
    width: '100%',
  },
  btnSubmit: {
    height: 50,
    width: '90%',
    alignSelf: 'center',
    borderRadius: 6,
    paddingHorizontal: 10,
    fontSize: 17,
    backgroundColor: '#00CCFF',
    justifyContent: 'center',
    borderRadius: 25,
    marginVertical: 70,
  },
  txtSubmit: {
    lineHeight: 50,
    fontSize: 20,
    color: 'white',
    alignSelf: 'center',
  },
  txtAddresses: {
    width: '100%',
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
    paddingHorizontal: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 25,
    borderColor: '#a9a9a9',
    borderWidth: 1,
    fontSize: 17,
    lineHeight: 45,
    marginStart: '15%',
  },
  buttonGetLocation: {
    width: '40%',
    marginStart: '5%',
  },
  txtFree: {
    marginBottom: 10,
    fontSize: 17,
  },
  eachPosition: {
    padding: 10,
    width: 100,
    height: 100,
  },
});
