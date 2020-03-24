import React, {Component} from 'react'
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  DatePickerAndroid,
  TouchableWithoutFeedback,
  Keyboard,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  Picker,
  Image,
  KeyboardAvoidingView
} from 'react-native'
import {translate} from '../languages/languageConfigurations'
import Header from './Header'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import Geolocation from 'react-native-geolocation-service'
import { connect } from 'react-redux'
import {
  getAddressFromLatLong,
  checkLocationPermission,
} from '../server/googleServices'
import {insertPlayerService, getSupplierById} from '../server/myServices'
import {getSupplierFromStorage, saveSupplierToStorage, alertWithOKButton, getPosition, alert,isIOS} from '../helpers/Helpers'
import {NavigationActions} from 'react-navigation'
import {MAIN_COLOR} from '../colors/colors'
class PlayerService extends Component {
  static navigationOptions = {
    headerShown: false,
  }
  
  constructor (props) {
    super (props)
    this.state = {
      playerName: 'người a',
      price: 30000,
      phoneNumber: '',
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
    }
  }

  componentDidMount = async () => {
    try {
      const {supplierId, tokenKey, email} = await getSupplierFromStorage() 
      
      const { data, message} = await getSupplierById(supplierId)      
      const { phoneNumber, latitude, 
                    longitude, radius, address} = data
      
      this.setState({phoneNumber, currentLocation: {latitude, longitude, address}, radius})      
    } catch(error) {
      alert(translate("Cannot get supplier's information")+JSON.stringify(error))
      //Quay lai Tab
    }
  }


  _insertPlayerService = async () => {    
    //Test ok in postman
    const {playerName, price, radius} = this.state
    
    const position = getPosition(this.state)
    const {latitude,longitude, address} = this.state.currentLocation
    const {supplierId, email} = await getSupplierFromStorage()          
        
    if(latitude == 0.0 || longitude == 0.0 || radius == 0.0) {
      alert(translate("You must press Location and choose radius"))
      return
    }    
    try {      
      await insertPlayerService(playerName,
        price,
        position,
        supplierId,
        latitude,
        longitude,
        address,
        radius)                    
      alertWithOKButton(translate("Insert player service successfully"), () => {
        this.props.stackNavigation.dispatch(NavigationActions.back())
      })      
    } catch(error) {
      alert(translate("Cannot get data from Server")+JSON.stringify(error))
    } 
    
  }
  _pressLocation = async () => {
    const hasLocationPermission = await checkLocationPermission ()
    if (hasLocationPermission) {
      Geolocation.getCurrentPosition (
        async position => {
          const {latitude, longitude} = position.coords
          const {
            address = '',
            district = '',
            province = '',
          } = await getAddressFromLatLong (latitude, longitude)

          this.setState ({currentLocation: {address, district, province, latitude, longitude}})
        },
        error => {
          console.log (error.code, error.message)
        },
        {enableHighAccuracy: true, timeout: 5000, maximumAge: 10000}
      )
    }
  }
  render () {
    const {playerName,price, phoneNumber} = this.state
    const {isGK, isCB, isMF, isCF} = this.state
    const {address = '', district = '', province = ''} = this.state.currentLocation
    const {radius} = this.state
    return (
      <ScrollView>  
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        
      <SafeAreaView style={styles.container}>
        
        <Header title={translate("Player Service")} pressBackButton={async () => {
          //validate ok
          return true
        }}/>        
        <View style={{marginTop:30}}/>
        <View style={styles.personalInformation}>
          <TextInput
            style={styles.textInput}
            placeholder={translate("Your player's name :")}
            value={playerName}
            onChangeText={playerName => {
              this.setState ({playerName})
            }}
          />
        </View>
        <View style={styles.personalInformation}>
          <TextInput
            style={styles.textInput}
            placeholder={translate("Phone : ")}
            keyboardType={'phone-pad'}
            value={phoneNumber}
            onChangeText={phoneNumber => {
              this.setState ({phoneNumber})
            }}
          />          
        </View>
        <View style={styles.personalInformation}>
          <TextInput
            style={styles.textInput}
            placeholder={translate("Player's price: ")}
            keyboardType={'number-pad'}
            value={price}
            onChangeText={price => {
              this.setState ({price: isNaN(price) == false ? price : parseFloat(price)})
            }}
          />          
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
          && <Text style={{fontSize:16}}>{address} - {district} - {province}</Text>}
        <View style={styles.positions}>
          <TouchableOpacity
            style={styles.eachPosition}
            onPress={() => {
              this.setState ({isGK: !this.state.isGK})
            }}
          >
            <Text>GK</Text>
            <FontAwesome5
              name={isGK == true ? 'check-square' : 'square'}
              size={40}
              color={'black'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.eachPosition}
            onPress={() => {
              this.setState ({isCB: !this.state.isCB})
            }}
          >
            <Text>CB</Text>
            <FontAwesome5
              name={isCB == true ? 'check-square' : 'square'}
              size={40}
              color={'black'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.eachPosition}
            onPress={() => {
              this.setState ({isMF: !this.state.isMF})
            }}
          >
            <Text>MF</Text>
            <FontAwesome5
              name={isMF == true ? 'check-square' : 'square'}
              size={40}
              color={'black'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.eachPosition}
            onPress={() => {
              this.setState ({isCF: !this.state.isCF})
            }}
          >
            <Text>CF</Text>
            <FontAwesome5
              name={isCF == true ? 'check-square' : 'square'}
              size={40}
              color={'black'}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.radiusInput}>
              <TextInput
              style={styles.textInputRadius}
              placeholder={translate("Enter radius:")}
              keyboardType={'numeric'}
              onChangeText={radius => {
                this.setState ({radius})
              }}
              />
          <Text style={styles.textKM}>
            KM
          </Text>

