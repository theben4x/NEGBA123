import { GoogleGenAI, Type } from "@google/genai";
import { BlessingResult, HalachaResult } from "../types";

// Initialize the Google GenAI client
// The API key is obtained from the environment variable process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const blessingSchema = {
  type: Type.OBJECT,
  properties: {
    foodName: {
      type: Type.STRING,
      description: "The name of the food",
    },
    brachaRishonaTitle: {
      type: Type.STRING,
      description: "The short name of the first blessing (e.g., Shehakol, HaEtz)",
    },
    brachaRishonaText: {
      type: Type.STRING,
      description: "The FULL text of the first blessing in Hebrew",
    },
    brachaAcharonaTitle: {
      type: Type.STRING,
      description: "The short name of the last blessing",
    },
    brachaAcharonaText: {
      type: Type.STRING,
      description: "The FULL text of the last blessing in Hebrew.",
    },
    tip: {
      type: Type.STRING,
      description: "A short, helpful Halachic tip regarding this food.",
    },
    category: {
      type: Type.STRING,
      description: "The general category of the food. Must be one of: fruit, vegetable, grain, drink, sweet, other",
      enum: ["fruit", "vegetable", "grain", "drink", "sweet", "other"],
    },
  },
  required: ["foodName", "brachaRishonaTitle", "brachaRishonaText", "brachaAcharonaTitle", "brachaAcharonaText", "tip", "category"],
};

const halachaSchema = {
  type: Type.OBJECT,
  properties: {
    question: { type: Type.STRING, description: "The user's question reformulated clearly" },
    answer: { type: Type.STRING, description: "The practical Halachic ruling (Psak)" },
    summary: { type: Type.STRING, description: "A brief explanation of the reasoning" },
    sources: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of authoritative sources"
    }
  },
  required: ["question", "answer", "summary", "sources"]
};

export const getBlessingInfo = async (query: string, language: 'he' | 'en' = 'he'): Promise<BlessingResult> => {
  const langInstruction = language === 'he' 
    ? "Output fields (foodName, titles, tip) must be in Hebrew." 
    : "Output fields (foodName, titles, tip) must be in English. Keep blessings in Hebrew script.";

  const prompt = `Identify the correct Jewish blessings for: "${query}". ${langInstruction}`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: blessingSchema,
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error("Failed to generate content");
  }
  
  return JSON.parse(text);
};

export const getHalachicAnswer = async (query: string, language: 'he' | 'en' = 'he'): Promise<HalachaResult> => {
  const langInstruction = language === 'he' ? "Output in Hebrew." : "Output in English.";
  const prompt = `Answer this Halachic question: "${query}". ${langInstruction}`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: halachaSchema,
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error("Failed to generate content");
  }
  
  return JSON.parse(text);
};