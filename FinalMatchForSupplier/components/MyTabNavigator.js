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
import Notification from './Notification';
import Order from './Order';
import Settings from './Settings';
//mau sac
import {COLOR_GREEN, COLOR_GRAY} from '../colors/colors'

const TabNavigator = createBottomTabNavigator(
    {
        ServiceRegister: { screen: ServiceRegister },
        Notification: { screen: Notification },
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
                        iconName = 'accessible-icon'
                        break
                    case 'Notification':
                        iconName = `accessible-icon`
                        break
                    case 'Order':
                        iconName = `accessible-icon`
                        break
                    case 'Settings':
                        iconName = `accessible-icon`
                        break
                    default:
                        iconName = ""
                        break
                }
                return <FontAwesome5 name={iconName} size={20} color={tintColor} />
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


