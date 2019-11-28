import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, 
    SafeAreaView,
    Dimensions } from 'react-native';
import Header from './Header'

export default class RefereeService extends Component {
    static navigationOptions = {
        header: null
    }
    render() {
        return (
            <View style ={styles.container}>
                <Header title={"RefereeService"}/> 
                <Text style={{fontSize: 50}}>Referee Service</Text>
                
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