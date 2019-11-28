import React, { Component } from 'react';
import { 
    Text,
    View, 
    ScrollView,
    StyleSheet, 
    DatePickerAndroid,
    TextInput,
    SafeAreaView,
    TouchableOpacity } from 'react-native';
import Header from './Header'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'

export default class PlayerService extends Component {
    static navigationOptions = {
        header: null
    }    
    constructor(props) {
        super(props)
        this.state = {
            name: '',         
            phoneNumber: '',    
            isGK: false,
            isCB: false,
            isMF: false,
            isCF: false,
    
        }
    }
    
    render() {
        const {name, phoneNumber} = this.state
        const {isGK, isCB, isMF, isCF} = this.state
        return (
            <View style ={styles.container}>
                <Header title={"PlayerService"}/> 
                <Text style={{fontSize: 50}}>PlayerService</Text>
                <View style={styles.personalInformation}>
                    <Text style={styles.textLabel}>
                        Tên:
                        </Text>
                    <TextInput style={styles.textInput}
                        placeholder={"Please enter name"}
                        value={name}
                        onChangeText={(name) => {
                            this.setState({ name })
                        }}
                    >

                    </TextInput>
                </View>
                <View style={styles.personalInformation}>
                    <Text style={styles.textLabel}>
                        SDT:
                        </Text>
                    <TextInput style={styles.textInput}
                        placeholder={"Please enter phone"}
                        keyboardType={"phone-pad"}
                        value={phoneNumber}
                        onChangeText={(phoneNumber) => {
                            this.setState({ phoneNumber })
                        }}>

                    </TextInput>
                </View>
                <Text>Position:</Text>
                <View style={styles.positions}>
                    <TouchableOpacity style={styles.eachPosition} 
                        onPress = {() => {
                            this.setState({isGK: !this.state.isGK})
                        }}>
                        <Text>GK</Text>
                        <FontAwesome5 name={isGK == true ? "check-square": "square"} 
                            size={20} color={"black"} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.eachPosition}
                        onPress = {() => {
                            this.setState({isCB: !this.state.isCB})
                        }}>
                        <Text>CB</Text>
                        <FontAwesome5 name={isCB == true ? "check-square": "square"}  size={20} color={"black"} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.eachPosition}
                        onPress = {() => {
                            this.setState({isMF: !this.state.isMF})
                        }}>
                        <Text>MF</Text>
                        <FontAwesome5 name={isMF == true ? "check-square": "square"}  size={20} color={"black"} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.eachPosition} 
                        onPress = {() => {
                            this.setState({isCF: !this.state.isCF})
                        }}>
                        <Text>CF</Text>
                        <FontAwesome5 name={isCF == true ? "check-square": "square"}  size={20} color={"black"} />
                    </TouchableOpacity>
                    
                </View>            
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flex: 1,
    },
    personalInformation: {
        flexDirection: 'row', 
        height: 60,
        width: '100%',
        justifyContent: 'center', 
        alignItems: 'center'
    },
    textLabel: {
        width: '20%',
        height: 40,        
        lineHeight: 40,
        paddingStart: 30,        
    },
    textInput: {
        width: '80%',
        height: 40,
        borderRadius: 5,
        borderColor: 'black',
        marginEnd: 30,
        borderWidth: 1,
        paddingHorizontal: 10,
        color: 'black',        
    },
    positions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        height: 50,
        width: '100%',
    }, 
    eachPosition: {
        flexDirection: 'column',     
        width: 90,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center'
    }
})