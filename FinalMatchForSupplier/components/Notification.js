import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity,SafeAreaView,Dimensions} from 'react-native';
import Header from './Header'
const {width, height} = Dimensions.get("window")
export default class Notification extends Component {
    render() {
        return (
            <SafeAreaView style ={styles.container}>
            <View style ={{marginLeft:0.3*width}}>
            <Header title={"Thong bao"} hideBack={true}/> 
            </View>
                
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
