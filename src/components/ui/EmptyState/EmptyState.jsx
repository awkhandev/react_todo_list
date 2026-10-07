import { Icon } from '../Icon/Icon';
import styles from './EmptyState.module.scss';

export function EmptyState({ title, description, icon = 'clipboard' }) {
  return (
    <div className={styles.empty}>
      <Icon name={icon} size={40} className={styles.icon} />
      <p className={styles.title}>{title}</p>
      {description && <p className={styles.description}>{description}</p>}
    </div>
  );
}
