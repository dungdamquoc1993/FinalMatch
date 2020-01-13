import {createStackNavigator} from 'react-navigation-stack';
import {createAppContainer} from 'react-navigation';
import LoginAndSignup from './LoginAndSignup';
import OrderArbitration from './OrderArbitration';
import OrderPlayer from './OrderPlayer';
import Stadium from './Stadium';
export const StackNavigator = createStackNavigator ({
  LoginAndSignup: {screen: LoginAndSignup},
  OrderArbitration: {screen: OrderArbitration},
  OrderPlayer: {screen: OrderPlayer},
  Stadium: {screen: Stadium},
},
);


const MyStackNavigator = createAppContainer (StackNavigator);
export default MyStackNavigator;
