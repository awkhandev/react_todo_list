import { cx } from '../../../utils/cx';
import styles from './Button.module.scss';

export function Button({
  variant = 'primary',
  size = 'md',
  iconOnly = false,
  type = 'button',
  className,
  children,
  ...rest
}) {
  return (
    <button
      type={type}
      className={cx(
        styles.button,
        styles[variant],
        styles[size],
        iconOnly && styles.iconOnly,
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
