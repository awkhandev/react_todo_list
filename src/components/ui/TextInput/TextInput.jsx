import { useId } from 'react';
import { cx } from '../../../utils/cx';
import styles from './TextInput.module.scss';

export function TextInput({
  label,
  hideLabel = false,
  error,
  icon,
  className,
  id,
  ...rest
}) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;

  return (
    <div className={cx(styles.field, className)}>
      <label
        htmlFor={inputId}
        className={cx(styles.label, hideLabel && 'visually-hidden')}
      >
        {label}
      </label>
      <div className={styles.control}>
        {icon && (
          <span className={styles.icon} aria-hidden="true">
            {icon}
          </span>
        )}
        <input
          id={inputId}
          className={cx(styles.input, icon && styles.withIcon, error && styles.invalid)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          {...rest}
        />
      </div>
      {error && (
        <p id={errorId} className={styles.error} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
