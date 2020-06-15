import React, { Component, lazy, Suspense } from "react";
import "./App.css";

// 自定义命名
const About = lazy(() => import(/* webpackChunkName:"about" */ "./About.jsx"));

export default class App extends Component {
  state = {
    hasError: false,
  };

  // componentDidCatch() {
  //   this.setState({
  //     hasError: true,
  //   });
  // }

  static getDerivedStateFromError() {
    return {
      hasError: true,
    };
  }

  render() {
    if (this.state.hasError) {
      return <div>error</div>;
    }
    return (
      <div>
        <Suspense fallback={<div>loading</div>}>
          <About></About>
        </Suspense>
      </div>
    );
  }
}
