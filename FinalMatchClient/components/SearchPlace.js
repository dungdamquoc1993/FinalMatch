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
const DATA = [
  {
    id: '011',
    addressStadium: 'nha thi dau ba dinh',
  },
  {
    id: '015',
    addressStadium: 'nha thi dau ba dinh',
  },
  {
    id: '012',
    addressStadium: 'nha thi dau ba dinh',
  },
  {
    id: '013',
    addressStadium: 'nha thi dau ba dinh',
  },
];
export default class SearchPlace extends Component {
    state = {
        address: false,
      };
      
    render () {
        const{address} = this.state
    return (
      <View style={styles.container}>
        <View style={styles.personalInformation}>
          <TextInput
            style={{
              width: '85%',
              height:50,
              fontSize: 17,
              lineHeight: 0,
              paddingStart:15,
              fontFamily: Platform.OS === 'ios'
                ? 'arial'
                : 'JosefinSans-Italic',
            }}
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
                this.setState ({address: !this.state.address});
            }}
          >
            <Image
              source={require ('../images/search.png')}
              style={{
                height: 40,
                width: 40,
              }}
            />
          </TouchableOpacity>

        </View>
        {
            address==true &&
            <FlatList
          width={'100%'}
          data={DATA}
          renderItem={({item}) => (
            <Item
            addressStadium={item.addressStadium}
            />
          )}
          keyExtractor={item => item.id}
        />}
        
      </View>
    );
  }
}
class Item extends Component {
  render () {
    const {
        addressStadium
      } = this.props
    return (

      <View style={styles.ViewAllInformation}>
      <TouchableOpacity style={{width: '85%',height:'100%'}}>
      <Text style={{
              fontSize: 17,
              lineHeight:60,
              fontFamily: Platform.OS === 'ios'
                ? 'arial'
                : 'JosefinSans-Italic',}}>{addressStadium}</Text>
      </TouchableOpacity>
           
      </View>
    );
  }
}
const styles = StyleSheet.create ({
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
    marginVertical:50,
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
});
