import React, {Component} from 'react'
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  Platform,
  Image,
  TouchableOpacity,
  FlatList,
  Keyboard
} from 'react-native'
import Header from './Header'
import {translate} from '../languages/languageConfigurations'
import MultiLanguageComponent from './MultiLanguageComponent'
import {getLatLongFromAddress, getPlacesFromAddress} from '../server/googleServices'
import {isIOS, print} from '../helpers/Helpers'

export default class SearchPlace extends MultiLanguageComponent {  
  state = {
    typedAddress: '',    
    radius: 8,//8km
    places: []
  }
  searchPlace = async () => {
    try {
      const {typedAddress} = this.state            
      const places = await getPlacesFromAddress(typedAddress)                 
      debugger
      this.setState({places})      
      Keyboard.dismiss()
    } catch (error) {
      alert("Cannot get places. Error: "+error.toString())
    }    
  }
  render() {
    const { typedAddress, places } = this.state    
    const {updatePlace} = this.props.navigation.state.params        
    return (
      <View style={styles.container}>        
        <Header title={translate('Search place')} 
          hideBack={false}
          hideNext={true}
          pressBackButton={() => {
          this.props.navigation.pop()
          }}/>
        <View style={styles.personalInformation}>          
          <TextInput
            style={{
              width: '85%',
              color: 'black',              
              height: 50,
              fontSize: 17,
              lineHeight: isIOS == true ? 0 : null,
              paddingStart: 15,                                          
            }}
            value = {typedAddress}
            onChangeText = {(typedAddress) => {
              this.setState({typedAddress})
            }}
            onEndEditing = {this.searchPlace}            
            placeholder = {translate("Enter place to search")}
          />
          <TouchableOpacity
            style={{
              width: '20%',
              height: 50,
              justifyContent: 'center',
              alignItems: 'center',
              paddingEnd: 20,
            }}
            onPress={() => {
              this.searchPlace()
            }}
          >
            <Image
              source={require('../images/search.png')}
              style={{
                height: 40,
                width: 40,
              }}
            />
          </TouchableOpacity>
        </View>
        <FlatList
            width={'100%'}
            data={places}
            renderItem={({ item }) => (
              <Item {...item} 
                updatePlace = {updatePlace}
                navigation = {this.props.navigation}
                />
            )}
            keyExtractor = {item => item.placeId}            
          />
      </View>
    )
  }
}
class Item extends Component {
  render() {    
    const { formattedAddress, latitude, longitude, name, placeId } = this.props    
    const {updatePlace, navigation} = this.props    
    return (
      <View style={styles.ViewAllInformation}>
        <TouchableOpacity 
          style={{ width: '85%', height: '100%' }}
          onPress = {() => {            
            updatePlace(formattedAddress, latitude, longitude)
            navigation.goBack()
          }}
          >
          <Text style={{
            fontSize: 17,
            paddingVertical: 5            
          }}>{formattedAddress}</Text>
        </TouchableOpacity>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  personalInformation: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: '90%',
    borderColor: '#a9a9a9',
    borderWidth: 1,
    height: 50,
    backgroundColor: '#f5f5f5',
    borderRadius: 25,
    borderColor: '#a9a9a9',
    marginVertical: 50,
  },
  ViewAllInformation: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d3d3d3',
    borderRadius: 15,
    marginVertical: 10,
    marginHorizontal: 20,
  },
})
