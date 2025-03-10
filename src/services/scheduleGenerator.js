/**
 * スケジュールジェネレーターサービス
 * Gemini APIを使用して最適なスケジュールを生成する機能を提供
 *
 * @module scheduleGenerator
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import { loadTasks } from "./todoLocalStorage";

// GoogleGenerativeAI インスタンスの初期化
const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);

/**
 * 最適なスケジュールを生成する
 * @param {Array} fixedEvents - 固定イベントの配列
 * @param {Array} tasks - タスクの配列
 * @param {Object} timeRange - 活動可能時間の範囲 {start, end}
 * @returns {Promise<Object>} 生成されたスケジュール
 */
export const generateSchedule = async (fixedEvents, tasks, timeRange) => {
  try {
    // Todoリストからタスクを読み込む
    const todoList = loadTasks();

    // プロンプトの構築
    const prompt = `
1日のスケジュールを最適化してください。
以下の原則に従ってスケジュールを作成し、JSONのみを出力してください。

活動可能時間: ${timeRange.start}から${timeRange.end}

固定スケジュール:
${fixedEvents.map(event => `- ${event.title}: ${event.start}-${event.end}`).join("\n")}

タスク一覧:
${tasks.map(task => `- ${task.title}: ${task.duration}分`).join("\n")}

もし入れられるのであればやることリストの内容も追加してください。

やることリスト:
${todoList.map(todo => `- ${todo.name}: ${todo.duration}分`).join("\n")}

スケジュール作成の原則:
1. 午前中（特に9:00-12:00）は集中力が必要なタスクを優先的に配置
2. 午後2-3時は集中力が低下するため、運動や軽作業を配置
3. 作業時間は以下のように区切る
   - 集中作業は25-50分で区切る
   - 作業間に5-15分の小休憩を入れる
   - 2時間作業したら15-30分の長めの休憩を入れる
4. 休憩のルール
   - 連続する休憩は避ける
   - 休憩時間は15-30分を基本とする
   - 昼食休憩は45分程度確保
5. タスクの配置
   - 知的作業は午前中に配置
   - 運動は午後の時間帯に配置
   - 移動時間も考慮する（予定と予定の間に余裕を持たせる）


JSONのみを出力してください。マークダウン記法は使用しないでください：
{
  "schedule": [
    {
      "startTime": "時刻（HH:mm形式）",
      "endTime": "時刻（HH:mm形式）",
      "title": "タスク名",
      "type": "fixed/task/break"
    }
  ]
}`;

    // デバッグ用：送信するプロンプトの確認
    console.log("Sending prompt to Gemini:", prompt);

    // Geminiモデルの取得と生成
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // マークダウン記法を削除
    text = text.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();

    // デバッグ用：APIからのレスポンスを確認
    console.log("Raw Gemini response:", text);

    try {
      // JSONとしてパース
      const schedule = JSON.parse(text);
      console.log("Parsed schedule:", schedule);
      return schedule;
    } catch (parseError) {
      console.error("JSON parse error:", parseError);

      // JSONが見つからない場合は正規表現でJSONを探す
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const parsedData = JSON.parse(jsonMatch[0]);
          return parsedData;
        } catch (e) {
          throw new Error("抽出したJSONの解析に失敗しました");
        }
      }

      throw new Error("生成されたスケジュールの形式が不正です");
    }
  } catch (error) {
    console.error("Gemini API Error:", error);

    // エラー時のフォールバックスケジュール
    return {
      schedule: [
        {
          startTime: timeRange.start,
          endTime: calculateEndTime(timeRange.start, 30),
          title: "計画の見直し",
          type: "task"
        },
        ...fixedEvents.map(event => ({
          startTime: event.start,
          endTime: event.end,
          title: event.title,
          type: "fixed"
        })),
        ...generateFallbackSchedule(timeRange, fixedEvents, tasks)
      ]
    };
  }
};

/**
 * エラー時のフォールバックスケジュールを生成
 * @param {Object} timeRange - 活動可能時間の範囲
 * @param {Array} fixedEvents - 固定イベントの配列
 * @param {Array} tasks - タスクの配列
 * @returns {Array} フォールバックスケジュールの配列
 */
