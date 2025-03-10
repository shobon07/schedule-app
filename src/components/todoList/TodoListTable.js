/**
 * TodoListTableコンポーネント
 * タスク一覧を表示するテーブル
 *
 * @module TodoListTable
 */

import React, { useMemo, useState } from "react";
import { SortAsc, Star, Trash2, Clock, Calendar } from "lucide-react";

/**
 * 優先度を星アイコンで表示する
 * @param {string} priority - 優先度（★、★★、★★★）
 * @returns {JSX.Element} 星アイコンのJSX
 */
const renderPriorityStars = (priority) => {
  // 優先度の表記が☆と★の両方に対応
  const normalizedPriority = priority.replace(/☆/g, '★');
  const starCount = normalizedPriority.length;

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

/**
 * TodoListTableコンポーネント
 * @param {Object} props
 * @param {Array} props.todoList - タスクの配列
 * @param {Function} props.onDeleteTask - タスク削除関数
 */
const TodoListTable = ({ todoList, onDeleteTask }) => {
  const [sortType, setSortType] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);

  /**
   * ソートされたタスクリスト
   */
  const sortedTodoList = useMemo(() => {
    if (!todoList || todoList.length === 0) return [];

    let sortableList = [...todoList];

    switch (sortType) {
      case "priority":
        // 優先度でソート（★★★が最上位）
        return sortableList.sort((a, b) => {
          const aStars = (a.priority || '').length;
          const bStars = (b.priority || '').length;
          return bStars - aStars;
        });

      case "duration":
        // 所要時間でソート（長い順）
        return sortableList.sort((a, b) =>
          (b.duration || 0) - (a.duration || 0)
        );

      case "createdAt":
        // 作成日時でソート（新しい順）
        return sortableList.sort((a, b) =>
          (b.id || 0) - (a.id || 0)
        );

      default:
        return sortableList;
    }
  }, [todoList, sortType]);

  /**
   * タスク削除の確認
   * @param {string|number} taskId - 削除するタスクのID
   */
  const handleConfirmDelete = (taskId) => {
    setConfirmDelete(taskId);
  };

  /**
   * タスク削除の実行
   */
  const handleDeleteConfirmed = () => {
    if (confirmDelete) {
      onDeleteTask(confirmDelete);
      setConfirmDelete(null);
    }
  };

  /**
   * タスク削除のキャンセル
   */
  const handleCancelDelete = () => {
    setConfirmDelete(null);
  };

  /**
   * 日時をフォーマットする
   * @param {number} timestamp - タイムスタンプ
   * @returns {string} フォーマットされた日時
   */
  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleDateString('ja-JP', {
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-4 flex items-center">
        <SortAsc className="mr-2 text-gray-500" />
        <select
          value={sortType}
          onChange={(e) => setSortType(e.target.value)}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          aria-label="並び替え"
        >
          <option value="">並び替え</option>
          <option value="priority">優先度順</option>
          <option value="duration">時間順</option>
          <option value="createdAt">登録日時順</option>
        </select>
      </div>

      <h3 className="text-lg font-semibold mb-4">タスク一覧</h3>

      {sortedTodoList.length === 0 ? (
        <p className="text-gray-500 p-4 bg-gray-50 rounded text-center">タスクはありません</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {sortedTodoList.map((task) => (
            <li
              key={task.id}
              className="py-3 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2"
            >
              <div className="flex flex-col">
                <span className="font-medium text-gray-900">{task.name}</span>
                <div className="flex items-center mt-1 text-sm text-gray-500">
                  <Clock size={14} className="mr-1" />
                  <span>{task.duration}分</span>
                  {task.createdAt && (
                    <>
                      <Calendar size={14} className="ml-3 mr-1" />
                      <span>{formatDate(task.createdAt)}</span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto">
                <div className="mr-4">
                  {task.priority && renderPriorityStars(task.priority)}
                </div>

                {confirmDelete === task.id ? (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleCancelDelete}
                      className="text-gray-500 hover:text-gray-700 text-sm px-2 py-1"
                    >
                      キャンセル
                    </button>
                    <button
                      onClick={handleDeleteConfirmed}
                      className="bg-red-500 text-white hover:bg-red-600 text-sm px-2 py-1 rounded"
                    >
                      削除
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleConfirmDelete(task.id)}
                    className="text-red-500 hover:text-red-700 p-1"
                    aria-label="タスクを削除"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TodoListTable;
