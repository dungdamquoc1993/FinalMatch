import React, {Component, useState} from 'react'
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  FlatList,
  Dimensions,
  Image,
} from 'react-native'
import Header from './Header'
import Modal from 'react-native-modal'
import {
  getSupplierFromStorage, 
  getColorFromStatus,
  OrderStatus,
  isIOS
} from '../helpers/Helpers'

import {
  firebaseDatabase,
  getAddressFromLatLong
} from '../server/googleServices'
import {
  getOrdersBySupplierId, 
  updateOrderStatus, 
} from '../server/myServices'
import i18n from "i18n-js"
import {
  COLOR_ITEM_BACKGROUND,
  COLOR_ITEM_BORDER,
  MAIN_COLOR,
  COLOR_CANCEL_SOMETHING,
  COLOR_ORDER_STATUS_ACCEPTED,
  COLOR_ORDER_STATUS_CANCELLED
} from '../colors/colors'


const { PENDING, ACCEPTED,CANCELLED, COMPLETED, MISSED } = OrderStatus
import MultiLanguageComponent from './MultiLanguageComponent'
import {translate} from '../languages/languageConfigurations'
export default class Orders extends MultiLanguageComponent {
  constructor (props) {
    super (props)    
    this.state = {
      supplierId: '',
      orders: [],
    }
  }  
  async componentDidMount () {        
    await super.componentDidMount()
    await this._reloadOrders()
    firebaseDatabase.ref ('/orders').on ('value', async snapshot => {            
      if(super.hasOrder = true) {
        //Goi api load orders        
        await this._reloadOrders()
      }          
    })        
  }
  _reloadOrders = async () => {
      const {tokenKey, supplierId, email} = await getSupplierFromStorage ()
      let orders = await getOrdersBySupplierId ()      
      this.setState ({orders, supplierId})        
  }
  render () {
    const {orders} = this.state    
    const {navigate} = this.props.navigation      
    return (
      <SafeAreaView style={styles.container}>
        <View 
          style={{          
            height: 60,
            width: '100%'
          }}          
        >
          <Header
            title={translate('Orders')}
            hideBack = {true}
            hideNext = {true}            
        />

        </View>
      
        <FlatList          
          width={'100%'}
          data={orders}
          // data={orders}          
          renderItem={({item, index}) => <Item {...item} index = {index}
              _reloadOrders={this._reloadOrders}
              navigate = {navigate}/>}
          keyExtractor={item => `${item.orderId}`}
        />
      </SafeAreaView>
    )
  }
}

class Item extends Component {
  state = {    
    orderAddress: ''
  }
  async componentDidMount() {
    const {orderLatitude,orderLongitude} = this.props //orderLatitude,orderLongitude co ngay khi vao constructor
    const {address} = await getAddressFromLatLong(orderLatitude, orderLongitude)    
    this.setState({orderAddress: address})
  }
  _fakeDataToTestUI = () => {
    const {index} = this.props
    if(index == 0) {
      return ACCEPTED      
    } else if(index == 1) {
      return CANCELLED
    } else if(index == 2) {
      return COMPLETED
    } else if(index == 3) {
      return MISSED
    } else if(index == 4) {
      return PENDING
    } else {
      return PENDING;
    }
  }
  render () {
    const {    
      orderId,
      typeRole,
      orderLatitude,
      orderLongitude,      
      // orderStatus,
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
      navigate,
      _reloadOrders
    } = this.props
    let strDatetimeStart = (new Date(dateTimeStart)).toLocaleString(i18n.locale == 'en' ? "en-US" : "vi-VN")    
    let orderStatus = this._fakeDataToTestUI()
    const {orderAddress} = this.state                
    return (
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <View style={{          
          backgroundColor: '#f5f5f5',
          borderRadius: 15,
          borderColor: COLOR_ITEM_BORDER,
          borderWidth: 1,
          marginVertical: 10,
          width: '80%',    
          padding: 10,
          justifyContent: 'space-between',    
        }}>
          {/* <Text style={styles.textOrderItem}>OOOO:{orderId}</Text> */}
          <View style = {{flexDirection: 'row', justifyContent: 'flex-end'}}>
            <Text style={{            
              fontSize: 15, 
              color: 'white',            
              backgroundColor: getColorFromStatus(orderStatus),             
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: 10,
              fontWeight: 'bold', 
              textAlign: 'right'}}>
                {translate(orderStatus)}
            </Text>
          </View>
          <Text style={styles.textOrderItem}>
            {translate("Name : ")}{customerName}
          </Text>
          <Text style={styles.textOrderItem}>
            {translate("Match's place")}
          </Text>
          <Text style={styles.textOrderItem}>
            {orderAddress}
          </Text>
          <Text style={styles.textOrderItem}>
            {translate("Match's timing")}
          </Text>
          <Text style={styles.textOrderItem}>{
            strDatetimeStart
          }</Text>          
          {orderStatus == PENDING && <PendingItem pressConfirm={async () => {
            let result = await updateOrderStatus(orderId, ACCEPTED)            
            if (result == true) {
              _reloadOrders()
            }
          }}
            pressCancel={async () => {
              let result = await updateOrderStatus(orderId, CANCELLED)
              if (result == true) {
                _reloadOrders()
              }
            }}
          />}
          {orderStatus == ACCEPTED && <AcceptedItem
            pressChat={() => {              
              navigate("Chat", { ...this.props })
            }}
            pressReject={async () => {
              let result = await updateOrderStatus(orderId, CANCELLED)
              if (result == true) {
                _reloadOrders()
              }
            }}
            customerPhoneNumber={customerPhoneNumber} />}
          {orderStatus == COMPLETED && <CompletedItem pressRate={() => { }} />}                    
        </View>
      </View>      
    )
  }
}
const PendingItem = ({pressConfirm, pressCancel}) => {  
  return (
  <View style={{ 
    flexDirection: 'row', 
    justifyContent: 'space-around',
    marginTop: 10,
    }}>    
    <TouchableOpacity
      style={{        
        flexDirection: 'row',
        width: 100,
        height: 40,
        backgroundColor: COLOR_ORDER_STATUS_ACCEPTED,
        alignItems: 'center',
        justifyContent: 'space-around',
        borderRadius: 8,
        paddingRight: 10,
      }}
      onPress={pressConfirm}
    >
      <Text style={{ 
        height: 40, 
        color: 'white',
        lineHeight: 40, 
        paddingLeft: 10,
        fontSize: 16 }}>{translate("Accept")}</Text>
      <Image
        source={require('../images/tick.png')}
        style={{ 
          height: 15, 
          width: 15,
          tintColor: 'white',
        }}
      />
    </TouchableOpacity>
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        width: 100,
        height: 40,
        backgroundColor: COLOR_ORDER_STATUS_CANCELLED,
        alignItems: 'center',
        justifyContent: 'space-around',
        borderRadius: 8,
      }}
      onPress={pressCancel}      
    >
      <Text style={{ 
        height: 40, 
        lineHeight: 40, 
        fontSize: 16,
        color: 'white',
        paddingLeft: 10,
      }}>{translate("Reject")}</Text>
      <Image
        source={require('../images/quit.png')}
        style={{ height: 30, width: 30 }}
      />
    </TouchableOpacity>
  </View>)
}

