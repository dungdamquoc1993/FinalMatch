/**
 * @format
 * Cai dat trong ios
 * cd ios
 * rm -rf Pods
 * rm -rf Podfile.lock
 * pod install
 * yarn add redux react-redux react-native-vector-icons axios react-native-image-crop-picker
 * react-native link @react-native-community/geolocation
 * yarn add @react-native-community/async-storage 
 * yarn add react-native-linear-gradient
 * npm install --save react-native-fbsdk 
 * 
 */

import {AppRegistry} from 'react-native';
//import App from './App';
import {name as appName} from './app.json';

import StackNavigator from './components/StackNavigator'
AppRegistry.registerComponent(appName, () => StackNavigator)
 
