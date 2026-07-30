import { auth } from "../firebase.js";
import { supabase } from "./supabase.js";

/*==================================================
                    ELEMENTS
==================================================*/

const backBtn = document.getElementById("backBtn");

const uploadPDF = document.getElementById("uploadPDF");
const pdfInput = document.getElementById("pdfInput");
const pdfName = document.getElementById("pdfName");

const takePhoto = document.getElementById("takePhoto");
const cameraInput = document.getElementById("cameraInput");
const cameraName = document.getElementById("cameraName");

const manualEntry = document.getElementById("manualEntry");

const continueBtn = document.getElementById("continueBtn");
/*==================================================
                AI DATA
==================================================*/

const aiData = {

    module: null,

    lectures: [],

    assessments: [],

    weeklyTopics: [],

    summary: ""

};
/*==================================================
                    APP STATE
==================================================*/

const uploadState = {

    method: null,

    file: null,

    fileName: "",

    fileURL: "",

    recordId: null,

    uploaded: false

};

/*==================================================
                INITIALISE
==================================================*/

continueBtn.disabled = true;

/*==================================================
                HELPERS
==================================================*/

function clearSelection() {

    uploadPDF.classList.remove("active");
    takePhoto.classList.remove("active");
    manualEntry.classList.remove("active");

}

function updateContinueButton() {

    continueBtn.disabled = !uploadState.uploaded;

}

/*==================================================
                    BACK
==================================================*/

backBtn.addEventListener("click", () => {

    window.location.href = "07 home.html";

});

/*==================================================
                PDF CARD
==================================================*/

uploadPDF.addEventListener("click", () => {

    clearSelection();

    uploadPDF.classList.add("active");

    pdfInput.click();

});

/*==================================================
                CAMERA CARD
==================================================*/

takePhoto.addEventListener("click", () => {

    clearSelection();

    takePhoto.classList.add("active");

    cameraInput.click();

});

/*==================================================
            MANUAL ENTRY
==================================================*/

manualEntry.addEventListener("click", () => {

    clearSelection();

    manualEntry.classList.add("active");

    window.location.href = "12 manualTimetable.html";

});

/*==================================================
                PDF SELECTED
==================================================*/

pdfInput.addEventListener("change", async () => {

    const file = pdfInput.files[0];

    if (!file) return;

    uploadState.method = "pdf";
    uploadState.file = file;
    uploadState.fileName = file.name;

    pdfName.innerHTML = `⏳ Uploading <br><small>${file.name}</small>`;

    await uploadFile(file, pdfName);

});

/*==================================================
            CAMERA SELECTED
==================================================*/

cameraInput.addEventListener("change", async () => {

    const file = cameraInput.files[0];

    if (!file) return;

    uploadState.method = "camera";
    uploadState.file = file;
    uploadState.fileName = file.name;

    cameraName.innerHTML = `⏳ Uploading <br><small>${file.name}</small>`;

    await uploadFile(file, cameraName);

});

/*==================================================
                UPLOAD FILE
==================================================*/

async function uploadFile(file, label) {

    try {

        continueBtn.disabled = true;

        const user = auth.currentUser;

        if (!user) {

            throw new Error("User not logged in.");

        }

        const fileName = `${Date.now()}_${file.name}`;

        const { data: uploadData, error } = await supabase.storage
    .from("module_outline")
    .upload(fileName, file);

if (error) throw error;

const { data: publicURL } = supabase.storage
    .from("module_outline")
    .getPublicUrl(fileName);

uploadState.fileURL = publicURL.publicUrl;

        if (error) throw error;

        const {

    data,

    error: dbError

} = await supabase

.from("module_outline")

.insert([

    {

        user_id: user.uid,

        file_name: file.name,

        file_url: uploadState.fileURL

    }

])

.select()

.single();

if (dbError) throw dbError;

uploadState.recordId = data.id;

        uploadState.uploaded = true;

        updateContinueButton();

        label.innerHTML = `✅ <strong>${file.name}</strong>`;

        console.log(uploadState);

    }

    catch (error) {

        console.error(error);

        uploadState.uploaded = false;

        updateContinueButton();

        label.innerHTML = `❌ Upload failed`;

        alert(error.message);

    }

}

/*==================================================
                CONTINUE
==================================================*/

continueBtn.addEventListener("click", () => {

    if (!uploadState.uploaded) {

        alert("Please upload a module outline first.");

        return;

    }

    document.getElementById("uploadScreen").style.display = "none";

    document.getElementById("processingScreen").style.display = "block";

    startProcessing();

});

