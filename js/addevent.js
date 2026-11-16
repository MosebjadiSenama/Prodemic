import { auth } from "../firebase.js";

import { supabase } from "./supabase.js";

//==================================================
// ELEMENTS
//==================================================

const eventTitle =
    document.getElementById("eventTitle");

const eventModule =
    document.getElementById("eventModule");

const moduleGroup =
    document.getElementById("moduleGroup");

const eventDate =
    document.getElementById("eventDate");

const singleDateGroup =
    document.getElementById("singleDateGroup");

const dateRangeGroup =
    document.getElementById("dateRangeGroup");

const eventStartDate =
    document.getElementById("eventStartDate");

const eventEndDate =
    document.getElementById("eventEndDate");

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

const eventType =
     document.getElementById("eventType")

const otherEventType = 
    document.getElementById("otherEventType")

//Repeat options
const repeatGroup =
    document.getElementById("repeatGroup");
const repeatType = document.getElementById("repeatType");

const customRepeatGroup = 
    document.getElementById("customRepeatGroup");
const repeatInterval = 
   document.getElementById("repeatInterval");

const repeatUntilGroup =
  document.getElementById("repeatUntilGroup");
const repeatUntil = 
  document.getElementById("repeatUntil");

//==================================================
// EDIT EVENT
//==================================================

const editParams =
    new URLSearchParams(
        window.location.search
    );

const editEventId =
    editParams.get("edit");

const editEventType =
    editParams.get("type");

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
        No module selected
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

async function loadEventForEdit() {

    const user = auth.currentUser;

    if (!user || !editEventId || !editEventType) {
        alert("Missing event information.");
        return;
    }

    const tableMap = {
        lecture: "lectures",
        assessment: "assessments",
        academic_event: "academic_events"
    };

    const table = tableMap[editEventType];

    if (!table) {
        alert("Unknown event type.");
        return;
    }

    const { data, error } = await supabase
        .from(table)
        .select("*")
        .eq("id", editEventId)
        .eq("user_id", user.uid)
        .single();

    if (error || !data) {
        console.error("Could not load event:", error);
        alert("Could not find this event.");
        return;
    }

    // Restore the correct event type when editing
if (editEventType === "lecture") {

    eventType.value = "class";

} else if (editEventType === "assessment") {

    eventType.value = "assessment";

} else if (editEventType === "academic_event") {

    const availableTypes = Array.from(eventType.options)
        .map(option => option.value);

    if (availableTypes.includes(data.type)) {

        eventType.value = data.type;

    } else {

        // Restore custom event types using the Other option
        eventType.value = "other";
        otherEventType.value = data.type || "";
        otherEventType.style.display = "block";
        otherEventType.required = true;

    }

}

    eventTitle.value = data.title || "";
    eventModule.value = data.module_id || "";

   
    // Assessment date and time fields
if (editEventType === "assessment") {

    eventDate.value = data.due_date || "";

    startTime.value = data.due_time || "";
    endTime.value = "";

} else if (editEventType === "academic_event") {

    eventStartDate.value = data.start_date || "";
    eventEndDate.value = data.end_date || "";

    singleDateGroup.style.display = "none";
    dateRangeGroup.style.display = "flex";

    startTime.value = data.start_time || "";
    endTime.value = data.end_time || "";

} else {

    eventDate.value = data.start_date || "";

    startTime.value = data.start_time || "";
    endTime.value = data.end_time || "";

}

    venue.value = data.venue || "";
    description.value = data.description || "";

    // Restore class repetition settings
    if (editEventType === "lecture") {

        repeatGroup.style.display = "block";

        repeatType.value = data.repeat_type || "none";

        repeatInterval.value =
            data.repeat_interval || 1;

        repeatUntil.value =
            data.repeat_until || "";

        customRepeatGroup.style.display =
            repeatType.value === "custom" ? "block" : "none";

        repeatUntilGroup.style.display =
            repeatType.value !== "none" ? "block" : "none";

    } else {

        repeatGroup.style.display = "none";

    }

    moduleGroup.style.display =
        eventType.value === "personal" ? "none" : "block";

    saveEvent.textContent = "Save Changes";

    // Refresh the form visibility after loading the event
eventType.dispatchEvent(new Event("change"));
}
//==================================================
// EVENT TYPE
//==================================================

// Show date range and repeat options
function updateEventForm() {

    const selectedType = eventType.value;

    const isClass = selectedType === "class";
    const needsDateRange =
    selectedType === "academic_event" ||
    selectedType === "other";

    // Date fields
    singleDateGroup.style.display = needsDateRange
    ? "none"
    : "block";

    dateRangeGroup.style.display = needsDateRange
    ? "grid"
    : "none";

    // Repeat fields
    repeatGroup.style.display = isClass
        ? "block"
        : "none";

    if (!isClass) {
        repeatType.value = "none";
        customRepeatGroup.style.display = "none";
        repeatUntilGroup.style.display = "none";
    }
}

// Listen for event type changes
eventType.addEventListener("change", updateEventForm);

// Set correct visibility on page load
updateEventForm();


// Show custom repeat input when Custom is selected
repeatType.addEventListener("change", () => {
    const isCustom = repeatType.value === "custom";
    const shouldRepeat = repeatType.value !== "none";

    customRepeatGroup.style.display = isCustom ? "block" : "none";
    repeatUntilGroup.style.display = shouldRepeat ? "block" : "none";
});
//==================================================
// SAVE EVENT
//==================================================

