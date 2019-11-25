
import {getStackNavigation, getTabNavigation} from '../actions/actions'
import {ACTION_GET_STACK_NAVIGATION, ACTION_GET_TAB_NAVIGATION} from '../actions/actionTypes'
const INITIAL_STATE = {
    stackNavigation: null,
    tabNavigation: null
}
export const navigationReducers = (state = INITIAL_STATE, action) => {       
    switch(action.type) {
        case ACTION_GET_STACK_NAVIGATION: 
            debugger
            return {...state, stackNavigation: action.stackNavigation}
        case ACTION_GET_TAB_NAVIGATION:
            debugger 
            return {...state, tabNavigation: action.tabNavigation}
        default: return state
    }
}