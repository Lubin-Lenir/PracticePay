import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getGenAIClient(): GoogleGenAI | null {
  const key = process.env.GEMINI_API_KEY;
  if (!key || key === 'MY_GEMINI_API_KEY' || key.trim() === '') {
    return null;
  }
  return new GoogleGenAI({
    apiKey: key,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Endpoint 1: Sahayak Voice AI Coach
  app.post('/api/sahayak', async (req, res) => {
    try {
      const {
        question,
        currentScreen,
        activeMission,
        enteredAmount,
        isScamFlow,
        selectedContact,
        lang,
      } = req.body || {};

      const ai = getGenAIClient();
      if (!ai) {
        return res.json({ fallback: true });
      }

      const langNameMap: Record<string, string> = {
        'en-IN': 'warm conversational Indian English (en-IN)',
        'hi-IN':
          'everyday spoken Hindi in Devanagari script (hi-IN), keeping familiar words like यूपीआई पिन (UPI PIN), क्यूआर कोड (QR Code), पेंडिंग (Pending), and बैंक (Bank) natural',
        'pa-IN':
          'everyday spoken Punjabi in Gurmukhi script (pa-IN), keeping familiar words like ਯੂਪੀਆਈ ਪਿੰਨ (UPI PIN), ਕਿਊਆਰ ਕੋਡ (QR Code), ਪੈਂਡਿੰਗ (Pending), and ਬੈਂਕ (Bank) natural',
        'mr-IN':
          'everyday spoken Marathi in Devanagari script (mr-IN), keeping familiar words like यूपीआय पिन (UPI PIN), क्यूआर कोड (QR Code), पेंडिंग (Pending), and बँक (Bank) natural',
      };

      const systemInstruction = `You are "Sahayak", a warm, patient, jargon-free digital payment coach inside "PracticePay" (a safe-to-fail UPI simulator with ₹10,000 play money and no real bank linked).
Reply strictly in ${langNameMap[lang] || langNameMap['en-IN']} in 2 to 3 short, reassuring sentences suitable for reading aloud via Text-to-Speech.
Live App State:
- Current Screen: ${currentScreen}
- Active Practice Mission: ${activeMission || 'None (Free Exploration)'}
- Entered Amount: ₹${enteredAmount || '0'}
- Selected Contact: ${selectedContact || 'None'}
- Is Scam Flow Active: ${Boolean(isScamFlow)}
Core UPI Golden Rules to reinforce when relevant:
1. You NEVER enter your UPI PIN to receive money. Entering a UPI PIN only deducts money from your bank.
2. Pressing Cancel on the dark-blue NPCI UPI PIN screen deducts ₹0.
3. Never pay a second time immediately when a transaction is "Pending".`;

      let response;
      try {
        response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: String(question || 'Help me understand this screen.'),
          config: {
            systemInstruction,
          },
        });
      } catch {
        response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: String(question || 'Help me understand this screen.'),
          config: {
            systemInstruction,
          },
        });
      }

      const text = response.text?.trim();
      if (!text) {
        return res.json({ fallback: true });
      }
      return res.json({ reply: text, fallback: false });
    } catch (error) {
      console.error('Sahayak API fallback triggered:', error);
      return res.json({ fallback: true });
    }
  });

  // Endpoint 2: Multimodal Scam Shield (Text or Base64 Image)
  app.post('/api/scam-shield', async (req, res) => {
    try {
      const { messageText, imageBase64, mimeType, lang } = req.body || {};

      const ai = getGenAIClient();
      if (!ai) {
        return res.json({ fallback: true });
      }

      const langNameMap: Record<string, string> = {
        'en-IN': 'Indian English (en-IN)',
        'hi-IN': 'simple spoken Hindi in Devanagari script (hi-IN)',
        'pa-IN': 'simple spoken Punjabi in Gurmukhi script (pa-IN)',
        'mr-IN': 'simple spoken Marathi in Devanagari script (mr-IN)',
      };

      const parts: Array<
        | { text: string }
        | { inlineData: { mimeType: string; data: string } }
      > = [];

      if (imageBase64 && mimeType) {
        parts.push({
          inlineData: {
            mimeType: String(mimeType),
            data: String(imageBase64),
          },
        });
      }

      parts.push({
        text: `Analyze this SMS / WhatsApp message or UPI screenshot for potential digital payment fraud: "${messageText || 'Analyze the uploaded screenshot image.'}". Respond in ${langNameMap[lang] || 'Indian English'} as JSON.`,
      });

      const config = {
        systemInstruction: `You are Sahayak Multimodal Scam Shield. Analyze the user's message or screenshot and explain clearly in ${langNameMap[lang] || 'Indian English'} whether it is a scam or safe.`,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            verdict: {
              type: Type.STRING,
              description: 'Either DANGER_SCAM or SAFE',
            },
            verdictLabel: {
              type: Type.STRING,
              description: 'Short headline verdict in the target language',
            },
            explanation: {
              type: Type.STRING,
              description:
                '2-3 warm, clear sentences explaining why it is a scam or safe in the target language',
            },
            redFlags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '2-3 specific red flags or safety checks in the target language',
            },
          },
          required: ['verdict', 'verdictLabel', 'explanation', 'redFlags'],
        },
      };

      let response;
      try {
        response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: { parts },
          config,
        });
      } catch {
        response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: { parts },
          config,
        });
      }

      const raw = (response.text ?? '').trim();
      if (!raw) {
        return res.json({ fallback: true });
      }
      const parsed = JSON.parse(raw);
      return res.json({ result: parsed, fallback: false });
    } catch (error) {
      console.error('Scam Shield API fallback triggered:', error);
      return res.json({ fallback: true });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`PracticePay server running on http://localhost:${PORT}`);
  });
}

startServer();
