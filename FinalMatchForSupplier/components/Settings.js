import React, { Component } from 'react'
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
  Platform,
  Modal
} from 'react-native'
import Header from './Header'
import {
  getAgesBetween2Dates,
  getSupplierFromStorage,
  convertDayMonthYearToString,
  isIOS,
  convertDateToString,
  setPosition,
  getPosition,
  alert,
  convertDateToStringYYYYMMDD,
  convertDateToStringDDMMYYYY,
  OrderStatus, removeStorage
} from '../helpers/Helpers'
import TextInputMask from 'react-native-text-input-mask'
import {
  getAddressFromLatLong,
  checkLocationPermission,
} from '../server/googleServices'
import {
  getSupplierServicesOrders,
  postUploadPhoto,
  updateSettings,
  getOrdersBySupplierId
} from '../server/myServices'
import { translate } from '../languages/languageConfigurations'
import { urlGetAvatar } from '../server/urlNames'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import Geolocation from '@react-native-community/geolocation';
import ImagePicker from 'react-native-image-crop-picker'
import { COLOR_BUTTON, COLOR_GREEN, MAIN_COLOR } from '../colors/colors'
import { NavigationEvents } from 'react-navigation'
import FinalMatchDatePicker from './FinalMatchDatePicker'
import Spinner from 'react-native-loading-spinner-overlay'
import MultiLanguageComponent from './MultiLanguageComponent'

const { PENDING, ACCEPTED, CANCELLED, COMPLETED, MISSED, EXPIRED, FINISHED } = OrderStatus

const windowWidth = Dimensions.get('window').width
const windowHeight = Dimensions.get('window').height

export default class Settings extends MultiLanguageComponent {

  state = {
    dataChanged: false,
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
    isGK: false,
    isCB: false,
    isMF: false,
    isCF: false,
    currentLocation: {
      address: '',
      latitude: 0.00,
      longitude: 0.00,
    },
    radius: 0.0,
    modalVisible: false,
    spinner: false,
    numberOfCompletedMatchPlayer: 0,
    numberOfCompletedMatchReferee: 0,
  }
  _saveSettings = async () => {
    if (this.state.dataChanged == false) {
      return
    }
    const { supplierId } = this.state
    if (playerPrice >= 20000) {
      this.setState({ playerPrice: 20000 })
    } else if (playerPrice <= 150000) {
      this.setState({ playerPrice: 150000 })
    }
    if (refereePrice >= 50000) {
      this.setState({ refereePrice: 50000 })
    } else if (refereePrice <= 300000) {
      this.setState({ refereePrice: 300000 })
    }

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
    const { address, latitude, longitude } = this.state.currentLocation
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
  validateInput() {
    const { phoneNumber } = this.state
    if (phoneNumber.trim().length == 0) {
      alert(translate("Enter telephone number: "))
      return false
    }
    return true
  }
  componentWillUnmount() {
  }
  componentDidCatch(error, errorInfo) {

  }
  reloadDataFromServer = async () => {
    this.setState({ spinner: true })
    try {
      const { supplierId, email } = await getSupplierFromStorage()
      const { data, message } = await getSupplierServicesOrders(supplierId)
      const { name,
        playerPrice,
        refereePrice,
        position, phoneNumber, avatar,
        dateOfBirthObject, radius, address, playerName = '',
        refereeName = '', playerId, refereeId,
        latitude, longitude
      } = data
      let orders = await getOrdersBySupplierId()
      let numberOfCompletedMatchPlayer = orders.filter(order => order.orderStatus == COMPLETED && order.typeRole == 'player').length
      let numberOfCompletedMatchReferee = orders
        .filter(order => order.orderStatus == COMPLETED && order.typeRole == 'referee')
        .length
      const { day, month, year } = dateOfBirthObject
      let selectedDate = new Date(year, month, day)
      const { isGK, isCB, isMF, isCF } = setPosition(position)


      this.setState({
        spinner: false,
        name,
        playerPrice,
        refereePrice,
        isGK, isCB, isMF, isCF,
        avatar, position, phoneNumber, radius, playerName, refereeName, supplierId,
        playerId, refereeId,
        stringDateOfBirth: convertDateToStringDDMMYYYY(selectedDate),
        age: getAgesBetween2Dates(new Date(), selectedDate),
        selectedDate,
        dateOfBirth: selectedDate,
        currentLocation: {
          address,
          latitude,
          longitude
        },
        numberOfCompletedMatchPlayer,
        numberOfCompletedMatchReferee
      })
    } catch (error) {
      alert(translate("Cannot get service's information:") + `${JSON.stringify(error)}`)
      this.setState({ spinner: false })
    }
  }
  async componentDidMount() {
    // this.reloadDataFromServer()
    Geolocation.requestAuthorization();
    Geolocation.setRNConfiguration({
      skipPermissionRequests: false,
      authorizationLevel: 'whenInUse',
    });
  }
  async _chooseAvatar() {
    try {
      let photos = await ImagePicker.openPicker({
        multiple: true
      })
      const { supplierId } = this.state
      const { data, message = '' } = await postUploadPhoto(photos, supplierId)
      this.setState({
        avatar: typeof data == "object" ? data[0] : data,
        dataChanged: true,
      })
    } catch (error) {
      alert(translate("Cannot upload avatar: ") + `${JSON.stringify(error)}`)
    }
  }

  _pressLocation = async () => {
    const hasLocationPermission = await checkLocationPermission()
    if (hasLocationPermission) {
      this.setState({ spinner: true })
      Geolocation.getCurrentPosition(
        async position => {
          console.log({ position })
          const { latitude, longitude } = position.coords
          const address = await getAddressFromLatLong(latitude, longitude)
          this.setState({
            currentLocation: { address, latitude, longitude },
            spinner: false,
            dataChanged: true,
          })
        },
        error => {
          console.log(error.code, error.message)
          this.setState({
            spinner: false,
            dataChanged: true,
          })
        },
        { enableHighAccuracy: false, timeout: 20000, maximumAge: 10000 }
      )
    }
  }
  _navigateToServiceRegister = () => {
    let params = {}
    this.props.navigation.navigate(translate("Services"), params)
  }

  logout = async () => {
    await removeStorage()
    this.props.navigation.navigate(translate("LoginRegister"))
  }

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
      modalVisible,
      numberOfCompletedMatchPlayer,
      numberOfCompletedMatchReferee,
    } = this.state

