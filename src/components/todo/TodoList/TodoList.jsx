import { TodoItem } from '../TodoItem/TodoItem';
import styles from './TodoList.module.scss';

export function TodoList({ todos, onToggle, onUpdate, onDelete }) {
  return (
    <ul className={styles.list} aria-label="Todo list">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
