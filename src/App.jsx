import { TodoPage } from './components/todo/TodoPage/TodoPage';
import { TodoProvider } from './context/TodoProvider';

function App() {
  return (
    <TodoProvider>
      <TodoPage />
    </TodoProvider>
  );
}

export default App;
