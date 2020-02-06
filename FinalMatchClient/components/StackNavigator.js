import {createStackNavigator} from 'react-navigation-stack';
import {createAppContainer} from 'react-navigation';
import Splash from './Splash'
import LoginAndSignup from './LoginAndSignup';
import TabNavigator from './TabNavigator';
import OrderReferee from './OrderReferee';
import OrderPlayer from './OrderPlayer';
import Stadium from './Stadium';
import RefereeList from './RefereeList'
import PlayersList from './PlayersList'
import SearchPlace from './SearchPlace'
export const StackNavigator = createStackNavigator ({
  Splash: { screen: Splash},
  LoginAndSignup: {screen: LoginAndSignup},
  TabNavigator: {screen: TabNavigator}, 
  OrderReferee: {screen: OrderReferee},
  OrderPlayer: {screen: OrderPlayer},
  Stadium: {screen: Stadium},
  SearchPlace: {screen: SearchPlace},
  RefereeList: {screen: RefereeList},
  PlayersList: {screen: PlayersList},
}, {
  initialRouteName: 'Splash',
  headerShown: false,
});


const MyStackNavigator = createAppContainer (StackNavigator);
export default MyStackNavigator;
