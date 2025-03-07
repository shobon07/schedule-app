import React, { useState } from "react";
import TodoListForm from "../components/todoList/TodoListForm";
import TodoListTable from "../components/todoList/TodoListTable";
import BreakSuggestionCard from "../components/breakSuggestion/BreakSuggestionCard";
import { saveTasks, loadTasks, deleteTask } from "../services/todoLocalStorage"

const TodoListPage = () => {
  //最初は何も保存されていないので、[]が返される
  const [todoList, setTodoList] = useState(loadTasks());
  const handleAddTask = (newTask) => {
    const updatedTasks = [...todoList, newTask];

    //ローカルストレージに保存
    saveTasks(updatedTasks);

    //stateを更新
    setTodoList(updatedTasks);

  };

  const handleDeleteTask = (taskId) => {
    const updatedTasks = deleteTask(taskId, todoList);
    setTodoList(updatedTasks);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <BreakSuggestionCard/>
      <TodoListForm onAddTask={handleAddTask} />
      <TodoListTable
        todoList={todoList}
        onDeleteTask={handleDeleteTask}
      />
    </div>
  );
};

export default TodoListPage;