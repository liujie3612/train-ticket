import React, { createContext, Component } from "react";
import "./App.css";

// 默认值
const BatteryContent = createContext();
const OnlineContent = createContext();

class Leaf extends Component {
  render() {
    // Consumer也是嵌套
    return (
      <BatteryContent.Consumer>
        {(battery) => (
          <OnlineContent.Consumer>
            {(online) => (
              <h1>
                Battery: {battery}, Online: {String(online)}
              </h1>
            )}
          </OnlineContent.Consumer>
        )}
      </BatteryContent.Consumer>
    );
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
        <OnlineContent.Provider value={online}>
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
        </OnlineContent.Provider>
      </BatteryContent.Provider>
    );
  }
}

export default App;
