import { supabase } from "./supabase.js";


// ============================================================
// GET MODULE ID FROM URL
// ============================================================

const params =
    new URLSearchParams(window.location.search);

const moduleId =
    params.get("id");


// ============================================================
// STORE ASSESSMENTS
// ============================================================

let assessments = [];


// ============================================================
// GET HTML ELEMENTS
// ============================================================

const moduleHeader =
    document.getElementById("moduleHeader");

const moduleName =
    document.getElementById("moduleName");

const moduleCode =
    document.getElementById("moduleCode");

const moduleCredits =
    document.getElementById("moduleCredits");

const moduleSummary =
    document.getElementById("moduleSummary");

const lectureList =
    document.getElementById("lectureList");

const assessmentList =
    document.getElementById("assessmentList");

const peopleList =
    document.getElementById("peopleList");

const academicEventsList =
    document.getElementById("academicEventsList");


// ============================================================
// MODULE TABS
// ============================================================

const moduleTabs =
    document.querySelectorAll(".module-tab");


// ============================================================
// MODULE SECTIONS
// ============================================================

const moduleSections = {

    overview:
        document.getElementById("overviewSection"),

    classes:
        document.getElementById("classesSection"),

    assessments:
        document.getElementById("assessmentsSection"),

    people:
        document.getElementById("peopleSection"),

    academicEvents:
        document.getElementById("academicEventsSection")

};


// ============================================================
// LOAD MODULE
// ============================================================

async function loadModule() {

    console.log(
        "Module ID from URL:",
        moduleId
    );


    if (!moduleId) {

        console.error(
            "NO MODULE ID IN URL"
        );

        return;
    }


    // ========================================================
    // LOAD MODULE INFORMATION
    // ========================================================

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
            "Could not load module:",
            moduleError
        );

        return;
    }


    if (!module) {

        console.error(
            "No module found."
        );

        return;
    }


    console.log(
        "MODULE FOUND:",
        module
    );


    // ========================================================
    // MODULE NAME
    // ========================================================

    if (moduleName) {

        moduleName.textContent =
            module.module_name ||
            "Module Name";

    }


    // ========================================================
    // MODULE CODE
    // ========================================================

    if (moduleCode) {

        moduleCode.textContent =
            module.module_code ||
            "";

    }


    // ========================================================
    // SEMESTER
    // ========================================================

    if (moduleCredits) {

        moduleCredits.textContent =
            module.semester ||
            "Semester not provided";

    }


    // ========================================================
    // MODULE SUMMARY
    // ========================================================

    if (moduleSummary) {

        moduleSummary.textContent =
            module.summary ||
            "No module summary available.";

    }


    // ========================================================
    // MODULE COLOUR
    // ========================================================

    if (
        moduleHeader &&
        module.colour
    ) {

        moduleHeader.style.backgroundColor =
            module.colour;

    }


    // ========================================================
    // LOAD ALL MODULE INFORMATION
    // ========================================================

    await loadLectures(moduleId);

    await loadAssessments(moduleId);

    await loadPeople(moduleId);

    await loadAcademicEvents(moduleId);

}


// ============================================================
// LOAD CLASSES / LECTURES
// ============================================================

async function loadLectures(moduleId) {

    if (!lectureList) {

        return;

    }


    const {
        data: lectures,
        error
    } = await supabase

        .from("lectures")

        .select("*")

        .eq("module_id", moduleId)

        .order("id", {
            ascending: true
        });


    if (error) {

        console.error(
            "Could not load lectures:",
            error
        );

        lectureList.innerHTML =
            "<div class='section-empty'><h3>Could not load classes</h3><p>Please try again.</p></div>";

        return;
    }


    console.log(
        "LECTURES FOUND:",
        lectures
    );


    lectureList.innerHTML =
        "";


    if (
        !lectures ||
        lectures.length === 0
    ) {

        lectureList.innerHTML =
            "<div class='section-empty'><h3>No classes yet</h3><p>No lectures have been added for this module.</p></div>";

        return;
    }


    // ========================================================
    // CREATE EACH CLASS CARD
    // ========================================================

    lectures.forEach(
        function (lecture) {

            const card =
                document.createElement("article");


            card.className =
                "lecture-card";


            // ====================================================
            // DAY
            // ====================================================

            const day =
                document.createElement("h3");

            day.className =
                "lecture-day";

            day.textContent =
                lecture.day ||
                "Day not provided";


            // ====================================================
            // TIME
            // ====================================================

            const time =
                document.createElement("p");

            time.className =
                "lecture-time";

            time.textContent =
                `${lecture.start_time || "-"} - ${lecture.end_time || "-"}`;


            // ====================================================
            // VENUE
            // ====================================================

            const venue =
                document.createElement("p");

            venue.className =
                "lecture-venue";

            venue.textContent =
                lecture.venue ||
                "Venue not provided";


            // ====================================================
            // ACTIONS
            // ====================================================

            const actions =
                document.createElement("div");

            actions.className =
                "card-actions";


            const edit =
                document.createElement("button");

            edit.type =
                "button";

            edit.className =
                "card-action-btn";

            edit.textContent =
                "Edit";


            const deleteBtn =
                document.createElement("button");

            deleteBtn.type =
                "button";

            deleteBtn.className =
                "card-action-btn card-action-delete";

            deleteBtn.textContent =
                "Delete";


            actions.appendChild(
                edit
            );

            actions.appendChild(
                deleteBtn
            );


            // ====================================================
            // ADD TO CARD
            // ====================================================

            card.appendChild(
                day
            );

            card.appendChild(
                time
            );

            card.appendChild(
                venue
            );

            card.appendChild(
                actions
            );


            lectureList.appendChild(
                card
            );

        }
    );

}


