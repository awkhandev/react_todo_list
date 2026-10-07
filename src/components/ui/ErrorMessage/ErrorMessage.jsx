import { Button } from '../Button/Button';
import { Icon } from '../Icon/Icon';
import styles from './ErrorMessage.module.scss';

export function ErrorMessage({ message, onRetry, onDismiss }) {
  return (
    <div className={styles.error} role="alert">
      <Icon name="alert" className={styles.icon} />
      <p className={styles.message}>{message}</p>
      {onRetry && (
        <Button size="sm" variant="secondary" onClick={onRetry}>
          Retry
        </Button>
      )}
      {onDismiss && (
        <Button
          size="sm"
          variant="ghost"
          iconOnly
          onClick={onDismiss}
          aria-label="Dismiss message"
        >
          <Icon name="close" size={16} />
        </Button>
      )}
    </div>
  );
}
