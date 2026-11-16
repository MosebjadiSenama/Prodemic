import { auth } from "../firebase.js";


// ==================================================
// GET HTML ELEMENTS
// ==================================================

const pdfUpload = document.getElementById("pdf-upload");
const filePreview = document.getElementById("file-preview");
const fileName = document.getElementById("file-name");
const fileSize = document.getElementById("file-size");
const removeFileBtn = document.getElementById("remove-file");
const continueBtn = document.getElementById("continue-btn");

const loadingSpinner = document.getElementById("loading-spinner");
const continueText = document.getElementById("continue-text");
// ==================================================
// MODULE PROCESSING SCREEN
// ==================================================

const processingPage = document.getElementById("processingPage");

const processingText = document.getElementById("processingText");

const progressFill = document.getElementById("progressFill");

const progressPercent = document.getElementById("progressPercent");

const processingStages = [
    "Uploading Module Outline",
    "AI Analysing Module",
    "Checking Extracted Information",
    "Preparing Your Module",
    "Complete"
];

const processingMessages = [
    "Uploading your PDF...",
    "AI is analysing your module outline. This may take a moment...",
    "Checking the information extracted from your PDF...",
    "Preparing your module for review...",
    "Your module is ready!"
];

function updateProcessingProgress(stageNumber) {
    const stageIndex = stageNumber - 1;

    const progress = [0, 20, 45, 70, 100][stageIndex];


    if (progressFill) {
        progressFill.style.width = `${progress}%`;
    }

    //animation
        const progressBar = document.querySelector(".progress-bar");

    if (progressBar) {
        progressBar.classList.toggle("loading", stageNumber === 2);
    }

    if (progressPercent) {
        progressPercent.textContent = `${progress}%`;
    }

    if (processingText) {
        processingText.textContent = processingMessages[stageIndex];
    }

    processingStages.forEach((stage, index) => {
        const stepElement = document.getElementById(`step${index + 1}`);

        if (!stepElement) return;

        stepElement.classList.remove("active", "completed");

        if (index < stageIndex) {
            stepElement.classList.add("completed");
        } else if (index === stageIndex) {
            stepElement.classList.add("active");
        }
    });
}

function startProcessing() {
    const importElements = Array.from(document.body.children)
        .filter(element => element.id !== "processingPage");

    importElements.forEach(element => {
        element.style.display = "none";
    });

    if (processingPage) {
        processingPage.style.display = "flex";
    }

    updateProcessingProgress(1);
}

function finishProcessing() {
    updateProcessingProgress(5);

    processingStages.forEach((stage, index) => {
        const stepElement = document.getElementById(`step${index + 1}`);

        if (stepElement) {
            stepElement.classList.remove("active");
            stepElement.classList.add("completed");
        }
    });

    if (processingText) {
        processingText.textContent = "Your module is ready!";
    }
}

// ==================================================
// STORE SELECTED FILE
// ==================================================

let selectedFile = null;

// ==================================================
// PDF SELECTED
// ==================================================

if (pdfUpload) {

    pdfUpload.addEventListener("change", function () {

        const file = this.files[0];

        if (!file) {
            return;
        }

        // Make sure the file is a PDF
        if (file.type !== "application/pdf") {

            console.error("Selected file is not a PDF.");

            pdfUpload.value = "";

            if (filePreview) {
                filePreview.style.display = "none";
            }

            selectedFile = null;

            if (continueBtn) {
                continueBtn.disabled = true;
            }

            return;
        }

        selectedFile = file;

        if (fileName) {
            fileName.textContent = file.name;
        }

        if (fileSize) {
            fileSize.textContent = formatFileSize(file.size);
        }

        if (filePreview) {
            filePreview.style.display = "block";
        }

        if (continueBtn) {
            continueBtn.disabled = false;
        }
    });
}

// ==================================================
// REMOVE PDF
// ==================================================

if (removeFileBtn) {

    removeFileBtn.addEventListener("click", function () {

        selectedFile = null;

        if (pdfUpload) {
            pdfUpload.value = "";
        }

        if (filePreview) {
            filePreview.style.display = "none";
        }

        if (continueBtn) {
            continueBtn.disabled = true;
        }
    });
}

// ==================================================
// CONTINUE BUTTON
// ==================================================

