import { supabase } from "./supabase.js";


// ============================================================
// GET MODULE ID FROM URL
// ============================================================

const params =
    new URLSearchParams(window.location.search);

const moduleId =
    Number(
        params.get("id")
    );


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


    if (
        !moduleId ||
        Number.isNaN(moduleId)
    ) {

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

        .eq(
            "id",
            moduleId
        )

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

    await loadLectures(
        moduleId
    );

    await loadAssessments(
        moduleId
    );

    await loadPeople(
        moduleId
    );

    await loadAcademicEvents(
        moduleId
    );

}


// ============================================================
// LOAD CLASSES / LECTURES
// ============================================================

async function loadLectures(
    moduleId
) {

    if (!lectureList) {

        return;

    }


    const {
        data: lectures,
        error
    } = await supabase

        .from("lectures")

        .select("*")

        .eq(
            "module_id",
            moduleId
        )

        .order(
            "id",
            {
                ascending: true
            }
        );


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


// ====================================================
// EDIT CLASS
// ====================================================

edit.addEventListener(
    "click",
    function () {

        openLectureForm(
            lecture
        );

    }
);


// ====================================================
// DELETE CLASS
// ====================================================

deleteBtn.addEventListener(
    "click",
    async function () {

        const confirmed =
            confirm(
                "Are you sure you want to delete this class?"
            );


        if (!confirmed) {

            return;

        }


        const {
            error:
                deleteError
        } = await supabase

            .from("lectures")

            .delete()

            .eq(
                "id",
                lecture.id
            )

            .eq(
                "module_id",
                moduleId
            );


        if (deleteError) {

            console.error(
                "Could not delete lecture:",
                deleteError
            );

            alert(
                "Could not delete the class.\n\n" +
                deleteError.message
            );

            return;

        }


        await loadLectures(
            moduleId
        );

    }
);


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
// OPEN LECTURE FORM
// ============================================================

function openLectureForm(
    lecture
) {

    // ========================================================
    // CREATE FORM OVERLAY
    // ========================================================

    const overlay =
        document.createElement("div");

    overlay.className =
        "assessment-form-overlay";


    // ========================================================
    // CREATE FORM
    // ========================================================

    const form =
        document.createElement("form");

    form.className =
        "assessment-form";


    // ========================================================
    // FORM TITLE
    // ========================================================

    const heading =
        document.createElement("h2");

    heading.textContent =
        "Edit Class";


    // ========================================================
    // DAY
    // ========================================================

    const dayLabel =
        document.createElement("label");

    dayLabel.textContent =
        "Day";


    const dayInput =
        document.createElement("select");

    dayInput.required =
        true;


    const days = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
    ];


    days.forEach(
        function(day) {

            const option =
                document.createElement("option");

            option.value =
                day;

            option.textContent =
                day;
     if (
    String(lecture.day || "").trim().toLowerCase() ===
    day.toLowerCase()
) {

    option.selected =
        true;

}

            dayInput.appendChild(
                option
            );

        }
    );


    dayLabel.appendChild(
        dayInput
    );


    // ========================================================
    // START TIME
    // ========================================================

    const startLabel =
        document.createElement("label");

    startLabel.textContent =
        "Start Time";


    const startInput =
        document.createElement("input");

    startInput.type =
        "time";

    startInput.required =
        true;

    startInput.value =
        lecture.start_time ||
        "";


    startLabel.appendChild(
        startInput
    );


    // ========================================================
    // END TIME
    // ========================================================

    const endLabel =
        document.createElement("label");

    endLabel.textContent =
        "End Time";


    const endInput =
        document.createElement("input");

    endInput.type =
        "time";

    endInput.required =
        true;

    endInput.value =
        lecture.end_time ||
        "";


    endLabel.appendChild(
        endInput
    );


    // ========================================================
    // VENUE
    // ========================================================

    const venueLabel =
        document.createElement("label");

    venueLabel.textContent =
        "Venue";


    const venueInput =
        document.createElement("input");

    venueInput.type =
        "text";

    venueInput.placeholder =
        "Enter venue";

    venueInput.value =
        lecture.venue ||
        "";


    venueLabel.appendChild(
        venueInput
    );


    // ========================================================
    // FORM BUTTONS
    // ========================================================

    const buttons =
        document.createElement("div");

    buttons.className =
        "assessment-form-actions";


    const cancelButton =
        document.createElement("button");

    cancelButton.type =
        "button";

    cancelButton.textContent =
        "Cancel";


    const saveButton =
        document.createElement("button");

    saveButton.type =
        "submit";

    saveButton.textContent =
        "Save Changes";


    buttons.appendChild(
        cancelButton
    );

    buttons.appendChild(
        saveButton
    );


    // ========================================================
    // ADD FORM ELEMENTS
    // ========================================================

    form.appendChild(
        heading
    );

    form.appendChild(
        dayLabel
    );

    form.appendChild(
        startLabel
    );

    form.appendChild(
        endLabel
    );

    form.appendChild(
        venueLabel
    );

    form.appendChild(
        buttons
    );


    overlay.appendChild(
        form
    );


    document.body.appendChild(
        overlay
    );


    // ========================================================
    // CANCEL BUTTON
    // ========================================================

    cancelButton.addEventListener(
        "click",
        function() {

            overlay.remove();

        }
    );


    // ========================================================
    // CLOSE WHEN CLICKING OUTSIDE
    // ========================================================

    overlay.addEventListener(
        "click",
        function(event) {

            if (
                event.target ===
                overlay
            ) {

                overlay.remove();

            }

        }
    );


    // ========================================================
    // SAVE CLASS
    // ========================================================

    form.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const day =
                dayInput.value;

            const startTime =
                startInput.value;

            const endTime =
                endInput.value;

            const venue =
                venueInput.value.trim();


            // ==================================================
            // CHECK REQUIRED FIELDS
            // ==================================================

            if (
                !day ||
                !startTime ||
                !endTime
            ) {

                alert(
                    "Please complete all required fields."
                );

                return;

            }


            saveButton.disabled =
                true;

            saveButton.textContent =
                "Saving...";


            try {

                // ==============================================
                // UPDATE CLASS IN SUPABASE
                // ==============================================

                const {
                    error
                } = await supabase

                    .from("lectures")

                    .update({

                        day:
                            day,

                        start_time:
                            startTime,

                        end_time:
                            endTime,

                        venue:
                            venue ||
                            null

                    })

                    .eq(
                        "id",
                        lecture.id
                    )

                    .eq(
                        "module_id",
                        moduleId
                    );


                if (error) {

                    throw error;

                }


                // ==============================================
                // CLOSE FORM
                // ==============================================

                overlay.remove();


                // ==============================================
                // RELOAD CLASSES
                // ==============================================

                await loadLectures(
                    moduleId
                );

            }

            catch (error) {

                console.error(
                    "SAVE CLASS ERROR:",
                    error
                );

                alert(
                    "Could not save the class.\n\n" +
                    error.message
                );

            }

            finally {

                saveButton.disabled =
                    false;

                saveButton.textContent =
                    "Save Changes";

            }

        }
    );

}

