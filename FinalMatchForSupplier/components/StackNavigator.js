import { createStackNavigator } from 'react-navigation-stack'
import MyTabNavigator from './MyTabNavigator'
import RefereeService from './RefereeService'
import Stadium from './Stadium'
import PlayerService from './PlayerService'
import LoginRegister from './LoginRegister';

export const StackNavigator = createStackNavigator({
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