        </View>
        <TouchableOpacity style={styles.btnSubmit} onPress={() => {
          
            this._insertPlayerService()
        }}>
          <Text style={styles.txtSubmit}>Submit</Text>
        </TouchableOpacity>        
      </SafeAreaView>      
      </TouchableWithoutFeedback>
      </ScrollView>  
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
)(PlayerService)

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
    marginVertical:7
  },
  textLabel: {
    width: '40%',
    height: 40,
    lineHeight: 40,
    paddingStart: 30,
    fontSize:20,
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
    lineHeight:isIOS?25:50,
  },
  positions: {
    marginVertical:25,
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: 50,
    width: '100%',
  },
  eachPosition: {
    flexDirection: 'column',
    width: 90,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radiusInput: {
    flexDirection: 'row',
    height: 50,
    width: '100%',
    justifyContent: 'center',
  },
  buttonGetLocation: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginVertical: 20,
  },
  textGetLocation: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  textPosition: {
    marginVertical: 15,
    fontSize: 18,
    fontWeight: 'bold',
  },
  textInputRadius: {
    width: '60%',
    height: 50,
    lineHeight:isIOS?25:50,
    backgroundColor: '#f5f5f5',
    borderRadius: 25,
    borderColor: '#a9a9a9',
    borderWidth: 1,
    paddingStart: 15,
    fontSize: 17,

  },
  textKM:{
    width: '20%',
    height: 50,
    lineHeight: 50,
    fontSize:17,
    textAlign:'center'
  },
  btnSubmit: {
    height: 50,
    marginTop: 20,
    width: '90%',
    alignSelf: 'center',
    borderRadius: 6,
    paddingHorizontal: 10,
    fontSize: 17,
    backgroundColor: '#00CCFF',
    justifyContent: 'center',
    borderRadius: 25,
  }, txtSubmit: {
    lineHeight: 50,
    fontSize: 20,
    color: 'white',
    alignSelf: 'center',
  }
})
