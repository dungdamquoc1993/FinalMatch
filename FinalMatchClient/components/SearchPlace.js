import React, { Component } from 'react'
import { Text, View, TextInput,StyleSheet} from 'react-native'

export default class SearchPlace extends Component {
    render() {
        return (
            <View style={styles.container}>
                <TextInput
                    placeholder="Input location"
                />
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
      },
})

