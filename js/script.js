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

        window.location.href = "02 onboarding.html";

    }, 1500);

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




/*==================================================
 signup page
==================================================*/

const createAccountBtn = document.querySelector(".create-account-btn2");

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("enter-password");
const confirmPasswordInput = document.getElementById("confirm-password");

const signupStatus = document.getElementById("signup-status");

const signupErrorIds = {
    name: "name-error",
    email: "email-error",
    "enter-password": "password-error",
    "confirm-password": "confirm-password-error"
};

// SHOW FIELD ERROR
function showFieldError(field, message) {

    const input = document.getElementById(field);
    const error = document.getElementById(signupErrorIds[field]);

    if (!input || !error) return;

    error.textContent = message;
    error.classList.add("show");

    input.classList.add("input-error");
    input.setAttribute("aria-invalid", "true");
}

// CLEAR FIELD ERROR
function clearFieldError(field) {

    const input = document.getElementById(field);
    const error = document.getElementById(signupErrorIds[field]);

    if (!input || !error) return;

    error.textContent = "";
    error.classList.remove("show");

    input.classList.remove("input-error");
    input.removeAttribute("aria-invalid");
}

// CLEAR ALL REGISTRATION ERRORS
function clearAllSignupErrors() {

    Object.keys(signupErrorIds).forEach(clearFieldError);

    if (signupStatus) {
        signupStatus.textContent = "";
        signupStatus.classList.remove("show", "success");
    }
}

// CLEAR ERRORS WHEN TYPING
[
    nameInput,
    emailInput,
    passwordInput,
    confirmPasswordInput
].forEach(input => {

    if (!input) return;

    input.addEventListener("input", () => {

        clearFieldError(input.id);

        if (signupStatus) {
            signupStatus.textContent = "";
            signupStatus.classList.remove("show", "success");
        }

        if (
            input.id === "enter-password" ||
            input.id === "confirm-password"
        ) {
            clearFieldError("confirm-password");
        }
    });
});

