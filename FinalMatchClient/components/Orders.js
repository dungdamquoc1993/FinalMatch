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
import {translate} from '../languages/languageConfigurations'
import MultiLanguageComponent from './MultiLanguageComponent'
import {getOrdersByCustomerId} from '../server/myServices'
import { urlGetAvatar } from '../server/urlNames'

export default class Orders extends MultiLanguageComponent {
  static navigationOptions = {
    headerShown: false,
  }
  state = {
    orders: [],
    loading: false, // user list loading
    isRefreshing: false, //for pull to refresh
  }
  _getOrdersFromServer = async () => {    
    this.setState({isRefreshing: true })
    let orders =  await getOrdersByCustomerId()
    this.setState({isRefreshing: false, orders})
  }
  async componentDidMount() {
    this._getOrdersFromServer()
  }
  render () {
    const { orders } = this.state
    const {navigate} = this.props.navigation
    return (
      <SafeAreaView style={styles.container}>
      <Text style={styles.textTitle}>{translate('Create a service')}</Text>
        <FlatList
          width={'100%'}
          data={orders}
          refreshing={this.state.isRefreshing}
          onRefresh = {() => {
            this._getOrdersFromServer()
          }}
          renderItem={({item}) => (
            <Item {...item}/>
          )}
          keyExtractor={item => item.orderId}
        />
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
    orderId,
    typeRole,
    orderLatitude,
    orderLongitude,
    orderStatus,
    createdDate,//convert mysql string to Date object
    dateTimeStart,
    dateTimeEnd,
    supplierId,
    supplierName,
    supplierPhoneNumber,
    supplierDateOfBirth,
    supplierEmail,
    supplierLatitude,
    supplierLongitude,
    supplierAddress,
    supplierRadius,
    supplierAvatar = "",
    playerPrice = 0.0,
    refereePrice = 0.0,
    customerId,
    customerAvatar,
    customerName,
    customerPhoneNumber,
customerEmail,
  } = this.props
  return (
    <View style={styles.ViewAllInformation}>
      <View style={styles.ViewDetail}>
        <View style={styles.ViewNamedetailArbitration}>
          <Text style={styles.textLabel}>{translate('Name : ')}</Text>
          <Text style={styles.textLabel}>{supplierName}</Text>
        </View>
        <View style={styles.ViewNamedetailArbitration}>
          <Text style={styles.textLabel}>{translate('Phone : ')}</Text>
          <Text style={styles.textLabel}>{supplierPhoneNumber}</Text>
        </View>
        <View style={styles.ViewNamedetailArbitration}>
          <Text style={styles.textLabel}>{translate('Address : ')}</Text>
          <Text style={styles.textLabel}>{supplierAddress}</Text>
        </View>
        <View style={styles.ViewNamedetailArbitration}>
          <Text style={styles.textLabel}>{translate('price : ')}</Text>
          <Text style={styles.textLabel}>{typeRole.trim().toLowerCase() == 'referee' ? 
                                                  refereePrice : playerPrice}</Text>
        </View>
        <View style={styles.ViewNamedetailArbitration}>
          <Text style={styles.textLabel}>{translate('orderDate : ')}</Text>
          <Text style={styles.textLabel}>{dateTimeStart}</Text>
        </View>
      </View>

      <View style={styles.viewButton}>      
        <Image
          source={
            supplierAvatar.length > 0
              ? { uri: urlGetAvatar(supplierAvatar) }
              : require('../images/avatar.png')
          }
          style={styles.images}
        />
        <TouchableOpacity
          style={styles.btnOrder}
        >
           <Text style={styles.textOrder}>{"Chat"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}
}
const styles = StyleSheet.create ({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
    flex: 1,
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
  ViewNamedetailArbitration: {
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
    borderRadius: 2,
    backgroundColor: '#dcdcdc',
    justifyContent: 'center'
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
    alignSelf: 'center',
    fontSize: 17,
  },
  textTitle: {
    fontSize: 20,
    textAlign: 'center',
  },
})
