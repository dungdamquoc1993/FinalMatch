//yarn add react-navigation react-navigation-tabs react-native-reanimated 
//yarn add react-native-gesture-handler
//yarn add react-native-vector-icons
//yarn add react-navigation-stack react-navigation 
//react-native link
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs'
import React from 'react'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
//man hinh 
import ServiceRegister from './ServiceRegister';
// import Notification from './Notification';
import Order from './Order';
import Settings from './Settings';
import {Image} from 'react-native'
//mau sac
import {COLOR_GREEN, COLOR_GRAY} from '../colors/colors'

const TabNavigator = createBottomTabNavigator(
    {
        ServiceRegister: { screen: ServiceRegister },
        // Notification: { screen: Notification },
        Order: { screen: Order },
        Settings: { screen: Settings }
    },
    {
        defaultNavigationOptions: ({ navigation }) => ({
            tabBarIcon: ({ focused, tintColor }) => {
                const { routeName } = navigation.state;
                let iconName = ""
                switch (routeName) {
                    case 'ServiceRegister':
                        iconName = require('../images/document.png')
                        break
                    // case 'Notification':
                    //     iconName = require('../images/notification.png')
                    //     break
                    case 'Order':
                        iconName = require('../images/order.png')
                        break
                    case 'Settings':
                        iconName = require('../images/football-player.png')
                        break
                    default:
                        iconName = ""
                        break
                }
                return <Image source={iconName} style={{width:30,height:30}} />
            },
        }),
        tabBarOptions: {
            activeTintColor: COLOR_GREEN,
            inactiveTintColor: COLOR_GRAY,
        },
    }
)
const MyTabNavigator = createAppContainer(TabNavigator)
MyTabNavigator.navigationOptions = {
    header: null,
}
export default MyTabNavigator


