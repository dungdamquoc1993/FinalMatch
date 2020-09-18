import React, { Component } from 'react'
import { connect } from 'react-redux'
import { NavigationActions } from 'react-navigation'
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Keyboard,
  Image,
  TouchableWithoutFeedback
} from 'react-native'
import Header from './Header'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import Geolocation from '@react-native-community/geolocation'
import {
  getAddressFromLatLong,
  checkLocationPermission,
} from '../server/googleServices'
import { insertStadium } from '../server/myServices'
import { getSupplierFromStorage, alertWithOKButton, isIOS } from '../helpers/Helpers'
import { MAIN_COLOR, COLOR_BUTTON } from '../colors/colors'
import { translate } from '../languages/languageConfigurations'
class Stadium extends Component {
  static navigationOptions = {
    headerShown: false,
  }
  state = {
    isFree: true,
    stadiumName: '',
    phoneNumber: '',
    supplierId: 0,
    currentLocation: {
      address: '',
      latitude: 0,
      longitude: 0,
    },
  }
  async componentDidMount() {
    Geolocation.requestAuthorization();
    Geolocation.setRNConfiguration({
      skipPermissionRequests: false,
      authorizationLevel: 'whenInUse',
    });
    const { supplierId } = await getSupplierFromStorage()
    this.setState({ supplierId })
  }
  _isOnpressSubmit = async () => {
    //test
    const { supplierId, isFree, stadiumName, phoneNumber } = this.state
    if (stadiumName.trim().length == 0) {
      alert(translate("You must enter stadium's name"))
      return
    }
    if (isFree == false) {
      if (phoneNumber.trim().length == 0) {
        alert(translate("You must enter phone number"))
        return
      }
    }
    const {
      address,
      latitude,
      longitude,
    } = this.state.currentLocation
    try {
      const { message } = await insertStadium(
        isFree == true ? 0 : 1,
        stadiumName,
        latitude,
        longitude,
        address,
        phoneNumber,
        supplierId
      )
      if (message.length > 0) {
        alertWithOKButton(translate("Cannot insert Stadium:") + `${message}`, null)
      } else {
        alertWithOKButton(translate("Insert stadium successfully"), () => {
          this.props.stackNavigation.dispatch(NavigationActions.back())
        })
      }
    } catch (error) {
      alert(translate("Cannot get data from Server") + error)
    }
  }
  _pressLocation = async () => {
    const hasLocationPermission = await checkLocationPermission()
    if (hasLocationPermission) {
      Geolocation.getCurrentPosition(
        async position => {
          const { latitude, longitude } = position.coords
          const address = await getAddressFromLatLong(latitude, longitude)
          this.setState({
            currentLocation: { address, latitude, longitude },
          })
        },
        error => {
          console.log(error.code, error.message)
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 10000 }
      )
    }
  }
  render() {
    const { isFree, stadiumName, phoneNumber } = this.state
    const {
      address,
      latitude,
      longitude,
    } = this.state.currentLocation
    const { navigate } = this.props.navigation
    return (
      <TouchableWithoutFeedback onPress={() => {
        Keyboard.dismiss()
      }} accessible={false}>
        <SafeAreaView style={styles.container}>
          <View
            style={{
              height: 60,
              width: '100%'
            }}
          >
            <Header
              title={translate("Stadium")}
              pressBackButton={async () => {
                //validate ok
                return true
              }}
              hideBack={false}
              hideNext={true}
            />
          </View>
          <View style={styles.personalInformation}>
            <TextInput
              style={styles.textInput}
              value={stadiumName}
              onChangeText={stadiumName => {
                this.setState({ stadiumName })
              }}
              placeholder={translate("Stadium's name")}
            />
          </View>

          {isFree == true
            ? <View style={styles.txtAddresses}>
              <Text style={styles.txtShowAddresses}>
                {address.length > 0 ? address : translate("Click to get location")}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  this._pressLocation()
                }}
                style={styles.buttonGetLocation}
              >
                <Image
                  source={require('../images/placeholder.png')}
                  style={{ height: 30, width: 30 }}
                />
              </TouchableOpacity>
            </View>
            : <View style={{ width: '100%' }}>
              <View style={styles.personalInformation}>
                <TextInput
                  style={styles.textInput}
                  placeholder={translate("Stadium's phone")}
                  keyboardType={'number-pad'}
                  value={phoneNumber}
                  onChangeText={phoneNumber => {
                    this.setState({ phoneNumber })
                  }}
                />

              </View>
              <TouchableOpacity
                onPress={async () => {
                  navigate('SearchPlace', {
                    updatePlace: (address, latitude, longitude) => {
                      this.setState({ currentLocation: { address, latitude, longitude } })
                    },
                  })
                }}
              >
                <View style={styles.personalInformation}>
                  <Text
                    style={[styles.textInput, { color: address.trim() === '' ? '#a9a9a9' : 'black' }]}
                  >
                    {address.trim() === '' ? translate("Stadium's address") : address}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>}
          <Text style={{ fontSize: 20, fontWeight: 'bold', marginVertical: 20 }}>
            {translate("Charging's type")}
          </Text>
          <View style={styles.positions}>
            <TouchableOpacity
              style={styles.eachPosition}
              onPress={() => {
                this.setState({ isFree: true })
              }}
            >
              <Text
                onPress={() => {
                  this.setState({ isFree: true })
                }}
                style={styles.txtFree}
              >
                {translate("Free")}
              </Text>
              <FontAwesome5
                name={isFree == true ? 'check-square' : 'square'}
                size={35}
                color={MAIN_COLOR}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.eachPosition}
              onPress={() => {
                this.setState({ isFree: false })
              }}
            >
              <Text
                style={styles.txtFree}
                onPress={() => {
                  this.setState({ isFree: false })
                }}
              >
                {translate("Fee")}
              </Text>
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
              this._isOnpressSubmit()
            }}
          >
            <Text style={styles.txtSubmit}>Submit</Text>
          </TouchableOpacity>

        </SafeAreaView>
      </TouchableWithoutFeedback>
    )
  }
}
const mapStateToProps = state => ({
  //convert "global object"(shared state) => ServiceRegister's props
  stackNavigation: state.navigationReducers.stackNavigation,
  tabNavigation: state.navigationReducers.tabNavigation,
})
export default connect(mapStateToProps)(Stadium)

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flex: 1,
  },
  personalInformation: {
    height: 50,
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
    lineHeight: isIOS ? 25 : 50,
    backgroundColor: '#f5f5f5',
    borderRadius: 25,
    borderColor: '#a9a9a9',
    borderWidth: 1,
    paddingStart: 15,
    fontSize: 17,
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
})
