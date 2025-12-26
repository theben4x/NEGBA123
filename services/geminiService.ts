import { GoogleGenAI, Type } from "@google/genai";
import { BlessingResult, HalachaResult } from "../types";

// The API key must be obtained exclusively from the environment variable process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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

export const getBlessingInfo = async (query: string, language: string = 'he'): Promise<BlessingResult> => {
  const prompt = `Identify blessings for: "${query}". Output in ${language === 'en' ? 'English' : 'Hebrew'}. Return ONLY JSON.`;
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
  throw new Error("No response from AI");
};

export const getHalachicAnswer = async (query: string): Promise<HalachaResult> => {
  const prompt = `Answer Halachic question: "${query}". Output in Hebrew. Return ONLY JSON.`;
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
  throw new Error("No response from AI");
};