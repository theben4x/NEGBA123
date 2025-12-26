import { GoogleGenerativeAI } from "@google/generative-ai";
import { BlessingResult, HalachaResult } from "../types";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash",
});

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

export const getBlessingInfo = async (query: string): Promise<BlessingResult> => {
  const prompt = `Identify blessings for: "${query}". Output in Hebrew.`;
  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: blessingSchema,
    }
  });
  return JSON.parse(result.response.text());
};

export const getHalachicAnswer = async (query: string): Promise<HalachaResult> => {
  const prompt = `Answer Halachic question: "${query}". Output in Hebrew.`;
  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: halachaSchema,
    }
  });
  return JSON.parse(result.response.text());
};