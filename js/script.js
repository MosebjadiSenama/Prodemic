import { auth } from "../firebase.js";

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
    sendEmailVerification,
    sendPasswordResetEmail
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";



//================ Splash Screen =================

if (document.querySelector(".splash-screen")) {

    setTimeout(() => {

        window.location.href = "03 Authentication.html";

    }, 2000);

}

//================ Splash Screen =================

if(document.querySelector(".splash-screen")){

    setTimeout(()=>{

        window.location.href="03 Authentication.html";

    },2000);

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

const params = new URLSearchParams(window.location.search);

if (signinSection && welcomeSection) {

    if (params.get("signin") === "true") {

        welcomeSection.style.display = "none";
        signinSection.style.display = "block";

    } else {

        welcomeSection.style.display = "block";
        signinSection.style.display = "none";

    }

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
//===== AUTHENTICATION 

createUserWithEmailAndPassword(auth, email, password)

.then(async (userCredential) => {

    await updateProfile(userCredential.user, {

        displayName: name

    });

 await sendEmailVerification(userCredential.user);

// Sign the user out immediately
await auth.signOut();

alert(
    "Account created successfully!\n\nA verification email has been sent to your inbox.\n\nPlease verify your email before logging in."
);

// Go back to the login page
window.location.href = "03 Authentication.html?signin=true";

})

.catch((error) => {

    switch (error.code) {

    case "auth/email-already-in-use":
        errorMessage.textContent =
        "An account with this email already exists.";
        break;

    case "auth/invalid-email":
        errorMessage.textContent =
        "Please enter a valid email address.";
        break;

    case "auth/weak-password":
        errorMessage.textContent =
        "Password is too weak.";
        break;

    default:
        errorMessage.textContent =
        "Something went wrong. Please try again.";
}

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

        sendPasswordResetEmail(auth, email)
            .then(() => {
                alert(
"Password reset email sent.\n\nPlease check your inbox and spam folder."
);
            })
           .catch((err) => {

    switch (err.code) {

        case "auth/user-not-found":
            error.textContent = "No account found with this email.";
            break;

        case "auth/invalid-email":
            error.textContent = "Please enter a valid email.";
            break;

        default:
            error.textContent = "Unable to send reset email.";
    }

});
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

//====user verifies email

.then(async (userCredential) => {

    await userCredential.user.reload();

    if (!userCredential.user.emailVerified) {

        alert("Please verify your email before logging in.");

        await auth.signOut();

        return;
    }

    alert("Login successful!");

    window.location.href = "07 home.html";

})

//=====

.catch((error) => {

    switch (error.code) {

        case "auth/invalid-credential":
            alert("Incorrect email or password.");
            break;

        case "auth/user-not-found":
            alert("No account found with this email.");
            break;

        case "auth/too-many-requests":
            alert("Too many failed attempts. Please try again later.");
            break;

        default:
            alert("Unable to sign in. Please try again.");
    }

});
    });

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