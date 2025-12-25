import { GoogleGenAI, Type } from "@google/genai";
import { BlessingResult, HalachaResult } from "../types";

// Ensure process.env.API_KEY is recognized without conflicting with @types/node
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      API_KEY: string;
    }
  }
}

// אתחול המנוע עם השם הנכון והמפתח המתאים
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// הגדרת המבנה (Schema) בצורה סטנדרטית
const blessingSchema = {
  type: Type.OBJECT,
  properties: {
    foodName: { type: Type.STRING },
    brachaRishonaTitle: { type: Type.STRING },
    brachaRishonaText: { type: Type.STRING },
    brachaAcharonaTitle: { type: Type.STRING },
    brachaAcharonaText: { type: Type.STRING },
    tip: { type: Type.STRING },
    category: {
      type: Type.STRING,
      enum: ["fruit", "vegetable", "grain", "drink", "sweet", "other"],
    },
  },
  required: ["foodName", "brachaRishonaTitle", "brachaRishonaText", "brachaAcharonaTitle", "brachaAcharonaText", "tip", "category"],
};

const halachaSchema = {
  type: Type.OBJECT,
  properties: {
    question: { type: Type.STRING },
    answer: { type: Type.STRING },
    summary: { type: Type.STRING },
    sources: { type: Type.ARRAY, items: { type: Type.STRING } }
  },
  required: ["question", "answer", "summary", "sources"]
};

export const getBlessingInfo = async (query: string, language: 'he' | 'en' = 'he'): Promise<BlessingResult> => {
  const prompt = `Identify blessings for: "${query}". Output in ${language}.`;
  
  const result = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: blessingSchema,
    }
  });

  const responseText = result.text;
  if (!responseText) throw new Error("No response from AI");
  return JSON.parse(responseText);
};

export const getHalachicAnswer = async (query: string, language: 'he' | 'en' = 'he'): Promise<HalachaResult> => {
  const prompt = `Answer Halachic question: "${query}". Output in ${language}.`;
  
  const result = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: halachaSchema,
    }
  });

  const responseText = result.text;
  if (!responseText) throw new Error("No response from AI");
  return JSON.parse(responseText);
};