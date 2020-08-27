import React, {Component} from 'react'
import {
  Text,  
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Dimensions,
  Linking,
  FlatList,
} from 'react-native'
import {translate} from '../languages/languageConfigurations'
import MultiLanguageComponent from './MultiLanguageComponent'
import {getOrdersByCustomerId} from '../server/myServices'
import {
  firebaseDatabase,
  getAddressFromLatLong  
} from '../server/googleServices'
import {
  OrderStatus,
  getColorFromStatus,
  getCustomerFromStorage,  
  convertStringPositionsToPositionName,
  alertWithOKButton,
  print,
  removeNullProperties
} from '../helpers/Helpers'
import {  
  updateOrderStatus, 
} from '../server/myServices'
import { urlGetAvatar } from '../server/urlNames'
const { PENDING, ACCEPTED,CANCELLED, FINISHED, MISSED, COMPLETED } = OrderStatus
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
    super.componentDidMount()
    await this._getOrdersFromServer()
    firebaseDatabase.ref ('/orders').on ('value', async snapshot => {          
      
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
          textContent={translate("Loading")}
          textStyle={{fontWeight: 'bold'}}
        />
      <Text style={styles.textTitle}>{translate("Orders list")}</Text>
        <FlatList
          width={'100%'}
          data={orders}                    
          renderItem={({item}) => (
            <Item {...item} navigate = {navigate}/>
          )}
          keyExtractor={item => `${item.orderId}`}
        />
      </SafeAreaView>
    )
  }
}
class Item extends Component {
  state = {
    order: false,
    orderAddress: ""
  }

  async componentDidMount() {
     const {orderLatitude, orderLongitude} = this.props
     const address = await getAddressFromLatLong(orderLatitude, orderLongitude)     
     debugger
     this.setState({orderAddress: address})
         
  }

  _getDistance = (lat1, lon1, lat2, lon2, unit) => {
    if ((lat1 == lat2) && (lon1 == lon2)) {
      return 0;
    }
    else {
      var radlat1 = Math.PI * lat1/180;
      var radlat2 = Math.PI * lat2/180;
      var theta = lon1-lon2;
      var radtheta = Math.PI * theta/180;
      var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = dist * 180/Math.PI;
      dist = dist * 60 * 1.1515;
      if (unit=="K") { dist = dist * 1.609344 }
      if (unit=="N") { dist = dist * 0.8684 }
      return dist;
    }
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
      navigate
    } = removeNullProperties(this.props)

    const dist = this._getDistance(supplierLatitude, supplierLongitude, orderLatitude, orderLongitude, "K")

    let playerRefereeName = typeRole.toLowerCase() == 'player'?
      `${translate("Player Name:")} ${playerName}` :
      `${translate("Referee Name:")} ${refereeName}`
      const {orderAddress} = this.state      
    return (
      <View style = {{flex: 1}}>
        <View style = {{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={{            
              fontSize: 15,               
              paddingHorizontal: 10,
              paddingVertical: 5,
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
            flexDirection: 'column', 
            paddingVertical:10,
            justifyContent: 'space-around',
            alignItems: 'stretch',
            borderWidth: 1,
            borderColor: COLOR_ITEM_BORDER,
            borderRadius: 15,
            marginBottom: 20,
            marginTop: 5,            
            marginHorizontal: 10,            }}>
          <View style={{
            flexDirection: 'row',
            marginHorizontal: 10,       
          }}>
            <View style={{
              flexDirection: 'column',
              justifyContent: 'center',
            }}>
              <View style={styles.inlineText}>
                <Text
                  numberOfLines={3}
                  style={{
                    fontSize: 17,
                    width: Dimensions.get('window').width * 0.6,
                  }}>{playerRefereeName}</Text>

              </View>
              <View style={styles.inlineText}>
                <Text style={styles.textLabel}>{translate('Price : ')}</Text>
                <Text style={styles.textLabel}>{typeRole.trim().toLowerCase() == 'referee' ?
                  refereePrice : playerPrice}</Text>
              </View>
              <View style={styles.inlineText}>
                <Text style={styles.textLabel}>{translate("Match's timing") + " :"}</Text>
                <Text style={styles.textLabel}>{dateTimeStart.split('T')[0]}</Text>
              </View>
              <View style={styles.inlineText}>
                <Text style={styles.textLabel}>{translate("Stadium") + " :"}</Text>
                <Text
                  numberOfLines={5}
                  style={{ fontSize: 17, width: Dimensions.get('window').width * 0.4,}}
                > {`${orderAddress} ~${Math.round(dist*100)/100}(km)`} </Text>
              </View>
              {orderStatus == ACCEPTED && <View style={[styles.inlineText, { textAlign: 'left' }]}>
                <TouchableOpacity
                  style={{}}
                  onPress={() => {
                    Linking.openURL(`tel:${customerPhoneNumber}`)
                  }}>
                </TouchableOpacity>
                <Text
                  numberOfLines={2}
                  style={styles.textLabel}>
                  {translate('Phone : ')} {supplierPhoneNumber.replace(/(\d{3})(\d{3})(\d{1,})/, '$1-$2-$3')}
                </Text>
              </View>}
              {orderStatus == ACCEPTED && <AcceptedItem
                pressReject={async () => {
                  alertWithOKButton(
                    translate("Are you sure you want to cancel this order ?"),
                    async () => {
                      await updateOrderStatus(orderId, CANCELLED, 'customer')
                    })
                }}
              />}
              {orderStatus == PENDING && <PendingItem
                pressReject={async () => {
                  alertWithOKButton(
                    translate("Are you sure you want to cancel this order ?"),
                    async () => {
                      await updateOrderStatus(orderId, CANCELLED, 'customer')
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
              {orderStatus == ACCEPTED && <TouchableOpacity
                style={styles.btnOrder}
                onPress={() => {
                  //alert(JSON.stringify(Object.keys(this.props)))
                  navigate("Chat", { ...this.props })
                }}>
                <Text style={styles.textOrder}>
                  {translate("Chat")}
                </Text>
              </TouchableOpacity>}
            </View>
          </View> 
        {orderStatus == FINISHED && <TouchableOpacity 
            style={{             
              flex: 1, 
              borderRadius: 25,              
              marginHorizontal: 20,
              marginTop: 5,              
              justifyContent:'center',
              alignItems: 'center',
              backgroundColor: '#3498DB'
            }}
            onPress={async () => {            
              await updateOrderStatus(orderId, COMPLETED, 'customer')
            }}>
            <Text style={{                                 
              width: '100%',
              
              textAlign: 'center'       ,                            
              fontSize: 17,
              padding: 12,              
              color: 'white',
              
            }}>{translate("Complete this order")}</Text>
          </TouchableOpacity>}      
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
      color: 'white',
      backgroundColor: 'rgb(235,96,107)'
    }}>{translate("Cancel order")}</Text>
  </TouchableOpacity>
}
const PendingItem = ({pressReject}) => {  
  return <TouchableOpacity onPress={pressReject}>
    <Text  style={{
      fontSize: 17,
      padding: 5,
      color: 'white',
      backgroundColor: 'rgb(235,96,107)'
    }}>{translate("Cancel order")}</Text>
  </TouchableOpacity>
}

const styles = StyleSheet.create ({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
    flex: 1,
  },  
  inlineText: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
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
