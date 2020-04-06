import React, {Component} from 'react'
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native'
import Header from './Header'

import RefereeService from './RefereeService'
import {translate} from '../languages/languageConfigurations'
import Stadium from './Stadium'
import PlayerService from './PlayerService'
import {connect} from 'react-redux'
import {MAIN_COLOR, COLOR_BUTTON} from '../colors/colors'
import {
  checkPlayerServiceExist,
  checkRefereeServiceExist,
} from '../server/myServices'
import {
  getSupplierFromStorage,
  saveSupplierToStorage,
  isIOS,
} from '../helpers/Helpers'
const screenWidth = Math.round (Dimensions.get ('window').width)
const screenHeight = Math.round (Dimensions.get ('window').height)

class ServiceRegister extends Component {
  _navigateToPlayerService = async () => {
    const {supplierId, tokenKey, email} = await getSupplierFromStorage ()
    const {data, message} = await checkPlayerServiceExist (supplierId)
    const {numberOfPlayerServices} = data
    if (parseInt (numberOfPlayerServices) == 0) {
      this.props.stackNavigation.navigate('PlayerService', {})
    } else {
      this.props.navigation.navigate(translate("Settings"), {})
    }
  }
  _navigateToRefereeService = async () => {
    const {supplierId, tokenKey, email} = await getSupplierFromStorage ()
    const {data, message} = await checkRefereeServiceExist (supplierId)
    const {numberOfRefereeServices} = data
    if (parseInt (numberOfRefereeServices) == 0) {
      this.props.stackNavigation.navigate('RefereeService', {})
    } else {
      this.props.navigation.navigate(translate("Settings"), {})
    }
  }
  _navigateToStadium = () => {
    this.props.stackNavigation.navigate('Stadium', {})
  }
  render () {
    return (
      <SafeAreaView style={{
          flex: 1,          
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}>        
        <Header           
          title={translate("Register a service")} hideBack={true} hideNext={true} />
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              this._navigateToPlayerService ()
            }}
          >
            <Text style={styles.txt}>
              {translate("Player")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              this._navigateToRefereeService ()
            }}
          >
            <Text style={styles.txt}>
            {translate("Referee")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              this._navigateToStadium ()
            }}
          >
            <Text style={styles.txt}>
              {translate("Stadium")}
            </Text>
          </TouchableOpacity>
        </View>

      </SafeAreaView>
    )
  }
}
const mapStateToProps = state => ({
  //convert "global object"(shared state) => ServiceRegister's props
  stackNavigation: state.navigationReducers.stackNavigation,
  tabNavigation: state.navigationReducers.tabNavigation,
})
export default connect (mapStateToProps) (ServiceRegister)
const styles = StyleSheet.create ({
  txt: {
    lineHeight: isIOS() ? null: 0.08 * screenHeight,
    fontSize: 25,    
    color: 'white',
    fontWeight: 'bold'
  },
  button: {
    backgroundColor: MAIN_COLOR,
    borderWidth: 8,
    borderColor: COLOR_BUTTON,
    padding: 10,
    margin: 30,
    fontSize: 30,
    width: 0.8 * screenWidth,
    height: 80,    
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
