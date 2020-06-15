import React, { Component, PureComponent, memo } from "react";
import "./App.css";

// class Foo extends PureComponent {
//   render() {
//     console.log("foo render");
//     return <div>{this.props.person.age}</div>;
//   }
// }

const Foo = memo(function Foo(props) {
  console.log("foo render");
  return <div>{props.person.age}</div>;
});

class App extends Component {
  state = {
    count: 0,
    person: {
      age: 1,
    },
  };

  //这样就能绑定this，也能避免Foo重新渲染
  callback = () => {};

  render() {
    const person = this.state.person;
    return (
      <div>
        <button
          onClick={() => {
            person.age++;
            this.setState({
              count: this.state.count + 1,
            });
          }}
        >
          press
        </button>
        <Foo person={person} cb={this.callback}></Foo>
      </div>
    );
  }
}

export default App;
