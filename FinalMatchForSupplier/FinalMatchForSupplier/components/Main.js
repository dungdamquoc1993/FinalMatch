import React from 'react'
import {StyleSheet, View, Text} from 'react-native'
export default class Main extends React.Component {
    state = {
        x: 0
    }
    render() {
        return <View style = {styles.container}>
            <Text style = {styles.helloText}>
                Chao cac ban
            </Text>
        </View>
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center', 
        alignItems: 'center'
    },
    helloText: {
        fontSize: 30,
    }
})