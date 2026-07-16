import { supabase } from "./supabase.js";

//==================================================
// DATA
//==================================================

const moduleData = JSON.parse(localStorage.getItem("moduleData"));

if (!moduleData) {

    alert("No module data found.");

    window.location.href = "17 pasteModule.html";

}

//==================================================
// ELEMENTS
//==================================================

const moduleName = document.getElementById("moduleName");
const moduleCode = document.getElementById("moduleCode");
const lecturer = document.getElementById("lecturer");
const email = document.getElementById("email");
const consultation = document.getElementById("consultation");
const summary = document.getElementById("summary");

const lectureList = document.getElementById("lectureList");
const assessmentList = document.getElementById("assessmentList");

const saveModule = document.getElementById("saveModule");
const backBtn = document.getElementById("backBtn");

//==================================================
// DISPLAY
//==================================================

moduleName.textContent = moduleData.moduleName || "Not found";
moduleCode.textContent = moduleData.moduleCode || "Not found";
lecturer.textContent = moduleData.lecturer || "Not found";
email.textContent = moduleData.email || "Not found";
consultation.textContent = moduleData.consultation || "Not found";
summary.textContent = moduleData.moduleSummary || "No summary available";

//==================================================
// LECTURES
//==================================================

lectureList.innerHTML = "";

(moduleData.lectureTimes || []).forEach(lecture => {

    lectureList.innerHTML += `

    <div class="review-card">

        <h3>${lecture.day || "-"}</h3>

        <p>${lecture.startTime || "-"} - ${lecture.endTime || "-"}</p>

        <p>${lecture.venue || "Venue not provided"}</p>

    </div>

    `;

});

if ((moduleData.lectureTimes || []).length === 0) {

    lectureList.innerHTML = `

    <div class="review-card">

        <p>No lecture timetable found.</p>

    </div>

    `;

}

//==================================================
// ASSESSMENTS
//==================================================

assessmentList.innerHTML = "";

(moduleData.assessments || []).forEach(item => {

    assessmentList.innerHTML += `

    <div class="review-card">

        <h3>${item.title || "-"}</h3>

        <p>${item.type || "-"}</p>

        <p>${item.weight || "-"}</p>

        <p>${item.dueDate || "-"}</p>

    </div>

    `;

});

if ((moduleData.assessments || []).length === 0) {

    assessmentList.innerHTML = `

    <div class="review-card">

        <p>No assessments found.</p>

    </div>

    `;

}

//==================================================
// SAVE
//==================================================

saveModule.addEventListener("click", async () => {

    saveModule.disabled = true;
    saveModule.textContent = "Saving...";

    try {

        const {

            data: moduleRow,

            error: moduleError

        } = await supabase

            .from("modules")

            .insert({

                module_name: moduleData.moduleName,
                module_code: moduleData.moduleCode,
                lecturer: moduleData.lecturer,
                email: moduleData.email,
                consultation: moduleData.consultation,
                summary: moduleData.moduleSummary

            })

            .select()

            .single();
            console.log("Module Row:", moduleRow);
console.log("Module Error:", moduleError);

if (moduleError) throw moduleError;


            console.log(moduleRow);
            console.log(moduleError);

        if (moduleError) throw moduleError;

        if ((moduleData.lectureTimes || []).length > 0) {

            const lectures = moduleData.lectureTimes.map(lecture => ({

                module_id: moduleRow.id,
                day: lecture.day,
                start_time: lecture.startTime,
                end_time: lecture.endTime,
                venue: lecture.venue

            }));

            const { error } = await supabase

                .from("lectures")

                .insert(lectures);

            if (error) throw error;

        }

       if ((moduleData.assessments || []).length > 0) {

            const assessments = moduleData.assessments.map(item => ({

                module_id: moduleRow.id,
                title: item.title,
                type: item.type,
                weight: item.weight,
                due_date: item.dueDate

            }));

            const { error } = await supabase

                .from("assessments")

                .insert(assessments);

            if (error) throw error;

        }

        localStorage.removeItem("moduleData");

        alert("Module imported successfully.");

        window.location.href = "09 modules.html";

    }

   catch (error) {

    console.error("FULL ERROR:", error);

    alert(
        JSON.stringify(error, null, 2)
    );

}

    finally {

        saveModule.disabled = false;
        saveModule.textContent = "Save Module";

    }

});

//==================================================
// BACK
//==================================================

backBtn.addEventListener("click", () => {

    history.back();

});