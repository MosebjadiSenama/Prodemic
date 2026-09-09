//==================================================
// IMPORTS
//==================================================

import { auth } from "../firebase.js";
import { supabase } from "./supabase.js";

//==================================================
// FILTER BUTTONS
//==================================================

const filterButtons = document.querySelectorAll(".filter-btn");

filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        filterButtons.forEach(btn =>

            btn.classList.remove("active")

        );

        button.classList.add("active");

        loadModules(button.dataset.filter);

    });

});

//==================================================
// MODULE STATE
//==================================================

let editingModuleId = null;

let moduleToDelete = null;

let modules = [];

//==================================================
// ELEMENTS
//==================================================

const addModuleBtn = document.getElementById("addModuleBtn");
const addModuleIcon = document.getElementById("addModuleIcon");

const moduleForm = document.getElementById("moduleForm");
const moduleEmpty = document.getElementById("moduleEmpty");
const modulesList = document.getElementById("modulesList");

const modulesHeader = document.getElementById("modulesHeader");
const filterCard = document.getElementById("filterCard");

const moduleProgressPage =
document.getElementById("moduleProgressPage");



const backBtn =
document.getElementById("backBtn");

const saveModule =
document.getElementById("saveModule");

const moduleName =
document.getElementById("moduleName");

const moduleCode =
document.getElementById("moduleCode");

const semester =
document.getElementById("semester");

const moduleColour =
document.getElementById("moduleColour");

const colourPreview =
document.getElementById("colourPreview");

const moduleAvatar =
document.getElementById("moduleAvatar");

const toast =
document.getElementById("toast");

const toastMessage =
document.getElementById("toastMessage");

const deleteOverlay =
document.getElementById("deleteOverlay");

const cancelDelete =
document.getElementById("cancelDelete");

const confirmDelete =
document.getElementById("confirmDelete");

const createOverlay =
document.getElementById("createOverlay");

const navAdd =
document.querySelector(".nav-add");

const closeSheet =
document.getElementById("closeSheet");

const newModule =
document.getElementById("newModule");

//==================================================
// COLOUR PICKER
//==================================================

if(moduleColour && colourPreview){

    colourPreview.style.backgroundColor =
    moduleColour.value;

    moduleColour.addEventListener("input",()=>{

        colourPreview.style.backgroundColor =
        moduleColour.value;

    });

}

//==================================================
// TOAST
//==================================================

function showToast(message){

    if(!toast) return;

    toastMessage.textContent = message;

    toast.classList.add("show");

    setTimeout(()=>{

        toast.classList.remove("show");

    },2500);

}

//==================================================
// ABBREVIATION
//==================================================
function getModuleInitials(name){

    return name
        .trim()
        .split(" ")
        .filter(word => !/^\d+$/.test(word))
        .map(word => word[0])
        .join("")
        .toUpperCase()
        .slice(0, 3);

}
//==================================================
// RESET FORM
//==================================================

function resetForm(){

    editingModuleId = null;

    moduleName.value = "";

    moduleCode.value = "";

    semester.selectedIndex = 0;

    moduleColour.value = "#2E4AAC";

    colourPreview.style.backgroundColor = "#2E4AAC";

    document.getElementById("moduleFormTitle").textContent =
    "Add Module";

    saveModule.textContent =
    "Save Module";

}

//==================================================
// SHOW FORM
//==================================================

function showModuleForm(){

    modulesHeader.style.display = "none";

    filterCard.style.display = "none";

    moduleEmpty.style.display = "none";

    modulesList.style.display = "none";

    document.querySelector(".module-buttons").style.display =
    "none";

    

    moduleForm.style.display = "block";

}

//==================================================
// SHOW MODULES
//==================================================

function showModulesPage(){

    moduleForm.style.display = "none";

    

    modulesHeader.style.display = "block";

    filterCard.style.display = "flex";

    if(modules.length){

        modulesList.style.display = "flex";

        moduleEmpty.style.display = "none";

        document.querySelector(".module-buttons").style.display =
        "none";

    }

    else{

        modulesList.style.display = "none";

        moduleEmpty.style.display = "flex";

        document.querySelector(".module-buttons").style.display =
        "flex";

    }

}


//==================================================
// CREATE MODULE CARD
//==================================================

