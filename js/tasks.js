//==================================================
// PRODEMIC TASKS
//==================================================

import { auth } from "../firebase.js";
import { supabase } from "./supabase.js";

//==================================================
// ELEMENTS
//==================================================

//-------------
// Tasks Page
//-------------

const taskList = document.getElementById("taskList");
const emptyState = document.getElementById("emptyState");
const filterButtons = document.querySelectorAll(".filter-btn");
const addTaskBtn = document.querySelector(".primary-btn");
const aiButton = document.querySelector(".secondary-btn");

//-------------
// Add Task Page
//-------------

const taskForm = document.getElementById("taskForm");

const backBtn = document.getElementById("backBtn");

const taskModule = document.getElementById("taskModule");

const taskTitle = document.getElementById("taskTitle");

const taskDate = document.getElementById("taskDate");

const taskTime = document.getElementById("taskTime");

const taskReminder = document.getElementById("taskReminder");

const taskRepeat = document.getElementById("taskRepeat");

const countdownPreview =
document.getElementById("countdownPreview");

const priorityButtons =
document.querySelectorAll(".priority-btn");

const taskTypeButtons =
document.querySelectorAll(".task-type-btn");

const otherTaskGroup =
document.getElementById("otherTaskGroup");

const otherTaskType =
document.getElementById("otherTaskType");

//==================================================
// DATA
//==================================================

let tasks = [];

let modules = [];

let currentFilter = "All";

let selectedPriority = "Medium";

let selectedTaskType = "Assignment";

let editingTask = null;

//==================================================
// SAVE TASKS
//==================================================
function saveTasks(){

    const user = auth.currentUser;

    if(!user){

        return;

    }

    localStorage.setItem(

        `tasks_${user.uid}`,

        JSON.stringify(tasks)

    );

}

//==================================================
// LOAD MODULES
//==================================================
async function loadModules(){

    if(!taskModule) return;

    const user = auth.currentUser;

    if(!user) return;

    taskModule.innerHTML = `
        <option value="">Select Module</option>
        <option value="General">General Task</option>
    `;


console.log("Firebase UID:", user.uid);

const { data, error } = await supabase
    .from("modules")
    .select("*")
    .eq("user_id", user.uid);

console.log("Modules:", data);
console.log("Error:", error);

    if(error){

        console.error(error);

        return;

    }

    modules = data || [];

    modules.forEach(module=>{

        const option = document.createElement("option");

        option.value = module.name;

        option.textContent = `${module.code} - ${module.name}`;

        taskModule.appendChild(option);

    });

}
function getRemainingTime(task){

    if(!task.date){

        return "No due date";

    }

    const due = new Date(

        `${task.date}T${task.time || "23:59"}`

    );

    const now = new Date();

    const diff = due - now;

    if(diff <= 0){

        return "Overdue";

    }

    const totalHours =

    Math.floor(

        diff/(1000*60*60)

    );

    const days =

    Math.floor(

        totalHours/24

    );

    const hours =

    totalHours%24;

    if(days>0){

        return `Due in ${days} day${days!==1?"s":""} • ${hours} hour${hours!==1?"s":""}`;

    }

    return `Due in ${hours} hour${hours!==1?"s":""}`;

}


//==================================================
// RENDER TASKS
//==================================================

