import { createStackNavigator } from 'react-navigation-stack'
import MyTabNavigator from './MyTabNavigator'
import RefereeService from './RefereeService'
import Stadium from './Stadium'
import PlayerService from './PlayerService'
import LoginRegister from './LoginRegister';

import React, {Component} from 'react'
import { createAppContainer } from 'react-navigation'
import { Provider } from 'react-redux'
<<<<<<< HEAD
import { store } from '../redux/stores/store'

=======
import {store} from '../redux/stores/store'
import {KeyboardAvoidingView} from 'react-native'
>>>>>>> 5063163e5a10149d3deebdf82011ac0e174f92e6
const StackNavigator = createAppContainer(createStackNavigator({
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
}))
export default () => <Provider store={store}>
    <StackNavigator />
   
</Provider> 