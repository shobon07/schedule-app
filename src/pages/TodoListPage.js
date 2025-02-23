import React, { useState } from "react";
import TodoListForm from "../components/todoList/TodoListForm";
import TodoListTable from "../components/todoList/TodoListTable";
const TodoListPage = () => {
  const [todoList, setTodoList] = useState([]);

  const handleAddTask = (newTask) => {
    setTodoList([...todoList, newTask]);
  };

  return (
    <div>
      <TodoListForm onAddTask={handleAddTask} />
      <TodoListTable todoList={todoList} />
    </div>
  );
};

export default TodoListPage;