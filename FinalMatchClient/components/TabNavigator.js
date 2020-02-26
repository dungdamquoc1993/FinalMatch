import React from 'react'
import { createBottomTabNavigator } from 'react-navigation-tabs'
import Orders from './Orders'
import Service from './Service'
import { createAppContainer } from 'react-navigation'
import {Image} from 'react-native'
const Tabnavigator = createBottomTabNavigator(
    {
        Service:{screen: Service},
        Orders: { screen: Orders }
    },
    {
        defaultNavigationOptions: ({ navigation }) => ({
            tabBarIcon: ({tintColor }) => {
                const { routeName } = navigation.state;
                let iconName = ""
                switch (routeName) {
                    case 'Service':
                        iconName = require('../images/service.png')
                        break
                    case 'Orders':
                        iconName = require('../images/deal.png')
                        break
                    default:
                        iconName = ""
                        break
                }
                return <Image source={iconName} style={{width:30,height:30}} />
            },
        }),
    }
    
)
const MyTabnavigator = createAppContainer(Tabnavigator)
MyTabnavigator.navigationOptions = {
    headerShown: false,
}
export default MyTabnavigator