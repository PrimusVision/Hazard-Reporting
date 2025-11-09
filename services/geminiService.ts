
import { GoogleGenAI, Type } from "@google/genai";
import { type Hazard } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const PROMPT = `You are an expert safety officer. Analyze this image from a worksite. 
Identify any unsafe acts (dangerous actions by people) and unsafe conditions (hazardous environmental states).
For each hazard found, provide its type ('Unsafe Act' or 'Unsafe Condition'), a brief description, and a severity level ('Low', 'Medium', 'High').
If no hazards are found, return an empty array. Respond in JSON format only.`;

const HAZARD_SCHEMA = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      type: {
        type: Type.STRING,
        enum: ['Unsafe Act', 'Unsafe Condition'],
        description: 'The category of the hazard.'
      },
      description: {
        type: Type.STRING,
        description: 'A concise explanation of the hazard.'
      },
      severity: {
        type: Type.STRING,
        enum: ['Low', 'Medium', 'High'],
        description: 'The assessed risk level of the hazard.'
      },
    },
    required: ['type', 'description', 'severity'],
  },
};

export async function analyzeImageForHazards(base64Image: string): Promise<Hazard[]> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          { text: PROMPT },
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image,
            },
          },
        ],
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: HAZARD_SCHEMA,
      },
    });

    const jsonText = response.text.trim();
    if (!jsonText) {
      return [];
    }
    const parsedJson = JSON.parse(jsonText);
    return parsedJson as Hazard[];
  } catch (error) {
    console.error("Gemini API call failed:", error);
    throw new Error("Failed to get analysis from Gemini API.");
  }
}
