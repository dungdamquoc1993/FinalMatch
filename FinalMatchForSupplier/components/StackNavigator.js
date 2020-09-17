import { createStackNavigator } from 'react-navigation-stack'
import MyTabNavigator from './MyTabNavigator'
import RefereeService from './RefereeService'
import Stadium from './Stadium'
import PlayerService from './PlayerService'
import LoginRegister from './LoginRegister'
import Splash from './Splash'

import React, { Component } from 'react'
import { createAppContainer } from 'react-navigation'
import { Provider } from 'react-redux'
import { store } from '../redux/stores/store'
import { KeyboardAvoidingView } from 'react-native'
import Chat from './Chat'
import SearchPlace from './SearchPlace'

const StackNavigator = createAppContainer(createStackNavigator({
  Splash: {
    screen: Splash,
    navigationOptions: {
      gestureEnabled: false
    }
  },
  LoginRegister: {
    screen: LoginRegister,
    navigationOptions: {
      gestureEnabled: false
    }
  },
  MyTabNavigator: {
    screen: MyTabNavigator,
    navigationOptions: {
      gestureEnabled: false
    }
  },
  RefereeService: {
    screen: RefereeService,
    navigationOptions: {
      gestureEnabled: false
    }
  },
  PlayerService: {
    screen: PlayerService,
    navigationOptions: {
      gestureEnabled: false
    }
  },
  Stadium: {
    screen: Stadium,
    navigationOptions: {
      gestureEnabled: false
    }
  },
  Chat: {
    screen: Chat,
    navigationOptions: {
      gestureEnabled: false
    }
  },
  SearchPlace: {
    screen: SearchPlace,
    navigationOptions: {
      gestureEnabled: false
    }
  },
}, {
  initialRouteName: 'Splash',
  headerShown: false,
  gestureEnabled: false,
  navigationOptions: {
    gestureEnabled: false
  }
}))


export default class StackNavigatorRoot extends Component {
  render() {
    return (
      <Provider store={store}>
        <StackNavigator />
      </Provider>
    )
  }
}