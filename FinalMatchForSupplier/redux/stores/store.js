import { createStore } from 'redux'
import rootReducer from '../reducers/rootReducer'
//1 store has 1 "root reducer" => N reducers
export const store = createStore(rootReducer)
