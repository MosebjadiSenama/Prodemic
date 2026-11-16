//==================================================
// PRODEMIC TASKS
//==================================================

import { auth } from "../firebase.js";
import { supabase } from "./supabase.js";


const taskTypeInput = document.getElementById("taskType");
const moduleGroup = document.getElementById("moduleGroup");
const taskPriority = document.getElementById("taskPriority");
const taskNotes = document.getElementById("taskNotes");
const taskError = document.getElementById("taskError");

//-------------
// Tasks Page
//-------------

const createOverlay =
document.getElementById("createOverlay");

const navAdd =
document.querySelector(".nav-add");

const closeSheet =
document.getElementById("closeSheet");

const newModule =
document.getElementById("newModule");

const newTask =
document.getElementById("newTask");

const newLecture =
document.getElementById("newLecture");

const newAssessment =
document.getElementById("newAssessment");

const taskList =
document.getElementById("taskList");

const emptyState =
document.getElementById("emptyState");

if(emptyState){

    emptyState.style.display = "none";

}

const filterButtons =
document.querySelectorAll(".filter-btn");

const addTaskBtn =
document.querySelector(".primary-btn");

const aiButton =
document.querySelector(".secondary-btn");

const priorityToggle = document.getElementById("priorityToggle");


//-------------
// Add Task Page
//-------------

const taskForm =
document.getElementById("taskForm");

const backBtn =
document.getElementById("backBtn");

const taskModule =
document.getElementById("taskModule");

const taskTitle =
document.getElementById("taskTitle");

const taskDate =
document.getElementById("taskDate");

const taskTime =
document.getElementById("taskTime");

const taskReminder =
document.getElementById("taskReminder");

const taskRepeat =
document.getElementById("taskRepeat");

const countdownPreview =
document.getElementById("countdownPreview");

const taskTypeButtons =
document.querySelectorAll(".task-type-btn");

const priorityButtons =
document.querySelectorAll(".priority-btn");

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

let selectedTaskType = "academic";

let editingTask = null;

let tasksLoaded = false;

//==================================================
// EDIT TASK ID
//==================================================

const urlParams =
new URLSearchParams(
    window.location.search
);

const editingTaskId =
urlParams.get("edit");


//==================================================
// LOAD TASKS
//==================================================

async function loadTasks(){

    const user =
    auth.currentUser;

    if(!user){

        return;

    }


    const {
        data,
        error
    } = await supabase

        .from("tasks")

        .select("*")

        .eq(
            "user_id",
            user.uid
        );


    if(error){

        console.error(
            "Could not load tasks:",
            error
        );


        tasks = [];

        return;

    }


    tasks =
    (data || []).map(task => {

        const module =
        modules.find(
            m =>
            String(m.id) ===
            String(task.module_id)
        );


        return {

            ...task, 

            module:
String(task.type || "").toLowerCase() === "personal"
    ? "Personal"
    : (
        task.module_name ||
        module?.module_name ||
        "General"
    ),

            moduleColour:
            module?.colour ||
            "#3048C8",

            date:
            task.due_date,

            time:
            task.due_time

        };

    });

}


//==================================================
// LOAD MODULES
//==================================================

async function loadModules(){

    const user =
    auth.currentUser;

    if(!user){

        return;

    }


    if(taskModule){

        taskModule.innerHTML = `

            <option value="">
                Select Module
            </option>

            <option value="General">
                General Task
            </option>

        `;

    }


    const {
        data,
        error
    } = await supabase

        .from("modules")

        .select("*")

        .eq(
            "user_id",
            user.uid
        );


    if(error){

        console.error(
            "Could not load modules:",
            error
        );


        return;

    }


    modules =
    data || [];


    if(!taskModule){

        return;

    }


    modules.forEach(module => {

        const option =
        document.createElement("option");


        option.value =
        module.id;


        option.textContent =
        `${module.module_code} - ${module.module_name}`;


        taskModule.appendChild(
            option
        );

    });

}


//==================================================
// GET REMAINING TIME
//==================================================

