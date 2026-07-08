//============================================================================================== FIREBASE IMPORTS ================================================
import { auth, db } from "../firebase.js";

import {

    collection,
    addDoc,
    getDocs,
    orderBy,
    query,
    updateDoc,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";



//================================================ MODULE FILTER BUTTONS ================================================

const filterButtons = document.querySelectorAll(".filter-btn");

filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        // Remove active from all buttons
        filterButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        // Add active to clicked button
        button.classList.add("active");

        // Which filter was selected?
        const filter = button.dataset.filter;

        console.log(filter);

        // We'll filter the module cards here later

    });

});





//============================================================ MODULES============================================================//

const addModuleBtn = document.getElementById("addModuleBtn")
const moduleEmpty = document.getElementById("moduleEmpty")
const moduleForm = document.getElementById("moduleForm")

//=======progress========
const moduleProgressPage = document.getElementById("moduleProgressPage");
const moduleOverviewPage = document.getElementById("moduleOverviewPage");

const overviewBackBtn =
document.getElementById("overviewBackBtn");
const moduleAvatar = document.getElementById("moduleAvatar");

const progressModuleName = document.getElementById("progressModuleName");

const progressModuleCode = document.getElementById("progressModuleCode");

const modulesHeader = document.getElementById("modulesHeader");
const filterCard = document.getElementById("filterCard");
const howItWorks = document.getElementById("howItWorks");
const backBtn = document.getElementById("backBtn");
const addModuleIcon=document.getElementById("addModuleIcon");



const moduleColour = document.getElementById("moduleColour");
const colourPreview = document.getElementById("colourPreview");

moduleColour.addEventListener("input", () => {

    colourPreview.style.backgroundColor = moduleColour.value;

});

if(moduleColour && colourPreview){

    colourPreview.style.backgroundColor = moduleColour.value;

    moduleColour.addEventListener("input", () => {

        colourPreview.style.backgroundColor = moduleColour.value;

    });

}

//===============================================================================back button restoration=================================

backBtn.addEventListener("click",()=>{

    moduleForm.style.display="none";

    modulesHeader.style.display="block";

    filterCard.style.display="flex";

    if(modulesList.children.length>0){

        modulesList.style.display="flex";

        moduleEmpty.style.display="none";

        document.querySelector(".module-buttons").style.display="none";

    }

    else{

        modulesList.style.display="none";

        moduleEmpty.style.display="flex";

        document.querySelector(".module-buttons").style.display="flex";

    }

});


//==================================================================================== Module list=================================
const moduleName = document.getElementById("moduleName");
const moduleCode = document.getElementById("moduleCode");
const semester = document.getElementById("semester");
const saveModule = document.getElementById("saveModule");
const modulesList = document.getElementById("modulesList");
//================================================== EDIT MODE ==================================
let editingModuleId = null;
//===============================================================================================

const toast = document.getElementById("toast");

const toastMessage = document.getElementById("toastMessage");

function showToast(message){

    if(!toast || !toastMessage) return;

    toastMessage.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 2500);

}
//================================================================================================== Module menu (edit, delete and view progress)======================================================
//delete module
const deleteOverlay = document.getElementById("deleteOverlay");
const cancelDelete = document.getElementById("cancelDelete");
const confirmDelete = document.getElementById("confirmDelete");

let moduleToDelete = null;
//=================

function getModuleInitials(name){

    return name
        .trim()
        .split(" ")
        .map(word => word.charAt(0))
        .join("")
        .toUpperCase();

}

//==============================

