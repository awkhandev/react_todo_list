const BASE_URL = 'https://jsonplaceholder.typicode.com/todos';

async function request(url, options = {}) {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json; charset=UTF-8' },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json();
}

export function fetchTodos({ signal } = {}) {
  return request(BASE_URL, { signal });
}

export function createTodo(todo) {
  return request(BASE_URL, {
    method: 'POST',
    body: JSON.stringify(todo),
  });
}

export function updateTodo(id, changes) {
  return request(`${BASE_URL}/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(changes),
  });
}

export function deleteTodo(id) {
  return request(`${BASE_URL}/${id}`, { method: 'DELETE' });
}
