// action 对象，type、payload
// store里默认state
export const ACTION_SET_FROM = 'SET_FROM';
export const ACTION_SET_TO = 'SET_TO';
export const ACTION_SET_IS_CITY_SELECTOR_VISIBLE = 'SET_IS_CITY_SELECTOR_VISIBLE';
export const ACTION_SET_CURRENT_SELECTING_LEFT_CITY = 'SET_CURRENT_SELECTING_LEFT_CITY';
export const ACTION_SET_CITY_DATA = 'SET_CITY_DATA';
export const ACTION_SET_IS_LOADING_CITY_DATA = 'SET_IS_LOADING_CITY_DATA';
export const ACTION_SET_IS_DATE_SELECTOR_VISIBLE = 'SET_IS_DATE_SELECTOR_VISIBLE';
export const ACTION_SET_HIGH_SPEED = 'SET_HIGH_SPEED';
export const ACTION_SET_DEPART_DATE = 'SET_DEPART_DATE';


export function setFrom(from) {
  return {
    type: ACTION_SET_FROM,
    payload: from,
  };
}

export function setTo(to) {
  return {
    type: ACTION_SET_TO,
    payload: to,
  };
}

export function setIsLoadingCityData(isLoadingCityData) {
  return {
    type: ACTION_SET_IS_LOADING_CITY_DATA,
    payload: isLoadingCityData,
  };
}

export function setCityData(cityDate) {
  return {
    type: ACTION_SET_CITY_DATA,
    payload: cityDate,
  };
}

// 需要根据当前的值计算出最新的值
// 所以需要用到异步action
export function toggleHighSpeed() {
  return (dispatch, getState) => {
    const { highSpeed } = getState();
    dispatch({
      type: ACTION_SET_HIGH_SPEED,
      payload: !highSpeed,
    });
  };
}

// 城市选择器浮层
// 回填数据
// 两个dispatch也用异步dispatch
export function showCitySelector(currentSelectingLeftCity) {
  return dispatch => {
    dispatch({
      type: ACTION_SET_IS_CITY_SELECTOR_VISIBLE,
      payload: true,
    });

    dispatch({
      type: ACTION_SET_CURRENT_SELECTING_LEFT_CITY,
      payload: currentSelectingLeftCity,
    });
  };
}

export function hideCitySelector() {
  return {
    type: ACTION_SET_IS_CITY_SELECTOR_VISIBLE,
    payload: false,
  };
}


// 日期选择弹层 和 城市选择 一个思路
export function showDateSelector() {
  return {
    type: ACTION_SET_IS_DATE_SELECTOR_VISIBLE,
    payload: true,
  };
}

export function hideDateSelector() {
  return {
    type: ACTION_SET_IS_DATE_SELECTOR_VISIBLE,
    payload: false,
  };
}


// 浮层关闭时，数据回填回来
export function setSelectedCity(city) {
  return (dispatch, getState) => {
    const { currentSelectingLeftCity } = getState();

    if (currentSelectingLeftCity) {
      dispatch(setFrom(city));
    } else {
      dispatch(setTo(city));
    }
    // 强制关闭浮层
    dispatch(hideCitySelector());
  };
}

// 切换to 和 from 位置
export function exchangeFromTo() {
  return (dispatch, getState) => {
    const { from, to } = getState();
    dispatch(setFrom(to));
    dispatch(setTo(from));
  };
}

export function setDepartDate(departDate) {
  return {
    type: ACTION_SET_DEPART_DATE,
    payload: departDate,
  };
}

export function fetchCityData() {
  return (dispatch, getState) => {
    const { isLoadingCityData } = getState();
    if (isLoadingCityData) {
      return;
    }

    const cache = JSON.parse(
      localStorage.getItem('city_data_cache') || '{}'
    );
    
    if (Date.now() < cache.expires) {
      dispatch(setCityData(cache.data));
      return;
    }

    dispatch(setIsLoadingCityData(true));

    fetch('/rest/cities?_' + Date.now())
      .then(res => res.json())
      .then(cityData => {
        dispatch(setCityData(cityData));
        // 数据本身不会太大变化
        localStorage.setItem(
          'city_data_cache',
          JSON.stringify({
            expires: Date.now() + 60 * 1000,
            data: cityData,
          })
        );

        dispatch(setIsLoadingCityData(false));
      })
      .catch(() => {
        dispatch(setIsLoadingCityData(false));
      });
  }
}