function createModuleCard(module){

    const card = document.createElement("div");

    card.className = "module-card";

    card.style.setProperty(

        "--module-colour",

        module.colour

    );

    card.innerHTML = `

<div class="module-card-avatar"
style="background:${module.colour}">

${getModuleInitials(module.module_name)}

</div>

<div class="module-info">

<h3 class="module-title">

${module.module_name}

</h3>

<p class="module-code">

${module.module_code}

</p>

<span class="module-semester">

${module.semester}

</span>

</div>

<div class="module-actions">

<button
class="more-btn">

<i class="fa-solid fa-ellipsis-vertical"></i>

</button>

<button
    class="track-progress-btn"
    data-id="${module.id}"
    aria-label="View module progress">

    <span>
        View Progress
    </span>

    <i class="fa-solid fa-arrow-right"></i>

</button>

</div>

<div class="module-menu">

<button class="menu-item edit-module">

<i class="fa-solid fa-pen"></i>

Edit

</button>

<button class="menu-item delete">

<i class="fa-solid fa-trash"></i>

Delete

</button>

</div>

`;

    modulesList.appendChild(card);

    //--------------------------------------------------
    // ELEMENTS
    //--------------------------------------------------

    const moreBtn = card.querySelector(".more-btn");

   const trackProgressBtn =
card.querySelector(".track-progress-btn");

    const menu = card.querySelector(".module-menu");

    const editBtn = card.querySelector(".edit-module");

    const deleteBtn = card.querySelector(".delete");

    //--------------------------------------------------
    // MENU
    //--------------------------------------------------

    moreBtn.addEventListener("click",(e)=>{

        e.stopPropagation();

        document

        .querySelectorAll(".module-menu")

        .forEach(item=>{

            if(item!==menu){

                item.classList.remove("show");

            }

        });

        menu.classList.toggle("show");

    });

    document.addEventListener("click",()=>{

        menu.classList.remove("show");

    });

    //--------------------------------------------------
    // EDIT MODULE
    //--------------------------------------------------

    editBtn.addEventListener("click",()=>{

        editingModuleId = module.id;

        menu.classList.remove("show");

        showModuleForm();

        document.getElementById(

            "moduleFormTitle"

        ).textContent =

        "Edit Module";

        saveModule.textContent =

        "Update Module";

        moduleName.value =

        module.module_name;

        moduleCode.value =

        module.module_code;

        semester.value =

        module.semester;

        moduleColour.value =

        module.colour;

        colourPreview.style.backgroundColor =

        module.colour;

    });

    //--------------------------------------------------
    // DELETE
    //--------------------------------------------------

    deleteBtn.addEventListener("click",()=>{

        moduleToDelete = module.id;

        deleteOverlay.style.display = "flex";

        menu.classList.remove("show");

    });

  
//--------------------------------------------------
// UPLOAD MODULE OUTLINE
//--------------------------------------------------

uploadBtn.addEventListener("click", () => {

    console.log("=================================");
    console.log("FULL MODULE OBJECT:");
    console.log(module);
    console.log("=================================");
    console.log("module.id =", module.id);
    console.log("URL =", `13 moduleoutline.html?id=${module.id}`);

    alert(`Module ID = ${module.id}`);
window.location.href = `13 moduleoutline.html?id=${module.id}`;

});
}

//==================================================
// BACK BUTTON
//==================================================

backBtn.addEventListener("click",()=>{

    resetForm();

    showModulesPage();

});

//==================================================
// ADD MODULE
//==================================================

addModuleBtn.addEventListener(

    "click",

    showModuleForm

);

if(addModuleIcon){

    addModuleIcon.addEventListener(

        "click",

        showModuleForm

    );

}

//==================================================
// LOAD MODULES
//==================================================


async function loadModules(filter = "all"){

    if(!auth.currentUser) return;

    modulesList.innerHTML = "";

    modules = [];

    const { data, error } = await supabase

    .from("modules")

    .select("*")

    .eq("user_id", auth.currentUser.uid)

    .order("created_at", { ascending: true });

    if(error){

        console.error(error);

        showToast(error.message);

        return;

    }

    modules = data || [];

    //--------------------------------------------------
    // FILTERS
    //--------------------------------------------------

    let filteredModules = modules;

    if(filter !== "all"){

        filteredModules = modules.filter(module =>

            module.semester === filter

        );

    }

if (moduleForm.style.display === "block") {
    return;
}
if(filteredModules.length === 0){

    moduleEmpty.style.display = "flex";
    modulesList.style.display = "none";
    document.querySelector(".module-buttons").style.display = "flex";

    return;

}

    moduleEmpty.style.display = "none";

modulesList.style.display = "flex";

document.querySelector(".module-buttons")
    .style.display = "flex";

filteredModules.forEach(module=>{
    createModuleCard(module);
});

}

//==================================================
// SAVE / UPDATE MODULE
//==================================================

saveModule.addEventListener("click", async()=>{

    if(

        moduleName.value.trim()==="" ||

        moduleCode.value.trim()===""

    ){

        showToast("Please complete all fields.");

        return;

    }

    if(!auth.currentUser){

        showToast("Please login first.");

        return;

    }

    try{

        //--------------------------------------------------
        // UPDATE
        //--------------------------------------------------

        if(editingModuleId){

            const { error } = await supabase

            .from("modules")

            .update({

                module_name : moduleName.value,

                module_code : moduleCode.value,

                semester : semester.value,

                colour : moduleColour.value

            })

            .eq("id", editingModuleId)

            .eq("user_id", auth.currentUser.uid);

            if(error) throw error;

            showToast("Module updated.");

        }

        //--------------------------------------------------
        // INSERT
        //--------------------------------------------------

        else{

            const { error } = await supabase

            .from("modules")

            .insert([{

                user_id : auth.currentUser.uid,

                module_name : moduleName.value,

                module_code : moduleCode.value,

                semester : semester.value,

                colour : moduleColour.value

            }]);

            if(error) throw error;

            showToast("Module added.");

        }

        //--------------------------------------------------
        // RESET
        //--------------------------------------------------

        resetForm();

        showModulesPage();

        await loadModules();

        //--------------------------------------------------
        // FIRST MODULE
        //--------------------------------------------------

        if(modules.length === 1){

            setTimeout(()=>{

                window.location.href =

                "07 home.html";

            },1500);

        }

    }

    catch(error){

        console.error(error);

        showToast(error.message);

    }

});

