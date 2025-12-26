import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { BlessingResult, HalachaResult } from "../types";

// ב-Vercel/Vite משתמשים ב-import.meta.env במקום process.env
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);

// הגדרת המודל - בחוץ משתמשים ב-1.5-flash שהוא יציב
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const blessingSchema = {
  description: "Blessing information",
  type: SchemaType.OBJECT,
  properties: {
    foodName: { type: SchemaType.STRING },
    brachaRishonaTitle: { type: SchemaType.STRING },
    brachaRishonaText: { type: SchemaType.STRING },
    brachaAcharonaTitle: { type: SchemaType.STRING },
    brachaAcharonaText: { type: SchemaType.STRING },
    tip: { type: SchemaType.STRING },
    category: {
      type: SchemaType.STRING,
      enum: ["fruit", "vegetable", "grain", "drink", "sweet", "other"],
    },
  },
  required: ["foodName", "brachaRishonaTitle", "brachaRishonaText", "brachaAcharonaTitle", "brachaAcharonaText", "tip", "category"],
};

const halachaSchema = {
  description: "Halachic answer",
  type: SchemaType.OBJECT,
  properties: {
    question: { type: SchemaType.STRING },
    answer: { type: SchemaType.STRING },
    summary: { type: SchemaType.STRING },
    sources: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } }
  },
  required: ["question", "answer", "summary", "sources"]
};

export const getBlessingInfo = async (query: string, language: string = 'he'): Promise<BlessingResult> => {
  const prompt = `Identify blessings for: "${query}". Output in ${language === 'en' ? 'English' : 'Hebrew'}. Return ONLY JSON.`;
  
  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: blessingSchema,
    },
  });

  const response = result.response;
  return JSON.parse(response.text());
};

export const getHalachicAnswer = async (query: string): Promise<HalachaResult> => {
  const prompt = `Answer Halachic question: "${query}". Output in Hebrew. Return ONLY JSON.`;
  
  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: halachaSchema,
    },
  });

  const response = result.response;
  return JSON.parse(response.text());
};