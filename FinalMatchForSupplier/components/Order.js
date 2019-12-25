import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity,SafeAreaView } from 'react-native';
import Header from './Header'

export default class Order extends Component {
    render() {
        return (
            <SafeAreaView style ={styles.container}>
                <Header title={"ĐẶt hàng"}/> 
                <Text style={{fontSize: 50}}>Order</Text>
                
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

})
