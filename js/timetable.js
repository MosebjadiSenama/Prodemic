//==========import storage

import { supabase } from "./supabase.js";
//==================================================
                //ELEMENTS
//===================================================

const backBtn = document.getElementById("backBtn");
const continueBtn = document.getElementById("continueBtn");
const uploadPDF = document.getElementById("uploadPDF");
const takePhoto = document.getElementById("takePhoto");
const manualEntry = document.getElementById("manualEntry");

const moduleName = document.getElementById("moduleName");
const moduleCode = document.getElementById("moduleCode");
const lecturerName = document.getElementById("lecturerName");
const semester = document.getElementById("semester");
const assessmentCount = document.getElementById("assessmentCount");

//==========choose one option=======
let selectedMethod = "";
let uploadComplete = false;
let uploading = false;

function clearSelection(){

    uploadPDF.classList.remove("active");

    takePhoto.classList.remove("active");

    manualEntry.classList.remove("active");

}
//===============================================pdf
uploadPDF.addEventListener("click",()=>{

    clearSelection();

    uploadPDF.classList.add("active");

    pdfInput.click();

});
//======================================================camera
takePhoto.addEventListener("click",()=>{

    clearSelection();

    takePhoto.classList.add("active");

    cameraInput.click();

});
//========================================================manual
manualEntry.addEventListener("click",()=>{

    clearSelection();

    manualEntry.classList.add("active");

    window.location.href = "12 manualTimetable.html";

});


/*==================================================
                    PDF
===================================================*/

const pdfInput = document.getElementById("pdfInput");

pdfInput.addEventListener("change", async () => {

    const file = pdfInput.files[0];
    console.log("1. File selected");
   
    if (!file) return;

    selectedMethod = "PDF";

    document.getElementById("pdfName").textContent = file.name;

    const fileName = Date.now() + "_" + file.name;

    const { error } = await supabase.storage

        .from("timetable")

        .upload(fileName, file);

    if (error) {

    console.error(error);

    alert(error.message);

    return;

}

    const { data } = supabase.storage

        .from("timetable")

        .getPublicUrl(fileName);

    const fileURL = data.publicUrl;

    localStorage.setItem(

        "timetableURL",

        fileURL

    );

//=======
const { error: dbError } = await supabase
.from("timetables")
.insert([
    {
        file_url: fileURL,
        file_name: file.name
    }
]);

if (dbError) {
    console.error(dbError);
    alert(dbError.message);
    return;
}
//=====

    localStorage.setItem(

        "timetableFile",

        file.name

    );

    uploadComplete = true;

    console.log(fileURL);

});
/*==================================================
                    CAMERA
===================================================*/

const cameraInput = document.getElementById("cameraInput");

cameraInput.addEventListener("change", async () => {

    const file = cameraInput.files[0];

    if (!file) return;

    selectedMethod = "Camera";

    document.getElementById("cameraName").textContent = file.name;

    const fileName = Date.now() + "_" + file.name;

    const { error } = await supabase.storage

        .from("timetable")

        .upload(fileName, file);

  if (error) {

    console.error(error);

    alert(error.message);

    return;

}



    const { data } = supabase.storage

        .from("timetable")

        .getPublicUrl(fileName);

    const fileURL = data.publicUrl;

    //=====

const { error: dbError } = await supabase
.from("timetables")
.insert([
    {
        file_url: fileURL,
        file_name: file.name
    }
]);

if (dbError) {
    console.error(dbError);
    alert(dbError.message);
    return;
}

//===


    localStorage.setItem(

        "timetableURL",

        fileURL

    );

    localStorage.setItem(

        "timetableFile",

        file.name

    );

    uploadComplete = true;

    console.log(fileURL);

});
/*==================================================
                CONTINUE
===================================================*/

continueBtn.addEventListener("click",()=>{

  if(selectedMethod === ""){

    alert("Please choose an upload method.");

    return;

}

if(!uploadComplete){

    alert("Please upload your timetable first.");

    return;

}

    document.getElementById("uploadScreen").style.display = "none";

    document.getElementById("processingScreen").style.display = "block";

    startProcessing();

});
/*==================================================
            AI PROCESSING
===================================================*/

function startProcessing(){

    const progressFill = document.getElementById("progressFill");
    const progressPercent = document.getElementById("progressPercent");

    const steps = [
        document.getElementById("step1"),
        document.getElementById("step2"),
        document.getElementById("step3"),
        document.getElementById("step4"),
        document.getElementById("step5"),
        document.getElementById("step6"),
        document.getElementById("step7")
    ];

    let progress = 0;
    let currentStep = 0;

    const timer = setInterval(()=>{

        progress += 5;

        progressFill.style.width = progress + "%";
        progressPercent.textContent = progress + "%";

        if(progress >= (currentStep + 1) * 15 && currentStep < steps.length){

            steps[currentStep].classList.add("completed");

            steps[currentStep]
                .querySelector("i")
                .className = "fa-solid fa-circle-check";

            currentStep++;

        }

        if(progress >= 100){

            clearInterval(timer);

            setTimeout(()=>{

                document.getElementById("processingScreen").style.display = "none";

                document.getElementById("reviewScreen").style.display = "block";

                // Temporary demo data===========================================================================================================
                 console.log(document.getElementById("moduleName"));
                 console.log(document.getElementById("moduleCode"));
                 console.log(document.getElementById("lecturerName"));
                 console.log(document.getElementById("semester"));

                 document.getElementById("moduleName").textContent = "Loading...";
                 document.getElementById("moduleCode").textContent = "Loading...";
                 document.getElementById("semester").textContent = "Loading...";
                 document.getElementById("assessmentCount").textContent = "Loading...";

            },500);

        }

    },150);

}


/*==================================================
                BACK
===================================================*/

backBtn.addEventListener("click", () => {

    window.location.href = "07 home.html";

});