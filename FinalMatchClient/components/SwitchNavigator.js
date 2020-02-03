import {createAppContainer,createSwitchNavigator} from 'react-navigation'
import MyStackNavigator from './StackNavigator'
import MyTabnavigator from './TabNavigator'
import LoginAndSignup from './LoginAndSignup'
import Splash from './Splash'
const SwitchNavigator = createSwitchNavigator({
    // AuthLoading:LoginAndSignup,
    AuthLoading:Splash,
    App:MyStackNavigator,
    //Auth:MyTabnavigator
    Auth: LoginAndSignup
},{
    headerShown: false,    
})
export default createAppContainer(SwitchNavigator)
