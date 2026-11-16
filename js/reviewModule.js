import { supabase } from "./supabase.js";


// ==================================================
// GET TEMPORARY MODULE DRAFT
// ==================================================

const draftText = sessionStorage.getItem("prodemicModuleDraft");

if (!draftText) {
    alert("No module draft was found. Please import your module again.");
    window.location.href = "08 modules.html";
    throw new Error("No module draft found.");
}

const moduleDraft = JSON.parse(draftText);

const extractedData = moduleDraft.extractedData;

// ==================================================
// GET HTML ELEMENTS
// ==================================================

const moduleNameInput = document.getElementById("moduleName");
const moduleCodeInput = document.getElementById("moduleCode");
const summaryInput = document.getElementById("summary");

const lecturerContainer = document.getElementById("lecturer");
const tutorContainer = document.getElementById("tutor");

const lectureList = document.getElementById("lectureList");
const assessmentList = document.getElementById("assessmentList");
const academicEventsList =
    document.getElementById("academicEventsList");

const moduleColourInput =
    document.getElementById("moduleColour");

const colourPreview =
    document.getElementById("colourPreview");

const colourText =
    document.getElementById("colourText");

const saveButton =
    document.getElementById("saveModule");

const backButton =
    document.getElementById("backBtn");


// ==================================================
// STORE DATA
// ==================================================

let moduleData = null;

let lectures = [];
let assessments = [];
let academicEvents = [];

let lecturers = [];
let tutors = [];


// ==================================================
// SMALL HELPERS
// ==================================================

function safeText(value) {

    if (
        value === null ||
        value === undefined
    ) {
        return "";
    }

    if (typeof value === "object") {
        return JSON.stringify(value);
    }

    return String(value);
}


function getFirstValue(object, keys) {

    if (!object) {
        return "";
    }

    for (const key of keys) {

        if (
            object[key] !== undefined &&
            object[key] !== null &&
            object[key] !== ""
        ) {
            return object[key];
        }
    }

    return "";
}

// ==================================================
// NORMALISE IMPORTED DATES
// ==================================================

