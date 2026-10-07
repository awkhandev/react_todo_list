import { Icon } from '../Icon/Icon';
import styles from './Checkbox.module.scss';

export function Checkbox({ checked, onChange, label, ...rest }) {
  return (
    <label className={styles.wrapper}>
      <input
        type="checkbox"
        className={styles.input}
        checked={checked}
        onChange={onChange}
        {...rest}
      />
      <span className={styles.box} aria-hidden="true">
        <Icon name="check" size={14} />
      </span>
      <span className="visually-hidden">{label}</span>
    </label>
  );
}
