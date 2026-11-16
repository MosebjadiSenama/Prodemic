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

// Active-user greeting
const greetingText = document.getElementById("greetingText");
const userName = document.getElementById("userName");

// New-user greeting
const setupGreetingText = document.getElementById("setupGreetingText");
const setupUserName = document.getElementById("setupUserName");

const profileBtn = document.getElementById("profileBtn");
const profileMenu = document.getElementById("profileMenu");
const profileName = document.getElementById("profileName");
const logoutBtn = document.getElementById("logoutBtn");

const setupSection = document.getElementById("setupSection");

const homeLoading = document.getElementById("homeLoading");
const todaySection = document.getElementById("todaySection");
const contentHome = document.querySelector(".contenthomep");
const todayEvents = document.getElementById("todayEvents");

// HOMEPAGE TODAY'S PROGRESS ELEMENTS

const progressRing = document.getElementById("progressRing");
const progressPercentage = document.getElementById("progressPercentage");
const progressCount = document.getElementById("progressCount");
const progressMessage = document.getElementById("progressMessage");


// ACADEMIC OVERVIEW ELEMENTS

const academicPeriodCard = document.getElementById("academicPeriodCard");
const academicPeriodLabel = document.getElementById("academicPeriodLabel");
const academicPeriodTitle = document.getElementById("academicPeriodTitle");
const academicPeriodDates = document.getElementById("academicPeriodDates");
const academicPeriodMessage = document.getElementById("academicPeriodMessage");

const academicEventsToggle = document.getElementById("academicEventsToggle");
const academicEventsDropdown = document.getElementById("academicEventsDropdown");
const academicEventsList = document.getElementById("academicEventsList");
//======



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

    // SHOW LOADING SCREEN
    homeLoading.style.display = "flex";

    // HIDE HOMEPAGE SECTIONS
    setupSection.style.display = "none";
    todaySection.style.display = "none";


// New-user greeting

const setupHour = new Date().getHours();

let setupGreeting;

if (setupHour >= 5 && setupHour < 12) {
    setupGreeting = "Good morning,";
} 
else if (setupHour >= 12 && setupHour < 17) {
    setupGreeting = "Good afternoon,";
} 
else {
    setupGreeting = "Good evening,";
}

const setupName = user.displayName || "there";

if (setupGreetingText) {
    setupGreetingText.textContent = setupGreeting;
}

if (setupUserName) {
    setupUserName.textContent = ` ${setupName}`;
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

    // HIDE LOADING SCREEN
    homeLoading.style.display = "none";

});



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

const welcomeContent = document.querySelector(".welcome-content");

// Check whether the user has added ANY content
const hasAnyContent =
    userModules.length > 0 ||
    lectures.length > 0 ||
    tasks.length > 0 ||
    assessments.length > 0 ||
    academicEvents.length > 0;


// NEW USER: Nothing has been added
if (!hasAnyContent) {
    if (contentHome) {
    contentHome.style.display = "none";
}

    setupSection.style.display = "block";

    if (welcomeContent) {
        welcomeContent.style.display = "none";
    }

    todaySection.style.setProperty("display", "none", "important");

    academicPeriodCard.style.display = "none";

    return;
}

// ACTIVE USER: At least one item exists
setupSection.style.display = "none";

if (welcomeContent) {
    welcomeContent.style.display = "flex";
}
todaySection.style.setProperty("display", "block", "important");

renderTodayEvents(todayString);
renderAcademicOverview(todayString);

} 

//==================================================
// ACADEMIC OVERVIEW
//==================================================

