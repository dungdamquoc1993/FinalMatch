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
import {
  firebaseDatabase,  
} from '../server/googleServices'
import {
  OrderStatus,
  getColorFromStatus,
  getCustomerFromStorage,
  alertWithOKButton
} from '../helpers/Helpers'
import {  
  updateOrderStatus, 
} from '../server/myServices'
import { urlGetAvatar } from '../server/urlNames'
const { PENDING, ACCEPTED,CANCELLED, COMPLETED, MISSED } = OrderStatus
import {
  COLOR_ITEM_BACKGROUND,
  COLOR_ITEM_BORDER,
  MAIN_COLOR,
  COLOR_CANCEL_SOMETHING
} from '../colors/colors'
import Spinner from 'react-native-loading-spinner-overlay'

export default class Orders extends MultiLanguageComponent {
  static navigationOptions = {
    headerShown: false,
  }
  state = {
    orders: [], 
    spinner: false,    
  }
  _getOrdersFromServer = async () => {            
    this.setState({spinner: true})
    let orders =  await getOrdersByCustomerId()
    this.setState({orders, spinner: false})
  }
    
  async componentDidMount () {            
    await super.componentDidMount()
    this._getOrdersFromServer()
    firebaseDatabase.ref ('/orders').on ('value', async snapshot => {    
      debugger        
      if(super.hasOrder = true) {
        await this._getOrdersFromServer()
      }          
    })        
  }  

  render () {
    const { orders } = this.state    
    const {navigate} = this.props.navigation
    return (
      <SafeAreaView style={styles.container}>
        <Spinner
          visible={this.state.spinner}
          textContent={'Loading...'}
          textStyle={{fontWeight: 'bold'}}
        />
      <Text style={styles.textTitle}>{translate("Create a service")}</Text>
        <FlatList
          width={'100%'}
          data={orders}                    
          renderItem={({item}) => (
            <Item {...item}/>
          )}
          keyExtractor={item => `${item.orderId}`}
        />
      </SafeAreaView>
    )
  }
}
class Item extends Component {
  state = {
    order: false
  }
  render() {
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
          {/* <View style={styles.ViewNamedetailArbitration}>
          <Text style={styles.textLabel}>{translate('Address : ')}</Text>
          <Text style={styles.textLabel}>{supplierAddress}</Text>
        </View> */}
          <View style={styles.ViewNamedetailArbitration}>
            <Text style={styles.textLabel}>{translate('Price : ')}</Text>
            <Text style={styles.textLabel}>{typeRole.trim().toLowerCase() == 'referee' ?
              refereePrice : playerPrice}</Text>
          </View>
          <View style={styles.ViewNamedetailArbitration}>
            <Text style={styles.textLabel}>{translate("Order's date : ")}</Text>
            <Text style={styles.textLabel}>{dateTimeStart.split('T')[0]}</Text>
          </View>
          {orderStatus == ACCEPTED && <AcceptedItem 
              pressReject={async ()=>{    
                alertWithOKButton(
                  translate("Are you sure you want to cancel this order ?"),
                  async () => {
                    await updateOrderStatus(orderId, CANCELLED)
                  })                        
              }} 
          />}
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

const AcceptedItem = ({pressReject}) => {  
  return <TouchableOpacity onPress={pressReject}>
    <Text  style={{
      fontSize: 17,
      padding: 5,
      borderRadius: 6,
      color: 'white',
      backgroundColor: COLOR_CANCEL_SOMETHING
    }}>{translate("Cancel order")}</Text>
  </TouchableOpacity>
}
/*
const CancelledItem = ({pressChat, pressCall, customerPhoneNumber, pressReject}) => {  
  return T
}
*/
const styles = StyleSheet.create ({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
    flex: 1,
  },
  ViewAllInformation: {
    flexDirection: 'row',
    paddingVertical:10,
    justifyContent: 'space-around',
    alignItems: 'stretch',
    borderWidth: 1,
    borderColor: COLOR_ITEM_BORDER,
    borderRadius: 15,
    marginVertical: 10,
    marginHorizontal: 20,
  },
  ViewDetail: {
    flexDirection: 'column',
    width: '60%',
    paddingEnd: '10%',
    justifyContent: 'center',
  },
  ViewNamedetailArbitration: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical:7
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