function renderTasks(){

    //------------------------------------------
    // ONLY RUN ON TASK PAGE
    //------------------------------------------

    if(!taskList || !emptyState){

        return;

    }

    //------------------------------------------
    // CLEAR LIST
    //------------------------------------------

    taskList.innerHTML = "";

    //------------------------------------------
    // FILTER TASKS
    //------------------------------------------

    let filteredTasks = [...tasks];

    switch(currentFilter){

        case "Today":

            const today =

            new Date()

            .toISOString()

            .split("T")[0];

            filteredTasks =

            filteredTasks.filter(

                task =>

                task.date === today

            );

            break;

        case "Upcoming":

            filteredTasks =

            filteredTasks.filter(

                task =>

                !task.completed

            );

            break;

        case "Completed":

            filteredTasks =

            filteredTasks.filter(

                task =>

                task.completed

            );

            break;

        default:

            break;

    }

    //------------------------------------------
    // SORT BY DATE
    //------------------------------------------

    filteredTasks.sort((a,b)=>{

    //----------------------------------
    // Incomplete tasks first
    //----------------------------------

    if(a.completed !== b.completed){

        return a.completed ? 1 : -1;

    }

    //----------------------------------
    // Then sort by due date
    //----------------------------------

    if(!a.date) return 1;

    if(!b.date) return -1;

    return new Date(

        `${a.date}T${a.time || "23:59"}`

    ) -

    new Date(

        `${b.date}T${b.time || "23:59"}`

    );

});

    //------------------------------------------
    // EMPTY STATE
    //------------------------------------------

    if(filteredTasks.length===0){

        emptyState.style.display="flex";

        taskList.style.display="none";

        return;

    }

    emptyState.style.display="none";

    taskList.style.display="flex";

    //------------------------------------------
    // CREATE CARDS
    //------------------------------------------

    filteredTasks.forEach(task=>{

        const card =

        document.createElement("div");

        card.className =

        task.completed

        ?

        "task-card completed"

        :

        "task-card";

        //--------------------------------------
        // MODULE COLOUR
        //--------------------------------------

        card.style.setProperty(

            "--module-colour",

            task.moduleColour || "#3048C8"

        );

        //--------------------------------------
        // CARD HTML
        //--------------------------------------

       card.innerHTML = `

<div class="task-card-content">

    <div class="task-main">

        <div class="task-details">

            <h3>

                ${task.title}

            </h3>

            <h4 class="task-module">

                ${task.module}

            </h4>

            <p class="task-due">

    ${
        task.completed
        ?
        "✓ Completed"
        :
        getRemainingTime(task)
    }

</p>

        </div>

    </div>

    <div class="task-right">

        <input

            type="checkbox"

            class="task-check"

            ${task.completed ? "checked" : ""}

        >

    </div>

</div>

`;
        //--------------------------------------
        // COMPLETE TASK
        //--------------------------------------

        const checkbox =

        card.querySelector(".task-check");

        checkbox.addEventListener("click",(e)=>{

            e.stopPropagation();

            task.completed =

            checkbox.checked;

            if(task.completed){

    card.querySelector(".task-due").textContent =

    "✓ Completed";

}

            saveTasks();

            renderTasks();

        });

        //--------------------------------------
        // EDIT TASK
        //--------------------------------------

        card.addEventListener("click",()=>{

            localStorage.setItem(

                "editingTask",

                task.id

            );

            window.location.href =

            "21 addTask.html";

        });

        //--------------------------------------
        // ADD CARD
        //--------------------------------------

        taskList.appendChild(card);

    });

}

//==================================================
// FILTER BUTTONS
//==================================================

if(filterButtons.length){

    filterButtons.forEach(button=>{

        button.addEventListener("click",()=>{

            filterButtons.forEach(btn=>{

                btn.classList.remove("active");

            });

            button.classList.add("active");

            currentFilter =

            button.textContent.trim();

            renderTasks();

        });

    });

}

//==================================================
// ADD TASK BUTTON
//==================================================

if(addTaskBtn){

    addTaskBtn.addEventListener("click",(e)=>{

        e.preventDefault();

        localStorage.removeItem(

            "editingTask"

        );

        window.location.href =

        "21 addTask.html";

    });

}

//==================================================
// AI BUTTON
//==================================================

if(aiButton){

    aiButton.addEventListener("click",(e)=>{

        e.preventDefault();

        alert(

            "AI Task Generation Coming Soon"

        );

    });

}

//==================================================
// EDIT TASK
//==================================================

const editingTaskId =

localStorage.getItem("editingTask");

if(editingTaskId){

    editingTask =

    tasks.find(

        task =>

        task.id == editingTaskId

    );

}

//==================================================
// LOAD TASK INTO FORM
//==================================================

