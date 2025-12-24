import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { BlessingResult, HalachaResult } from "../types";

// תיקון הגישה למפתח ה-API עבור Vercel ו-Vite
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

const blessingSchema = {
  type: SchemaType.OBJECT,
  properties: {
    foodName: { type: SchemaType.STRING, description: "The name of the food" },
    brachaRishonaTitle: { type: SchemaType.STRING, description: "The short name of the first blessing" },
    brachaRishonaText: { type: SchemaType.STRING, description: "The FULL text of the first blessing in Hebrew" },
    brachaAcharonaTitle: { type: SchemaType.STRING, description: "The short name of the last blessing" },
    brachaAcharonaText: { type: SchemaType.STRING, description: "The FULL text of the last blessing in Hebrew." },
    tip: { type: SchemaType.STRING, description: "A short, helpful Halachic tip" },
    category: {
      type: SchemaType.STRING,
      description: "Category: fruit, vegetable, grain, drink, sweet, other",
      enum: ["fruit", "vegetable", "grain", "drink", "sweet", "other"],
    },
  },
  required: ["foodName", "brachaRishonaTitle", "brachaRishonaText", "brachaAcharonaTitle", "brachaAcharonaText", "tip", "category"],
};

const halachaSchema = {
  type: SchemaType.OBJECT,
  properties: {
    question: { type: SchemaType.STRING, description: "The question" },
    answer: { type: SchemaType.STRING, description: "The answer" },
    summary: { type: SchemaType.STRING, description: "The reasoning" },
    sources: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING }, description: "Sources" }
  },
  required: ["question", "answer", "summary", "sources"]
};

export const getBlessingInfo = async (query: string, language: 'he' | 'en' = 'he'): Promise<BlessingResult> => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const prompt = `Identify blessings for: "${query}". Output in ${language}.`;
  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: { responseMimeType: "application/json", responseSchema: blessingSchema }
  });
  return JSON.parse(result.response.text());
};

export const getHalachicAnswer = async (query: string, language: 'he' | 'en' = 'he'): Promise<HalachaResult> => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const prompt = `Answer Halachic question: "${query}". Output in ${language}.`;
  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: { responseMimeType: "application/json", responseSchema: halachaSchema }
  });
  return JSON.parse(result.response.text());
};