// ============================================================
// LOAD ASSESSMENTS CHECKLIST
// ============================================================

async function loadAssessments(moduleId) {

    if (!assessmentList) {

        return;

    }


    const {
        data,
        error
    } = await supabase

        .from("assessments")

        .select("*")

        .eq("module_id", moduleId)

        .order("id", {
            ascending: true
        });


    if (error) {

        console.error(
            "Could not load assessments:",
            error
        );

        assessmentList.innerHTML =
            "<div class='section-empty'><h3>Could not load assessments</h3><p>Please try again.</p></div>";

        return;
    }


    // ========================================================
    // STORE ASSESSMENTS
    // ========================================================

    assessments =
        data || [];


    assessmentList.innerHTML =
        "";


    if (
        assessments.length === 0
    ) {

        assessmentList.innerHTML =
            "<div class='section-empty'><h3>No assessments yet</h3><p>No assessments have been added for this module.</p></div>";

        updateModuleProgress();

        return;
    }


    // ========================================================
    // CHECKLIST CONTAINER
    // ========================================================

    const checklist =
        document.createElement("div");

    checklist.className =
        "assessment-list";


    // ========================================================
    // CREATE EACH ASSESSMENT
    // ========================================================

    assessments.forEach(
        function (assessment) {

            const item =
                document.createElement("div");


            item.className =
                "assessment-item";


            if (
                assessment.completed === true
            ) {

                item.classList.add(
                    "completed"
                );

            }


            // ====================================================
            // CHECKBOX
            // ====================================================

            const checkbox =
                document.createElement("input");

            checkbox.type =
                "checkbox";

            checkbox.className =
                "assessment-checkbox";

            checkbox.checked =
                assessment.completed === true;


            // ====================================================
            // MAIN INFORMATION
            // ====================================================

            const main =
                document.createElement("div");

            main.className =
                "assessment-main";


            // ====================================================
            // ASSESSMENT TITLE
            // ====================================================

            const title =
                document.createElement("h3");

            title.className =
                "assessment-title";

            title.textContent =
                assessment.title ||
                "Untitled assessment";


            // ====================================================
            // ASSESSMENT DETAILS
            // ====================================================

            const details =
                document.createElement("div");

            details.className =
                "assessment-details";


            // ====================================================
            // WEIGHT
            // ====================================================

            const weight =
                document.createElement("span");

            weight.className =
                "assessment-weight";

            weight.textContent =
                assessment.weight ||
                "Weight not provided";


            // ====================================================
            // DUE DATE
            // ====================================================

            const date =
                document.createElement("span");

            date.className =
                "assessment-date";

            date.textContent =
                assessment.due_date
                    ? `Due ${assessment.due_date}`
                    : "Due date not provided";


            details.appendChild(
                weight
            );

            details.appendChild(
                date
            );


            main.appendChild(
                title
            );

            main.appendChild(
                details
            );


            // ====================================================
            // ACTIONS
            // ====================================================

            const actions =
                document.createElement("div");

            actions.className =
                "assessment-actions";


            const edit =
                document.createElement("button");

            edit.type =
                "button";

            edit.className =
                "assessment-action-btn assessment-edit-btn";

            edit.textContent =
                "Edit";


            const deleteBtn =
                document.createElement("button");

            deleteBtn.type =
                "button";

            deleteBtn.className =
                "assessment-action-btn assessment-delete-btn";

            deleteBtn.textContent =
                "Delete";


            actions.appendChild(
                edit
            );

            actions.appendChild(
                deleteBtn
            );


            // ====================================================
            // CHECKBOX UPDATE
            // ====================================================

            checkbox.addEventListener(
                "change",
                async function () {

                    const completed =
                        checkbox.checked;


                    // --------------------------------------------
                    // UPDATE VISUAL STATE
                    // --------------------------------------------

                    item.classList.toggle(
                        "completed",
                        completed
                    );


                    // --------------------------------------------
                    // SAVE TO SUPABASE
                    // --------------------------------------------

                    const {
                        error: updateError
                    } = await supabase

                        .from("assessments")

                        .update({
                            completed:
                                completed
                        })

                        .eq(
                            "id",
                            assessment.id
                        );


                    // --------------------------------------------
                    // HANDLE ERROR
                    // --------------------------------------------

                    if (updateError) {

                        console.error(
                            "Could not update assessment:",
                            updateError
                        );


                        checkbox.checked =
                            !completed;


                        item.classList.toggle(
                            "completed",
                            !completed
                        );


                        return;

                    }


                    // --------------------------------------------
                    // UPDATE LOCAL DATA
                    // --------------------------------------------

                    assessment.completed =
                        completed;


                    // --------------------------------------------
                    // UPDATE OVERVIEW PROGRESS
                    // --------------------------------------------

                    updateModuleProgress();

                }
            );


            // ====================================================
            // ADD ASSESSMENT TO CHECKLIST
            // ====================================================

            item.appendChild(
                checkbox
            );

            item.appendChild(
                main
            );

            item.appendChild(
                actions
            );


            checklist.appendChild(
                item
            );

        }
    );


    assessmentList.appendChild(
        checklist
    );


    // ========================================================
    // UPDATE OVERVIEW PROGRESS
    // ========================================================

    updateModuleProgress();

}


