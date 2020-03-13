import {createStackNavigator} from 'react-navigation-stack';
import {createAppContainer} from 'react-navigation';
import Splash from './Splash'
import LoginRegister from './LoginRegister';
import TabNavigator from './TabNavigator';
import OrderReferee from './OrderReferee';
import OrderPlayer from './OrderPlayer';
import Stadium from './Stadium';
import RefereeList from './RefereeList'
import PlayersList from './PlayersList'
import SearchPlace from './SearchPlace'
import Chat from './Chat'
export const StackNavigator = createStackNavigator ({
  Splash: { screen: Splash},
  LoginRegister: {screen: LoginRegister},
  TabNavigator: {screen: TabNavigator}, 
  OrderReferee: {screen: OrderReferee},
  OrderPlayer: {screen: OrderPlayer},
  Stadium: {screen: Stadium},
  SearchPlace: {screen: SearchPlace},
  RefereeList: {screen: RefereeList},
  PlayersList: {screen: PlayersList},
  Chat: {screen: Chat},
}, {
  initialRouteName: 'Splash',
  headerShown: false,
  gesturesEnabled: false,
  navigationOptions: {
    gesturesEnabled: false
  }
});


const MyStackNavigator = createAppContainer (StackNavigator);
export default MyStackNavigator;