const generateFallbackSchedule = (timeRange, fixedEvents, tasks) => {
  // 固定イベントの時間帯を除外した空き時間を計算
  const availableSlots = calculateAvailableTimeSlots(timeRange, fixedEvents);

  // タスクを時間枠に割り当て
  return allocateTasksToSlots(tasks, availableSlots);
};

/**
 * 固定イベントを除いた利用可能な時間枠を計算
 * @param {Object} timeRange - 活動可能時間の範囲
 * @param {Array} fixedEvents - 固定イベントの配列
 * @returns {Array} 利用可能な時間枠の配列
 */
const calculateAvailableTimeSlots = (timeRange, fixedEvents) => {
  // 簡易実装: 固定イベントがない場合は全時間を利用可能とする
  if (fixedEvents.length === 0) {
    return [{
      start: timeRange.start,
      end: timeRange.end
    }];
  }

  // 実際の実装では固定イベントの間の空き時間を計算する必要がある
  // 簡易実装として、最初の固定イベントの前と最後の固定イベントの後の時間を返す
  const sortedEvents = [...fixedEvents].sort((a, b) =>
    a.start.localeCompare(b.start)
  );

  const slots = [];

  // 最初のイベント前の時間
  if (timeRange.start < sortedEvents[0].start) {
    slots.push({
      start: timeRange.start,
      end: sortedEvents[0].start
    });
  }

  // 最後のイベント後の時間
  const lastEvent = sortedEvents[sortedEvents.length - 1];
  if (lastEvent.end < timeRange.end) {
    slots.push({
      start: lastEvent.end,
      end: timeRange.end
    });
  }

  return slots;
};

/**
 * タスクを利用可能な時間枠に割り当てる
 * @param {Array} tasks - タスクの配列
 * @param {Array} slots - 利用可能な時間枠の配列
 * @returns {Array} スケジュールアイテムの配列
 */
const allocateTasksToSlots = (tasks, slots) => {
  if (slots.length === 0 || tasks.length === 0) return [];

  const scheduleItems = [];
  let currentSlotIndex = 0;
  let currentStart = slots[currentSlotIndex].start;

  for (const task of tasks) {
    // 現在のスロットが終了した場合、次のスロットへ
    if (currentSlotIndex >= slots.length) break;

    const currentSlot = slots[currentSlotIndex];
    const taskDurationMinutes = task.duration || 30; // デフォルト30分
    const taskEndTime = calculateEndTime(currentStart, taskDurationMinutes);

    // スロットの終了時間を超える場合、次のスロットへ
    if (taskEndTime > currentSlot.end) {
      currentSlotIndex++;
      if (currentSlotIndex >= slots.length) break;
      currentStart = slots[currentSlotIndex].start;
      continue;
    }

    // タスクをスケジュールに追加
    scheduleItems.push({
      startTime: currentStart,
      endTime: taskEndTime,
      title: task.title || task.name,
      type: "task"
    });

    // 休憩を追加（30分以上のタスク後）
    if (taskDurationMinutes >= 30) {
      const breakEndTime = calculateEndTime(taskEndTime, 10); // 10分休憩

      // 休憩がスロット内に収まる場合のみ追加
      if (breakEndTime <= currentSlot.end) {
        scheduleItems.push({
          startTime: taskEndTime,
          endTime: breakEndTime,
          title: "休憩",
          type: "break"
        });
        currentStart = breakEndTime;
      } else {
        currentStart = taskEndTime;
      }
    } else {
      currentStart = taskEndTime;
    }
  }

  return scheduleItems;
};

/**
 * 開始時間と所要時間から終了時間を計算
 * @param {string} startTime - 開始時間（HH:MM形式）
 * @param {number} durationMinutes - 所要時間（分）
 * @returns {string} 終了時間（HH:MM形式）
 */
const calculateEndTime = (startTime, durationMinutes) => {
  const [hours, minutes] = startTime.split(':').map(Number);

  // 分を計算
  let totalMinutes = hours * 60 + minutes + durationMinutes;

  // 時間と分に変換
  const newHours = Math.floor(totalMinutes / 60);
  const newMinutes = totalMinutes % 60;

  // HH:MM形式に整形
  return `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
};
