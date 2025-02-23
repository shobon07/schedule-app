import React, { useState } from "react";
import { Clock, Plus, Save, Briefcase } from "lucide-react";
import { generateSchedule } from "../../services/scheduleGenerator";

const DailyScheduler = () => {
  const [timeRange, setTimeRange] = useState({ start: "09:00", end: "22:00" }); //活動時間
  const [tasks, setTasks] = useState([]);                                       //作業内容
  const [fixedEvents, setFixedEvents] = useState([]); // 固定スケジュール用
  const [newTask, setNewTask] = useState({ title: "", duration: 30 });
  const [generatedSchedule, setGeneratedSchedule] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [newFixedEvent, setNewFixedEvent] = useState({
    title: "",
    start: "",
    end: "",
    type: "work" // work, class, other など
  });
  const handleGenerateSchedule = async () => {
    //時間が何も設定されていない時のアラーム
    if (tasks.length === 0 && fixedEvents.length === 0) {
      alert("タスクまたは固定スケジュールを追加してください");
      return;
    }

    setIsGenerating(true);
    try {
      const scheduleData = {
        timeRange,
        fixedEvents,
        tasks
      };

      // データをコンソールに出力して確認
      console.log("生成するスケジュールのデータ:", scheduleData);

      // 仮のスケジュールデータ（あとでAI生成に置き換え）
      const result = await generateSchedule(fixedEvents, tasks, timeRange);
      setGeneratedSchedule(result);

    } catch (error) {
      console.error("スケジュール生成エラー:", error);
      alert("スケジュールの生成に失敗しました");
    } finally {
      setIsGenerating(false);
    }
  };

  // 固定スケジュールの追加
  const addFixedEvent = () => {
    if (newFixedEvent.title && newFixedEvent.start && newFixedEvent.end) {
      setFixedEvents([...fixedEvents, newFixedEvent]);
      setNewFixedEvent({
        title: "",
        start: "",
        end: "",
        type: "work"
      });
    }
  };

  // タスクの追加
  const addTask = () => {
    if (newTask.title) {
      setTasks([...tasks, newTask]);
      setNewTask({ title: "", duration: 30 });
    }
  };

  // 固定スケジュールの削除関数
  const removeFixedEvent = (indexToRemove) => {
    setFixedEvents(fixedEvents.filter((_, index) => index !== indexToRemove));
  };

  // タスクの削除関数
  const removeTask = (indexToRemove) => {
    setTasks(tasks.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* 時間範囲設定 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-500" />
            活動時間の設定
          </h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="font-medium">開始時間:</label>
              <input
                type="time"
                value={timeRange.start}
                onChange={(e) => setTimeRange({ ...timeRange, start: e.target.value })}
                className="border rounded px-2 py-1"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="font-medium">終了時間:</label>
              <input
                type="time"
                value={timeRange.end}
                onChange={(e) => setTimeRange({ ...timeRange, end: e.target.value })}
                className="border rounded px-2 py-1"
              />
            </div>
          </div>
        </div>

        {/* 固定スケジュール追加 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-blue-500" />
            固定スケジュール（バイト・授業など）
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">タイトル</label>
                <input
                  type="text"
                  value={newFixedEvent.title}
                  onChange={(e) => setNewFixedEvent({ ...newFixedEvent, title: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  placeholder="バイト・授業名など"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">種類</label>
                <select
                  value={newFixedEvent.type}
                  onChange={(e) => setNewFixedEvent({ ...newFixedEvent, type: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="work">バイト</option>
                  <option value="class">授業</option>
                  <option value="other">その他</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">開始時間</label>
                <input
                  type="time"
                  value={newFixedEvent.start}
                  onChange={(e) => setNewFixedEvent({ ...newFixedEvent, start: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">終了時間</label>
                <input
                  type="time"
                  value={newFixedEvent.end}
                  onChange={(e) => setNewFixedEvent({ ...newFixedEvent, end: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            </div>
            <button
              onClick={addFixedEvent}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600"
            >
              <Plus className="w-4 h-4" />
              固定スケジュールを追加
            </button>
          </div>

          {/* 固定スケジュール一覧 */}
          {fixedEvents.length > 0 && (
            <div className="mt-4 space-y-2">
              <h3 className="font-medium">追加済みの固定スケジュール</h3>
              {fixedEvents.map((event, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <span className="font-medium">{event.title}</span>
                    <span className="ml-2 text-sm text-gray-500">
                      ({event.type === "work" ? "バイト" : event.type === "class" ? "授業" : "その他"})
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-gray-600">
                      {event.start} - {event.end}
                    </span>
                    <button
                      onClick={() => removeFixedEvent(index)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* タスク追加 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">その他のタスク</h2>
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">タスク名</label>
              <input
                type="text"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className="w-full border rounded px-3 py-2"
                placeholder="タスクを入力"
              />
            </div>
            <div className="w-32">
              <label className="block text-sm font-medium mb-1">所要時間（分）</label>
              <input
                type="number"
                value={newTask.duration}
                onChange={(e) => setNewTask({ ...newTask, duration: parseInt(e.target.value) })}
                className="w-full border rounded px-3 py-2"
                min="5"
                step="5"
              />
            </div>
            <button
              onClick={addTask}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600"
            >
              <Plus className="w-4 h-4" />
              追加
            </button>
          </div>

          {/* タスク一覧 */}
          {tasks.length > 0 && (
            <div className="mt-4 space-y-2">
              {tasks.map((task, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="font-medium">{task.title}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-gray-600">{task.duration}分</span>
                    <button
                      onClick={() => removeTask(index)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* スケジュール生成ボタンの部分を以下に置き換え */}
        <button
          onClick={handleGenerateSchedule}
          disabled={isGenerating}
          className={`w-full ${isGenerating ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"
            } text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2`}
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              生成中...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              スケジュールを生成
            </>
          )}
        </button>
        {/* スケジュール生成ボタンの下に追加 */}
        {generatedSchedule && (
          <div className="mt-6 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">生成されたスケジュール</h2>
            <div className="space-y-2">
              {generatedSchedule.schedule.map((item, index) => (
                <div
                  key={index}
                  className={`p-3 rounded ${item.type === "fixed"
                    ? "bg-blue-100"
                    : item.type === "break"
                      ? "bg-gray-100"
                      : "bg-green-100"
                    }`}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{item.title}</span>
                      <span className="text-gray-600">
                        {item.startTime} ～ {item.endTime}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {item.type === "fixed" ? "固定" : item.type === "break" ? "休憩" : "タスク"}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* 凡例を追加 */}
            <div className="mt-4 text-sm text-gray-600 flex gap-4">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-blue-100 rounded"></div>
                <span>固定スケジュール</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-100 rounded"></div>
                <span>タスク</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-gray-100 rounded"></div>
                <span>休憩</span>
              </div>
            </div>
          </div>
        )};
      </div>
    </div>
  );
};
  export default DailyScheduler;