function renderAcademicOverview(todayString) {

    if (!academicPeriodCard) return;

    // Only include calendar-level academic events.
    const academicTypes = [
        "academic_event",
        "examination",
        "exam",
        "examination_period",
        "test_week"
    ];

    const academicRecords = academicEvents.filter(event => {

        const type = String(event.type || "")
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "_");

        return academicTypes.includes(type);
    });

    // Compare date-only strings to avoid timezone shifts.
    const validEvents = academicRecords.filter(event => {

        const start = String(event.start_date || "").slice(0, 10);
        const end = String(event.end_date || event.start_date || "").slice(0, 10);

        return start && end && end >= todayString;
    });

    if (validEvents.length === 0) {
        academicPeriodCard.style.display = "none";
        return;
    }

    function getPriority(event) {

        const type = String(event.type || "")
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "_");

        if (
            type === "examination_period" ||
            type === "examination" ||
            type === "exam"
        ) {
            return 1;
        }

        if (type === "test_week") {
            return 2;
        }

        return 3;
    }

    function isActive(event) {

        const start = String(event.start_date || "").slice(0, 10);
        const end = String(event.end_date || event.start_date || "").slice(0, 10);

        return start <= todayString && end >= todayString;
    }

    // Active events take priority over future events.
    const activeEvents = validEvents
        .filter(isActive)
        .sort((a, b) => getPriority(a) - getPriority(b));

    const upcomingEvents = validEvents
        .filter(event => !isActive(event))
        .sort((a, b) => {
            return String(a.start_date).localeCompare(String(b.start_date));
        });

    const featuredEvent = activeEvents.length > 0
        ? activeEvents[0]
        : upcomingEvents[0];

    const otherEvents = validEvents
        .filter(event => event.id !== featuredEvent.id)
        .sort((a, b) => {

            const priorityDifference = getPriority(a) - getPriority(b);

            if (priorityDifference !== 0) {
                return priorityDifference;
            }

            return String(a.start_date).localeCompare(
                String(b.start_date)
            );
        });

    function formatDate(dateString) {

        if (!dateString) return "";

        const [year, month, day] = dateString.slice(0, 10)
            .split("-")
            .map(Number);

        const date = new Date(year, month - 1, day);

        return date.toLocaleDateString("en-ZA", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });
    }

    function formatDateRange(event) {

        const start = String(event.start_date || "").slice(0, 10);
        const end = String(event.end_date || event.start_date || "").slice(0, 10);

        if (start === end) {
            return formatDate(start);
        }

        return `${formatDate(start)} – ${formatDate(end)}`;
    }

    // Display the featured event.
    academicPeriodCard.style.display = "block";

    academicPeriodTitle.textContent =
        featuredEvent.title || featuredEvent.name || "Academic Event";

    academicPeriodDates.textContent = formatDateRange(featuredEvent);

    if (isActive(featuredEvent)) {

        academicPeriodLabel.textContent = "HAPPENING NOW";

        academicPeriodMessage.textContent =
            "Stay focused and keep working towards your academic goals.";

    } else {

        academicPeriodLabel.textContent = "UPCOMING";

        academicPeriodMessage.textContent =
            "Prepare ahead and stay on top of your academic goals.";
    }

    // Populate the remaining events dropdown.
    academicEventsList.innerHTML = "";

    otherEvents.forEach(event => {

        const item = document.createElement("div");
        item.className = "academic-event-option";

        const title = document.createElement("h3");
        title.textContent =
            event.title || event.name || "Academic Event";

        const dates = document.createElement("p");
        dates.textContent = formatDateRange(event);

        const status = document.createElement("span");
        status.textContent = isActive(event)
            ? "Happening now"
            : "Upcoming";

        item.appendChild(title);
        item.appendChild(dates);
        item.appendChild(status);

        academicEventsList.appendChild(item);
    });

    // Only show the dropdown when other events exist.
    academicEventsToggle.hidden = otherEvents.length === 0;
    academicEventsDropdown.hidden = true;

    academicEventsToggle.setAttribute("aria-expanded", "false");

    academicEventsToggle.innerHTML = `
        View other academic events
        <i class="fa-solid fa-chevron-down"></i>
    `;
}

// Dropdown interaction.
if (academicEventsToggle) {

    academicEventsToggle.addEventListener("click", () => {

        const isExpanded =
            academicEventsToggle.getAttribute("aria-expanded") === "true";

        academicEventsToggle.setAttribute(
            "aria-expanded",
            String(!isExpanded)
        );

        academicEventsDropdown.hidden = isExpanded;

        academicEventsToggle.innerHTML = isExpanded
            ? 'View other academic events <i class="fa-solid fa-chevron-down"></i>'
            : 'Hide other academic events <i class="fa-solid fa-chevron-down"></i>';
    });
}
//==================================================
// SAVE HOMEPAGE EVENT COMPLETION
//==================================================

async function saveHomeEventCompletion(event, completed) {

    const userId = auth.currentUser?.uid;

    const allowedTables = [
        "lectures",
        "tasks",
        "assessments",
        "academic_events"
    ];

    if (
        !userId ||
        !event.table ||
        !allowedTables.includes(event.table) ||
        event.recordId == null
    ) {

        console.error(
            "Missing or invalid event information:",
            event
        );

        return false;

    }

    const { error } = await supabase

        .from(event.table)

        .update({
            completed: completed
        })

        .eq("id", event.recordId)

        .eq("user_id", userId);


    if (error) {

        console.error(
            "Could not save homepage completion:",
            error
        );

        return false;

    }

    event.completed = completed;

    return true;

}

