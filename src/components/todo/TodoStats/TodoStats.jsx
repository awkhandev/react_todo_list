import { Button } from '../../ui';
import styles from './TodoStats.module.scss';

export function TodoStats({ stats, onClearCompleted }) {
  const progress = stats.total === 0 ? 0 : Math.round((stats.completed / stats.total) * 100);

  return (
    <div className={styles.stats}>
      <div className={styles.summary}>
        <p className={styles.text}>
          <strong>{stats.active}</strong> {stats.active === 1 ? 'task' : 'tasks'} left
          <span className={styles.separator} aria-hidden="true">
            &middot;
          </span>
          {progress}% done
        </p>
        <div
          className={styles.progress}
          role="progressbar"
          aria-label="Completed tasks"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <span className={styles.bar} style={{ width: `${progress}%` }} />
        </div>
      </div>
      <Button
        variant="secondary"
        size="sm"
        onClick={onClearCompleted}
        disabled={stats.completed === 0}
      >
        Clear completed
      </Button>
    </div>
  );
}
