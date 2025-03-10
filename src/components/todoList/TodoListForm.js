/**
 * TodoListFormコンポーネント
 * 新しいタスクを追加するためのフォーム
 *
 * @module TodoListForm
 */

import React, { useState } from "react";
import { Plus } from "lucide-react";

/**
 * TodoListFormコンポーネント
 * @param {Object} props
 * @param {Function} props.onAddTask - 新しいタスクを追加する関数
 */
const TodoListForm = ({ onAddTask }) => {
  const [taskName, setTaskName] = useState("");
  const [duration, setDuration] = useState("");
  const [priority, setPriority] = useState("");
  const [error, setError] = useState("");

  /**
   * 新しいタスクを追加する
   */
  const handleAddTask = () => {
    // バリデーション
    if (!taskName.trim()) {
      setError("タスク名を入力してください");
      return;
    }

    if (!duration) {
      setError("所要時間を選択してください");
      return;
    }

    if (!priority) {
      setError("優先度を選択してください");
      return;
    }

    setError(""); // エラーをクリア

    // 新しいタスクオブジェクトを作成
    const newTask = {
      id: Date.now(),
      name: taskName.trim(),
      duration: parseInt(duration),
      priority: priority,
      createdAt: Date.now()
    };

    // 親コンポーネントの関数を呼び出してタスクを追加
    onAddTask(newTask);

    // フォームをリセット
    setTaskName("");
    setDuration("");
    setPriority("");
  };

  /**
   * Enterキーでタスクを追加できるようにする
   */
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAddTask();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-4">
      <h3 className="text-lg font-semibold mb-4">タスクを追加</h3>

      {error && (
        <div className="mb-4 p-2 bg-red-50 text-red-600 rounded border border-red-200">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="taskName" className="block text-sm font-medium text-gray-700 mb-1">
            タスク名
          </label>
          <input
            id="taskName"
            type="text"
            placeholder="タスク名"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
            所要時間
          </label>
          <select
            id="duration"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">時間を選択</option>
            <option value="15">15分</option>
            <option value="30">30分</option>
            <option value="45">45分</option>
            <option value="60">60分</option>
            <option value="90">90分</option>
            <option value="120">120分</option>
          </select>
        </div>

        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
            優先度
          </label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">優先度を選択</option>
            <option value="★">★ (低)</option>
            <option value="★★">★★ (中)</option>
            <option value="★★★">★★★ (高)</option>
          </select>
        </div>

        <button
          onClick={handleAddTask}
          className="w-full p-2 rounded flex items-center justify-center bg-blue-500 text-white hover:bg-blue-600 transition-colors"
        >
          <Plus className="w-4 h-4 mr-1" /> 追加
        </button>
      </div>
    </div>
  );
};

export default TodoListForm;
