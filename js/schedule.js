import { auth } from "../firebase.js";
import { supabase } from "./supabase.js";

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
const addLectureBtn = document.getElementById("addLectureBtn");

const scheduleList = document.getElementById("scheduleList");
const scheduleEmpty = document.getElementById("scheduleEmpty");

const lectureCount = document.getElementById("lectureCount");

const calendar = document.getElementById("calendar");
const view = document.getElementById("calendarView");

const calendarPrevBtn = document.getElementById("prevBtn");
const calendarNextBtn = document.getElementById("nextBtn");

//==================================================
// DATA
//==================================================
let scheduleItems = [];

let lectures = [];
let weeklyTopics = [];
let tasks = [];


let assignments = [];
let tests = [];
let exams = [];
let events = [];

let userModules = [];

let currentDate = new Date();


//==================================================
// AUTH
//==================================================

auth.onAuthStateChanged(async (user) => {

    if (!user) return;

    await loadModules();

    await loadLectures();

    await loadWeeklyTopics();

    await loadTasks();

    await buildSchedule();

    updateCalendar();

});

//==================================================
// LOAD MODULES
//==================================================

async function loadModules() {

    const { data, error } = await supabase
        .from("modules")
        .select("*")
        .eq("user_id", auth.currentUser.uid);

    if (error) {

        console.error(error);
        return;

    }

    userModules = data || [];

}

//==================================================
// LOAD LECTURES
//==================================================

async function loadLectures() {

    const { data, error } = await supabase
        .from("lectures")
        .select("*")
        .eq("user_id", auth.currentUser.uid);

    if (error) {

        console.error(error);
        return;

    }

    lectures = data || [];

}

async function loadTasks(){

    const {data,error}=await supabase

        .from("tasks")

        .select("*")

        .eq("user_id",auth.currentUser.uid);

    if(error){

        console.error(error);

        tasks=[];

        return;

    }

    tasks=data || [];

}

async function loadAssignments(){

    const {data,error}=await supabase

        .from("assignments")

        .select("*")

        .eq("user_id",auth.currentUser.uid);

    if(error){

        console.error(error);

        assignments=[];

        return;

    }

    assignments=data || [];

}

async function loadTests(){

    const {data,error}=await supabase

        .from("tests")

        .select("*")

        .eq("user_id",auth.currentUser.uid);

    if(error){

        console.error(error);

        tests=[];

        return;

    }

    tests=data || [];

}

async function loadWeeklyTopics(){

    const { data, error } = await supabase
        .from("weekly_topics")
        .select("*")
        .eq("user_id", auth.currentUser.uid);

    if(error){

        console.error(error);

        weeklyTopics = [];

        return;

    }

    weeklyTopics = data || [];

}
 async function buildSchedule(){

    scheduleItems = [];

    //--------------------------------
    // Lectures
    //--------------------------------

    lectures.forEach(lecture=>{

        scheduleItems.push({

            type:"lecture",

            title:lecture.module_id,

            day:lecture.day,

            start:lecture.start_time,

            end:lecture.end_time,

            data:lecture

        });

    });

    //--------------------------------
// Weekly Topics
//--------------------------------

weeklyTopics.forEach(topic => {

    scheduleItems.push({

        type: "topic",

        title: topic.topic,

        week: topic.week,

        data: topic

    });

});

    //--------------------------------
// Tasks
//--------------------------------

tasks.forEach(task => {

    if (!task.due_date) return;

    const dueDate = new Date(task.due_date);

    scheduleItems.push({

        type: "task",

        title: task.title,

        date: dueDate,

        day: dueDate.toLocaleDateString("en-US", {

            weekday: "long"

        }),

        start: task.due_time || "23:59",

        end: task.due_time || "23:59",

        data: task

    });

    });

   scheduleItems.sort((a, b) => {

    const startA = a.start || "";

    const startB = b.start || "";

    return startA.localeCompare(startB);

});

}
//==================================================
// ADD LECTURE
//==================================================

if (addLectureBtn) {

    addLectureBtn.addEventListener("click", () => {

        window.location.href = "21 addlecture.html";

    });

}

//==================================================
// MODULE COLOUR
//==================================================

function getModuleColour(moduleName) {

    const module = userModules.find(

        m => m.module_name === moduleName

    );

    return module ? module.colour : "#3048C8";

}
//==================================================
// WEEK VIEW
//==================================================

