import React, {Component} from 'react'
import {
    View, TextInput,
    StyleSheet,
    Text,
    Image,
    FlatList,
    TouchableHighlight
}
    from 'react-native'
import {
    insertNewChat,
    getChatHistory,
    makeSeen,
} from '../server/myServices'
import {
    firebaseDatabase,
    getAddressFromLatLong
} from '../server/googleServices'
import { translate } from '../languages/languageConfigurations'
import { getSupplierFromStorage } from '../helpers/Helpers'
import { urlGetAvatar } from '../server/urlNames'
export default class Chat extends Component {
    
    state = {
        messengers: [],
        flatList: React.createRef()
    }    
    componentDidUpdate() {
        const {messengers, flatList} = this.state 
        if(messengers.length > 0) {
            flatList.current.scrollToIndex({index: messengers.length - 1})
        }
        
    }
    async componentDidMount() {        
        const that = this
        firebaseDatabase.ref ('/chats').on ('value', async snapshot => {      
            let supplierId = await getSupplierFromStorage()
            let messengers = await getChatHistory({customerOrSupplierId: supplierId})            
            that.setState({messengers})                      
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
        return <View style={styles.container}>
            <FlatList
                data={messengers} 
                style={styles.flatList}
                ref={flatList}
                onScrollToIndexFailed={(error) => {
                    flatList.current.scrollToOffset({ offset: error.averageItemLength * error.index, animated: true })
                    setTimeout(() => {
                        if (messengers.length > 0 && this.state.flatList.current !== null) {
                            flatList.current.scrollToIndex({ index: error.index, animated: true })
                        }
                    }, 100)
                }}
                keyExtractor={(item, index) => {
                    return `${index}`
                }}
                extraData={this.state.messengers}
                renderItem={(item) => 
                    <_ChatItem {...item}                                                      
                        isLastItem = {item.index == messengers.length - 1}
                    />
                    
                } />
            <_BottomView {...this.props.navigation.state.params} />
        </View>
    }
}
class _ChatItem extends Component {    
    state ={
        isSender: false
    }
    async componentDidMount() {
        const {customerId} = await getCustomerFromStorage()
        return this.props.item.senderId == customerId;
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
                {isSender == false ? <Text>{customerName}</Text> :
                    <Text>{typeRole.toLowerCase() == "referee" ? refereeName : playerName}</Text>
                }                               
            </View>                        
            {isLastItem == true && seen == true && <Text>{translate("Seen")}</Text>}
        </View>
    }
}
class _BottomView extends Component {
    state = {
        typedText: ''
    }
    pressSend = async () => {
        debugger
        const {
            orderId,
            supplierId, 
            customerId
        } = this.props
        const {typedText} = this.state
        insertNewChat({
            orderId, 
            sms: typedText, 
            senderId: supplierId
        })
    }
    render() {
        const {typedText} = this.state        
        const {
            orderId,
            supplierId, 
            customerId
        } = this.props
        return <View style={stylesBottomView.container}>
            <TextInput placeholder={translate("Enter your sms:")} 
                onChangeText = {(typedText) => this.setState({typedText})}
                onTouchStart={() => {
                    makeSeen({orderId, senderId: supplierId})
                }}
                value={typedText}
                style={stylesBottomView.textInput}/>
            <TouchableHighlight style={stylesBottomView.btnSend} onPress = {() => {
                this.pressSend()
            }}>
                <Text>{translate("Send")}</Text>
            </TouchableHighlight>
            
        </View>
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,        
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgb(41,42,47)',
    },
    flatList: {
        flex: 1,
        width: '100%'
    },    
})
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
        backgroundColor: 'rgb(146,224, 149)',
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
        backgroundColor: 'pink',
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
const stylesBottomView = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent:'center',
        alignItems: 'center',
        height:50,         
        width: '95%',
        
    },
    textInput: {
        width: '80%',                
        padding: 10,
        backgroundColor: '#3cb371' 
    },
    btnSend: {        
        width: '20%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffa500'
        
    }
})