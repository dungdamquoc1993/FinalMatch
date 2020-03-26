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
export default class Chat extends Component {
    constructor(props) {
        super(props)        
    }
    state = {
        messengers: [],
        flatList: React.createRef()
    }    
    componentDidUpdate() {
        this.state.flatList.current.scrollToIndex({index: this.state.messengers.length - 1})
    }
    async componentDidMount() {
        const that = this
        firebaseDatabase.ref ('/chats').on ('value', async snapshot => {      
            let messengers = await getChatHistory()
            that.setState({messengers})                      
        })                
    }
    
    render() {       
        const {messengers} = this.state 
        return <View style={styles.container}>
            <FlatList
                data={this.state.messengers} 
                style={styles.flatList}
                ref={this.state.flatList}
                onScrollToIndexFailed={(error) => {
                    this.state.flatList.current.scrollToOffset({ offset: error.averageItemLength * error.index, animated: true })
                    setTimeout(() => {
                        if (this.state.messengers.length !== 0 && this.state.flatList.current !== null) {
                            this.state.flatList.current.scrollToIndex({ index: error.index, animated: true })
                        }
                    }, 100)
                }}
                keyExtractor={(item, index) => {
                    return `${index}`
                }}
                extraData={this.state.messengers}
                renderItem={(item) => 
                     <_ChatItem {...item}                      
                                {...this.props}
                                isLastItem = {item.index == messengers.length - 1}
                                />
                } />
            <_BottomView {...this.props} />
        </View>
    }
}
class _ChatItem extends Component {    
    
    render() {
        const {
            chatId,
            orderId,
            customerId,
            supplierAvatar,
            supplierId,
            supplierName,
            sms,
            senderId,
            createdDate,
            seen,
            typeRole,
            orderLatitude,
            orderLongitude,
            orderStatus,
            dateTimeStart,
            dateTimeEnd,
        } = this.props                
        const {isSender} = senderId == supplierId
        const styles = stylesChatItem(isSender)
        return <View>
            <View style={styles.chatItem}>
                <Image style={styles.profile} source={{ uri: supplierAvatar }} />
                <View style={styles.text}>
                    <Text>{sms}</Text>
                </View>                
            </View>
            <Text style={styles.status}>{status}</Text>
            {isLastItem == true && seen == true && <Text>{translate("Seen")}</Text>}
        </View>
    }
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
        insertNewChat({
            orderId, 
            sms: typedText, 
            senderId: supplierId
        })
    }
    render() {
        const {typedText} = this.state        
        return <View style={stylesBottomView.container}>
            <TextInput placeholder={translate("Enter your sms:")} 
                onChangeText = {(typedText) => this.setState({typedText})}
                onTouchStart={() => {
                    makeSeen({orderId, senderId: supplierId})
                }}
                value={typedText}
                style={stylesBottomView.textInput}/>
            <TouchableHighlight style={stylesBottomView.btnSend} onPress = {() => {
                pressSend()
            }}>
                <Text>Send</Text>
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
const stylesChatItem = (isSender) => isSender == true ? StyleSheet.create({
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