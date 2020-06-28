import { createStore, combineReducers, applyMiddleware } from 'redux';
import reducers from './reducers';
import thunk from 'redux-thunk'; //异步action

export default createStore(
  combineReducers(reducers),
  // state的默认值
  {},
  applyMiddleware(thunk)
);