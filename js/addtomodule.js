import { auth } from "../firebase.js";
import { supabase } from "./supabase.js";


// ============================================================
// GET INFORMATION FROM URL
// ============================================================

const params =
    new URLSearchParams(window.location.search);

const type =
    params.get("type");

const moduleId =
    Number(
        params.get("module")
    );


// ============================================================
// GET HTML ELEMENTS
// ============================================================

const lectureForm =
    document.getElementById(
        "lectureForm"
    );

const taskForm =
    document.getElementById(
        "taskForm"
    );

const personForm =
    document.getElementById(
        "personForm"
    );

const eventForm =
    document.getElementById(
        "eventForm"
    );


// Back button

const backButton =
    document.getElementById(
        "backButton"
    );


// ============================================================
// SHOW CORRECT FORM
// ============================================================

function showForm(){

    // Hide all forms first

    if(lectureForm){
        lectureForm.style.display =
            "none";
    }

    if(taskForm){
        taskForm.style.display =
            "none";
    }

    if(personForm){
        personForm.style.display =
            "none";
    }

    if(eventForm){
        eventForm.style.display =
            "none";
    }


    // Show the form that was selected

    if(type === "lecture"){

        if(lectureForm){
            lectureForm.style.display =
                "block";
        }

    }

    else if(type === "task"){

        if(taskForm){
            taskForm.style.display =
                "block";
        }

    }

    else if(type === "person"){

        if(personForm){
            personForm.style.display =
                "block";
        }

    }

    else if(type === "event"){

        if(eventForm){
            eventForm.style.display =
                "block";
        }

    }

    else{

        console.error(
            "Invalid add type:",
            type
        );

    }

}


// ============================================================
// SHOW FORM
// ============================================================

showForm();


// ============================================================
// CHECK MODULE
// ============================================================

if(
    !moduleId ||
    Number.isNaN(moduleId)
){

    alert(
        "No module was selected."
    );

}


// ============================================================
// GO BACK TO MODULE
// ============================================================

function getReturnSection(){

    if(type === "lecture"){

        return "classes";

    }

    if(type === "task"){

        return "assessments";

    }

    if(type === "person"){

        return "people";

    }

    if(type === "event"){

        return "academicEvents";

    }

    return "overview";

}


function goBack(){

    if(
        !moduleId ||
        Number.isNaN(moduleId)
    ){

        window.location.href =
            "23 moduleTrack.html";

        return;

    }


    const returnSection =
        getReturnSection();


    const modulePage =
        "23 moduleTrack.html?id=" +
        encodeURIComponent(
            moduleId
        ) +
        "&section=" +
        encodeURIComponent(
            returnSection
        );


    window.location.href =
        modulePage;

}


// ============================================================
// BACK BUTTON
// ============================================================

if(backButton){

    backButton.addEventListener(
        "click",
        function(event){

            event.preventDefault();

            goBack();

        }
    );

}


// ============================================================
// CANCEL BUTTONS
// ============================================================

const lectureCancel =
    document.getElementById(
        "lectureCancel"
    );

const taskCancel =
    document.getElementById(
        "taskCancel"
    );

const personCancel =
    document.getElementById(
        "personCancel"
    );

const eventCancel =
    document.getElementById(
        "eventCancel"
    );


if(lectureCancel){

    lectureCancel.addEventListener(
        "click",
        function(event){

            event.preventDefault();

            goBack();

        }
    );

}


if(taskCancel){

    taskCancel.addEventListener(
        "click",
        function(event){

            event.preventDefault();

            goBack();

        }
    );

}


if(personCancel){

    personCancel.addEventListener(
        "click",
        function(event){

            event.preventDefault();

            goBack();

        }
    );

}


if(eventCancel){

    eventCancel.addEventListener(
        "click",
        function(event){

            event.preventDefault();

            goBack();

        }
    );

}


// ============================================================
// ADD LECTURE
// ============================================================

const lectureFormElement =
    document.getElementById(
        "lectureFormElement"
    );


if(lectureFormElement){

    lectureFormElement.addEventListener(
        "submit",
        async function(event){

            event.preventDefault();


            const day =
                document.getElementById(
                    "lectureDay"
                ).value;

            const startTime =
                document.getElementById(
                    "lectureStartTime"
                ).value;

            const endTime =
                document.getElementById(
                    "lectureEndTime"
                ).value;

            const venue =
                document.getElementById(
                    "lectureVenue"
                ).value.trim();


            if(
                !day ||
                !startTime ||
                !endTime ||
                !venue
            ){

                alert(
                    "Please complete all required fields."
                );

                return;

            }


            try{

                const {
                    error
                } = await supabase
                    .from("lectures")
                    .insert({

                        module_id:
                            moduleId,

                        day:
                            day,

                        start_time:
                            startTime,

                        end_time:
                            endTime,

                        venue:
                            venue

                    });


                if(error){

                    throw error;

                }


                goBack();

            }

            catch(error){

                console.error(
                    "Could not add lecture:",
                    error
                );

                alert(
                    "Could not add the lecture.\n\n" +
                    error.message
                );

            }

        }
    );

}


