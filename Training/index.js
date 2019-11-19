/**
 * @format
 */

import {AppRegistry} from 'react-native';
// import App from './App';
import LoginRegister from './components/LoginRegister'
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => LoginRegister);
