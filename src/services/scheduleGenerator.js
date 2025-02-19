import { GoogleGenerativeAI } from "@google/generative-ai";

console.log('API Key:', process.env.REACT_APP_GEMINI_API_KEY);

const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);

export const generateSchedule = async (fixedEvents, tasks, timeRange) => {
  const prompt = `
1日のスケジュールを最適化してください。
以下の原則に従ってスケジュールを作成し、JSONのみを出力してください。

活動可能時間: ${timeRange.start}から${timeRange.end}

固定スケジュール:
${fixedEvents.map(event => `- ${event.title}: ${event.start}-${event.end}`).join('\n')}

タスク一覧:
${tasks.map(task => `- ${task.title}: ${task.duration}分`).join('\n')}

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

try {
  // デバッグ用：送信するプロンプトの確認
  console.log('Sending prompt to Gemini:', prompt);

  // Geminiモデルの取得と生成
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const result = await model.generateContent(prompt);
  const response = await result.response;
  let text = response.text();

  // マークダウン記法を削除
  text = text.replace(/```json\n/, '').replace(/```/, '');

  // デバッグ用：APIからのレスポンスを確認
  console.log('Raw Gemini response:', text);

  try {
    // JSONとしてパース
    const schedule = JSON.parse(text.trim());
    console.log('Parsed schedule:', schedule);
    return schedule;
  } catch (parseError) {
    console.error('JSON parse error:', parseError);
    throw new Error('生成されたスケジュールの形式が不正です');
  }

} catch (error) {
  console.error('Gemini API Error:', error);
  throw new Error('スケジュールの生成に失敗しました');
}
};