// CREATE ACCOUNT
if (createAccountBtn) {

    createAccountBtn.addEventListener("click", async () => {

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        clearAllSignupErrors();

        // NAME VALIDATION
        if (name === "") {
            showFieldError("name", "Please enter your name.");
            nameInput.focus();
            return;
        }

        // EMAIL VALIDATION
        if (email === "") {
            showFieldError("email", "Please enter your email address.");
            emailInput.focus();
            return;
        }

        // EMAIL FORMAT VALIDATION
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {
            showFieldError("email", "Please enter a valid email address.");
            emailInput.focus();
            return;
        }

        // PASSWORD LENGTH VALIDATION
        if (password.length < 8) {
            showFieldError(
                "enter-password",
                "Your password must be at least 8 characters."
            );
            passwordInput.focus();
            return;
        }

        // CONFIRM PASSWORD VALIDATION
        if (password !== confirmPassword) {
            showFieldError(
                "confirm-password",
                "Passwords don't match. Please try again."
            );
            confirmPasswordInput.focus();
            return;
        }

        // PREVENT MULTIPLE SUBMISSIONS
        createAccountBtn.disabled = true;
        createAccountBtn.textContent = "Creating account...";

        try {

            // CREATE FIREBASE ACCOUNT
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

            // SAVE USER NAME
            await updateProfile(userCredential.user, {
                displayName: name
            });

            // SEND VERIFICATION EMAIL
            await sendEmailVerification(userCredential.user);

            // SIGN OUT UNTIL EMAIL IS VERIFIED
            await auth.signOut();

        

// SHOW ACCOUNT CREATED POPUP
showPopup(
    "Account created successfully!",
    "Your account has been created. A verification email has been sent to your inbox/spam. Please verify your email before signing in.",
    () => {
        window.location.href = "03 Authentication.html?signin=true";
    }
);

        } catch (error) {

            // FIREBASE ERRORS - INLINE ONLY
            switch (error.code) {

                case "auth/email-already-in-use":
                    showFieldError(
                        "email",
                        "This email address is already registered."
                    );
                    emailInput.focus();
                    break;

                case "auth/invalid-email":
                    showFieldError(
                        "email",
                        "Please enter a valid email address."
                    );
                    emailInput.focus();
                    break;

                case "auth/weak-password":
                    showFieldError(
                        "enter-password",
                        "Your password is too weak. Please choose a stronger password."
                    );
                    passwordInput.focus();
                    break;

                default:
                    signupStatus.textContent =
                        "Something went wrong. Please try again.";

                    signupStatus.classList.add("show");
            }

            createAccountBtn.disabled = false;
            createAccountBtn.textContent = "Create Account";
        }

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


// login loading effect
function showLoginLoading() {
    const loadingOverlay = document.createElement("div");

    loadingOverlay.className = "login-loading-overlay";

    loadingOverlay.innerHTML = `
        <div class="login-loading-card">
            <div class="login-spinner"></div>
            <h2>Signing you in</h2>
            <p>Getting your workspace ready...</p>
        </div>
    `;

    document.body.appendChild(loadingOverlay);
}
//sign in

// sign in

const signInBtn = document.querySelector(".signin-btn");

if (signInBtn) {
    signInBtn.addEventListener("click", () => {

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("enter-password").value.trim();
        const errorMessage = document.getElementById("signin-error");

        errorMessage.textContent = "";

        if (email === "") {
            errorMessage.textContent = "Please enter your email address.";
            return;
        }

        if (!email.includes("@") || !email.includes(".")) {
            errorMessage.textContent = "Please enter a valid email address.";
            return;
        }

        if (password === "") {
            errorMessage.textContent = "Please enter your password.";
            return;
        }

        signInWithEmailAndPassword(auth, email, password)

            .then(async (userCredential) => {

                await userCredential.user.reload();

                if (!userCredential.user.emailVerified) {
                    errorMessage.textContent = "Please verify your email before logging in.";
                    await auth.signOut();
                    return;
                }

                showLoginLoading();

                setTimeout(() => {
                    window.location.href = "07 home.html";
                }, 1500);

            })

            .catch((error) => {

                switch (error.code) {

                    case "auth/invalid-credential":
                    case "auth/user-not-found":
                    case "auth/wrong-password":
                        errorMessage.textContent = "Incorrect email or password. Please try again.";
                        break;

                    case "auth/too-many-requests":
                        errorMessage.textContent = "Too many attempts. Please try again later.";
                        break;

                    case "auth/invalid-email":
                        errorMessage.textContent = "Please enter a valid email address.";
                        break;

                    default:
                        errorMessage.textContent = "Unable to sign in. Please try again.";
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



//==================================================
// SIDEBAR OPEN / COLLAPSE
//==================================================

const sidebar = document.getElementById("sidebar");
const sidebarToggle = document.getElementById("sidebarToggle");

if (sidebar && sidebarToggle) {

    sidebarToggle.addEventListener("click", () => {

        sidebar.classList.toggle("collapsed");

        const icon = sidebarToggle.querySelector("i");

        if (sidebar.classList.contains("collapsed")) {

            // Sidebar is CLOSED
            icon.classList.remove("fa-angles-left");
            icon.classList.add("fa-angles-right");

    
            sidebarToggle.setAttribute("aria-label", "Open navbar");

        } else {

            // Sidebar is OPEN
            icon.classList.remove("fa-angles-right");
            icon.classList.add("fa-angles-left");

           
            sidebarToggle.setAttribute("aria-label", "Collapse navbar");

        }

    });

}


//==================================================
// CREATE OVERLAY
//==================================================

function closeCreateOverlay() {

    if (
        createOverlay
    ) {

        createOverlay.style.display =
            "none";

    }

}

if (
    navAdd &&
    createOverlay
) {

    navAdd.addEventListener(
        "click",
        () => {

            createOverlay.style.display =
                "flex";

        }
    );

}

if (closeSheet) {

    closeSheet.addEventListener(
        "click",
        closeCreateOverlay
    );

}

if (createOverlay) {

    createOverlay.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                createOverlay
            ) {

                closeCreateOverlay();

            }

        }
    );

}


//==================================================
// CREATE MODULE
//==================================================

const newModule = document.getElementById("newModule");

if (newModule) {

    newModule.addEventListener(
        "click",
        () => {

            window.location.href =
                "08 modules.html?add=true";

        }
    );

}


//==================================================
// CREATE TASK
//==================================================

const newTask = document.getElementById("newTask");

if (newTask) {

    newTask.addEventListener(
        "click",
        () => {

            window.location.href = "21 addtask.html";

        }
    );

}

//==================================================
// CREATE EVENT
//==================================================

const newLecture = document.getElementById("newLecture");

if (newLecture) {

    newLecture.addEventListener(
        "click",
        () => {

            window.location.href =
                "21 addevent.html";

        }
    );

}

// =========================================
// SHOW / HIDE PASSWORD
// =========================================

document.addEventListener("click", function (event) {

    const button = event.target.closest(".toggle-password");

    if (!button) return;

    const wrapper = button.closest(".password-input-wrapper");
    const passwordInput = wrapper.querySelector(".password-input");
    const icon = button.querySelector("i");

    if (passwordInput.type === "password") {

        passwordInput.type = "text";

        icon.classList.remove("fa-eye");
        icon.classList.add("fa-eye-slash");

        button.setAttribute("aria-label", "Hide password");
        button.setAttribute("aria-pressed", "true");

    } else {

        passwordInput.type = "password";

        icon.classList.remove("fa-eye-slash");
        icon.classList.add("fa-eye");

        button.setAttribute("aria-label", "Show password");
        button.setAttribute("aria-pressed", "false");

    }

});

//==================================================
// PROFILE MENU
//==================================================

const profileBtn = document.getElementById("profileBtn");
const profileMenu = document.getElementById("profileMenu");

if (profileBtn && profileMenu) {

    profileBtn.addEventListener("click", (e) => {

        e.stopPropagation();

        profileMenu.classList.toggle("show");

    });

    document.addEventListener("click", (e) => {

        if (
            !profileMenu.contains(e.target) &&
            !profileBtn.contains(e.target)
        ) {

            profileMenu.classList.remove("show");

        }

    });

}

// =====================================
// ACCOUTN CREATED POPUP
// =====================================

const popupOverlay = document.getElementById("popupOverlay");
const popupTitle = document.getElementById("popupTitle");
const popupMessage = document.getElementById("popupMessage");
const popupClose = document.getElementById("popupClose");
const popupButton = document.getElementById("popupButton");
const popupIcon = document.getElementById("popupIcon");

let popupCallback = null;

function showPopup(title, message, callback = null) {

    if (!popupOverlay) return;

    popupTitle.textContent = title;
    popupMessage.textContent = message;

    popupCallback = callback;

    popupOverlay.classList.add("show");
}

function closePopup() {

    popupOverlay.classList.remove("show");

    if (popupCallback) {
        const callback = popupCallback;
        popupCallback = null;
        callback();
    }
}

if (popupClose) {
    popupClose.addEventListener("click", closePopup);
}

if (popupButton) {
    popupButton.addEventListener("click", closePopup);
}

if (popupOverlay) {
    popupOverlay.addEventListener("click", (event) => {

        if (event.target === popupOverlay) {
            closePopup();
        }

    });
}