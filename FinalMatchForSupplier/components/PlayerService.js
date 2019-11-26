import React, { Component } from 'react';
import { 
    Text,
    View, 
    ScrollView,
    StyleSheet, 
    DatePickerAndroid,
    TextInput,
    SafeAreaView,
    PermissionsAndroid,
    ToastAndroid,
    Platform,
    TouchableOpacity } from 'react-native';
import Header from './Header'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import Geolocation from 'react-native-geolocation-service'

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
    hasLocationPermission = async () => {
        debugger
        if (Platform.OS === 'ios' ||
            (Platform.OS === 'android' && Platform.Version < 23)) {
                debugger
          return true;
        }
        debugger
        const hasPermission = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        debugger
        if (hasPermission) return true;
        debugger
        const status = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        debugger
        if (status === PermissionsAndroid.RESULTS.GRANTED) return true;
        debugger
        if (status === PermissionsAndroid.RESULTS.DENIED) {
          ToastAndroid.show('Location permission denied by user.', ToastAndroid.LONG);
        } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
          ToastAndroid.show('Location permission revoked by user.', ToastAndroid.LONG);
        }
    
        return false;
      }
    componentDidMount = async () => {
        
    }
    _pressLocation = async () => {
        //http://maps.googleapis.com/maps/api/geocode/json?latlng=21.0062843,105.813662&sensor=true
        const hasLocationPermission = await this.hasLocationPermission();
        debugger
        if (hasLocationPermission) {            
            Geolocation.getCurrentPosition(
                (position) => {
                    debugger
                    console.log(position);
                },
                (error) => {
                    // See error code charts below.
                    debugger
                    console.log(error.code, error.message);
                },
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
            );
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
                <TouchableOpacity onPress={() => {
                    this._pressLocation()
                }}>
                       <Text> Get Location</Text>
                </TouchableOpacity>
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