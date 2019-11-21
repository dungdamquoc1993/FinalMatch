//yarn add react-navigation react-navigation-tabs react-native-reanimated 
//yarn add react-native-gesture-handler
//yarn add react-native-vector-icons
//react-native link
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs'
import Ionicons from 'react-native-vector-icons/Ionicons'
import ServiceRegister from './ServiceRegister';
import Notification from './Notification';
import Order from './Order';
import Settings from './Settings';
import React from 'react'
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
                let iconName;
                switch (routeName) {
                    case 'ServiceRegister':
                        iconName = 'cube'
                        break
                    case 'Notification':
                        iconName = `ios-options`;
                        break
                    case 'Order':
                        conName = `ios-options`;
                        break
                    case 'Settings':
                        conName = `ios-options`;
                        break
                    default:
                        iconName = ""
                        break
                }
                return <Ionicons name={iconName} size={30} color={tintColor} />;
            },
        }),
        tabBarOptions: {
            activeTintColor: COLOR_GREEN,
            inactiveTintColor: COLOR_GRAY,
        },
    }
)
const AppContainer = createAppContainer(TabNavigator)
AppContainer.navigationOptions = {
    header: null,
}
export default AppContainer