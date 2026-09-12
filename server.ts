import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // AI Stylist Advice Endpoint
  app.post('/api/stylist-advice', async (req, res) => {
    try {
      const { typeName, event, weather, hairLength } = req.body;

      const ai = getGenAI();
      if (!ai) {
        // Fallback friendly message if API key is not yet set
        return res.json({
          advice: `【スタイリストからのアドバイス】\n${typeName}のあなたへ！今日の「${event || '学校'}」（お天気：${weather || 'はれ'}）には、清潔感があって動きやすいスタイルがぴったり！笑顔で楽しい一日を過ごしてね✨`,
        });
      }

      const prompt = `あなたは小学生の女の子に寄り添う親切で優しいファッション＆ヘアアレンジのスタイリストです。
以下の条件に合わせて、ひらがなや分かりやすい言葉を中心にして、3〜4文程度で可愛らしく元気づけるワンポイントアドバイスを作成してください。

- 診断されたスタイルタイプ: ${typeName}
- 今日の予定・行事: ${event || '学校・普段の日'}
- 今日の天気・気温感: ${weather || '過ごしやすい晴れ'}
- 髪の長さ: ${hairLength || 'ミディアム'}

アドバイスのポイント:
1. 今日の行事や天気に合わせた、おすすめヘアの崩れにくさや可愛さのワンポイント
2. 服装や小物のワンポイント（例: 汗拭きハンカチ、寒暖差対策の羽織りもの、動きやすさなど）
3. 「今日も元気にいってらっしゃい！」という前向きな応援メッセージ
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });

      const adviceText = response.text || '素敵な一日になりますように！';
      return res.json({ advice: adviceText });
    } catch (error: any) {
      console.error('Gemini API Error:', error);
      return res.status(200).json({
        advice: '今日も自分らしい大すきな髪型とお洋服で、楽しい一日にしようね！笑顔が一番のアクセサリーだよ✨',
      });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
