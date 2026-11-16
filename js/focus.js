document.addEventListener("DOMContentLoaded", () => {
    const timerDisplay = document.getElementById("timerDisplay");
    const timerStatus = document.getElementById("timerStatus");
    const timerCircle = document.getElementById("timerCircle");
    const startBtn = document.getElementById("startBtn");
    const resetBtn = document.getElementById("resetBtn");

    const sessionOptions = document.querySelectorAll(".session-option");
    const customBtn = document.getElementById("customBtn");
    const customDuration = document.getElementById("customDuration");
    const customMinutes = document.getElementById("customMinutes");
    const applyCustomBtn = document.getElementById("applyCustomBtn");

    if (
        !timerDisplay ||
        !timerStatus ||
        !timerCircle ||
        !startBtn ||
        !resetBtn
    ) {
        console.error("Focus timer elements are missing from the HTML.");
        return;
    }

    const FOCUS_MINUTES_DEFAULT = 25;
    const BREAK_MINUTES = 5;

    
// ALARM COMPLETION SOUND
const completionSound = new Audio("./assets/sound/vibration%20sound.wav");
completionSound.preload = "auto";

let soundStopTimer = null;

function playCompletionSound() {
    stopCompletionSound();

    completionSound.currentTime = 0;

    completionSound.play().catch(error => {
        console.error("Sound playback failed:", error);
    });

    soundStopTimer = setTimeout(() => {
        stopCompletionSound();
    }, 4000);
}

function stopCompletionSound() {
    clearTimeout(soundStopTimer);
    soundStopTimer = null;

    completionSound.pause();
    completionSound.currentTime = 0;
}

    let totalSeconds = FOCUS_MINUTES_DEFAULT * 60;
    let remainingSeconds = totalSeconds;
    let timerInterval = null;
    let isRunning = false;
    let sessionCompleted = false;
    let currentMode = "focus";
    let selectedFocusMinutes = FOCUS_MINUTES_DEFAULT;

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;

        return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    }

    function updateDisplay() {
        timerDisplay.textContent = formatTime(remainingSeconds);

        const progress = totalSeconds > 0
            ? (remainingSeconds / totalSeconds) * 100
            : 0;

        const progressColor = currentMode === "break"
            ? "#65a88a"
            : "var(--medium-blue)";

        timerCircle.style.background = `conic-gradient(
            ${progressColor} ${progress}%,
            #e9f2fc ${progress}%
        )`;

        document.title = isRunning
            ? `${formatTime(remainingSeconds)} | ${currentMode === "break" ? "Break" : "Focus"}`
            : "Focus | Prodemic";
    }

    function updateStartButton() {
        if (isRunning) {
            startBtn.innerHTML = '<i class="fa-solid fa-pause"></i> Pause';
            startBtn.setAttribute("aria-label", "Pause timer");
        } else {
            startBtn.innerHTML = '<i class="fa-solid fa-play"></i> Start';
            startBtn.setAttribute("aria-label", "Start timer");
        }
    }

    function stopTimer() {
        clearInterval(timerInterval);
        timerInterval = null;
        isRunning = false;
        updateStartButton();
    }

    function startTimer() {
        if (isRunning) {
            pauseTimer();
            return;
        }

        if (sessionCompleted) {
            return;
        }

        if (remainingSeconds <= 0) {
            return;
        }

isRunning = true;
updateStartButton();

        timerStatus.textContent = currentMode === "break"
            ? "Take a breath and recharge."
            : "You're focusing — keep going!";

        updateDisplay();

        timerInterval = setInterval(() => {
            remainingSeconds--;

            updateDisplay();

            if (remainingSeconds <= 0) {
                finishTimer();
            }
        }, 1000);
    }

    function pauseTimer() {
        stopTimer();
        timerStatus.textContent = "Timer paused";
        updateDisplay();
    }
        function resetTimer() {
    stopTimer();
    stopCompletionSound();

    currentMode = "focus";
    
        totalSeconds = selectedFocusMinutes * 60;
        remainingSeconds = totalSeconds;
        sessionCompleted = false;

        timerStatus.textContent = "Ready to focus";

        startBtn.innerHTML = '<i class="fa-solid fa-play"></i> Start';
        resetBtn.innerHTML = '<i class="fa-solid fa-rotate-right"></i> Reset';

        updateDisplay();
        updateStartButton();
    }
     function finishTimer() {
    stopTimer();

    playCompletionSound();

    remainingSeconds = 0;
        sessionCompleted = true;

        updateDisplay();
        updateStartButton();

        if (currentMode === "focus") {
            timerStatus.textContent = "Focus session complete! Well done.";

            showCompletionMessage(
                "Focus session complete!",
                "You've finished your study session. Time to recharge.",
                "Start 5-minute break",
                startBreak,
                "Finish session",
                finishSession
            );
        } else {
            timerStatus.textContent = "Break complete. Ready to focus again?";

            showCompletionMessage(
                "Break is over!",
                "You're recharged. Ready for another focus session?",
                "Start focusing",
                startNextFocus,
                "Finish for now",
                finishSession
            );
        }
    }

    function showCompletionMessage(
        title,
        message,
        primaryText,
        primaryAction,
        secondaryText,
        secondaryAction
    ) {
        const existing = document.getElementById("focusCompletionModal");

        if (existing) {
            existing.remove();
        }

        const modal = document.createElement("div");
        modal.id = "focusCompletionModal";
        modal.className = "focus-completion-overlay";

        modal.innerHTML = `
            <div class="focus-completion-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="completionTitle"
                aria-describedby="completionMessage">

                <div class="completion-icon">
                    <i class="fa-solid ${currentMode === "focus" ? "fa-circle-check" : "fa-mug-hot"}"></i>
                </div>

                <h2 id="completionTitle">${title}</h2>

                <p id="completionMessage">${message}</p>

                <div class="completion-actions">
                    <button type="button" class="completion-primary" id="completionPrimary">
                        ${primaryText}
                    </button>

                    <button type="button" class="completion-secondary" id="completionSecondary">
                        ${secondaryText}
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        document.getElementById("completionPrimary")
            .addEventListener("click", () => {
                modal.remove();
                primaryAction();
            });

        document.getElementById("completionSecondary")
            .addEventListener("click", () => {
                modal.remove();
                secondaryAction();
            });

        document.getElementById("completionPrimary").focus();
    }

    function startBreak() {
    stopCompletionSound();

    currentMode = "break";
        totalSeconds = BREAK_MINUTES * 60;

     
        remainingSeconds = totalSeconds;
        sessionCompleted = false;

        timerStatus.textContent = "Time to take a break.";
        startBtn.innerHTML = '<i class="fa-solid fa-play"></i> Start Break';

        updateDisplay();
        startTimer();
    }
function startNextFocus() {
    stopCompletionSound();

    currentMode = "focus";
        totalSeconds = selectedFocusMinutes * 60;
        remainingSeconds = totalSeconds;
        sessionCompleted = false;

        timerStatus.textContent = "Ready for another focus session";

        updateDisplay();
        updateStartButton();
        startTimer();
    }

   function finishSession() {
    stopTimer();
    stopCompletionSound();

    currentMode = "focus";
        totalSeconds = selectedFocusMinutes * 60;
        remainingSeconds = totalSeconds;
        sessionCompleted = false;

        timerStatus.textContent = "Session finished. Great work!";

        updateDisplay();
        updateStartButton();
    }

    function selectSession(button) {
        sessionOptions.forEach(option => {
            const selected = option === button;

            option.classList.toggle("active", selected);
            option.setAttribute("aria-pressed", String(selected));
        });
    }

    sessionOptions.forEach(button => {
        button.addEventListener("click", () => {
            if (isRunning) {
                pauseTimer();
            }

            if (button === customBtn) {
                customDuration.hidden = false;
                selectSession(customBtn);
                return;
            }

            const minutes = Number(button.dataset.minutes);

            if (!Number.isInteger(minutes) || minutes < 1 || minutes > 180) {
                return;
            }

            selectedFocusMinutes = minutes;
            totalSeconds = minutes * 60;

            customDuration.hidden = true;

            selectSession(button);
            resetTimer();
        });
    });

    applyCustomBtn.addEventListener("click", () => {
        const minutes = Number(customMinutes.value);

        if (!Number.isInteger(minutes) || minutes < 1 || minutes > 180) {
            alert("Enter a duration between 1 and 180 minutes.");
            return;
        }

        if (isRunning) {
            pauseTimer();
        }

        selectedFocusMinutes = minutes;
        totalSeconds = minutes * 60;

        selectSession(customBtn);
        resetTimer();
    });

    startBtn.addEventListener("click", startTimer);
    resetBtn.addEventListener("click", resetTimer);

    updateDisplay();
    updateStartButton();
});