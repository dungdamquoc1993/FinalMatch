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
            <Text>
                Heloon hr euhfu
            </Text>
            <Button 
                title={"Add 2 number"}
                onPress={() => {
                alert("do somethingg")
            }}>Lam gi do</Button>
            <View>
                <View></View>
            </View>
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