// ============================================================
// LOAD ASSESSMENTS CHECKLIST
// ============================================================

async function loadAssessments(
    moduleId
) {

    if (!assessmentList) {

        return;

    }


    const {
        data,
        error
    } = await supabase

        .from("assessments")

        .select("*")

        .eq(
            "module_id",
            moduleId
        )

        .order(
            "id",
            {
                ascending: true
            }
        );


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


            // ====================================================
            // EDIT ASSESSMENT
            // ====================================================

            edit.addEventListener(
                "click",
                function () {

                    openAssessmentForm(
                        assessment
                    );

                }
            );


            // ====================================================
            // DELETE ASSESSMENT
            // ====================================================

            deleteBtn.addEventListener(
                "click",
                async function () {

                    const confirmed =
                        confirm(
                            `Are you sure you want to delete "${assessment.title}"?`
                        );


                    if (!confirmed) {

                        return;

                    }


                    const {
                        error:
                            deleteError
                    } = await supabase

                        .from("assessments")

                        .delete()

                        .eq(
                            "id",
                            assessment.id
                        )

                        .eq(
                            "module_id",
                            moduleId
                        );


                    if (deleteError) {

                        console.error(
                            "Could not delete assessment:",
                            deleteError
                        );

                        alert(
                            "Could not delete the assessment."
                        );

                        return;

                    }


                    await loadAssessments(
                        moduleId
                    );

                }
            );


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

                return (
                    assessment.completed === true
                );

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

        if (
            percentage === 100
        ) {

            progressStatus.textContent =
                "Module complete";

        }

        else if (
            percentage >= 75
        ) {

            progressStatus.textContent =
                "Almost there";

        }

        else if (
            percentage >= 50
        ) {

            progressStatus.textContent =
                "Good progress";

        }

        else if (
            percentage > 0
        ) {

            progressStatus.textContent =
                "Getting started";

        }

        else {

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

        if (
            total === 0
        ) {

            progressMessage.textContent =
                "No assessments have been added yet.";

        }

        else {

            progressMessage.textContent =
                `${completed} of ${total} assessments completed.`;

        }

    }

}

// ============================================================
// LOAD PEOPLE
// ============================================================

