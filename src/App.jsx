import React, { useState, useEffect, useContext, createContext } from "react";
import "./App.css";

const CountContext = createContext();

function Counter() {
  // Contextde的数量可以有多个
  // class的解决方案：contextType,consumer
  const count = useContext(CountContext);
  return <h1>{count}</h1>;
}

function App(params) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    document.title = count;
  });
  return (
    <div>
      <button
        onClick={() => {
          setCount(count + 1);
        }}
      >
        click ({count})
      </button>
      <CountContext.Provider value={count}>
        <Counter />
      </CountContext.Provider>
    </div>
  );
}

export default App;
