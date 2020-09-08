import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Modal,
  Linking,
  AppState
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import LinearGradient from 'react-native-linear-gradient'
import { translate } from '../languages/languageConfigurations'
import MultiLanguageComponent from './MultiLanguageComponent'
import Header from './Header'
import messaging from '@react-native-firebase/messaging';

export default class Service extends MultiLanguageComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      appState: AppState.currentState
    };
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
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      this.setState({ visible: false })
    } else {
      this.setState({ visible: true })
    }
  }

  async componentDidMount() {
    AppState.addEventListener("change", this._handleAppStateChange);
    this.checkNotifyPermission()
  }

  componentWillUnmount() {
    AppState.removeEventListener("change", this._handleAppStateChange);
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>

        <View style={{ flexDirection: 'column', alignItems: 'center', marginTop: 20 }} >
          <Text style={{ fontSize: 20, margin: 10, textAlign: 'center', fontStyle: 'italic' }}>
            {translate('Greater than just a Game')}</Text>
          <Text style={styles.textTitle}>{translate('Order service')}</Text>
        </View>

        <LinearGradient
          colors={['#CAF1C1', '#C2F3B7', '#33FF99']}
          style={{
            height: 100,
            width: '80%',
            borderRadius: 30,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              navigate('OrderPlayer');
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                marginVertical: 10,
              }}
            >
              <Text style={styles.textButton}>
                {translate('Order Player')}
              </Text>
              <Image
                style={{ height: 30, width: 30 }}
                source={require('../images/2339949.png')}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-around',
              }}
            >
              <View style={{ flexDirection: 'column' }}>
                <Text>CF</Text>
                <FontAwesome5 name={'check-square'} size={20} color={'black'} />
              </View>
              <View style={{ flexDirection: 'column' }}>
                <Text>CF</Text>
                <FontAwesome5 name={'check-square'} size={20} color={'black'} />
              </View>
              <View style={{ flexDirection: 'column' }}>
                <Text>CF</Text>
                <FontAwesome5 name={'check-square'} size={20} color={'black'} />
              </View>
              <View style={{ flexDirection: 'column' }}>
                <Text>CF</Text>
                <FontAwesome5 name={'check-square'} size={20} color={'black'} />
              </View>
            </View>
          </TouchableOpacity>
        </LinearGradient>

        <LinearGradient
          colors={['#CAF1C1', '#C2F3B7', '#33FF99']}
          style={{
            height: 100,
            width: '80%',
            borderRadius: 30,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              navigate("OrderReferee");
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignItems: 'center',
                height: 100,
              }}
            >
              <Text style={styles.textButton}>
                {translate("Order Referee")}
              </Text>
              <Image
                style={{ height: 30, width: 30 }}
                source={require('../images/whistle.png')}
              />
            </View>
          </TouchableOpacity>
        </LinearGradient>

        <LinearGradient
          colors={['#CAF1C1', '#C2F3B7', '#33FF99']}
          style={{
            height: 100,
            width: '80%',
            borderRadius: 30,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              navigate('Stadium');
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                marginVertical: 35,
                height: 100,
              }}
            >
              <Text style={styles.textButton}>
                {translate('Search Stadium')}
              </Text>
              <Image
                style={{ height: 30, width: 30 }}
                source={require('../images/404650.png')}
              />
            </View>
          </TouchableOpacity>
        </LinearGradient>
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
              <TouchableOpacity style={styles.button} onPress={() => this.setState({ visible: false })}>
                <Text style={{ textAlign: 'center', color: '#3079ff', fontWeight: 'bold' }}>Don't Allow</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => Linking.openSettings()}>
                <Text style={{ textAlign: 'center', color: '#3079ff', fontWeight: 'bold' }}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  modal: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#00000080' },
  button: {
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopColor: '#ddd',
    borderTopWidth: 1
  },
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
    flex: 1,
  },
  textTitle: {
    fontSize: 20,
    margin: 10,
    textAlign: 'center',
  },
  textButton: {
    fontSize: 20,

    textAlign: 'center',
  },
});