async function loadPeople(
    moduleId
) {

    if (!peopleList) {
        return;
    }


    const {
        data: lecturers,
        error: lecturerError
    } = await supabase
        .from("lecturers")
        .select("*")
        .eq(
            "module_id",
            moduleId
        )
        .order(
            "id",
            {
                ascending: true
            }
        );


    const {
        data: tutors,
        error: tutorError
    } = await supabase
        .from("tutors")
        .select("*")
        .eq(
            "module_id",
            moduleId
        )
        .order(
            "id",
            {
                ascending: true
            }
        );


    if (
        lecturerError ||
        tutorError
    ) {

        console.error(
            "Could not load people:",
            lecturerError ||
            tutorError
        );

        peopleList.innerHTML =
            "<div class='section-empty'><h3>Could not load people</h3><p>Please try again.</p></div>";

        return;
    }


    peopleList.innerHTML =
        "";


    const hasLecturers =
        lecturers &&
        lecturers.length > 0;


    const hasTutors =
        tutors &&
        tutors.length > 0;


    if (
        !hasLecturers &&
        !hasTutors
    ) {

        peopleList.innerHTML =
            "<div class='section-empty'><h3>No people yet</h3><p>No lecturers or tutors have been added for this module.</p></div>";

        return;
    }


    // ========================================================
    // LECTURES
    // ========================================================

    if (hasLecturers) {

        const lectureSection =
            document.createElement("section");

        lectureSection.className =
            "people-section";


        const lectureHeading =
            document.createElement("h3");

        lectureHeading.className =
            "people-section-heading";

        lectureHeading.textContent =
            "Lectures";


        const lectureList =
            document.createElement("div");

        lectureList.className =
            "people-section-list";


        lectureSection.appendChild(
            lectureHeading
        );

        lectureSection.appendChild(
            lectureList
        );


        lecturers.forEach(
            function (lecturer) {

                const person = {

                    id:
                        lecturer.id,

                    name:
                        lecturer.name ||
                        "Lecturer",

                    email:
                        lecturer.email ||
                        "",

                    type:
                        "Lecturer",

                    table:
                        "lecturers"

                };


                const card =
                    document.createElement("article");

                card.className =
                    "people-card";


                const personInfo =
                    document.createElement("div");

                personInfo.className =
                    "person-info";


                const name =
                    document.createElement("h4");

                name.className =
                    "person-name";

                name.textContent =
                    person.name;


                const type =
                    document.createElement("p");

                type.className =
                    "person-role";

                type.textContent =
                    person.type;


                personInfo.appendChild(
                    name
                );

                personInfo.appendChild(
                    type
                );


                if (person.email) {

                    const email =
                        document.createElement("p");

                    email.className =
                        "person-email";

                    email.textContent =
                        person.email;

                    personInfo.appendChild(
                        email
                    );

                }


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


                const deleteButton =
                    document.createElement("button");

                deleteButton.type =
                    "button";

                deleteButton.className =
                    "card-action-btn card-action-delete";

                deleteButton.textContent =
                    "Delete";


                edit.addEventListener(
                    "click",
                    function () {

                        openPersonForm(
                            person
                        );

                    }
                );


                deleteButton.addEventListener(
                    "click",
                    async function () {

                        const confirmed =
                            confirm(
                                `Are you sure you want to delete "${person.name}"?`
                            );


                        if (!confirmed) {
                            return;
                        }


                        try {

                            const {
                                error
                            } = await supabase
                                .from(
                                    person.table
                                )
                                .delete()
                                .eq(
                                    "id",
                                    person.id
                                )
                                .eq(
                                    "module_id",
                                    moduleId
                                );


                            if (error) {
                                throw error;
                            }


                            await loadPeople(
                                moduleId
                            );

                        }

                        catch (error) {

                            console.error(
                                "Could not delete person:",
                                error
                            );

                            alert(
                                "Could not delete the person.\n\n" +
                                error.message
                            );

                        }

                    }
                );


                actions.appendChild(
                    edit
                );

                actions.appendChild(
                    deleteButton
                );


                card.appendChild(
                    personInfo
                );

                card.appendChild(
                    actions
                );


                lectureList.appendChild(
                    card
                );

            }
        );


        peopleList.appendChild(
            lectureSection
        );

    }


    // ========================================================
    // TUTORS
    // ========================================================

    if (hasTutors) {

        const tutorSection =
            document.createElement("section");

        tutorSection.className =
            "people-section";


        const tutorHeading =
            document.createElement("h3");

        tutorHeading.className =
            "people-section-heading";

        tutorHeading.textContent =
            "Tutors";


        const tutorList =
            document.createElement("div");

        tutorList.className =
            "people-section-list";


        tutorSection.appendChild(
            tutorHeading
        );

        tutorSection.appendChild(
            tutorList
        );


        tutors.forEach(
            function (tutor) {

                const person = {

                    id:
                        tutor.id,

                    name:
                        tutor.name ||
                        "Tutor",

                    email:
                        tutor.email ||
                        "",

                    type:
                        "Tutor",

                    table:
                        "tutors"

                };


                const card =
                    document.createElement("article");

                card.className =
                    "people-card";


                const personInfo =
                    document.createElement("div");

                personInfo.className =
                    "person-info";


                const name =
                    document.createElement("h4");

                name.className =
                    "person-name";

                name.textContent =
                    person.name;


                const type =
                    document.createElement("p");

                type.className =
                    "person-role";

                type.textContent =
                    person.type;


                personInfo.appendChild(
                    name
                );

                personInfo.appendChild(
                    type
                );


                if (person.email) {

                    const email =
                        document.createElement("p");

                    email.className =
                        "person-email";

                    email.textContent =
                        person.email;

                    personInfo.appendChild(
                        email
                    );

                }


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


                const deleteButton =
                    document.createElement("button");

                deleteButton.type =
                    "button";

                deleteButton.className =
                    "card-action-btn card-action-delete";

                deleteButton.textContent =
                    "Delete";


                edit.addEventListener(
                    "click",
                    function () {

                        openPersonForm(
                            person
                        );

                    }
                );


                deleteButton.addEventListener(
                    "click",
                    async function () {

                        const confirmed =
                            confirm(
                                `Are you sure you want to delete "${person.name}"?`
                            );


                        if (!confirmed) {
                            return;
                        }


                        try {

                            const {
                                error
                            } = await supabase
                                .from(
                                    person.table
                                )
                                .delete()
                                .eq(
                                    "id",
                                    person.id
                                )
                                .eq(
                                    "module_id",
                                    moduleId
                                );


                            if (error) {
                                throw error;
                            }


                            await loadPeople(
                                moduleId
                            );

                        }

                        catch (error) {

                            console.error(
                                "Could not delete person:",
                                error
                            );

                            alert(
                                "Could not delete the person.\n\n" +
                                error.message
                            );

                        }

                    }
                );


                actions.appendChild(
                    edit
                );

                actions.appendChild(
                    deleteButton
                );


                card.appendChild(
                    personInfo
                );

                card.appendChild(
                    actions
                );


                tutorList.appendChild(
                    card
                );

            }
        );


        peopleList.appendChild(
            tutorSection
        );

    }


    console.log(
        "PEOPLE FOUND:",
        {
            lecturers:
                lecturers,

            tutors:
                tutors
        }
    );

}

