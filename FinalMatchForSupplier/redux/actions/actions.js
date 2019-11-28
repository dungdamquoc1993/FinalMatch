import {ACTION_GET_STACK_NAVIGATION, ACTION_GET_TAB_NAVIGATION} from './actionTypes'
//action is a function
export const getStackNavigation = (stackNavigation) => ({
    type: ACTION_GET_STACK_NAVIGATION,//action's name
    stackNavigation
})
export const getTabNavigation = (tabNavigation) => ({
    type: ACTION_GET_TAB_NAVIGATION,
    tabNavigation
})