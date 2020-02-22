import React, {Component} from 'react';
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
} from 'react-native';
import Header from './Header';
import Modal from 'react-native-modal';
import {getSupplierFromStorage, getColorFromStatus} from '../helpers/Helpers';
import {firebaseDatabase} from '../server/googleServices';
import {getOrdersBySupplierId, updateOrderStatus} from '../server/myServices';

export default class Order extends Component {
  constructor (props) {
    super (props);

    this.state = {
      supplierId: '',
      orders: [],
    };
  }
  _checkSupplierIdInFirebase = snapshotValue => {
    //Ex: input: supplierId = 31,snapShotValue =  {"abcx:31": value..., "ttt:32": value...} , output : true
    for (const key in snapshotValue) {
      const [customerId, supplierId] = key.split (':');
      // console.log("xx"+getSupplierFromStorage().supplierId)
      if (supplierId == this.state.supplierId) {
        firebaseDatabase.ref ('/orders').remove (key);
        return true;
      }
    }
    return false;
  };
  _readDataFromFirebase = () => {
    firebaseDatabase.ref ('/orders').on ('value', async snapshot => {
      let snapshotValue = snapshot.val ();
      if (this._checkSupplierIdInFirebase (snapshotValue) == true) {
        debugger;
        //Goi api load orders
        let orders = await getOrdersBySupplierId ();
        this.setState ({orders});
      }
    });
  };

  async componentDidMount () {
    const {tokenKey, supplierId, email} = await getSupplierFromStorage ();
    debugger;
    this.setState ({supplierId});
    this._readDataFromFirebase ();
  }
  render () {
    const {orders} = this.state;
    // fake
    let fakeOrders = [
      { 
        id:'1234',
        Name: 'kien',
        stadium: 'sân lam sơn',
        timeStart: '12h',
        status: 'đang chờ',
        phone:'015457887'
      },
      {
        id:'1234',
        Name: 'kien',
        stadium: 'sân lam sơn',
        timeStart: '12h',
        status: 'đang chờ',
        phone:'015457887'
      },
      {
        id:'1234',
        Name: 'kien',
        stadium: 'sân lam sơn',
        timeStart: '12h',
        status: 'đang chờ',
        phone:'015457887'
      },
    ];

    return (
      <SafeAreaView style={styles.container}>
      <Header
          title={'Order'}
          pressBackButton={async () => {
            //validate ok
            return true;
          }}
        />
        <FlatList
          width={'100%'}
          data={fakeOrders}
          // data={orders}
          renderItem={({item}) => <Item {...item} />}
          keyExtractor={item => item.id}
        />
      </SafeAreaView>
    );
  }
}

class Item extends Component {
  state = {
    status: '',
  };
  render () {
    const {
      id, //order's id
      typeRole,
      customerId,
      supplierId,
      point,
      createdDate,
      dateTimeStart,
      dateTimeEnd,
      stadium,
      timeStart,
      status,
      phone,
      Name
    } = this.props;
    // let latitude = point.x;
    // let longitude = point.y;
    return (
      <View style={styles.viewOrder}>
        <Text style={styles.textInformationOrder}>Name:{Name}</Text>
        <Text style={styles.textInformationOrder}>stadium:{stadium}</Text>
        <Text style={styles.textInformationOrder}>phone:{phone}</Text>
        <Text
          style={{
            color: getColorFromStatus (
              this.state.status.length > 0 ? this.state.status : status
            ),
            fontSize: 17,
          }}
        >
          status:{status}
        </Text>

        <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              width: 100,
              height: 50,
              backgroundColor: '#A2C8C6',
              alignItems: 'center',
              justifyContent: 'space-around',
              borderRadius:8,
            }}
            onPress={async () => {
              let updatedOrder = await updateOrderStatus (id, 'accepted');
              this.setState ({status: updatedOrder.status});
            }}
          >
            <Text style={{height: 50, lineHeight: 50,fontSize: 17}}>Accept</Text>
            <Image
              source={require ('../images/tick.png')}
              style={{height: 30, width: 30}}
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
              borderRadius:8,
            }}
            onPress={async () => {
              let updatedOrder = await updateOrderStatus (id, 'cancelled');
              this.setState ({status: updatedOrder.status});
            }}
          >
            <Text style={{height: 50, lineHeight: 50,fontSize: 17}}>Reject</Text>
            <Image
              source={require ('../images/quit.png')}
              style={{height: 30, width: 30}}
            />
          </TouchableOpacity>
        </View>

      </View>
    );
  }
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
});

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
