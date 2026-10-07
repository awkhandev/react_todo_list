export const ACTIONS = {
  FETCH_START: 'FETCH_START',
  FETCH_SUCCESS: 'FETCH_SUCCESS',
  FETCH_ERROR: 'FETCH_ERROR',
  ADD: 'ADD',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  CLEAR_COMPLETED: 'CLEAR_COMPLETED',
  ROLLBACK: 'ROLLBACK',
  SET_NOTICE: 'SET_NOTICE',
  CLEAR_NOTICE: 'CLEAR_NOTICE',
};

export const initialState = {
  todos: [],
  status: 'loading',
  error: null,
  notice: null,
};

function insertAt(list, index, item) {
  const next = [...list];
  next.splice(Math.min(index, next.length), 0, item);
  return next;
}

export function todoReducer(state, action) {
  switch (action.type) {
    case ACTIONS.FETCH_START:
      return { ...state, status: 'loading', error: null };

    case ACTIONS.FETCH_SUCCESS:
      return { ...state, status: 'success', todos: action.payload };

    case ACTIONS.FETCH_ERROR:
      return { ...state, status: 'error', error: action.payload };

    case ACTIONS.ADD:
      return { ...state, todos: [action.payload, ...state.todos] };

    case ACTIONS.UPDATE: {
      const { id, changes } = action.payload;
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === id ? { ...todo, ...changes } : todo,
        ),
      };
    }

    case ACTIONS.DELETE:
      return {
        ...state,
        todos: state.todos.filter((todo) => todo.id !== action.payload),
      };

    case ACTIONS.CLEAR_COMPLETED:
      return {
        ...state,
        todos: state.todos.filter((todo) => !todo.completed),
      };

    // Re-inserts removed todos at their original positions. Entries must be
    // sorted by ascending index so earlier inserts don't shift later ones.
    case ACTIONS.ROLLBACK:
      return {
        ...state,
        todos: action.payload.reduce(
          (list, { index, todo }) => insertAt(list, index, todo),
          state.todos,
        ),
      };

    case ACTIONS.SET_NOTICE:
      return { ...state, notice: action.payload };

    case ACTIONS.CLEAR_NOTICE:
      return { ...state, notice: null };

    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
}
