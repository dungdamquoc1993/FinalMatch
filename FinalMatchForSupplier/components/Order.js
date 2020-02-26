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
const { PENDING, ACCEPTED,CANCELLED, COMPLETED, MISSED } = OrderStatus

import {
  firebaseDatabase,
  getAddressFromLatLong
} from '../server/googleServices'
import {
  getOrdersBySupplierId, 
  updateOrderStatus, 
} from '../server/myServices'

export default class Order extends Component {
  constructor (props) {
    super (props)

    this.state = {
      supplierId: '',
      orders: [],
    }
  }
  _checkSupplierIdInFirebase = snapshotValue => {
    //Ex: input: supplierId = 31,snapShotValue =  {"abcx:31": value..., "ttt:32": value...} , output : true
    for (const key in snapshotValue) {
      debugger      
      const [customerId, supplierId] = key.split (':')
      // console.log("xx"+getSupplierFromStorage().supplierId)
      if (supplierId == this.state.supplierId) {        
        debugger
        return true
      }
    }
    debugger
    return false
  }
  _readDataFromFirebase = () => {
    firebaseDatabase.ref ('/orders').on ('value', async snapshot => {
      debugger
      let snapshotValue = snapshot.val ()
      if (this._checkSupplierIdInFirebase (snapshotValue) == true) {
        debugger
        //Goi api load orders
        let orders = await getOrdersBySupplierId ()
        this.setState ({orders})
      }
    })
  }

  async componentDidMount () {
    const {tokenKey, supplierId, email} = await getSupplierFromStorage ()
    let orders = await getOrdersBySupplierId ()
    this.setState ({orders, supplierId})    
    this._readDataFromFirebase ()
  }
  render () {
    const {orders} = this.state    
    return (
      <SafeAreaView style={styles.container}>
      <Header
          title={'Order'}
          pressBackButton={async () => {
            //validate ok
            return true
          }}
        />
        <FlatList
          width={'100%'}
          data={orders}
          // data={orders}          
          renderItem={({item}) => <Item {...item}/>}
          keyExtractor={item => item.id}
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
    } = this.props
    const {orderAddress} = this.state
    return (
      <View style={styles.viewOrder}>
        {/* <Text style={styles.textInformationOrder}>OOOO:{orderId}</Text> */}
        <Text style={styles.textInformationOrder}>Name:{customerName}</Text>
        <Text style={styles.textInformationOrder}>Địa điểm thi đấu:</Text>
        <Text style={styles.textInformationOrder}>{orderAddress}</Text>
        <Text style={styles.textInformationOrder}>Match timing:</Text>
        <Text style={styles.textInformationOrder}>{dateTimeStart}</Text>
        <Text style={styles.textInformationOrder}>Trạng thái đơn hàng:</Text>
        <Text
          style={{
            color: getColorFromStatus (
              orderStatus
            ),
            fontSize: 17,
          }}
        >
          {orderStatus}
        </Text>                
        {orderStatus == PENDING && <PendingItem pressConfirm={() => {          
          updateOrderStatus(orderId, ACCEPTED)
        }}
        pressCancel={async () => {
          updateOrderStatus(orderId, CANCELLED)
        }}
        />}
        {orderStatus == ACCEPTED && <AcceptedItem customerPhoneNumber={customerPhoneNumber}/> }
        
        {orderStatus == COMPLETED && <CompletedItem pressRate={()=>{}} />}
        {orderStatus == CANCELLED && <CancelledItem />}
        {orderStatus == MISSED && <MissedItem />}
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
        backgroundColor: '#A2C8C6',
        alignItems: 'center',
        justifyContent: 'space-around',
        borderRadius: 8,
      }}
      onPress={pressConfirm}
    >
      <Text style={{ height: 50, lineHeight: 50, fontSize: 17 }}>Accept</Text>
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
        backgroundColor: '#A2C8C6',
        alignItems: 'center',
        justifyContent: 'space-around',
        borderRadius: 8,
      }}
      onPress={pressCancel}      
    >
      <Text style={{ height: 50, lineHeight: 50, fontSize: 17 }}>Reject</Text>
      <Image
        source={require('../images/quit.png')}
        style={{ height: 30, width: 30 }}
      />
    </TouchableOpacity>
  </View>)
}

const AcceptedItem = ({pressChat, pressCall, customerPhoneNumber}) => {  
  return (<View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>      
    <TouchableOpacity onPress={pressCall}>
    <Text style={styles.textInformationOrder}>phone:{customerPhoneNumber}</Text>        
    </TouchableOpacity>
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        width: 100,
        height: 50,
        backgroundColor: '#A2C8C6',
        alignItems: 'center',
        justifyContent: 'space-around',
        borderRadius: 8,
      }}
      onPress={pressChat}
    >
      <Text style={{ height: 50, lineHeight: 50, fontSize: 17 }}>Chat</Text>
      
    </TouchableOpacity>        
  </View>)
}

const CompletedItem = ({pressRate}) => {  
  return (<View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>      
    <TouchableOpacity onPress={pressRate}>      
      <Text style={styles.textInformationOrder}>Danh gia 5 sao</Text>        
    </TouchableOpacity>    
  </View>)
}
const CancelledItem = ({}) => {  
  return (<View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>      
    <Text style={styles.textInformationOrder}>Da an cancelled</Text>            
  </View>)
}

const MissedItem = ({}) => {  
  return (<View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>      
    <Text style={styles.textInformationOrder}>Da missed</Text>            
  </View>)
}

const styles = StyleSheet.create ({
  container: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    flex: 1,
  },
  viewOrder: {
    height: 300,
    lineHeight: 100,
    backgroundColor: '#f5f5f5',
    borderRadius: 25,
    borderColor: '#a9a9a9',
    borderWidth: 1,
    marginVertical: 10,
    width: '80%',
    marginHorizontal: '10%',
    padding: 30,
    justifyContent: 'space-between',
  },
  textInformationOrder: {
    fontSize: 17,
  },
})

/*
{
  "id": 1,
  "typeRole": "referee",
  "customerId": "47c9165c5bfb03689260a8f230e45589",
  "supplierId": 31,
  "point": {
      "x": 20.99283218383789,
      "y": 105.80587005615234
  },
  "status": "missed",
  "createdDate": "2020-02-18T10:17:54.000Z",
  "dateTimeStart": "2020-02-18T09:48:00.000Z",
  "dateTimeEnd": "2020-02-18T11:48:00.000Z"
}
*/
