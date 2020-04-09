import React, {Component} from 'react'
import {
    View, TextInput,
    StyleSheet,
    Text,
    Image,
    FlatList,
    TouchableHighlight,
    KeyboardAvoidingView,
    TouchableOpacity,
    Keyboard,
    SafeAreaView
}
from 'react-native'
import {
    insertNewChat,
    getChatHistory,
    makeSeen,
} from '../server/myServices'
import {
    COLOR_BUTTON, COLOR_ITEM_BACKGROUND, COLOR_CANCEL_SOMETHING, COLOR_ITEM_BORDER
} from '../colors/colors'
import {
    firebaseDatabase,
    getAddressFromLatLong
} from '../server/googleServices'
import { translate } from '../languages/languageConfigurations'
import { getCustomerFromStorage } from '../helpers/Helpers'
import { urlGetAvatar } from '../server/urlNames'
export default class Chat extends Component {
    static navigationOptions = {
        headerShown: false,        
    }
    state = {
        messengers: [],
        flatList: React.createRef()
    }    
    _scrollFlatListToEnd = () => {
        debugger
        const {messengers, flatList} = this.state 
        if(messengers.length > 0 && flatList.current != null) {
            flatList.current.scrollToIndex({index: messengers.length - 1})
        }
    }
    componentDidUpdate() {
        this._scrollFlatListToEnd()        
    }
    async componentDidMount() {        
        const that = this
        firebaseDatabase.ref ('/chats').on ('value', async snapshot => {                  
            let customerId = await getCustomerFromStorage()
            let messengers = await getChatHistory({customerOrSupplierId: customerId})            
            that.setState({messengers})                      
        })                                
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (event) => {                        
            this._scrollFlatListToEnd()     
        })                
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
            playerPrice = 0.0,
            refereePrice = 0.0,
            customerId,
            customerAvatar,
            customerName,
            customerPhoneNumber,
            customerEmail,
            navigate
        } = this.props.navigation.state.params
        const {messengers, flatList} = this.state 
        return <KeyboardAvoidingView style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <SafeAreaView>
                <ChatHeader pressBackButton={() => {
                    this.props.navigation.goBack()
                }}
                    supplierAvatar={messengers.length > 0 ? messengers[0].supplierAvatar : ""}
                    name={messengers.length > 0 ?
                        messengers[0].supplierName : ""}
                />
                <FlatList
                    data={messengers}
                    style={{                                
                        backgroundColor:'white',        
                    }}
                    ref={flatList}
                    onScrollToIndexFailed={(error) => {
                        flatList.current.scrollToOffset({ offset: error.averageItemLength * error.index, animated: true })
                        setTimeout(() => {
                            this._scrollFlatListToEnd()
                        }, 100)
                    }}
                    keyExtractor={(item, index) => {
                        return `${index}`
                    }}
                    extraData={this.state.messengers}
                    renderItem={(item) =>
                        <_ChatItem {...item}
                            isLastItem={item.index == messengers.length - 1}
                        />

                    } />
                <_BottomView
                    scrollFlatListToEnd={this._scrollFlatListToEnd}
                    {...this.props.navigation.state.params} />
            </SafeAreaView>
        </KeyboardAvoidingView>
    }
}
class _ChatItem extends Component {  
    