// ============================================================
// LOAD ACADEMIC EVENTS
// ============================================================

async function loadAcademicEvents(
    moduleId
) {

    if (!academicEventsList) {

        return;

    }


    const {
        data: events,
        error
    } = await supabase

        .from("academic_events")

        .select("*")

        .eq(
            "module_id",
            moduleId
        )

        .order(
            "id",
            {
                ascending: true
            }
        );


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

            card.className ="academic-event-card";

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

            }

            else {

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

            if (
                event.description
            ) {

                const description =
                    document.createElement("p");


                description.textContent =
                    event.description;


                card.appendChild(
                    description
                );

            }

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


// ====================================================
// EDIT
// ====================================================

edit.addEventListener(
    "click",
    function () {

        openAcademicEventForm(
            event
        );

    }
);


// ====================================================
// DELETE
// ====================================================

deleteBtn.addEventListener(
    "click",
    async function () {

        const confirmed =
            confirm(
                `Are you sure you want to delete "${event.title}"?`
            );


        if (!confirmed) {

            return;

        }


        try {

            const {
                error
            } = await supabase
                .from("academic_events")
                .delete()
                .eq(
                    "id",
                    event.id
                )
                .eq(
                    "module_id",
                    moduleId
                );


            if (error) {

                throw error;

            }


            await loadAcademicEvents(
                moduleId
            );

        }

        catch (error) {

            console.error(
                "Could not delete academic event:",
                error
            );

            alert(
                "Could not delete the academic event.\n\n" +
                error.message
            );

        }

    }
);


actions.appendChild(
    edit
);


actions.appendChild(
    deleteBtn
);


card.appendChild(
    actions
);

            academicEventsList.appendChild(
                card
            );

        }
    );

}

// ============================================================
// EDIT ACADEMIC EVENT
// ============================================================

