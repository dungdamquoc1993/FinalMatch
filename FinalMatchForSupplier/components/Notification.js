import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity,SafeAreaView } from 'react-native';
import Header from './Header'
export default class Notification extends Component {
    render() {
        return (
            <SafeAreaView style ={styles.container}>
                <Header title={"Thong bao"}/> 
                <Text>Notificaiton</Text>                
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
