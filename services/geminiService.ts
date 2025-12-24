import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { BlessingResult, HalachaResult } from "../types";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

const blessingSchema = {
  type: SchemaType.OBJECT,
  properties: {
    foodName: { type: SchemaType.STRING, description: "The name of the food" },
    brachaRishonaTitle: { type: SchemaType.STRING, description: "Short title" },
    brachaRishonaText: { type: SchemaType.STRING, description: "Full Hebrew text" },
    brachaAcharonaTitle: { type: SchemaType.STRING, description: "Short title" },
    brachaAcharonaText: { type: SchemaType.STRING, description: "Full Hebrew text" },
    tip: { type: SchemaType.STRING, description: "Halachic tip" },
    category: {
      type: SchemaType.STRING,
      enum: ["fruit", "vegetable", "grain", "drink", "sweet", "other"],
      description: "Food category",
    },
  },
  required: ["foodName", "brachaRishonaTitle", "brachaRishonaText", "brachaAcharonaTitle", "brachaAcharonaText", "tip", "category"],
};

const halachaSchema = {
  type: SchemaType.OBJECT,
  properties: {
    question: { type: SchemaType.STRING, description: "Question" },
    answer: { type: SchemaType.STRING, description: "Answer" },
    summary: { type: SchemaType.STRING, description: "Reasoning" },
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