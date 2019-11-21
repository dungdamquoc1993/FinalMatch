/**
 * @format
 */

import {AppRegistry} from 'react-native';
//import App from './App';
//import LoginRegister from './components/LoginRegister';
import {name as appName} from './app.json';
import ServiceRegister from './components/ServiceRegister';

AppRegistry.registerComponent(appName, () => ServiceRegister);
 