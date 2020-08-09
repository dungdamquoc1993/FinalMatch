import React, {Component} from 'react'
import {View, StyleSheet, Image,
    TouchableOpacity,
    Text,
    Dimensions
} from 'react-native'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { connect } from 'react-redux'
import { NavigationActions } from 'react-navigation'
import {MAIN_COLOR} from '../colors/colors'
import { alert } from '../helpers/Helpers'
import {translate} from '../languages/languageConfigurations'
//hideBack: boolean
class Header extends Component {
    constructor(props) {
        super(props)        
        this.disableBackButton = false
    }
    render() {
        const {title, hideBack = false, hideNext = false, pressBackButton} = this.props        
        return <View style={{
                height: 60,                  
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <FontAwesome5                
                onPress={async () => {
                    if(this.disableBackButton == true){
                        return
                    }         
                    this.disableBackButton = true                               
                    let result = await pressBackButton()
                    if(result == true) {                        
                        this.props.stackNavigation.dispatch(NavigationActions.back())                                             
                        setTimeout(() => {
                            this.disableBackButton = false
                        },1000)
                    }                    
                }}
                style = {{
                    opacity : hideBack === false ? 1 : 0,
                    paddingStart: 15, 
                }}
                name={"arrow-circle-left"} size={40} 
                color={MAIN_COLOR} />
            <Text style={styles.title}>
                {title}
            </Text>
            <FontAwesome5 style={{ 
                opacity : hideNext === false ? 1 : 0,
                paddingEnd: 15, 
            }}
                name={"arrow-circle-right"} size={40} color={'black'} /> 
        </View>
    }
}
const mapStateToProps = state => ({
    //convert "global object"(shared state) => ServiceRegister's props
    stackNavigation: state.navigationReducers.stackNavigation,
    tabNavigation: state.navigationReducers.tabNavigation
})
const styles = StyleSheet.create({     
    title: {
        flex: 1,        
        textAlign: 'center',
        alignSelf: "center", 
        lineHeight: 50,         
        fontSize: 24,                
        fontWeight: 'bold',
    }
})
export default connect(
    mapStateToProps
)(Header)