const AcceptedItem = ({pressChat, pressCall, customerPhoneNumber, pressReject}) => {  
  const [hasCancelButton, setHasCancelButton] = useState(false);
  return (<View style={{ flexDirection: 'column', justifyContent: 'space-evenly' }}>      
    <TouchableOpacity onPress={pressCall}>
      <Text style={styles.textOrderItem}>phone:{customerPhoneNumber}</Text>        
    </TouchableOpacity>    
    <TouchableOpacity
      style={{        
        marginTop: 10,        
        flexDirection: 'row',
        width: i18n.locale == 'en' ? 100 : 130,
        height: 40,
        backgroundColor: COLOR_ORDER_STATUS_ACCEPTED,
        alignItems: 'center',
        justifyContent: 'space-around',
        borderRadius: 8,
        paddingRight: 10,
      }}
      onPress={pressChat}
    >
      <Text style={{ 
        height: 40, 
        color: 'white',
        lineHeight: 40, 
        paddingLeft: 10,
        fontSize: 16 }}>{translate("Chat")}</Text>
      <Image
        source={require('../images/chat-icon.png')}
        style={{ 
          height: 25, 
          width: 25,
          tintColor: 'white',
        }}
      />
    </TouchableOpacity> 
    {hasCancelButton == false ? <TouchableOpacity 
      style={{
        width: '100%',
        height: 40,
        justifyContent: 'center',
        alignItems: 'center'
      }}
      onPress = {() => {
        setHasCancelButton(true)
      }}>
      <Image
          source={require('../images/expand-icon.png')}
          style={{ height: 30, width: 30 }}
        />
    </TouchableOpacity> : 
    <TouchableOpacity 
      style={{        
        marginTop: 10,                
        width: i18n.locale == 'en' ? 100 : 130,
        height: 40,
        backgroundColor: COLOR_ORDER_STATUS_CANCELLED,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        paddingRight: 10,
      }}
      onPress={pressReject}>      
      <Text style={{
        fontSize: 16,                
        paddingLeft: 10,
        borderRadius: 8,
        color: 'white',            
      }}>
        {translate("Cancel")}
      </Text>
    </TouchableOpacity>}     
  </View>)
}

const CompletedItem = ({pressRate}) => {  
  return (<View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>      
    {/* <TouchableOpacity onPress={pressRate}>      
      <Text style={styles.textOrderItem}>{translate("Rate app")}</Text>        
    </TouchableOpacity>     */}
  </View>)
}
const CancelledItem = ({}) => {  
  return (<View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>      
    <Text style={styles.textOrderItem}>{translate("Pressed cancel")}</Text>            
  </View>)
}

const styles = StyleSheet.create ({
  container: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },  
  textOrderItem: {
    fontSize: 15,
  },
})

