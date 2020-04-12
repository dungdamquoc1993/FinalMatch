import React, {Component} from 'react'
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
  OrderStatus
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
  COLOR_CANCEL_SOMETHING
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
            title={'Order'}
            hideBack = {true}
            hideNext = {true}            
        />

        </View>
      
        <FlatList          
          width={'100%'}
          data={orders}
          // data={orders}          
          renderItem={({item}) => <Item {...item} 
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
      navigate,
      _reloadOrders
    } = this.props
    let strDatetimeStart = (new Date(dateTimeStart)).toLocaleString(i18n.locale == 'en' ? "en-US" : "vi-VN")
    const {orderAddress} = this.state                
    return (
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <View style={{
          height: 300,    
          backgroundColor: '#f5f5f5',
          borderRadius: 25,
          borderColor: COLOR_ITEM_BORDER,
          borderWidth: 1,
          marginVertical: 10,
          width: '80%',    
          padding: 30,
          justifyContent: 'space-between',    
        }}>
          {/* <Text style={styles.textOrderItem}>OOOO:{orderId}</Text> */}
          <Text style={{            
            fontSize: 15, 
            color: 'white',
            backgroundColor: getColorFromStatus(orderStatus), 
            fontWeight: 'bold', 
            textAlign: 'right'}}>
              {translate(orderStatus)}
          </Text>
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
            debugger
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
              debugger
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
          {orderStatus == CANCELLED && <CancelledItem />}
          {orderStatus == MISSED && <MissedItem />}
        </View>
      </View>
      
      
    )
  }
}
const PendingItem = ({pressConfirm, pressCancel}) => {  
  return (<View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        width: 100,
        height: 50,
        backgroundColor: COLOR_ITEM_BACKGROUND,
        alignItems: 'center',
        justifyContent: 'space-around',
        borderRadius: 8,
      }}
      onPress={pressConfirm}
    >
      <Text style={{ height: 50, lineHeight: 50, fontSize: 17 }}>{translate("Accept")}</Text>
      <Image
        source={require('../images/tick.png')}
        style={{ height: 30, width: 30 }}
      />
    </TouchableOpacity>
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        width: 100,
        height: 50,
        backgroundColor: COLOR_ITEM_BACKGROUND,
        alignItems: 'center',
        justifyContent: 'space-around',
        borderRadius: 8,
      }}
      onPress={pressCancel}      
    >
      <Text style={{ height: 50, lineHeight: 50, fontSize: 17 }}>{translate("Reject")}</Text>
      <Image
        source={require('../images/quit.png')}
        style={{ height: 30, width: 30 }}
      />
    </TouchableOpacity>
  </View>)
}

const AcceptedItem = ({pressChat, pressCall, customerPhoneNumber, pressReject}) => {  
  return (<View style={{ flexDirection: 'column', justifyContent: 'space-evenly' }}>      
    <TouchableOpacity onPress={pressCall}>
    <Text style={styles.textOrderItem}>phone:{customerPhoneNumber}</Text>        
    </TouchableOpacity>
    <TouchableOpacity
      style={{
        width: 90,
        height: 40,
        marginBottom: 5,
        borderRadius: 6,
        backgroundColor: '#dcdcdc',
        justifyContent: 'center',
        alignItems: 'center'
      }}
      onPress={pressChat}
    >
      <Text style={{ height: 50, lineHeight: 50, fontSize: 16 }}>{translate("Chat")}</Text>
      
    </TouchableOpacity>       
    <TouchableOpacity onPress={pressReject}>      
      <Text style={{
        fontSize: 17,
        padding: 5,
        paddingLeft: 10,
        borderRadius: 6,
        color: 'white',
        width: "50%",
        backgroundColor: COLOR_CANCEL_SOMETHING,        
      }}>
        {translate("Reject")}
      </Text>
    </TouchableOpacity>       
  </View>)
}

const CompletedItem = ({pressRate}) => {  
  return (<View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>      
    <TouchableOpacity onPress={pressRate}>      
      <Text style={styles.textOrderItem}>{translate("Rate app")}</Text>        
    </TouchableOpacity>    
  </View>)
}
const CancelledItem = ({}) => {  
  return (<View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>      
    <Text style={styles.textOrderItem}>{translate("Pressed cancel")}</Text>            
  </View>)
}

const MissedItem = ({}) => {  
  return (<View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>      
    <Text style={styles.textOrderItem}>{translate("Missed")}</Text>            
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

