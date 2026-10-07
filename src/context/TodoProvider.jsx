import { useTodos } from '../hooks/useTodos';
import { TodoContext } from './TodoContext';

export function TodoProvider({ children }) {
  const value = useTodos();
  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
}
