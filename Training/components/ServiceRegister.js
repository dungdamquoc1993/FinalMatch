import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';

export default class ServiceRegister extends Component {

  
    render() {
        _onPress = () => {
            alert('something');
        }
        return (
            <View style ={styles.container}>
                <Text style={styles.title}>Đăng Ký Cung Cấp Dịch Vụ</Text>
                <TouchableOpacity style= {styles.button} onPress = {this._onPress}>
                    <Text>
                        Đăng Ký Dịch Vụ Cầu Thủ
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style= {styles.button} onPress = {this._onPress}>
                    <Text>
                        Đăng Ký Dịch Vụ Trọng Tài   
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style= {styles.button} onPress = {this._onPress}>
                    <Text>
                        Đăng Ký Sân Bóng
                    </Text>
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
        backgroundColor: 'red',
    },
    title: {
        fontSize: 25,
        backgroundColor: 'blue',
        height: 50,
        width: '80%',
        margin: 20,
    },
    button: {
        alignItems: 'center',
        backgroundColor: '#DDDDDD',
        padding: 10,    
        margin: 20,
        fontSize: 30,
        
    }
})
