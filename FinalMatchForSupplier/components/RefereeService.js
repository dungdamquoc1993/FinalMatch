import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Dimensions,
  Image
} from 'react-native';
import Header from './Header'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Geolocation from 'react-native-geolocation-service'
import {Dropdown} from 'react-native-material-dropdown';
import {
  getAddressFromLatLong,
  checkLocationPermission,
} from '../server/googleServices' 


export default class RefereeService extends Component {
  static navigationOptions = {
    header: null,
  };
  state = {
    isAddress: false,
    currentLocation: {
      address: '',
      district: '',
      province: ''
    },
    radius: 12
  }

  _pressLocation = async () => {
    const hasLocationPermission = await checkLocationPermission()
    if (hasLocationPermission) {
      Geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          const { address = '', district = '', province = '' } = await getAddressFromLatLong(latitude, longitude)

          this.setState({ currentLocation: { address, district, province } })
        },
        (error) => {
          console.log(error.code, error.message);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    }
  }

  render() {
    let data = [
      {
        value: 1,
      },
      {
        value: 2,
      },
      {
        value: 3,
      },
      {
        value: 4,
      },
      {
        value: 5,
      },
      {
        value: 6,
      },
      {
        value: 7,
      },
      {
        value: 8,
      },
      {
        value: 9,
      },
      {
        value: 10,
      },
      {
        value: 11,
      },
      {
        value: 12,
      },
      
    ];
    const { isAddress } = this.state
    const {address, district, province} = this.state.currentLocation
    const {radius} = this.state
    return (
      <SafeAreaView style={styles.container}>
        <Header title={'RefereeService'} />
        <Text style={{ fontSize: 20, marginVertical: 20 }}>
          Đăng ký dịch vụ trọng tài
        </Text>
        <View style={styles.personalInformation}>
          <Text style={styles.textLabel}>
            Tên:
          </Text>
          <TextInput
            style={styles.textInput}
            placeholder={'Please enter name'}
          />
        </View>
        <View style={styles.personalInformation}>
          <Text style={styles.textLabel}>
            SDT:
          </Text>
          <TextInput
            style={styles.textInput}
            placeholder={'Please enter phone number'}
            keyboardType={'number-pad'}
          />
        </View>
        <View style={styles.personalInformation}>
          <Text style={styles.textLabel}>
            Tuổi:
          </Text>
          <TextInput
            style={styles.textInput}
            placeholder={'Please enter age'}
            keyboardType={'number-pad'}
          />
        </View>
        <TouchableOpacity onPress={() => {
          this._pressLocation()
        }}
        style={styles.buttonGetLocation}
        >
          <Text style={styles.textGetLocation}> Get Location</Text>
          <Image source={require("../images/placeholder.png")} style={{height:30,width:30}}/>
        </TouchableOpacity>
        {(address.length > 0 || district.length > 0 || province.length > 0)
          && <Text>{address} - {district} - {province}</Text>}
          <View style={styles.radiusInput}>
          <Text style={styles.textLabelRadius}>
            Bán kính phục vụ:
          </Text>
          <View style={styles.dropDownRadius}>
            <Dropdown placeholder={'12'} data={data} />
          </View>

        </View>
        <TouchableOpacity style={styles.btnSubmit}>
          <Text style={styles.txtSubmit}>Submit</Text>
        </TouchableOpacity>
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
  btnSubmit: {
    height: 60,
    width: 200,
    backgroundColor: '#7FFFD4',
    borderRadius: 7,
    alignItems: 'center',
    marginTop: 20,
  },
  txtSubmit: {
    lineHeight: 60,
    fontWeight: 'bold',
    fontSize: 20,
    color: 'white'
  },
  radiusInput: {
    flexDirection: 'row',
    height: 60,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  textLabelRadius: {
    width: '40%',
    height: 40,
    lineHeight: 40,
    paddingStart: 20,
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
  dropDownRadius: {
    width: 90,
    marginLeft: 8,
    marginBottom: 20,
  },
});
