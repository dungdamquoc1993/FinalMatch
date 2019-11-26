import { combineReducers } from 'redux'
import {navigationReducers} from './navigationReducers'
//1 store has many Reducers
export default combineReducers({navigationReducers})
