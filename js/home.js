import { auth } from "../firebase.js";
import { supabase } from "./supabase.js";


//==================================================
// FIREBASE
//==================================================

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {
    signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

//==================================================
// ELEMENTS
//==================================================
const createOverlay = document.getElementById("createOverlay");

const navAdd = document.querySelector(".nav-add");

const closeSheet = document.getElementById("closeSheet");
const newModule = document.getElementById("newModule");
const newTask = document.getElementById("newTask");
const newLecture = document.getElementById("newLecture");
const newAssessment = document.getElementById("newAssessment");

const greetingText = document.getElementById("greetingText");

const profileBtn = document.getElementById("profileBtn");
const profileMenu = document.getElementById("profileMenu");
const profileName = document.getElementById("profileName");
const logoutBtn = document.getElementById("logoutBtn");

const setupSection = document.getElementById("setupSection");
const todaySection = document.getElementById("todaySection");
const todayEvents = document.getElementById("todayEvents");

const addModuleBtn = document.getElementById("addModuleBtn");
const importModuleBtn = document.getElementById("importModuleBtn");


//==================================================
// HOME DATA
//==================================================

let userModules = [];
let lectures = [];
let tasks = [];
let assessments = [];
let academicEvents = [];

//==================================================
// USER
//==================================================

auth.onAuthStateChanged(async (user) => {

    if (!user) {

        window.location.href = "03 Authentication.html";

        return;

    }

    //------------------------------------------
    // Greeting
    //------------------------------------------

    const hour = new Date().getHours();

    let greeting = "";

    if(hour < 12){

        greeting = "Good Morning";

    }

    else if(hour < 18){

        greeting = "Good Afternoon";

    }

    else{

        greeting = "Good Evening";

    }

    greetingText.textContent =
    `${greeting}, ${user.displayName} `;

    if(profileName){

    profileName.textContent =
        user.displayName || "Profile";

}

    //------------------------------------------
    // Home State
    //------------------------------------------

    await loadHome(user.uid);

    await updateSetupCard();

});

//==================================================
// PROFILE MENU
//==================================================

if(profileBtn){

    profileBtn.addEventListener("click",(e)=>{

        e.stopPropagation();

        profileMenu.classList.toggle("show");

    });

}

document.addEventListener("click",()=>{

    profileMenu.classList.remove("show");

});

if(profileMenu){

    profileMenu.addEventListener("click",(e)=>{

        e.stopPropagation();

    });

}

//==================================================
// LOGOUT
//==================================================

async function handleLogout(){

    try{

        await signOut(auth);

        window.location.href = "03 Authentication.html?signin=true";

    }catch(error){

        console.error("Logout failed:", error);

    }

}

if(logoutBtn){
    logoutBtn.addEventListener("click", handleLogout);
}


//==================================================
// HOME
//==================================================

async function loadHome(uid){

    // Hide both states while the home data is loading

    if(setupSection){
        setupSection.style.display = "none";
    }

    if(todaySection){
        todaySection.style.display = "none";
    }

    const today = new Date();

    const todayString =
        today.getFullYear() +
        "-" +
        String(today.getMonth() + 1).padStart(2,"0") +
        "-" +
        String(today.getDate()).padStart(2,"0");


        //==================================================
    // LOAD HOME DATA
    //==================================================

    const [
        modulesResult,
        lecturesResult,
        tasksResult,
        assessmentsResult,
        academicEventsResult
    ] = await Promise.all([

        supabase
            .from("modules")
            .select("*")
            .eq("user_id",uid),

        supabase
            .from("lectures")
            .select("*")
            .eq("user_id",uid),

        supabase
            .from("tasks")
            .select("*")
            .eq("user_id",uid),

        supabase
            .from("assessments")
            .select("*")
            .eq("user_id",uid),

        supabase
            .from("academic_events")
            .select("*")
            .eq("user_id",uid)

    ]);


    //==================================================
    // MODULES
    //==================================================

    if(modulesResult.error){

        console.error(
            "Could not load modules:",
            modulesResult.error
        );

        return;

    }

    userModules = modulesResult.data || [];


    //==================================================
    // LECTURES
    //==================================================

    if(lecturesResult.error){

        console.error(
            "Could not load lectures:",
            lecturesResult.error
        );

        lectures = [];

    }

    else{

        lectures = lecturesResult.data || [];

    }


    //==================================================
    // TASKS
    //==================================================

    if(tasksResult.error){

        console.error(
            "Could not load tasks:",
            tasksResult.error
        );

        tasks = [];

    }

    else{

        tasks = tasksResult.data || [];

    }


    //==================================================
    // ASSESSMENTS
    //==================================================

    if(assessmentsResult.error){

        console.error(
            "Could not load assessments:",
            assessmentsResult.error
        );

        assessments = [];

    }

    else{

        assessments = assessmentsResult.data || [];

    }


    //==================================================
    // ACADEMIC EVENTS
    //==================================================

    if(academicEventsResult.error){

        console.error(
            "Could not load academic events:",
            academicEventsResult.error
        );

        academicEvents = [];

    }

    else{

        academicEvents = academicEventsResult.data || [];

    }


    //==================================================
    // HOME STATE
    //==================================================

    if(userModules.length === 0){

        if(setupSection){

            setupSection.style.display = "";

        }

        if(todaySection){

            todaySection.style.display = "none";

        }

        return;

    }


   if(setupSection){

    setupSection.style.display = "none";

}

if(todaySection){

    todaySection.style.display = "block";

}

renderTodayEvents(todayString);

}

 //==================================================
// TODAY'S EVENTS
//==================================================

function renderTodayEvents(todayString){

    if(!todayEvents){

        return;

    }


    const events = [];


    //==================================================
    // LECTURES
    //==================================================

    const todayLectures =
        getTodayLectures();


    todayLectures.forEach(lecture => {

        events.push({

            title:
                lecture.title ||
                lecture.lecture_name ||
                getModuleName(
                    lecture.module_id
                ) ||
                "Class",

            module:
                getModuleName(
                    lecture.module_id
                ),

            type:
                "Class",

            start:
                lecture.start_time ||
                "",

            end:
                lecture.end_time ||
                "",

            colour:
                "#2862D9"

        });

    });


    //==================================================
    // TASKS
    //==================================================

    tasks

        .filter(task => {

            if(!task.due_date){

                return false;

            }


            return String(
                task.due_date
            ).slice(0,10) === todayString;

        })

        .forEach(task => {

            events.push({

                title:
                    task.title ||
                    task.task_name ||
                    "Task",

                module:
                    getModuleName(
                        task.module_id
                    ),

                type:
                    "Task",

                start:
                    task.due_time ||
                    "",

                end:
                    "",

                colour:
                    "#9B35D1"

            });

        });


    //==================================================
    // ASSESSMENTS
    //==================================================

    const todayAssessments =
        getTodayAssessments(
            todayString
        );


    todayAssessments.forEach(assessment => {

        events.push({

            title:
                assessment.title ||
                assessment.name ||
                "Assessment",

            module:
                getModuleName(
                    assessment.module_id
                ),

            type:
                "Assessment",

            start:
                assessment.due_time ||
                assessment.start_time ||
                "",

            end:
                assessment.end_time ||
                "",

            colour:
                "#D62B8A"

        });

    });




    //==================================================
    // SORT EVENTS
    //==================================================

    events.sort((a,b) => {

        return String(
            a.start ||
            "99:99"
        ).localeCompare(
            String(
                b.start ||
                "99:99"
            )
        );

    });


    //==================================================
    // NO EVENTS
    //==================================================

    if(events.length === 0){

        todayEvents.innerHTML = `

            <p class="today-empty">

                Nothing scheduled for today.

            </p>

        `;

        return;

    }


    //==================================================
    // SHOW EVENTS
    //==================================================

    todayEvents.innerHTML = "";


    events
        .slice(0,3)
        .forEach(event => {

            const item =
                document.createElement("div");

            item.className =
                "today-item";


            const check =
                document.createElement("div");

            check.className =
                "today-check";


            const marker =
                document.createElement("div");

            marker.className =
                "today-marker";

            marker.style.background =
                event.colour;


            const content =
                document.createElement("div");

            content.className =
                "today-item-content";


            const title =
                document.createElement("div");

            title.className =
                "today-item-title";

            title.textContent =
                event.title;


            const meta =
                document.createElement("div");

            meta.className =
                "today-item-meta";


            let metaText =
                event.type;


            if(event.module){

                metaText +=
                    " · " +
                    event.module;

            }


            meta.textContent =
                metaText;


            content.appendChild(
                title
            );

            content.appendChild(
                meta
            );


            const time =
                document.createElement("div");

            time.className =
                "today-item-time";

            time.textContent =
                formatTimeRange(
                    event.start,
                    event.end
                );


            item.appendChild(
                check
            );

            item.appendChild(
                marker
            );

            item.appendChild(
                content
            );

            item.appendChild(
                time
            );


            todayEvents.appendChild(
                item
            );

        });

}


//==================================================
// GET MODULE NAME
//==================================================

function getModuleName(moduleId){

    if(!moduleId){

        return "";

    }

    const module =
        userModules.find(
            item =>
                String(item.id) ===
                String(moduleId)
        );

    if(!module){

        return "";

    }

    return (
        module.module_name ||
        module.name ||
        module.code ||
        ""
    );

}


//==================================================
// GET TODAY'S WEEKDAY
//==================================================

function getTodayWeekday(){

    return new Date()
        .toLocaleDateString(
            "en-US",
            {
                weekday:"long"
            }
        )
        .toLowerCase();

}


//==================================================
// GET LECTURES FOR TODAY
//==================================================

function getTodayLectures(){

    const weekday =
        getTodayWeekday();

    return lectures

        .filter(lecture => {

            const lectureDay =
                String(
                    lecture.day ||
                    lecture.weekday ||
                    lecture.day_of_week ||
                    ""
                ).toLowerCase();

            return lectureDay === weekday;

        })

        .sort((a,b) => {

            return String(
                a.start_time || ""
            ).localeCompare(
                String(
                    b.start_time || ""
                )
            );

        });

}


//==================================================
// GET TODAY'S ASSESSMENTS
//==================================================

function getTodayAssessments(todayString){

    return assessments

        .filter(assessment => {

            const assessmentDate =
                assessment.due_date ||
                assessment.date;

            return assessmentDate ===
                todayString;

        })

        .sort((a,b) => {

            return String(
                a.due_time ||
                a.start_time ||
                ""
            ).localeCompare(
                String(
                    b.due_time ||
                    b.start_time ||
                    ""
                )
            );

        });

}


//==================================================
// FORMAT TIME
//==================================================

function formatTimeRange(start,end){

    if(!start){

        return "";

    }

    function formatTime(time){

        if(!time){

            return "";

        }

        const parts =
            String(time).split(":");

        let hour =
            parseInt(
                parts[0],
                10
            );

        const minutes =
            parts[1] || "00";

        const period =
            hour >= 12
                ? "PM"
                : "AM";

        hour =
            hour % 12 || 12;

        return `${hour}:${minutes} ${period}`;

    }

    const startText =
        formatTime(start);

    const endText =
        formatTime(end);

    if(!endText){

        return startText;

    }

    return `${startText} – ${endText}`;

}
//==================================================
// OPTIONAL LECTURE BUTTON
//==================================================

const lectureBtn = document.getElementById("lectureBtn");

if(lectureBtn){

    lectureBtn.addEventListener("click",()=>{

        window.location.href =
        "11 schedule.html";

    });

}

//===================================================================================================================nav bar menu

const menuBtn = document.getElementById("menuBtn");

const navBar = document.querySelector(".nav-bar");

const homeContent = document.querySelector(".home-content");

if(menuBtn){

    menuBtn.addEventListener("click", () => {

        navBar.classList.toggle("open");

        homeContent.classList.toggle("shift");

    });

}


async function updateSetupCard(){

    const { data, error } = await supabase

        .from("weekly_topics")

        .select("*")

        .eq("user_id", auth.currentUser.uid);

    if(error){

        console.error(error);

        return;

    }

    if(data.length === 0){

        return;

    }

    const today = new Date();

    const todayString = today
        .toISOString()
        .split("T")[0];

    const currentWeek = data.find(topic =>

        topic.start_date <= todayString &&

        topic.end_date >= todayString

    );

    if(!currentWeek){

        return;

    }

    document.getElementById("setupTitle").textContent =
        `Week ${currentWeek.week} is Ready`;

    document.getElementById("setupText").textContent =
        "View your topics and tasks for this week.";

    document.getElementById("setupButtons").innerHTML = `

        <button
            class="primary-btn"
            id="viewScheduleBtn">

            <i class="fa-solid fa-calendar-days"></i>

            View Schedule

        </button>

    `;

    document
        .getElementById("viewScheduleBtn")
        .addEventListener("click",()=>{

            window.location.href =
                "11 schedule.html";

        });

}

//==================================================
// NAV BAR OVERLAY
//==================================================

if(navAdd){

    navAdd.addEventListener("click",(e)=>{

        e.preventDefault();

        console.log("PLUS CLICKED");

        createOverlay.style.display = "flex";

    });

}

if(closeSheet){

    closeSheet.addEventListener("click",()=>{

        createOverlay.style.display = "none";

    });

}

if(createOverlay){

    createOverlay.addEventListener("click",(e)=>{

        if(e.target===createOverlay){

            createOverlay.style.display="none";

        }

    });

}

if(newModule){

    newModule.addEventListener("click",()=>{

        window.location.href="08 modules.html?newModule=true";

    });

}

if(newTask){

    newTask.addEventListener("click",()=>{

        window.location.href="21 addTask.html";

    });

}

if(newLecture){

    newLecture.addEventListener("click",()=>{

        window.location.href="21 addlecture.html";

    });

}

if(newAssessment){

    newAssessment.addEventListener("click",()=>{

        window.location.href="YOUR ASSESSMENT PAGE.html";

    });

}

//==================================================
// HOME BUTTONS
//==================================================

if(addModuleBtn){

    addModuleBtn.addEventListener("click",()=>{

        window.location.href = "08 modules.html?newModule=true";

    });

}

if(importModuleBtn){

    importModuleBtn.addEventListener("click",()=>{

        window.location.href = "13 moduleoutline.html";

    });

}



//==================================================
// CREATE OVERLAY
//==================================================

function closeCreateOverlay() {

    if (
        createOverlay
    ) {

        createOverlay.style.display =
            "none";

    }

}

if (
    navAdd &&
    createOverlay
) {

    navAdd.addEventListener(
        "click",
        () => {

            createOverlay.style.display =
                "flex";

        }
    );

}

if (closeSheet) {

    closeSheet.addEventListener(
        "click",
        closeCreateOverlay
    );

}

if (createOverlay) {

    createOverlay.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                createOverlay
            ) {

                closeCreateOverlay();

            }

        }
    );

}


//==================================================
// CREATE MODULE
//==================================================

if (newModule) {

    newModule.addEventListener(
        "click",
        () => {

            window.location.href =
                "08 modules.html?add=true";

        }
    );

}


//==================================================
// CREATE TASK
//==================================================

if (newTask) {

    newTask.addEventListener(
        "click",
        () => {

            window.location.href =
                "21 addtask.html";

        }
    );

}


//==================================================
// CREATE EVENT
//==================================================

if (newLecture) {

    newLecture.addEventListener(
        "click",
        () => {

            window.location.href =
                "21 addevent.html";

        }
    );

}