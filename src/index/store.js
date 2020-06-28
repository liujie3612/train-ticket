import { createStore, combineReducers, applyMiddleware } from 'redux';
import reducers from './reducers';
import thunk from 'redux-thunk'; //异步action

export default createStore(
  combineReducers(reducers),
  // state的默认值
  {
    from: '北京',
    to: '上海',
    isCitySelectorVisible: false, // 城市选择浮层的开关
    currentSelectingLeftCity: false,
    cityData: null, // 按需加载
    isLoadingCityData: false,
    isDateSelectorVisible: false, //日期选择浮层的开关
    departDate: Date.now(),
    highSpeed: false,
  },
  applyMiddleware(thunk)
);