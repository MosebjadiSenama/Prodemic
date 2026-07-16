import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
//==================================================
// PDF IMPORTS
//==================================================

import fetch from "node-fetch";

import emailRoutes from "./routes/auth.js";

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json({ limit: "10mb" }));

//==================================================
// GEMINI
//==================================================

const genAI = new GoogleGenerativeAI(

    process.env.GEMINI_API_KEY

);

//==================================================
// ROUTES
//==================================================

app.use(

    "/",

    emailRoutes

);

//==================================================
// TEST
//==================================================

app.get("/", (req, res) => {

    res.send("🚀 Prodemic Backend Running");

});

//==================================================
// MODULE OUTLINE AI
//==================================================

app.post(

    "/module-outline",

    async (req, res) => {

        try {

            const { text } = req.body;

            if (!text) {

                return res.status(400).json({

                    error: "Module outline is required."

                });

            }

            const model = genAI.getGenerativeModel({

                model: "gemini-2.5-flash"

            });

            const prompt = `

You are Prodemic AI.

Extract information from this university module outline.

Return ONLY valid JSON.

{

"moduleName":"",

"moduleCode":"",

"moduleSummary":"",

"lecturer":"",

"email":"",

"consultation":"",

"lectureTimes":[

{

"day":"",

"startTime":"",

"endTime":"",

"venue":""

}

],

"assessments":[

{

"title":"",

"type":"",

"weight":"",

"dueDate":""

}

]

}

Module Outline:

${text}

`;

            const result = await model.generateContent(

                prompt

            );

            let response = result.response.text();

            console.log("================ GEMINI RAW RESPONSE ================");
console.log(response);
console.log("=====================================================");

            response = response

                .replace(/```json/gi, "")

                .replace(/```/g, "")

                .trim();

            const moduleData = JSON.parse(

                response

            );

            moduleData.moduleName ??= null;
            moduleData.moduleCode ??= null;
            moduleData.moduleSummary ??= null;
            moduleData.lecturer ??= null;
            moduleData.email ??= null;
            moduleData.consultation ??= null;

            if (

                !Array.isArray(

                    moduleData.lectureTimes

                )

            ) {

                moduleData.lectureTimes = [];

            }

            if (

                !Array.isArray(

                    moduleData.assessments

                )

            ) {

                moduleData.assessments = [];

            }

            res.json(

                moduleData

            );

        }

        catch (error) {

            console.error(error);

            res.status(500).json({

                error: error.message

            });

        }

    }

);

//==================================================
// IMPORT TIMETABLE AI
//==================================================

app.post(

    "/import-timetable",

    async(req,res)=>{

        try{

            const { fileURL } = req.body;

            if(!fileURL){

                return res.status(400).json({

                    error:"Timetable URL is required."

                });

            }

            const model = genAI.getGenerativeModel({

                model:"gemini-2.5-flash"

            });
//==================================================
// DOWNLOAD PDF FROM SUPABASE
//==================================================

const pdfResponse = await fetch(fileURL);

const pdfBuffer = Buffer.from(
    await pdfResponse.arrayBuffer()
);

//==================================================
// SEND PDF TO GEMINI
//==================================================

const result = await model.generateContent([

    {
        inlineData:{

            mimeType:"application/pdf",

            data:pdfBuffer.toString("base64")

        }
    },

    {

        text:`

You are Prodemic AI.

Read this university timetable PDF.

Extract EVERY lecture.

Return ONLY valid JSON.

{

    "lectures":[

        {

            "moduleCode":"",

            "moduleName":"",

            "day":"",

            "startTime":"",

            "endTime":"",

            "venue":""

        }

    ]

}

`

    }

]);



            let response = result.response.text();
//==================================================
// DEBUG GEMINI RESPONSE
//==================================================

console.log(response);

            response = response

                .replace(/```json/gi,"")

                .replace(/```/g,"")

                .trim();

            const timetable = JSON.parse(response);

            timetable.lectures ??= [];

            res.json(timetable);

        }

        catch(error){

            console.error(error);

            res.status(500).json({

                error:error.message

            });

        }

    }

);

//==================================================
// START SERVER
//==================================================

const PORT = process.env.PORT || 3000;

app.listen(

    PORT,

    () => {

        console.log(

            `🚀 Backend running on http://localhost:${PORT}`

        );

    }

);