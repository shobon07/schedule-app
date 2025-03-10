// src/components/breakSuggestion/BreakSuggestionCard.js

import React, { useState } from 'react';
import { fetchBreakSuggestions, generateId } from '../../services/breakSuggestionService';
import { saveToBreakHistory } from '../../services/breakHistoryService';

/**
 * 息抜き提案カードコンポーネント
 * Gemini APIを使用して息抜きアイデアを取得し、Todoリストに追加する機能を提供
 *
 * @param {Object} props
 * @param {Function} props.onAddTask - 選択した息抜きをTodoリストに追加する関数
 */
const BreakSuggestionCard = ({ onAddTask }) => {
  const [suggestions, setSuggestions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  const [error, setError] = useState(null);

  /**
   * 息抜きの提案を取得する
   */
  const handleGetSuggestions = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchBreakSuggestions();
      setSuggestions(data);
    } catch (error) {
      console.error("提案の取得に失敗しました:", error);
      setError("提案の取得に失敗しました。しばらく経ってからもう一度お試しください。");
    } finally {
      setLoading(false);
    }
  };

  /**
   * 提案を選択する
   * @param {Object} suggestion - 選択された提案オブジェクト
   */
  const handleSelectSuggestion = (suggestion) => {
    setSelectedSuggestion(suggestion);
  };

  /**
   * 選択した提案をTodoリストに追加する
   */
  const handleAddToTodoList = () => {
    if (selectedSuggestion) {
      // todoリストに追加するためのフォーマットに変換
      const newTask = {
        id: generateId(),
        name: selectedSuggestion.name || selectedSuggestion.task, // nameとtaskの両方に対応
        duration: selectedSuggestion.duration,
        priority: selectedSuggestion.priority
      };

      // 履歴に保存
      saveToBreakHistory(selectedSuggestion);

      // 親コンポーネントの関数を呼び出してタスクを追加
      onAddTask(newTask);

      // 状態をリセット
      setSuggestions(null);
      setSelectedSuggestion(null);
    }
  };

  /**
   * 操作をキャンセルする
   */
  const handleCancel = () => {
    setSuggestions(null);
    setSelectedSuggestion(null);
    setError(null);
  };

  return (
    <div className="mb-6">
      {!suggestions ? (
        // 提案が表示されていない場合は「今日の息抜き」ボタンを表示
        <button
          onClick={handleGetSuggestions}
          disabled={loading}
          className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md w-full shadow-sm"
        >
          {loading ? "読み込み中..." : "今日の息抜き"}
        </button>
      ) : (
        // 提案が取得された場合はカードを表示
        <div className="bg-white rounded-md shadow-md p-4 border border-gray-200">
          <h3 className="text-lg font-semibold mb-3">今日の息抜きアイデア</h3>

          {error ? (
            <div className="text-red-500 p-3 bg-red-50 rounded-md mb-3">
              {error}
            </div>
          ) : (
            <div className="space-y-3">
              {suggestions.map((suggestion) => (
                <div
                  key={suggestion.id}
                  className={`p-3 rounded-md cursor-pointer border ${selectedSuggestion?.id === suggestion.id
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:bg-gray-50"
                    }`}
                  onClick={() => handleSelectSuggestion(suggestion)}
                >
                  <div className="font-medium">{suggestion.name || suggestion.task}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    <div className="flex justify-between">
                      <span>{suggestion.duration}分</span>
                      <span>{suggestion.priority}</span>
                    </div>
                    {suggestion.benefit && (
                      <div className="mt-1 text-gray-500 italic">
                        {suggestion.benefit}
                      </div>
                    )}
                    {suggestion.category && (
                      <div className="mt-1 text-gray-500">
                        カテゴリ: {suggestion.category}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-4 flex justify-between">
            <button
              onClick={handleCancel}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md"
            >
              キャンセル
            </button>
            <button
              onClick={handleAddToTodoList}
              disabled={!selectedSuggestion || error}
              className={`font-medium py-2 px-4 rounded-md ${selectedSuggestion && !error
                  ? "bg-green-500 hover:bg-green-600 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
            >
              追加する
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BreakSuggestionCard;
