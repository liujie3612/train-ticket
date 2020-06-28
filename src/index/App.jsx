import React, { useCallback, useMemo } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import "./App.css";
import Header from "../common/Header.jsx";
import Journey from "./Journey.jsx";
import HighSpeed from "./HighSpeed.jsx";
import DepartDate from "./DepartDate.jsx";
import Submit from "./Submit.jsx";

import CitySelector from "../common/CitySelector.jsx";
import DateSelector from "../common/DateSelector.jsx";

import { h0 } from "../common/fp";

// action creater,返回的是纯对象的action,需要把返回值传递给dispatch
import {
  exchangeFromTo,
  showCitySelector,
  hideCitySelector,
  fetchCityData,
  setSelectedCity,
  showDateSelector,
  hideDateSelector,
  setDepartDate,
  toggleHighSpeed,
} from "./actions";

function App(props) {
  const {
    dispatch,
    from,
    to,
    isCitySelectorVisible,
    isDateSelectorVisible,
    isLoadingCityData,
    cityData,
    departDate,
    highSpeed,
  } = props;

  // 向子组件传入callback函数，onBack每次都是新的句柄，Header组件就会一直渲染，所以用useCallback
  // App每次渲染，onBack都是同一个句柄
  const onBack = useCallback(() => {
    window.history.back();
  }, []);

  // bindActionCreator：将ActionCreator 和 dispatch绑定在一起，但是bindActionCreator每次返回的是新的函数集合，和useCallback的目标冲突
  // 触发了action
  const cbs = useMemo(() => {
    return bindActionCreators(
      {
        exchangeFromTo,
        showCitySelector,
      },
      dispatch
    );
  }, [dispatch]);

  const citySelectorCbs = useMemo(() => {
    return bindActionCreators(
      {
        onBack: hideCitySelector,
        fetchCityData,
        onSelect: setSelectedCity,
      },
      dispatch
    );
  }, [dispatch]);

  const departDateCbs = useMemo(() => {
    return bindActionCreators(
      {
        onClick: showDateSelector,
      },
      dispatch
    );
  }, [dispatch]);

  const dateSelectorCbs = useMemo(() => {
    return bindActionCreators(
      {
        onBack: hideDateSelector,
      },
      dispatch
    );
  }, [dispatch]);

  const highSpeedCbs = useMemo(() => {
    return bindActionCreators(
      {
        toggle: toggleHighSpeed,
      },
      dispatch
    );
  }, [dispatch]);

  const onSelectDate = useCallback(
    (day) => {
      if (!day) {
        return;
      }

      if (day < h0()) {
        return;
      }

      dispatch(setDepartDate(day));
      dispatch(hideDateSelector());
    },
    [dispatch]
  );

  return (
    <div>
      <div className="header-wrapper">
        <Header title="火车票" onBack={onBack} />
      </div>

      <form className="form" action="./query.html">
        <Journey from={from} to={to} {...cbs} />
        <DepartDate time={departDate} {...departDateCbs} />
        <HighSpeed highSpeed={highSpeed} {...highSpeedCbs} />
        <Submit />
      </form>

      <CitySelector
        show={isCitySelectorVisible}
        cityData={cityData}
        isLoading={isLoadingCityData}
        {...citySelectorCbs}
      />
      <DateSelector
        show={isDateSelectorVisible}
        {...dateSelectorCbs}
        onSelect={onSelectDate}
      />
    </div>
  );
}

// 被connect包装后的新组件
export default connect(
  function mapStateToProps(state) {
    return state;
  },
  function mapDispatchToProps(dispatch) {
    return { dispatch };
  }
)(App);
