//==================================================
// FIREBASE
//==================================================

import { auth, db } from "../firebase.js";

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

const greetingText = document.getElementById("greetingText");

const profileBtn = document.getElementById("profileBtn");
const profileMenu = document.getElementById("profileMenu");
const logoutBtn = document.getElementById("logoutBtn");

const setupSection = document.getElementById("setupSection");
const lectureSection = document.getElementById("lectureSection");

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

        window.location.href =
        "03 Authentication.html";

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

    if(snapshot.empty){

        setupSection.style.display = "block";

        lectureSection.style.display = "none";

    }

    //------------------------------------------
    // Modules Exist
    //------------------------------------------

    else{

        setupSection.style.display = "none";

        lectureSection.style.display = "block";

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