function createModuleCard(module){

    const card = document.createElement("div");

    card.className = "module-card";

    card.style.setProperty("--module-colour", module.colour);
//==========
card.innerHTML = `

<!--================ MODULE AVATAR ================-->
<div class="module-card-avatar"
     style="background:${module.colour}">
    ${getModuleInitials(module.name)}
</div>

<!--================ MODULE INFO ================-->
<div class="module-info">

    <h3 class="module-title">${module.name}</h3>

    <p class="module-code">${module.code}</p>

    <span class="module-semester">${module.semester}</span>

</div>

<div class="module-actions">

    <button class="more-btn">
        <i class="fa-solid fa-ellipsis-vertical"></i>
    </button>

    <button class="open-btn">
        <i class="fa-solid fa-chevron-right"></i>
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
//=====
    modulesList.appendChild(card);
   const moreBtn = card.querySelector(".more-btn");
const menu = card.querySelector(".module-menu");


// ======more button functionality 

const menuItems = card.querySelectorAll(".menu-item");

const editBtn = menuItems[0];
const deleteBtn = menuItems[1];
const openBtn = card.querySelector(".open-btn");


if(!moreBtn || !menu || !editBtn || !deleteBtn || !openBtn){

    return;

}


//================================================================================================== MORE OPTION FOR =================================

editBtn.addEventListener("click", () => {
    editingModuleId = module.id;

    menu.classList.remove("show");

    showModuleForm();

    // Change heading
    document.getElementById("moduleFormTitle").textContent = "Edit Module";

    // Change button text
    saveModule.textContent = "Update Module";

    // Fill the form
    moduleName.value = module.name;
    moduleCode.value = module.code;
    semester.value = module.semester;
    moduleColour.value = module.colour;
    colourPreview.style.backgroundColor = module.colour;

});
//====delete  module

deleteBtn.addEventListener("click",()=>{

    menu.classList.remove("show");

    moduleToDelete = module.id;

    deleteOverlay.style.display="flex";

});





//=====================================================
openBtn.addEventListener("click",()=>{

    modulesHeader.style.display = "none";
    filterCard.style.display = "none";
    modulesList.style.display = "none";
    moduleEmpty.style.display = "none";
    moduleForm.style.display = "none";

    moduleOverviewPage.style.display = "block";

    const overviewModuleName =
    document.getElementById("overviewModuleName");

    const overviewModuleCode =
    document.getElementById("overviewModuleCode");

    const overviewModuleSemester =
    document.getElementById("overviewModuleSemester");

    moduleAvatar.style.backgroundColor = module.colour;
    moduleAvatar.textContent = getModuleInitials(module.name);

    overviewModuleName.textContent = module.name;
    overviewModuleCode.textContent = module.code;
    overviewModuleSemester.textContent = module.semester;

    document.documentElement.style.setProperty(
        "--current-module-colour",
        module.colour
    );

});


moreBtn.addEventListener("click",(e)=>{
  

//=====================================================
// OPEN MODULE OVERVIEW
//=====================================================


    e.stopPropagation();

    document.querySelectorAll(".module-menu").forEach(m=>{

        if(m!==menu){

            m.classList.remove("show");

        }

    });

    menu.classList.toggle("show");

});




//=====

document.addEventListener("click",()=>{

    menu.classList.remove("show");

});

}

saveModule.addEventListener("click", async () => {
if(

    moduleName.value.trim()==="" ||

    moduleCode.value.trim()===""

){

    showToast("Please complete all fields.");

    return;

}
 
    if (!auth.currentUser) {
       showToast("No user is logged in.");
        return;
    }

  try {

    if(editingModuleId){

        await updateDoc(

            doc(db,"users",auth.currentUser.uid,"modules",editingModuleId),

            {

                name: moduleName.value,
                code: moduleCode.value,
                semester: semester.value,
                colour: moduleColour.value

            }

        );

        showToast("Module updated successfully!");

        editingModuleId = null;

    }

    else{

        await addDoc(

            collection(db,"users",auth.currentUser.uid,"modules"),

            {

                name: moduleName.value,
                code: moduleCode.value,
                semester: semester.value,
                colour: moduleColour.value,
                createdAt: Date.now()

            }

        );

        showToast("Module saved successfully!");

    }

    await loadModules();

    document.getElementById("moduleFormTitle").textContent = "Add New Module";

saveModule.textContent = "Save Module";

editingModuleId = null;
 
      
moduleName.value = "";
moduleCode.value = "";
semester.selectedIndex = 0;
moduleColour.value = "#2E4AAC";
colourPreview.style.backgroundColor = "#2E4AAC";




    } catch (error) {

        console.log(error);
    }

});
//==================================================display modules=============================
function showModuleForm(){

    modulesHeader.style.display = "none";

    filterCard.style.display = "none";

    moduleEmpty.style.display = "none";

    modulesList.style.display = "none";

    document.querySelector(".module-buttons").style.display = "none";

    moduleForm.style.display = "block";

}

addModuleBtn.addEventListener("click", showModuleForm);

if(addModuleIcon){

    addModuleIcon.addEventListener("click", showModuleForm);

}



//============================================================================
// NAV BAR ADD BUTTON OVERLAY
//============================================================================

const navAdd = document.querySelector(".nav-add");
const createOverlay = document.getElementById("createOverlay");
const closeSheet = document.getElementById("closeSheet");

if(navAdd && createOverlay){

    navAdd.addEventListener("click",(e)=>{

        e.preventDefault();

        createOverlay.style.display="flex";

    });

}

if(closeSheet){

    closeSheet.addEventListener("click",()=>{

        createOverlay.style.display="none";

    });

}

if(createOverlay){

    createOverlay.addEventListener("click",(e)=>{

        if(e.target===createOverlay){

            createOverlay.style.display="none";

        }

    });

}


//=========================================IF ON CERTAIN PAGE============================

const newModule = document.getElementById("newModule");

if(newModule){

    newModule.addEventListener("click",()=>{

       showModuleForm();

createOverlay.style.display = "none";

    });

}
//==========when user taps on = sign it will take the usr to add new module page========================================================

//===============================

async function loadModules(){

    if(!auth.currentUser) return;

    modulesList.innerHTML = "";

    moduleEmpty.style.display = "none";
    modulesList.style.display = "none";

    const q = query(

        collection(db,"users",auth.currentUser.uid,"modules"),

        orderBy("createdAt")

    );

    const snapshot = await getDocs(q);

    if(snapshot.empty){

        moduleEmpty.style.display = "flex";

        document.querySelector(".module-buttons").style.display = "flex";

        modulesList.style.display = "none";

        return;

    }

    moduleEmpty.style.display = "none";

    document.querySelector(".module-buttons").style.display = "none";

    modulesList.style.display = "flex";

    moduleForm.style.display = "none";

modulesHeader.style.display = "block";

filterCard.style.display = "flex";

  snapshot.forEach((doc)=>{

    createModuleCard({

        id: doc.id,

        ...doc.data()

    });

});
//==============================================================================
}   // <-- ADD THIS

overviewBackBtn.addEventListener("click", () => {

    moduleOverviewPage.style.display = "none";

    modulesHeader.style.display = "block";

    filterCard.style.display = "flex";

    modulesList.style.display = "flex";

});
//===

auth.onAuthStateChanged((user)=>{

    if(user){

        moduleEmpty.style.display = "none";
        modulesList.style.display = "none";

        loadModules();

    }

});


//delete
cancelDelete.addEventListener("click", () => {

    deleteOverlay.style.display = "none";

    moduleToDelete = null;

});

confirmDelete.addEventListener("click", async () => {

    if (!moduleToDelete) return;

    await deleteDoc(
        doc(
            db,
            "users",
            auth.currentUser.uid,
            "modules",
            moduleToDelete
        )
    );

    deleteOverlay.style.display = "none";

    moduleToDelete = null;

    showToast("Module deleted.");

    loadModules();

});
//==================================================================================================================================================================================
                                                                                      //VIEW MODULE PROGRESS
//==================================================================================================================================================================================



