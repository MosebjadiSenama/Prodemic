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
const createOverlay = document.getElementById("createOverlay");
const navAdd = document.querySelector(".nav-add");
const closeSheet = document.getElementById("closeSheet");

const newModule = document.getElementById("newModule");
const newTask = document.getElementById("newTask");
const newLecture = document.getElementById("newLecture");
const newAssessment = document.getElementById("newAssessment");

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

const taskTypeButtons =
document.querySelectorAll(".task-type-btn");

const otherTaskGroup =
document.getElementById("otherTaskGroup");

const otherTaskType =
document.getElementById("otherTaskType");

const taskSheetOverlay =
document.getElementById("taskSheetOverlay");

const taskSheet =
document.getElementById("taskSheet");

const taskSheetTitle =
document.getElementById("taskSheetTitle");

const editTaskBtn =
document.getElementById("editTaskBtn");

const deleteTaskBtn =
document.getElementById("deleteTaskBtn");

const cancelTaskBtn =
document.getElementById("cancelTaskBtn");

//==================================================
// DATA
//==================================================

let tasks = [];

let modules = [];

let currentFilter = "All";


let selectedTaskType = "Assignment";

let editingTask = null;

//==================================================
// SAVE TASKS
//==================================================
async function loadTasks(){

    const user = auth.currentUser;

    if(!user) return;

    const { data, error } = await supabase
.from("tasks")
.select("*")
.eq("user_id", user.uid);

    if(error){

        console.error(error);

        tasks = [];

        return;

    }

  tasks = (data || []).map(task => {

    const module = modules.find(
        m => m.id == task.module_id
    );

    return {

        ...task,

        module: task.module_name || "General",

        moduleColour:
            module?.colour ||
            "#3048C8",

        date: task.due_date,

        time: task.due_time

    };

});

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

      option.value = module.id;

option.textContent =
`${module.module_code} - ${module.module_name}`;

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

//====

function getPriority(task){

    if(!task.date){

        return "Low";

    }

    const today = new Date();
    today.setHours(0,0,0,0);

    const due = new Date(task.date);
    due.setHours(0,0,0,0);

    const difference =
        Math.floor((due - today) / (1000 * 60 * 60 * 24));

    if(difference <= 2){

        return "High";

    }

    if(difference <= 7){

        return "Medium";

    }

    return "Low";

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

    case "High Priority":

        filteredTasks = filteredTasks.filter(
            task =>
            !task.completed &&
           getPriority(task) === "High"
        );

        break;

    case "Due Soon":

        const today = new Date();

        const sevenDays = new Date();

        sevenDays.setDate(today.getDate() + 7);

        filteredTasks = filteredTasks.filter(task => {

            if(task.completed || !task.date) return false;

            const due = new Date(task.date);

            return due >= today && due <= sevenDays;

        });

        break;

    case "Completed":

        filteredTasks = filteredTasks.filter(
            task => task.completed
        );

        break;

    default:

        filteredTasks = filteredTasks.filter(
            task => !task.completed
        );

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

    const title =
    emptyState.querySelector("h2");

    const text =
    emptyState.querySelector("p");

    switch(currentFilter){

        case "Completed":

            title.textContent = "No Completed Tasks";

            text.textContent =
            "Complete a task and it will appear here.";

            break;

        case "Due Soon":

            title.textContent = "Nothing Due Soon";

            text.textContent =
            "You're all caught up for the next 7 days.";

            break;

        case "Priority":

        case "High Priority":

            title.textContent = "No High Priority Tasks";

            text.textContent =
            "You don't have any high priority tasks right now.";

            break;

        default:

            title.textContent = "No Tasks Yet";

            text.textContent =
            "Create your first task to stay organised throughout the semester.";

            break;

    }

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
const dueText = getRemainingTime(task);

const dueClass =
    dueText.startsWith("Overdue")
        ? "overdue"
        : "";

       card.innerHTML = `

<div class="task-card-content">

    <div class="task-main">

        <div class="task-details">

            <div class="task-title-row">

    <h3>${task.title}</h3>

   <span class="priority-badge ${getPriority(task).toLowerCase()}">

    ${getPriority(task)}

</span>

</div>

            <h4 class="task-module">

                ${task.module}

            </h4>

          <p class="task-due ${dueClass}">

    ${
        task.completed
        ?
        "✓ Completed"
        :
        dueText
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

        checkbox.addEventListener("click", async (e)=>{

            e.stopPropagation();

            task.completed =

            checkbox.checked;

            if(task.completed){

    card.querySelector(".task-due").textContent =

    "✓ Completed";

}

          await supabase
    .from("tasks")
    .update({
        completed: checkbox.checked
    })
    .eq("id", task.id);

            renderTasks();

        });

        //--------------------------------------
        // EDIT AND DELETE TASK
        //--------------------------------------
card.addEventListener("click", () => {

    taskSheetTitle.textContent = task.title;

    taskSheetOverlay.classList.add("show");

    editTaskBtn.onclick = () => {

        localStorage.setItem(
            "editingTask",
            task.id
        );

        window.location.href = "21 addTask.html";

    };

    deleteTaskBtn.onclick = async () => {

        const yes = confirm("Delete this task?");

        if(!yes) return;

        taskSheetOverlay.classList.remove("show");

        await deleteTask(task.id);

    };

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

  taskModule.value = editingTask.module_id || "";

    taskDate.value =

    editingTask.date || "";

    taskTime.value =

    editingTask.time || "";

    taskReminder.value =

    editingTask.reminder || "None";

    taskRepeat.value =

    editingTask.repeat || "Never";



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
const selectedModule =
modules.find(module => {

console.log("Dropdown value:", taskModule.value);

    console.log(
        module.id,
        typeof module.id,
        taskModule.value,
        typeof taskModule.value
    );

    return String(module.id) === taskModule.value;

});

console.log("Selected module:", selectedModule);
console.log("Dropdown value:", taskModule.value);

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
        selectedModule?.module_name || "General",

        module_id:
        selectedModule?.id || null,
        

        moduleColour:

        moduleColour,

        type:

        finalTaskType,

        priority:
       getPriority({
        date: taskDate.value
       }),

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

  const { error } = await supabase
.from("tasks")
.insert([{
    user_id: auth.currentUser.uid,

    module_id: selectedModule?.id ?? null,

    module_name: selectedModule
        ? `${selectedModule.module_code} - ${selectedModule.module_name}`
        : "General",

    title: task.title,

    due_date: task.date,

    due_time: task.time,

    priority: getPriority({
        date: task.date
    }),

    completed: false
}]);

if (error) {
    console.error("SUPABASE ERROR:", error);
    alert(JSON.stringify(error, null, 2));
    return;
}

if(error){
    console.error(error);
    alert(error.message);
    return;
}

if(error){
    console.error(error);
    alert(error.message);
    return;
}

localStorage.removeItem("editingTask");

window.location.href = "09 tasks.html";
     

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

await loadModules();

await loadTasks();

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
window.addEventListener("focus", async () => {
    await loadTasks();
    renderTasks();
});

//==================================================
// DELETE TASK
//==================================================

async function deleteTask(taskId){

    await supabase
        .from("tasks")
        .delete()
        .eq("id", taskId);

    await loadTasks();

    renderTasks();

}


//==================================================
// MARK COMPLETE
//==================================================

async function completeTask(taskId){

    const task = tasks.find(t => t.id === taskId);

    if(!task) return;

    await supabase
        .from("tasks")
        .update({
            completed: !task.completed
        })
        .eq("id", taskId);

    await loadTasks();

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

loadTasks();


//=======edit and delete task card

cancelTaskBtn?.addEventListener("click", () => {

    taskSheetOverlay.classList.remove("show");

});

taskSheetOverlay?.addEventListener("click", (e) => {

    if(e.target === taskSheetOverlay){

        taskSheetOverlay.classList.remove("show");

    }

});

taskSheetOverlay?.addEventListener("click", (e) => {

    if(e.target === taskSheetOverlay){

        taskSheetOverlay.classList.remove("show");

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

        window.location.href="08 modules.html?newModule=true";

    });

}

if(newTask){

    newTask.addEventListener("click",()=>{

        createOverlay.style.display = "none";

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

        alert("Assessment page coming soon.");

    });

}