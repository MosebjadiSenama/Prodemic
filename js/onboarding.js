
/* getting the onboarding elements */
const screens = document.querySelectorAll(".onboarding-screen");
const progressDots = document.querySelectorAll(".progress-dot");

const skipButton = document.getElementById("skipButton");
const backButton = document.getElementById("backButton");
const nextButton = document.getElementById("nextButton");
const progressText = document.getElementById("progressText");
const finalAuthButtons = document.getElementById("finalAuthButtons");

/* keeping track of the current screen */
let currentScreen = 0;

/* getting the total number of screens */
const totalScreens = screens.length;

/* showing the selected onboarding screen */
function showScreen(index) {
    // making sure the screen number is valid
    if (index < 0 || index >= totalScreens) {
        return;
    }

    // updating the current screen
    currentScreen = index;

    // showing the selected screen and hiding the others
    screens.forEach((screen, i) => {
        const isActive = i === currentScreen;

        screen.hidden = !isActive;
        screen.classList.toggle("active", isActive);
    });

    // updating the progress dots
    progressDots.forEach((dot, i) => {
        const isActive = i === currentScreen;

        dot.classList.toggle("active", isActive);

        if (isActive) {
            dot.setAttribute("aria-current", "step");
        } else {
            dot.removeAttribute("aria-current");
        }
    });

    // updating the screen number
    progressText.textContent = `${currentScreen + 1} of ${totalScreens}`;

  /* hiding the back button on the first and last screens */
backButton.hidden = currentScreen === 0 || currentScreen === totalScreens - 1;

    // changing the next button text on the last screen
    nextButton.hidden = currentScreen === totalScreens - 1;
    nextButton.textContent =
        currentScreen === totalScreens - 2 ? "Finish" : "Next";

    // showing the sign in and create account buttons on the last screen
    finalAuthButtons.hidden = currentScreen !== totalScreens - 1;

    // showing the skip button only before the last screen
    skipButton.hidden = currentScreen === totalScreens - 1;
}

/* moving to the next screen */
nextButton.addEventListener("click", () => {
    if (currentScreen < totalScreens - 1) {
        showScreen(currentScreen + 1);
    }
});

/* going back to the previous screen */
backButton.addEventListener("click", () => {
    if (currentScreen > 0) {
        showScreen(currentScreen - 1);
    }
});

/* skipping the onboarding screens */
skipButton.addEventListener("click", () => {
    showScreen(totalScreens - 1);
});

/* allowing the user to move between screens using the dots */
progressDots.forEach((dot) => {
    dot.addEventListener("click", () => {
        const screenIndex = Number(dot.dataset.go);
        showScreen(screenIndex);
    });
});

/* displaying the first screen when the page loads */
showScreen(0);