function normalizeReviewDate(value) {

    if (!value) return null;

    const dateString = String(value)
        .trim()
        .replace(/(\d+)(st|nd|rd|th)/gi, "$1")
        .replace(/^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday),?\s+/i, "")
        .replace(/\s+/g, " ");

    if (/^(TBA|TBC|N\/A|NA|NONE|UNKNOWN|-|TO BE ANNOUNCED|TO BE CONFIRMED)$/i.test(dateString)) {
        return null;
    }

    function formatDate(year, month, day) {

        const date = new Date(year, month - 1, day);

        if (
            date.getFullYear() !== year ||
            date.getMonth() + 1 !== month ||
            date.getDate() !== day
        ) {
            return null;
        }

        return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    }

    let match = dateString.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/);

    if (match) {
        return formatDate(
            Number(match[1]),
            Number(match[2]),
            Number(match[3])
        );
    }

    match = dateString.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);

    if (match) {
        return formatDate(
            Number(match[3]),
            Number(match[2]),
            Number(match[1])
        );
    }

    const months = {
        jan: 1, january: 1,
        feb: 2, february: 2,
        mar: 3, march: 3,
        apr: 4, april: 4,
        may: 5,
        jun: 6, june: 6,
        jul: 7, july: 7,
        aug: 8, august: 8,
        sep: 9, sept: 9, september: 9,
        oct: 10, october: 10,
        nov: 11, november: 11,
        dec: 12, december: 12
    };

    match = dateString.match(/^(\d{1,2})\s+([a-z]+),?\s+(\d{4})$/i);

    if (match && months[match[2].toLowerCase()]) {
        return formatDate(
            Number(match[3]),
            months[match[2].toLowerCase()],
            Number(match[1])
        );
    }

    match = dateString.match(/^([a-z]+)\s+(\d{1,2}),?\s+(\d{4})$/i);

    if (match && months[match[1].toLowerCase()]) {
        return formatDate(
            Number(match[3]),
            months[match[1].toLowerCase()],
            Number(match[2])
        );
    }

    console.warn("Unrecognised imported date:", value);

    return null;
}
// ==================================================
// LOAD MODULE INFORMATION
// ==================================================
async function loadModule() {

    console.log("Loading temporary module draft...");

    try {

        // LOAD MODULE INFORMATION
        moduleData = moduleDraft.module;

        // LOAD LECTURES
        const lectureData =
            Array.isArray(extractedData.lectures) &&
            extractedData.lectures.length > 0
                ? extractedData.lectures
                : Array.isArray(extractedData.lectureTimes)
                    ? extractedData.lectureTimes
                    : [];

        lectures = lectureData.map(lecture => ({
            day: lecture.day || "",
            start_time: lecture.start_time || lecture.startTime || "",
            end_time: lecture.end_time || lecture.endTime || "",
            venue: lecture.venue || lecture.location || ""
        }));

        // LOAD ASSESSMENTS
        const assessmentData = Array.isArray(extractedData.assessments)
            ? extractedData.assessments
            : [];

        assessments = assessmentData.map(assessment => {

            const rawDueDate =
                assessment.dueDate ||
                assessment.due_date ||
                assessment.date ||
                assessment.deadline ||
                assessment.submissionDate ||
                assessment.assessmentDate ||
                "";

            return {
                title: assessment.title || assessment.name || "Untitled Assessment",
                weight: assessment.weight ?? "",
                due_date: rawDueDate,
                due_time: assessment.dueTime || assessment.due_time || "",
                completed: false
            };
        });

        // LOAD LECTURERS
        const lecturerData = Array.isArray(extractedData.lecturers)
            ? extractedData.lecturers
            : [];

        lecturers = lecturerData.map(lecturer => ({
            name: typeof lecturer === "string"
                ? lecturer.trim()
                : lecturer.name || lecturer.full_name || lecturer.lecturer || "",
            email: typeof lecturer === "object" && lecturer !== null
                ? lecturer.email || ""
                : ""
        })).filter(lecturer => lecturer.name);

        // LOAD TUTORS
        const tutorData = Array.isArray(extractedData.tutors)
            ? extractedData.tutors
            : [];

        tutors = tutorData.map(tutor => ({
            name: typeof tutor === "string"
                ? tutor.trim()
                : tutor.name || tutor.full_name || tutor.tutor || "",
            email: typeof tutor === "object" && tutor !== null
                ? tutor.email || ""
                : ""
        })).filter(tutor => tutor.name);

        // LOAD ACADEMIC EVENTS
        const eventData = Array.isArray(extractedData.academicEvents)
            ? extractedData.academicEvents
            : [];

        academicEvents = eventData.map(event => ({
            title: event.title || event.name || "Academic Event",
            type: event.type || "",
            start_date: event.start_date || event.startDate || "",
            end_date: event.end_date || event.endDate || "",
            description: event.description || ""
        }));

        // DISPLAY EVERYTHING
        displayModuleInformation();
        displayLecturers();
        displayTutors();
        displayLectures();
        displayAssessments();
        displayAcademicEvents();
        setupColourPicker();

        console.log("TEMPORARY MODULE DRAFT LOADED SUCCESSFULLY");

    } catch (error) {

        console.error("LOAD MODULE ERROR:", error);

        alert(
            "Something went wrong while loading the module.\n\n" +
            error.message
        );
    }
}


// ==================================================
// DISPLAY MODULE INFORMATION
// ==================================================