//==================================================
// UPDATE HOMEPAGE TODAY'S PROGRESS
//==================================================

function updateTodayProgress(events) {

    if (
        !progressRing ||
        !progressPercentage ||
        !progressCount ||
        !progressMessage
    ) {
        return;
    }

    const totalEvents = events.length;

    const completedEvents = events.filter(
        event => event.completed === true
    ).length;

    const percentage = totalEvents === 0
        ? 0
        : Math.round((completedEvents / totalEvents) * 100);


    // UPDATE CIRCULAR PROGRESS

    progressRing.style.setProperty(
        "--progress",
        `${percentage}%`
    );


    // UPDATE PERCENTAGE

    progressPercentage.textContent = `${percentage}%`;


    // UPDATE COMPLETION COUNT

    progressCount.textContent =
        `${completedEvents} of ${totalEvents} tasks`;


    // UPDATE MESSAGE

    if (totalEvents === 0) {

        progressMessage.textContent =
            "Nothing scheduled for today. Enjoy your day!";

    }

    else if (percentage === 100) {

        progressMessage.textContent =
            "Amazing! You've completed everything for today.";

    }

    else if (percentage >= 75) {

        progressMessage.textContent =
            "Almost there! Keep up the great work.";

    }

    else if (percentage >= 50) {

        progressMessage.textContent =
            "You're making great progress. Keep going!";

    }

    else if (percentage > 0) {

        progressMessage.textContent =
            "Good start! Keep working towards your goals.";

    }

    else {

        progressMessage.textContent =
            "Let's make today productive!";

    }

}
 //==================================================
// TODAY'S EVENTS
//==================================================

