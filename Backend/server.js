
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import OpenAI from "openai";

// ==================================================
// LOAD ENVIRONMENT VARIABLES
// ==================================================

dotenv.config();

if (!process.env.OPENAI_API_KEY) {
    console.error("OPENAI_API_KEY is missing from environment variables.");
}

// ==================================================
// CREATE APP
// ==================================================

const app = express();

app.use(cors());
app.use(express.json());

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 15 * 1024 * 1024
    },
    fileFilter: (req, file, callback) => {
        if (file.mimetype !== "application/pdf") {
            return callback(new Error("Please upload a PDF file."));
        }
        callback(null, true);
    }
});

// ==================================================
// OPENAI CLIENT
// ==================================================

const ai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// ==================================================
// MODULE OUTLINE EXTRACTION PROMPT
// Define this BEFORE registering the route.
// ==================================================

const prompt = `
You are Prodemic, an AI academic planning assistant.

Read the attached university module outline carefully.
Extract information accurately. Do not invent information.

Return ONLY valid JSON. Do not use Markdown or code fences.
Use exactly this structure:

{
  "moduleName": null,
  "moduleCode": null,
  "moduleSummary": null,
  "semester": null,
  "colour": null,
  "lecturers": [],
  "tutors": [],
  "consultationHours": [],
  "lectures": [],
  "lectureTimes": [],
  "assessments": [],
  "academicEvents": []
}

RULES:

1. moduleName: Complete official module name.
2. moduleCode: Official module code.
3. moduleSummary: Concise summary based only on the document.
4. semester: Extract the semester if explicitly stated; otherwise null.
5. colour: Return null unless the document explicitly specifies a module colour.
6. lecturers: Include people explicitly identified as lecturers, module
   coordinators, course coordinators, or academic teaching staff.
   Each entry should contain name and email. Return [] if none.
7. tutors: Include only people explicitly identified as tutors,
   teaching assistants, or tutorial staff. Do not infer tutor roles.
   Each entry should contain name and email. Return [] if none.
8. consultationHours: Extract office or consultation hours.
   Each entry should contain person, day, startTime, endTime, location.
9. lectures: Extract class timetable entries with day, startTime,
   endTime, venue, and description. Return [] if none.
10. lectureTimes: Include the lecture timetable information as well
    when it is present. Use the same field names as lectures.
11. assessments: Extract only genuinely assessed activities.
    Preserve their actual titles, descriptions, due dates, and weights.
    Examples of titles include "Test 1", "Test 2", "PRD", and "Exam".
    Each entry should contain title, type, description, dueDate, weight.
    Return [] if none.
12. academicEvents: Extract relevant academic calendar events such as
    study breaks, semester breaks, examination periods, and holidays.
    Each entry should contain title, type, startDate, endDate,
    description. Return [] if none.
13. Use null for unavailable individual fields.
14. Use [] for categories with no matching information.
15. Do not confuse academic events with assessments.
16. Preserve dates, names, and details accurately.
`;

// ==================================================
// HEALTH CHECK
// ==================================================

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Prodemic backend is running."
    });
});

// ==================================================
// TEST OPENAI CONNECTION
// ==================================================

app.get("/test-openai", async (req, res) => {
    try {
        const response = await ai.responses.create({
            model: "gpt-4.1-mini",
            input: "Reply with the word WORKING."
        });

        res.json({
            success: true,
            message: response.output_text
        });
    } catch (error) {
        console.error("OPENAI TEST ERROR:", error.message);

        res.status(500).json({
            success: false,
            message: "OpenAI connection failed."
        });
    }
});

// ==================================================
// ANALYSE MODULE PDF
// ==================================================

app.post(
    "/analyse-module",
    upload.single("pdf"),
    async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: "No PDF was uploaded."
                });
            }

            console.log(
                "Analysing uploaded PDF:",
                req.file.originalname
            );

            const pdfData = req.file.buffer.toString("base64");

            const response = await ai.responses.create({
                model: "gpt-4.1-mini",
                input: [
                    {
                        role: "user",
                        content: [
                            {
                                type: "input_text",
                                text: prompt
                            },
                            {
                                type: "input_file",
                                filename: req.file.originalname,
                                file_data:
                                    `data:application/pdf;base64,${pdfData}`
                            }
                        ]
                    }
                ]
            });

            const result = response.output_text;

            if (!result) {
                throw new Error(
                    "OpenAI returned an empty response."
                );
            }

            const cleanedResponse = result
                .replace(/```json/gi, "")
                .replace(/```/g, "")
                .trim();

            const moduleData = JSON.parse(cleanedResponse);

            console.log("Module outline analysed successfully.");

            return res.json({
                success: true,
                data: moduleData
            });

        } catch (error) {
            console.error("MODULE ANALYSIS ERROR:", error);

            return res.status(500).json({
                success: false,
                message: "Could not analyse the module outline. Please try again."
            });
        }
    }
);

// ==================================================
// ERROR HANDLER
// ==================================================

app.use((error, req, res, next) => {
    console.error("SERVER ERROR:", error.message);

    if (error.message === "Please upload a PDF file.") {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }

    if (error.code === "LIMIT_FILE_SIZE") {
        return res.status(413).json({
            success: false,
            message: "PDF must be 15 MB or smaller."
        });
    }

    res.status(500).json({
        success: false,
        message: "An unexpected server error occurred."
    });
});

// ==================================================
// START SERVER
// ==================================================

const PORT = process.env.PORT || 10000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Prodemic server running on port ${PORT}`);
});
