import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
  SafeAreaView,
  Image,
  ScrollView,
  Platform,
  TextInput,
  FlatList,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Header from './Header';
import {
  getAddressFromLatLong,
  checkLocationPermission,
} from '../server/googleServices';
import {getStadiumsAroundPoint} from '../server/myServices';
import Geolocation from 'react-native-geolocation-service';
import {validateLocation} from '../Validations/Validation';
export default class Stadium extends Component {
  static navigationOptions = {
    headerShown: false,
  };
  state = {
    isFree: false,
    currentLocation: {
      address: '',
      district: '',
      province: '',
      latitude: 0.0,
      longitude: 0.0,
      radius: '10', //de number se rat nhieu bug khi go textinput
    },
    stadiums: [], //free + unfree
    filteredStadiums: [],
  };
  getStadiumList = async () => {
    try {
      const {latitude = 0, longitude = 0, radius} = this.state.currentLocation;
      const {data, message, error} = await getStadiumsAroundPoint (
        latitude,
        longitude,
        parseFloat (radius)
      );
      if (error) {
        alert ('Cannot get stadium list. Error: ' + error.toString ());
      } else {
        this.setState ({stadiums: data});
        this.filterStadiums ();
      }
    } catch (error) {
      alert ('Cannot get stadium list. Error: ' + error.toString ());
    }
  };
  filterStadiums = () => {
    const {stadiums, isFree} = this.state;
    this.setState ({
      filteredStadiums: stadiums.filter (stadium => {
        return stadium.type == (isFree === true) ? 0 : 1;
      }),
    });
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
            currentLocation: {
              address,
              district,
              province,
              latitude,
              longitude,
              radius: this.state.currentLocation.radius,
            },
          });

          await this.getStadiumList ();
        },
        error => {
          console.log (error.code, error.message);
        },
        {enableHighAccuracy: true, timeout: 5000, maximumAge: 10000}
      );
    }
  };
  render () {
    const {isFree, filteredStadiums} = this.state;
    const {currentLocation} = this.state;
    const {
      address,
      district,
      province,
      latitude,
      longitude,
      radius,
    } = currentLocation;
    return (
      <TouchableWithoutFeedback onPress={() => {        
        Keyboard.dismiss()
        this._pressLocation()
      }} accessible={false}>
      <SafeAreaView style={styles.container}>
        <Header
          title="Đặt Trọng Tài"
          hideBack={true}
          pressBackButton={() => {
            this.props.navigation.navigate ('Service');
          }}
        />
        <View width={'100%'}>
          <View
            style={{
              height: 70,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-evenly',
            }}
          >
            <Text
              style={{
                width: '70%',
                paddingStart: '20%',
                paddingEnd: '2%',
                fontSize: 17,
              }}
              onPress={async () => {
                await this._pressLocation ();
              }}
            >
              Lấy vị trí của bạn{' '}
            </Text>
            <TouchableOpacity
              onPress={async () => {
                await this._pressLocation ();
              }}
              style={{width: '30%', paddingEnd: '20%'}}
            >
              <Image
                source={require ('../images/map.png')}
                style={{height: 50, width: 50}}
              />
            </TouchableOpacity>

          </View>
          <Text
            style={{
              paddingHorizontal: 50,
              width: '100%',
              fontSize: 20,
              fontFamily: 'arial',
            }}
          >
            {address}
          </Text>
          <View style={styles.personalInformation}>
            <TextInput
              style={styles.textInput}
              value={radius}
              onChangeText={radius => {
                this.setState ({currentLocation: {...currentLocation, radius}});
              }}
              onEndEditing={async () => {
                if (validateLocation (latitude, longitude) == false) {
                  await this._pressLocation ();
                }
                await this.getStadiumList ();
                await this.filterStadiums ();
              }}
              keyboardType={'numeric'}
              placeholder="Enter radius:"
            />
          </View>
          <View style={styles.FeeAndFree}>
            <TouchableOpacity
              onPress={async () => {
                await this.setState ({isFree: false});
                await this.filterStadiums ();
              }}
            >
              <Text
                style={{
                  fontSize: 17,
                  marginBottom: 10,
                  fontFamily: Platform.OS === 'ios'
                    ? 'arial'
                    : 'JosefinSans-Italic',
                }}
              >
                Fee
              </Text>
              <FontAwesome5
                name={isFree == true ? 'square' : 'check-square'}
                size={40}
                color={'black'}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={async () => {
                await this.setState ({isFree: true});
                await this.filterStadiums ();
              }}
            >
              <Text
                style={{
                  fontSize: 17,
                  marginBottom: 10,
                  fontFamily: Platform.OS === 'ios'
                    ? 'arial'
                    : 'JosefinSans-Italic',
                }}
              >
                Free
              </Text>
              <FontAwesome5
                name={isFree == true ? 'check-square' : 'square'}
                size={40}
                color={'black'}
              />
            </TouchableOpacity>
          </View>          
        </View>
        <FlatList
            data={filteredStadiums}
            keyExtractor={(item, index) => `${item.stadiumId}`}
            renderItem={({item, index, separators}) => (
              <StadiumItem {...item} />
            )}
        />
      </SafeAreaView>
      </TouchableWithoutFeedback>
    );
  }
}
const StadiumItem = props => {
  const {stadiumId, stadiumName, address, phoneNumber, distance} = props;
  return (
    <TouchableHighlight>
      <View
        style={{          
          justifyContent: 'center',          
          borderColor: '#a9a9a9',
          backgroundColor: '#f5f5f5',
          borderRadius: 15,
          borderWidth: 1,
          marginHorizontal:10,
          marginVertical:10,
          paddingHorizontal: 10
        }}
      >
<<<<<<< HEAD
        <View style={{padding:5}}>
          <Text style={{fontSize:17}}>Tên sân bóng: {stadiumName}</Text>
=======
        <Text style={{fontSize:17, paddingTop: 10}}>Tên sân bóng: {stadiumName}</Text>
>>>>>>> 7b827f4141a75545ef39fa6ce2c8b916c845c1a0
          <Text style={{fontSize:17}}>Địa chỉ sân bóng: {address}</Text>
          <Text style={{fontSize:17}}>Số điện thoại: {phoneNumber}</Text>
          <Text style={{fontSize:17, paddingBottom: 10}}>{distance}</Text>

      </View>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create ({
  container: {
    flex: 1,    
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  FeeAndFree: {
    flexDirection: 'row',
    height: 60,
    width: '100%',
    justifyContent: 'space-around',
    marginVertical: 25,
  },
  viewInformationStadium: {
    height: 150,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d3d3d3',
    borderRadius: 15,
    marginHorizontal: 15,
    marginVertical: 15,
  },
  bottomContainer: {
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    width: '80%',
  },
  textDifine: {
    width: '50%',

    fontSize: 17,
    paddingStart: '15%',
  },
  textInformation: {
    width: '50%',

    fontSize: 17,
    paddingEnd: '5%',
  },
  viewDetailStadium: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  personalInformation: {
    height: 75,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
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
  },
});
