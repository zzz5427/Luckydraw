
import { GoogleGenAI, Type } from "@google/genai";


const getAIClient = () => {
  const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY || '';
  return new GoogleGenAI({ apiKey });
};

export const generateTeamNames = async (count: number, theme: string = "corporate") => {
  try {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: `Generate ${count} creative and fun team names for a corporate event. Theme: ${theme}. Return them as a JSON array of strings.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });

    return JSON.parse(response.text());
  } catch (error) {
    console.error("Gemini Error:", error);
    return Array.from({ length: count }, (_, i) => `Team ${i + 1}`);
  }
};