function displayModuleInformation() {

    if (!moduleData) {
        return;
    }


    if (moduleNameInput) {

        moduleNameInput.value =
            safeText(
                moduleData.module_name
            );
    }


    if (moduleCodeInput) {

        moduleCodeInput.value =
            safeText(
                moduleData.module_code
            );
    }


    if (summaryInput) {

        summaryInput.value =
            safeText(
                moduleData.summary
            );
    }


    if (moduleColourInput) {

        moduleColourInput.value =
            moduleData.colour ||
            "#3154B8";
    }


    if (colourPreview) {

        colourPreview.style.backgroundColor =
            moduleData.colour ||
            "#3154B8";
    }


    if (colourText) {

        colourText.textContent =
            moduleData.colour ||
            "#3154B8";
    }
}


// ==================================================
// DISPLAY LECTURERS
// ==================================================

function displayLecturers() {

    if (!lecturerContainer) {
        return;
    }


    lecturerContainer.innerHTML = "";


    if (
        !lecturers ||
        lecturers.length === 0
    ) {

        lecturerContainer.innerHTML =
            "<p>No lecturers listed.</p>";

        return;
    }


    lecturers.forEach(function (lecturer) {

        const card =
            document.createElement("div");

        card.className =
            "review-person";


        const name =
            document.createElement("h3");

        name.textContent =
            getFirstValue(
                lecturer,
                [
                    "name",
                    "full_name",
                    "lecturer"
                ]
            ) || "Lecturer";


        card.appendChild(name);


        if (lecturer.email) {

            const email =
                document.createElement("p");

            email.textContent =
                lecturer.email;

            card.appendChild(email);
        }


        lecturerContainer.appendChild(card);
    });
}


// ==================================================
// DISPLAY TUTORS
// ==================================================

function displayTutors() {

    if (!tutorContainer) {
        return;
    }


    tutorContainer.innerHTML = "";


    if (
        !tutors ||
        tutors.length === 0
    ) {

        tutorContainer.innerHTML =
            "<p>No tutors listed.</p>";

        return;
    }


    tutors.forEach(function (tutor) {

        const card =
            document.createElement("div");

        card.className =
            "review-person";


        const name =
            document.createElement("h3");

        name.textContent =
            getFirstValue(
                tutor,
                [
                    "name",
                    "full_name",
                    "tutor"
                ]
            ) || "Tutor";


        card.appendChild(name);


        if (tutor.email) {

            const email =
                document.createElement("p");

            email.textContent =
                tutor.email;

            card.appendChild(email);
        }


        tutorContainer.appendChild(card);
    });
}


// ==================================================
// DISPLAY LECTURES
// ==================================================

function displayLectures() {

    if (!lectureList) {
        return;
    }


    lectureList.innerHTML = "";


    if (
        !lectures ||
        lectures.length === 0
    ) {

        lectureList.innerHTML =
            "<p>No lectures listed.</p>";

        return;
    }


    lectures.forEach(
        function (lecture) {

            const card =
                document.createElement("div");

            card.className =
                "review-card";


            // ==================================================
            // DAY
            // ==================================================

            const dayGroup =
                createInputField(
                    "Day",
                    getFirstValue(
                        lecture,
                        ["day"]
                    )
                );

            card.appendChild(
                dayGroup.container
            );


            // ==================================================
            // START TIME
            // ==================================================

            const startGroup =
                createInputField(
                    "Start Time",
                    getFirstValue(
                        lecture,
                        [
                            "start_time",
                            "startTime"
                        ]
                    )
                );

            card.appendChild(
                startGroup.container
            );


            // ==================================================
            // END TIME
            // ==================================================

            const endGroup =
                createInputField(
                    "End Time",
                    getFirstValue(
                        lecture,
                        [
                            "end_time",
                            "endTime"
                        ]
                    )
                );

            card.appendChild(
                endGroup.container
            );


            // ==================================================
            // VENUE
            // ==================================================

            const venueGroup =
                createInputField(
                    "Venue",
                    getFirstValue(
                        lecture,
                        [
                            "venue",
                            "location"
                        ]
                    )
                );

            card.appendChild(
                venueGroup.container
            );


            // ==================================================
            // STORE INPUTS FOR SAVING
            // ==================================================

            lecture._dayInput =
                dayGroup.input;

            lecture._startTimeInput =
                startGroup.input;

            lecture._endTimeInput =
                endGroup.input;

            lecture._venueInput =
                venueGroup.input;


            lectureList.appendChild(card);
        }
    );
}


