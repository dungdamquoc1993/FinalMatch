import {createAppContainer,createSwitchNavigator} from 'react-navigation'
import MyStackNavigator from './StackNavigator'
import MyTabnavigator from './TabNavigator'
import LoginAndSignup from './LoginAndSignup'
const SwitchNavigator = createSwitchNavigator({
    AuthLoading:LoginAndSignup,
    App:MyStackNavigator,
    Auth:MyTabnavigator
},{
    header: null
})
export default createAppContainer(SwitchNavigator)
