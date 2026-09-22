import { supabase } from "./supabase.js";


// ==================================================
// GET MODULE ID FROM URL
// ==================================================

const urlParams = new URLSearchParams(window.location.search);
const moduleId = urlParams.get("id");


if (!moduleId) {
    alert("No module was selected.");
    window.location.href = "08 modules.html";
    throw new Error("No module ID found.");
}


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
// LOAD MODULE
// ==================================================

async function loadModule() {

    console.log("Loading module from Supabase...");

    try {

        // ==================================================
        // LOAD MAIN MODULE
        // ==================================================

        const {
            data: module,
            error: moduleError
        } = await supabase
            .from("modules")
            .select("*")
            .eq("id", moduleId)
            .single();


        if (moduleError) {

            console.error(
                "MODULE LOAD ERROR:",
                moduleError
            );

            alert(
                "Could not load the module.\n\n" +
                moduleError.message
            );

            return;
        }


        if (!module) {

            alert(
                "Module could not be found."
            );

            return;
        }


        moduleData = module;


        console.log(
            "MODULE FROM SUPABASE:",
            moduleData
        );


        // ==================================================
        // DISPLAY MAIN MODULE INFORMATION
        // ==================================================

        displayModuleInformation();


        // ==================================================
        // LOAD LECTURES
        // ==================================================

        const {
            data: lectureData,
            error: lectureError
        } = await supabase
            .from("lectures")
            .select("*")
            .eq("module_id", moduleId)
            .order("id", {
                ascending: true
            });


        if (lectureError) {

            console.warn(
                "LECTURES LOAD ERROR:",
                lectureError
            );

            lectures = [];

        } else {

            lectures = lectureData || [];
        }


        console.log(
            "LECTURES FROM SUPABASE:",
            lectures
        );


        // ==================================================
        // LOAD ASSESSMENTS
        // ==================================================

        const {
            data: assessmentData,
            error: assessmentError
        } = await supabase
            .from("assessments")
            .select("*")
            .eq("module_id", moduleId)
            .order("id", {
                ascending: true
            });


        if (assessmentError) {

            console.warn(
                "ASSESSMENTS LOAD ERROR:",
                assessmentError
            );

            assessments = [];

        } else {

            assessments = assessmentData || [];
        }


        console.log(
            "ASSESSMENTS FROM SUPABASE:",
            assessments
        );


        // ==================================================
        // LOAD ACADEMIC EVENTS
        // ==================================================

        if (academicEventsList) {

            const {
                data: eventData,
                error: eventError
            } = await supabase
                .from("academic_events")
                .select("*")
                .eq("module_id", moduleId)
                .order("id", {
                    ascending: true
                });


            if (eventError) {

                console.warn(
                    "ACADEMIC EVENTS LOAD ERROR:",
                    eventError
                );

                academicEvents = [];

            } else {

                academicEvents = eventData || [];
            }
        }


        console.log(
            "ACADEMIC EVENTS FROM SUPABASE:",
            academicEvents
        );


        // ==================================================
        // LOAD LECTURERS
        // ==================================================

        const {
            data: lecturerData,
            error: lecturerError
        } = await supabase
            .from("lecturers")
            .select("*")
            .eq("module_id", moduleId)
            .order("id", {
                ascending: true
            });


        if (lecturerError) {

            console.error(
                "LECTURERS LOAD ERROR:",
                lecturerError
            );

            lecturers = [];

        } else {

            lecturers = lecturerData || [];
        }


        console.log(
            "LECTURERS FROM SUPABASE:",
            lecturers
        );


        // ==================================================
        // LOAD TUTORS
        // ==================================================

        const {
            data: tutorData,
            error: tutorError
        } = await supabase
            .from("tutors")
            .select("*")
            .eq("module_id", moduleId)
            .order("id", {
                ascending: true
            });


        if (tutorError) {

            console.error(
                "TUTORS LOAD ERROR:",
                tutorError
            );

            tutors = [];

        } else {

            tutors = tutorData || [];
        }


        console.log(
            "TUTORS FROM SUPABASE:",
            tutors
        );


        // ==================================================
        // DISPLAY EVERYTHING
        // ==================================================

        displayModuleInformation();

        displayLecturers();

        displayTutors();

        displayLectures();

        displayAssessments();

        displayAcademicEvents();

        setupColourPicker();


        console.log(
            "REVIEW PAGE LOADED SUCCESSFULLY"
        );

    }

    catch (error) {

        console.error(
            "LOAD MODULE ERROR:",
            error
        );

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
        // UPDATE MODULE
        // ==================================================

        const {
            data: updatedData,
            error: moduleError
        } = await supabase
            .from("modules")
            .update(updatedModule)
            .eq("id", moduleId)
            .select()
            .single();


        if (moduleError) {

            console.error(
                "MODULE UPDATE ERROR:",
                moduleError
            );

            alert(
                "The module could not be saved.\n\n" +
                moduleError.message
            );

            return;
        }


        console.log(
            "MODULE UPDATED:",
            updatedData
        );


        // ==================================================
        // UPDATE LECTURES
        // ==================================================

        for (const lecture of lectures) {

            if (
                !lecture.id ||
                !lecture._dayInput
            ) {
                continue;
            }


            const lectureUpdate = {

                day:
                    lecture._dayInput.value.trim(),

                start_time:
                    lecture._startTimeInput.value.trim(),

                end_time:
                    lecture._endTimeInput.value.trim(),

                venue:
                    lecture._venueInput.value.trim()
            };


            const {
                error
            } = await supabase
                .from("lectures")
                .update(lectureUpdate)
                .eq("id", lecture.id)
                .eq("module_id", moduleId);


            if (error) {

                console.error(
                    "LECTURE UPDATE ERROR:",
                    error
                );

                throw error;
            }
        }


        // ==================================================
        // UPDATE ASSESSMENTS
        // ==================================================

        for (const assessment of assessments) {

            if (
                !assessment.id ||
                !assessment._titleInput
            ) {
                continue;
            }


            const assessmentUpdate = {

                title:
                    assessment._titleInput.value.trim(),

                due_date:
                    assessment._dueDateInput.value.trim(),

                weight:
                    assessment._weightInput.value.trim()
            };


            const {
                error
            } = await supabase
                .from("assessments")
                .update(assessmentUpdate)
                .eq("id", assessment.id)
                .eq("module_id", moduleId);


            if (error) {

                console.error(
                    "ASSESSMENT UPDATE ERROR:",
                    error
                );

                throw error;
            }
        }


        // ==================================================
        // UPDATE ACADEMIC EVENTS
        // ==================================================

        for (const event of academicEvents) {

            if (
                !event.id ||
                !event._titleInput
            ) {
                continue;
            }


            const eventUpdate = {

                title:
                    event._titleInput.value.trim(),

                type:
                    event._typeInput.value.trim(),

                start_date:
                    event._startDateInput.value.trim() ||
                    null,

                end_date:
                    event._endDateInput.value.trim() ||
                    null,

                description:
                    event._descriptionInput.value.trim()
            };


            const {
                error
            } = await supabase
                .from("academic_events")
                .update(eventUpdate)
                .eq("id", event.id)
                .eq("module_id", moduleId);


            if (error) {

                console.warn(
                    "ACADEMIC EVENT UPDATE SKIPPED:",
                    error
                );
            }
        }


        // ==================================================
        // SUCCESS
        // ==================================================

        console.log(
            "COMPLETE MODULE SAVED:",
            moduleId
        );


        // ==================================================
        // GO TO TRACK MODULE
        // ==================================================

        window.location.href =
            `23 moduleTrack.html?id=${encodeURIComponent(moduleId)}`;
    }


    catch (error) {

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

            window.location.href =
                "08 modules.html";
        }
    );
}


// ==================================================
// START
// ==================================================

loadModule();