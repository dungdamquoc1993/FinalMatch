/**
 * @format
 */

import {AppRegistry} from 'react-native';
//import App from './App';
import LoginRegister from './components/LoginRegister';
import {name as appName} from './app.json';
import MyTabNavigator from './components/MyTabNavigator'
import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'

const AppNavigator = createStackNavigator({
    LoginRegister: {
      screen: LoginRegister,
      
    },
    MyTabNavigator: {
        screen: MyTabNavigator,
      },
  }, {
    initialRouteName: 'LoginRegister',
    header: null
  })

AppRegistry.registerComponent(appName, () => createAppContainer(AppNavigator))
 
