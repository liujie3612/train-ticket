import React, {
  useState,
  useMemo,
  memo,
  useCallback,
  useRef,
  PureComponent,
  useEffect,
} from "react";
import "./App.css";

// const CountContext = createContext();

// function Counter() {
//   // Contextde的数量可以有多个
//   // class的解决方案：contextType,consumer
//   const count = useContext(CountContext);
//   return <h1>{count}</h1>;
// }

// const Counter = memo(function Counter(props) {
//   console.log("count render");
//   return <h1 onClick={props.onClick}>{props.count}</h1>;
// });

// 函数组件不能被ref获取，只有类组件才能实例化，函数组件不能完全替代类组件

class Counter extends PureComponent {
  speak() {
    console.log("呱呱");
  }
  render() {
    const { props } = this;
    return <h1 onClick={props.onClick}>{props.count}</h1>;
  }
}

function App(params) {
  const [count, setCount] = useState(0);
  const [clickCount, setClickCount] = useState(0);
  const counterRef = useRef();
  // 渲染期间执行，有返回值，effect有副作用，所以在渲染后执行
  // count === 3 1、2不变，3为true，重新计算，4为false，重新计算，以后都是不变
  // useMemo 可以依赖另外一个依赖
  const double = useMemo(() => {
    return count * 2;
  }, [count === 3]);

  // ref的使用情景：
  // 获取dom和子组件
  // 获取不用渲染周期需要共享的数据
  const it = useRef();

  // const onClick = () => {
  //   console.log("click");
  // };
  // const onClick = useMemo(() => {
  //   return () => {
  //     console.log("click");
  //   };
  // }, []);

  // 如果useMemo返回的是函数，那么用useCallback可以省略顶层的函数
  // useCallback是useMemo的变种，useCallback解决的是传入子组件的参数过多变化，导致子组件过多渲染的问题
  const onClick = useCallback(() => {
    console.log("click");
    // clickCount作为依赖数组的情况
    // setClickCount(clickCount + 1);

    // 不需要clickCount作为依赖数组的情况
    setClickCount((clickCount) => clickCount + 1);
    console.log(counterRef.current);

    // 组件上有函数成员要调用
    counterRef.current.speak();
  }, [counterRef]);

  // 依赖变化，useMemo一定重新执行；但是依赖不变化，useMemo也可能会重新执行，考虑内存优化的结果，作为优化锦上添花的手段

  useEffect(() => {
    it.current = setInterval(() => {
      setCount((count) => count + 1);
    }, 1000);
  }, []);

  useEffect(() => {
    if (count >= 10) {
      clearInterval(it.current);
    }
  });

  return (
    <div>
      <button
        onClick={() => {
          setCount(count + 1);
        }}
      >
        click ({count}),double ({double})
      </button>
      <Counter ref={counterRef} count={double} onClick={onClick} />
    </div>
  );
}

export default App;