// ==================================================
// DISPLAY ASSESSMENTS
// ==================================================

function displayAssessments() {

    if (!assessmentList) {
        return;
    }


    assessmentList.innerHTML = "";


    if (
        !assessments ||
        assessments.length === 0
    ) {

        assessmentList.innerHTML =
            "<p>No assessments found.</p>";

        return;
    }


    assessments.forEach(
        function (assessment) {

            const card =
                document.createElement("div");

            card.className =
                "review-card";


            // ==================================================
            // TITLE
            // ==================================================

            const titleGroup =
                createInputField(
                    "Title",
                    getFirstValue(
                        assessment,
                        [
                            "title",
                            "name"
                        ]
                    )
                );

            card.appendChild(
                titleGroup.container
            );


            // ==================================================
            // DUE DATE
            // ==================================================

            const dueDateGroup =
                createInputField(
                    "Due Date",
                    getFirstValue(
                        assessment,
                        [
                            "due_date",
                            "dueDate"
                        ]
                    )
                );

            card.appendChild(
                dueDateGroup.container
            );


            // ==================================================
            // WEIGHT
            // ==================================================

            const weightGroup =
                createInputField(
                    "Weight",
                    getFirstValue(
                        assessment,
                        ["weight"]
                    )
                );

            card.appendChild(
                weightGroup.container
            );


            // ==================================================
            // STORE INPUTS FOR SAVING
            // ==================================================

            assessment._titleInput =
                titleGroup.input;

            assessment._dueDateInput =
                dueDateGroup.input;

            assessment._weightInput =
                weightGroup.input;


            assessmentList.appendChild(card);
        }
    );
}


// ==================================================
// DISPLAY ACADEMIC EVENTS
// ==================================================

function displayAcademicEvents() {

    if (!academicEventsList) {
        return;
    }


    academicEventsList.innerHTML = "";


    if (
        !academicEvents ||
        academicEvents.length === 0
    ) {

        academicEventsList.innerHTML =
            "<p>No academic events found.</p>";

        return;
    }


    academicEvents.forEach(
        function (event) {

            const card =
                document.createElement("div");

            card.className =
                "review-card";


            // ==================================================
            // TITLE
            // ==================================================

            const titleGroup =
                createInputField(
                    "Title",
                    getFirstValue(
                        event,
                        [
                            "title",
                            "name"
                        ]
                    )
                );

            card.appendChild(
                titleGroup.container
            );


            // ==================================================
            // TYPE
            // ==================================================

            const typeGroup =
                createInputField(
                    "Type",
                    getFirstValue(
                        event,
                        ["type"]
                    )
                );

            card.appendChild(
                typeGroup.container
            );


            // ==================================================
            // START DATE
            // ==================================================

            const startDateGroup =
                createInputField(
                    "Start Date",
                    getFirstValue(
                        event,
                        [
                            "start_date",
                            "startDate"
                        ]
                    )
                );

            card.appendChild(
                startDateGroup.container
            );


            // ==================================================
            // END DATE
            // ==================================================

            const endDateGroup =
                createInputField(
                    "End Date",
                    getFirstValue(
                        event,
                        [
                            "end_date",
                            "endDate"
                        ]
                    )
                );

            card.appendChild(
                endDateGroup.container
            );


            // ==================================================
            // DESCRIPTION
            // ==================================================

            const descriptionGroup =
                createInputField(
                    "Description",
                    getFirstValue(
                        event,
                        ["description"]
                    )
                );

            card.appendChild(
                descriptionGroup.container
            );


            // ==================================================
            // STORE INPUTS FOR SAVING
            // ==================================================

            event._titleInput =
                titleGroup.input;

            event._typeInput =
                typeGroup.input;

            event._startDateInput =
                startDateGroup.input;

            event._endDateInput =
                endDateGroup.input;

            event._descriptionInput =
                descriptionGroup.input;


            academicEventsList.appendChild(card);
        }
    );
}


