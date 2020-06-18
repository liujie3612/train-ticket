  
    // 以数据为维度处理，数据的更新逻辑 state:全部数据
const reducers = {
    todos(state, action) {
      const { type, payload } = action;
      switch (type) {
      case "set":
        return payload;
      case "add":
        return [...state, payload];
      case "remove":
        return state.filter((todo) => {
          return todo.id !== payload;
        });
      case "toggle":
        return state.map((todo) => {
          return todo.id === payload ?
            {
              ...todo,
              complete: !todo.complete,
            } :
            todo;
        });
      default:
      }
      return state;
    },
    incrementCount(state, action) {
      const { type } = action;
      switch (type) {
      case "set":
      case "add":
        return state + 1;
      default:
        break;
      }
      return state;
    },
  };

  // dispath接收的是总的reducer，所以需要进行一次转换
  // 把reducers对象转化为reducer函数
  function combineReducers(reducers) {
    return function reducer(state, action) {
      const changed = {};
      for (let key in reducers) {
        changed[key] = reducers[key](state[key], action);
      }
      return {
        ...state,
        ...changed,
      };
    };
  }

export default combineReducers(reducers);