function getRemainingTime(task){

    if(!task.date){

        return "No due date";

    }


    const due =
    new Date(
        `${task.date}T${task.time || "23:59"}`
    );


    const now =
    new Date();


    const difference =
    due - now;


    if(difference <= 0){

        return "Overdue";

    }


    const totalHours =
    Math.floor(
        difference /
        (1000 * 60 * 60)
    );


    const days =
    Math.floor(
        totalHours / 24
    );


    const hours =
    totalHours % 24;


    if(days > 0){

        return `Due in ${days} day${days !== 1 ? "s" : ""} • ${hours} hour${hours !== 1 ? "s" : ""}`;

    }


    return `Due in ${hours} hour${hours !== 1 ? "s" : ""}`;

}


//==================================================
// GET PRIORITY
//==================================================

function getPriority(task){

    if(!task.date){

        return "Low";

    }


    const today =
    new Date();


    today.setHours(
        0,
        0,
        0,
        0
    );


    const due =
    new Date(
        task.date
    );


    due.setHours(
        0,
        0,
        0,
        0
    );


    const difference =
    Math.floor(
        (due - today) /
        (1000 * 60 * 60 * 24)
    );


    if(difference <= 2){

        return "High";

    }


    if(difference <= 7){

        return "Medium";

    }


    return "Low";

}
//========================================
// PRIORITY TOAST NOTIFICATION
//========================================

function showPriorityToast(message, isPriority) {
    let toast = document.getElementById("priorityToast");

    if (!toast) {
        toast = document.createElement("div");
        toast.id = "priorityToast";
        toast.className = "priority-toast";

        document.body.appendChild(toast);
    }

    toast.innerHTML = `
    <span>${message}</span>
`;

    toast.classList.toggle("removed", !isPriority);

    toast.classList.remove("show");

    requestAnimationFrame(() => {
        toast.classList.add("show");
    });

    clearTimeout(toast.hideTimer);

    toast.hideTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}

