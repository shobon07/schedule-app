// src/services/breakHistoryService.js

// 過去の息抜き提案を保存するための最大件数
const MAX_HISTORY_ITEMS = 30;

// 息抜き提案の履歴を取得する
export const getBreakHistory = () => {
  try {
    const history = localStorage.getItem('breakSuggestionHistory');
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('履歴の取得中にエラーが発生しました:', error);
    return [];
  }
};

// 選択された息抜き提案を履歴に保存する
export const saveToBreakHistory = (suggestion) => {
  try {
    const history = getBreakHistory();

    // 日付情報を追加
    const suggestionWithDate = {
      ...suggestion,
      selectedAt: new Date().toISOString()
    };

    // 新しい提案を先頭に追加
    const updatedHistory = [suggestionWithDate, ...history];

    // 最大件数を超える場合は古いものを削除
    const trimmedHistory = updatedHistory.slice(0, MAX_HISTORY_ITEMS);

    // 更新した履歴を保存
    localStorage.setItem('breakSuggestionHistory', JSON.stringify(trimmedHistory));

    return trimmedHistory;
  } catch (error) {
    console.error('履歴の保存中にエラーが発生しました:', error);
    return [];
  }
};

// 提案が最近の履歴に含まれているかチェック
export const isRecentlySuggested = (task, lookbackCount = 10) => {
  try {
    const history = getBreakHistory();
    // 最新の数件だけを確認
    const recentHistory = history.slice(0, lookbackCount);

    // タスク名の類似性をチェック（完全一致だけでなく部分一致も考慮）
    return recentHistory.some(item => {
      // 完全一致
      if (item.task.toLowerCase() === task.toLowerCase()) return true;

      // 主要な単語が共通している場合も類似と判断
      const itemWords = item.task.toLowerCase().split(' ');
      const taskWords = task.toLowerCase().split(' ');

      // 単語の50%以上が共通していれば類似と判断
      const commonWords = itemWords.filter(word =>
        taskWords.includes(word) && word.length > 3 // 短い単語は除外
      );

      return commonWords.length >= Math.min(itemWords.length, taskWords.length) * 0.5;
    });
  } catch (error) {
    console.error('履歴のチェック中にエラーが発生しました:', error);
    return false;
  }
};

// Geminiプロンプトに追加する履歴情報を生成
export const getHistoryForPrompt = (maxItems = 5) => {
  const history = getBreakHistory().slice(0, maxItems);

  if (history.length === 0) return '';

  const historyText = history
    .map(item => item.task)
    .join('", "');

  return `\n\n以下の活動は最近提案されたものなので、避けてください:\n["${historyText}"]`;
};