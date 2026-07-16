//==========import storage

import { auth } from "../firebase.js";
import { supabase } from "./supabase.js";
//==================================================
                //ELEMENTS
//===================================================

const backBtn = document.getElementById("backBtn");
const continueBtn = document.getElementById("continueBtn");
const uploadPDF = document.getElementById("uploadPDF");
const takePhoto = document.getElementById("takePhoto");
const manualEntry = document.getElementById("manualEntry");

const reviewNext = document.getElementById("reviewNext");
//==========choose one option=======

let selectedMethod = "";
let uploadComplete = false;
let uploading = false;

//==========AI Lectures=======
let lectures = [];

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

    console.log("1. File selected:", file);

    if (!file) return;

    selectedMethod = "PDF";

    document.getElementById("pdfName").textContent = file.name;

    const fileName = Date.now() + "_" + file.name;

    const { error } = await supabase.storage
        .from("timetable")
        .upload(fileName, file);

    console.log("Upload error:", error);

    if (error) {
        console.error(error);
        alert(error.message);
        return;
    }

    const { data } = supabase.storage
        .from("timetable")
        .getPublicUrl(fileName);

    const fileURL = data.publicUrl;

    console.log("Public URL:", fileURL);

    localStorage.setItem("timetableURL", fileURL);
    localStorage.setItem("timetableFile", file.name);

    const user = auth.currentUser;

const { error: dbError } = await supabase
.from("timetables")
.insert([
    {
        user_id: user.uid,
        file_url: fileURL,
        file_name: file.name
    }
]);

    if (dbError) {
        console.error(dbError);
        alert(dbError.message);
        return;
    }

    uploadComplete = true;
    console.log("Upload finished");
console.log(localStorage.getItem("timetableURL"));

    console.log("uploadComplete =", uploadComplete);

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

const user = auth.currentUser;

const { error: dbError } = await supabase
.from("timetables")
.insert([
    {
        user_id: user.uid,
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

            setTimeout(async()=>{

                const timetableURL = localStorage.getItem("timetableURL");

              const response = await fetch("http://localhost:3000/import-timetable",{

                    method:"POST",

                    headers:{
                        "Content-Type":"application/json"
                    },

                    body:JSON.stringify({

                        fileURL:timetableURL

                    })

                });

                const aiData = await response.json();

                console.log(aiData);

                if(!response.ok){

                    alert(aiData.error);

                    return;

                }
//==================================================
// STORE AI LECTURES
//==================================================

lectures = aiData.lectures || [];

// Show review screen

document.getElementById("processingScreen").style.display = "none";

document.getElementById("reviewScreen").style.display = "block";

renderLectures();    

            },500);

        }

    },150);

}


/*==================================================
            RENDER AI LECTURES
===================================================*/

function renderLectures(){

    const lectureList =
    document.getElementById("lectureList");

    lectureList.innerHTML = "";

    lectures.forEach((lecture,index)=>{

        lectureList.innerHTML += `

        <div class="lecture-card">

            <div
                class="lecture-colour"
                style="background:#4A90E2;">
            </div>

            <div class="lecture-info">

                <h3>${lecture.moduleName}</h3>

                <p>${lecture.moduleCode}</p>

                <div class="lecture-meta">

                    <span>

                        <i class="fa-solid fa-calendar"></i>

                       ${lecture.day}

                    </span>

                    <span>

                        <i class="fa-solid fa-clock"></i>

                        ${lecture.startTime} - ${lecture.endTime}

                    </span>

                </div>

            </div>

            <div class="lecture-actions">

                <button
                    class="editBtn"
                    data-index="${index}">

                    <i class="fa-solid fa-pen"></i>

                </button>

                <button
                    class="deleteBtn"
                    data-index="${index}">

                    <i class="fa-solid fa-trash"></i>

                </button>

            </div>

        </div>

        `;

    });

    document.getElementById("lectureCount").textContent =
    lectures.length;

    document.getElementById("sessionCount").textContent =
    lectures.length;

    document.getElementById("moduleCount").textContent =
    new Set(lectures.map(l=>l.moduleCode)).size;

    document.getElementById("dayCount").textContent =
   new Set(lectures.map(l=>l.day)).size;

    document
    .querySelectorAll(".deleteBtn")
    .forEach(button=>{

        button.addEventListener("click",()=>{

            lectures.splice(button.dataset.index,1);

            renderLectures();

        });

    });

    document
    .querySelectorAll(".editBtn")
    .forEach(button=>{

        button.addEventListener("click",()=>{

            alert("Edit lecture coming next.");

        });

    });

}
  //==================================================
               // BACK
//===================================================

backBtn.addEventListener("click", () => {

    window.location.href = "07 home.html";

});

//===
reviewNext.addEventListener("click", async()=>{

    const user = auth.currentUser;

    const rows = lectures.map(lecture=>({

        user_id: user.uid,

        module_name: lecture.moduleName,

        module_code: lecture.moduleCode,

        lecture_day: lecture.day,

        start_time: lecture.startTime,

        end_time: lecture.endTime,

        colour:"#4A90E2"

    }));

    const { error } = await supabase

    .from("lectures")

    .insert(rows);

    if(error){

        console.error(error);

        alert(error.message);

        return;

    }

    alert(`${rows.length} lectures saved successfully!`);

    // Optional: redirect after saving
    // window.location.href = "09 timetable.html";

});




