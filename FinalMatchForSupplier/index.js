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
 * yarn add react-native-modals
 * yarn add react-native-localize
 * react-native link react-native-localize
 * yarn add i18n-js yarn add lodash.memoize
 * yarn add react-native-date-picker moment
 1. Clear watchman watches: watchman watch-del-all
 2. Delete node_modules: rm -rf node_modules and run yarn install
 3. Reset Metro's cache: yarn start --reset-cache
 4. Remove the cache: rm -rf /tmp/metro-*
 */

import {AppRegistry} from 'react-native';
//import App from './App';
import {name as appName} from './app.json';

import StackNavigator from './components/StackNavigator'
AppRegistry.registerComponent(appName, () => StackNavigator)
 
