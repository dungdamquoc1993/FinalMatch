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
  Linking
} from 'react-native'
import Header from './Header'
import { NavigationEvents } from 'react-navigation'
import {
  getSupplierFromStorage, 
  getColorFromStatus,
  OrderStatus,
  isIOS,  
  convertStringPositionsToPositionName,
  print
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
  COLOR_ORDER_STATUS_CANCELLED,
  COLOR_ORDER_STATUS_EXPIRED
} from '../colors/colors'
import Icon from 'react-native-vector-icons/FontAwesome'

const { PENDING, ACCEPTED,CANCELLED, COMPLETED, MISSED, EXPIRED } = OrderStatus
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
          <NavigationEvents
            onWillFocus={payload => {
              this._reloadOrders()
            }}
          />
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
    const address = await getAddressFromLatLong(orderLatitude, orderLongitude)    
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
      playerName,
      playerPrice = 0.0,
      playerPosition = "",
      refereeName,
      refereePrice = 0.0,
      customerId,
      customerAvatar,
      customerName,
      customerPhoneNumber,
      customerEmail,
      navigate,
      _reloadOrders
    } = this.props
    debugger
    //let strDatetimeStart = (new Date(dateTimeStart)).toLocaleString(i18n.locale == 'en' ? "en-US" : "vi-VN")    
    let strDatetimeStart = (new Date(dateTimeStart)).toLocaleString("vi-VN")    
    //let orderStatus = this._fakeDataToTestUI()
    const {orderAddress} = this.state     
    debugger        
    return (
      <View style = {{flex: 1}}>
        <View style = {{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={{            
              fontSize: 15,               
              paddingHorizontal: 10,
              paddingVertical: 5,              
              borderRadius: 10,
              fontWeight: 'bold', 
              marginHorizontal: 15,
              textAlign: 'left'}}>
                {typeRole.toLowerCase() == 'player'?
                  `${translate("Player:")} ${convertStringPositionsToPositionName(playerPosition)}` 
                  : translate("Referee")}
            </Text>
            <Text style={{            
              fontSize: 15, 
              color: 'white',            
              backgroundColor: getColorFromStatus(orderStatus),             
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: 10,
              fontWeight: 'bold', 
              marginHorizontal: 15,
              textAlign: 'right'}}>
                {translate(orderStatus)}
            </Text>
          </View>      
      <View style={{ 
        justifyContent: "center", alignItems: "center" }}>
        <View style={{          
          backgroundColor: '#f5f5f5',
          borderRadius: 15,
          borderColor: COLOR_ITEM_BORDER,
          borderWidth: 1,
          marginBottom: 20,
          marginTop: 5,          
          padding: 10,
          width: Math.round(Dimensions.get('window').width) - 30,          
          justifyContent: 'space-between',    
        }}>                    
          <Text style={styles.textOrderItem}>
            {translate("Customer Name : ")}{customerName}
          </Text>
          <Text style={styles.textOrderItem}>
            {`${translate("Match's place")}: ${orderAddress}`}
          </Text>          
          <Text style={styles.textOrderItem}>
            {translate("Match's timing")}: {strDatetimeStart}
          </Text>          
          {orderStatus == PENDING && <PendingItem pressConfirm={async () => {
          
          let result = await updateOrderStatus(orderId, ACCEPTED, 'supplier')            
            if (result == true) {
              _reloadOrders()
            }
          }}
            pressCancel={async () => {
              let result = await updateOrderStatus(orderId, CANCELLED, 'supplier')
              if (result == true) {
                _reloadOrders()
              }
            }}
          />}
          {orderStatus == ACCEPTED && <AcceptedItem
            pressChat={() => {              
              navigate("Chat", { ...this.props })
            }}
            pressCall={() => {              
              Linking.openURL(`tel:${customerPhoneNumber}`)
            }}
            pressReject={async () => {
              let result = await updateOrderStatus(orderId, CANCELLED,'supplier')
              if (result == true) {
                _reloadOrders()
              }
            }}
            customerPhoneNumber={customerPhoneNumber} />}
          {orderStatus == COMPLETED && <CompletedItem pressRate={() => { }} />}                    
        </View>
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
    <TouchableOpacity onPress={pressCall} style={{        
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent:'flex-end'}}>
      <Icon.Button         
        iconStyle={{marginStart: -5}}
        size = {17}                
        name="phone" 
        borderRadius={30}         
        backgroundColor={"transparent"} 
        color = {'black'}/>
      <Text  style={{fontSize: 15, marginStart: -12}}>
        {customerPhoneNumber.replace(/(\d{3})(\d{3})(\d{1,})/,'$1-$2-$3')}
      </Text>        
    </TouchableOpacity>    
    <View style={{
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent:'flex-end'}}>    
    <TouchableOpacity
      style={{                     
        flexDirection: 'row',
        width: i18n.locale == 'en' ? 100 : 130,
        height: 40,
        backgroundColor: COLOR_ORDER_STATUS_ACCEPTED,
        alignItems: 'center',
        justifyContent: 'space-around',
        borderRadius: 8,
        paddingRight: 10,
      }}
      onPress={pressChat}>
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
    </View>
    <View style={{
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent:'center'}}>    
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
      </View>
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

