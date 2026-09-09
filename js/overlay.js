const overlay = document.getElementById("overlay");
const closeOverlay = document.getElementById("closeOverlay");

if (overlay && closeOverlay) {

    closeOverlay.addEventListener("click", () => {
        overlay.style.display = "none";
    });

    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) {
            overlay.style.display = "none";
        }
    });
}

const moduleBtn = document.getElementById("moduleBtn");
const taskBtn = document.getElementById("taskBtn");
const scheduleBtn = document.getElementById("scheduleBtn");
const assessmentBtn = document.getElementById("assessmentBtn");

if (moduleBtn) {
    moduleBtn.addEventListener("click", () => {
        window.location.href = "08 moduleImport.html";
    });
}

if (taskBtn) {
    taskBtn.addEventListener("click", () => {
        window.location.href = "21 addTask.html";
    });
}

if (scheduleBtn) {
    scheduleBtn.addEventListener("click", () => {
        window.location.href = "scheduleForm.html";
    });
}

if (assessmentBtn) {
    assessmentBtn.addEventListener("click", () => {
        window.location.href = "addAssessment.html";
    });
}