/**
 * @format
 * Cai dat trong ios
 * cd ios
 * rm -rf Pods
 * rm -rf Podfile.lock
 * pod install
 * yarn add redux react-redux
 */

import {AppRegistry} from 'react-native';
//import App from './App';
import {name as appName} from './app.json';


import StackNavigator from './components/StackNavigator'

AppRegistry.registerComponent(appName, () => StackNavigator)
 
