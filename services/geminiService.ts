import { GoogleGenerativeAI } from "@google/generative-ai";
import { BlessingResult, HalachaResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const blessingSchema = {
  type: Type.OBJECT,
  properties: {
    foodName: { type: Type.STRING, description: "The name of the food" },
    brachaRishonaTitle: { type: Type.STRING, description: "Short title" },
    brachaRishonaText: { type: Type.STRING, description: "Full Hebrew text" },
    brachaAcharonaTitle: { type: Type.STRING, description: "Short title" },
    brachaAcharonaText: { type: Type.STRING, description: "Full Hebrew text" },
    tip: { type: Type.STRING, description: "Halachic tip" },
    category: {
      type: Type.STRING,
      enum: ["fruit", "vegetable", "grain", "drink", "sweet", "other"],
      description: "Food category",
    },
  },
  required: ["foodName", "brachaRishonaTitle", "brachaRishonaText", "brachaAcharonaTitle", "brachaAcharonaText", "tip", "category"],
};

const halachaSchema = {
  type: Type.OBJECT,
  properties: {
    question: { type: Type.STRING, description: "Question" },
    answer: { type: Type.STRING, description: "Answer" },
    summary: { type: Type.STRING, description: "Reasoning" },
    sources: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Sources" }
  },
  required: ["question", "answer", "summary", "sources"]
};

export const getBlessingInfo = async (query: string, language: 'he' | 'en' = 'he'): Promise<BlessingResult> => {
  const prompt = `Identify blessings for: "${query}". Output in ${language}.`;
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: blessingSchema,
    }
  });

  if (response.text) {
    return JSON.parse(response.text);
  }
  throw new Error("Failed to get blessing info");
};

export const getHalachicAnswer = async (query: string, language: 'he' | 'en' = 'he'): Promise<HalachaResult> => {
  const prompt = `Answer Halachic question: "${query}". Output in ${language}.`;
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: halachaSchema,
    }
  });

  if (response.text) {
    return JSON.parse(response.text);
  }
  throw new Error("Failed to get halachic answer");
};