function loadTaskIntoForm(){

    if(

        !editingTask ||

        !taskForm

    ){

        return;

    }

    taskTitle.value =

    editingTask.title || "";

    taskModule.value =

    editingTask.module || "";

    taskDate.value =

    editingTask.date || "";

    taskTime.value =

    editingTask.time || "";

    taskReminder.value =

    editingTask.reminder || "None";

    taskRepeat.value =

    editingTask.repeat || "Never";

    selectedPriority =

    editingTask.priority || "Medium";

    selectedTaskType =

    editingTask.type || "Assignment";

    //------------------------------------------
    // Priority Buttons
    //------------------------------------------

    priorityButtons.forEach(button=>{

        button.classList.remove("active");

        if(

            button.dataset.priority===selectedPriority

        ){

            button.classList.add("active");

        }

    });

    //------------------------------------------
    // Task Type Buttons
    //------------------------------------------

    taskTypeButtons.forEach(button=>{

        button.classList.remove("active");

        if(

            button.dataset.type===selectedTaskType

        ){

            button.classList.add("active");

        }

    });

    //------------------------------------------
    // Other Task
    //------------------------------------------

    if(selectedTaskType==="Other"){

        otherTaskGroup.style.display="block";

    }

}

//==================================================
// PRIORITY BUTTONS
//==================================================

priorityButtons.forEach(button=>{

    button.addEventListener("click",()=>{

        priorityButtons.forEach(btn=>{

            btn.classList.remove("active");

        });

        button.classList.add("active");

        selectedPriority =

        button.dataset.priority;

    });

});

//==================================================
// TASK TYPE BUTTONS
//==================================================

taskTypeButtons.forEach(button=>{

    button.addEventListener("click",()=>{

        taskTypeButtons.forEach(btn=>{

            btn.classList.remove("active");

        });

        button.classList.add("active");

        selectedTaskType =

        button.dataset.type;

        if(selectedTaskType==="Other"){

            otherTaskGroup.style.display="block";

        }

        else{

            otherTaskGroup.style.display="none";

            if(otherTaskType){

                otherTaskType.value="";

            }

        }

    });

});

//==================================================
// COUNTDOWN PREVIEW
//==================================================

function updateCountdownPreview(){

    if(

        !countdownPreview ||

        !taskDate

    ){

        return;

    }

    if(taskDate.value===""){

        countdownPreview.innerHTML=

        "No due date selected";

        return;

    }

    const due=

    new Date(

        `${taskDate.value}T${taskTime.value || "23:59"}`

    );

    const now=

    new Date();

    const diff=

    due-now;

    if(diff<=0){

        countdownPreview.innerHTML=

        "Task is overdue";

        return;

    }

    const days=

    Math.floor(

        diff/(1000*60*60*24)

    );

    const hours=

    Math.floor(

        (diff%(1000*60*60*24))

        /(1000*60*60)

    );

    countdownPreview.innerHTML=

    `Due in <strong>${days}</strong> days <strong>${hours}</strong> hours`;

}

//==================================================
// SAVE TASK
//==================================================

