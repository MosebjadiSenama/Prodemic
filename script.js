import { auth } from "./firebase.js";

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
// Splash screen loading bar

if(window.location.pathname.includes("01 index.html")){
setTimeout(() =>{
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

    window.location.href = "home.html";

})

.catch((error) => {

    alert(error.message);

});
    });

}