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
  Keyboard,
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
import {translate} from '../languages/languageConfigurations';
import MultiLanguageComponent from './MultiLanguageComponent';
export default class Stadium extends MultiLanguageComponent {
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
  componentDidMount () {
    this.keyboardDidHideListener = Keyboard.addListener (
      'keyboardDidHide',
      this._pressLocation
    );
  }
  componentWillUnmount () {
    this.keyboardDidHideListener.remove ();
  }
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
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss ();
        }}
        accessible={false}
      >
        <SafeAreaView style={styles.container}>
          <Header
            title={translate ('Search Stadium')}
            hideBack={true}
            pressBackButton={() => {
              this.props.navigation.navigate ('Service');
            }}
          />
          <View width={'100%'}>
            <View
              style={{
                height: 80,
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                width: '100%',
              }}
            >

              <View style={{flexDirection: 'column', width: '40%'}}>
                <TouchableOpacity
                  onPress={async () => {
                    await this._pressLocation ();
                  }}
                  style={{width: '30%', paddingStart: '22%', marginBottom: 5}}
                >
                  <Image
                    source={require ('../images/pin.png')}
                    style={{height: 50, width: 50}}
                  />
                </TouchableOpacity>
                <Text
                  style={{
                    paddingStart: '12%',
                    paddingEnd: '2%',
                    fontSize: 17,
                    marginTop: 5,
                  }}
                  onPress={async () => {
                    await this._pressLocation ();
                  }}
                >
                  {translate ('Get location : ')}{' '}
                </Text>

              </View>

              <TextInput
                style={styles.textInput}
                value={radius}
                onChangeText={radius => {
                  this.setState ({
                    currentLocation: {...currentLocation, radius},
                  });
                }}
                onEndEditing={async () => {
                  if (validateLocation (latitude, longitude) == false) {
                    await this._pressLocation ();
                  }
                  await this.getStadiumList ();
                  await this.filterStadiums ();
                }}
                keyboardType={'numeric'}
                placeholder={translate ('Range around you : ')}
              />
              <Text
                style={{
                  position: 'absolute',
                  left: '90%',
                  lineHeight: 50,
                  fontSize: 17,
                }}
              >
                KM
              </Text>

            </View>
            <Text
              style={{
                paddingHorizontal: '25%',
                width: '100%',
                fontSize: 20,
                fontFamily: 'arial',
                marginTop:20
              }}
            >
              {address}
            </Text>

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
          marginHorizontal: 10,
          marginVertical: 10,
          paddingHorizontal: 10,
        }}
      >
        <Text style={{fontSize: 17, paddingTop: 10}}>
          Tên sân bóng: {stadiumName}
        </Text>
        <Text style={{fontSize: 17}}>{translate ('Stadium address : ')}{address}</Text>
        <Text style={{fontSize: 17}}>{translate ('Phone number : ')}{phoneNumber}</Text>
        <Text style={{fontSize: 17, paddingBottom: 10}}>{distance}</Text>
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
    width: '100%'
  },
  FeeAndFree: {
    flexDirection: 'row',
    height: 60,
    width: '100%',
    justifyContent: 'space-around',
    marginVertical: 20,
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
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    width: '60%',
    height: 50,
    backgroundColor: '#f5f5f5',
    borderRadius: 25,
    borderColor: '#a9a9a9',
    borderWidth: 1,
    paddingStart: 15,
    fontSize: 17,
    marginEnd: 10,
  },
});
