//タスクの保存
export const saveTasks = (tasks) => {
  localStorage.setItem("todoList", JSON.stringify(tasks));
};

//タスクをローカルストレージから読み込み
export const loadTasks = () => {
  const savedTasks = localStorage.getItem("todoList");
  return savedTasks ? JSON.parse(savedTasks) : [];
  //データがあればJSONをオブジェクトに変換したのち返す。なければからの配列を返す。
};

//タスクを削除
export const deleteTask = (taskId, currentTasks) => {
  // taskIdと一致しないタスクのみを残す
  const updatedTasks = currentTasks.filter(task => task.id !== taskId);
  //ローカルストレージも新しい配列に更新
  saveTasks(updatedTasks);
  //削除後の新しい配列を返す
  return updatedTasks;
};