if(taskForm){

taskForm.addEventListener(

"submit",

async(e)=>{

    e.preventDefault();

    //------------------------------------------
    // Validation
    //------------------------------------------

    if(taskTitle.value.trim()===""){

        alert(

            "Please enter an assessment name."

        );

        return;

    }

    if(taskModule.value===""){

        alert(

            "Please choose a module."

        );

        return;

    }

    //------------------------------------------
    // Module
    //------------------------------------------

    const selectedModule=

    modules.find(

        module=>

        module.name===taskModule.value

    );

    //------------------------------------------
    // Colour
    //------------------------------------------

    const moduleColour=

    selectedModule?.colour ||

    selectedModule?.color ||

    "#3048C8";

    //------------------------------------------
    // Task Type
    //------------------------------------------

    let finalTaskType=

    selectedTaskType;

    if(

        selectedTaskType==="Other"

        &&

        otherTaskType.value.trim()!==''

    ){

        finalTaskType=

        otherTaskType.value.trim();

    }

    //------------------------------------------
    // Task Object
    //------------------------------------------

    const task={

        id:

        editingTask

        ?

        editingTask.id

        :

        Date.now(),

        title:

        taskTitle.value.trim(),

        module:

        taskModule.value,

        moduleColour:

        moduleColour,

        type:

        finalTaskType,

        priority:

        selectedPriority,

        date:

        taskDate.value,

        time:

        taskTime.value,

        reminder:

        taskReminder.value,

        repeat:

        taskRepeat.value,

        completed:

        editingTask

        ?

        editingTask.completed

        :

        false,

        createdAt:

        editingTask

        ?

        editingTask.createdAt

        :

        new Date().toISOString()

    };

    //------------------------------------------
    // Update
    //------------------------------------------

    if(editingTask){

        const index=

        tasks.findIndex(

            t=>t.id===editingTask.id

        );

        tasks[index]=task;

    }

    //------------------------------------------
    // New
    //------------------------------------------

    else{

        tasks.push(task);

    }

    //------------------------------------------
    // Save
    //------------------------------------------

    saveTasks();

    localStorage.removeItem(

        "editingTask"

    );

    //------------------------------------------
    // Go back
    //------------------------------------------

    window.location.href=

    "09 tasks.html";

});

}

//==================================================
// BACK BUTTON
//==================================================

if(backBtn){

    backBtn.addEventListener("click",()=>{

        localStorage.removeItem("editingTask");

        window.location.href="09 tasks.html";

    });

}

//==================================================
// COUNTDOWN EVENTS
//==================================================

if(taskDate){

    taskDate.addEventListener(

        "change",

        updateCountdownPreview

    );

}

if(taskTime){

    taskTime.addEventListener(

        "change",

        updateCountdownPreview

    );

}

//==================================================
// INITIALISE
//==================================================

window.addEventListener(

    "DOMContentLoaded",

    ()=>{

        //------------------------------------------
        // Task Page
        //------------------------------------------

        if(taskList){

            renderTasks();

        }

        //------------------------------------------
        // Add Task Page
        //------------------------------------------

        if(taskForm){

            updateCountdownPreview();

        }

    }

);

//==================================================
// AUTH
//==================================================

auth.onAuthStateChanged(async(user)=>{

    //------------------------------------------
    // Not logged in
    //------------------------------------------

    if(!user){

        return;

    }

    tasks = JSON.parse(

    localStorage.getItem(

        `tasks_${user.uid}`

    )

) || [];
    //------------------------------------------
    // Load Modules
    //------------------------------------------

    await loadModules();

    //------------------------------------------
    // Editing
    //------------------------------------------

    if(editingTask){

        loadTaskIntoForm();

    }

    //------------------------------------------
    // Render Tasks
    //------------------------------------------

    if(taskList){

        renderTasks();

    }

});

//==================================================
// STORAGE SYNC
//==================================================
window.addEventListener(

    "storage",

    ()=>{

        const user = auth.currentUser;

        if(!user){

            return;

        }

        tasks =

        JSON.parse(

            localStorage.getItem(

                `tasks_${user.uid}`

            )

        ) || [];

        renderTasks();

    }

);

//==================================================
// DELETE TASK
//==================================================

function deleteTask(taskId){

    tasks = tasks.filter(

        task =>

        task.id !== taskId

    );

    saveTasks();

    renderTasks();

}

//==================================================
// MARK COMPLETE
//==================================================

function completeTask(taskId){

    const task =

    tasks.find(

        task =>

        task.id === taskId

    );

    if(!task){

        return;

    }

    task.completed =

    !task.completed;

    saveTasks();

    renderTasks();

}

//==================================================
// SORT TASKS
//==================================================

function sortTasks(){

    tasks.sort((a,b)=>{

        if(!a.date){

            return 1;

        }

        if(!b.date){

            return -1;

        }

        return new Date(

            `${a.date}T${a.time||"23:59"}`

        )

        -

        new Date(

            `${b.date}T${b.time||"23:59"}`

        );

    });

}

//==================================================
// FINAL START
//==================================================

sortTasks();

saveTasks();