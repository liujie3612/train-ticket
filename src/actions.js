export function createSet(payload) {
  return {
    type: 'set',
    payload
  }
}

let idSep = Date.now();

export function createAdd(text) {
  return (dispatch, state) => {
    const { todos } = state
    if (!todos.find(todo => todo.text === text)) {
      dispatch({
        type: 'add',
        payload: {
          id: ++idSep,
          text,
          complete: false
        }
      })
    }
  }
}

export function createRomove(payload) {
  return {
    type: 'remove',
    payload
  }
}

export function createToggle(payload) {
  return {
    type: 'toggle',
    payload
  }
}