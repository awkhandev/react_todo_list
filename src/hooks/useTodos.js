import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react';
import * as todoApi from '../api/todoApi';
import { ACTIONS, initialState, todoReducer } from '../context/todoReducer';

// JSONPlaceholder only knows about ids 1-200 and never persists new todos,
// so todos created in the app are flagged `isLocal` and never PATCHed/DELETEd
// on the server (it would answer 404 / 500).
function createLocalTodo(title) {
  return {
    id: `local-${crypto.randomUUID()}`,
    userId: 1,
    title,
    completed: false,
    isLocal: true,
  };
}

export function useTodos() {
  const [state, dispatch] = useReducer(todoReducer, initialState);

  // Lets stable callbacks read the latest list without re-creating themselves
  // on every change (which would defeat React.memo on TodoItem).
  const todosRef = useRef(state.todos);
  useEffect(() => {
    todosRef.current = state.todos;
  }, [state.todos]);

  const notify = useCallback((message) => {
    dispatch({ type: ACTIONS.SET_NOTICE, payload: message });
  }, []);

  const loadTodos = useCallback(async (signal) => {
    try {
      const data = await todoApi.fetchTodos({ signal });
      dispatch({ type: ACTIONS.FETCH_SUCCESS, payload: data });
    } catch (error) {
      if (error.name === 'AbortError') return;
      dispatch({ type: ACTIONS.FETCH_ERROR, payload: error.message });
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    loadTodos(controller.signal);
    return () => controller.abort();
  }, [loadTodos]);

  const retry = useCallback(() => {
    dispatch({ type: ACTIONS.FETCH_START });
    loadTodos();
  }, [loadTodos]);

  const addTodo = useCallback(
    async (title) => {
      const todo = createLocalTodo(title);
      dispatch({ type: ACTIONS.ADD, payload: todo });

      try {
        await todoApi.createTodo({
          title: todo.title,
          completed: todo.completed,
          userId: todo.userId,
        });
      } catch {
        dispatch({ type: ACTIONS.DELETE, payload: todo.id });
        notify(`Could not add "${title}". Please try again.`);
      }
    },
    [notify],
  );

  const updateTodo = useCallback(
    async (todo, changes) => {
      const previous = Object.fromEntries(
        Object.keys(changes).map((key) => [key, todo[key]]),
      );
      dispatch({ type: ACTIONS.UPDATE, payload: { id: todo.id, changes } });

      if (todo.isLocal) return;

      try {
        await todoApi.updateTodo(todo.id, changes);
      } catch {
        dispatch({
          type: ACTIONS.UPDATE,
          payload: { id: todo.id, changes: previous },
        });
        notify(`Could not update "${todo.title}". Changes were reverted.`);
      }
    },
    [notify],
  );

  const toggleTodo = useCallback(
    (todo) => updateTodo(todo, { completed: !todo.completed }),
    [updateTodo],
  );

  const deleteTodo = useCallback(
    async (todo) => {
      const index = todosRef.current.findIndex((item) => item.id === todo.id);
      dispatch({ type: ACTIONS.DELETE, payload: todo.id });

      if (todo.isLocal) return;

      try {
        await todoApi.deleteTodo(todo.id);
      } catch {
        dispatch({ type: ACTIONS.ROLLBACK, payload: [{ index, todo }] });
        notify(`Could not delete "${todo.title}". It has been restored.`);
      }
    },
    [notify],
  );

  const clearCompleted = useCallback(async () => {
    const removed = todosRef.current
      .map((todo, index) => ({ todo, index }))
      .filter(({ todo }) => todo.completed);

    if (removed.length === 0) return;
    dispatch({ type: ACTIONS.CLEAR_COMPLETED });

    const results = await Promise.allSettled(
      removed.map(({ todo }) =>
        todo.isLocal ? Promise.resolve() : todoApi.deleteTodo(todo.id),
      ),
    );

    const failed = removed.filter((_, i) => results[i].status === 'rejected');
    if (failed.length > 0) {
      dispatch({ type: ACTIONS.ROLLBACK, payload: failed });
      notify(`${failed.length} completed todo(s) could not be removed.`);
    }
  }, [notify]);

  const dismissNotice = useCallback(() => {
    dispatch({ type: ACTIONS.CLEAR_NOTICE });
  }, []);

  return useMemo(
    () => ({
      ...state,
      retry,
      addTodo,
      updateTodo,
      toggleTodo,
      deleteTodo,
      clearCompleted,
      dismissNotice,
    }),
    [
      state,
      retry,
      addTodo,
      updateTodo,
      toggleTodo,
      deleteTodo,
      clearCompleted,
      dismissNotice,
    ],
  );
}
