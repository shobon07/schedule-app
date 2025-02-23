// src/pages/TodoListPage.js
import TodoList from '../components/todoList/TodoList';

const TodoListPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-2xl font-bold mb-6">やりたいことリスト</h2>
      <TodoList />
    </div>
  );
};

export default TodoListPage;