    state = {
        isSender: false
    }  
    async componentDidMount() {
        const {customerId} = await getCustomerFromStorage()
        this.setState({
            isSender: this.props.item.senderId == customerId
        })
    }
    render() {
        const {
            chatId,             
            sms,                
            senderId,           
            chatCreatedDate,    
            seen,               
            orderId,            
            typeRole,           
            orderLatitude,      
            orderLongitude,     
            orderStatus,        
            createdDate,        
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
            supplierAvatar,     
            playerName,         
            playerPrice,        
            refereeName,        
            refereePrice,       
            customerId,         
            customerAvatar,     
            customerName,       
            customerPhoneNumber,
            customerEmail,  
        } = this.props.item     
        const {isLastItem} = this.props          
        const {isSender} = this.state
        debugger
        const styles = stylesChatItem(isSender)
        return <View>
            <View style={styles.chatItem}>                
                <Image style={styles.profile} source={
                  supplierAvatar.length > 0
                    ? { uri: urlGetAvatar(supplierAvatar) }
                    : require('../images/defaultAvatar.png')
                } />
                <View style={styles.text}>
                    <Text>{sms}</Text>
                </View> 
                {/* {isSender == true ? <Text>{customerName}</Text> :
                    <Text>{typeRole.toLowerCase() == "referee" ? refereeName : playerName}</Text>
                }                                */}
            </View>                        
            {isLastItem == true && seen == true && <Text>{translate("Seen")}</Text>}
        </View>
    }
}
const ChatHeader = ({pressBackButton, supplierAvatar, name}) => {
    return <View style={{
        height: 50,
        width: '100%',
        flexDirection: 'row',
        paddingHorizontal: 10,
        justifyContent: 'flex-start',
        alignItems: 'center',        
        backgroundColor: COLOR_ITEM_BACKGROUND,
        marginBottom:1
      }}>
          <TouchableOpacity            
                onPress={async () => {
                await pressBackButton ();
            }}
          >
            <Image
              source={require ('../images/back.png')}
              style={{width: 25, height: 25, marginLeft: 10}}
            />
          </TouchableOpacity>        
          <Image style={{width: 40, height: 40, 
                borderRadius: 20,
                marginLeft: 10}}
                source={
                  supplierAvatar.length > 0
                    ? { uri: urlGetAvatar(supplierAvatar) }
                    : require('../images/defaultAvatar.png')
                } />
           <View style={{
                            height: 50, 
                            padding: 5,
                            justifyContent: 'center',
                            flexDirection: 'column', 
                            alignItems: 'center'}}>
                <Text>{name}</Text>
           </View> 
    </View>
}
class _BottomView extends Component {
    state = {
        typedText: ''
    }
    pressSend = async () => {        
        const {
            orderId,
            supplierId, 
            customerId
        } = this.props
        const {typedText} = this.state
        if(typedText.trim() == "") {
            Keyboard.dismiss()
            return
        }
        let result = await insertNewChat({
            orderId, 
            sms: typedText, 
            senderId: customerId
        })
        if(result == true) {
            this.setState({typedText : ''})
            Keyboard.dismiss()
        }
        
    }
    render() {
        const {typedText} = this.state        
        const {
            orderId,
            supplierId, 
            customerId,
            scrollFlatListToEnd
        } = this.props
        return <View style={{
                width: '100%',

                flexDirection: 'row',
                justifyContent:'center',
                alignItems: 'center',
                paddingHorizontal: 10,
                height:50,                         
            }}>
            <TextInput placeholder={translate("Enter your sms:")} 
                onChangeText = {(typedText) => this.setState({typedText})}
                onTouchStart={() => {
                    makeSeen({orderId, senderId: customerId})
                    scrollFlatListToEnd()
                }}
                value={typedText}
                style={{
                    width: '80%',                
                    height:50,                         
                    padding: 10,        
                    backgroundColor: 'white',
                    borderWidth: 1,
                    borderColor: COLOR_ITEM_BORDER
                }}/>
            <TouchableHighlight style={{        
                width: '20%',
                height: '100%',
                padding: 10,        
                alignItems: 'center',
                justifyContent: 'center',        
                backgroundColor: COLOR_ITEM_BACKGROUND
            }} onPress = {() => {
                this.pressSend()
            }}>
                <Text>{translate("Send")}</Text>
            </TouchableHighlight>
            
        </View>
    }
}

const stylesChatItem = (isSender) => isSender == false ? StyleSheet.create({
    chatItem: {
        flexDirection: 'row',
        height: 60,
        alignItems: 'center',        
    },
    profile: {
        width: 40,
        height: 40,
        borderColor: 'white',
        borderWidth: 2,
        borderRadius:20,
        marginHorizontal: 10
    },
    text: {
        justifyContent: 'center',
        alignItems:'center',
        height: 40,
        lineHeight: 40,
        backgroundColor: COLOR_ITEM_BACKGROUND,
        borderRadius:20, 
        paddingHorizontal: 15      
    },
    status: {
        color: 'white',        
        fontSize: 12,
        opacity: 0.5,
        marginLeft: 70
    }
}) :
//isSender = false
StyleSheet.create({
    chatItem: {
        flexDirection: 'row-reverse',
        height: 60,        
        alignItems: 'center',            
    },
    profile: {
        width: 40,
        height: 40,
        borderColor: 'white',
        borderWidth: 2,
        borderRadius:20,
        marginHorizontal: 10
    },
    text: {
        justifyContent: 'center',
        alignItems:'center',
        height: 40,
        lineHeight: 40,
        backgroundColor: COLOR_ITEM_BACKGROUND,
        borderRadius:20, 
        paddingHorizontal: 15      
    },
    status: {
        color: 'white',        
        fontSize: 12,
        opacity: 0.5,
        textAlign: 'right',
        marginRight: 70
    }
})
