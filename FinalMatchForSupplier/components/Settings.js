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
import {daysBetween2Dates, 
    convertDayMonthYearToString, 
    isIOS,
    convertDateToString
} from '../helpers/Helpers'
import DatePicker from 'react-native-date-picker'
/**
 * yarn add react-native-date-picker
 * 
 * Down project:
 * 1.rm -rf node_modules
 * 2.yarn install
 * 3.react-native link
 */
export default class Settings extends Component {
    state = {
        name: '',
        age: '',
        dateOfBirth: new Date(),
        stringDateOfBirth: '',
        phoneNumber: '',     
        showIOSDatePicker: false   
    }
    _displayAge(age) {
        if(age > 0) {
            return age > 1 ? `${age} ages` : `${age} age`
        } else {
            return ""
        }
    }
    _onPressDateTextInput = async () => {
        try {
            debugger
            if(isIOS()) {
                this.setState({showIOSDatePicker: true})
                return
            }
            const { action, year, month, day } = await DatePickerAndroid.open({
                date: new Date(),
                mode: 'spinner'
            });
            let selectedDate = new Date(year, month, day)      
            let today = new Date()                          
            if (action === DatePickerAndroid.dateSetAction) {
                this.setState({
                    dateOfBirth: selectedDate,
                    stringDateOfBirth: convertDayMonthYearToString(day, month, year),
                    age: daysBetween2Dates(today, selectedDate)
                })
            }
        } catch ({ code, message }) {
            console.warn('Cannot open date picker', message);
        }
    }
    _navigateToServiceRegister = () => {
        let params = {}
        this.props.navigation.navigate("ServiceRegister", params)
    }
    render() {
        const {name, age, dateOfBirth, phoneNumber, stringDateOfBirth, 
            showIOSDatePicker} = this.state
        return (
            <SafeAreaView style ={styles.container}>
                <Header title={"Quản lý tài khoản"}/> 
                
                <ScrollView style={styles.scrollView}>
                    <View style={styles.personalInformation}>
                        <Text style={styles.textLabel}>
                            Tên:
                        </Text>
                        <TextInput style={styles.textInput} 
                            placeholder={"Please enter name"}
                            value = {name} 
                            onChangeText = {(name) => {
                                this.setState({name})
                            }}
                        >

                        </TextInput>
                    </View>
                    <View style={styles.dateTime}>
                        <Text style={styles.textLabel}>
                            Tuổi:
                        </Text>
                        <TouchableOpacity style={[styles.textInput, {width: '40%'}, isIOS() && {paddingTop: 10}]}
                            onPress={() => {
                                this._onPressDateTextInput()
                            }}>
                            <TextInput
                                keyboardType={"default"}
                                placeholder={"dd/mm/yyyy"}
                                editable={false}
                                value={stringDateOfBirth} 
                                onPress={() => {
                                    this._onPressDateTextInput()
                                }}
                                // value={"djsijhd"}
                                />
                        </TouchableOpacity>    
                        <Text style={styles.age}>
                            {this._displayAge(age)}                            
                        </Text>            
                    </View>
                    <View style={styles.personalInformation}>
                        <Text style={styles.textLabel}>
                            SDT:
                        </Text>
                        <TextInput style={styles.textInput}
                            placeholder={"Please enter phone"}
                            keyboardType={"phone-pad"}
                            value = {phoneNumber} 
                            onChangeText = {(phoneNumber) => {
                                this.setState({phoneNumber})
                            }}>

                        </TextInput>
                    </View>
                    {/* Quan ly dich vu */}
                    <View style={styles.serviceRegister}>
                        <Text>
                            Quản lý dịch vụ
                        </Text>
                        <Text>
                            Bạn chưa đăng ký dịch vụ nào, hãy đăng ký dịch vụ
                        </Text>
                        <TouchableOpacity style={styles.buttonServiceRegister}
                            onPress={() => {
                                this._navigateToServiceRegister()
                            }}>
                            <Text style={{color: 'white'}}>Dang ky dich vu</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
                {isIOS() && showIOSDatePicker && 
                    <View>
                        <View style={{flexDirection: 'row', justifyContent:'flex-end', height: 40}}>
                            <TouchableOpacity onPress={() => {
                                this.setState({showIOSDatePicker: false})
                            }}>
                                <Text>Save</Text>
                            </TouchableOpacity>
                        </View>
                        <DatePicker
                            mode={"date"}
                            date={this.state.dateOfBirth}
                            onDateChange={(dateOfBirth) => {
                                const today = new Date()
                                this.setState({
                                    dateOfBirth,
                                    stringDateOfBirth: convertDateToString(dateOfBirth),
                                    age: daysBetween2Dates(today, dateOfBirth)
                                })
                            }}
                        />    
                </View>}
                
            </SafeAreaView>
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
    scrollView: {
        width: '100%',        
    },
    personalInformation: {
        flexDirection: 'row', 
        height: 60,
        width: '100%',
        justifyContent: 'center', 
        alignItems: 'center'
    },
    dateTime: {
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
    age: {
        width: '40%',
        height: 60,
        lineHeight: 60,
    },
    serviceRegister: {
        
        paddingHorizontal: 15, 
        fontSize: 14, 
        flexDirection: 'column'
    }, 
    buttonServiceRegister: {
        margin: 10,
        height: 40,
        backgroundColor: 'darkgreen',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        color: 'white'
    }
})