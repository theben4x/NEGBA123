import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { BlessingResult, HalachaResult } from "../types";

// הגדרת ה-AI עם המפתח והמרת סוג למניעת שגיאות
const ai = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY as string);

const blessingSchema = {
  type: SchemaType.OBJECT,
  properties: {
    foodName: {
      type: SchemaType.STRING,
      description: "The name of the food",
    },
    brachaRishonaTitle: {
      type: SchemaType.STRING,
      description: "The short name of the first blessing (e.g., Shehakol, HaEtz)",
    },
    brachaRishonaText: {
      type: SchemaType.STRING,
      description: "The FULL text of the first blessing in Hebrew",
    },
    brachaAcharonaTitle: {
      type: SchemaType.STRING,
      description: "The short name of the last blessing",
    },
    brachaAcharonaText: {
      type: SchemaType.STRING,
      description: "The FULL text of the last blessing in Hebrew.",
    },
    tip: {
      type: SchemaType.STRING,
      description: "A short, helpful Halachic tip regarding this food.",
    },
    category: {
      type: SchemaType.STRING,
      enum: ["fruit", "vegetable", "grain", "drink", "sweet", "other"],
      description: "The general category of the food",
    },
  },
  required: ["foodName", "brachaRishonaTitle", "brachaRishonaText", "brachaAcharonaTitle", "brachaAcharonaText", "tip", "category"],
};

const halachaSchema = {
  type: SchemaType.OBJECT,
  properties: {
    question: { type: SchemaType.STRING, description: "The user's question reformulated clearly" },
    answer: { type: SchemaType.STRING, description: "The practical Halachic ruling (Psak)" },
    summary: { type: SchemaType.STRING, description: "A brief explanation of the reasoning" },
    sources: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
      description: "List of authoritative sources"
    }
  },
  required: ["question", "answer", "summary", "sources"]
};

export const getBlessingInfo = async (query: string, language: 'he' | 'en' = 'he'): Promise<BlessingResult> => {
  const model = ai.getGenerativeModel({
    model: "gemini-1.5-flash", // שימוש במודל יציב
  });

  const langInstruction = language === 'he' 
    ? "Output fields (foodName, titles, tip) must be in Hebrew." 
    : "Output fields (foodName, titles, tip) must be in English. Keep blessings in Hebrew script.";

  const prompt = `Identify the correct Jewish blessings for: "${query}". ${langInstruction}`;

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: blessingSchema,
    },
  });

  return JSON.parse(result.response.text());
};

export const getHalachicAnswer = async (query: string, language: 'he' | 'en' = 'he'): Promise<HalachaResult> => {
  const model = ai.getGenerativeModel({
    model: "gemini-1.5-flash",
  });

  const langInstruction = language === 'he' ? "Output in Hebrew." : "Output in English.";
  const prompt = `Answer this Halachic question: "${query}". ${langInstruction}`;

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: halachaSchema,
    },
  });

  return JSON.parse(result.response.text());
};