import { GoogleGenerativeAI } from "@google/generative-ai";
import { BlessingResult, HalachaResult } from "../types";

// אתחול המנוע - משתמשים בשם הנכון ובמפתח של Vite
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash", 
});

// הגדרת הסכימות בצורה פשוטה שעובדת תמיד
const blessingSchema = {
  type: "object",
  properties: {
    foodName: { type: "string" },
    brachaRishonaTitle: { type: "string" },
    brachaRishonaText: { type: "string" },
    brachaAcharonaTitle: { type: "string" },
    brachaAcharonaText: { type: "string" },
    tip: { type: "string" },
    category: {
      type: "string",
      enum: ["fruit", "vegetable", "grain", "drink", "sweet", "other"],
    },
  },
  required: ["foodName", "brachaRishonaTitle", "brachaRishonaText", "brachaAcharonaTitle", "brachaAcharonaText", "tip", "category"],
};

const halachaSchema = {
  type: "object",
  properties: {
    question: { type: "string" },
    answer: { type: "string" },
    summary: { type: "string" },
    sources: { type: "array", items: { type: "string" } }
  },
  required: ["question", "answer", "summary", "sources"]
};

export const getBlessingInfo = async (query: string, language: 'he' | 'en' = 'he'): Promise<BlessingResult> => {
  const prompt = `Identify blessings for: "${query}". Output in ${language}.`;
  
  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: blessingSchema,
    }
  });

  const responseText = result.response.text();
  return JSON.parse(responseText);
};

export const getHalachicAnswer = async (query: string, language: 'he' | 'en' = 'he'): Promise<HalachaResult> => {
  const prompt = `Answer Halachic question: "${query}". Output in ${language}.`;
  
  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: halachaSchema,
    }
  });

  const responseText = result.response.text();
  return JSON.parse(responseText);
};