import React, {Component} from 'react'
import {View, StyleSheet, Image,
    TouchableOpacity,
    Text,
    Dimensions
} from 'react-native'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { connect } from 'react-redux'
import { NavigationActions } from 'react-navigation'
import {COLOR_PINK_LIGHT} from '../colors/colors'

//hideBack: boolean
class Header extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        const {title, hideBack = false, pressBackButton} = this.props
        return <View style={styles.container}>
            {hideBack === false && <FontAwesome5
                onPress={async () => {
                    await pressBackButton()
                    this.props.stackNavigation.dispatch(NavigationActions.back())
                }}
                name={"arrow-circle-left"} size={50} 
                color={COLOR_PINK_LIGHT} />}
            <Text style={styles.title}>
                {title}
            </Text>
            <FontAwesome5 style={{ opacity: 0 }}
                name={"arrow-circle-left"} size={30} color={'black'} /> 
        </View>
    }
}
const mapStateToProps = state => ({
    //convert "global object"(shared state) => ServiceRegister's props
    stackNavigation: state.navigationReducers.stackNavigation,
    tabNavigation: state.navigationReducers.tabNavigation
})
const styles = StyleSheet.create({
    container: {
        height: 80,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },    
    title: {
        alignSelf: "center", 
        lineHeight: 50, 
        fontSize: 30,
        fontFamily: 'arial',
        textAlign:'center'
    }
})
export default connect(
    mapStateToProps
)(Header)

