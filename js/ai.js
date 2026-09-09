import { auth } from "../firebase.js";
import { supabase } from "./supabase.js";

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

        try {

            // ==================================================
            // SEND PDF TO BACKEND
            // ==================================================

            const response = await fetch(
                "http://localhost:3000/analyse-module",
                {
                    method: "POST",
                    body: formData
                }
            );

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
            // SAVE MODULE
            // ==================================================

            const {
                data: savedModule,
                error: moduleError
            } = await supabase
                .from("modules")
                .insert([moduleToSave])
                .select()
                .single();

            if (moduleError) {

                console.error(
                    "MODULE SAVE ERROR:",
                    moduleError
                );

                throw new Error(
                    moduleError.message ||
                    "The module could not be saved."
                );
            }

            // ==================================================
            // MODULE SAVED
            // ==================================================

            console.log("=================================");
            console.log("MODULE SAVED SUCCESSFULLY");
            console.log("=================================");

            console.log(savedModule);

            const newModuleId = savedModule.id;

            console.log(
                "NEW MODULE ID:",
                newModuleId
            );

            // ==================================================
            // SAVE LECTURES
            // ==================================================

            const lectureData =
                extractedData.lectures ||
                extractedData.lectureTimes ||
                [];

            if (
                Array.isArray(lectureData) &&
                lectureData.length > 0
            ) {

                const lecturesToSave =
                    lectureData.map((lecture) => ({

                        user_id: user.uid,

                        module_id: newModuleId,

                        day:
                            lecture.day ||
                            null,

                        start_time:
                            lecture.start_time ||
                            lecture.startTime ||
                            null,

                        end_time:
                            lecture.end_time ||
                            lecture.endTime ||
                            null,

                        venue:
                            lecture.venue ||
                            lecture.location ||
                            null
                    }));

                console.log("=================================");
                console.log("LECTURES TO SAVE");
                console.log("=================================");

                console.log(lecturesToSave);

                const {
                    error: lecturesError
                } = await supabase
                    .from("lectures")
                    .insert(lecturesToSave);

                if (lecturesError) {

                    console.error(
                        "LECTURES SAVE ERROR:",
                        lecturesError
                    );

                } else {

                    console.log(
                        "LECTURES SAVED SUCCESSFULLY"
                    );
                }

            } else {

                console.log(
                    "No lecture information found."
                );
            }

            // ==================================================
            // SAVE ASSESSMENTS
            // ==================================================

            const assessmentData =
                extractedData.assessments ||
                [];

            if (
                Array.isArray(assessmentData) &&
                assessmentData.length > 0
            ) {

                const assessmentsToSave =
                    assessmentData.map((assessment) => ({

                        user_id: user.uid,

                        // modules.id is int8,
                        // so assessments.module_id is also int8
                        module_id: newModuleId,

                        title:
                            assessment.title ||
                            assessment.name ||
                            "Untitled Assessment",

                        weight:
                            assessment.weight ||
                            null,

                        due_date:
                            assessment.due_date ||
                            assessment.dueDate ||
                            null,

                        due_time:
                            assessment.due_time ||
                            assessment.dueTime ||
                            null,

                        completed: false
                    }));

                console.log("=================================");
                console.log("ASSESSMENTS TO SAVE");
                console.log("=================================");

                console.log(assessmentsToSave);

                const {
                    error: assessmentsError
                } = await supabase
                    .from("assessments")
                    .insert(assessmentsToSave);

                if (assessmentsError) {

                    console.error(
                        "ASSESSMENTS SAVE ERROR:",
                        assessmentsError
                    );

                } else {

                    console.log(
                        "ASSESSMENTS SAVED SUCCESSFULLY"
                    );
                }

            } else {

                console.log(
                    "No assessment information found."
                );
            }

            // ==================================================
            // SAVE LECTURERS
            // ==================================================

            const lecturerData =
                extractedData.lecturers ||
                [];

            if (
                Array.isArray(lecturerData) &&
                lecturerData.length > 0
            ) {

                const lecturersToSave =
                    lecturerData.map((lecturer) => ({

                        user_id: user.uid,

                        module_id: newModuleId,

                        name:
                            lecturer.name ||
                            lecturer.full_name ||
                            lecturer.lecturer ||
                            "Unknown Lecturer",

                        email:
                            lecturer.email ||
                            null
                    }));

                console.log("=================================");
                console.log("LECTURERS TO SAVE");
                console.log("=================================");

                console.log(lecturersToSave);

                const {
                    error: lecturersError
                } = await supabase
                    .from("lecturers")
                    .insert(lecturersToSave);

                if (lecturersError) {

                    console.error(
                        "LECTURERS SAVE ERROR:",
                        lecturersError
                    );

                } else {

                    console.log(
                        "LECTURERS SAVED SUCCESSFULLY"
                    );
                }

            } else {

                console.log(
                    "No lecturer information found."
                );
            }

            // ==================================================
            // SAVE TUTORS
            // ==================================================

            // Tutors use the same structure as lectures.
            // There is NO consultation_hours table.

            const tutorData =
                extractedData.tutors ||
                [];

            if (
                Array.isArray(tutorData) &&
                tutorData.length > 0
            ) {

                const tutorsToSave =
                    tutorData.map((tutor) => ({

                        user_id: user.uid,

                        module_id: newModuleId,

                        day:
                            tutor.day ||
                            null,

                        start_time:
                            tutor.start_time ||
                            tutor.startTime ||
                            null,

                        end_time:
                            tutor.end_time ||
                            tutor.endTime ||
                            null,

                        venue:
                            tutor.venue ||
                            tutor.location ||
                            null
                    }));

                console.log("=================================");
                console.log("TUTORS TO SAVE");
                console.log("=================================");

                console.log(tutorsToSave);

                const {
                    error: tutorsError
                } = await supabase
                    .from("tutors")
                    .insert(tutorsToSave);

                if (tutorsError) {

                    console.error(
                        "TUTORS SAVE ERROR:",
                        tutorsError
                    );

                } else {

                    console.log(
                        "TUTORS SAVED SUCCESSFULLY"
                    );
                }

            } else {

                console.log(
                    "No tutor information found."
                );
            }

            // ==================================================
            // DO NOT SAVE CONSULTATION HOURS
            // ==================================================

            console.log(
                "Consultation hours save skipped."
            );

            // ==================================================
            // SAVE ACADEMIC EVENTS
            // ==================================================

            const eventData =
                extractedData.academicEvents ||
                [];

            if (
                Array.isArray(eventData) &&
                eventData.length > 0
            ) {

                const eventsToSave =
                    eventData.map((event) => ({

                        user_id: user.uid,

                        module_id: newModuleId,

                        title:
                            event.title ||
                            event.name ||
                            "Academic Event",

                        type:
                            event.type ||
                            null,

                        start_date:
                            event.start_date ||
                            event.startDate ||
                            null,

                        end_date:
                            event.end_date ||
                            event.endDate ||
                            null,

                        description:
                            event.description ||
                            null
                    }));

                console.log("=================================");
                console.log("ACADEMIC EVENTS TO SAVE");
                console.log("=================================");

                console.log(eventsToSave);

                const {
                    error: eventsError
                } = await supabase
                    .from("academic_events")
                    .insert(eventsToSave);

                if (eventsError) {

                    console.error(
                        "ACADEMIC EVENTS SAVE ERROR:",
                        eventsError
                    );

                } else {

                    console.log(
                        "ACADEMIC EVENTS SAVED SUCCESSFULLY"
                    );
                }

            } else {

                console.log(
                    "No academic event information found."
                );
            }

            // ==================================================
            // ALL DONE
            // ==================================================

            console.log("=================================");
            console.log("MODULE IMPORT COMPLETE");
            console.log("=================================");

            console.log(
                "Module ID:",
                newModuleId
            );

            // ==================================================
            // GO TO REVIEW MODULE
            // ==================================================

            window.location.href =
                `15%20reviewModule.html?id=${encodeURIComponent(newModuleId)}`;

        } catch (error) {

            console.error(
                "MODULE IMPORT ERROR:",
                error
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