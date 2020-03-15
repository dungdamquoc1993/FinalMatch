import React, {Component} from 'react'
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  FlatList,
} from 'react-native'
import Header from './Header'
import { NavigationEvents } from 'react-navigation'
const {width, height} = Dimensions.get ('window')
const {supplierId, tokenKey, email} = await getSupplierFromStorage() 
import {
  getNotificationsByCustomerId,
  getNotificationsBySupplierId,
} from '../server/myServices'


export default class Notifications extends Component {
  state = {
    notifications: []
  }
  reloadDataFromServer = async () => {    
    //call api
    let notifications = await getNotificationsBySupplierId(supplierId)    
    this.setState({notifications})    
  }
  async componentDidMount() {
    // this.reloadDataFromServer()    
  }
  render () {    
    const {notifications} = this.state
    return (
      <SafeAreaView style={styles.container}>
        <NavigationEvents
          onWillFocus={payload => {
            this.reloadDataFromServer()
          }}
        />
        <View style={{marginLeft: 0.3 * width}}>
          <Header title={'Thông Báo'} hideBack={true} />
        </View>
        <FlatList
        data={notifications}
        renderItem={({ item }) => <Item {...this.props} />}
        keyExtractor={item => item.id}
      />
      </SafeAreaView>
    )
  }
}
const Item = (props) => {
  const { title,
    body,
    supplierId,
    customerId,
    orderId,
    createdDate,
  } = props
  return (
    <View style={styles.item}>
      <TouchableOpacity>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.title}>{body}</Text>
      </TouchableOpacity>

    </View>
  )
}
const styles = StyleSheet.create ({
  container: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flex: 1,
  },item: {
    backgroundColor: '#f0f8ff',
    padding: 10,
    marginVertical: 8,
  },
  title: {
    fontSize: 20,
  },
})
