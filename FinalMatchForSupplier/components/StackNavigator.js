import { createStackNavigator } from 'react-navigation-stack'
import MyTabNavigator from './MyTabNavigator'
import RefereeService from './RefereeService'
import Stadium from './Stadium'
import PlayerService from './PlayerService'
import LoginRegister from './LoginRegister';
import Splash from './Splash';

import React, {Component} from 'react'
import { createAppContainer } from 'react-navigation'
import { Provider } from 'react-redux'
import {store} from '../redux/stores/store'
import {KeyboardAvoidingView} from 'react-native'

const StackNavigator = createAppContainer(createStackNavigator({
  Splash: {
    screen: Splash,
    navigationOptions: {
      gesturesEnabled: false
    }
  },
  LoginRegister: {
    screen: LoginRegister,
    navigationOptions: {
      gesturesEnabled: false
    }
  },  
  MyTabNavigator: {
    screen: MyTabNavigator,
    navigationOptions: {
      gesturesEnabled: false
    }
  },
  RefereeService: {
    screen: RefereeService,
    navigationOptions: {
      gesturesEnabled: false
    }
  },
  PlayerService: {
    screen: PlayerService,
    navigationOptions: {
      gesturesEnabled: false
    }
  },
  Stadium: {
    screen: Stadium,
    navigationOptions: {
      gesturesEnabled: false
    }
  },
}, {
  initialRouteName: 'Splash',
  headerShown: false,
  gesturesEnabled: false,
  navigationOptions: {
    gesturesEnabled: false
  }
}))


export default () => <Provider store={store}>
    <StackNavigator />
   
</Provider> 