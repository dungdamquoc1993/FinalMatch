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
  },
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
  initialRouteName: 'Splash',
  headerShown: false,
}))
export default () => <Provider store={store}>
    <StackNavigator />
   
</Provider> 