import { memo, useState } from 'react';
import { cx } from '../../../utils/cx';
import { MAX_TITLE_LENGTH, validateTitle } from '../../../utils/todoHelpers';
import { Button, Checkbox, Icon, TextInput } from '../../ui';
import styles from './TodoItem.module.scss';

function TodoItemComponent({ todo, onToggle, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(todo.title);
  const [error, setError] = useState(null);

  const startEditing = () => {
    setDraft(todo.title);
    setError(null);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setError(null);
  };

  const saveEdit = (event) => {
    event.preventDefault();
    const validationError = validateTitle(draft);
    if (validationError) {
      setError(validationError);
      return;
    }

    const title = draft.trim();
    if (title !== todo.title) onUpdate(todo, { title });
    setIsEditing(false);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') cancelEditing();
  };

  if (isEditing) {
    return (
      <li className={cx(styles.item, styles.editing)}>
        <form className={styles.editForm} onSubmit={saveEdit} noValidate>
          <TextInput
            label={`Edit "${todo.title}"`}
            hideLabel
            value={draft}
            onChange={(event) => {
              setDraft(event.target.value);
              if (error) setError(null);
            }}
            onKeyDown={handleKeyDown}
            maxLength={MAX_TITLE_LENGTH + 1}
            error={error}
            autoFocus
          />
          <div className={styles.actions}>
            <Button type="submit" size="sm">
              Save
            </Button>
            <Button size="sm" variant="secondary" onClick={cancelEditing}>
              Cancel
            </Button>
          </div>
        </form>
      </li>
    );
  }

  return (
    <li className={cx(styles.item, todo.completed && styles.completed)}>
      <Checkbox
        checked={todo.completed}
        onChange={() => onToggle(todo)}
        label={`Mark "${todo.title}" as ${todo.completed ? 'not completed' : 'completed'}`}
      />
      <p className={styles.title} onDoubleClick={startEditing}>
        {todo.title}
      </p>
      <div className={styles.actions}>
        <Button
          variant="ghost"
          size="sm"
          iconOnly
          onClick={startEditing}
          aria-label={`Edit "${todo.title}"`}
          title="Edit"
        >
          <Icon name="edit" size={16} />
        </Button>
        <Button
          variant="danger"
          size="sm"
          iconOnly
          onClick={() => onDelete(todo)}
          aria-label={`Delete "${todo.title}"`}
          title="Delete"
        >
          <Icon name="trash" size={16} />
        </Button>
      </div>
    </li>
  );
}

export const TodoItem = memo(TodoItemComponent);