function renderTasks(){
//========================================
if (!tasksLoaded) {
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

switch (currentFilter) {
    case "All":
        filteredTasks = filteredTasks.filter(task => !task.completed);
        break;

    case "Completed":
        filteredTasks = filteredTasks.filter(task => task.completed);
        break;

    case "Personal":
    filteredTasks = filteredTasks.filter(task =>
        String(task.type || "").toLowerCase() === "personal" &&
        !task.completed
    );
    break;

    case "Priority":
    case "Priorities":
    case "High Priority":
        filteredTasks = filteredTasks.filter(task =>
            (task.priority === true || task.priority === "true") &&
            !task.completed
        );
        break;

    case "Due Soon": {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const sevenDays = new Date(today);
        sevenDays.setDate(today.getDate() + 7);

        filteredTasks = filteredTasks.filter(task => {
            if (task.completed || !task.date) return false;

            const due = new Date(task.date);
            due.setHours(0, 0, 0, 0);

            return due >= today && due <= sevenDays;
        });
        break;
    }

    default:
        filteredTasks = filteredTasks.filter(task => !task.completed);
        break;
}
    //------------------------------------------
    // SORT TASKS
    //------------------------------------------

    filteredTasks.sort((a,b) => {

        if(
            a.completed !==
            b.completed
        ){

            return a.completed
                ? 1
                : -1;

        }


        if(!a.date){

            return 1;

        }


        if(!b.date){

            return -1;

        }


        return new Date(
            `${a.date}T${a.time || "23:59"}`
        )
        -
        new Date(
            `${b.date}T${b.time || "23:59"}`
        );

    });


    //------------------------------------------
    // EMPTY STATE
    //------------------------------------------

    if(
        filteredTasks.length === 0
    ){

        const title =
        emptyState.querySelector("h2");

        const text =
        emptyState.querySelector("p");


        switch(currentFilter){

            case "Completed":

                title.textContent =
                "No Completed Tasks";

                text.textContent =
                "Complete a task and it will appear here.";

                break;


            case "Due Soon":

                title.textContent =
                "Nothing Due Soon";

                text.textContent =
                "You're all caught up for the next 7 days.";

                break;


            case "Priority":

            case "High Priority":

                title.textContent =
                "No High Priority Tasks";

                text.textContent =
                "You don't have any high priority tasks right now.";

                break;


            default:

                title.textContent =
                "No Tasks Yet";

                text.textContent =
                "Create your first personal task to stay organised";

                break;

        }


        emptyState.style.display =
        "flex";


        taskList.style.display =
        "none";


        return;

    }


    emptyState.style.display =
    "none";


    taskList.style.display =
    "flex";


    //------------------------------------------
    // CREATE TASK CARDS
    //------------------------------------------

    filteredTasks.forEach(task => {

        const card =
        document.createElement("div");


        card.className =
        task.completed
            ? "task-card completed"
            : "task-card";


        //--------------------------------------
        // MODULE COLOUR
        //--------------------------------------

        card.style.setProperty(
            "--module-colour",
            task.moduleColour ||
            "#3048C8"
        );


        //--------------------------------------
        // DUE TEXT
        //--------------------------------------

        const dueText =
        getRemainingTime(task);


        const dueClass =
        dueText.startsWith("Overdue")
            ? "overdue"
            : "";


        //==================================================
        // CARD HTML
        //==================================================

        card.innerHTML = `

            <div class="task-card-content">

                <div class="task-main">

                    <div class="task-details">

                        <div class="task-title-row">
                           <h3>${task.title}</h3>

                                 <button
                                   type="button"
                                      class="task-priority-toggle ${task.priority === true || task.priority === "true" ? "active" : ""}"
                             aria-label="${task.priority === true || task.priority === "true" ? "Remove priority" : "Mark as priority"}"
                      aria-pressed="${task.priority === true || task.priority === "true"}"
                       title="${task.priority === true || task.priority === "true" ? "Remove priority" : "Mark as priority"}"
                         >
                      <i class="${task.priority === true || task.priority === "true" ? "fa-solid" : "fa-regular"} fa-star"></i>
                         </button>
                          </div>


                        <h4 class="task-module">
                            ${task.module}
                        </h4>


                        <p class="task-due ${dueClass}">

                            ${
                                task.completed
                                ? "Completed"
                                : dueText
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


                    <button
                        type="button"
                        class="task-more-btn"
                        aria-label="More options"
                    >
                        ⋮
                    </button>


                    <div class="task-menu">

                        <button
                            type="button"
                            class="task-menu-edit"
                        >
                            Edit task
                        </button>


                        <button
                            type="button"
                            class="task-menu-delete"
                        >
                            Delete task
                        </button>

                    </div>

                </div>

            </div>

        `;

      //--------------------------------------
// TOGGLE TASK PRIORITY
//--------------------------------------

const priorityButton = card.querySelector(".task-priority-toggle");

priorityButton.addEventListener("click", async (event) => {
    event.stopPropagation();

    const previousPriority =
        task.priority === true || task.priority === "true";

    const newPriority = !previousPriority;

    priorityButton.disabled = true;

    const { error } = await supabase
        .from("tasks")
        .update({
            priority: newPriority
        })
        .eq("id", task.id)
        .eq("user_id", auth.currentUser.uid);

    if (error) {
        console.error("Could not update task priority:", error);

        priorityButton.disabled = false;

        alert("Could not update priority. Please try again.");
        return;
    }

    //popup for marking and unmarking task as priority
    task.priority = newPriority;

showPriorityToast(
    newPriority
        ? " Priority added — this task is now a priority."
        : "Priority removed — this task is no longer prioritised."
);

await loadTasks();
renderTasks();
});
        //--------------------------------------
        // COMPLETE TASK
        //--------------------------------------

        const checkbox =
        card.querySelector(
            ".task-check"
        );


        checkbox.addEventListener(
            "click",
            async event => {

                event.stopPropagation();


                const newCompletedStatus =
                checkbox.checked;


                const {
                    error
                } = await supabase

                    .from("tasks")

                    .update({

                        completed:
                        newCompletedStatus

                    })

                    .eq(
                        "id",
                        task.id
                    )

                    .eq(
                        "user_id",
                        auth.currentUser.uid
                    );


                if(error){

                    console.error(
                        "Could not update task:",
                        error
                    );


                    checkbox.checked =
                    !newCompletedStatus;


                    return;

                }


                await loadTasks();

                renderTasks();

            }
        );


        //--------------------------------------
        // MORE BUTTON
        //--------------------------------------

        const moreButton =
        card.querySelector(
            ".task-more-btn"
        );


        const taskMenu =
        card.querySelector(
            ".task-menu"
        );


        moreButton.addEventListener(
            "click",
            event => {

                event.stopPropagation();


                document
                    .querySelectorAll(
                        ".task-menu.show"
                    )
                    .forEach(menu => {

                        if(menu !== taskMenu){

                            menu.classList.remove(
                                "show"
                            );

                        }

                    });


                taskMenu.classList.toggle(
                    "show"
                );

            }
        );


        //--------------------------------------
        // EDIT TASK
        //--------------------------------------

        const editButton =
        card.querySelector(
            ".task-menu-edit"
        );


        editButton.addEventListener(
            "click",
            event => {

                event.stopPropagation();


                taskMenu.classList.remove(
                    "show"
                );


                window.location.href =
                `21 addtask.html?edit=${task.id}`;

            }
        );


        //--------------------------------------
        // DELETE TASK
        //--------------------------------------

        const deleteButton =
        card.querySelector(
            ".task-menu-delete"
        );


        deleteButton.addEventListener(
            "click",
            async event => {

                event.stopPropagation();


                taskMenu.innerHTML = `

                    <div class="delete-confirmation">

                        <strong>
                            Delete this task?
                        </strong>

                        <span>
                            This cannot be undone.
                        </span>

                        <div class="delete-confirmation-actions">

                            <button
                                type="button"
                                class="cancel-delete"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                class="confirm-delete"
                            >
                                Delete
                            </button>

                        </div>

                    </div>

                `;


                const cancelDelete =
                taskMenu.querySelector(
                    ".cancel-delete"
                );


                const confirmDelete =
                taskMenu.querySelector(
                    ".confirm-delete"
                );


                cancelDelete.addEventListener(
                    "click",
                    event => {

                        event.stopPropagation();


                        taskMenu.classList.remove(
                            "show"
                        );


                        taskMenu.innerHTML = `

                            <button
                                type="button"
                                class="task-menu-edit"
                            >
                                Edit task
                            </button>

                            <button
                                type="button"
                                class="task-menu-delete"
                            >
                                Delete task
                            </button>

                        `;

                    }
                );


                confirmDelete.addEventListener(
                    "click",
                    async event => {

                        event.stopPropagation();


                        confirmDelete.disabled =
                        true;


                        confirmDelete.textContent =
                        "Deleting...";


                        await deleteTask(
                            task.id
                        );

                    }
                );

            }
        );


        //--------------------------------------
        // ADD CARD
        //--------------------------------------

        taskList.appendChild(
            card
        );

    });

}


//==================================================
// CLOSE MORE MENUS
//==================================================

document.addEventListener(
    "click",
    () => {

        document
            .querySelectorAll(
                ".task-menu.show"
            )
            .forEach(menu => {

                menu.classList.remove(
                    "show"
                );

            });

    }
);


//==================================================
// FILTER BUTTONS
//==================================================


if (filterButtons.length) {
    filterButtons.forEach(button => {
        button.addEventListener("click", () => {

            filterButtons.forEach(btn => {
                btn.classList.remove("active");
            });

            button.classList.add("active");

            currentFilter = button.textContent.trim();

            renderTasks();
        });
    });
}

//==================================================
// ADD TASK BUTTON
//==================================================

if(addTaskBtn){

    addTaskBtn.addEventListener(
        "click",
        event => {

            event.preventDefault();


            window.location.href =
            "21 addtask.html";

        }
    );

}


//==================================================
// AI BUTTON
//==================================================

if(aiButton){

    aiButton.addEventListener(
        "click",
        event => {

            event.preventDefault();


            alert(
                "AI Task Generation Coming Soon"
            );

        }
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


    //------------------------------------------
    // BASIC INFORMATION
    //------------------------------------------

    if(taskTitle){

        taskTitle.value =
        editingTask.title ||
        "";

    }


    if(taskModule){

        taskModule.value =
        editingTask.module_id ||
        "";

    }


    if(taskDate){

        taskDate.value =
        editingTask.due_date ||
        editingTask.date ||
        "";

    }


    if(taskTime){

        taskTime.value =
        editingTask.due_time ||
        editingTask.time ||
        "";

    }


    //------------------------------------------
    // REMINDER
    //------------------------------------------

    if(taskReminder){

        taskReminder.value =
        editingTask.reminder ||
        "None";

    }


    //------------------------------------------
    // REPEAT
    //------------------------------------------

    if(taskRepeat){

        taskRepeat.value =
        editingTask.repeat ||
        "Never";

    }
//------------------------------------------
    // COUNTDOWN
//------------------------------------------

    updateCountdownPreview();

}

// TASK TYPE BUTTONS

taskTypeButtons.forEach(button => {
    button.addEventListener("click", () => {

        selectedTaskType = button.dataset.type;

        taskTypeButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        if (moduleGroup) {
            moduleGroup.hidden = selectedTaskType !== "academic";
        }

        if (selectedTaskType === "personal" && taskModule) {
            taskModule.value = "";
        }
    });
});

//PRIORITY BADGE======================
if (priorityToggle && taskPriority) {
    priorityToggle.addEventListener("click", () => {
        const isPriority = taskPriority.value !== "true";

        taskPriority.value = String(isPriority);

        priorityToggle.classList.toggle("active", isPriority);
        priorityToggle.setAttribute("aria-pressed", String(isPriority));

        priorityToggle.innerHTML = isPriority
            ? '<i class="fa-solid fa-star"></i><span>Priority selected</span>'
            : '<i class="fa-regular fa-star"></i><span>Mark as priority</span>';
    });
}
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


    if(
        taskDate.value === ""
    ){

        countdownPreview.innerHTML =
        "No due date selected";

        return;

    }


    const due =
    new Date(
        `${taskDate.value}T${taskTime?.value || "23:59"}`
    );


    const now =
    new Date();


    const difference =
    due - now;


    if(
        difference <= 0
    ){

        countdownPreview.innerHTML =
        "Task is overdue";

        return;

    }


    const days =
    Math.floor(
        difference /
        (1000 * 60 * 60 * 24)
    );


    const hours =
    Math.floor(
        (
            difference %
            (1000 * 60 * 60 * 24)
        )
        /
        (1000 * 60 * 60)
    );


    countdownPreview.innerHTML =
    `Due in <strong>${days}</strong> days <strong>${hours}</strong> hours`;

}


//==================================================
// SAVE TASK
//==================================================

if(taskForm){

    taskForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            //------------------------------------------
            // USER
            //------------------------------------------

            const user =
            auth.currentUser;


            if(!user){

                alert(
                    "You must be logged in to save a task."
                );


                return;

            }


            //------------------------------------------
            // VALIDATION
            //------------------------------------------

            if(
                !taskTitle ||
                taskTitle.value.trim() === ""
            ){

                alert(
                    "Please enter an assessment name."
                );


                return;

            }

            


            //------------------------------------------
            // SELECTED MODULE
            //------------------------------------------

            const selectedModule = taskModule
            ? modules.find(
             module => String(module.id) === String(taskModule.value)
             )
             : null;


            //------------------------------------------
            // TASK TYPE
            //------------------------------------------

            let finalTaskType =
            selectedTaskType;


            if(
                selectedTaskType ===
                "Other" &&
                otherTaskType &&
                otherTaskType.value.trim() !== ""
            ){

                finalTaskType =
                otherTaskType.value.trim();

            }


            //------------------------------------------
            // PRIORITY
            //------------------------------------------
const priority = taskPriority?.value === "true";

            //------------------------------------------
            // TASK DATA
            //------------------------------------------

            const taskData = {
                

                user_id:
                user.uid,
                type: finalTaskType,
                


                module_id:
                selectedModule?.id ||
                null,


                 module_name:
    selectedModule
        ? `${selectedModule.module_code} - ${selectedModule.module_name}`
        : "General",

                title:
                taskTitle.value.trim(),


                due_date:
                taskDate?.value ||
                null,


                due_time:
                taskTime?.value ||
                null,


                priority:
                priority,


                completed:
                editingTask
                    ? editingTask.completed
                    : false

            };


            //------------------------------------------
            // UPDATE EXISTING TASK
            //------------------------------------------

            if(editingTask){

                const {
                    error
                } = await supabase

                    .from("tasks")

                    .update(taskData)

                    .eq(
                        "id",
                        editingTask.id
                    )

                    .eq(
                        "user_id",
                        user.uid
                    );


                if(error){

                    console.error(
                        "SUPABASE UPDATE ERROR:",
                        error
                    );


                    alert(
                        error.message
                    );


                    return;

                }

            }


            //------------------------------------------
            // CREATE NEW TASK
            //------------------------------------------

            else{

                const {
                    error
                } = await supabase

                    .from("tasks")

                    .insert([
                        taskData
                    ]);


                if(error){

                    console.error(
                        "SUPABASE INSERT ERROR:",
                        error
                    );


                    alert(
                        error.message
                    );


                    return;

                }

            }


            //------------------------------------------
            // RETURN TO TASKS
            //------------------------------------------

            window.location.href =
            "09 tasks.html";

        }
    );

}


