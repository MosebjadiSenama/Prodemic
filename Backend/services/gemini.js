import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

console.log("API Key loaded:", process.env.GEMINI_API_KEY ? "YES" : "NO");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

export default ai;