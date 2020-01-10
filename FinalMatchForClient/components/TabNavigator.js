import { createBottomTabNavigator } from 'react-navigation-tabs'
import Stadium from './Stadium'
import OrderPlayer from './OrderPlayer'
import Service from './Service'
import { createAppContainer } from 'react-navigation'
const Tabnavigator = createBottomTabNavigator(
    {
        Service:{screen: Service},
        Stadium: { screen: Stadium },
        OrderPlayer: { screen: OrderPlayer },
    },
    {
        tabBarOptions: {
            activeTintColor: 'tomato',
            inactiveTintColor: 'gray',
          },
    }
)
const MyTabnavigator = createAppContainer(Tabnavigator)
export default MyTabnavigator