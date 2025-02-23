import React, { useState } from "react";
import { Plus } from "lucide-react";

const TodoListForm = ({ onAddTask }) => {
  const [taskName, setTaskName] = useState("");
  const [duration, setDuration] = useState("");
  const [priority, setPriority] = useState("");

  const handleAddTask = () => {
    if (taskName && duration && priority) {
      const newTask = {
        id: Date.now(),
        name: taskName,
        duration: parseInt(duration),
        priority: priority,
        createdAt: Date.now()
      };

      onAddTask(newTask);

      // フォームをリセット
      setTaskName("");
      setDuration("");
      setPriority("");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-4">
      <h3 className="text-lg font-semibold mb-4">タスクを追加</h3>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="タスク名"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <select
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="">時間を選択</option>
          <option value="15">15分</option>
          <option value="30">30分</option>
          <option value="60">60分</option>
          <option value="90">90分</option>
        </select>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="">優先度を選択</option>
          <option value="☆">☆</option>
          <option value="☆☆">☆☆</option>
          <option value="☆☆☆">☆☆☆</option>
        </select>
        <button
          onClick={handleAddTask}
          className={"w-full p-2 rounded flex items-center justify-center bg-blue-500 text-white hover:bg-blue-600"}
        >
          <Plus className=" w-4 h-4 " /> 追加
        </button>
      </div>
    </div>
  );
};

export default TodoListForm;