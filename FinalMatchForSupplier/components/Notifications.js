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
  getNotificationsBySupplierId,
} from '../server/myServices'
import {translate} from '../languages/languageConfigurations'
import {
  COLOR_ITEM_BACKGROUND,
  COLOR_ITEM_BORDER
} from '../colors/colors'

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
        <View 
          style={{          
            height: 60,
            width: '100%'
          }}          
        >
          <Header
            title={translate("Notifications")}
            hideBack = {true}
            hideNext = {true}            
        />

        </View>
        
        <FlatList      
          width={'100%'}
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
      <View style={
        {          
          paddingHorizontal: 20,
        }
      }>
        <View style={{
          marginVertical: 10,
          backgroundColor: COLOR_ITEM_BACKGROUND,
          borderRadius: 10,
          borderColor: COLOR_ITEM_BORDER,
          borderWidth: 1,
        }}>
          <Text style={{
            paddingHorizontal: 10,
            paddingTop: 5,
            fontSize: 16,
            fontWeight: 'bold'
          }}>{title}</Text>
          <Text style={{
            paddingHorizontal: 10,
            paddingBottom: 5,
            fontSize: 16,
          }}>{body}</Text>
        </View>
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
})
