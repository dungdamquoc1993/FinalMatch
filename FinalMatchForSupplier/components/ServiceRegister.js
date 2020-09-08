import React, { Component } from 'react'
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  AppState,
  Modal,
  Linking
} from 'react-native'
import Header from './Header'

import RefereeService from './RefereeService'
import { translate } from '../languages/languageConfigurations'
import Stadium from './Stadium'
import PlayerService from './PlayerService'
import { connect } from 'react-redux'
import { MAIN_COLOR, COLOR_BUTTON } from '../colors/colors'
import {
  checkPlayerServiceExist,
  checkRefereeServiceExist,
} from '../server/myServices'
import {
  getSupplierFromStorage,
  saveSupplierToStorage,
  isIOS,
} from '../helpers/Helpers'
import messaging from '@react-native-firebase/messaging';

const screenWidth = Math.round(Dimensions.get('window').width)
const screenHeight = Math.round(Dimensions.get('window').height)

class ServiceRegister extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      appState: AppState.currentState
    }
  }
  _handleAppStateChange = nextAppState => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      this.checkNotifyPermission()
    }
    this.setState({ appState: nextAppState });
  };

  checkNotifyPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const fcmToken = await messaging().getToken();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      this.setState({ visible: false })
    } else {
      this.setState({ visible: true })
    }
  }

  initNotification() {
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification,
      );
      // BE khi push notification truyen data type la screen Order
      // this.props.navigation.navigate(remoteMessage.data.type);
      this.props.navigation.navigate(translate("Orders"));
    });
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage.notification,
          );
          // this.props.navigation.navigate(remoteMessage.data.type); // e.g. "Order"
          this.props.navigation.navigate(translate("Orders"));
        }
      });
  }

  async componentDidMount() {
    this.initNotification();
    AppState.addEventListener("change", this._handleAppStateChange);
    this.checkNotifyPermission()
  }

  componentWillUnmount() {
    AppState.removeEventListener("change", this._handleAppStateChange);
  }

  _navigateToPlayerService = async () => {
    const { supplierId, tokenKey, email } = await getSupplierFromStorage()
    const { data, message } = await checkPlayerServiceExist(supplierId)
    const { numberOfPlayerServices } = data
    if (parseInt(numberOfPlayerServices) == 0) {
      this.props.stackNavigation.navigate('PlayerService', {})
    } else {
      this.props.navigation.navigate(translate("Settings"), {})
    }
  }
  _navigateToRefereeService = async () => {
    const { supplierId, tokenKey, email } = await getSupplierFromStorage()
    const { data, message } = await checkRefereeServiceExist(supplierId)
    const { numberOfRefereeServices } = data
    if (parseInt(numberOfRefereeServices) == 0) {
      this.props.stackNavigation.navigate('RefereeService', {})
    } else {
      this.props.navigation.navigate(translate("Settings"), {})
    }
  }
  _navigateToStadium = () => {
    this.props.stackNavigation.navigate('Stadium', {})
  }
  render() {
    return (
      <SafeAreaView style={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <Header
          title={translate("Register a service")} hideBack={true} hideNext={true} />
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              this._navigateToPlayerService()
            }}
          >
            <Text style={styles.txt}>
              {translate("Player")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              this._navigateToRefereeService()
            }}
          >
            <Text style={styles.txt}>
              {translate("Referee")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              this._navigateToStadium()
            }}
          >
            <Text style={styles.txt}>
              {translate("Stadium")}
            </Text>
          </TouchableOpacity>
        </View>
        <Modal
          transparent={true}
          visible={this.state.visible}
          animated
        >
          <View style={styles.modal}>
            <View style={{ backgroundColor: '#fff', borderRadius: 8 }}>
              <View style={{ padding: 20 }}>
                <Text style={{ fontWeight: 'bold' }}>Let FinalMatch Notify You</Text>
              </View>
              <TouchableOpacity style={styles.buttonModal} onPress={() => this.setState({ visible: false })}>
                <Text style={{ textAlign: 'center', color: '#3079ff', fontWeight: 'bold' }}>Don't Allow</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonModal} onPress={() => Linking.openSettings()}>
                <Text style={{ textAlign: 'center', color: '#3079ff', fontWeight: 'bold' }}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    )
  }
}
const mapStateToProps = state => ({
  //convert "global object"(shared state) => ServiceRegister's props
  stackNavigation: state.navigationReducers.stackNavigation,
  tabNavigation: state.navigationReducers.tabNavigation,
})
export default connect(mapStateToProps)(ServiceRegister)
const styles = StyleSheet.create({
  modal: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#00000080' },
  buttonModal: {
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopColor: '#ddd',
    borderTopWidth: 1
  },
  txt: {
    lineHeight: isIOS() ? null : 0.08 * screenHeight,
    fontSize: 22,
    color: 'white',
  },
  button: {
    backgroundColor: MAIN_COLOR,
    borderWidth: 2,
    borderColor: 'rgb(225,255,225)',
    padding: 10,
    margin: 30,
    fontSize: 30,
    width: 0.8 * screenWidth,
    height: 80,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
