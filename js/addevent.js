import { auth } from "../firebase.js";

import { supabase } from "./supabase.js";

//==================================================
// ELEMENTS
//==================================================

const eventType =
    document.getElementById("eventType");

const eventTitle =
    document.getElementById("eventTitle");

const eventModule =
    document.getElementById("eventModule");

const moduleGroup =
    document.getElementById("moduleGroup");

const eventDate =
    document.getElementById("eventDate");

const startTime =
    document.getElementById("startTime");

const endTime =
    document.getElementById("endTime");

const venue =
    document.getElementById("venue");

const description =
    document.getElementById("description");

const saveEvent =
    document.getElementById("saveEvent");

const backToSchedule =
    document.getElementById("backToSchedule");

//==================================================
// EDIT EVENT
//==================================================

const editParams =
    new URLSearchParams(
        window.location.search
    );

const editEventId =
    editParams.get("edit");

//==================================================
// AUTH
//==================================================

auth.onAuthStateChanged(
    async (user) => {

        if(!user){

            window.location.href =
                "03 Authentication.html";

            return;
        }

        await loadModules();

        if(editEventId){

            await loadEventForEdit();

        }

    }
);

//==================================================
// LOAD MODULES
//==================================================

async function loadModules(){

    if(!eventModule){

        return;

    }

    const user =
        auth.currentUser;

    if(!user){

        return;

    }

    const {
        data,
        error
    } = await supabase

        .from("modules")

        .select(
            "id, module_name, created_at"
        )

        .eq(
            "user_id",
            user.uid
        )

        .order(
            "created_at",
            {
                ascending: true
            }
        );

    if(error){

        console.error(
            "Could not load modules:",
            error
        );

        return;
    }

    eventModule.innerHTML = `
        <option value="">
            Select Module
        </option>
    `;

    (data || []).forEach(
        module => {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                module.id;

            option.textContent =
                module.module_name;

            eventModule.appendChild(
                option
            );

        }
    );

}

//==================================================
// LOAD EVENT FOR EDIT
//==================================================

async function loadEventForEdit(){

    const user =
        auth.currentUser;

    if(!user || !editEventId){

        return;

    }

    const {
        data,
        error
    } = await supabase

        .from("academic_events")

        .select("*")

        .eq(
            "id",
            editEventId
        )

        .eq(
            "user_id",
            user.uid
        )

        .single();

    if(error){

        console.error(
            "Could not load event:",
            error
        );

        alert(
            "Could not load this event."
        );

        return;

    }

    if(!data){

        alert(
            "Event could not be found."
        );

        return;

    }

    eventType.value =
        data.type || "";

    eventTitle.value =
        data.title || "";

    eventModule.value =
        data.module_id || "";

    eventDate.value =
        data.start_date || "";

    startTime.value =
        data.start_time || "";

    endTime.value =
        data.end_time || "";

    venue.value =
        data.venue || "";

    description.value =
        data.description || "";

    if(
        eventType.value ===
        "personal"
    ){

        moduleGroup.style.display =
            "none";

    }
    else{

        moduleGroup.style.display =
            "block";

    }

    saveEvent.textContent =
        "Save Changes";

}

//==================================================
// EVENT TYPE
//==================================================

if(eventType){

    eventType.addEventListener(
        "change",
        () => {

            if(
                eventType.value ===
                "personal"
            ){

                moduleGroup.style.display =
                    "none";

                eventModule.value =
                    "";

            }

            else{

                moduleGroup.style.display =
                    "block";

            }

        }
    );

}

//==================================================
// SAVE EVENT
//==================================================

if(saveEvent){

    saveEvent.addEventListener(
        "click",
        async () => {

            const user =
                auth.currentUser;

            if(!user){

                alert(
                    "Please login first."
                );

                return;
            }

            const title =
                eventTitle.value.trim();

            const type =
                eventType.value;

            const moduleId =
                eventModule.value || null;

            const date =
                eventDate.value;

            const start =
                startTime.value || null;

            const end =
                endTime.value || null;

            const eventVenue =
                venue.value.trim();

            const eventDescription =
                description.value.trim();

            //==================================================
            // REQUIRED FIELDS
            //==================================================

            if(
                !title ||
                !type ||
                !date
            ){

                alert(
                    "Please complete all required fields."
                );

                return;

            }

            //==================================================
            // CHECK TIME
            //==================================================

            if(
                start &&
                end &&
                end <= start
            ){

                alert(
                    "End time must be after the start time."
                );

                return;

            }

            //==================================================
            // CHECK MODULE
            //==================================================

            if(
                type !== "personal" &&
                !moduleId
            ){

                alert(
                    "Please select a module."
                );

                return;

            }

            saveEvent.disabled =
                true;

            saveEvent.textContent =
                "Saving...";

            console.log(
                "USER BEING SAVED:",
                user.id
            );

            try{

                //==================================================
                // EDIT EXISTING EVENT
                //==================================================

                if(editEventId){

                    const {
                        error
                    } = await supabase

                        .from("academic_events")

                        .update({

                            module_id:
                                moduleId,

                            title:
                                title,

                            type:
                                type,

                            start_date:
                                date,

                            end_date:
                                date,

                            start_time:
                                start,

                            end_time:
                                end,

                            venue:
                                eventVenue ||
                                null,

                            description:
                                eventDescription ||
                                null

                        })

                        .eq(
                            "id",
                            editEventId
                        )

                        .eq(
                            "user_id",
                            user.uid
                        );

                    if(error){

                        throw error;

                    }

                }

                //==================================================
                // ADD NEW EVENT
                //==================================================

                else{

                    const {
                        error
                    } = await supabase

                        .from("academic_events")

                        .insert({

                            user_id:
                                user.uid,

                            module_id:
                                moduleId,

                            title:
                                title,

                            type:
                                type,

                            start_date:
                                date,

                            end_date:
                                date,

                            start_time:
                                start,

                            end_time:
                                end,

                            venue:
                                eventVenue ||
                                null,

                            description:
                                eventDescription ||
                                null

                        });

                    if(error){

                        throw error;

                    }

                }

                window.location.href =
                    "11 schedule.html";

            }

            catch(error){

                console.error(
                    "Could not save the event:",
                    error
                );

                alert(
                    "Could not save the event.\n\n" +
                    error.message
                );

            }

            finally{

                saveEvent.disabled =
                    false;

                saveEvent.textContent =
                    "Save Event";

            }

        }
    );

}

//==================================================
// BACK TO SCHEDULE
//==================================================

if(backToSchedule){

    backToSchedule.addEventListener(
        "click",
        (event) => {

            event.preventDefault();

            window.location.href =
                "11 schedule.html";

        }
    );

}