import { auth, db } from "../firebase.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

//==================================================
// ELEMENTS
//==================================================

const schedulePage =
document.getElementById("schedulePage");

const addLecturePage =
document.getElementById("addLecturePage");

const addLectureBtn =
document.getElementById("addLectureBtn");

const backToSchedule =
document.getElementById("backToSchedule");

const saveLecture =
document.getElementById("saveLecture");

const lectureList =
document.getElementById("lectureList");

const scheduleEmpty =
document.getElementById("scheduleEmpty");

const lectureModule =
document.getElementById("lectureModule");

const lectureDay =
document.getElementById("lectureDay");

const startTime =
document.getElementById("startTime");

const endTime =
document.getElementById("endTime");

const venue =
document.getElementById("venue");

const lecturer =
document.getElementById("lecturer");

//==================================================
// STORE USER MODULES
//==================================================

let userModules = [];
//==================================================
// LOAD USER MODULES
//==================================================

async function loadModules(){
    userModules = [];

//==================================================
// DEFAULT OPTIONS
//==================================================

lectureModule.innerHTML = `

    <option value="">
        Select Module
    </option>

    <option value="__new__">
        + Create New Module
    </option>

`;  

//==================================================
// CREATE NEW MODULE OPTION
//==================================================

lectureModule.addEventListener("change", () => {

    if (lectureModule.value === "__new__") {

        // Go to your Add Module page
       window.location.href = "08 modules.html?newModule=true";

    }

});

    const snapshot = await getDocs(

        collection(

            db,

            "users",

            auth.currentUser.uid,

            "modules"

        )

    );

    snapshot.forEach(doc=>{

   const module = doc.data();

// Save module so we can use its colour later
userModules.push(module);

        const option =
        document.createElement("option");

       //==================================================
// YOUR MODULES ARE SAVED AS:
// name
// code
// semester
// colour
//==================================================

option.value =
module.name;

// Show both module code and module name
option.textContent =
`${module.code} - ${module.name}`;

// Add the option to the dropdown
lectureModule.appendChild(option);

    });

}

//==================================================
// LOAD MODULES AFTER LOGIN
//==================================================

auth.onAuthStateChanged(async(user)=>{

    if(!user){

        return;

    }

    lectures = JSON.parse(

        localStorage.getItem(

            `lectures_${user.uid}`

        )

    ) || [];

    await loadModules();

    renderLectures();

    updateScheduleLayout();

    updateCalendar();

});

//==================================================
// LOAD LECTURES
//==================================================

let lectures = [];

let editingLectureId = null;


//============================================================================= calender=============================================================================


//======today's date========================

let currentDate = new Date();

const calendar =
document.getElementById("calendar");

const view =
document.getElementById("calendarView");

const calendarPrevBtn =
document.getElementById("prevBtn");

const calendarNextBtn =
document.getElementById("nextBtn");

//===================weekly=======================


function renderWeek(){

    calendar.innerHTML = "";

    const weekContainer = document.createElement("div");
   weekContainer.classList.add("week-container");

    let firstDay = new Date(currentDate);

    firstDay.setDate(
        currentDate.getDate() - currentDate.getDay()
    );

    for(let i = 0; i < 7; i++){

        let day = new Date(firstDay);

        day.setDate(firstDay.getDate() + i);

        const button = document.createElement("button");

        button.classList.add("day");

        if(day.toDateString() === currentDate.toDateString()){
            button.classList.add("active");
        }

        //==================================================
// FIND LECTURES FOR THIS DAY
//==================================================

const dayName = day.toLocaleDateString("en-GB",{
    weekday:"long"
});

const dayLectures = lectures.filter(
    lecture => lecture.day === dayName
);

//==================================================
// CREATE WEEK BUTTON
//==================================================

button.innerHTML = `

    <span>

        ${day.toLocaleDateString("en",{
            weekday:"short"
        }).toUpperCase()}

    </span>

    <strong>

        ${day.getDate()}

    </strong>

    <div class="week-dots">

        ${dayLectures.map(lecture=>`

            <span
                class="lecture-dot"
                style="background:${getModuleColour(lecture.module)}">
            </span>

        `).join("")}

    </div>

`;

        button.onclick = () => {

            currentDate = new Date(day);

            view.value = "day";

            updateCalendar();

        };

       weekContainer.appendChild(button);

    }

    calendar.appendChild(weekContainer);

}

//===========================Day======================================

