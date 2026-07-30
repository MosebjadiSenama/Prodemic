import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

console.log("Key loaded:", process.env.GEMINI_API_KEY ? "YES" : "NO");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

try {
  const result = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "Say hello in one sentence.",
  });

  console.log(result.text);
} catch (err) {
  console.error(err);
}