//==================================================
// DELETE MODULE
//==================================================

cancelDelete.addEventListener("click",()=>{

    deleteOverlay.style.display = "none";

    moduleToDelete = null;

});

confirmDelete.addEventListener("click", async()=>{

    if(!moduleToDelete) return;

    const { error } = await supabase

    .from("modules")

    .delete()

    .eq("id", moduleToDelete)

    .eq("user_id", auth.currentUser.uid);

    if(error){

        showToast(error.message);

        return;

    }

    deleteOverlay.style.display = "none";

    moduleToDelete = null;

    showToast("Module deleted.");

    await loadModules();

});

//==================================================
// NAV BAR OVERLAY
//==================================================

if(navAdd){

    navAdd.addEventListener("click",(e)=>{

        e.preventDefault();

        createOverlay.style.display = "flex";

    });

}

if(closeSheet){

    closeSheet.addEventListener("click",()=>{

        createOverlay.style.display = "none";

    });

}

if(createOverlay){

    createOverlay.addEventListener("click",(e)=>{

        if(e.target === createOverlay){

            createOverlay.style.display = "none";

        }

    });

}

//==================================================
// NEW MODULE FROM CREATE MENU
//==================================================

if(newModule){

    newModule.addEventListener("click",()=>{

        createOverlay.style.display = "none";

        resetForm();

        showModuleForm();

    });

}


//==================================================
// AUTH
//==================================================

auth.onAuthStateChanged(async(user)=>{

    if(!user){

        window.location.href = "01 login.html";

        return;

    }

  try{

    await loadModules();

    const params =
        new URLSearchParams(window.location.search);

    const editId =
        params.get("edit");

    if(editId){

        const module =
            modules.find(
                item =>
                    String(item.id) ===
                    String(editId)
            );

        if(module){

            editingModuleId =
                module.id;

            showModuleForm();

            document.getElementById(
                "moduleFormTitle"
            ).textContent =
                "Edit Module";

            saveModule.textContent =
                "Update Module";

            moduleName.value =
                module.module_name;

            moduleCode.value =
                module.module_code;

            semester.value =
                module.semester;

            moduleColour.value =
                module.colour;

            colourPreview.style.backgroundColor =
                module.colour;

        }

    }

}
catch(error){

        console.error(error);

        showToast("Failed to load modules.");

    }

});

//==================================================
// REFRESH MODULES
//==================================================

window.addEventListener("focus",()=>{

    if(auth.currentUser){

        loadModules();

    }

});

//==================================================
// ESC KEY CLOSES MENUS
//==================================================

document.addEventListener("keydown",(e)=>{

    if(e.key === "Escape"){

        deleteOverlay.style.display = "none";

        createOverlay.style.display = "none";

    }

});

//==================================================
// DEFAULT COLOUR
//==================================================

if(colourPreview){

    colourPreview.style.backgroundColor =

    moduleColour.value;

}

//==================================================
// INITIAL PAGE
//==================================================

resetForm();

const params = new URLSearchParams(window.location.search);

if (params.get("newModule") === "true") {
    showModuleForm();
} else {
    showModulesPage();
}

async function loadSubmissions(moduleId){

    const submissionList =
    document.getElementById("submissionList");

    submissionList.innerHTML = "";

    const { data, error } = await supabase

        .from("assessments")

        .select("*")

        .eq("module_id", moduleId)

        .order("due_date",{ascending:true});

    if(error){

        console.error(error);

        return;

    }

    if(!data.length){

        submissionList.innerHTML = `

        <div class="empty-state">

            <i class="fa-solid fa-file-circle-xmark"></i>

            <h3>No submissions yet</h3>

            <p>Import a module outline to generate submissions.</p>

        </div>

        `;

        return;

    }

    data.forEach(item=>{

        const div = document.createElement("div");

        div.className = "submission-item";

        div.innerHTML = `

            <div>

                <div class="submission-title">

                    ${item.title}

                </div>

            </div>

            <div class="submission-date">

                ${item.due_date ?? "No date"}

            </div>

        `;

        submissionList.appendChild(div);

    });

}

// ==================================================
// TRACK PROGRESS BUTTONS
// ==================================================

document.addEventListener("click", function (event) {

    const trackButton = event.target.closest(".track-progress-btn");

    if (!trackButton) {
        return;
    }

    const moduleId = trackButton.dataset.id;

    console.log("Track Progress clicked");
    console.log("Module ID:", moduleId);

    // Go to Track Progress page
    window.location.href =
        "23%20moduleTrack.html?id=" +
        encodeURIComponent(moduleId);
});