if (continueBtn) {

    continueBtn.addEventListener("click", async function () {

        // --------------------------------------------------
        // CHECK PDF
        // --------------------------------------------------

        if (!selectedFile) {

            console.error("No PDF selected.");

            return;
        }

        // --------------------------------------------------
        // CHECK USER
        // --------------------------------------------------

        const user = auth.currentUser;

        if (!user) {

            console.error("No Firebase user is logged in.");

            return;
        }

        // --------------------------------------------------
        // START LOADING
        // --------------------------------------------------

        continueBtn.disabled = true;

        if (continueText) {
            continueText.textContent = "Analysing module...";
        }

        if (loadingSpinner) {
            loadingSpinner.style.display = "inline-block";
        }

        // --------------------------------------------------
        // CREATE FORM DATA
        // --------------------------------------------------

        const formData = new FormData();

        formData.append("pdf", selectedFile);
        startProcessing();

        try {

            // ==================================================
            // SEND PDF TO BACKEND
            // ==================================================

             
            const API_BASE_URL = "https://prodemic-backend.onrender.com";
            updateProcessingProgress(2);
           const controller = new AbortController();

const timeout = setTimeout(() => {
    controller.abort();
}, 90000);

let response;

try {
    response = await fetch(
        `${API_BASE_URL}/analyse-module`,
        {
            method: "POST",
            body: formData,
            signal: controller.signal
        }
    );
} catch (error) {

    if (error.name === "AbortError") {
        throw new Error(
            "The analysis is taking too long. Please try again."
        );
    }

    throw error;

} finally {
    clearTimeout(timeout);
}
            // ==================================================
            // CHECK SERVER RESPONSE
            // ==================================================

            if (!response.ok) {

                throw new Error(
                    `Server returned ${response.status}`
                );
            }

            const data = await response.json();

            // ==================================================
            // DEBUG BACKEND RESPONSE
            // ==================================================

            console.log("=================================");
            console.log("BACKEND RESPONSE");
            console.log("=================================");

            console.log(data);

            if (!data.success) {

                throw new Error(
                    data.message ||
                    "Could not analyse the module."
                );
            }

// ==================================================
// GET EXTRACTED MODULE DATA
// ==================================================
const extractedData = data.data;

if (!extractedData) {

    throw new Error(
        "No module data was returned from the backend."
    );

}

updateProcessingProgress(3);
            console.log("=================================");
            console.log("EXTRACTED MODULE DATA");
            console.log("=================================");

            console.log(
                JSON.stringify(
                    extractedData,
                    null,
                    2
                )
            );

            // ==================================================
            // DEBUG EXTRACTED INFORMATION
            // ==================================================

            console.log(
                "Module name:",
                extractedData.moduleName
            );

            console.log(
                "Module code:",
                extractedData.moduleCode
            );

            console.log(
                "Summary:",
                extractedData.moduleSummary
            );

            console.log(
                "Semester:",
                extractedData.semester
            );

            console.log(
                "Colour:",
                extractedData.colour
            );

            console.log(
                "Lecturers:",
                extractedData.lecturers
            );

            console.log(
                "Tutors:",
                extractedData.tutors
            );

            console.log(
                "Lectures:",
                extractedData.lectures
            );

            console.log(
                "Lecture times:",
                extractedData.lectureTimes
            );

            console.log(
                "Assessments:",
                extractedData.assessments
            );

            console.log(
                "Academic events:",
                extractedData.academicEvents
            );

            // ==================================================
            // PREPARE MODULE
            // ==================================================

            const moduleToSave = {

                user_id: user.uid,

                module_name:
                    extractedData.moduleName ||
                    "Untitled Module",

                module_code:
                    extractedData.moduleCode ||
                    "",

                summary:
                    extractedData.moduleSummary ||
                    null,

                semester:
                    extractedData.semester ||
                    "Semester 1",

                colour:
                    extractedData.colour ||
                    "#2e4aac"
            };

            console.log("=================================");
            console.log("MODULE TO SAVE");
            console.log("=================================");

            console.log(moduleToSave);
// ==================================================
// STORE MODULE AS TEMPORARY DRAFT
// ==================================================

const moduleDraft = {
    module: moduleToSave,
    extractedData: extractedData
};

sessionStorage.setItem(
    "prodemicModuleDraft",
    JSON.stringify(moduleDraft)
);

console.log("MODULE STORED AS TEMPORARY DRAFT");
updateProcessingProgress(4);
finishProcessing();
            // ==================================================
            // ALL DONE
            // ==================================================

            console.log("=================================");
            console.log("MODULE IMPORT COMPLETE");
            console.log("=================================");

            

            // ==================================================
            // GO TO REVIEW MODULE
            // ==================================================
             window.location.href = "15%20reviewModule.html";

        
} catch (error) {

    console.error("MODULE IMPORT ERROR:", error);


    // Hide the processing screen
    if (processingPage) {
        processingPage.style.display = "none";
    }

    // Restore the import page
    Array.from(document.body.children).forEach(element => {

        if (element.id !== "processingPage") {
            element.style.display = "";
        }

    });

    alert(
        "Module import failed.\n\n" +
        (error.message || "An unexpected error occurred.")
    );

} finally {


            continueBtn.disabled = false;

            if (continueText) {
                continueText.textContent = "Continue";
            }

            if (loadingSpinner) {
                loadingSpinner.style.display = "none";
            }
        }
    });
}

// ==================================================
// FORMAT FILE SIZE
// ==================================================

function formatFileSize(bytes) {

    if (bytes === 0) {
        return "0 Bytes";
    }

    const sizes = [
        "Bytes",
        "KB",
        "MB",
        "GB"
    ];

    const i = Math.floor(
        Math.log(bytes) / Math.log(1024)
    );

    return (
        Math.round(
            (bytes / Math.pow(1024, i)) * 100
        ) / 100
    ) + " " + sizes[i];
}


