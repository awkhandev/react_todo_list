import { cx } from '../../../utils/cx';
import { FILTERS } from '../../../utils/todoHelpers';
import { Icon, TextInput } from '../../ui';
import styles from './TodoFilters.module.scss';

const FILTER_OPTIONS = [
  { value: FILTERS.ALL, label: 'All', countKey: 'total' },
  { value: FILTERS.ACTIVE, label: 'Active', countKey: 'active' },
  { value: FILTERS.COMPLETED, label: 'Completed', countKey: 'completed' },
];

export function TodoFilters({ filter, onFilterChange, search, onSearchChange, stats }) {
  return (
    <div className={styles.filters}>
      <div className={styles.tabs} role="group" aria-label="Filter todos">
        {FILTER_OPTIONS.map(({ value, label, countKey }) => (
          <button
            key={value}
            type="button"
            className={cx(styles.tab, filter === value && styles.active)}
            aria-pressed={filter === value}
            onClick={() => onFilterChange(value)}
          >
            {label}
            <span className={styles.count}>{stats[countKey]}</span>
          </button>
        ))}
      </div>
      <TextInput
        label="Search todos"
        hideLabel
        type="search"
        placeholder="Search todos..."
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        icon={<Icon name="search" size={16} />}
        className={styles.search}
      />
    </div>
  );
}
