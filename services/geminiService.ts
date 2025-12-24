
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { BlessingResult, HalachaResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const blessingSchema: Schema = {
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
      description: "The FULL text of the first blessing in the requested language (Hebrew or English transliteration/translation as appropriate for the context, but usually Hebrew text is preferred for the blessing itself, unless user asks for English. For this app, keep Bracha Text in Hebrew always, but titles/tips in requested language).",
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
      description: "A short, helpful Halachic tip regarding this food in the requested output language.",
    },
    category: {
      type: Type.STRING,
      enum: ["fruit", "vegetable", "grain", "drink", "sweet", "other"],
      description: "The general category of the food",
    },
  },
  required: ["foodName", "brachaRishonaTitle", "brachaRishonaText", "brachaAcharonaTitle", "brachaAcharonaText", "tip", "category"],
};

const halachaSchema: Schema = {
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
  try {
    const langInstruction = language === 'he' 
      ? "Output fields (foodName, titles, tip) must be in Hebrew." 
      : "Output fields (foodName, titles, tip) must be in English. However, keep the actual 'brachaRishonaText' and 'brachaAcharonaText' content in Hebrew script (Lashon Kodesh) as blessings are recited in Hebrew.";

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Identify the correct Jewish blessings (Halacha) for the following food item or dish: "${query}". 
      Provide the Bracha Rishona, Bracha Acharona, and a useful tip. ${langInstruction}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: blessingSchema,
        systemInstruction: "You are an expert Orthodox Rabbi and Halachic authority. Provide accurate information about blessings. Provide the FULL Hebrew text for the blessing texts themselves.",
      },
    });

    const jsonText = response.text;
    if (!jsonText) {
      throw new Error("No data returned from Gemini");
    }

    return JSON.parse(jsonText) as BlessingResult;
  } catch (error) {
    console.error("Error fetching blessing info:", error);
    throw error;
  }
};

export const askHalacha = async (query: string, language: 'he' | 'en' = 'he'): Promise<HalachaResult> => {
  try {
    const langInstruction = language === 'he' ? "Output in Hebrew." : "Output in English.";

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Answer the following Halachic question: "${query}". Provide a clear practical ruling, reasoning, and sources. ${langInstruction}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: halachaSchema,
        systemInstruction: "You are a knowledgeable Orthodox Rabbi. Answer questions according to mainstream Halacha. Be respectful, clear, and concise.",
      }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No data returned");
    return JSON.parse(jsonText) as HalachaResult;
  } catch (error) {
    console.error("Error fetching halacha info:", error);
    throw error;
  }
};
