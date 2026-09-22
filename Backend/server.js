import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import OpenAI from "openai";


// ==================================================
// LOAD ENVIRONMENT VARIABLES
// ==================================================

dotenv.config();


// ==================================================
// CREATE EXPRESS APP
// ==================================================

const app = express();

app.use(cors());

app.use(express.json());


// ==================================================
// STORE UPLOADED PDF IN MEMORY
// ==================================================

const upload = multer({
    storage: multer.memoryStorage()
});


// ==================================================
// CONNECT TO OPENAI
// ==================================================

const ai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// ==================================================
// TEST OPENAI CONNECTION
// ==================================================

async function testOpenAI() {

    try {

        const response = await ai.responses.create({

            // Model we are testing
            model: "gpt-4.1-mini",

            // Very small test request
            input: "Reply with the word WORKING."

        });


        console.log(
            "OPENAI TEST:",
            response.output_text
        );


    } catch (error) {

        console.error(
            "OPENAI TEST ERROR:",
            error.message
        );

    }

}


// Run the OpenAI test

testOpenAI();

// ==================================================
// ANALYSE MODULE
// ==================================================

app.post(
    "/analyse-module",
    upload.single("pdf"),
    async function (req, res) {

        try {

            // Check that a PDF was uploaded
            if (!req.file) {

                return res.status(400).json({
                    success: false,
                    message: "No PDF was uploaded."
                });

            }

            // Convert PDF to base64
            const pdfData = req.file.buffer.toString("base64");


            // ==================================================
            // PROMPT
            // ==================================================

            const prompt = `

You are Prodemic, an AI academic planning assistant.

Read the attached university module outline carefully.

Extract the information below.

IMPORTANT:
Return ONLY valid JSON.
Do NOT use markdown.
Do NOT use code blocks.
Do NOT write anything before or after the JSON.

Use EXACTLY this structure:

{
    "moduleName": null,
    "moduleCode": null,
    "moduleSummary": null,

    "lecturers": [
        {
            "name": null,
            "email": null
        }
    ],

    "tutors": [
        {
            "name": null,
            "email": null
        }
    ],

    "consultationHours": [
        {
            "person": null,
            "day": null,
            "startTime": null,
            "endTime": null,
            "location": null
        }
    ],

    "lectures": [
        {
            "day": null,
            "startTime": null,
            "endTime": null,
            "venue": null,
            "description": null
        }
    ],

    "assessments": [
        {
            "title": null,
            "type": null,
            "description": null,
            "dueDate": null,
            "weight": null
        }
    ],

    "academicEvents": [
        {
            "title": null,
            "type": null,
            "startDate": null,
            "endDate": null,
            "description": null
        }
    ]
}
RULES:

1. moduleName:
   Extract the complete official module name.

2. moduleCode:
   Extract the official module code.

3. moduleSummary:
   Write a clear, concise summary of what the module is about.
   Use ONLY information found in the module outline.
   Do not invent or add information.


4. lecturers:

   Extract people who are explicitly identified in the module
   outline as lecturers, module coordinators, course coordinators,
   or academic staff responsible for teaching the module.

   For each person include:
   - name
   - email address

   Only classify someone as a lecturer if the module outline
   identifies them as a lecturer, coordinator, or academic teaching
   staff member.

5. tutors:

   Extract people who are EXPLICITLY identified as tutors,
   teaching assistants, tutorial staff, or tutors for the module.

   For each tutor include:
   - name
   - email address

   IMPORTANT:
   Do NOT infer that someone is a tutor simply because their
   email address appears in the document.

   Do NOT place lecturers into the tutors array unless the
   module outline explicitly states that they also have a tutor role.

   If a person is identified only as a lecturer or coordinator,
   they MUST NOT appear in the tutors array.

   If there is no explicit tutor information in the document,
   return:

   "tutors": []

6. consultationHours:
   Extract consultation or office hours for lecturers or tutors.

   Include:
   - person
   - day
   - startTime
   - endTime
   - location

7. lectures:
   Extract ALL lecture/class timetable information.

   For each lecture include:
   - day
   - startTime
   - endTime
   - venue
   - description

   Include recurring lectures as separate entries when appropriate.

8. assessments:

   Extract ONLY activities that are actually assessed.

   Preserve the assessment's actual title/name from the
   module outline.

   For example, if the document says:

   Test 1
   HTML/CSS semantics, layout, and responsiveness

   return:

   {
       "title": "Test 1",
       "type": "Test",
       "description": "HTML/CSS semantics, layout, and responsiveness",
       ...
   }

   Do NOT replace the assessment title with only its type.

   Do NOT return "Test" as the title when the document provides
   a more specific title such as "Test 1", "Test 2", "Assignment 1",
   "PRD Startup Web Site", etc.

9. academicEvents:
   Extract important academic events that affect the student's
   module planning.

   Examples:
   - study breaks
   - research breaks
   - vacations
   - semester breaks
   - examination periods
   - university holidays
   - other important academic calendar events

10. Do NOT confuse academic events with assessments.

11. Do NOT invent information.

12. If a field cannot be found in the module outline, return null.

13. If there are no tutors, return an empty array:
    "tutors": []

14. If there are no lecturers, return an empty array:
    "lecturers": []

15. If there are no lectures, return an empty array:
    "lectures": []

16. Preserve the information from the module outline accurately.

`;


           // Sends the PDF and prompt to OpenAI

console.log("Sending PDF to OpenAI...");

const response = await ai.responses.create({

    // Model we are using
    model: "gpt-4.1-mini",

    // Instructions + PDF
    input: [
        {
            role: "user",

            content: [

                // Our extraction instructions
                {
                    type: "input_text",
                    text: prompt
                },

                // The uploaded PDF
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


console.log("OpenAI responded.");


           
// Get the text returned by OpenAI

const result = response.output_text;

console.log("OpenAI response:");
console.log(result);


            // ==================================================
            // CLEAN RESPONSE
            // ==================================================

            const cleanedResponse = result
                .replace(/```json/g, "")
                .replace(/```/g, "")
                .trim();


            // ==================================================
            // CONVERT RESPONSE INTO JAVASCRIPT OBJECT
            // ==================================================

            const moduleData = JSON.parse(cleanedResponse);


            console.log("✅ Parsed module data:");
            console.log(moduleData);


            // ==================================================
            // SEND DATA TO FRONTEND
            // ==================================================

            res.json({

                success: true,

                data: moduleData

            });


        } catch (error) {

            console.error("OPENAI ERROR:", error);

            res.status(500).json({

                success: false,

                message: error.message

            });

        }

    }
);


// Start server

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Prodemic server running on port ${PORT}`);
});