// ============================================================
// ADD ASSESSMENT
// ============================================================

const taskFormElement =
    document.getElementById(
        "taskFormElement"
    );


if(taskFormElement){

    taskFormElement.addEventListener(
        "submit",
        async function(event){

            event.preventDefault();


            const title =
                document.getElementById(
                    "taskTitle"
                ).value.trim();

            const weight =
                document.getElementById(
                    "taskWeight"
                ).value.trim();

            const dueDate =
                document.getElementById(
                    "taskDueDate"
                ).value ||
                null;


            if(!title){

                alert(
                    "Please enter an assessment title."
                );

                return;

            }


            try{

                const {
                    data: userData,
                    error: userError
                } = await supabase.auth
                    .getUser();


                if(userError){

                    throw userError;

                }


                if(
                    !userData ||
                    !userData.user
                ){

                    alert(
                        "You must be logged in to add an assessment."
                    );

                    return;

                }


                const {
                    error
                } = await supabase
                    .from("assessments")
                    .insert({

                        user_id:
                            userData.user.id,

                        module_id:
                            moduleId,

                        title:
                            title,

                        weight:
                            weight ||
                            null,

                        due_date:
                            dueDate,

                        completed:
                            false

                    });


                if(error){

                    throw error;

                }


                goBack();

            }

            catch(error){

                console.error(
                    "Could not add assessment:",
                    error
                );

                alert(
                    "Could not add the assessment.\n\n" +
                    error.message
                );

            }

        }
    );

}


// ============================================================
// ADD PERSON
// ============================================================

const personFormElement =
    document.getElementById(
        "personFormElement"
    );


if(personFormElement){

    personFormElement.addEventListener(
        "submit",
        async function(event){

            event.preventDefault();


            const personType =
                document.getElementById(
                    "personType"
                ).value;

            const name =
                document.getElementById(
                    "personName"
                ).value.trim();

            const email =
                document.getElementById(
                    "personEmail"
                ).value.trim();


            if(
                !personType ||
                !name
            ){

                alert(
                    "Please complete all required fields."
                );

                return;

            }


            try{

                const table =
                    personType === "Lecturer"
                        ? "lecturers"
                        : "tutors";


                const {
                    error
                } = await supabase
                    .from(table)
                    .insert({

                        module_id:
                            moduleId,

                        name:
                            name,

                        email:
                            email ||
                            null

                    });


                if(error){

                    throw error;

                }


                goBack();

            }

            catch(error){

                console.error(
                    "Could not add person:",
                    error
                );

                alert(
                    "Could not add the person.\n\n" +
                    error.message
                );

            }

        }
    );

}


// ============================================================
// ADD ACADEMIC EVENT
// ============================================================

const eventFormElement =
    document.getElementById(
        "eventFormElement"
    );


if(eventFormElement){

    eventFormElement.addEventListener(
        "submit",
        async function(event){

            event.preventDefault();


            const title =
                document.getElementById(
                    "eventTitle"
                ).value.trim();

            const eventType =
                document.getElementById(
                    "eventType"
                ).value.trim();

            const startDate =
                document.getElementById(
                    "eventStartDate"
                ).value;

            const endDate =
                document.getElementById(
                    "eventEndDate"
                ).value ||
                null;

            const description =
                document.getElementById(
                    "eventDescription"
                ).value.trim();


            if(
                !title ||
                !startDate
            ){

                alert(
                    "Please complete all required fields."
                );

                return;

            }


            try{

                const {
                    error
                } = await supabase
                    .from("academic_events")
                    .insert({

                        module_id:
                            moduleId,

                        title:
                            title,

                        type:
                            eventType ||
                            null,

                        start_date:
                            startDate,

                        end_date:
                            endDate,

                        description:
                            description ||
                            null

                    });


                if(error){

                    throw error;

                }


                goBack();

            }

            catch(error){

                console.error(
                    "Could not add academic event:",
                    error
                );

                alert(
                    "Could not add the academic event.\n\n" +
                    error.message
                );

            }

        }
    );

}