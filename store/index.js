import { createStore, combineReducers } from "redux";
import crosswordReducer from "./crossword";

const reducer = combineReducers({
  crossword: crosswordReducer
});

const store = createStore(reducer);

export default store;
