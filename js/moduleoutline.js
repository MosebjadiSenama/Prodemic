import ModuleParser from "./moduleParser.js";
import { auth } from "../firebase.js";
import { supabase } from "./supabase.js";

//==================================================
// STATE
//==================================================

let currentUser = null;

let parsedModule = null;

let parser = null;

//==================================================
// ELEMENTS
//==================================================

const stepOne =
document.getElementById("stepOne");

const stepTwo =
document.getElementById("stepTwo");

const outlineInput =
document.getElementById("outlineInput");

const analyseBtn =
document.getElementById("analyseBtn");

const backBtn =
document.getElementById("backBtn");

const generateBtn =
document.getElementById("generateBtn");

const moduleName =
document.getElementById("moduleName");

const moduleCode =
document.getElementById("moduleCode");

const semester =
document.getElementById("semester");

const weekCount =
document.getElementById("weekCount");

const topicCount =
document.getElementById("topicCount");

const assessmentCount =
document.getElementById("assessmentCount");

const topicsContainer =
document.getElementById("topicsContainer");

const assessmentContainer =
document.getElementById("assessmentContainer");

//==================================================
// AUTH
//==================================================

auth.onAuthStateChanged(user=>{

    if(!user){

        window.location.href="login.html";

        return;

    }

    currentUser=user;

});

//==================================================
// EVENTS
//==================================================

analyseBtn.addEventListener(

    "click",

    analyseOutline

);

backBtn.addEventListener(

    "click",

    ()=>{

        stepTwo.classList.add("hidden");

        stepOne.classList.remove("hidden");

    }

);

//==================================================
// ANALYSE OUTLINE
//==================================================

function analyseOutline(){

    const text=

        outlineInput.value.trim();

    if(!text){

        alert("Paste a module outline.");

        return;

    }

    parser=

        new ModuleParser(text);

    parsedModule=

        parser.parse();

    console.log(parsedModule);

    showReview();

}

//==================================================
// REVIEW
//==================================================

function showReview(){

    //----------------------------------------
    // SUMMARY
    //----------------------------------------

    moduleName.textContent =
    parsedModule.moduleName;

    moduleCode.textContent =
    parsedModule.moduleCode;

    semester.textContent =
    parsedModule.semester;

    weekCount.textContent =
    parsedModule.weeks.length;

    topicCount.textContent =
    parsedModule.topics.length;

    assessmentCount.textContent =
    parsedModule.assessments.length;

    //----------------------------------------
    // TOPICS
    //----------------------------------------

    topicsContainer.innerHTML = "";

    parsedModule.topics.forEach(topic=>{

        const card =
        document.createElement("div");

        card.className =
        "topic-card";

        card.innerHTML = `

<div class="topic-header">

    <span>

        Week ${topic.week}

    </span>

    <span>

        ${topic.day || "No Day"}

    </span>

</div>

<div class="topic-title">

    ${topic.topic}

</div>

<div class="topic-dates">

    ${topic.startDate}

    -

    ${topic.endDate}

</div>

`;

        topicsContainer.appendChild(card);

    });

    //----------------------------------------
    // ASSESSMENTS
    //----------------------------------------

    assessmentContainer.innerHTML = "";

    parsedModule.assessments.forEach(item=>{

        const card =
        document.createElement("div");

        card.className =
        "assessment-card";

        card.innerHTML = `

<div class="assessment-title">

    ${item.title}

</div>

<div>

    ${item.weighting || ""}

</div>

<div>

    ${item.dueDate || "No due date"}

</div>

`;

        assessmentContainer.appendChild(card);

    });

    //----------------------------------------
    // SHOW REVIEW
    //----------------------------------------

    stepOne.classList.add("hidden");

    stepTwo.classList.remove("hidden");

}

//==================================================
// GENERATE PLANNER
//==================================================

generateBtn.addEventListener(

    "click",

    generatePlanner

);