function renderDay(){

    calendar.innerHTML = "";

//======show card closer to current time
const dayView = document.createElement("div");
dayView.className = "day-view";
dayView.id = "dayView";


    dayView.innerHTML = `

        <h2 class="day-title">
            ${currentDate.toLocaleDateString("en-GB",{
                weekday:"long",
                day:"2-digit",
                month:"short",
                year:"numeric"
            })}
        </h2>

       <div class="timeline">

${Array.from({length:24},(_,hour)=>`

   <div
    class="time-slot"
    id="hour-${hour}">

        <div class="time-label">

            ${String(hour).padStart(2,"0")}:00

        </div>

        <div
            class="events"
            data-hour="${hour}">

        </div>

    </div>

`).join("")}

</div>

    `;

    //==================================================
// ADD DAY VIEW TO CALENDAR
//==================================================

calendar.appendChild(dayView);
//==================================================
// SCROLL TO CURRENT TIME
//==================================================

setTimeout(() => {

    scrollToRelevantHour();

}, 100);
//==================================================
// GET TODAY'S NAME
//==================================================

const today = currentDate.toLocaleDateString(

    "en-GB",

    {

        weekday:"long"

    }

);

//==================================================
// FIND TODAY'S LECTURES
//==================================================

const todaysLectures = lectures.filter(

    lecture => lecture.day === today

);


//==================================================
// UPDATE PAGE LAYOUT
//==================================================

updateScheduleLayout();
//==================================================
// DISPLAY LECTURES ON THE TIMELINE
//==================================================

todaysLectures.forEach(lecture=>{

    const hour = parseInt(

        lecture.start.split(":")[0]

    );

    const container =

    dayView.querySelector(

        `.events[data-hour="${hour}"]`

    );

    if(!container) return;

    const event =

    document.createElement("div");

    event.className =

    "lecture-event";

    event.innerHTML = `

        <strong>

            ${lecture.module}

        </strong>

        <small>

            ${lecture.start} - ${lecture.end}

        </small>

        <span>

            📍 ${lecture.venue || ""}

        </span>

    `;

    container.appendChild(event);

});

}
//===========================Month======================================

function renderMonth(){

    calendar.innerHTML = "";

    // Month title
    const title = document.createElement("h2");
    title.textContent = currentDate.toLocaleString("default",{
        month:"long",
        year:"numeric"
    });

    title.classList.add("month-title");

    calendar.appendChild(title);

    // Weekday names
    const weekDays = document.createElement("div");
    weekDays.classList.add("week-days");

    const names = ["SUN","MON","TUE","WED","THU","FRI","SAT"];

    names.forEach(name=>{

        const day=document.createElement("div");
        day.textContent=name;
        day.classList.add("week-name");

        weekDays.appendChild(day);

    });

    calendar.appendChild(weekDays);

    // Calendar Grid
    const grid=document.createElement("div");
    grid.classList.add("month-grid");

    const firstDay=new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
    );

    const startDay=firstDay.getDay();

    const totalDays=new Date(
        currentDate.getFullYear(),
        currentDate.getMonth()+1,
        0
    ).getDate();

    // Empty spaces before day 1

    for(let i=0;i<startDay;i++){

        const empty=document.createElement("div");

        empty.classList.add("empty");

        grid.appendChild(empty);

    }

    // Days

    for(let i=1;i<=totalDays;i++){

        const day=document.createElement("button");

        day.classList.add("month-day");

      const dayName = new Date(

    currentDate.getFullYear(),
    currentDate.getMonth(),
    i

).toLocaleDateString("en-GB",{

    weekday:"long"

});

const dayLectures = lectures.filter(

    lecture => lecture.day === dayName

);

day.innerHTML = `

    <span class="date-number">

        ${i}

    </span>

    <div class="month-dots">

        ${dayLectures.map(lecture=>`

            <span
                class="lecture-dot"
                style="background:${getModuleColour(lecture.module)}">
            </span>

        `).join("")}

    </div>

`;

        // Today's date

        if(
            i===currentDate.getDate()
        ){

            day.classList.add("active-day");

        }

        // Click a day

        day.onclick=()=>{

            currentDate=new Date(

                currentDate.getFullYear(),
                currentDate.getMonth(),
                i

            );

            view.value="day";

            updateCalendar();

        };

        grid.appendChild(day);

    }

      calendar.appendChild(grid);

}


//========switch views=================================

//==================== Calendar View ====================

view.addEventListener("change", () => {

    updateCalendar();

    updateScheduleLayout();

});

//=====================previous button===================================

