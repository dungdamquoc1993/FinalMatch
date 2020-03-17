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
import {getSupplierFromStorage, 
  saveSupplierToStorage, 
  alertWithOKButton, 
  getPosition, 
  alert,
  isIOS
} from '../helpers/Helpers'
const {width, height} = Dimensions.get ('window')
import {
  getNotificationsByCustomerId,
  getNotificationsBySupplierId,
} from '../server/myServices'


export default class Notifications extends Component {
  state = {
    notifications: []
  }
  reloadDataFromServer = async () => {    
    const {supplierId, tokenKey, email} = await getSupplierFromStorage() 
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
        <Header title={'Thông Báo'} hideBack={true} />
        <FlatList          
          data={notifications}
          renderItem={({ item }) => <Item {...item} />}
          keyExtractor={item => `${item.id}`}
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
    <TouchableOpacity>
      <View style={styles.item}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.title}>{body}</Text>
      </View>
    </TouchableOpacity>
  )
}
const styles = StyleSheet.create ({
  container: {    
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',    
    flex: 1,
  },
  item: {
    backgroundColor: '#f0f8ff',    
    flex: 1
  },
  title: {
    fontSize: 16,
    width: '100%'
  },
})
