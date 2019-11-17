import React from 'react'
import {StyleSheet, View, Text, Button} from 'react-native'
export default class Main extends React.Component {
    state = {
        x: 0
    }
    render() {
        return <View style = {styles.container}>
            <Text style = {styles.helloText}>
                Chao cac ban
            </Text>
            <Button onPress={() => {
                alert("do somethingg")
            }}>Lam gi do</Button>
            <Text>
                Di an com thoi cac ban
            </Text>
        </View>
    }
}
const PI = 3.14
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