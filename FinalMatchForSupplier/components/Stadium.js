import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, 
    SafeAreaView,
    Dimensions } from 'react-native';
import Header from './Header'

export default class Stadium extends Component {
    static navigationOptions = {
        header: null
    }
    render() {
        return (
            <View style ={styles.container}>
                <Header title={"Stadium"}/> 
                <Text style={{fontSize: 50}}>Stadium Stadium</Text>
                
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