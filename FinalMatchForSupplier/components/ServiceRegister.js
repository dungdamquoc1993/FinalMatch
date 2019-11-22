import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';

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
const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

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
        height: 0.08*screenHeight,
        width: 0.8*screenWidth,
        margin: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#DDDDDD',
        padding: 20,    
        margin: 20,
        fontSize: 30,
        width: 0.8*screenWidth,
        height: 0.15*screenHeight,

        
    }
})
