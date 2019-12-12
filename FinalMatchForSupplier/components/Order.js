import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import Header from './Header'

export default class Order extends Component {
    render() {
        return (
            <View style ={styles.container}>
                <Header title={"ĐẶt hàng"}/> 
                <Text style={{fontSize: 50}}>Order</Text>
                
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

})
