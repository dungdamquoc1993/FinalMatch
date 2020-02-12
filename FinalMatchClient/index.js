/**
 * @format
 * Cai dat trong ios
 * cd ios
 * rm -rf Pods
 * rm -rf Podfile.lock
 * pod install
 * yarn add @react-native-community/async-storage @react-native-community/geolocation axios react-native-date-picker react-native-fbsdk react-native-geolocation-service react-native-gesture-handler react-native-image-crop-picker react-native-linear-gradient react-native-modal react-native-modals react-native-reanimated react-native-vector-icons react-navigation react-navigation-stack react-navigation-tabs
 * yarn add react-native-safe-area-context @react-native-community/masked-view
 * yarn add react-native-localize
 * npx react-native link react-native-localize
 * yarn add i18n-js
 * yarn add lodash.memoize
 * yarn add react-native-searchable-dropdown
 * yarn add react-native-date-picker
 * import DatePicker from 'react-native-date-picker'
 * 
 */
import {AppRegistry} from 'react-native';
//import App from './App';
import {name as appName} from './app.json';


//import SwitchNavigator from './components/SwitchNavigator'
import StackNavigator from './components/StackNavigator'
AppRegistry.registerComponent(appName, () => StackNavigator)
 