// ============================================================
// UPDATE MODULE PROGRESS
// ============================================================

function updateModuleProgress() {

    const total =
        assessments.length;


    const completed =
        assessments.filter(
            function (assessment) {

                return assessment.completed === true;

            }
        ).length;


    const remaining =
        total - completed;


    let percentage =
        0;


    if (total > 0) {

        percentage =
            Math.round(
                (completed / total) * 100
            );

    }


    console.log(
        "MODULE PROGRESS:",
        percentage + "%"
    );


    // ========================================================
    // UPDATE PERCENTAGE
    // ========================================================

    const progressPercentage =
        document.getElementById(
            "progressPercentage"
        );


    if (progressPercentage) {

        progressPercentage.textContent =
            percentage + "%";

    }


    // ========================================================
    // UPDATE COMPLETED TASKS
    // ========================================================

    const completedTasks =
        document.getElementById(
            "completedTasks"
        );


    if (completedTasks) {

        completedTasks.textContent =
            completed;

    }


    // ========================================================
    // UPDATE REMAINING TASKS
    // ========================================================

    const remainingTasks =
        document.getElementById(
            "remainingTasks"
        );


    if (remainingTasks) {

        remainingTasks.textContent =
            remaining;

    }


    // ========================================================
    // UPDATE ASSESSMENT COUNT
    // ========================================================

    const assessmentCount =
        document.getElementById(
            "assessmentCount"
        );


    if (assessmentCount) {

        assessmentCount.textContent =
            total;

    }


    // ========================================================
    // UPDATE PROGRESS CIRCLE
    // ========================================================

    const progressChart =
        document.querySelector(
            ".progress-chart"
        );


    if (progressChart) {

        progressChart.style.setProperty(
            "--progress",
            percentage + "%"
        );

    }


    // ========================================================
    // UPDATE PROGRESS STATUS
    // ========================================================

    const progressStatus =
        document.getElementById(
            "progressStatus"
        );


    if (progressStatus) {

        if (percentage === 100) {

            progressStatus.textContent =
                "Module complete";

        } else if (percentage >= 75) {

            progressStatus.textContent =
                "Almost there";

        } else if (percentage >= 50) {

            progressStatus.textContent =
                "Good progress";

        } else if (percentage > 0) {

            progressStatus.textContent =
                "Getting started";

        } else {

            progressStatus.textContent =
                "Not started";

        }

    }


    // ========================================================
    // UPDATE PROGRESS MESSAGE
    // ========================================================

    const progressMessage =
        document.getElementById(
            "progressMessage"
        );


    if (progressMessage) {

        if (total === 0) {

            progressMessage.textContent =
                "No assessments have been added yet.";

        } else {

            progressMessage.textContent =
                `${completed} of ${total} assessments completed.`;

        }

    }

}

