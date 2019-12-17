import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, 
    SafeAreaView,
    Dimensions } from 'react-native';
import {Header } from './Header'

import RefereeService from './RefereeService'
import Stadium from './Stadium'
import PlayerService from './PlayerService'
import { connect } from 'react-redux'

import {checkPlayerServiceExist} from '../server/myServices'
import {getSupplierFromStorage, saveSupplierToStorage} from '../helpers/Helpers'

class ServiceRegister extends Component {
    _navigateToPlayerService = async () => {        
        const {supplierId, tokenKey, email} = await getSupplierFromStorage() 
        const { data, message} = await checkPlayerServiceExist(supplierId)
        const {numberOfPlayerServices} = data        
        debugger
        if(parseInt(numberOfPlayerServices) == 0) {
            this.props.stackNavigation.navigate("PlayerService", {}) 
        } else {
            debugger
            this.props.tabNavigation.navigate("Settings", {}) 
        }

        
    }
    _navigateToRefereeService = () => {
        this.props.stackNavigation.navigate("RefereeService", {})    
    }
    _navigateToStadium = () => {
        this.props.stackNavigation.navigate("Stadium", {}) 
    }
    
  
    render() {                
        return (
            <SafeAreaView style ={styles.container}>
                <TouchableOpacity style= {styles.button} onPress = {() => {
                    this._navigateToPlayerService()
                }}>
                    <Text>
                        Đăng Ký Dịch Vụ Cầu Thủ
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style= {styles.button} onPress = {() => {
                    this._navigateToRefereeService()
                }}>
                    <Text>
                        Đăng Ký Dịch Vụ Trọng Tài   
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style= {styles.button} onPress = {() => {
                    this._navigateToStadium()
                }}>
                    <Text>
                        Đăng Ký Sân Bóng
                    </Text>
                </TouchableOpacity>
            </SafeAreaView>
        )
    }
}
const mapStateToProps = state => ({
    //convert "global object"(shared state) => ServiceRegister's props
    stackNavigation: state.navigationReducers.stackNavigation,
    tabNavigation: state.navigationReducers.tabNavigation
})
export default connect(
    mapStateToProps
)(ServiceRegister)

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flex: 1,
    },
    title: {
        fontSize: 25,
        backgroundColor: 'blue',
        height: 0.08*screenHeight,
        width: 0.8*screenWidth,
        margin: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#DDDDDD',
        padding: 20,    
        margin: 20,
        fontSize: 30,
        width: 0.8*screenWidth,
        height: 0.15*screenHeight,
        borderRadius: 20,        
    }
})
