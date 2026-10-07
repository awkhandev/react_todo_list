export const PAGE_SIZE = 10;
export const MAX_TITLE_LENGTH = 120;

export const FILTERS = {
  ALL: 'all',
  ACTIVE: 'active',
  COMPLETED: 'completed',
};

export function validateTitle(title) {
  const trimmed = title.trim();
  if (!trimmed) return 'Please enter a task.';
  if (trimmed.length > MAX_TITLE_LENGTH) {
    return `Keep it under ${MAX_TITLE_LENGTH} characters.`;
  }
  return null;
}

export function filterTodos(todos, filter, search) {
  const query = search.trim().toLowerCase();

  return todos.filter((todo) => {
    if (filter === FILTERS.ACTIVE && todo.completed) return false;
    if (filter === FILTERS.COMPLETED && !todo.completed) return false;
    return !query || todo.title.toLowerCase().includes(query);
  });
}

export function getStats(todos) {
  const completed = todos.filter((todo) => todo.completed).length;
  return { total: todos.length, completed, active: todos.length - completed };
}

export function paginate(items, page, pageSize = PAGE_SIZE) {
  const start = (page - 1) * pageSize;
  return items.slice(start, start + pageSize);
}