// ============================================================
// LOAD ACADEMIC EVENTS
// ============================================================

async function loadAcademicEvents(moduleId) {

    if (!academicEventsList) {

        return;

    }


    const {
        data: events,
        error
    } = await supabase

        .from("academic_events")

        .select("*")

        .eq("module_id", moduleId)

        .order("id", {
            ascending: true
        });


    if (error) {

        console.error(
            "Could not load academic events:",
            error
        );


        academicEventsList.innerHTML =
            "<div class='section-empty'><h3>Could not load academic events</h3><p>Please try again.</p></div>";

        return;

    }


    console.log(
        "ACADEMIC EVENTS FOUND:",
        events
    );


    academicEventsList.innerHTML =
        "";


    // ========================================================
    // NO ACADEMIC EVENTS
    // ========================================================

    if (
        !events ||
        events.length === 0
    ) {

        academicEventsList.innerHTML =
            "<div class='section-empty'><h3>No academic events yet</h3><p>No academic events have been added for this module.</p></div>";

        return;

    }


    // ========================================================
    // CREATE EACH EVENT CARD
    // ========================================================

    events.forEach(
        function (event) {

            const card =
                document.createElement("article");


            card.className =
                "review-card";


            // ====================================================
            // TITLE
            // ====================================================

            const title =
                document.createElement("h3");


            title.textContent =
                event.title ||
                "Academic Event";


            // ====================================================
            // TYPE
            // ====================================================

            const type =
                document.createElement("p");


            type.textContent =
                event.type ||
                "Academic event";


            // ====================================================
            // DATE
            // ====================================================

            const date =
                document.createElement("p");


            if (
                event.start_date &&
                event.end_date
            ) {

                date.textContent =
                    `${event.start_date} - ${event.end_date}`;

            } else {

                date.textContent =
                    event.start_date ||
                    "Date not provided";

            }


            // ====================================================
            // ADD INFORMATION TO CARD
            // ====================================================

            card.appendChild(
                title
            );


            card.appendChild(
                type
            );


            card.appendChild(
                date
            );


            // ====================================================
            // DESCRIPTION
            // ====================================================

            if (event.description) {

                const description =
                    document.createElement("p");


                description.textContent =
                    event.description;


                card.appendChild(
                    description
                );

            }


            academicEventsList.appendChild(
                card
            );

        }
    );

}


// ============================================================
// SHOW MODULE SECTION
// ============================================================

function showModuleSection(
    sectionName
) {


    // ========================================================
    // HIDE ALL SECTIONS
    // ========================================================

    Object.values(
        moduleSections
    ).forEach(
        function (section) {

            if (section) {

                section.style.display =
                    "none";

            }

        }
    );


    // ========================================================
    // SHOW SELECTED SECTION
    // ========================================================

    const selectedSection =
        moduleSections[
            sectionName
        ];


    if (selectedSection) {

        selectedSection.style.display =
            "block";

    }


    // ========================================================
    // UPDATE ACTIVE TAB
    // ========================================================

    moduleTabs.forEach(
        function (tab) {

            tab.classList.remove(
                "active"
            );


            if (
                tab.dataset.section ===
                sectionName
            ) {

                tab.classList.add(
                    "active"
                );

            }

        }
    );

}


// ============================================================
// TAB BUTTONS
// ============================================================

moduleTabs.forEach(
    function (tab) {

        tab.addEventListener(
            "click",
            function () {

                const sectionName =
                    tab.dataset.section;


                showModuleSection(
                    sectionName
                );

            }
        );

    }
);


// ============================================================
// SHOW OVERVIEW FIRST
// ============================================================

showModuleSection(
    "overview"
);


// ============================================================
// START MODULE
// ============================================================

loadModule();


// ============================================================
// EDIT MODULE
// ============================================================

const editModuleBtn =
    document.getElementById(
        "editModuleBtn"
    );


if (editModuleBtn) {

    editModuleBtn.addEventListener(
        "click",
        function () {

            window.location.href =
                `08 modules.html?edit=${encodeURIComponent(moduleId)}`;

        }
    );

}

//======classes========