function renderWeek() {
calendar.innerHTML = "";
scheduleList.innerHTML = "";

const weekStrip = document.createElement("div");
weekStrip.className = "week-strip";

const stripStart = new Date(currentDate);

const stripDay = stripStart.getDay();

stripStart.setDate(
    stripStart.getDate() - (stripDay === 0 ? 6 : stripDay - 1)
);

const shortDays = [
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
    "Sun"
];

for(let i = 0; i < 7; i++){

    const d = new Date(stripStart);

    d.setDate(stripStart.getDate() + i);

    const button = document.createElement("button");

    button.className = "week-strip-day";

    if(
        d.toDateString() === currentDate.toDateString()
    ){
        button.classList.add("active");
    }

    button.innerHTML = `

        <span class="strip-day">

            ${shortDays[i]}

        </span>

        <span class="strip-date">

            ${d.getDate()}

        </span>

    `;

   button.onclick = () => {

    currentDate = new Date(d);

    view.value = "day";

    updateCalendar();

};

    weekStrip.appendChild(button);

}

calendar.appendChild(weekStrip);

    const start = new Date(currentDate);

    // Monday
    const day = start.getDay();

    start.setDate(start.getDate() - (day === 0 ? 6 : day - 1));

    const days = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
    ];

    const months = [
        "Jan","Feb","Mar","Apr","May","Jun",
        "Jul","Aug","Sep","Oct","Nov","Dec"
    ];

    days.forEach((dayName,index)=>{

        const date = new Date(start);

        date.setDate(start.getDate()+index);

        //------------------------------------------------
        // Today's lectures
        //------------------------------------------------

        const dayLectures = lectures
            .filter(l=>l.day===dayName)
            .sort((a,b)=>

                a.start_time.localeCompare(
                    b.start_time
                )

            );

            //------------------------------------------------
// Today's Tasks
//------------------------------------------------

const dayTasks = tasks
    .filter(task => {

        if (!task.due_date) return false;

        const due = new Date(task.due_date);

        return due.toDateString() === date.toDateString();

    })
    .sort((a, b) =>

        (a.due_time || "23:59").localeCompare(

            b.due_time || "23:59"

        )

    );

 const dayTopics = weeklyTopics.filter(topic => {

    if(!topic.start_date || !topic.end_date){

        return false;

    }

    const current = new Date(date);

    const start = new Date(topic.start_date);

    const end = new Date(topic.end_date);

    return current >= start && current <= end;

});           

        //------------------------------------------------
        // DAY CARD
        //------------------------------------------------

        const section = document.createElement("div");

        section.className="week-day-card";

        section.innerHTML=`

<div class="week-card-header">

    <div>

        <h2>${dayName}</h2>

        <span>

            ${date.getDate()} ${months[date.getMonth()]}

        </span>

    </div>

    <div class="lecture-count">

        ${dayLectures.length}

        ${dayLectures.length===1 ? "Lecture":"Lectures"}

    </div>

</div>

<div class="week-card-body">

</div>

`;

        //------------------------------------------------
        // BODY
        //------------------------------------------------

        const body=section.querySelector(".week-card-body");

        //------------------------------------------------
        // EMPTY
        //------------------------------------------------

       if(dayLectures.length===0 && dayTasks.length===0){

    body.innerHTML=`

<div class="empty-week-day">

    <i class="fa-regular fa-calendar"></i>

    <p>No events scheduled</p>

</div>

`;

}

        //------------------------------------------------
        // LECTURES
        //------------------------------------------------

        dayLectures.forEach(lecture=>{

            //------------------------------------------------
            // MODULE
            //------------------------------------------------

            const module=userModules.find(

                m=>m.id===lecture.module_id

            );

            const moduleName=
                module?.module_name || "Unknown Module";

            const colour=
                module?.colour || "#3048C8";

            //------------------------------------------------
            // CARD
            //------------------------------------------------

            const card=document.createElement("div");

            card.className="week-lecture";

            card.innerHTML=`

<div class="lecture-bar"

style="background:${colour}">

</div>

<div class="lecture-main">

    <div class="lecture-time">

        <strong>

            ${lecture.start_time}

        </strong>

        <span>

            ${lecture.end_time}

        </span>

    </div>

    <div class="lecture-details">

        <h3>

            ${moduleName}

        </h3>

        <p>

            <i class="fa-solid fa-location-dot"></i>

            ${lecture.venue || "No venue"}

        </p>

        ${
            lecture.lecturer

            ?

            `

<p>

<i class="fa-solid fa-user"></i>

${lecture.lecturer}

</p>

`

            :

            ""

        }

    </div>

</div>

<div class="lecture-options">

    <button

        class="edit-btn"

        data-id="${lecture.id}"

    >

        <i class="fa-solid fa-pen"></i>

    </button>

    <button

        class="delete-btn"

        data-id="${lecture.id}"

    >

        <i class="fa-solid fa-trash"></i>

    </button>

</div>

`;

            body.appendChild(card);

        });

        //------------------------------------------------
// TASKS
//------------------------------------------------

dayTasks.forEach(task => {

    let colour = "#22C55E";

    if(task.module_id){

        const module = userModules.find(

            m => m.id == task.module_id

        );

        if(module){

            colour = module.colour;

        }

    }

    const card = document.createElement("div");

    card.className = "week-lecture";

    card.innerHTML = `

<div class="lecture-bar"

style="background:${colour}">

</div>

<div class="lecture-main">

    <div class="lecture-time">

        <strong>

            ${task.due_time || "--:--"}

        </strong>

        <span>

            Due

        </span>

    </div>

    <div class="lecture-details">

        <h3>

            ${task.title}

        </h3>

       <p>

    <i class="fa-solid fa-book"></i>

    ${task.module_name || "General"}

</p>
    </div>

</div>

`;

    body.appendChild(card);

});

        dayTopics.forEach(topic=>{

    const card = document.createElement("div");

    card.className = "week-lecture";

    card.innerHTML = `

        <div class="lecture-bar"
             style="background:#4F46E5">
        </div>

        <div class="lecture-main">

            <div class="lecture-details">

                <h3>${topic.topic}</h3>

                <p>Week ${topic.week}</p>

            </div>

        </div>

    `;

    body.appendChild(card);

});
//========================================
// OPEN DAY VIEW
//========================================

section.style.cursor = "pointer";

section.addEventListener("click", (e) => {

    // Don't switch if Edit/Delete was clicked
    if (
        e.target.closest(".edit-btn") ||
        e.target.closest(".delete-btn")
    ) {
        return;
    }

    currentDate = new Date(date);

    view.value = "day";

    updateCalendar();

});
        scheduleList.appendChild(section);

    });

}

