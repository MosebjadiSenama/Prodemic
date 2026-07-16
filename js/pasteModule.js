//==================================================
// ELEMENTS
//==================================================

const moduleText = document.getElementById("moduleText");

const characterCount = document.getElementById("characterCount");

const analyseBtn = document.getElementById("analyseBtn");

const backBtn = document.getElementById("backBtn");

//==================================================
// CHARACTER COUNT
//==================================================

moduleText.addEventListener("input", () => {

    characterCount.textContent =

        `${moduleText.value.length} Characters`;

});

//==================================================
// ANALYSE
//==================================================

analyseBtn.addEventListener("click", () => {

    const text = moduleText.value.trim();

    if (text === "") {

        alert("Please paste your module outline.");

        return;

    }

    //--------------------------------------------------
    // SAVE TO LOCAL STORAGE
    //--------------------------------------------------

    localStorage.setItem(

        "moduleOutlineText",

        text

    );

    //--------------------------------------------------
    // GO TO AI PROCESSING
    //--------------------------------------------------

    window.location.href =

        "14 aiProcessing.html";

});

//==================================================
// BACK
//==================================================

backBtn.addEventListener("click", () => {

    window.location.href = "07 home.html";

});