async function generatePlanner(){

    try{

        generateBtn.disabled = true;

        generateBtn.textContent = "Generating...";

    const params = new URLSearchParams(window.location.search);

const moduleId = Number(params.get("id"));

        //--------------------------------------------------
        // UPDATE MODULE
        //--------------------------------------------------

        const { error:updateError } =
        await supabase

            .from("modules")

            .update({

                module_name:
                parsedModule.moduleName,

                module_code:
                parsedModule.moduleCode,

                semester:
                parsedModule.semester

            })

            .eq("id",moduleId);

        if(updateError){

            throw updateError;

        }

        //--------------------------------------------------
        // DELETE OLD WEEKLY TOPICS
        //--------------------------------------------------

        const { error:deleteTopicsError } =
        await supabase

            .from("weekly_topics")

            .delete()

            .eq("module_id",moduleId);

        if(deleteTopicsError){

            throw deleteTopicsError;

        }

        //--------------------------------------------------
        // DELETE OLD TASKS
        //--------------------------------------------------

        const { error:deleteTasksError } =
        await supabase

            .from("tasks")

            .delete()

            .eq("module_id",moduleId);

        if(deleteTasksError){

            throw deleteTasksError;

        }

        //--------------------------------------------------
        // DELETE OLD ASSESSMENTS
        //--------------------------------------------------

        const { error:deleteAssessmentError } =
        await supabase

            .from("assessments")

            .delete()

            .eq("module_id",moduleId);

        if(deleteAssessmentError){

            throw deleteAssessmentError;

        }

                //--------------------------------------------------
        // INSERT WEEKLY TOPICS
        //--------------------------------------------------

        const weeklyTopics = parsedModule.topics.map(topic => ({

            user_id: currentUser.uid,

            module_id: moduleId,

            week: topic.week,

            day: topic.day || "",

            topic: topic.topic,

            completed: false,

            start_date: formatDate(topic.startDate),

            end_date: formatDate(topic.endDate)

        }));

        if(weeklyTopics.length){

            const { error: weeklyError } =
            await supabase

                .from("weekly_topics")

                .insert(weeklyTopics);

            if(weeklyError){

                throw weeklyError;

            }

        }

                //--------------------------------------------------
        // INSERT ASSESSMENTS
        //--------------------------------------------------

        const assessments = parsedModule.assessments.map(item => ({

            user_id: currentUser.uid,

            module_id: moduleId,

            title: item.title,

            weight: item.weighting,

            due_date: formatDate(item.dueDate),

            completed: false

        }));

        if(assessments.length){

            const { error: assessmentError } =
            await supabase

                .from("assessments")

                .insert(assessments);

            if(assessmentError){

                throw assessmentError;

            }

        }

        //--------------------------------------------------
        // INSERT TASKS
        //--------------------------------------------------

        const tasks = parsedModule.assessments.map(item => ({

            user_id: currentUser.uid,

            module_id: moduleId,

            module_name: parsedModule.moduleName,

            title: item.title,

            description: item.description,

            due_date: formatDate(item.dueDate),

            due_time: null,

            priority: "High",

            completed: false

        }));

        if(tasks.length){

            const { error: taskError } =
            await supabase

                .from("tasks")

                .insert(tasks);

            if(taskError){

                throw taskError;

            }

        }

        //--------------------------------------------------
        // DONE
        //--------------------------------------------------

        alert("Planner generated successfully.");

        window.location.href = "11 schedule.html";

    }

    catch(error){

        console.error(error);

        alert(error.message);

    }

    finally{

        generateBtn.disabled = false;

        generateBtn.textContent = "Generate Planner";

    }

}

//==================================================
// HELPERS
//==================================================

function formatDate(dateString){

    if(!dateString) return null;

    const months = {

        January:0,
        February:1,
        March:2,
        April:3,
        May:4,
        June:5,
        July:6,
        August:7,
        September:8,
        October:9,
        November:10,
        December:11,

        Jan:0,
        Feb:1,
        Mar:2,
        Apr:3,
        Jun:5,
        Jul:6,
        Aug:7,
        Sep:8,
        Oct:9,
        Nov:10,
        Dec:11

    };

    const parts = dateString
        .trim()
        .split(/\s+/);

    //--------------------------------------------------
    // 12 March 2026
    //--------------------------------------------------

    if(parts.length === 3){

        const day = Number(parts[0]);

        const month = months[parts[1]];

        const year = Number(parts[2]);

        if(month === undefined) return null;

        return new Date(

            year,

            month,

            day

        ).toISOString().split("T")[0];

    }

    //--------------------------------------------------
    // 12 March
    //--------------------------------------------------

    if(parts.length === 2){

        const day = Number(parts[0]);

        const month = months[parts[1]];

        if(month === undefined) return null;

        return new Date(

            2026,

            month,

            day

        ).toISOString().split("T")[0];

    }

    return null;

}

function showError(message){

    console.error(message);

    alert(message);

}

function showSuccess(message){

    console.log(message);

    alert(message);

}