//==================================================
// DAY VIEW
//==================================================

function renderDay() {

    if (!calendar) return;

    calendar.innerHTML = "";

    const dayView = document.createElement("div");

    dayView.className = "day-view";
    dayView.id = "dayView";
dayView.innerHTML = `

    <h2 class="day-title">

        ${currentDate.toLocaleDateString("en-GB", {

            weekday: "long",
            day: "2-digit",
            month: "short",
            year: "numeric"

        })}

    </h2>

    <div class="day-summary" id="daySummary"></div>

    <div class="timeline">

        ${Array.from({ length: 24 }, (_, hour) => `

            <div class="time-slot" id="hour-${hour}">

                <div class="time-label">

                    ${String(hour).padStart(2,"0")}:00

                </div>

                <div class="events" data-hour="${hour}"></div>

            </div>

        `).join("")}

    </div>

`;

    calendar.appendChild(dayView);

    const selectedDay = currentDate.toLocaleDateString("en-GB", {

        weekday: "long"

    });

   const todaysItems = scheduleItems.filter(

    item => item.day === selectedDay

);

todaysItems.forEach(item=>{

    //-------------------------------------
    // LECTURE
    //-------------------------------------

   if(item.type === "lecture"){

    const lecture = item.data;
    //------------------------------------------------
    // GET MODULE
    //------------------------------------------------

    const module = userModules.find(

        m => m.id === lecture.module_id

    );

    const moduleName =
        module?.module_name || "Unknown Module";

    const colour =
        module?.colour || "#3048C8";

    //------------------------------------------------
    // START / END
    //------------------------------------------------

    const [startHour, startMinute] =
        lecture.start_time.split(":").map(Number);

    const [endHour, endMinute] =
        lecture.end_time.split(":").map(Number);

    const duration =
        (endHour * 60 + endMinute) -
        (startHour * 60 + startMinute);

    //------------------------------------------------
    // FIND HOUR
    //------------------------------------------------

    const container = dayView.querySelector(

        `.events[data-hour="${startHour}"]`

    );

    if(!container) return;

    //------------------------------------------------
    // EVENT
    //------------------------------------------------

    const event = document.createElement("div");

    event.className = "lecture-event";

    event.style.borderLeft =
        `6px solid ${colour}`;

    event.style.left = "8px";

    event.style.right = "8px";

    event.style.top =
        `${(startMinute / 60) * 80}px`;

    event.style.height =
        `${(duration / 60) * 80}px`;

    event.innerHTML = `

        <strong>

            ${moduleName}

        </strong>

        <small>

            ${lecture.start_time}

            -

            ${lecture.end_time}

        </small>

        <span>

            📍 ${lecture.venue || "No venue"}

        </span>

    `;

  container.appendChild(event);

}

//-------------------------------------
// TASK
//-------------------------------------

if(item.type === "task"){

    const task = item.data;

    const dueTime = task.due_time || "23:59";

    const [hour, minute] = dueTime.split(":").map(Number);


    const container = dayView.querySelector(
        `.events[data-hour="${hour}"]`
    );

    if(!container) return;

    const event = document.createElement("div");

    event.className = "task-event";

    let colour = "#22C55E";

if(task.module_id){

    const module = userModules.find(

        m => m.id == task.module_id

    );

    if(module){

        colour = module.colour;

    }

}

event.style.borderLeft = `6px solid ${colour}`;

    event.style.left = "8px";
    event.style.right = "8px";

    event.style.top = `${(minute / 60) * 80}px`;

    event.style.height = "60px";

    event.innerHTML = `
        <strong>✅ ${task.title}</strong>
        <small>

    ${task.module_name || "General"}

</small>
    `;

    container.appendChild(event);

}

});

    setTimeout(() => {

        scrollToRelevantHour();

    }, 100);

}

