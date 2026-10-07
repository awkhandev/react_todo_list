import { useState } from 'react';
import { MAX_TITLE_LENGTH, validateTitle } from '../../../utils/todoHelpers';
import { Button, Icon, TextInput } from '../../ui';
import styles from './TodoForm.module.scss';

export function TodoForm({ onAdd }) {
  const [title, setTitle] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationError = validateTitle(title);
    if (validationError) {
      setError(validationError);
      return;
    }
    onAdd(title.trim());
    setTitle('');
  };

  const handleChange = (event) => {
    setTitle(event.target.value);
    if (error) setError(null);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <TextInput
        label="New task"
        hideLabel
        placeholder="What needs to be done?"
        value={title}
        onChange={handleChange}
        maxLength={MAX_TITLE_LENGTH + 1}
        error={error}
        autoComplete="off"
      />
      <Button type="submit" className={styles.submit}>
        <Icon name="plus" />
        Add
      </Button>
    </form>
  );
}
