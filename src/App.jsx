import React, { createContext, Component } from "react";
import "./App.css";

// 默认值
const BatteryContent = createContext(90);
// const OnlineContent = createContext();

class Leaf extends Component {
  static contextType = BatteryContent;
  render() {
    // Consumer也是嵌套
    const battery = this.context;
    return <h1>{battery}</h1>;
  }
}

class Middle extends Component {
  render() {
    return <Leaf />;
  }
}

class App extends Component {
  state = {
    battery: 60,
    online: false,
  };

  // Provider嵌套
  render() {
    const { battery, online } = this.state;
    return (
      <BatteryContent.Provider value={battery}>
        <button
          type="button"
          onClick={() => this.setState({ battery: battery - 1 })}
        >
          press
        </button>
        <button
          type="button"
          onClick={() => this.setState({ online: !online })}
        >
          switch
        </button>
        <Middle />
      </BatteryContent.Provider>
    );
  }
}

export default App;
