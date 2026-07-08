//==========================================manual timetable=========================================

manualEntry.addEventListener("click",()=>{

    clearSelection();

    manualEntry.classList.add("active");

    selectedMethod = "Manual";

});

//==================================
const lectureList =
document.getElementById("lectureList");

const lectures = [];

document.getElementById("addLecture")
.addEventListener("click",()=>{

    const module =
    document.getElementById("module").value;

    const day =
    document.getElementById("day").value;

    const start =
    document.getElementById("startTime").value;

    const end =
    document.getElementById("endTime").value;

    const venue =
    document.getElementById("venue").value;

    if(
        module==="" ||
        start==="" ||
        end===""
    ){

        alert("Please complete all fields.");

        return;

    }

    lectures.push({

        module,
        day,
        start,
        end,
        venue

    });

    lectureList.innerHTML += `

    <div class="lecture-card">

        <h3>${module}</h3>

        <p>${day}</p>

        <p>${start} - ${end}</p>

        <p>${venue}</p>

    </div>

    `;

    document.getElementById("module").value="";
    document.getElementById("venue").value="";

});

document.getElementById("saveTimetable")
.addEventListener("click",()=>{

    localStorage.setItem(

        "manualTimetable",

        JSON.stringify(lectures)

    );

    window.location.href =
    "15 moduleoutline.html";

});

document.getElementById("backBtn")
.addEventListener("click",()=>{

    history.back();

});

//==========================================================================BACK TO BUTTON(ENTER TIMETABLE MANUALLY)========================================
const backBtn = document.getElementById("backBtn");

backBtn.addEventListener("click", () => {

    window.location.href = "08 timetable.html";

});