//==================================================
// MONTH VIEW
//==================================================

function renderMonth() {

    if (!calendar) return;

    calendar.innerHTML = "";

    //==========================================
    // MONTH TITLE
    //==========================================

    const title = document.createElement("h2");

    title.className = "month-title";

    title.textContent = currentDate.toLocaleString("default", {

        month: "long",
        year: "numeric"

    });

    calendar.appendChild(title);

    //==========================================
    // WEEK DAYS
    //==========================================

    const weekDays = document.createElement("div");

    weekDays.className = "week-days";

    ["SUN","MON","TUE","WED","THU","FRI","SAT"].forEach(day => {

        const item = document.createElement("div");

        item.className = "week-name";

        item.textContent = day;

        weekDays.appendChild(item);

    });

    calendar.appendChild(weekDays);

    //==========================================
    // GRID
    //==========================================

    const grid = document.createElement("div");

    grid.className = "month-grid";

    const firstDay = new Date(

        currentDate.getFullYear(),
        currentDate.getMonth(),
        1

    );

    const startDay = firstDay.getDay();

    const totalDays = new Date(

        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0

    ).getDate();

    //==========================================
    // EMPTY CELLS
    //==========================================

    for (let i = 0; i < startDay; i++) {

        const empty = document.createElement("div");

        empty.className = "empty";

        grid.appendChild(empty);

    }

    //==========================================
    // DAYS
    //==========================================

    for (let day = 1; day <= totalDays; day++) {

        const button = document.createElement("button");

        button.className = "month-day";

        const dayName = new Date(

            currentDate.getFullYear(),
            currentDate.getMonth(),
            day

        ).toLocaleDateString("en-GB", {

            weekday: "long"

        });

        const dayLectures = lectures.filter(

            lecture => lecture.day === dayName

        );

        const dayTasks = tasks.filter(task => {

    if (!task.due_date) return false;

    const due = new Date(task.due_date);

    return (

        due.getDate() === day &&

        due.getMonth() === currentDate.getMonth() &&

        due.getFullYear() === currentDate.getFullYear()

    );

});

        button.innerHTML = `

            <span class="date-number">

                ${day}

            </span>

           <div class="month-dots">

    ${dayLectures.map(lecture => `

        <span
            class="lecture-dot"
            style="background:${getModuleColour(lecture.module)}">
        </span>

    `).join("")}

  ${dayTasks.map(task => {

    const module = userModules.find(

        m => m.id == task.module_id

    );

    const colour = module?.colour || "#22C55E";

    return `

        <span
            class="task-dot"
            style="background:${colour}">
        </span>

    `;

}).join("")} 

${weeklyTopics.filter(topic => {

    if(!topic.start_date || !topic.end_date){

        return false;

    }

    const current = new Date(

        currentDate.getFullYear(),

        currentDate.getMonth(),

        day

    );

    return (

        current >= new Date(topic.start_date)

        &&

        current <= new Date(topic.end_date)

    );

}).map(() => `

    <span
        class="topic-dot"
        style="background:#4F46E5">
    </span>

`).join("")}

</div>

        `;

        //==========================================
        // TODAY
        //==========================================

        const today = new Date();

        if (

            day === today.getDate() &&
            currentDate.getMonth() === today.getMonth() &&
            currentDate.getFullYear() === today.getFullYear()

        ) {

            button.classList.add("active-day");

        }

        //==========================================
        // OPEN DAY VIEW
        //==========================================

        button.addEventListener("click", () => {

            currentDate = new Date(

                currentDate.getFullYear(),
                currentDate.getMonth(),
                day

            );

            if (view) {

                view.value = "day";

            }

            updateCalendar();

        });

        grid.appendChild(button);

    }

    calendar.appendChild(grid);

}

