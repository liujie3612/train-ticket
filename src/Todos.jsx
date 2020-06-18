import React, { useState, useRef, useCallback, useEffect, memo } from "react";
import "./App.css";
import { createSet, createAdd, createRomove, createToggle } from "./actions";
import reducer from "./reducers";

// 1. addTodo removeTodo toggleTodo封装成一个函数dispath，
// 2. 函数统一，只有参数为action不一样, 由type和payload组成，这样就把创建action的行为封装成函数，叫做actionCreate
// 3. actionCreate还是需要给dispatch调用，这样就把actionCreate和dispatch打包到一起，叫做bindActionCreators

function bindActionCreators(actionCreators, dispatch) {
  const ret = {};
  for (let key in actionCreators) {
    ret[key] = function (...args) {
      // actionCreator 就是 createSet, createAdd, createRomove, createToggle
      const actionCreator = actionCreators[key];
      // actionCreator执行完之后，返回 {type: xxx, payload}这样的对象,就是action
      const action = actionCreator(...args);
      dispatch(action);
    };
  }
  return ret;
}

const Control = memo(function Control(props) {
  // const { dispatch } = props;
  const { addTodo } = props;
  const inputRef = useRef();

  const onSubmit = (e) => {
    e.preventDefault();
    const newText = inputRef.current.value.trim();
    if (newText.length === 0) {
      return;
    }
    // dispatch(
    //   createAdd({
    //     id: ++idSep,
    //     text: newText,
    //     complete: false,
    //   })
    // );

    // 具备了addTodo和dispatch的双重功能
    addTodo(newText);
    inputRef.current.value = "";
  };
  return (
    <div className="control">
      <h1>todos</h1>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          className="new-todo"
          placeholder="what needs to be done?"
          ref={inputRef}
        />
      </form>
    </div>
  );
});

const TodoItem = memo(function TodoItem(props) {
  const {
    todo: { id, text, complete },
    removeTodo,
    toggleTodo,
  } = props;
  const onChange = () => {
    toggleTodo(id);
  };
  const onRemove = () => {
    removeTodo(id);
  };
  return (
    <li className="todo-item">
      <input type="checkbox" onChange={onChange} checked={complete} />
      <label className={complete ? "complete" : ""}>{text}</label>
      <button onClick={onRemove}>&#xd7;</button>
    </li>
  );
});

const Todos = memo(function Todos(props) {
  const { todos, removeTodo, toggleTodo } = props;
  return (
    <div>
      <ul>
        {todos.map((todo) => {
          return (
            <TodoItem
              todo={todo}
              key={todo.id}
              removeTodo={removeTodo}
              toggleTodo={toggleTodo}
            ></TodoItem>
          );
        })}
      </ul>
    </div>
  );
});

const LS_KEY = "LS_KEY";

let store = {
  todos: [],
  incrementCount: 0,
};

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [incrementCount, setIncrementCount] = useState(0);

  useEffect(() => {
    Object.assign(store, {
      todos,
      incrementCount,
    });
  }, [todos, incrementCount]);

  const dispatch = (action) => {
    // 之前的全部全是根据type调用setTodos和setIncrementCount函数
    const setters = {
      todos: setTodos,
      incrementCount: setIncrementCount,
    };

    if ("function" === typeof action) {
      action(dispatch, () => store);
      return;
    }

    const newState = reducer(store, action);

    // * newState只是根据不同的type返回的对应的state *
    // * 返回的值直接用setters的set方法直接进行设值 *

    for (let key in newState) {
      setters[key](newState[key]);
    }
  };

  useEffect(() => {
    const todos = JSON.parse(localStorage.getItem(LS_KEY));
    const { setTodo } = {
      ...bindActionCreators({ setTodo: createSet }, dispatch),
    };
    setTodo(todos);
  }, []);

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(todos));
  }, [todos]);

  return (
    <div className="todos-list">
      <Control {...bindActionCreators({ addTodo: createAdd }, dispatch)} />
      <Todos
        {...bindActionCreators(
          {
            removeTodo: createRomove,
            toggleTodo: createToggle,
          },
          dispatch
        )}
        todos={todos}
      />
    </div>
  );
}

export default TodoList;
