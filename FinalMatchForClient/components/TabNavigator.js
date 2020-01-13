import { createBottomTabNavigator } from 'react-navigation-tabs'
import Tabtownavigator from './Tabtownavigator'
import Service from './Service'
import { createAppContainer } from 'react-navigation'
const Tabnavigator = createBottomTabNavigator(
    {
        Service:{screen: Service},
        Tabtownavigator: { screen: Tabtownavigator }
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