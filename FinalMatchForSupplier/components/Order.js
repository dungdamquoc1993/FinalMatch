import React, { Component } from 'react'
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  FlatList,
  Dimensions,
} from 'react-native'
import Header from './Header'
import Modal from "react-native-modal"
import { getSupplierFromStorage, getColorFromStatus } from '../helpers/Helpers'
import { firebaseDatabase } from '../server/googleServices'
import { getOrdersBySupplierId, updateOrderStatus } from '../server/myServices'

export default class Order extends Component {
  constructor(props) {
    super(props)
    
    this.state = {
      supplierId: '',
      orders: []
    }
  }
  _checkSupplierIdInFirebase = (snapshotValue) => {
    //Ex: input: supplierId = 31,snapShotValue =  {"abcx:31": value..., "ttt:32": value...} , output : true    
    for (const key in snapshotValue) {      
      const [customerId, supplierId] = key.split(":")      
      // console.log("xx"+getSupplierFromStorage().supplierId)
      if (supplierId == this.state.supplierId) {
        firebaseDatabase.ref('/orders').remove(key)
        return true
      }
    }
    return false
  }
  _readDataFromFirebase = () => {    
    firebaseDatabase.ref('/orders').on('value', async (snapshot) => {
      let snapshotValue = snapshot.val()
      if (this._checkSupplierIdInFirebase(snapshotValue) == true) {
        debugger
        //Goi api load orders
        let orders = await getOrdersBySupplierId()
        this.setState({ orders })
      }
    })
  }
  
  async componentDidMount() {
    const {tokenKey, supplierId, email} = await getSupplierFromStorage()
    debugger
    this.setState({supplierId})
    this._readDataFromFirebase() 
  }
  render() {
    const {orders} = this.state
    // fake
    let fakeOrders = 
    [{
      "id": 1,
      "typeRole": "referee",
      "customerId": "47c9165c5bfb03689260a8f230e45589",
      "supplierId": 80,
      "point": {
          "x": 20.99283218383789,
          "y": 105.80587005615234
      },
      "status": "missed",
      "createdDate": "2020-02-18T10:17:54.000Z",
      "dateTimeStart": "2020-02-18T09:48:00.000Z",
      "dateTimeEnd": "2020-02-18T11:48:00.000Z"
  }, 
  {
    "id": 1,
    "typeRole": "referee",
    "customerId": "47c9165c5bfb03689260a8f230e45589",
    "supplierId": 80,
    "point": {
        "x": 20.99283218383789,
        "y": 105.80587005615234
    },
    "status": "missed",
    "createdDate": "2020-02-18T10:17:54.000Z",
    "dateTimeStart": "2020-02-18T09:48:00.000Z",
    "dateTimeEnd": "2020-02-18T11:48:00.000Z"
}, {
  "id": 1,
  "typeRole": "referee",
  "customerId": "47c9165c5bfb03689260a8f230e45589",
  "supplierId": 80,
  "point": {
      "x": 20.99283218383789,
      "y": 105.80587005615234
  },
  "status": "missed",
  "createdDate": "2020-02-18T10:17:54.000Z",
  "dateTimeStart": "2020-02-18T09:48:00.000Z",
  "dateTimeEnd": "2020-02-18T11:48:00.000Z"
}]

    return (
      <SafeAreaView style={styles.container}>
        <FlatList
        data={fakeOrders}
        // data={orders}        
        renderItem={({item}) => <Item {...item} />}
        keyExtractor={item => item.id}
      />
      </SafeAreaView>
    )
  }
}

class Item extends Component {  
  state = {
    status: ''
  }
  render() {
    const {
      id, //order's id
      typeRole, 
      customerId, 
      supplierId, 
      point, 
      status, 
      createdDate, 
      dateTimeStart, 
      dateTimeEnd
    } = this.props    
    let latitude = point.x
    let longitude = point.y
    return <View>
      <Text>customerId:{customerId}</Text>
      <Text>supplierId:{supplierId}</Text>
      <Text>latitude:{latitude}</Text>
      <Text>longitude:{longitude}</Text>
      <Text style={{
        backgroundColor: getColorFromStatus(this.state.status.length > 0 ? this.state.status : status)}
      }>status:{status}</Text>
      <TouchableOpacity onPress = {async () => {
        let updatedOrder = await updateOrderStatus(id, "accepted")
        this.setState({status: updatedOrder.status})
      }}>
        <Text style={{backgroundColor:'green', height: 50}}>Accept</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={async () => {
        let updatedOrder = await updateOrderStatus(id, "cancelled")        
        this.setState({status: updatedOrder.status})
      }}>
        <Text style={{backgroundColor:'red', height: 50}}>Reject</Text>
      </TouchableOpacity>
    </View>
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
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