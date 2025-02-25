import React, { useMemo, useState } from "react";
import { SortAsc, Star, Trash2 } from "lucide-react";

const renderPriorityStars = (priority) => {
  const starCount = priority === "☆" ? 1 :
    priority === "☆☆" ? 2 :
      3;

  return (
    <div className="flex">
      {[...Array(starCount)].map((_, index) => (
        <Star
          key={index}
          className="text-yellow-500"
          size={16}
        />
      ))}
    </div>
  );
};

const TodoListTable = ({ todoList, onDeleteTask }) => {
  const [sortType, setSortType] = useState("");

  const sortedTodoList = useMemo(() => {
    let sortableList = [...todoList];

    switch (sortType) {
      case "priority":
        return sortableList.sort((a, b) =>
          b.priority.length - a.priority.length
        );

      case "duration":
        return sortableList.sort((a, b) =>
          b.duration - a.duration
        );

      case "createdAt":
        return sortableList.sort((a, b) =>
          b.id - a.id
        );

      default:
        return sortableList;
    }
  }, [todoList, sortType]);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-4 flex items-center">
        <SortAsc className="mr-2 text-gray-500" />
        <select
          value={sortType}
          onChange={(e) => setSortType(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="">並び替え</option>
          <option value="priority">優先度順</option>
          <option value="duration">時間順</option>
          <option value="createdAt">登録日時順</option>
        </select>
      </div>

      <h3 className="text-lg font-semibold mb-4">タスク一覧</h3>
      {sortedTodoList.length === 0 ? (
        <p className="text-gray-500">タスクはありません</p>
      ) : (
        <ul>
          {sortedTodoList.map((task) => (
            <li
              key={task.id}
              className="flex justify-between items-center p-2 border-b"
            >
              <div className="flex items-center">
                <span className="font-medium">{task.name}</span>
                <span className="ml-2 text-gray-500">({task.duration}分)</span>
                <div className="ml-2">
                  {renderPriorityStars(task.priority)}
                </div>
              </div>
              <button
                  onClick={() => onDeleteTask(task.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={16}/>
                </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TodoListTable;