//==================================================
// UPDATE CALENDAR
//==================================================

function updateCalendar() {

    if (!calendar || !view) return;

    switch(view.value){

        case "day":

            renderDay();

            break;

        case "week":

            renderWeek();

            break;

        case "month":

            renderMonth();

            break;

    }

    updateScheduleLayout();

}
//==================================================
// VIEW SWITCH
//==================================================

if (view) {

   view.addEventListener("change", () => {

    updateCalendar();

});

}

//==================================================
// PREVIOUS
//==================================================

if (calendarPrevBtn) {

    calendarPrevBtn.addEventListener("click", () => {

        switch (view.value) {

            case "day":
                currentDate.setDate(currentDate.getDate() - 1);
                break;

            case "week":
                currentDate.setDate(currentDate.getDate() - 7);
                break;

            case "month":
                currentDate.setMonth(currentDate.getMonth() - 1);
                break;

        }

        updateCalendar();

    });

}

//==================================================
// NEXT
//==================================================

if (calendarNextBtn) {

    calendarNextBtn.addEventListener("click", () => {

        switch (view.value) {

            case "day":
                currentDate.setDate(currentDate.getDate() + 1);
                break;

            case "week":
                currentDate.setDate(currentDate.getDate() + 7);
                break;

            case "month":
                currentDate.setMonth(currentDate.getMonth() + 1);
                break;

        }

        updateCalendar();

    });

}



function updateScheduleLayout() {

    //-----------------------------------------
    // DAY
    //-----------------------------------------

    if(view.value === "day"){

        calendar.style.display = "block";

        scheduleList.style.display = "none";

        return;

    }

    //-----------------------------------------
    // WEEK
    //-----------------------------------------

    if(view.value === "week"){

        calendar.style.display = "block";

        scheduleList.style.display = "block";

        return;

    }

    //-----------------------------------------
    // MONTH
    //-----------------------------------------

    if(view.value === "month"){

        calendar.style.display = "block";

        scheduleList.style.display = "none";

        return;

    }

}

//==================================================
// AUTO SCROLL
//==================================================

function scrollToRelevantHour() {

    const today = new Date();

    let hour = 0;

    if (

        today.toDateString() === currentDate.toDateString()

    ) {

        hour = today.getHours();

    }

    else {

        const dayName = currentDate.toLocaleDateString(

            "en-GB",

            {

                weekday: "long"

            }

        );

        const lecture = lectures.find(

            l => l.day === dayName

        );

        if (lecture) {

           hour = parseInt(

    lecture.start_time.split(":")[0]

);

        }

    }

    const target = document.getElementById(

        `hour-${hour}`

    );

    if (target) {

        target.scrollIntoView({

            behavior: "smooth",
            block: "center"

        });

    }

}

//==================================================
// INITIALISE
//==================================================

if (calendar && view) {

    updateCalendar();

}


//==================================================
// EDIT & DELETE BUTTONS
//==================================================

document.addEventListener("click", async (e) => {

    //==========================
    // EDIT
    //==========================

    if (e.target.closest(".edit-btn")) {

        const id = e.target.closest(".edit-btn").dataset.id;

        window.location.href = `21 addlecture.html?id=${id}`;

    }

    //==========================
    // DELETE
    //==========================

    if (e.target.closest(".delete-btn")) {

        const id = e.target.closest(".delete-btn").dataset.id;

        const confirmDelete = confirm(
            "Delete this lecture?"
        );

        if (!confirmDelete) return;

        const { error } = await supabase
            .from("lectures")
            .delete()
            .eq("id", id);

        if (error) {

            console.error(error);
            alert("Failed to delete lecture.");
            return;

        }

        lectures = lectures.filter(
            lecture => lecture.id != id
        );

        updateCalendar();
        updateScheduleLayout();

    }

});

//==================================================
// CREATE OVERLAY
//==================================================

if(navAdd){

    navAdd.addEventListener("click",(e)=>{

        e.preventDefault();

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

        if(e.target === createOverlay){

            createOverlay.style.display = "none";

        }

    });

}

if(newModule){

    newModule.addEventListener("click",()=>{

        window.location.href = "08 modules.html?newModule=true";

    });

}

if(newTask){

    newTask.addEventListener("click",()=>{

        window.location.href = "21 addTask.html";

    });

}

if(newLecture){

    newLecture.addEventListener("click",()=>{

        createOverlay.style.display = "none";

    });

}

if(newAssessment){

    newAssessment.addEventListener("click",()=>{

        alert("Assessment page coming soon.");

    });

}