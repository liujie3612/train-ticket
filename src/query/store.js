import { createStore, combineReducers, applyMiddleware } from 'redux';
import reducers from './reducers';
import thunk from 'redux-thunk'; //异步action

import { h0 } from '../common/fp';
import { ORDER_DEPART } from './constant';

export default createStore(
  combineReducers(reducers),
  // state的默认值
  {
    from: null,
    to: null,
    departDate: h0(Date.now()), // 出发日期
    highSpeed: false, // 是否选择高铁动车
    trainList: [], //最大的列表
    orderType: ORDER_DEPART, // 枚举值
    onlyTickets: false, // 只看有票
    ticketTypes: [], //综合筛选浮层
    checkedTicketTypes: {}, //选中的
    trainTypes: [], // 车次类型
    checkedTrainTypes: {}, // 
    departStations: [], // 出发车站
    checkedDepartStations: {}, // 
    arriveStations: [], // 到达车站
    checkedArriveStations: {},
    departTimeStart: 0, // 出发时间
    departTimeEnd: 24, // 出发时间的截止
    arriveTimeStart: 0, // 到达时间
    arriveTimeEnd: 24,
    isFiltersVisible: false, // 浮层的隐藏控制
    searchParsed: false, // 已经解析完成
  },
  applyMiddleware(thunk)
);