function openAcademicEventForm(
    event
) {

    const overlay =
        document.createElement("div");

    overlay.className =
        "module-edit-overlay";


    const form =
        document.createElement("form");

    form.className =
        "module-edit-form";


    // ========================================================
    // FORM TITLE
    // ========================================================

    const heading =
        document.createElement("h2");

    heading.textContent =
        "Edit Academic Event";


    // ========================================================
    // FORM DESCRIPTION
    // ========================================================

    const description =
        document.createElement("p");

    description.textContent =
        "Update the academic event details for this module.";


    // ========================================================
    // EVENT TITLE
    // ========================================================

    const titleLabel =
        document.createElement("label");

    titleLabel.textContent =
        "Event Title";


    const titleInput =
        document.createElement("input");

    titleInput.type =
        "text";

    titleInput.required =
        true;

    titleInput.value =
        event.title ||
        "";


    titleLabel.appendChild(
        titleInput
    );


    // ========================================================
    // EVENT TYPE
    // ========================================================

    const typeLabel =
        document.createElement("label");

    typeLabel.textContent =
        "Event Type";


    const typeInput =
        document.createElement("input");

    typeInput.type =
        "text";

    typeInput.required =
        true;

    typeInput.value =
        event.type ||
        "";


    typeLabel.appendChild(
        typeInput
    );


    // ========================================================
    // START DATE
    // ========================================================

    const startDateLabel =
        document.createElement("label");

    startDateLabel.textContent =
        "Start Date";


    const startDateInput =
        document.createElement("input");

    startDateInput.type =
        "date";

    startDateInput.required =
        true;

    startDateInput.value =
        event.start_date
            ? String(
                event.start_date
            ).substring(0, 10)
            : "";


    startDateLabel.appendChild(
        startDateInput
    );


    // ========================================================
    // END DATE
    // ========================================================

    const endDateLabel =
        document.createElement("label");

    endDateLabel.textContent =
        "End Date";


    const endDateInput =
        document.createElement("input");

    endDateInput.type =
        "date";

    endDateInput.value =
        event.end_date
            ? String(
                event.end_date
            ).substring(0, 10)
            : "";


    endDateLabel.appendChild(
        endDateInput
    );


    // ========================================================
    // DESCRIPTION
    // ========================================================

    const eventDescriptionLabel =
        document.createElement("label");

    eventDescriptionLabel.textContent =
        "Description";


    const eventDescriptionInput =
        document.createElement("textarea");

    eventDescriptionInput.rows =
        4;

    eventDescriptionInput.placeholder =
        "Enter event description";

    eventDescriptionInput.value =
        event.description ||
        "";


    eventDescriptionLabel.appendChild(
        eventDescriptionInput
    );


    // ========================================================
    // BUTTONS
    // ========================================================

    const actions =
        document.createElement("div");

    actions.className =
        "module-edit-actions";


    const cancelButton =
        document.createElement("button");

    cancelButton.type =
        "button";

    cancelButton.className =
        "module-cancel-btn";

    cancelButton.textContent =
        "Cancel";


    const saveButton =
        document.createElement("button");

    saveButton.type =
        "submit";

    saveButton.className =
        "module-save-btn";

    saveButton.textContent =
        "Save Changes";


    actions.appendChild(
        cancelButton
    );

    actions.appendChild(
        saveButton
    );


    // ========================================================
    // ADD FORM ELEMENTS
    // ========================================================

    form.appendChild(
        heading
    );

    form.appendChild(
        description
    );

    form.appendChild(
        titleLabel
    );

    form.appendChild(
        typeLabel
    );

    form.appendChild(
        startDateLabel
    );

    form.appendChild(
        endDateLabel
    );

    form.appendChild(
        eventDescriptionLabel
    );

    form.appendChild(
        actions
    );


    // ========================================================
    // ADD FORM TO PAGE
    // ========================================================

    overlay.appendChild(
        form
    );

    document.body.appendChild(
        overlay
    );


    // ========================================================
    // CANCEL
    // ========================================================

    cancelButton.addEventListener(
        "click",
        function () {

            overlay.remove();

        }
    );


    // ========================================================
    // CLOSE WHEN CLICKING OUTSIDE
    // ========================================================

    overlay.addEventListener(
        "click",
        function (clickEvent) {

            if (
                clickEvent.target ===
                overlay
            ) {

                overlay.remove();

            }

        }
    );


    // ========================================================
    // SAVE CHANGES
    // ========================================================

    form.addEventListener(
        "submit",
        async function (submitEvent) {

            submitEvent.preventDefault();


            const title =
                titleInput.value.trim();

            const type =
                typeInput.value.trim();

            const startDate =
                startDateInput.value ||
                null;

            const endDate =
                endDateInput.value ||
                null;

            const eventDescription =
                eventDescriptionInput.value.trim();


            // ==================================================
            // CHECK REQUIRED FIELDS
            // ==================================================

            if (
                !title ||
                !type ||
                !startDate
            ) {

                alert(
                    "Please complete all required fields."
                );

                return;

            }


            saveButton.disabled =
                true;

            saveButton.textContent =
                "Saving...";


            try {

                const {
                    error
                } = await supabase

                    .from(
                        "academic_events"
                    )

                    .update({

                        title:
                            title,

                        type:
                            type,

                        start_date:
                            startDate,

                        end_date:
                            endDate,

                        description:
                            eventDescription ||
                            null

                    })

                    .eq(
                        "id",
                        event.id
                    )

                    .eq(
                        "module_id",
                        moduleId
                    );


                if (error) {

                    throw error;

                }


                // ==================================================
                // CLOSE FORM
                // ==================================================

                overlay.remove();


                // ==================================================
                // RELOAD EVENTS
                // ==================================================

                await loadAcademicEvents(
                    moduleId
                );

            }

            catch (error) {

                console.error(
                    "Could not update academic event:",
                    error
                );

                alert(
                    "Could not update the academic event.\n\n" +
                    error.message
                );

            }

            finally {

                saveButton.disabled =
                    false;

                saveButton.textContent =
                    "Save Changes";

            }

        }
    );

}