/*==================================================
            START AI PROCESSING
==================================================*/

async function startProcessing() {

    const progressFill =
        document.getElementById("progressFill");

    const progressPercent =
        document.getElementById("progressPercent");

    const steps = [

        document.getElementById("step1"),
        document.getElementById("step2"),
        document.getElementById("step3"),
        document.getElementById("step4"),
        document.getElementById("step5"),
        document.getElementById("step6"),
        document.getElementById("step7")

    ];

    let progress = 0;

    let currentStep = 0;

    const timer = setInterval(() => {

        progress += 2;

        progressFill.style.width = progress + "%";

        progressPercent.textContent = progress + "%";

        if (

            currentStep < steps.length &&

            progress >= ((currentStep + 1) * 14)

        ) {

            steps[currentStep].classList.add("completed");

            steps[currentStep]
                .querySelector("i")
                .className = "fa-solid fa-circle-check";

            currentStep++;

        }

        if (progress >= 100) {

            clearInterval(timer);

        }

    }, 80);

    try {

        const response = await fetch("http://localhost:3000/api/module-outline/extract-outline", {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },
              body: JSON.stringify({

    fileURL: uploadState.fileURL,

    outlineId: uploadState.recordId

})

            }

        );

    const result = await response.json();

if (!response.ok) {

    throw new Error(result.error);

}

console.log(result);

aiData.module = result.module.module;

aiData.lectures = result.module.timetable;

aiData.assessments = result.module.assessments;

aiData.weeklyTopics = result.module.weeklyTopics;

aiData.summary = result.module.summary;

        console.log(aiData);

        progressFill.style.width = "100%";

        progressPercent.textContent = "100%";

        setTimeout(() => {

            document.getElementById("processingScreen").style.display = "none";

            document.getElementById("reviewScreen").style.display = "block";

            renderReview();

        }, 800);

    }

    catch (error) {

    console.error("FULL ERROR:", error);

    alert(JSON.stringify(error, null, 2));

}

}

/*==================================================
                REVIEW SCREEN
==================================================*/

function renderReview() {

    renderModule();

    renderLectures();

    renderAssessments();

    renderWeeklyTopics();

    renderSummary();

}

 /*==================================================
            MODULE CARD
==================================================*/

function renderModule() {

    const container = document.getElementById("moduleInfo");

    const module = aiData.module;

    container.innerHTML = `

        <div class="review-card">

            <h2>${module.name || "Unknown Module"}</h2>

            <p>

                <strong>${module.code || ""}</strong>

            </p>

            <p>

                Lecturer:
                ${module.lecturer || "Unknown"}

            </p>

            <p>

                ${module.semester || ""}

            </p>

        </div>

    `;

}  

/*==================================================
            LECTURES
==================================================*/

function renderLectures() {

    const lectureList = document.getElementById("lectureList");

    lectureList.innerHTML = "";

    aiData.lectures.forEach(lecture => {

        lectureList.innerHTML += `

        <div class="lecture-card">

            <h3>

                ${lecture.type || "Lecture"}

            </h3>

            <p>

                ${lecture.day}

            </p>

            <p>

                ${lecture.startTime}

                -

                ${lecture.endTime}

            </p>

            <p>

                ${lecture.venue}

            </p>

        </div>

        `;

    });

}

/*==================================================
            ASSESSMENTS
==================================================*/

function renderAssessments() {

    const container = document.getElementById("assessmentList");

    container.innerHTML = "";

    aiData.assessments.forEach(item => {

        container.innerHTML += `

        <div class="lecture-card">

            <h3>

                ${item.title}

            </h3>

            <p>

                ${item.type}

            </p>

            <p>

                Due:

                ${item.dueDate}

            </p>

            <p>

                Weight:

                ${item.weight}

            </p>

        </div>

        `;

    });

}

/*==================================================
            WEEKLY TOPICS
==================================================*/

function renderWeeklyTopics() {

    const container = document.getElementById("weeklyTopics");

    container.innerHTML = "";

    aiData.weeklyTopics.forEach(week => {

        container.innerHTML += `

        <div class="lecture-card">

            <h3>

                ${week.week}

            </h3>

            <ul>

                ${week.topics
                    .map(topic => `<li>${topic}</li>`)
                    .join("")}

            </ul>

        </div>

        `;

    });

}

/*==================================================
            SUMMARY
==================================================*/

function renderSummary() {

    const container = document.getElementById("moduleSummary");

    container.innerHTML = `

        <div class="review-card">

            <h3>

                AI Summary

            </h3>

            <p>

                ${aiData.summary}

            </p>

        </div>

    `;

}

