import express from "express";
import { GoogleGenAI } from "@google/genai";

const router = express.Router();

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

router.post("/", async (req, res) => {

    try {

        const { text } = req.body;

        if (!text || text.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Please paste a module outline."
            });
        }

        const prompt = `
You are an academic planning assistant.

Read the following university module outline.

Extract:

- Module name
- Every assignment
- Every test
- Every quiz
- Every practical
- Every tutorial
- Every exam
- Every project
- Every presentation
- Every important due date

Return ONLY valid JSON.

Example:

{
  "moduleName": "Interactive Media",
  "tasks": [
    {
      "title": "Assignment 1",
      "description": "Create a website",
      "dueDate": "2026-08-15",
      "priority": "High"
    }
  ]
}

Module Outline:

${text}
`;

        const result = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt
        });

        const aiText = result.text;

        res.json({
            success: true,
            response: aiText
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

});

export default router;