import { auth, db } from "../firebase.js";
import { supabase } from "./supabase.js";
//==================================================
// FIREBASE
//==================================================;

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
const logoutBtn = document.getElementById("logoutBtn");

const setupSection = document.getElementById("setupSection");
const lectureSection = document.getElementById("lectureSection");

const addModuleBtn = document.getElementById("addModuleBtn");
const importModuleBtn = document.getElementById("importModuleBtn");

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
    `${greeting}, ${user.displayName} 👋`;

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

if(logoutBtn){

    logoutBtn.addEventListener("click",async()=>{

        await signOut(auth);

       window.location.href = "03 Authentication.html?signin=true";

    });

}

//==================================================
// HOME ONBOARDING
//==================================================

async function loadHome(uid){

    if(!setupSection || !lectureSection){

        return;

    }

    const snapshot = await getDocs(

        collection(

            db,

            "users",

            uid,

            "modules"

        )

    );

    //------------------------------------------
    // No Modules
    //------------------------------------------

   async function loadHome(uid){

    const snapshot = await getDocs(

        collection(

            db,

            "users",

            uid,

            "modules"

        )

    );

    if(snapshot.empty){

        return;

    }

}

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

menuBtn.addEventListener("click", () => {

    navBar.classList.toggle("open");

    homeContent.classList.toggle("shift");

});


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