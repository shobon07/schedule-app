// src/services/breakSuggestionService.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getHistoryForPrompt } from "./breakHistoryService";

// GoogleGenerativeAI インスタンスの初期化
const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);

// 息抜きアイデアを取得する
export const fetchBreakSuggestions = async () => {
  try {
    // 過去の提案履歴を取得
    const historyContext = getHistoryForPrompt(10);

    // プロンプトの構築
    const prompt = `
    あなたは大学生向けの息抜き活動アドバイザーです。3つの息抜き活動を提案してください。以下の原則に従ってください：

    1. 大学生の生活に適した活動：
       - 学業の合間に取り入れやすい
       - 限られた時間（15-90分）で完結できる
       - 特別な準備や高価な道具が不要なもの
       - 学生の予算で実現可能なもの

    2. 活動カテゴリーのバランス：
       - 短時間リフレッシュ（5-20分の小休憩活動）
       - 身体活動（ストレッチ、軽い運動、散歩など）
       - 創造的活動（描画、音楽、書き物など）
       - 社交的活動（友人との交流など）
       - リラクゼーション（瞑想、深呼吸など）
       - 新しいスキル習得（短時間で取り組める学習）

    3. 学生生活の文脈を考慮：
       - キャンパス内でも実践可能な活動を含める
       - 学生寮や一人暮らしの環境でも実行可能なもの
       - SNSなどのデジタル疲れからの休息も考慮
       - 大学生の休暇中（春休み）を想定

    4. 科学的根拠に基づく効果：
       - 集中力回復
       - ストレス軽減
       - 創造性向上
       - 気分転換
       - 学習効率の向上

    5. 活動名と時間の一貫性：
       - 活動名に時間表現がある場合は、指定時間と一致させること
       - 各活動の特性に合った適切な時間配分を設定すること

    ${historyContext ? `以下の活動は最近提案したため、避けてください: ${historyContext}` : ''}

    レスポンスは以下のJSON形式のみで返してください。他の説明は一切含めないでください：
    {
      "suggestions": [
        {
          "id": "b1",
          "name": "活動名",
          "duration": 所要時間（分）,
          "priority": "優先度（★〜★★★）",
          "benefit": "この活動がもたらす主な効果（学生生活に関連づけて）",
          "category": "活動カテゴリー"
        }
      ]
    }`;

    // デバッグ用にプロンプトをログ出力
    console.log("Sending prompt to Gemini:", prompt);

    // Gemini モデルの取得と生成リクエスト
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // JSON部分の抽出とパース
    try {
      // マークダウンコードブロックが含まれている可能性があるため、それを削除
      text = text.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();

      // JSONオブジェクトを解析
      const parsedData = JSON.parse(text);
      return parsedData.suggestions;
    } catch (parseError) {
      console.error("JSONの解析に失敗しました:", parseError);
      console.log("受信したレスポンス:", text);

      // JSONが見つからない場合は正規表現でJSONを探す
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const parsedData = JSON.parse(jsonMatch[0]);
          return parsedData.suggestions;
        } catch (e) {
          throw new Error("抽出したJSONの解析に失敗しました");
        }
      }

      throw new Error("APIレスポンスからJSONを抽出できませんでした");
    }
  } catch (error) {
    console.error("息抜き提案の取得中にエラーが発生しました:", error);

    // エラー時のフォールバックデータ
    return [
      {
        id: "b1",
        name: "miss",
        duration: 20,
        priority: "★★",
        benefit: "気分転換と軽い運動効果",
        category: "身体活動"
      },
      {
        id: "b2",
        name: "miss",
        duration: 15,
        priority: "★★★",
        benefit: "体のこりをほぐし、心をリフレッシュ",
        category: "リラクゼーション"
      },
      {
        id: "b3",
        name: "miss",
        duration: 30,
        priority: "★",
        benefit: "思考の整理と心の安定",
        category: "創造的活動"
      }
    ];
  }
};

// ランダムなIDを生成する補助関数
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
};