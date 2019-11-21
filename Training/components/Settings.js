import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';

export default class Settings extends Component {
    render() {
        return (
            <View style ={styles.container}>
                <Text style={{fontSize: 50}}>Settings</Text>
                
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },

})