calendarPrevBtn.onclick = () => {

    if(view.value==="day")
        currentDate.setDate(currentDate.getDate()-1);

    if(view.value==="week")
        currentDate.setDate(currentDate.getDate()-7);

    if(view.value==="month")
        currentDate.setMonth(currentDate.getMonth()-1);

    updateCalendar();

    updateScheduleLayout();

};

//=====================next button=========================


if (calendarNextBtn && view) {

   calendarNextBtn.onclick = () => {

    if(view.value==="day")
        currentDate.setDate(currentDate.getDate()+1);

    if(view.value==="week")
        currentDate.setDate(currentDate.getDate()+7);

    if(view.value==="month")
        currentDate.setMonth(currentDate.getMonth()+1);

    updateCalendar();

    updateScheduleLayout();

};

}
//======================update calender==========================

function updateCalendar(){

    if(view.value==="day")
        renderDay();

    if(view.value==="week")
        renderWeek();

    if(view.value==="month")
        renderMonth();

}

if(calendar && view){

    updateCalendar();

    updateScheduleLayout();

}
//==================================================
// GET MODULE COLOUR
//==================================================

function getModuleColour(moduleName){

    const module = userModules.find(

        m => m.name === moduleName

    );

    return module ? module.colour : "#3048C8";

}

//==================================================
// LOAD LECTURE CARDS
//==================================================


renderLectures();

//==================================================
// OPEN ADD LECTURE
//==================================================

addLectureBtn.addEventListener("click",()=>{

    schedulePage.style.display = "none";

    addLecturePage.style.display = "block";

});

//==================================================
// BACK
//==================================================

backToSchedule.addEventListener("click",()=>{

    addLecturePage.style.display = "none";

    schedulePage.style.display = "block";

});
//==================================================
// UPDATE SCHEDULE LAYOUT
//==================================================

function updateScheduleLayout(){

    //==========================================
    // GET PAGE ELEMENTS
    //==========================================

    const tipCard =
    document.querySelector(".tip-card");

    const emptyImage =
    document.querySelector(".no-tasks-img");

    //==========================================
    // DAY VIEW
    //==========================================

    if(view.value === "day"){

        // Hide lecture cards

        lectureList.style.display = "none";

        // Hide empty state

        scheduleEmpty.style.display = "none";

        // Hide empty image

        if(emptyImage){

            emptyImage.style.display = "none";

        }

        // Hide tip card

        if(tipCard){

            tipCard.style.display = "none";

        }

    }

    //==========================================
    // WEEK + MONTH
    //==========================================

    else{

        // User has lectures

        if(lectures.length > 0){

            lectureList.style.display = "block";

            scheduleEmpty.style.display = "none";

            if(emptyImage){

                emptyImage.style.display = "none";

            }

            if(tipCard){

                tipCard.style.display = "none";

            }

        }

        // User has NO lectures

        else{

            lectureList.style.display = "none";

            scheduleEmpty.style.display = "block";

            if(emptyImage){

                emptyImage.style.display = "block";

            }

            if(tipCard){

                tipCard.style.display = "flex";

            }

        }

    }

}

//==================================================
// SAVE LECTURE
//==================================================

saveLecture.addEventListener("click",()=>{


    if(

        lectureModule.value === "" ||

        startTime.value === "" ||

        endTime.value === ""

    ){

        alert("Please complete all required fields.");

        return;

    }

    if(endTime.value <= startTime.value){

        alert("End time must be after the start time.");

        return;

    }

    const lecture = {

        id: editingLectureId || Date.now(),

        module: lectureModule.value,

        day: lectureDay.value,

        start: startTime.value,

        end: endTime.value,

        venue: venue.value,

        lecturer: lecturer.value

    };

    if(editingLectureId){

        const index = lectures.findIndex(

            l => l.id === editingLectureId

        );

        lectures[index] = lecture;

        editingLectureId = null;

    }

    else{

        lectures.push(lecture);

    }

    localStorage.setItem(

    `lectures_${auth.currentUser.uid}`,

    JSON.stringify(lectures)

);
   renderLectures();

updateScheduleLayout();

updateCalendar();

    lectureModule.selectedIndex = 0;

    lectureDay.selectedIndex = 0;

    startTime.value = "";

    endTime.value = "";

    venue.value = "";

    lecturer.value = "";

    addLecturePage.style.display = "none";

    schedulePage.style.display = "block";

});

//==================================================
// RENDER LECTURES
//==================================================

