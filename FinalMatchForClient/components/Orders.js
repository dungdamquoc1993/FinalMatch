import React, { Component } from 'react'
import {   Text,
    View,
    Image,
    ScrollView,
    StyleSheet,
    TextInput,
    SafeAreaView,
    PermissionsAndroid,
    ToastAndroid,
    Platform,
    TouchableOpacity, } from 'react-native'
export default class Orders extends Component {
    render() {
        return (
            <View style = {styles.containter}>
            <Text style={styles.header}>Quản Lý Đơn Hàng</Text>

            </View>
        )
    }
}

const styles = StyleSheet.create ({
    container: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
    header: {
        fontSize: 30, 
        fontWeight: 'bold', 
        alignSelf: 'center', 
        marginTop: 30
    }
  });
  

