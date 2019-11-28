
import {getStackNavigation, getTabNavigation} from '../actions/actions'
import {ACTION_GET_STACK_NAVIGATION, ACTION_GET_TAB_NAVIGATION} from '../actions/actionTypes'
//1 reducer = 1 "global object" = 1 "shared state" = file reducer
const INITIAL_STATE = {
    stackNavigation: null,
    tabNavigation: null
}
export const navigationReducers = (state = INITIAL_STATE, action) => {       
    //1 reducer has many actions
    switch(action.type) {
        case ACTION_GET_STACK_NAVIGATION: 
            return {...state, stackNavigation: action.stackNavigation}
        case ACTION_GET_TAB_NAVIGATION:
            return {...state, tabNavigation: action.tabNavigation}
        default: return state
    }
}


