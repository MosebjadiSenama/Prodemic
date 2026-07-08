import { auth } from "../firebase.js";

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";




//================ Splash Screen =================

if (document.querySelector(".splash-screen")) {

    setTimeout(() => {

        window.location.href = "03 Authentication.html";

    }, 3000);

}

//================ Splash Screen =================

if(document.querySelector(".splash-screen")){

    setTimeout(()=>{

        window.location.href="03 Authentication.html";

    },3000);

}


//=====================================================
// GET STARTED BUTTON
//=====================================================

const getStartedBtn =
document.getElementById("getStartedBtn");

const welcomeSection =
document.getElementById("welcomeSection");

const signinSection =
document.getElementById("signinSection");

if(signinSection){

    signinSection.style.display = "none";

}

if(getStartedBtn){

    getStartedBtn.addEventListener("click",()=>{

        welcomeSection.style.display = "none";

        signinSection.style.display = "block";

    });

}


//===============================================FORM VALIDATION==============================================
//===============================================FORM VALIDATION==============================================

const createAccountBtn = 
document.querySelector(".create-account-btn2");

if(createAccountBtn){

    createAccountBtn.addEventListener("click", () => {

        const name =
        document.getElementById("name").value.trim();

        const email =
        document.getElementById("email").value.trim();

        const password =
        document.getElementById("enter-password").value.trim();

        const confirmPassword =
        document.getElementById("confirm-password").value.trim();

        const errorMessage =
        document.getElementById("error-message");






        


//Name validation====================================================================

        if (name === ""){
            errorMessage.textContent = 
             "Please enter your name";
             return;
}

//email validation=========================================================================

 
if(email === ""){
    errorMessage.textContent = "Please enter your email";
    return;
}

// email@===============================================================


  if (!email.includes("@") || !email.includes(".")){
            errorMessage.textContent = 
        "Please enter a valid email address";
             return;
    }

    if(password.length < 8){
        errorMessage.textContent = 
        "Password must be at least 8 characters";
         return;

    }

//passsword length =================================================================
  if (password !== confirmPassword){
    errorMessage.textContent =
    "Passwords do not match";
    return;

  }

  errorMessage.textContent = "";
//=====
createUserWithEmailAndPassword(auth, email, password)

.then(async (userCredential) => {

    await updateProfile(userCredential.user, {
        displayName: name
    });

    alert("Account created successfully!");

   //=====================================================
// NEW USER
//=====================================================

window.location.href = "04 Personalisation.html";

})

.catch((error) => {

    errorMessage.textContent = error.message;

});

    });

}

//reset password=============================

const resetBtn =
document.querySelector(".send-reset");

if(resetBtn){
    resetBtn.addEventListener("click", () => {

        const email =
        document.getElementById("email").value.trim();

        const error =
        document.getElementById("reset-error");

       if(email === ""){
    error.textContent = "Please enter your email";
    return;
}

        if(!email.includes("@") || !email.includes(".")){
            error.textContent =
            "Please enter a valid email address.";
            return;
        }

        error.textContent = "";

        alert("Password reset link sent!");
    });
}

//sign ip

const signInBtn =
document.querySelector(".signin-btn");

if(signInBtn){

    signInBtn.addEventListener("click", () => {

        const email =
        document.getElementById("email").value.trim();

        const password =
        document.getElementById("enter-password").value.trim();

        if(email === ""){
            alert("Please enter your email");
            return;
        }

        if(!email.includes("@") || !email.includes(".")){
            alert("Please enter a valid email address");
            return;
        }

        if(password === ""){
            alert("Please enter your password");
            return;
        }

        signInWithEmailAndPassword(auth, email, password)

.then((userCredential) => {

    alert("Login successful!");

    window.location.href = "07 home.html";

})

.catch((error) => {

    alert(error.message);

});
    });

}






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

        button.innerHTML = `
            <span>
                ${day.toLocaleDateString("en",{
                    weekday:"short"
                }).toUpperCase()}
            </span>

            <strong>${day.getDate()}</strong>
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

    const dayView = document.createElement("div");

    dayView.classList.add("day-view");

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

                <div class="time-slot">

                    <span class="time">
                        ${String(hour).padStart(2,"0")}:00
                    </span>

                    <div class="line"></div>

                </div>

            `).join("")}

        </div>

    `;

    calendar.appendChild(dayView);

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

        day.textContent=i;

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

if (view) {

    view.addEventListener("change", () => {

        if (view.value === "day") {
            renderDay();
        }

        if (view.value === "week") {
            renderWeek();
        }

        if (view.value === "month") {
            renderMonth();
        }

    });

}

//=====================previous button===================================


if (calendarPrevBtn && view) {

    calendarPrevBtn.onclick = () => {

        if(view.value==="day")
            currentDate.setDate(currentDate.getDate()-1);

        if(view.value==="week")
            currentDate.setDate(currentDate.getDate()-7);

        if(view.value==="month")
            currentDate.setMonth(currentDate.getMonth()-1);

        updateCalendar();

    };

}

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

}



//===================================================================================================================================================
// NAV BAR ADD BUTTON OVERLAY
//===================================================================================================================================================

const navAdd = document.querySelector(".nav-add");
const createOverlay = document.getElementById("createOverlay");
const closeSheet = document.getElementById("closeSheet");

if(navAdd && createOverlay){

    navAdd.addEventListener("click",(e)=>{

        e.preventDefault();

        createOverlay.style.display="flex";

    });

}

if(closeSheet){

    closeSheet.addEventListener("click",()=>{

        createOverlay.style.display="none";

    });

}

if(createOverlay){

    createOverlay.addEventListener("click",(e)=>{

        if(e.target===createOverlay){

            createOverlay.style.display="none";

        }

    });

}


//=========================================IF ON CERTAIN PAGE============================

const newModule = document.getElementById("newModule");

if(newModule){

    newModule.addEventListener("click",()=>{

        window.location.href = "08%20modules.html";

    });

}