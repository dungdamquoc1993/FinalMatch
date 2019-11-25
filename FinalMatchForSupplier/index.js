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
import LoginRegister from './components/LoginRegister';
import {name as appName} from './app.json';
import MyTabNavigator from './components/MyTabNavigator'
import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'

import RefereeService from './components/RefereeService'
import Stadium from './components/Stadium'
import PlayerService from './components/PlayerService'

const StackNavigator = createStackNavigator({
  LoginRegister: {
    screen: LoginRegister,

  },
  MyTabNavigator: {
    screen: MyTabNavigator,
  },
  RefereeService: {
    screen: RefereeService,

  },
  PlayerService: {
    screen: PlayerService,

  },
  Stadium: {
    screen: Stadium,

  },
  }, {
    initialRouteName: 'LoginRegister',
    header: null
  })

AppRegistry.registerComponent(appName, () => createAppContainer(StackNavigator))
 
