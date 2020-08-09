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
  createNewOrder
} from '../server/myServices'
import {NavigationEvents} from 'react-navigation'
import Header from './Header'
import {translate} from '../languages/languageConfigurations'
import MultiLanguageComponent from './MultiLanguageComponent'
import { urlGetAvatar } from '../server/urlNames'
import { getCustomerFromStorage} from '../helpers/Helpers'

export default class RefereeList extends MultiLanguageComponent {
  static navigationOptions = {
    headerShown: false,
  }
  state = {
    referees: [], 
    matchTiming: new Date()
  }
  _getRefereesList = async () => {
    const {
      radius,      
      orderLatitude, 
      orderLongitude,
      matchTiming //phải là kiểu Date
    } = this.props.navigation.state.params                
    let referees = await getRefereesAroundOrder(radius, orderLatitude, orderLongitude)
    
    this.setState({referees, matchTiming})
  }
  render () {
    const {navigate} = this.props.navigation   
    const {referees, matchTiming} = this.state
    const {      
      orderLatitude, 
      orderLongitude,      
    } = this.props.navigation.state.params  
    return (
      <SafeAreaView style={styles.container}>
        <NavigationEvents
          onWillFocus={payload => {
            this._getRefereesList()
          }}
        />        
        <Header
          title={translate('Referees around you')}
          hideNext={true}
          pressBackButton={() => {
            this.props.navigation.navigate ('OrderReferee')
          }}
        />
        <FlatList
          width={'100%'}
          data={referees}
          renderItem={({item}) => (
            <Item {...item} matchTiming={matchTiming} orderLatitude={orderLatitude} orderLongitude={orderLongitude}/>
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
            {translate("Done")}
          </Text>
        </TouchableOpacity>

      </SafeAreaView>
    )
  }
}
class Item extends Component {    
  state = {
    order: false
  }
  render () {
    const {
      avatar,      
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
      matchTiming,      
    } = this.props 
    const {order} = this.state    
    //address.split(',')[address.split(',').length-3].trim()
    const {orderLatitude, orderLongitude} = this.props
    return (
      <View style={styles.ViewAllInformation}>
        <View style={styles.ViewDetail}>
          <View style={styles.viewInformation}>
            <Text style={styles.textLabel}>{translate('Name : ')}</Text>
            <Text style={styles.textLabel}>{refereeName || name}</Text>
          </View>          
          <View style={styles.viewInformation}>
            <Text style={styles.textLabel}>{translate("Address : ")}</Text>
            <Text style={styles.textLabel}>{address.split(',')[address.split(',').length-3].trim()}</Text>
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
            onPress={async () => {
              
              if(order == true) {
                return
              }
              const {customerId} = await getCustomerFromStorage()                            
              await createNewOrder(
                  refereeServiceSupplierId, 
                  orderLatitude,
                  orderLongitude,
                  customerId, 
                  'referee',             
                  matchTiming //phải là kiểu Date, matchTiming chính là dateTimeStart     
              )
              this.setState ({order: true})
            }}
          >
            {/* Tu chuyen order sang true/false*/}
            {order == false
              ? <Text style={styles.textOrder}>{"Order"}</Text>
              : <Image
                  source={require('../images/Order.png')}
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
