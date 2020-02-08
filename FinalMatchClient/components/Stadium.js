import React, {Component} from 'react'
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ScrollView,
  Platform,
  TextInput,
  FlatList,
} from 'react-native'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import Header from './Header'
import {
  getAddressFromLatLong,
  checkLocationPermission,
} from '../server/googleServices'
import {getStadiumsAroundPoint} from '../server/myServices'
import Geolocation from 'react-native-geolocation-service'
export default class Stadium extends Component {
  static navigationOptions = {
    headerShown: false,
  }
  state = {
    isFree: false,    
    currentLocation: {
      address: '',
      district: '',
      province: '',
      latitude: 0.0,
      longitude: 0.0,
      radius: 10,    
    },    
    stadiums: [],//free + unfree
    filteredStadiums: []
  }
  getStadiumList = async () => {
    try {
      const {isFree} = this.state      
      const { latitude = 0, longitude = 0, radius} = this.state.currentLocation
      debugger
      const { data, message, error } = await getStadiumsAroundPoint(latitude, longitude, radius)
      if(error) {
        alert("Cannot get stadium list. Error: "+error.toString())
      } else {
        this.setState({stadiums: data})
        this.filterStadiums()
      }
    } catch (error) {
      alert("Cannot get stadium list. Error: "+error.toString())
    }
  }
  filterStadiums = () => {
    const {stadiums} = this.state   
    this.setState({filterStadiums: stadiums.filter(stadium => {
      return stadium.type == (isFree === true) ? 0 : 1
    })})
  }
  _pressLocation = async () => {
    const hasLocationPermission = await checkLocationPermission ()    
    if (hasLocationPermission) {
      
      Geolocation.getCurrentPosition (
        async position => {
          const {latitude, longitude} = position.coords
          debugger
          const {
            address = '',
            district = '',
            province = '',
          } = await getAddressFromLatLong (latitude, longitude)
          this.setState ({
            currentLocation: {
              address, 
              district, 
              province, 
              latitude, 
              longitude,
              radius: this.state.currentLocation.radius
            },
          })
          debugger
          await this.getStadiumList()          
        },
        error => {
          console.log (error.code, error.message)
        },
        {enableHighAccuracy: true, timeout: 5000, maximumAge: 10000}
      )
    }
  }
  render () {
    const {isFree, filteredStadiums} = this.state    
    const {currentLocation, radius} = this.state
    const {address, district, province, latitude, longitude} = currentLocation
    return (
      <SafeAreaView style={styles.container}>
        <Header
          title="Đặt Trọng Tài"
          hideBack={true}
          pressBackButton={() => {
            this.props.navigation.navigate ('Service')
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
                fontFamily: Platform.OS === 'ios'
                  ? 'arial'
                  : 'JosefinSans-Italic',
              }}
            >
              Lấy vị trí của bạn{' '}
            </Text>
            <TouchableOpacity
              onPress={async () => {
                await this._pressLocation ()
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
              width: '70%',
              fontSize: 17,
              fontFamily: Platform.OS === 'ios'
                ? 'arial'
                : 'JosefinSans-Italic',
            }}
          >
            {address}
          </Text>
          <View style={styles.personalInformation}>
            <TextInput
              style={styles.textInput}
              value={radius}
              onChangeText = {(radius) => {
                this.setState({radius})
              }}
              keyboardType={'numeric'}
              placeholder={'Enter radius: '}
            />
          </View>
          <View style={styles.FeeAndFree}>
            <TouchableOpacity
              onPress={() => {
                this.setState ({isFree: false})
                this.getStadiumList()
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
                name={isFree == false ? 'check-square' : 'square'}
                size={40}
                color={'black'}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.setState ({isFree: true})
                this.getStadiumList()
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
          <FlatList data = {filteredStadiums}
              keyExtractor = {(index) => `${index}`}
              renderItem={({item, index, separators}) => <StadiumItem />}
          >
          </FlatList> 

        </View>
      </SafeAreaView>
    )
  }
}
const StadiumItem = ({props}) => {
  const {stadiumId, stadiumName, address, phoneNumber, distance} = props
  return <TouchableHighlight>
    <View>
      <Text>{stadiumName}</Text>
      <Text>{address}</Text>
      <Text>{phoneNumber}</Text>
      <Text>{distance}</Text>
    </View>
  </TouchableHighlight>
}


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
    fontFamily: Platform.OS === 'ios' ? 'arial' : 'JosefinSans-Italic',
    fontSize: 17,
    paddingStart: '15%',
  },
  textInformation: {
    width: '50%',
    fontFamily: Platform.OS === 'ios' ? 'arial' : 'JosefinSans-Italic',
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
    marginTop:20
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
    fontFamily: Platform.OS === 'ios' ? 'arial' : 'JosefinSans-Italic',
  },
})
