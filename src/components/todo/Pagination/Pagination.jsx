import { cx } from '../../../utils/cx';
import { Button, Icon } from '../../ui';
import styles from './Pagination.module.scss';

// Always shows the first and last page plus a window around the current one,
// e.g. 1 … 4 5 6 … 20.
function getPageItems(current, total, siblings = 1) {
  const pages = new Set([1, total]);
  for (let page = current - siblings; page <= current + siblings; page += 1) {
    if (page > 1 && page < total) pages.add(page);
  }

  const sorted = [...pages].sort((a, b) => a - b);
  return sorted.flatMap((page, i) =>
    i > 0 && page - sorted[i - 1] > 1 ? [`gap-${page}`, page] : [page],
  );
}

export function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <nav className={styles.pagination} aria-label="Pagination">
      <Button
        variant="secondary"
        size="sm"
        iconOnly
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        aria-label="Previous page"
      >
        <Icon name="chevronLeft" size={16} />
      </Button>

      <ul className={styles.pages}>
        {getPageItems(page, totalPages).map((item) =>
          typeof item === 'string' ? (
            <li key={item} className={styles.gap} aria-hidden="true">
              &hellip;
            </li>
          ) : (
            <li key={item}>
              <button
                type="button"
                className={cx(styles.page, item === page && styles.current)}
                onClick={() => onPageChange(item)}
                aria-label={`Page ${item}`}
                aria-current={item === page ? 'page' : undefined}
              >
                {item}
              </button>
            </li>
          ),
        )}
      </ul>

      <Button
        variant="secondary"
        size="sm"
        iconOnly
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        aria-label="Next page"
      >
        <Icon name="chevronRight" size={16} />
      </Button>
    </nav>
  );
}