    const {
      address = '',
      latitude = 0.00,
      longitude = 0.00,
    } = this.state.currentLocation
    return (
      <SafeAreaView style={styles.container}>
        <NavigationEvents
          onWillFocus={payload => {
            this.reloadDataFromServer()
          }}
        />
        <Spinner
          visible={this.state.spinner}
          textContent={translate('Loading')}
          textStyle={{ fontWeight: 'bold' }}
        />
        <View style={{
          height: 120,
          width: '100%'
        }}>
          <Header
            title={"Account management"}
            hideBack={true}
            hideNext={true}
          /* pressBackButton={async () => {
            if (this.validateInput() == true) {
              await this._saveSettings()
              return true
            }
            return false
          }} */
          />
          <View style={styles.avatar}>
            <TouchableOpacity
              onPress={() => {
                this._chooseAvatar()
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
        </View>
        <ScrollView style={styles.scrollView}>

          <View style={styles.personalInformation}>
            <Text style={styles.textLabel}>
              {translate("Name : ")}
            </Text>
            <TextInput
              style={styles.textInput}
              placeholder={translate("Enter name: ")}
              value={name}
              onChangeText={name => {
                this.setState({ name, dataChanged: true, })
              }}
            />
          </View>
          <View style={styles.personalInformation}>
            <Text style={styles.textLabel}>
              {translate("Age :")}
            </Text>
            <TouchableOpacity
              style={[styles.textInput, { width: '40%' }]}
              onPress={async () => {
                await this._saveSettings()
                this.setState({ modalVisible: true })
              }}
            >
              <Text
                style={{
                  fontSize: 15,
                  textAlign: 'left',
                  height: 40,
                  lineHeight: 40,
                  paddingStart: 5,
                  color: stringDateOfBirth.trim() === '' ? '#a9a9a9' : 'black',
                }}
              >
                {stringDateOfBirth === '' ? "dd/mm/yyyy" : stringDateOfBirth}
              </Text>
            </TouchableOpacity>
            <Text style={styles.age}>
              {getAgesBetween2Dates(new Date(), this.state.dateOfBirth)}

            </Text>
          </View>
          <View style={styles.personalInformation}>
            <Text style={styles.textLabel}>
              {translate("Phone : ")}
            </Text>
            <TextInputMask
              style={styles.textInput}
              placeholder={translate("Phone : ")}
              keyboardType={'number-pad'}
              onChangeText={(formattedValue, originValue) => {
                this.setState({ phoneNumber: originValue, dataChanged: true, })
              }}
              mask={"[999]-[9999]-[9999]"}
              value={`${phoneNumber}`}
            />
          </View>
          {/* Quan ly dich vu */}
          <TouchableOpacity
            onPress={async () => {
              await this._saveSettings()
              this._pressLocation()
            }}
            style={{
              height: 70,
              flexDirection: 'column',
              width: windowWidth - 30,
              justifyContent: 'flex-start',
              paddingStart: 10,
              alignSelf: 'center',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
            <Image source={require("../images/placeholder.png")} style={{ height: 30, width: 30 }} />
            <Text numberOfLines={2}
              style={{
                fontSize: 16,
              }}>{address}</Text>

          </TouchableOpacity>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            width: '100%',
            height: 50,
            padding: 5,
            margin: 2,
          }}>
            <Text style={{
              height: 40,
              lineHeight: 40,
              fontSize: 16,
              paddingHorizontal: 10,

            }}>
              {translate("Enter radius:")}
            </Text>
            <TextInput
              style={{
                height: 45,
                backgroundColor: '#f5f5f5',
                borderRadius: 25,
                borderColor: '#a9a9a9',
                borderWidth: 1,
                textAlign: 'center',
                color: 'black',
                width: '30%',
                fontSize: 15,

              }}
              placeholder={translate("Radius")}
              keyboardType={'numeric'}
              value={`${radius}`}
              onChangeText={radius => {
                this.setState({ radius, dataChanged: true, })
              }}
            />
            <Text style={{ fontSize: 15, height: 40, lineHeight: 40, marginLeft: 5, width: '10%' }}>
              km
              </Text>
          </View>
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
              <Text style={styles.textRole}>{translate("Player")}</Text>
              <TextInput style={styles.textInputRole}
                value={playerName} onChangeText={(playerName) => {
                  this.setState({ playerName, dataChanged: true, })
                }} />
            </View>
            <View style={styles.personalInformation}>
              <Text style={styles.textRole}>{translate("Number of matches: ")}</Text>
              <TextInput style={styles.textInputRole}
                value={`${numberOfCompletedMatchPlayer}`}
                editable={false}
              />
            </View>
            <Text style={{ marginBottom: 5, fontSize: 16 }}>
              {translate("Position : ")}
            </Text>
            <View style={styles.positions}>
              <TouchableOpacity
                style={styles.eachPosition}
                onPress={() => {
                  this.setState({ isGK: !this.state.isGK, dataChanged: true, })
                }}
              >
                <Text style={{}}>GK</Text>
                <FontAwesome5
                  name={isGK == true ? 'check-square' : 'square'}
                  size={30}
                  color={'black'}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.eachPosition}
                onPress={() => {
                  this.setState({ isCB: !this.state.isCB, dataChanged: true, })
                }}
              >
                <Text>CB</Text>
                <FontAwesome5
                  name={isCB == true ? 'check-square' : 'square'}
                  size={30}
                  color={'black'}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.eachPosition}
                onPress={() => {
                  this.setState({ isMF: !this.state.isMF, dataChanged: true, })
                }}
              >
                <Text style={{}}>MF</Text>
                <FontAwesome5
                  name={isMF == true ? 'check-square' : 'square'}
                  size={30}
                  color={'black'}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.eachPosition}
                onPress={() => {
                  this.setState({ isCF: !this.state.isCF, dataChanged: true, })
                }}
              >
                <Text style={{}}>CF</Text>
                <FontAwesome5
                  name={isCF == true ? 'check-square' : 'square'}
                  size={30}
                  color={'black'}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.personalInformation}>
              <Text style={styles.textRole}>{translate("Price : ")}</Text>
              <TextInputMask
                style={styles.textInputRole}
                onChangeText={(formattedValue, originValue) => {
                  this.setState({
                    playerPrice: isNaN(originValue) == false ? originValue : parseFloat(originValue),
                    dataChanged: true,
                  })
                }}
                mask={"[000] [000] VND"}
                value={`${playerPrice}`}
              />
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
              <Text style={styles.textRole}>{translate("Referee")}</Text>
              <TextInput style={styles.textInputRole}
                value={refereeName} onChangeText={(refereeName) => {
                  this.setState({ refereeName, dataChanged: true, })
                }} />
            </View>
            <View style={styles.personalInformation}>
              <Text style={styles.textRole}>{translate("Number of matches: ")}</Text>
              <TextInput style={styles.textInputRole}
                value={`${numberOfCompletedMatchReferee}`}
                editable={false}
              />
            </View>
            <View style={styles.personalInformation}>
              <Text style={styles.textRole}>{translate("Price : ")}</Text>
              <TextInputMask
                style={styles.textInputRole}
                onChangeText={(formattedValue, originValue) => {
                  this.setState({
                    refereePrice: isNaN(originValue) == false ? originValue : parseFloat(originValue),
                    dataChanged: true,
                  })
                }}
                mask={"[000] [000] VND"}
                value={`${refereePrice}`}
              />
            </View>

          </View>}

        </ScrollView>
        <View style={styles.buttonSaveArea}>
          <TouchableOpacity style={styles.buttonSave}
            onPress={async () => {
              if (this.validateInput() == true) {
                await this._saveSettings()
                return true
              }
              return false
            }}>
            <Text style={styles.textSave}>{translate('Save')}</Text>

          </TouchableOpacity>
        </View>
        <View style={styles.buttonSaveArea}>
          <TouchableOpacity style={styles.buttonSave}
            onPress={async () => {
              this.logout()
            }}>
            <Text style={styles.textSave}>{translate('Logout')}</Text>

          </TouchableOpacity>
        </View>
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            //alert('Modal has been closed.')
          }}
        >
          <FinalMatchDatePicker
            dismissModal={() => {
              this.setState({ modalVisible: false })
            }}
            updateDateTime={(date) => {
              this.setState({
                dateOfBirth: date,
                stringDateOfBirth: convertDateToStringDDMMYYYY(date),
                age: getAgesBetween2Dates(new Date(), date),
                modalVisible: false,
                dataChanged: true,
              })
            }}
          />
        </Modal>
      </SafeAreaView>
    )
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
    lineHeight: 60,
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
    marginTop: 10,
  },
  textLabel: {
    width: 100,
    height: 45,
    lineHeight: 45,
    paddingStart: 15,
    fontSize: 15,
  },

  textInput: {
    width: '70%',
    height: 45,
    backgroundColor: '#f5f5f5',
    borderRadius: 25,
    borderColor: '#a9a9a9',
    borderWidth: 1,
    marginEnd: 30,
    paddingHorizontal: 10,
    color: 'black',
    fontSize: 15,

  },
  serviceArea: {
    flexDirection: 'column',
    height: 60,
    width: '100%',
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  age: {
    width: '30%',
    height: 60,
    lineHeight: 60,
    textAlign: 'left',
    justifyContent: 'flex-start'
  },
  textInputRole: {
    width: '50%',
    height: 45,
    backgroundColor: '#f5f5f5',
    borderRadius: 25,
    borderColor: '#a9a9a9',
    borderWidth: 1,
    marginEnd: 30,
    fontSize: 15,
    textAlign: 'center'
  },
  textRole: {
    width: '50%',
    height: 45,
    lineHeight: 40,
    paddingStart: 30,
    fontSize: 16,

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
  buttonSaveArea: {
    alignSelf: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  buttonSave: {
    height: 40,
    width: '25%',
    alignSelf: 'center',
    fontSize: 17,
    backgroundColor: MAIN_COLOR,
    justifyContent: 'center',
    borderRadius: 25,
    marginBottom: 10,
    position: "relative"
  },
  textSave: {
    // lineHeight: 50,
    fontSize: 20,
    color: 'white',
    alignSelf: 'center',
  }

})
