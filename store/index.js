import { createStore, combineReducers, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { createLogger } from "redux-logger";
import crosswordReducer from "./crossword";
import user from "./user";

const reducer = combineReducers({
  crossword: crosswordReducer,
  user: user
});
const middleware = composeWithDevTools(
  applyMiddleware(thunkMiddleware, createLogger({ collapsed: true }))
);
const store = createStore(reducer, middleware);

export default store;

// This export is from GraceShopper boilermaker - would like to know whether/why this is necessary
export * from "./user";
