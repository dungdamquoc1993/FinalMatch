import React, {Component} from 'react'
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  FlatList,
} from 'react-native'
import {
  getRefereesAroundOrder,   
} from '../server/myServices'
import {NavigationEvents} from 'react-navigation'
import Header from './Header'
import {translate} from '../languages/languageConfigurations'
import MultiLanguageComponent from './MultiLanguageComponent'
import { urlGetAvatar } from '../server/urlNames'
export default class RefereeList extends MultiLanguageComponent {
  static navigationOptions = {
    headerShown: false,
  }
  state = {
    referees: []
  }
  _getRefereesList = async () => {
    const {
      radius,      
      latitude, 
      longitude,
      matchTiming
    } = this.props.navigation.state.params            
    let referees = await getRefereesAroundOrder(radius, latitude, longitude)
    debugger
    this.setState({referees})
  }
  render () {
    const {navigate} = this.props.navigation   
    const {referees} = this.state
    return (
      <SafeAreaView style={styles.container}>
        <NavigationEvents
          onWillFocus={payload => {
            this._getRefereesList()
          }}
        />        
        <Header
          title={translate('Referees around you')}
          hideBack={true}
          pressBackButton={() => {
            this.props.navigation.navigate ('OrderReferee')
          }}
        />
        <FlatList
          width={'100%'}
          data={referees}
          renderItem={({item}) => (
            <Item {...item}/>
          )}
          keyExtractor={item => item.id}
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
      refereeServiceSupplierId,
      refereeId,
      refereePrice,
      refereeName,
      position,
      distance,
      positionAt,
      order,
      ages
    } = this.props 
    return (
      <View style={styles.ViewAllInformation}>
        <View style={styles.ViewDetail}>
          <View style={styles.viewInformation}>
            <Text style={styles.textLabel}>{translate('Name : ')}</Text>
            <Text style={styles.textLabel}>{refereeName || name}</Text>
          </View>          
          <View style={styles.viewInformation}>
            <Text style={styles.textLabel}>{translate("Address : ")}</Text>
            <Text style={styles.textLabel}>{ages}</Text>
          </View>
          <View style={styles.viewInformation}>
            <Text style={styles.textLabel}>{translate("Referee's price: ")}</Text>
            <Text style={styles.textLabel}>{refereePrice}</Text>
          </View>
        </View>
  
        <View style={styles.viewButton}>
        <Image
              source={
                avatar.length > 0
                  ? { uri: urlGetAvatar(avatar) }
                  : require('../images/avatar.png')
              }
              style={styles.images}
            />
  
          <TouchableOpacity
            style={styles.btnOrder}
            onPress={() => this.setState ({order: !this.state.order})}
          >
  
            {order == false
              ? <Text style={styles.textOrder}>{orderReferee}</Text>
              : <Image
                  source={'../images/Order.png'}
                  style={{height: 50, width: 90, borderRadius: 25}}
                />}
  
          </TouchableOpacity>
        </View>
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
