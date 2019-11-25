import React, { Component } from 'react';
import { 
    Text,
    View, 
    ScrollView,
    StyleSheet, 
    DatePickerAndroid,
    TextInput,
    Platform,
    SafeAreaView,
    TouchableOpacity } from 'react-native';
import {Header } from './Header'
<<<<<<< HEAD
import {daysBetween2Dates, formatDate} from '../helpers/Helpers'
=======
import {daysBetween2Dates, convertDayMonthYearToString, convertDateToString} from '../helpers/Helpers'
>>>>>>> 8eb7a0704ef6d0429e3e65eb644d98b9babc0a51
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
                        <TouchableOpacity style={[styles.textInput, {width: '40%'}]}
                            onPress={async () => {
                            try {
                                debugger
                                if(Platform.OS === 'ios') {
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
                        }}>
                            <TextInput
                                keyboardType={"default"}
                                placeholder={"dd/mm/yyyy"}
                                editable={false}
                                value={stringDateOfBirth} 
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
                    
                </ScrollView>
<<<<<<< HEAD
                {Platform.OS === 'ios' && showIOSDatePicker && <DatePicker
                    date={this.state.dateOfBirth}
                    onDateChange={dateOfBirth => {
                        this.setState({
                            dateOfBirth,
                            stringDateOfBirth: formatDate(day, month, year),
                            age: daysBetween2Dates(today, selectedDate)
                        })
                    }}
                />}
=======
                {Platform.OS === 'ios' && showIOSDatePicker && 
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
                            date={thimport React, { Component } from 'react';
                            import { 
                                Text,
                                View, 
                                ScrollView,
                                StyleSheet, 
                                DatePickerAndroid,
                                TextInput,
                                Platform,
                                SafeAreaView,
                                TouchableOpacity } from 'react-native';
                            import {Header } from './Header'
                            import {daysBetween2Dates, convertDayMonthYearToString, convertDateToString} from '../helpers/Helpers'
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
                                                    <TouchableOpacity style={[styles.textInput, {width: '40%'}]}
                                                        onPress={async () => {
                                                        try {
                                                            debugger
                                                            if(Platform.OS === 'ios') {
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
                                                    }}>
                                                        <TextInput
                                                            keyboardType={"default"}
                                                            placeholder={"dd/mm/yyyy"}
                                                            editable={false}
                                                            value={stringDateOfBirth} 
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
                                                
                                            </ScrollView>
                                            {Platform.OS === 'ios' && showIOSDatePicker && 
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
                                }
                            })is.state.dateOfBirth}
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
                
>>>>>>> 8eb7a0704ef6d0429e3e65eb644d98b9babc0a51
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
    }
})