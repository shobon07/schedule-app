/**
 * Todoリストローカルストレージサービス
 * タスクの保存、読み込み、削除などの機能を提供
 *
 * @module todoLocalStorage
 */

// ローカルストレージのキー
const TODO_STORAGE_KEY = 'todoList';

/**
 * タスクをローカルストレージに保存する
 * @param {Array} tasks - 保存するタスクの配列
 */
export const saveTasks = (tasks) => {
  try {
    localStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(tasks));
    return true;
  } catch (error) {
    console.error('タスクの保存に失敗しました:', error);
    return false;
  }
};

/**
 * タスクをローカルストレージから読み込む
 * @returns {Array} タスクの配列
 */
export const loadTasks = () => {
  try {
    const savedTasks = localStorage.getItem(TODO_STORAGE_KEY);
    return savedTasks ? JSON.parse(savedTasks) : [];
  } catch (error) {
    console.error('タスクの読み込みに失敗しました:', error);
    return [];
  }
};

/**
 * タスクを削除する
 * @param {string|number} taskId - 削除するタスクのID
 * @param {Array} currentTasks - 現在のタスク配列
 * @returns {Array} 更新されたタスク配列
 */
export const deleteTask = (taskId, currentTasks) => {
  try {
    // taskIdと一致しないタスクのみを残す
    const updatedTasks = currentTasks.filter(task => task.id !== taskId);

    // ローカルストレージも新しい配列に更新
    saveTasks(updatedTasks);

    // 削除後の新しい配列を返す
    return updatedTasks;
  } catch (error) {
    console.error('タスクの削除に失敗しました:', error);
    return currentTasks; // エラー時は元の配列を返す
  }
};

/**
 * 新しいタスクを追加する
 * @param {Object} newTask - 追加する新しいタスク
 * @returns {Array} 更新されたタスク配列
 */
export const addTask = (newTask) => {
  try {
    const currentTasks = loadTasks();
    const updatedTasks = [...currentTasks, newTask];
    saveTasks(updatedTasks);
    return updatedTasks;
  } catch (error) {
    console.error('タスクの追加に失敗しました:', error);
    return loadTasks(); // エラー時は現在の配列を返す
  }
};

/**
 * タスクを更新する
 * @param {string|number} taskId - 更新するタスクのID
 * @param {Object} updatedFields - 更新するフィールド
 * @returns {Array} 更新されたタスク配列
 */
export const updateTask = (taskId, updatedFields) => {
  try {
    const currentTasks = loadTasks();
    const updatedTasks = currentTasks.map(task =>
      task.id === taskId ? { ...task, ...updatedFields } : task
    );
    saveTasks(updatedTasks);
    return updatedTasks;
  } catch (error) {
    console.error('タスクの更新に失敗しました:', error);
    return loadTasks(); // エラー時は現在の配列を返す
  }
};