// ==================================================
// CREATE INPUT FIELD
// ==================================================

function createInputField(
    labelText,
    value
) {

    const container =
        document.createElement("div");

    container.className =
        "review-field";


    const label =
        document.createElement("label");

    label.textContent =
        labelText;


    const input =
        document.createElement("input");

    input.type =
        "text";

    input.value =
        safeText(value);


    container.appendChild(label);

    container.appendChild(input);


    return {
        container: container,
        input: input
    };
}


// ==================================================
// COLOUR PICKER
// ==================================================

function setupColourPicker() {

    if (
        !moduleColourInput ||
        !colourPreview ||
        !colourText
    ) {
        return;
    }


    const currentColour =
        moduleData.colour ||
        "#3154B8";


    moduleColourInput.value =
        currentColour;


    colourPreview.style.backgroundColor =
        currentColour;


    colourText.textContent =
        currentColour;


    moduleColourInput.addEventListener(
        "input",
        function () {

            const colour =
                moduleColourInput.value;


            colourPreview.style.backgroundColor =
                colour;


            colourText.textContent =
                colour;
        }
    );
}


// ==================================================
// SAVE EVERYTHING
// ==================================================

if (saveButton) {

    saveButton.addEventListener(
        "click",
        saveModule
    );
}


async function saveModule() {

    console.log(
        "Saving reviewed module..."
    );


    if (!saveButton) {
        return;
    }


    saveButton.disabled = true;

    saveButton.textContent =
    "Saving...";

   let savedModuleId = null;

   try {

        // ==================================================
        // GET EDITED MODULE
        // ==================================================

        const updatedModule = {

            module_name:
                moduleNameInput
                    ? moduleNameInput.value.trim()
                    : moduleData.module_name,

            module_code:
                moduleCodeInput
                    ? moduleCodeInput.value.trim()
                    : moduleData.module_code,

            summary:
                summaryInput
                    ? summaryInput.value.trim()
                    : moduleData.summary,

            colour:
                moduleColourInput
                    ? moduleColourInput.value
                    : moduleData.colour
        };


        // ==================================================
        // REQUIRED FIELDS
        // ==================================================

        if (
            !updatedModule.module_name ||
            !updatedModule.module_code
        ) {

            alert(
                "Please enter the module name and module code."
            );

            return;
        }

// ==================================================
// INSERT NEW MODULE
// ==================================================

const {
    data: savedModule,
    error: moduleError
} = await supabase
    .from("modules")
    .insert([{
        ...moduleData,
        ...updatedModule
    }])
    .select()
    .single();

if (moduleError) {
    throw moduleError;
}

savedModuleId = savedModule.id;

console.log("NEW MODULE INSERTED:", savedModule);


// ==================================================
// INSERT LECTURES
// ==================================================

const lectureRecords = lectures
    .filter(lecture => lecture._dayInput)
    .map(lecture => ({
        user_id: moduleData.user_id,
        module_id: savedModuleId,
        day: lecture._dayInput.value.trim(),
        start_time: lecture._startTimeInput.value.trim(),
        end_time: lecture._endTimeInput.value.trim(),
        venue: lecture._venueInput.value.trim()
    }))
    .filter(lecture =>
        lecture.day ||
        lecture.start_time ||
        lecture.end_time ||
        lecture.venue
    );

if (lectureRecords.length > 0) {

    const { error: lectureError } = await supabase
        .from("lectures")
        .insert(lectureRecords);

    if (lectureError) {
        throw lectureError;
    }

    console.log("LECTURES INSERTED:", lectureRecords);
}

// ==================================================
// INSERT ASSESSMENTS
// ==================================================

const assessmentRecords = assessments
    .filter(assessment => assessment._titleInput)
    .map(assessment => ({
        user_id: moduleData.user_id,
        module_id: savedModuleId,
        title: assessment._titleInput.value.trim(),
        due_date: normalizeReviewDate(
        assessment._dueDateInput.value),
        due_time: assessment.due_time || null,
        weight: assessment._weightInput.value.trim() || null,
        completed: false
    }))
    .filter(assessment => assessment.title);

if (assessmentRecords.length > 0) {

    const { error: assessmentError } = await supabase
        .from("assessments")
        .insert(assessmentRecords);

    if (assessmentError) {
        throw assessmentError;
    }

    console.log("ASSESSMENTS INSERTED:", assessmentRecords);
}
   

// ==================================================
// INSERT ACADEMIC EVENTS
// ==================================================

const academicEventRecords = academicEvents
    .filter(event => event._titleInput)
    .map(event => ({
        user_id: moduleData.user_id,
        module_id: savedModuleId,
        title: event._titleInput.value.trim(),
        type: event._typeInput.value.trim(),
        start_date: normalizeReviewDate(
        event._startDateInput.value
        ),

       end_date: normalizeReviewDate(
        event._endDateInput.value
       ),
        description: event._descriptionInput.value.trim()
    }))
    .filter(event => event.title);

if (academicEventRecords.length > 0) {

    const { error: academicEventError } = await supabase
        .from("academic_events")
        .insert(academicEventRecords);

    if (academicEventError) {
        throw academicEventError;
    }

    console.log("ACADEMIC EVENTS INSERTED:", academicEventRecords);
}


// ==================================================
// INSERT LECTURERS
// ==================================================

const lecturerRecords = lecturers
    .filter(lecturer => lecturer.name)
    .map(lecturer => ({
        module_id: savedModuleId,
        name: lecturer.name,
        email: lecturer.email || ""
    }));

if (lecturerRecords.length > 0) {

    const { error: lecturerError } = await supabase
        .from("lecturers")
        .insert(lecturerRecords);

    if (lecturerError) {
        throw lecturerError;
    }

    console.log("LECTURERS INSERTED:", lecturerRecords);
}


// ==================================================
// INSERT TUTORS
// ==================================================

const tutorRecords = tutors
    .filter(tutor => tutor.name)
    .map(tutor => ({
        module_id: savedModuleId,
        name: tutor.name,
        email: tutor.email || ""
    }));

if (tutorRecords.length > 0) {

    const { error: tutorError } = await supabase
        .from("tutors")
        .insert(tutorRecords);

    if (tutorError) {
        throw tutorError;
    }

    console.log("TUTORS INSERTED:", tutorRecords);
}
// ==================================================
// SUCCESS
// ==================================================

    console.log(
    "COMPLETE MODULE SAVED:",
    savedModuleId
);

// ==================================================
// GO TO TRACK MODULE
// ==================================================

sessionStorage.removeItem("prodemicModuleDraft");

window.location.href =
    `23 moduleTrack.html?id=${encodeURIComponent(savedModuleId)}`;

} catch (error) {

        console.error(
            "SAVE MODULE ERROR:",
            error
        );

        alert(
            "Something went wrong while saving the module.\n\n" +
            error.message
        );
    }


    finally {

        saveButton.disabled = false;

        saveButton.textContent =
            "Save Module";
    }
}


// ==================================================
// BACK BUTTON
// ==================================================

if (backButton) {

    backButton.addEventListener(
        "click",
        function () {

            sessionStorage.removeItem("prodemicModuleDraft");

            window.location.href =
                "08 modules.html";
        }
    );
}

// ==================================================
// START
// ==================================================

loadModule();