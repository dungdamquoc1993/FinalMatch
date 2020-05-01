import React, {Component} from 'react'
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
} from 'react-native'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import Header from './Header'
import {
  getAddressFromLatLong,
  checkLocationPermission,
} from '../server/googleServices'
import {getStadiumsAroundPoint} from '../server/myServices'
import Geolocation from 'react-native-geolocation-service'
import {validateLocation} from '../Validations/Validation'
import {translate} from '../languages/languageConfigurations'
import MultiLanguageComponent from './MultiLanguageComponent'
export default class Stadium extends MultiLanguageComponent {
  static navigationOptions = {
    headerShown: false,
  }
  state = {
    isFree: false,
    currentLocation: {
      address: '',      
      latitude: 0.0,
      longitude: 0.0,
      radius: '10', //de number se rat nhieu bug khi go textinput
    },
    stadiums: [], //free + unfree
    filteredStadiums: [],
  }
  getStadiumList = async () => {
    try {
      const {latitude = 0, longitude = 0, radius} = this.state.currentLocation
      const {data, message, error} = await getStadiumsAroundPoint (
        latitude,
        longitude,
        parseFloat (radius)
      )
      if (error) {
        alert (translate("Cannot get stadium list:")+ error.toString ())
      } else {
        this.setState ({stadiums: data})
        this.filterStadiums ()
      }
    } catch (error) {
      alert (translate("Cannot get stadium list:")+ error.toString ())
    }
  }
  filterStadiums = () => {
    const {stadiums, isFree} = this.state
    this.setState ({
      filteredStadiums: stadiums.filter (stadium => {
        return stadium.type == (isFree === true) ? 0 : 1
      }),
    })
  }

  _pressLocation = async () => {
    const hasLocationPermission = await checkLocationPermission ()
    if (hasLocationPermission) {
      Geolocation.getCurrentPosition (
        async position => {
          const {latitude, longitude} = position.coords

          const address = await getAddressFromLatLong (latitude, longitude)
          this.setState ({
            currentLocation: {
              address,              
              latitude,
              longitude,
              radius: this.state.currentLocation.radius,
            },
          })

          await this.getStadiumList ()
        },
        error => {
          console.log (error.code, error.message)
        },
        {enableHighAccuracy: true, timeout: 5000, maximumAge: 10000}
      )
    }
  }
  componentDidMount () {
    this.keyboardDidHideListener = Keyboard.addListener (
      'keyboardDidHide',
      this._pressLocation
    )
  }
  componentWillUnmount () {
    this.keyboardDidHideListener.remove ()
  }
  render () {
    const {isFree, filteredStadiums} = this.state
    const {currentLocation} = this.state
    const {
      address,      
      latitude,
      longitude,
      radius,
    } = currentLocation
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss ()
        }}
        accessible={false}
      >
        <SafeAreaView style={{
          flex: 1,          
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',    
        }}>
          <Header            
            title={translate ("Search Stadium")}
            hideBack = {false}            
            hideNext = {true}            
            pressBackButton={() => {
              this.props.navigation.navigate ('Service')
            }}
          />          
            <View
              style={{
                height: 80,
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                alignItems: 'center',                
              }}
            >

              <View style={{
                flexDirection: 'column', 
                width: 120, 
                justifyContent:'center', 
                alignItems:'center',                
                }}>
                <TouchableOpacity
                  onPress={async () => {
                    await this._pressLocation()
                  }}
                  style={{width: 100}}
                >
                  <Image
                    source={require ('../images/pin.png')}
                    style={{height: 40, width: 40, alignSelf:'center'}}
                  />
                </TouchableOpacity>
                <Text
                  style={{                    
                    fontSize: 15,
                    marginTop: 5,
                    textAlign:'center',
                    alignSelf:'center'
                  }}
                  onPress={async () => {
                    await this._pressLocation()
                  }}
                >
                  {translate ("Get location")}
                </Text>

              </View>

              <TextInput
                style={{                  
                  height: 50,
                  backgroundColor: '#f5f5f5',
                  borderRadius: 25,
                  borderColor: '#a9a9a9',
                  borderWidth: 1,                  
                  fontSize: 15,     
                  paddingHorizontal: 10,             
                }}
                value={radius}
                onChangeText={radius => {
                  this.setState ({
                    currentLocation: {...currentLocation, radius},
                  })
                }}
                onEndEditing={async () => {
                  if (validateLocation (latitude, longitude) == false) {
                    await this._pressLocation()
                  }
                  await this.getStadiumList ()
                  await this.filterStadiums ()
                }}
                keyboardType={'numeric'}
                placeholder={translate ("Range around you : ")}
              />
              <Text
                style={{                  
                  lineHeight: 50,
                  fontSize: 15,
                  marginStart: 5,
                }}
              >
                KM
              </Text>

            </View>
            <Text
              style={{
                paddingHorizontal: 20,
                width: '100%',
                fontSize: 16,                
                marginTop:10
              }}
            >
              {address}
            </Text>

            <View style={{
              flexDirection: 'row',
              height: 60,
              width: '100%',
              justifyContent: 'space-around',
              marginVertical: 10,
            }}>
              <TouchableOpacity
                onPress={async () => {
                  await this.setState ({isFree: false})
                  await this.filterStadiums ()
                }}
              >
                <Text
                  style={{
                    fontSize: 15,
                    marginBottom: 10,                    
                  }}
                >
                  {translate("Fee")}
                </Text>
                <FontAwesome5
                  name={isFree == true ? 'square' : 'check-square'}
                  size={40}
                  color={'black'}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={async () => {
                  await this.setState ({isFree: true})
                  await this.filterStadiums ()
                }}
              >
                <Text
                  style={{
                    fontSize: 15,
                    marginBottom: 10,                    
                  }}
                >
                  {translate("Free")}                  
                </Text>
                <FontAwesome5
                  name={isFree == true ? 'check-square' : 'square'}
                  size={40}
                  color={'black'}
                />
              </TouchableOpacity>
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
    )
  }
}
const StadiumItem = props => {
  const {stadiumId, stadiumName, address, phoneNumber, distance} = props
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
        <Text style={{fontSize: 15, paddingTop: 10}}>
          {translate("Stadium's name:")}{stadiumName}
        </Text>
        <Text style={{fontSize: 15}}>{translate ("Stadium's address : ")}{address}</Text>
        <Text style={{fontSize: 15}}>{translate("Phone : ")}{phoneNumber}</Text>
        <Text style={{fontSize: 15, paddingBottom: 10}}>{distance}</Text>
      </View>
    </TouchableHighlight>
  )
}

const styles = StyleSheet.create ({    
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

    fontSize: 15,
    paddingStart: '15%',
  },
  textInformation: {
    width: '50%',

    fontSize: 15,
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
})
