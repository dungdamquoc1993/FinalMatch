/**
 * @format
 * Cai dat trong ios
 * cd ios
 * rm -rf Pods
 * rm -rf Podfile.lock
 * pod install
 * 
 */

import {AppRegistry} from 'react-native';
//import App from './App';
import {name as appName} from './app.json';

import { createAppContainer } from 'react-navigation'
import {StackNavigator} from './components/StackNavigator'

AppRegistry.registerComponent(appName, () => createAppContainer(StackNavigator))
 
