import React, {Component} from 'react'
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView,
  FlatList,
} from 'react-native'
import {
  getPlayersAroundOrder, 
  getRefereesAroundOrder,
} from '../server/myServices'
import {NavigationEvents} from 'react-navigation'

import Header from './Header'
import {translate} from '../languages/languageConfigurations'
import MultiLanguageComponent from './MultiLanguageComponent'

export default class PlayersList extends MultiLanguageComponent {
  static navigationOptions = {
    headerShown: false,
  }
  state = {    
    players:[]
  }
  _getPlayersList = async () => {
    const {
      radius,
      position, //1, 2, 3, 4
      latitude, 
      longitude,
      matchTiming
    } = this.props.navigation.state.params        
    console.log({radius,
      position, //1, 2, 3, 4
      latitude, 
      longitude,
      matchTiming})
    let players = await getPlayersAroundOrder(radius, latitude, longitude, position)
    this.setState({players})
  }
  render () {
    const {players} = this.state
    const {navigate} = this.props.navigation      
    return (
      <SafeAreaView style={styles.container}>        
        <NavigationEvents
          onWillFocus={(payload) => {
            this._getPlayersList()
          }}
        />
        <Header
          title={translate('Player around you')}
          hideBack={true}
          pressBackButton={() => {
            this.props.navigation.navigate ('OrderPlayer')
          }}
        />
        <FlatList
          width={'100%'}
          data={players}
          renderItem={({item}) => (
            <Item {...item}/>
          )}
          keyExtractor={item => item.supplierId}
        />
        <TouchableOpacity
          style={styles.buttonSubmit}
          onPress={() => {
            navigate ('Service')
          }}
        >
          <Text style={styles.textSubmit}>
            Xong
          </Text>
        </TouchableOpacity>

      </SafeAreaView>
    )
  }
}
class Item extends Component {    
  render () {
    const {
      avatar,
      password,
      phoneNumber,
      dateOfBirth,
      facebookId,
      email,
      userType,
      point,
      latitude,
      longitude,
      address,
      radius,
      isActive,
      tokenKey,
      playerServiceSupplierId,
      playerId,
      playerPrice,
      playerName,
      position,
      distance,
      positionAt,
    } = this.props        
    console.log(JSON.stringify(this.props))
    return (
      <View style={styles.ViewAllInformation}>
        <View style={styles.ViewDetail}>
          <View style={styles.viewInformation}>
            <Text style={styles.textLabel}>{translate('Name : ')}</Text>
            <Text style={styles.textLabel}>{playerName || name}</Text>
          </View>
          <View style={styles.viewInformation}>
            <Text style={styles.textLabel}>{translate('Position : ')}</Text>
            <Text style={styles.textLabel}>{position}</Text>
          </View>
          <View style={styles.viewInformation}>
            <Text style={styles.textLabel}>{translate("Address : ")}</Text>
            <Text style={styles.textLabel}>{address}</Text>
          </View>
          <View style={styles.viewInformation}>
            <Text style={styles.textLabel}>{translate("Player's price: ")}</Text>
            <Text style={styles.textLabel}>{playerPrice}</Text>
          </View>
        </View>
  
        {/* <View style={styles.viewButton}>
          <Image source={avatar} style={styles.images} />
  
          <TouchableOpacity
            style={styles.btnOrder}
            onPress={() => this.setState ({order: !this.state.order})}
          >
  
            {order == false
              ? <Text style={styles.textOrder}>{orderPlayer}</Text>
              : <Image
                  source={imagechecked}
                  style={{height: 50, width: 90, borderRadius: 25}}
                />}
  
          </TouchableOpacity>
        </View> */}
      </View>
    )
  }
}


const styles = StyleSheet.create ({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  ViewAllInformation: {
    flexDirection: 'row',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d3d3d3',
    borderRadius: 15,
    marginVertical: 10,
    marginHorizontal: 20,
  },
  ViewDetail: {
    flexDirection: 'column',
    width: '60%',
    paddingEnd: '10%',
  },
  viewInformation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: '4%',
  },
  textLabel: {
    fontSize: 17,
    
  },
  btnOrder: {
    width: 90,
    height: 50,
    justifyContent: 'center',
    borderRadius: 25,
    backgroundColor: '#dcdcdc',
    alignItems: 'center',
  },
  viewButton: {
    flexDirection: 'column',
    justifyContent: 'center',
    paddingStart: '5%',
  },
  images: {
    height: 90,
    width: 90,
  },
  textOrder: {
    lineHeight: 50,
    
    fontSize: 17
  },
  buttonSubmit: {
    height: 50,
    marginTop: 20,
    width: '90%',
    alignSelf: 'center',
    borderRadius: 6,
    paddingHorizontal: 10,
    fontSize: 17,
    backgroundColor: '#00CCFF',
    justifyContent: 'center',
    borderRadius: 25,
    marginVertical: 20,
  },
  textSubmit: {
    lineHeight: 50,
    fontSize: 20,
    color: 'white',
    alignSelf: 'center',    
  },
})
