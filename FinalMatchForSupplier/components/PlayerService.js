import React, {Component} from 'react';
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
} from 'react-native';
import Header from './Header';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Geolocation from 'react-native-geolocation-service';
import { connect } from 'react-redux'
import {
  getAddressFromLatLong,
  checkLocationPermission,
} from '../server/googleServices';
import {insertPlayerService, getSupplierById} from '../server/myServices'
import {getSupplierFromStorage, saveSupplierToStorage, alertWithOKButton, getPosition, alert} from '../helpers/Helpers'
import {NavigationActions} from 'react-navigation'
import {MAIN_COLOR} from '../colors/colors';
class PlayerService extends Component {
  static navigationOptions = {
    header: null,
  };
  
  constructor (props) {
    super (props);
    this.state = {
      playerName: '',
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
    };
  }

  componentDidMount = async () => {
    try {
      const {supplierId, tokenKey, email} = await getSupplierFromStorage() 
      
      const { data, message} = await getSupplierById(supplierId)      
      const { phoneNumber, latitude, 
                    longitude, radius, address} = data
      
      this.setState({phoneNumber, currentLocation: {latitude, longitude, address}, radius})      
    } catch(error) {
      alert("Cannot get Supplier information"+error)
      //Quay lai Tab
    }
  };


  _insertPlayerService = async () => {    
    //Test ok in postman
    const {playerName, radius} = this.state
    
    const position = getPosition(this.state)
    const {latitude,longitude, address} = this.state.currentLocation
    const {supplierId, email} = await getSupplierFromStorage()          
        
    if(latitude == 0.0 || longitude == 0.0 || radius == 0.0) {
      alert("Bạn phải nút bấm nút lấy Location và chọn bán kính")
      return
    }    
    try {      
      let xx = {playerName,
        position,
        supplierId,
        latitude,
        longitude,
        address,
        radius
      }
      console.log("xx11 = "+JSON.stringify(xx))

      await insertPlayerService(playerName,
        position,
        supplierId,
        latitude,
        longitude,
        address,
        radius)        
      alertWithOKButton("Insert player service successfully", () => {
        this.props.stackNavigation.dispatch(NavigationActions.back())
      })      
    } catch(error) {
      alert('Cannot get data from Server'+error)
    } 
    
  }
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

          this.setState ({currentLocation: {address, district, province, latitude, longitude}});
        },
        error => {
          console.log (error.code, error.message);
        },
        {enableHighAccuracy: true, timeout: 5000, maximumAge: 10000}
      );
    }
  };
  render () {
    const {playerName, phoneNumber} = this.state;
    const {isGK, isCB, isMF, isCF} = this.state;
    const {address = '', district = '', province = ''} = this.state.currentLocation;
    const {radius} = this.state;
    return (
      <ScrollView>  
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        
      <SafeAreaView style={styles.container}>
        
        <Header title={'PLAYER SERVICE'} pressBackButton={async () => {
          //validate ok
          return true
        }}/>        
        <View style={{marginTop:30}}/>
        <View style={styles.personalInformation}>
          <TextInput
            style={styles.textInput}
            placeholder={'Tên Thi Đấu của Bạn (Đấu Danh) :)'}
            value={playerName}
            onChangeText={playerName => {
              this.setState ({playerName});
            }}
          />
        </View>
        <View style={styles.personalInformation}>
          <TextInput
            style={styles.textInput}
            placeholder={'Số Điện Thoại của Bạn'}
            keyboardType={'phone-pad'}
            value={phoneNumber}
            onChangeText={phoneNumber => {
              this.setState ({phoneNumber});
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
              this.setState ({isGK: !this.state.isGK});
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
              this.setState ({isCB: !this.state.isCB});
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
              this.setState ({isMF: !this.state.isMF});
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
              this.setState ({isCF: !this.state.isCF});
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
          <Text style={styles.textLabelRadius}>
            Bán kính phục vụ:
          </Text>
            
              <TextInput
              style={styles.textInputRadius}
              placeholder={'Enter radius'}
              keyboardType={'numeric'}
              onChangeText={radius => {
                this.setState ({radius});
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
    borderRadius: 8,
    borderColor: 'black',
    borderWidth: 1,
    paddingHorizontal: 10,
    color: 'black',
    fontSize: 20
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
    height: 60,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:20
  },
  textLabelRadius: {
    width: '50%',
    height: 40,
    lineHeight: 40,
    paddingStart: 30,
    fontSize:20
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
    width: '35%',
    height: 50,
    borderRadius: 8,
    borderColor: 'black',
    marginEnd:5,
    borderWidth: 1,
    paddingHorizontal: 10,
    color: 'black',
    fontSize: 20
  },
  textKM:{
    width: '15%',
    height: 40,
    lineHeight: 40,
    fontSize:20
  },
  btnSubmit: {
    height: 60,
    width: 200,
    backgroundColor: MAIN_COLOR,
    borderRadius: 7,
    alignItems: 'center',
    marginTop: 20,
  }, txtSubmit: {
    lineHeight: 60,
    fontWeight: 'bold',
    fontSize: 20,
    color: 'white'
  }
});
