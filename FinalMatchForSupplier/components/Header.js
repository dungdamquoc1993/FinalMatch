import React, {Component} from 'react'
import {View, StyleSheet, Image,
    TouchableOpacity,
    Text,
    Dimensions
} from 'react-native'

export const Header = (props) => {
    const {title} = props
    return <View style={styles.container}>
        <Text style={styles.title}>
            {title}
        </Text>
    </View>
}

const styles = StyleSheet.create({
    container: {            
        height: 50,
        width: '100%',
        backgroundColor: 'red'
    },
    title: {
        alignSelf: "center", 
        lineHeight: 50, 
        fontSize: 16,
        fontFamily: 'arial'
    }
})