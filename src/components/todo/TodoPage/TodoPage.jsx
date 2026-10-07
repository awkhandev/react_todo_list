import { useCallback, useMemo, useState } from 'react';
import { useDebounce } from '../../../hooks/useDebounce';
import { useTodoContext } from '../../../hooks/useTodoContext';
import {
  FILTERS,
  PAGE_SIZE,
  filterTodos,
  getStats,
  paginate,
} from '../../../utils/todoHelpers';
import { EmptyState, ErrorMessage, Loader } from '../../ui';
import { Header } from '../Header/Header';
import { Pagination } from '../Pagination/Pagination';
import { TodoFilters } from '../TodoFilters/TodoFilters';
import { TodoForm } from '../TodoForm/TodoForm';
import { TodoList } from '../TodoList/TodoList';
import { TodoStats } from '../TodoStats/TodoStats';
import styles from './TodoPage.module.scss';

const EMPTY_MESSAGES = {
  [FILTERS.ALL]: 'Nothing to do yet. Add your first task above.',
  [FILTERS.ACTIVE]: 'No active tasks. Nice work!',
  [FILTERS.COMPLETED]: 'No completed tasks yet.',
};

export function TodoPage() {
  const {
    todos,
    status,
    error,
    notice,
    retry,
    addTodo,
    updateTodo,
    toggleTodo,
    deleteTodo,
    clearCompleted,
    dismissNotice,
  } = useTodoContext();

  const [filter, setFilter] = useState(FILTERS.ALL);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search);

  const stats = useMemo(() => getStats(todos), [todos]);

  const filteredTodos = useMemo(
    () => filterTodos(todos, filter, debouncedSearch),
    [todos, filter, debouncedSearch],
  );

  const totalPages = Math.max(1, Math.ceil(filteredTodos.length / PAGE_SIZE));
  // Deleting the last item on the last page would otherwise leave us on an empty page.
  const currentPage = Math.min(page, totalPages);

  const visibleTodos = useMemo(
    () => paginate(filteredTodos, currentPage),
    [filteredTodos, currentPage],
  );

  const handleAdd = useCallback(
    (title) => {
      addTodo(title);
      setPage(1);
    },
    [addTodo],
  );

  const handleFilterChange = (value) => {
    setFilter(value);
    setPage(1);
  };

  const handleSearchChange = (value) => {
    setSearch(value);
    setPage(1);
  };

  const renderContent = () => {
    if (status === 'loading') return <Loader label="Loading your todos..." />;

    if (status === 'error') {
      return (
        <ErrorMessage
          message={`We couldn't load your todos (${error}).`}
          onRetry={retry}
        />
      );
    }

    if (visibleTodos.length === 0) {
      return debouncedSearch.trim() ? (
        <EmptyState
          icon="search"
          title="No matching todos"
          description={`Nothing matches "${debouncedSearch.trim()}".`}
        />
      ) : (
        <EmptyState title="All clear" description={EMPTY_MESSAGES[filter]} />
      );
    }

    return (
      <>
        <TodoList
          todos={visibleTodos}
          onToggle={toggleTodo}
          onUpdate={updateTodo}
          onDelete={deleteTodo}
        />
        <Pagination
          page={currentPage}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </>
    );
  };

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <Header />
        <TodoForm onAdd={handleAdd} />
        {notice && <ErrorMessage message={notice} onDismiss={dismissNotice} />}
        <TodoFilters
          filter={filter}
          onFilterChange={handleFilterChange}
          search={search}
          onSearchChange={handleSearchChange}
          stats={stats}
        />
        <section className={styles.content} aria-live="polite" aria-busy={status === 'loading'}>
          {renderContent()}
        </section>
        {status === 'success' && (
          <TodoStats stats={stats} onClearCompleted={clearCompleted} />
        )}
      </div>
    </main>
  );
}
