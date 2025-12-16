import { GoogleGenAI } from "@google/genai";
import { RFMSegment } from "../types";

const createClient = () => {
  const apiKey = process.env.API_KEY || ''; // In a real app, ensure this is set safely
  if (!apiKey) {
    console.warn("API Key is missing for Gemini");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateCampaignStrategy = async (segment: RFMSegment) => {
  const ai = createClient();
  if (!ai) return "Simulated AI Response: API Key missing. Please configure your environment.";

  try {
    const prompt = `
      Act as a Senior CRM Strategist for Bank Sumut (North Sumatra Regional Bank).
      We are targeting Gen Z customers.
      
      Generate a short, punchy marketing strategy for the customer segment: "${segment}".
      
      Include:
      1. One catchy Campaign Title (using local Medan slang/language if appropriate but keep it cool).
      2. The core message (Value Proposition).
      3. A recommended "Mission" or "Challenge" for the gamified app to drive engagement.
      
      Keep it brief and formatted in Markdown.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error generating insight. Please try again later.";
  }
};