function renderLectures(){

 lectureList.innerHTML = "";

// Day view does not use lecture cards.
// Simply hide them and continue.
if(view.value === "day"){

    lectureList.style.display = "none";

}else{

    lectureList.style.display = "block";

}

    const emptyImage = document.querySelector(".no-tasks-img");
    const lectureCount = document.getElementById("lectureCount");

    if(lectures.length === 0){

        scheduleEmpty.style.display = "block";
        document.querySelector(".tip-card").style.display = "flex";

        if(emptyImage){
            emptyImage.style.display = "block";
        }

        lectureList.style.display = "none";

        if(lectureCount){
            lectureCount.textContent = "0 Lectures";
        }

        return;
    }

    scheduleEmpty.style.display = "none";
    document.querySelector(".tip-card").style.display = "none";

    if(emptyImage){
        emptyImage.style.display = "none";
    }

    lectureList.style.display = "block";

    if(lectureCount){
        lectureCount.textContent =
        `${lectures.length} Lecture${lectures.length > 1 ? "s" : ""}`;
    }

  if(view.value !== "day"){

    lectures.forEach((lecture)=>{

        const card = document.createElement("div");

      //==================================================
// MODULE COLOUR
//==================================================

const colour = getModuleColour(lecture.module);

card.className = "lecture-card";

// Entire border
card.style.border = `3px solid ${colour}`;
        card.dataset.id = lecture.id;

//========================================
card.innerHTML = `

<div class="lecture-card-header">

    <!--=========================================
    LECTURE DETAILS
    ==========================================-->

    <div class="lecture-content">

        <div class="lecture-time">

            ${lecture.day} • ${lecture.start} - ${lecture.end}

        </div>

        <div class="lecture-title">

            ${lecture.module}

        </div>

        <div class="lecture-room">

            📍 ${lecture.venue || "No venue"}

        </div>

    </div>

    <!--=========================================
    ACTION BUTTONS
    ==========================================-->

    <div class="lecture-actions">

        <button class="delete-btn">

            <i class="fa-solid fa-trash"></i>

        </button>

        <button class="edit-btn">

            <i class="fa-solid fa-pen"></i>

        </button>

    </div>

</div>

`;




//==================


        lectureList.appendChild(card);

        //=========================
        // EDIT
        //=========================

        card.querySelector(".edit-btn").addEventListener("click",()=>{

            editingLectureId = lecture.id;

            lectureModule.value = lecture.module;

            lectureDay.value = lecture.day;

            startTime.value = lecture.start;

            endTime.value = lecture.end;

            venue.value = lecture.venue;

            lecturer.value = lecture.lecturer;

            schedulePage.style.display = "none";

            addLecturePage.style.display = "block";

        });

        //=========================
        // DELETE
        //=========================

        card.querySelector(".delete-btn").addEventListener("click",()=>{

            const confirmDelete = confirm(
                "Delete this lecture?"
            );

            if(!confirmDelete) return;

            lectures = lectures.filter(

                item => item.id !== lecture.id

            );

           localStorage.setItem(

    `lectures_${auth.currentUser.uid}`,

    JSON.stringify(lectures)

);
           renderLectures();

           updateScheduleLayout();

           updateCalendar();

        });

    });

  }
}
//==================================================
// AUTO SCROLL DAY VIEW
//==================================================

function scrollToRelevantHour(){

    // Today's date
    const today = new Date();

    // Selected calendar date
    const selected = new Date(currentDate);

    let hourToScroll;

    //--------------------------------------------------
    // IF VIEWING TODAY
    //--------------------------------------------------

    if(

        today.getFullYear() === selected.getFullYear() &&
        today.getMonth() === selected.getMonth() &&
        today.getDate() === selected.getDate()

    ){

        // Scroll to the current hour

        hourToScroll = today.getHours();

    }

    //--------------------------------------------------
    // VIEWING ANOTHER DAY
    //--------------------------------------------------

    else{

        // Find lectures for the selected day

        const dayName = selected.toLocaleDateString(

            "en-GB",

            {

                weekday:"long"

            }

        );

        const dayLectures = lectures.filter(

            lecture => lecture.day === dayName

        );

        // If lectures exist, scroll to the first one

        if(dayLectures.length > 0){

            hourToScroll = parseInt(

                dayLectures[0].start.split(":")[0]

            );

        }

        // Otherwise start at midnight

        else{

            hourToScroll = 0;

        }

    }

    //--------------------------------------------------
    // SCROLL
    //--------------------------------------------------

    const target = document.getElementById(

        `hour-${hourToScroll}`

    );

    if(target){

        target.scrollIntoView({

            behavior:"smooth",

            block:"center"

        });

    }

}

