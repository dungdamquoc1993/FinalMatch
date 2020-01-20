/**
 * @format
 * Cai dat trong ios
 * cd ios
 * rm -rf Pods
 * rm -rf Podfile.lock
 * pod install
yarn add @react-native-community/async-storage @react-native-community/geolocation axios react-native-date-picker react-native-fbsdk react-native-geolocation-service react-native-gesture-handler react-native-image-crop-picker react-native-linear-gradient react-native-modal react-native-modals react-native-reanimated react-native-vector-icons react-navigation react-navigation-stack react-navigation-tabs
 * 
 */
import {AppRegistry} from 'react-native';
//import App from './App';
import {name as appName} from './app.json';

import SwitchNavigator from './components/SwitchNavigator'
AppRegistry.registerComponent(appName, () => SwitchNavigator)
 
