import {createAppContainer,createSwitchNavigator} from 'react-navigation'
import MyStackNavigator from './StackNavigator'
import MyTabnavigator from './TabNavigator'
import LoginRegister from './LoginRegister'
import Splash from './Splash'
const SwitchNavigator = createSwitchNavigator({
    // AuthLoading:LoginRegister,
    AuthLoading:Splash,
    App:MyStackNavigator,
    //Auth:MyTabnavigator
    Auth: LoginRegister
},{
    headerShown: false,    
})
export default createAppContainer(SwitchNavigator)
