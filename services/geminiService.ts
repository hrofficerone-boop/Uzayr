import { GoogleGenAI } from "@google/genai";

// Refactored to initialize inside the function to ensure the most up-to-date API key is used
// and upgraded to gemini-3-pro-preview for complex South African payroll and tax reasoning.
export const getPayrollAdvice = async (query: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: query,
      config: {
        systemInstruction: "You are a senior South African Payroll Specialist. Provide concise, accurate advice based on 2024/2025 SARS regulations. Help users navigate compliance, tax brackets, and payroll rules.",
      },
    });
    // Property .text directly returns the extracted string output.
    return response.text;
  } catch (error) {
    console.error("AI Advice Error:", error);
    return "I'm sorry, I'm having trouble connecting to my knowledge base right now. Please refer to the SARS website directly.";
  }
};