if (saveEvent) {

    saveEvent.addEventListener("click", async () => {

        const user = auth.currentUser;

        if (!user) {
            alert("Please login first.");
            return;
        }

        const title = eventTitle.value.trim();
        const selectedType = eventType.value;

        const type = selectedType === "other"
            ? otherEventType.value.trim()
            : selectedType;

        const moduleId = eventModule.value || null;

        const date = eventDate.value;

        const startDate = eventStartDate.value;
        const endDate = eventEndDate.value;
        
        const start = startTime.value || null;
        const end = endTime.value || null;
        const eventVenue = venue.value.trim();
        const eventDescription = description.value.trim();

        if (!title || !type) {
    alert("Please complete all required fields.");
    return;
}

if (
    selectedType === "academic_event" ||
    selectedType === "other"
) {

    if (!startDate || !endDate) {
        alert("Please select both the start and end dates.");
        return;
    }


} else if (!date) {

    alert("Please select a date.");
    return;

}

        

        saveEvent.disabled = true;
        saveEvent.textContent = "Saving...";

        try {
 //edit events     
if (editEventId) {

    let tableName;
    let updateData;

    if (editEventType === "lecture") {

        tableName = "lectures";

        const selectedDate = new Date(date + "T00:00:00");

        updateData = {
            title: title,
            module_id: moduleId,
            start_date: date,
            end_date: date,
            start_time: start,
            end_time: end,
            venue: eventVenue || null,
            description: eventDescription || null,
            day: selectedDate.toLocaleDateString(
                "en-GB",
                { weekday: "long" }
            ),
            repeat_type: repeatType.value,
            repeat_interval:
                repeatType.value === "custom"
                    ? Number(repeatInterval.value) || 1
                    : repeatType.value === "biweekly" ? 14 : 1,
            repeat_until:
                repeatType.value === "none"
                    ? date
                    : repeatUntil.value || null
        };

    } else if (editEventType === "assessment") {

        tableName = "assessments";

        updateData = {
            title: title,
            module_id: moduleId,
            due_date: date,
            due_time: start
        };

    } else if (editEventType === "academic_event") {

        tableName = "academic_events";

        updateData = {
            title: title,
            type: type,
            module_id: moduleId,
            start_date: startDate,
            end_date: endDate,
            start_time: start,
            end_time: end,
            venue: eventVenue || null,
            description: eventDescription || null
        };

    } else {

        throw new Error("Unknown event type.");

    }

    const { error } = await supabase
        .from(tableName)
        .update(updateData)
        .eq("id", editEventId)
        .eq("user_id", user.uid);

    if (error) throw error;

} else {


                let tableName;

                switch (selectedType) {

                    case "assessment":
                        tableName = "assessments";
                        break;

                    case "class":
                        tableName = "lectures";
                        break;

                    case "academic_event":
                    case "study_session":
                    case "other":
                        tableName = "academic_events";
                        break;

                    default:
                        throw new Error("Invalid event type selected.");
                }

              let eventData;

if (selectedType === "assessment") {

    eventData = {
        user_id: user.uid,
        module_id: moduleId,
        title: title,
        weight: null,
        due_date: date,
        due_time: start,
        completed: false
    };

} else {

    
eventData = {
    user_id: user.uid,
    module_id: moduleId,
    title: title,

    start_date:
        selectedType === "academic_event" || selectedType === "other"
            ? startDate
            : date,

    end_date:
        selectedType === "academic_event" || selectedType === "other"
            ? endDate
            : date,

    start_time: start,
    end_time: end,

    venue: eventVenue || null,
    description: eventDescription || null
};


    // Save class-specific information
    if (selectedType === "class") {

        const selectedDate = new Date(date + "T00:00:00");

        const dayName = selectedDate.toLocaleDateString(
            "en-GB",
            { weekday: "long" }
        );

        const repeat = repeatType.value;

        eventData.day = dayName;
        eventData.repeat_type = repeat;

        eventData.repeat_interval =
            repeat === "custom"
                ? Number(repeatInterval.value) || 1
                : repeat === "biweekly" ? 14 : 1;

        eventData.repeat_until =
            repeat === "none"
                ? date
                : repeatUntil.value || null;
    }

}
                if (tableName === "academic_events") {
                    eventData.type = type;
                }

                const { error } = await supabase
                    .from(tableName)
                    .insert(eventData);

                if (error) throw error;

            }

// SHOW SUCCESS TOAST
const eventSavedToast = document.getElementById("eventSavedToast");

if (eventSavedToast) {

    eventSavedToast.querySelector("span").textContent =
        editEventId
            ? "Event updated successfully!"
            : "Event saved successfully!";

    eventSavedToast.classList.add("show");

    // Automatically hide the popup and return to schedule
    setTimeout(() => {
        eventSavedToast.classList.remove("show");

        setTimeout(() => {
            window.location.href = "11 schedule.html";
        }, 300);

    }, 1800);

} else {
    window.location.href = "11 schedule.html";
}

        } catch (error) {

            console.error("Error saving event:", error);

            alert("Could not save your event: " + error.message);

        } finally {

            saveEvent.disabled = false;

            saveEvent.textContent = editEventId
                ? "Save Changes"
                : "Save Event";

        }

    });

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


//other events input field for schedule page

if (eventType && otherEventType) {
    eventType.addEventListener("change", function (){

        if (this.value === "other") {

            otherEventType.style.display = "block";
            otherEventType.required = true;
        }

        else {
            otherEventType.style.display = "none"
            otherEventType.required = false;
            otherEventType.value = "";
        }

    });
}