// ============================================================
// EDIT PERSON
// ============================================================

function openPersonForm(
    person
) {

    const overlay =
        document.createElement("div");

    overlay.className =
        "module-edit-overlay";


    const form =
        document.createElement("form");

    form.className =
        "module-edit-form";


    const heading =
        document.createElement("h2");

    heading.textContent =
        `Edit ${person.type}`;


    const description =
        document.createElement("p");

    description.textContent =
        `Update the ${person.type.toLowerCase()} details for this module.`;


    // ========================================================
    // PERSON TYPE
    // ========================================================

    const typeLabel =
        document.createElement("label");

    typeLabel.textContent =
        "Person Type";


    const typeInput =
        document.createElement("select");


    const lecturerOption =
        document.createElement("option");

    lecturerOption.value =
        "Lecturer";

    lecturerOption.textContent =
        "Lecturer";


    const tutorOption =
        document.createElement("option");

    tutorOption.value =
        "Tutor";

    tutorOption.textContent =
        "Tutor";


    typeInput.appendChild(
        lecturerOption
    );

    typeInput.appendChild(
        tutorOption
    );


    typeInput.value =
        person.type;


    typeLabel.appendChild(
        typeInput
    );


    // ========================================================
    // NAME
    // ========================================================

    const nameLabel =
        document.createElement("label");

    nameLabel.textContent =
        "Name";


    const nameInput =
        document.createElement("input");

    nameInput.type =
        "text";

    nameInput.required =
        true;

    nameInput.value =
        person.name ||
        "";


    nameLabel.appendChild(
        nameInput
    );


    // ========================================================
    // EMAIL
    // ========================================================

    const emailLabel =
        document.createElement("label");

    emailLabel.textContent =
        "Email";


    const emailInput =
        document.createElement("input");

    emailInput.type =
        "email";

    emailInput.value =
        person.email ||
        "";


    emailLabel.appendChild(
        emailInput
    );


    // ========================================================
    // BUTTONS
    // ========================================================

    const actions =
        document.createElement("div");

    actions.className =
        "module-edit-actions";


    const cancelButton =
        document.createElement("button");

    cancelButton.type =
        "button";

    cancelButton.className =
        "module-cancel-btn";

    cancelButton.textContent =
        "Cancel";


    const saveButton =
        document.createElement("button");

    saveButton.type =
        "submit";

    saveButton.className =
        "module-save-btn";

    saveButton.textContent =
        "Save Changes";


    actions.appendChild(
        cancelButton
    );

    actions.appendChild(
        saveButton
    );


    form.appendChild(
        heading
    );

    form.appendChild(
        description
    );

    form.appendChild(
        typeLabel
    );

    form.appendChild(
        nameLabel
    );

    form.appendChild(
        emailLabel
    );

    form.appendChild(
        actions
    );


    overlay.appendChild(
        form
    );


    document.body.appendChild(
        overlay
    );


    // ========================================================
    // CLOSE FORM
    // ========================================================

    cancelButton.addEventListener(
        "click",
        function () {

            overlay.remove();

        }
    );


    overlay.addEventListener(
        "click",
        function (event) {

            if (
                event.target ===
                overlay
            ) {

                overlay.remove();

            }

        }
    );


    // ========================================================
    // SAVE CHANGES
    // ========================================================

    form.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const name =
                nameInput.value.trim();

            const email =
                emailInput.value.trim();

            const newType =
                typeInput.value;


            if (!name) {

                alert(
                    "Please enter a name."
                );

                return;
            }


            saveButton.disabled =
                true;

            saveButton.textContent =
                "Saving...";


            try {

                const newTable =
                    newType === "Lecturer"
                        ? "lecturers"
                        : "tutors";


                // ====================================================
                // SAME TYPE
                // ====================================================

                if (
                    newTable ===
                    person.table
                ) {

                    const {
                        error
                    } = await supabase
                        .from(
                            person.table
                        )
                        .update({

                            name:
                                name,

                            email:
                                email ||
                                null

                        })
                        .eq(
                            "id",
                            person.id
                        )
                        .eq(
                            "module_id",
                            moduleId
                        );


                    if (error) {
                        throw error;
                    }

                }


                // ====================================================
                // TYPE CHANGED
                // ====================================================

                else {

                    const {
                        error:
                            insertError
                    } = await supabase
                        .from(
                            newTable
                        )
                        .insert({

                            module_id:
                                moduleId,

                            name:
                                name,

                            email:
                                email ||
                                null

                        });


                    if (insertError) {
                        throw insertError;
                    }


                    const {
                        error:
                            deleteError
                    } = await supabase
                        .from(
                            person.table
                        )
                        .delete()
                        .eq(
                            "id",
                            person.id
                        )
                        .eq(
                            "module_id",
                            moduleId
                        );


                    if (deleteError) {
                        throw deleteError;
                    }

                }


                overlay.remove();


                await loadPeople(
                    moduleId
                );

            }

            catch (error) {

                console.error(
                    "Could not update person:",
                    error
                );

                alert(
                    "Could not update the person.\n\n" +
                    error.message
                );

            }

            finally {

                saveButton.disabled =
                    false;

                saveButton.textContent =
                    "Save Changes";

            }

        }
    );

}

