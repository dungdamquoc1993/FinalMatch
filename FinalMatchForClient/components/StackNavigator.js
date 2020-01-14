import {createStackNavigator} from 'react-navigation-stack';
import {createAppContainer} from 'react-navigation';
import LoginAndSignup from './LoginAndSignup';
import OrderReferee from './OrderReferee';
import OrderPlayer from './OrderPlayer';
import Stadium from './Stadium';
import RefereeList from './RefereeList'
import PlayersList from './PlayersList'
export const StackNavigator = createStackNavigator ({
  LoginAndSignup: {screen: LoginAndSignup},
  OrderReferee: {screen: OrderReferee},
  OrderPlayer: {screen: OrderPlayer},
  Stadium: {screen: Stadium},
  RefereeList: {screen: RefereeList},
  PlayersList: {screen: PlayersList},
},);


const MyStackNavigator = createAppContainer (StackNavigator);
export default MyStackNavigator;
