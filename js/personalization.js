//==================================================
// STEP ELEMENTS
//==================================================

const step1 = document.getElementById("step1");
const step2 = document.getElementById("step2");

const step1Next = document.getElementById("step1Next");
const step2Back = document.getElementById("step2Back");
const step2Next = document.getElementById("step2Next");


//==================================================
// STEP 1
//==================================================

step1Next.addEventListener("click", () => {

    const goal = document.querySelector(
        'input[name="goal"]:checked'
    );

    if(!goal){

        alert("Please choose a goal.");

        return;

    }

    localStorage.setItem("goal", goal.value);

    step1.classList.remove("active");

    step2.classList.add("active");

});


//==================================================
// STEP 2 BACK
//==================================================

step2Back.addEventListener("click", () => {

    step2.classList.remove("active");

    step1.classList.add("active");

});


//==================================================
// STEP 2 NEXT
//==================================================

step2Next.addEventListener("click", () => {

    const time = document.querySelector(
        'input[name="studyTime"]:checked'
    );

    if(!time){

        alert("Please choose a study time.");

        return;

    }

    localStorage.setItem("studyTime", time.value);

   step2Next.addEventListener("click", () => {

    const selectedTime =
    document.querySelector('input[name="studyTime"]:checked');

    if(!selectedTime){

        alert("Please select your preferred study time.");

        return;

    }

    localStorage.setItem(

        "studyTime",

        selectedTime.value

    );

    document
    .getElementById("step2")
    .classList.remove("active");

    document
    .getElementById("step3")
    .classList.add("active");

});

});


/*===============================================================================================================================================================================
                                                                                    STEP 3
==================================================================================================================================================================================*/


const studyHours =
document.getElementById("studyHours");

const hourValue =
document.getElementById("hourValue");

const step3Back =
document.getElementById("step3Back");

const step3Next =
document.getElementById("step3Next");

studyHours.addEventListener("input",()=>{

    hourValue.innerHTML =
    studyHours.value + " Hours";

});

step3Back.addEventListener("click",()=>{

    step3.classList.remove("active");

    step2.classList.add("active");

});

step3Next.addEventListener("click",()=>{

    localStorage.setItem(

        "studyHours",

        studyHours.value

    );

    step3.classList.remove("active");

    step4.classList.add("active");

});



/*===============================================================================================================================================================================
                                                                                    STEP 4
==================================================================================================================================================================================*/


const finishBtn =
document.getElementById("finishBtn");

finishBtn.addEventListener("click",()=>{

    window.location.href =
    "07 home.html";

});