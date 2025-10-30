import { google } from "@ai-sdk/google";

// Membuat instance Gemini dengan API key dari .env.local
export const gemini = (model: string) =>
  google(model, {
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY!,
  });
