import React, {Component} from 'react';
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  Platform,
  Image,
  TouchableOpacity,
  FlatList
} from 'react-native';
import Header from './Header';
import {translate} from '../languages/languageConfigurations';
import MultiLanguageComponent from './MultiLanguageComponent';
import {getLatLongFromAddress} from '../server/googleServices'
import {getStadiumsAroundPoint} from '../server/myServices'

export default class SearchPlace extends MultiLanguageComponent {
  state = {
    typedAddress: 'Haha',    
    radius: 8,//8km
    stadiums: []
  }
  searchPlace = async () => {
    try {
      const {typedAddress} = this.state
      const { latitude = 0, longitude = 0} = await getLatLongFromAddress(typedAddress)
      console.log(`${latitude} - ${longitude}`)
    } catch (error) {
      alert("Cannot get . Error: "+error.toString())
    }
    
  }
  
  render() {
    const { typedAddress, radius, stadiums } = this.state
    return (
      <View style={styles.container}>        
        <View style={styles.personalInformation}>
          <TextInput
            value = {"hahaha"}
            style={{
              width: '85%',
              height: 50,              
              fontSize: 17,              
              lineHeight: Platform.OS === 'ios' ? 0 : undefined,
              paddingStart: 15,
              fontFamily: Platform.OS === 'ios'
                ? 'arial'
                : 'JosefinSans-Italic',
            }}
            
            // onChangeText = {(typedAddress) => {
            //   debugger
            //   this.setState({typedAddress})
            // }}
            placeholder="Địa điểm thi đấu"
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
            data={stadiums}
            renderItem={({ item }) => (
              <Item {...item} />
            )}
            keyExtractor={item => item.id}
          />
      </View>
    )
  }
}
class Item extends Component {
  render() {
    const { stadiumAddress } = this.props
    return (
      <View style={styles.ViewAllInformation}>
        <TouchableOpacity style={{ width: '85%', height: '100%' }}>
          <Text style={{
            fontSize: 17,
            lineHeight: 60,
            fontFamily: Platform.OS === 'ios'
              ? 'arial'
              : 'JosefinSans-Italic',
          }}>{stadiumAddress}</Text>
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
    marginVertical: 50,
  },
  ViewAllInformation: {
    flexDirection: 'row',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d3d3d3',
    borderRadius: 15,
    marginVertical: 10,
    marginHorizontal: 20,
  },
})
