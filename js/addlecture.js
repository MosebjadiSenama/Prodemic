//==================================================
// IMPORTS
//==================================================

import { auth } from "../firebase.js";
import { supabase } from "./supabase.js";

//==================================================
// ELEMENTS
//==================================================

const lectureModule = document.getElementById("lectureModule");
const lectureDay = document.getElementById("lectureDay");
const startTime = document.getElementById("startTime");
const endTime = document.getElementById("endTime");
const venue = document.getElementById("venue");
const lecturer = document.getElementById("lecturer");

const saveLecture = document.getElementById("saveLecture");
const backToSchedule = document.getElementById("backToSchedule");

//==================================================
// VARIABLES
//==================================================

let editingLectureId = null;
let currentUser = null;

//==================================================
// LOAD MODULES
//==================================================

async function loadModules() {

    if (!currentUser) return;

    lectureModule.innerHTML = `
        <option value="">Select Module</option>
        <option value="new">+ Create New Module</option>
    `;

    const { data, error } = await supabase
        .from("modules")
        .select("id, module_name, module_code")
        .eq("user_id", currentUser.uid)
        .order("module_name");

    if (error) {
        console.error(error);
        alert("Failed to load modules.");
        return;
    }

    data.forEach(module => {

        const option = document.createElement("option");

        // Save the MODULE ID
        option.value = module.id;

        // Show the module code and name
        option.textContent =
            `${module.module_code} - ${module.module_name}`;

        lectureModule.appendChild(option);

    });

}

//==================================================
// CREATE NEW MODULE
//==================================================

lectureModule.addEventListener("change", () => {

    if (lectureModule.value === "new") {

        window.location.href =
            "08 modules.html?newModule=true";

    }

});

//==================================================
// LOAD LECTURE FOR EDITING
//==================================================

async function loadLecture(id) {

    const { data, error } = await supabase
        .from("lectures")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        console.error(error);
        alert("Lecture not found.");
        return;
    }

    editingLectureId = data.id;

    lectureModule.value = data.module_id;
    lectureDay.value = data.day;
    startTime.value = data.start_time;
    endTime.value = data.end_time;
    venue.value = data.venue || "";
    lecturer.value = data.lecturer || "";

    saveLecture.textContent = "Update Lecture";

}

//==================================================
// AUTH
//==================================================

auth.onAuthStateChanged(async (user) => {

    if (!user) {

        window.location.href = "01 login.html";
        return;

    }

    currentUser = user;

    await loadModules();

    // Check if editing
    const params = new URLSearchParams(window.location.search);

    const lectureId = params.get("id");

    if (lectureId) {

        await loadLecture(lectureId);

    }

});

//==================================================
// SAVE LECTURE
//==================================================

async function saveLectureToSupabase() {

    if (!currentUser) {
        alert("You must be logged in.");
        return;
    }

    if (
        lectureModule.value === "" ||
        lectureDay.value === "" ||
        startTime.value === "" ||
        endTime.value === ""
    ) {
        alert("Please complete all required fields.");
        return;
    }

    if (lectureModule.value === "new") {
        alert("Please create a module first.");
        return;
    }

    if (endTime.value <= startTime.value) {
        alert("End time must be after the start time.");
        return;
    }

    const lectureData = {

        user_id: currentUser.uid,

        module_id: Number(lectureModule.value),

        day: lectureDay.value,

        start_time: startTime.value,

        end_time: endTime.value,

        venue: venue.value.trim(),

        lecturer: lecturer.value.trim()

    };

    //--------------------------------------------------
    // UPDATE
    //--------------------------------------------------

    if (editingLectureId) {

        const { error } = await supabase
            .from("lectures")
            .update(lectureData)
            .eq("id", editingLectureId)
            .eq("user_id", currentUser.uid);

        if (error) {

            console.error(error);
            alert(error.message);
            return;

        }

        alert("Lecture updated successfully!");

    }

    //--------------------------------------------------
    // INSERT
    //--------------------------------------------------

    else {

        const { error } = await supabase
            .from("lectures")
            .insert([lectureData]);

        if (error) {

            console.error(error);
            alert(error.message);
            return;

        }

        alert("Lecture added successfully!");

    }

    window.location.href = "11 schedule.html";

}

//==================================================
// SAVE BUTTON
//==================================================

if (saveLecture) {

    saveLecture.addEventListener("click", () => {

        saveLectureToSupabase();

    });

}

//==================================================
// BACK BUTTON
//==================================================

if (backToSchedule) {

    backToSchedule.addEventListener("click", () => {

        window.location.href = "11 schedule.html";

    });

}

//==================================================
// ENTER KEY SUPPORT
//==================================================

document.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {

        event.preventDefault();

        saveLectureToSupabase();

    }

});

//==================================================
// REFRESH WHEN USER RETURNS
//==================================================

window.addEventListener("focus", () => {

    if (currentUser) {

        loadModules();

    }

});