import {createStackNavigator} from 'react-navigation-stack';
import {createAppContainer} from 'react-navigation'
import LoginAndSignup from './LoginAndSignup'
import Service from './Service'
export const StackNavigator = createStackNavigator({
    LoginAndSignup:{screen:LoginAndSignup},
    Service:{screen:Service}
})
const MyStackNavigator = createAppContainer(StackNavigator)
export default MyStackNavigator