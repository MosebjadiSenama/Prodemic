//================================================================================   FIREBASE ===============================================================================================
 import { auth } from "../firebase.js";







//================================================================================   GREETINGS ===============================================================================================
const greetingText = document.getElementById("greetingText");
const userName = document.getElementById("userName");

//display name

auth.onAuthStateChanged((user)=>{

    if(!user) return;

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

});
//==========


function updateGreeting(){

    const hour = new Date().getHours();

    let greeting = "";

    if(hour < 12){

        greeting = "Good Morning,";

    }
    else if(hour < 18){

        greeting = "Good Afternoon,";

    }
    else{

        greeting = "Good Evening,";

    }

    greetingText.textContent = greeting;

}

//=======
updateGreeting();

//================================================================================   OPEN MENU===============================================================================================

const profileBtn = document.getElementById("profileBtn");
const profileMenu = document.getElementById("profileMenu");

profileBtn.addEventListener("click", function(e){

    e.stopPropagation();

    profileMenu.classList.toggle("show");

});


//================================================================================   CLOSE MENU===============================================================================================

document.addEventListener("click", function(){

    profileMenu.classList.remove("show");

});


//================================================================================   PREVENT MENU FROM CLOSING WHEN CLICKING MENU===============================================================================================

profileMenu.addEventListener("click", function(e){

    e.stopPropagation();

});


//================================================================================   LOGOUT===============================================================================================
const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", function(){

    localStorage.removeItem("currentUser");

    window.location.href=" 03 Authentication.html";

});


//================================================================================  GREETING===============================================================================================

const greeting = document.getElementById("greetingText");

const hour = new Date().getHours();

if(hour < 12){

    greeting.textContent = "Good Morning";

}

else if(hour < 18){

    greeting.textContent = "Good Afternoon";

}

else{

    greeting.textContent = "Good Evening";

}

//==========================================================================home cards==========================
const lectureBtn = document.getElementById("lectureBtn");

lectureBtn.addEventListener("click", () => {

    window.location.href = "08 timetable.html";

});




