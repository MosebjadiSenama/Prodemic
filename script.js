import { auth } from "./firebase.js";

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";




//================ Splash Screen =================

if (document.querySelector(".splash-screen")) {

    setTimeout(() => {

        window.location.href = "02 onboarding.html";

    }, 3000);

}
//=========================================================================ONBOARDING SCREENS=======================================================================

const screens = [

    {
        image: "assets/images/1.png",
        welcome: "Welcome to",
        title: "Prodemic",
        description: "Your all-in-one space to study smarter, stay organised, and get more done with AI",
    },

    {

      image: "assets/images/2.png",
        welcome: "",
        title: "Stay on top of deadlines",
        description: "Track assignments, tests and submissions",
      
    },

    {

      image: "assets/images/3.png",
        welcome: "",
        title: "All-in one student ecosystem",
        description: "Plan your study time, build better habits, and manage everything — all in one place.",
      
    },
];

let currentScreen = 0;


function updateScreen(){

    document.getElementById("onboarding-img").src =
     screens[currentScreen].image;
     

     document.getElementById("welcome-to"). textContent = 
      screens[currentScreen].welcome;

     document.getElementById("title"). textContent = 
      screens[currentScreen].title;


     document.getElementById("description"). textContent = 
      screens[currentScreen].description;

    const nextBtn = 
    document.querySelector(".next-btn");

     const skipBtn = 
    document.querySelector(".skip-btn");

    


    if(currentScreen === screens.length -1){
        nextBtn.textContent = " Get Started";

        nextBtn.classList.add("get-started-btn");


        skipBtn.style.display = "none";
    }

    else{
        nextBtn.innerHTML = "Next &#x276F";
        nextBtn.classList.remove("get-started-btn");

        skipBtn.style.display= "block";
    }


    const buttonContainer =
    document.querySelector(".onboarding-buttons");

    if(currentScreen === screens.length -1){
        buttonContainer.style.justifyContent = "center";
    }

    else{
        buttonContainer.style.justifyContent = "space-between"
    }
   
}


//===================================================================NEXT BUTTON==================================

const nextBtn = 
document.querySelector(".next-btn");

if(nextBtn){

    if(document.getElementById("onboarding-img")){
        updateScreen();
    }

    nextBtn.addEventListener("click", () => {

        currentScreen++;

        if(currentScreen < screens.length){
            updateScreen();
        }

        else{
            window.location.href = "03 Authentication.html";
        }

    });

}

 



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

 createUserWithEmailAndPassword(auth, email, password)
.then((userCredential) => {

    alert("Account created successfully!");

    window.location.href = "03 Authentication.html";

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




//================================================ MODULE FILTER BUTTONS ================================================

const filterButtons = document.querySelectorAll(".filter-btn");

filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        // Remove active from all buttons
        filterButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        // Add active to clicked button
        button.classList.add("active");

        // Which filter was selected?
        const filter = button.dataset.filter;

        console.log(filter);

        // We'll filter the module cards here later

    });

});