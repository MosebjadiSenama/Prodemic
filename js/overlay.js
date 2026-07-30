const overlay = document.getElementById("overlay");

document.getElementById("closeOverlay").addEventListener("click", () => {
    overlay.style.display = "none";
});

// Close when clicking outside the sheet
overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
        overlay.style.display = "none";
    }
});

// Open forms
document.getElementById("moduleBtn").addEventListener("click", () => {
    window.location.href = "08 moduleImport.html";
});

document.getElementById("taskBtn").addEventListener("click", () => {
    window.location.href = "21 addTask.html";
});

document.getElementById("scheduleBtn").addEventListener("click", () => {
    window.location.href = "scheduleForm.html";
});

document.getElementById("assessmentBtn").addEventListener("click", () => {
    window.location.href = "addAssessment.html";
});