function renderTodayEvents(todayString) {

    if (!todayEvents) {
        return;
    }

    const events = [];

    //==================================================
    // CLASSES
    //==================================================

    const todayLectures = getTodayLectures();

    todayLectures.forEach(lecture => {

        events.push({

            title: lecture.title || "Class",

            table: "lectures",

            recordId: lecture.id,

            completed: lecture.completed === true,

            module: getModuleName(lecture.module_id),

            type: "Class",

            start: lecture.start_time || "",

            end: lecture.end_time || "",

            colour: getModuleColour(lecture.module_id),

            priority: lecture.priority === true

        });

    });


    //==================================================
    // STUDY SESSIONS AND OTHER EVENTS
    //==================================================

    academicEvents

        .filter(event => {
            

            const startDate = String(
                event.start_date || ""
            ).slice(0, 10);

            const endDate = String(
                event.end_date || event.start_date || ""
            ).slice(0, 10);

            const eventType = String(
                event.type || ""
            ).toLowerCase().trim().replace(/\s+/g, "_");

// Exclude academic periods from the homepage task list
const eventTitle = String(event.title || "")
    .toLowerCase()
    .trim();

const excludedTypes = [
    "academic_event",
    "academic",
    "examination",
    "exam",
    "examination_period",
    "exam_period",
    "test_week"
];

if (
    excludedTypes.includes(eventType) ||
    eventTitle.includes("examination period") ||
    eventTitle.includes("academic event") ||
    eventTitle.includes("test week")
) {
    return false;
}

            // Include events taking place today
            return (
                startDate &&
                startDate <= todayString &&
                endDate >= todayString
            );

        })

        .forEach(event => {

            events.push({

                title: event.title || "Other",

                table: "academic_events",

                recordId: event.id,

                completed: event.completed === true,

                module: getModuleName(event.module_id),

                type: event.type || "Other",

                start: event.start_time || "",

                end: event.end_time || "",

            
                colour: getModuleColour(event.module_id),

                priority: event.priority === true

            });

        });


    //==================================================
    // TASKS
    //==================================================

    tasks

        .filter(task => {

            if (!task.due_date) {
                return false;
            }

            return String(
                task.due_date
            ).slice(0, 10) === todayString;

        })

        .forEach(task => {

            events.push({

                title:
                    task.title ||
                    task.task_name ||
                    "Task",

                table: "tasks",

                recordId: task.id,

                completed: task.completed === true,

                module: getModuleName(task.module_id),

                type: "Task",

                start: task.due_time || "",

                end: "",

                colour: getModuleColour(task.module_id),

                priority: task.priority === true

            });

        });


    //==================================================
    // ASSESSMENTS
    //==================================================

    const todayAssessments = getTodayAssessments(todayString);

    todayAssessments.forEach(assessment => {

        events.push({

            title:
                assessment.title ||
                assessment.name ||
                "Assessment",

            table: "assessments",

            recordId: assessment.id,

            completed: assessment.completed === true,

            module: getModuleName(assessment.module_id),

            type: "Assessment",

            start:
                assessment.due_time ||
                assessment.start_time ||
                "",

            end: assessment.end_time || "",

            colour: getModuleColour(assessment.module_id),

            priority: assessment.priority === true

        });

    });


    //==================================================
    // SORT EVENTS
    //==================================================

    events.sort((a, b) => {

    // Priority items first
    if (a.priority !== b.priority) {
        return Number(b.priority) - Number(a.priority);
    }

    // Then sort by time
    return String(a.start || "99:99").localeCompare(
        String(b.start || "99:99")
    );

});


    //==================================================
    // NO EVENTS
    //==================================================

   if (events.length === 0) {

    todayEvents.innerHTML = `
        <p class="today-empty">
            Nothing scheduled for today.
        </p>
    `;

    updateTodayProgress([]);

    return;
}

    //==================================================
    // DISPLAY EVENTS
    //==================================================

   todayEvents.innerHTML = "";

// Calculate progress using ALL activities scheduled for today
updateTodayProgress(events);

// Only limit how many activities are displayed on the homepage
const visibleEvents = events.slice(0, 3);

visibleEvents.forEach(event => {

            const item = document.createElement("div");

            item.className = "today-item";
            item.style.setProperty(
             "--event-colour",
              event.colour || "#3048C8"
              );

            if (event.completed) {
                item.classList.add("completed");
            }


            // CHECKBOX

            const check = document.createElement("input");

            check.type = "checkbox";

            check.className = "today-check";

            check.checked = event.completed;

            check.setAttribute(
                "aria-label",
                `Mark ${event.title} as completed`
            );


            // CONTENT
            const content = document.createElement("div");
            content.className = "today-item-content";

            const title = document.createElement("div");
             title.className = "today-item-title";

          const titleText = document.createElement("span");
          titleText.textContent = event.title;

          title.appendChild(titleText);

          if (event.priority) {

    const priorityLabel = document.createElement("span");

    priorityLabel.className = "today-item-priority";

    priorityLabel.innerHTML = `
        <i class="fa-solid fa-star"></i>
        Priority
    `;

    title.appendChild(priorityLabel);

}

            if (event.completed) {
                title.classList.add("is-completed");
            }

            // META
            const meta = document.createElement("div");
            meta.className = "today-item-meta";

            let metaText = event.type;

            if (event.module) {
                metaText += " · " + event.module;
            }

            meta.textContent = metaText;

            // TIME
            const time = document.createElement("div");
            time.className = "today-item-time";
            time.textContent = formatTimeRange(
                event.start,
                event.end
            );

            content.appendChild(title);
            content.appendChild(meta);
            content.appendChild(time);

            
// APPEND CONTENT FIRST, CHECKBOX LAST
item.appendChild(content);
item.appendChild(check);

// SAVE COMPLETION WHEN HOMEPAGE CHECKBOX IS CLICKED
check.addEventListener("change", async () => {
    const newCompletedStatus = check.checked;

    // Update the card immediately
    item.classList.toggle("completed", newCompletedStatus);
    title.classList.toggle("is-completed", newCompletedStatus);

    // Prevent repeated clicks while saving
    check.disabled = true;

    const saved = await saveHomeEventCompletion(
        event,
        newCompletedStatus
    );

    check.disabled = false;

    // Restore the previous state if saving fails
    if (!saved) {
        check.checked = !newCompletedStatus;

        item.classList.toggle(
            "completed",
            !newCompletedStatus
        );

        title.classList.toggle(
            "is-completed",
            !newCompletedStatus
        );

        return;
    }

    // Refresh the homepage progress
    updateTodayProgress(events);
});

todayEvents.appendChild(item);


        });

}


//==================================================
// GET MODULE NAME
//==================================================

function getModuleName(moduleId) {

    if (!moduleId) {
        return "";
    }

    const module = userModules.find(
        item => String(item.id) === String(moduleId)
    );

    if (!module) {
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
// GET MODULE COLOUR
//==================================================

function getModuleColour(moduleId) {

    if (!moduleId) {
        return "#3048C8";
    }

    const module = userModules.find(
        item => String(item.id) === String(moduleId)
    );

    return module?.colour || "#3048C8";

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
