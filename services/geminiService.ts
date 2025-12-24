import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { BlessingResult, HalachaResult } from "../types";

// Using process.env.API_KEY as required by guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const blessingSchema = {
  type: Type.OBJECT,
  properties: {
    foodName: { type: Type.STRING, description: "The name of the food" },
    brachaRishonaTitle: { type: Type.STRING, description: "The short name of the first blessing" },
    brachaRishonaText: { type: Type.STRING, description: "The FULL text of the first blessing in Hebrew" },
    brachaAcharonaTitle: { type: Type.STRING, description: "The short name of the last blessing" },
    brachaAcharonaText: { type: Type.STRING, description: "The FULL text of the last blessing in Hebrew." },
    tip: { type: Type.STRING, description: "A short, helpful Halachic tip" },
    category: {
      type: Type.STRING,
      description: "Category: fruit, vegetable, grain, drink, sweet, other",
      enum: ["fruit", "vegetable", "grain", "drink", "sweet", "other"],
    },
  },
  required: ["foodName", "brachaRishonaTitle", "brachaRishonaText", "brachaAcharonaTitle", "brachaAcharonaText", "tip", "category"],
};

const halachaSchema = {
  type: Type.OBJECT,
  properties: {
    question: { type: Type.STRING, description: "The question" },
    answer: { type: Type.STRING, description: "The answer" },
    summary: { type: Type.STRING, description: "The reasoning" },
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

  const text = response.text;
  if (!text) {
    throw new Error("No response from Gemini");
  }
  return JSON.parse(text);
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

  const text = response.text;
  if (!text) {
    throw new Error("No response from Gemini");
  }
  return JSON.parse(text);
};