// ============================================================
// OPEN ASSESSMENT FORM
// ============================================================

function openAssessmentForm(
    assessment = null
) {

    // ========================================================
    // CREATE FORM OVERLAY
    // ========================================================

    const overlay =
        document.createElement("div");

    overlay.className =
        "assessment-form-overlay";


    // ========================================================
    // CREATE FORM
    // ========================================================

    const form =
        document.createElement("form");

    form.className =
        "assessment-form";


    // ========================================================
    // FORM TITLE
    // ========================================================

    const heading =
        document.createElement("h2");

    heading.textContent =
        assessment
            ? "Edit Assessment"
            : "Add Assessment";


    // ========================================================
    // TITLE
    // ========================================================

    const titleLabel =
        document.createElement("label");

    titleLabel.textContent =
        "Assessment Title";


    const titleInput =
        document.createElement("input");

    titleInput.type =
        "text";

    titleInput.required =
        true;

    titleInput.value =
        assessment?.title ||
        "";


    titleLabel.appendChild(
        titleInput
    );


    // ========================================================
    // WEIGHT
    // ========================================================

    const weightLabel =
        document.createElement("label");

    weightLabel.textContent =
        "Weight";


    const weightInput =
        document.createElement("input");

    weightInput.type =
        "text";

    weightInput.placeholder =
        "e.g. 20%";

    weightInput.value =
        assessment?.weight ||
        "";


    weightLabel.appendChild(
        weightInput
    );


    // ========================================================
    // DUE DATE
    // ========================================================

    const dateLabel =
        document.createElement("label");

    dateLabel.textContent =
        "Due Date";


    const dateInput =
        document.createElement("input");

    dateInput.type =
        "date";

    dateInput.value =
        assessment?.due_date ||
        "";


    dateLabel.appendChild(
        dateInput
    );


    // ========================================================
    // FORM BUTTONS
    // ========================================================

    const buttons =
        document.createElement("div");

    buttons.className =
        "assessment-form-actions";


    const cancelButton =
        document.createElement("button");

    cancelButton.type =
        "button";

    cancelButton.textContent =
        "Cancel";


    const saveButton =
        document.createElement("button");

    saveButton.type =
        "submit";

    saveButton.textContent =
        assessment
            ? "Save Changes"
            : "Add Assessment";


    buttons.appendChild(
        cancelButton
    );

    buttons.appendChild(
        saveButton
    );


    // ========================================================
    // ADD FORM ELEMENTS
    // ========================================================

    form.appendChild(
        heading
    );

    form.appendChild(
        titleLabel
    );

    form.appendChild(
        weightLabel
    );

    form.appendChild(
        dateLabel
    );

    form.appendChild(
        buttons
    );


    overlay.appendChild(
        form
    );


    document.body.appendChild(
        overlay
    );


    // ========================================================
    // CANCEL BUTTON
    // ========================================================

    cancelButton.addEventListener(
        "click",
        function () {

            overlay.remove();

        }
    );


    // ========================================================
    // CLOSE WHEN CLICKING OUTSIDE
    // ========================================================

    overlay.addEventListener(
        "click",
        function (event) {

            if (
                event.target ===
                overlay
            ) {

                overlay.remove();

            }

        }
    );


    // ========================================================
    // SAVE ASSESSMENT
    // ========================================================

    form.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const title =
                titleInput.value.trim();

            const weight =
                weightInput.value.trim();

            const dueDate =
                dateInput.value ||
                null;


            // ==================================================
            // CHECK TITLE
            // ==================================================

            if (!title) {

                alert(
                    "Please enter an assessment title."
                );

                return;

            }


            saveButton.disabled =
                true;

            saveButton.textContent =
                "Saving...";


            try {

                // ==============================================
                // EDIT EXISTING ASSESSMENT
                // ==============================================

                if (assessment) {

                    const {
                        error
                    } = await supabase

                        .from("assessments")

                        .update({

                            title:
                                title,

                            weight:
                                weight ||
                                null,

                            due_date:
                                dueDate

                        })

                        .eq(
                            "id",
                            assessment.id
                        )

                        .eq(
                            "module_id",
                            moduleId
                        );


                    if (error) {

                        throw error;

                    }

                }


                // ==============================================
                // ADD NEW ASSESSMENT
                // ==============================================

                else {

                    const {
                        data:
                            userData,
                        error:
                            userError
                    } =
                        await supabase.auth
                            .getUser();


                    if (userError) {

                        throw userError;

                    }


                    if (
                        !userData ||
                        !userData.user
                    ) {

                        alert(
                            "You must be logged in to add an assessment."
                        );

                        return;

                    }


                    const {
                        error
                    } = await supabase

                        .from("assessments")

                        .insert({

                            user_id:
                                userData.user.id,

                            module_id:
                                moduleId,

                            title:
                                title,

                            weight:
                                weight ||
                                null,

                            due_date:
                                dueDate,

                            completed:
                                false

                        });


                    if (error) {

                        throw error;

                    }

                }


                // ==============================================
                // CLOSE FORM
                // ==============================================

                overlay.remove();


                // ==============================================
                // RELOAD ASSESSMENTS
                // ==============================================

                await loadAssessments(
                    moduleId
                );

            }

            catch (error) {

                console.error(
                    "SAVE ASSESSMENT ERROR:",
                    error
                );

                alert(
                    "Could not save the assessment.\n\n" +
                    error.message
                );

            }

            finally {

                saveButton.disabled =
                    false;

                saveButton.textContent =
                    assessment
                        ? "Save Changes"
                        : "Add Assessment";

            }

        }
    );

}


