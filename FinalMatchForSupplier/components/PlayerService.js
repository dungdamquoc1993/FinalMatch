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
  Picker,
} from 'react-native';
import Header from './Header';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Geolocation from 'react-native-geolocation-service';
import {Dropdown} from 'react-native-material-dropdown';
import {
  getAddressFromLatLong,
  checkLocationPermission,
} from '../server/googleServices';
import {insertPlayerService} from '../server/myServices'

export default class PlayerService extends Component {
  static navigationOptions = {
    header: null,
  };
  getPosition() {
    const {isGK = false, isCB = false, isMF = false, isCF = false} = this.state
    return `${isGK == true ? 1 : 0}${isCB == true ? 1 : 0}${isMF == true ? 1 : 0}${isCF == true ? 1 : 0}`
  }
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
      },
      radius: 12,
    };
  }

  componentDidMount = async () => {};
  _insertPlayerService = async () => {    
    //Test ok in postman
  }
  _pressLocation = async () => {
    debugger;
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
    let data = [
      {
        value: 'Banana',
      },
      {
        value: 'Mango',
      },
      {
        value: 'Pear',
      },
    ];
    const {playerName, phoneNumber} = this.state;
    const {isGK, isCB, isMF, isCF} = this.state;
    const {address, district, province} = this.state.currentLocation;
    const {radius} = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <Header title={'PlayerService'} />
        <Text style={{fontSize: 50}}>PlayerService</Text>
        <View style={styles.personalInformation}>
          <Text style={styles.textLabel}>
            Tên:
          </Text>
          <TextInput
            style={styles.textInput}
            placeholder={'Please enter playerName'}
            value={playerName}
            onChangeText={playerName => {
              this.setState ({playerName});
            }}
          />
        </View>
        <View style={styles.personalInformation}>
          <Text style={styles.textLabel}>
            SDT:
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
        <Text style={styles.textPosition}>
          Position:
        </Text>
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
        <TouchableOpacity
          onPress={() => {
            this._pressLocation ();
          }}
          style={styles.buttonGetLocation}
        >
          <Text style={styles.textGetLocation}>
            {' '}Get Location
          </Text>
          <FontAwesome5 name={'map-marker-alt'} size={25} color={'black'} />
        </TouchableOpacity>

        {(address.length > 0 || district.length > 0 || province.length > 0) &&
          <Text>{address} - {district} - {province}</Text>}
        <View style={styles.radiusInput}>
          <Text style={styles.textLabelRadius}>
            Bán kính phục vụ:
          </Text>
          <View style={styles.dropDownRadius}>
            <Dropdown placeholder={'12'} data={data} />
          </View>

        </View>
        <TouchableOpacity onPress={() => {
            this._insertPlayerService()
        }}>
          <Text>Insert PlayerService</Text>
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
  positions: {
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
  },
  textLabelRadius: {
    width: '40%',
    height: 40,
    lineHeight: 40,
    paddingStart: 30,
  },
  buttonGetLocation: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginVertical: 30,
  },
  textGetLocation: {
    marginRight: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  textPosition: {
    marginVertical: 15,
    fontSize: 18,
    fontWeight: 'bold',
  },
  dropDownRadius: {
    width: 100,
    marginLeft: 8,
    marginBottom: 20,
  },
});
