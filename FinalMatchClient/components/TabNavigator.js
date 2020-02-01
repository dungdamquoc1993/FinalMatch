import { createBottomTabNavigator } from 'react-navigation-tabs'
import Orders from './Orders'
import Service from './Service'
import { createAppContainer } from 'react-navigation'
const Tabnavigator = createBottomTabNavigator(
    {
        Service:{screen: Service},
        Orders: { screen: Orders }
    },
    {
        tabBarOptions: {
            activeTintColor: 'tomato',
            inactiveTintColor: 'gray',
          },
    }
)
const MyTabnavigator = createAppContainer(Tabnavigator)
MyTabnavigator.navigationOptions = {
    headerShown: false,
}
export default MyTabnavigator