//==================================================
// BACK BUTTON
//==================================================

if(backBtn){

    backBtn.addEventListener(
        "click",
        () => {

            window.location.href =
            "09 tasks.html";

        }
    );

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
// DELETE TASK
//==================================================

async function deleteTask(
    taskId
){

    const user =
    auth.currentUser;


    if(!user){

        alert(
            "You must be logged in."
        );


        return;

    }


    const {
        error
    } = await supabase

        .from("tasks")

        .delete()

        .eq(
            "id",
            taskId
        )

        .eq(
            "user_id",
            user.uid
        );


    if(error){

        console.error(
            "Could not delete task:",
            error
        );


        alert(
            error.message
        );


        return;

    }


    await loadTasks();

    renderTasks();

}


//==================================================
// CREATE OVERLAY
//==================================================

if(navAdd){

    navAdd.addEventListener(
        "click",
        event => {

            event.preventDefault();


            if(createOverlay){

                createOverlay.style.display =
                "flex";

            }

        }
    );

}


if(closeSheet){

    closeSheet.addEventListener(
        "click",
        () => {

            if(createOverlay){

                createOverlay.style.display =
                "none";

            }

        }
    );

}


if(createOverlay){

    createOverlay.addEventListener(
        "click",
        event => {

            if(
                event.target ===
                createOverlay
            ){

                createOverlay.style.display =
                "none";

            }

        }
    );

}


//==================================================
// NEW MODULE
//==================================================

if(newModule){

    newModule.addEventListener(
        "click",
        () => {

            window.location.href =
            "08 modules.html?newModule=true";

        }
    );

}


//==================================================
// NEW TASK
//==================================================

if(newTask){

    newTask.addEventListener(
        "click",
        () => {

            if(createOverlay){

                createOverlay.style.display =
                "none";

            }


            window.location.href =
            "21 addtask.html";

        }
    );

}


//==================================================
// NEW LECTURE
//==================================================

if(newLecture){

    newLecture.addEventListener(
        "click",
        () => {

            window.location.href =
            "21 addtask.html";

        }
    );

}


//==================================================
// NEW ASSESSMENT
//==================================================

if(newAssessment){

    newAssessment.addEventListener(
        "click",
        () => {

            alert(
                "Assessment page coming soon."
            );

        }
    );

}


//==================================================
// AUTH
//==================================================

auth.onAuthStateChanged(
    async user => {

        //------------------------------------------
        // NOT LOGGED IN
        //------------------------------------------

        if(!user){

            return;

        }


//------------------------------------------
// LOAD DATA
//------------------------------------------

    

tasksLoaded = false;

// Show loading screen before fetching data
if (taskList) {
    taskList.style.display = "none";
}

if (emptyState) {
    emptyState.style.display = "none";
}

let loadingState = document.getElementById("tasksLoading");

if (!loadingState && taskList?.parentElement) {
    loadingState = document.createElement("div");

    loadingState.id = "tasksLoading";
    loadingState.className = "tasks-loading";

    loadingState.innerHTML = `
        <div class="loading-spinner"></div>
        <p>Loading your tasks...</p>
        
    `;

    taskList.parentElement.appendChild(loadingState);
}

if (loadingState) {
    loadingState.style.display = "flex";
}

try {
    await loadModules();
    await loadTasks();
} catch (error) {
    console.error("Error loading task data:", error);
} finally {
    tasksLoaded = true;

    if (loadingState) {
        loadingState.style.display = "none";
    }

    if (taskList) {
        taskList.style.display = "";
    }

    if (emptyState) {
        emptyState.style.display = "";
    }
}


        //------------------------------------------
        // EDITING
        //------------------------------------------

        if(editingTaskId){

            editingTask =
            tasks.find(
                task =>
                String(task.id) ===
                String(editingTaskId)
            );


            if(editingTask){

                loadTaskIntoForm();

            }

        }


        //------------------------------------------
        // RENDER TASKS
        //------------------------------------------

        if(taskList){

            renderTasks();

        }

    }
);


//==================================================
// REFRESH TASKS
//==================================================

window.addEventListener(
    "focus",
    async () => {

        if(!auth.currentUser){

            return;

        }


        tasksLoaded = false;

        await loadTasks();

        tasksLoaded = true;

        renderTasks();
    }
);


//==================================================
// INITIALISE
//==================================================

window.addEventListener(
    "DOMContentLoaded",
    () => {

        if(taskForm){

            updateCountdownPreview();

        }

    }
);