// ============================================================
// ADD ASSESSMENT BUTTON
// ============================================================

document
    .querySelectorAll(
        ".add-section-btn"
    )
    .forEach(
        function (button) {

            if (
                button.textContent
                    .trim()
                    .includes(
                        "Add Assessment"
                    )
            ) {

                button.addEventListener(
                    "click",
                    function () {

                        openAssessmentForm();

                    }
                );

            }

        }
    );


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

// ============================================================
// ADD TO MODULE BUTTONS
// ============================================================

const addClassBtn =
    document.getElementById("addClassBtn");

const addAssessmentBtn =
    document.getElementById("addAssessmentBtn");

const addPersonBtn =
    document.getElementById("addPersonBtn");

const addEventBtn =
    document.getElementById("addEventBtn");


// ============================================================
// ADD LECTURE
// ============================================================

if(addClassBtn){

    addClassBtn.addEventListener(
        "click",
        function(){

            window.location.href =
                "24 addtrackbutton.html?type=lecture&module=" +
                encodeURIComponent(moduleId);

        }
    );

}


// ============================================================
// ADD ASSESSMENT
// ============================================================

if(addAssessmentBtn){

    addAssessmentBtn.addEventListener(
        "click",
        function(){

            window.location.href =
                "24 addtrackbutton.html?type=task&module=" +
                encodeURIComponent(moduleId);

        }
    );

}


// ============================================================
// ADD PERSON
// ============================================================

if(addPersonBtn){

    addPersonBtn.addEventListener(
        "click",
        function(){

            window.location.href =
                "24 addtrackbutton.html?type=person&module=" +
                encodeURIComponent(moduleId);

        }
    );

}


// ============================================================
// ADD ACADEMIC EVENT
// ============================================================

if(addEventBtn){

    addEventBtn.addEventListener(
        "click",
        function(){

            window.location.href =
                "24 addtrackbutton.html?type=event&module=" +
                encodeURIComponent(moduleId);

        }
    );

}