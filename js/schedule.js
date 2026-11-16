import { auth } from "../firebase.js";
import { supabase } from "./supabase.js";

//==================================================
// ELEMENTS
//==================================================

const sidebar = document.getElementById("sidebar");
const sidebarToggle = document.getElementById("sidebarToggle");

const createOverlay = document.getElementById("createOverlay");
const navAdd = document.querySelector(".nav-add");
const closeSheet = document.getElementById("closeSheet");

const newModule = document.getElementById("newModule");
const newTask = document.getElementById("newTask");
const newLecture = document.getElementById("newLecture");
const newAssessment = document.getElementById("newAssessment");


const addLectureBtn =
    document.getElementById("addLectureBtn");

const scheduleList =
    document.getElementById("scheduleList");

const scheduleEmpty =
    document.getElementById("scheduleEmpty");

const lectureCount =
    document.getElementById("lectureCount");

const calendar =
    document.getElementById("calendar");

const view =
    document.getElementById("calendarView");

    const calendarTitle =
    document.getElementById("calendarTitle");

const calendarSubtitle =
    document.getElementById("calendarSubtitle");

const calendarPrevBtn =
    document.getElementById("prevBtn");

const calendarNextBtn =
    document.getElementById("nextBtn");







//==================================================
// DATA
//==================================================

let userModules = [];

let lectures = [];

let weeklyTopics = [];

let tasks = [];

let assessments = [];

let academicEvents = [];

let currentDate = new Date();

const scheduleParams =
    new URLSearchParams(
        window.location.search
    );

const requestedView =
    scheduleParams.get("view");

// DEFAULT SCHEDULE VIEW
const allowedViews = ["day", "week", "month"];

if (view) {
    view.value = allowedViews.includes(requestedView)
        ? requestedView
        : "day";
}


//==================================================
// AUTH
//==================================================

auth.onAuthStateChanged(
    async (user) => {

        if (!user) {
            return;
        }

        await Promise.all([

            loadModules(user.uid),

            loadLectures(user.uid),

            loadWeeklyTopics(user.uid),

            loadTasks(user.uid),

            loadAssessments(user.uid),

            loadAcademicEvents(user.uid)

        ]);

        updateCalendar();

    }
);

//==================================================
// LOAD MODULES
//==================================================

async function loadModules(userId) {

    const {
        data,
        error
    } = await supabase
        .from("modules")
        .select("*")
        .eq(
            "user_id",
            userId
        );

    if (error) {

        console.error(
            "MODULES LOAD ERROR:",
            error
        );

        userModules = [];

        return;

    }

    userModules = data || [];

}

//==================================================
// LOAD LECTURES
//==================================================

async function loadLectures(userId) {

    const {
        data,
        error
    } = await supabase
        .from("lectures")
        .select("*")
        .eq(
            "user_id",
            userId
        );

    if (error) {

        console.error(
            "LECTURES LOAD ERROR:",
            error
        );

        lectures = [];

        return;

    }

    lectures = data || [];

}

//==================================================
// LOAD WEEKLY TOPICS
//==================================================

async function loadWeeklyTopics(userId) {

    const {
        data,
        error
    } = await supabase
        .from("weekly_topics")
        .select("*")
        .eq(
            "user_id",
            userId
        );

    if (error) {

        console.error(
            "WEEKLY TOPICS LOAD ERROR:",
            error
        );

        weeklyTopics = [];

        return;

    }

    weeklyTopics = data || [];

}

//==================================================
// LOAD TASKS
//==================================================

async function loadTasks(userId) {

    const {
        data,
        error
    } = await supabase
        .from("tasks")
        .select("*")
        .eq(
            "user_id",
            userId
        );

    if (error) {

        console.error(
            "TASKS LOAD ERROR:",
            error
        );

        tasks = [];

        return;

    }

    tasks = data || [];

}

//==================================================
// LOAD ASSESSMENTS
//==================================================

async function loadAssessments(userId) {

    const {
        data,
        error
    } = await supabase
        .from("assessments")
        .select("*")
        .eq(
            "user_id",
            userId
        );

    if (error) {

        console.error(
            "ASSESSMENTS LOAD ERROR:",
            error
        );

        assessments = [];

        return;

    }

    assessments = data || [];

}

//==================================================
// LOAD ACADEMIC EVENTS
//==================================================

async function loadAcademicEvents(userId) {

    const {
        data,
        error
    } = await supabase
        .from("academic_events")
        .select("*")
        .eq(
            "user_id",
            userId
        );

    if (error) {

        console.error(
            "ACADEMIC EVENTS LOAD ERROR:",
            error
        );

        academicEvents = [];

        return;

    }

    academicEvents = data || [];

console.log(
    "CURRENT USER ID:",
    userId
);

console.log(
    "ACADEMIC EVENTS LOADED:",
    academicEvents
);

console.table(
    academicEvents.map(
        event => ({
            id: event.id,
            user_id: event.user_id,
            title: event.title,
            type: event.type,
            start_date: event.start_date,
            end_date: event.end_date
        })
    )
);}

//==================================================
// ADD EVENT
//==================================================

if (addLectureBtn) {

    addLectureBtn.addEventListener(
        "click",
        () => {

            window.location.href =
                "21 addevent.html";

        }
    );

}

//==================================================
// MODULE HELPERS
//==================================================

function getModule(moduleId) {

    return userModules.find(
        (module) =>
            String(module.id) ===
            String(moduleId)
    );

}

function getModuleColour(moduleId) {

    return (
        getModule(moduleId)?.colour ||
        "#3048C8"
    );

}

//==================================================
// DATE HELPERS
//==================================================

function isSameDate(
    dateA,
    dateB
) {

    return (

        dateA.getFullYear() ===
        dateB.getFullYear()

        &&

        dateA.getMonth() ===
        dateB.getMonth()

        &&

        dateA.getDate() ===
        dateB.getDate()

    );

}

function getDateString(date) {

    const year =
        date.getFullYear();

    const month =
        String(
            date.getMonth() + 1
        ).padStart(
            2,
            "0"
        );

    const day =
        String(
            date.getDate()
        ).padStart(
            2,
            "0"
        );

    return (
        `${year}-${month}-${day}`
    );

}

function startOfDay(date) {

    const result =
        new Date(date);

    result.setHours(
        0,
        0,
        0,
        0
    );

    return result;

}

function endOfDay(date) {

    const result =
        new Date(date);

    result.setHours(
        23,
        59,
        59,
        999
    );

    return result;

}

//==================================================
// ACADEMIC EVENT DATE HELPERS
//==================================================

function getEventStartDate(event) {

    if (!event || !event.start_date) {
        return null;
    }

    const value =
        String(
            event.start_date
        ).trim();

    if (!value) {
        return null;
    }

    if (
        /^\d{4}-\d{2}-\d{2}/.test(
            value
        )
    ) {

        const parts =
            value.substring(
                0,
                10
            ).split("-");

        return new Date(
            Number(parts[0]),
            Number(parts[1]) - 1,
            Number(parts[2]),
            0,
            0,
            0,
            0
        );

    }

    const parsedDate =
        new Date(value);

    if (
        isNaN(
            parsedDate.getTime()
        )
    ) {

        return null;
    }

    return new Date(
        parsedDate.getFullYear(),
        parsedDate.getMonth(),
        parsedDate.getDate(),
        0,
        0,
        0,
        0
    );
}

function getEventEndDate(event) {

    if (!event) {
        return null;
    }

    const value =
        String(
            event.end_date ||
            event.start_date ||
            ""
        ).trim();

    if (!value) {
        return null;
    }

    if (
        /^\d{4}-\d{2}-\d{2}/.test(
            value
        )
    ) {

        const parts =
            value.substring(
                0,
                10
            ).split("-");

        return new Date(
            Number(parts[0]),
            Number(parts[1]) - 1,
            Number(parts[2]),
            23,
            59,
            59,
            999
        );

    }

    const parsedDate =
        new Date(value);

    if (
        isNaN(
            parsedDate.getTime()
        )
    ) {

        return null;
    }

    return new Date(
        parsedDate.getFullYear(),
        parsedDate.getMonth(),
        parsedDate.getDate(),
        23,
        59,
        59,
        999
    );
}


//=====

function eventOverlapsDate(
    event,
    date
) {

    const start =
        getEventStartDate(
            event
        );

    const end =
        getEventEndDate(
            event
        );

    if (
        !start ||
        !end
    ) {

        return false;

    }

    const current =
        startOfDay(date);

    return (
        current <= end &&
        endOfDay(current) >= start
    );

}

//==================================================
// ACADEMIC EVENT TYPE
//==================================================

function getAcademicEventKind(
    event
) {

    const title =
        String(
            event?.title || ""
        ).toLowerCase();

    const type =
        String(
            event?.type || ""
        ).toLowerCase();

    const value =
        `${title} ${type}`;

    if (
        value.includes(
            "study break"
        )
    ) {

        return "study-break";

    }

    if (
        value.includes(
            "research break"
        ) ||
        value.includes(
            "research period"
        )
    ) {

        return "research-break";

    }

    if (
        value.includes(
            "vacation"
        )
    ) {

        return "vacation";

    }

    if (
        value.includes(
            "exam"
        )
    ) {

        return "exam";

    }

    if (
        value.includes(
            "test week"
        )
    ) {

        return "test-week";

    }

    if (
        value.includes(
            "presentation"
        )
    ) {

        return "presentation";

    }

    return "academic";

}

//==================================================
// REST PERIOD
//==================================================

function isRestPeriod(
    event
) {

    const kind =
        getAcademicEventKind(
            event
        );

    return (

        kind === "study-break" ||

        kind === "research-break" ||

        kind === "vacation"

    );

}

//==================================================
// MAJOR ACADEMIC PERIOD
//==================================================

function isMajorAcademicPeriod(event) {

    const kind = getAcademicEventKind(event);

    return [
        "study-break",
        "research-break",
        "vacation",
        "exam",
        "test-week",

    ].includes(kind);

}
//==================================================
// DAYS UNTIL
//==================================================

function getDaysUntil(
    event,
    referenceDate = currentDate
) {

    const start =
        getEventStartDate(
            event
        );

    if (!start) {
        return null;
    }

    const today =
        startOfDay(
            referenceDate
        );

    return Math.round(
        (
            start - today
        ) / 86400000
    );

}

//==================================================
// ACTIVE ACADEMIC EVENT
//==================================================

function isActiveAcademicEvent(
    event,
    referenceDate = currentDate
) {

    const start =
        getEventStartDate(
            event
        );

    const end =
        getEventEndDate(
            event
        );

    if (
        !start ||
        !end
    ) {

        return false;

    }

    const date =
        startOfDay(
            referenceDate
        );

    return (
        date >=
            startOfDay(start)

        &&

        date <=
            endOfDay(end)
    );

}

//==================================================
// ACADEMIC EVENT MESSAGE
//==================================================

function getAcademicEventMessage(
    event,
    referenceDate
) {

    const kind =
        getAcademicEventKind(
            event
        );

    const active =
        isActiveAcademicEvent(
            event,
            referenceDate
        );

    if (
        kind === "study-break"
    ) {

        return active

            ? "Take time to rest, recharge and do what you enjoy."

            : "Your study break is coming up. Finish what you can and use the break to recharge.";

    }

    if (
        kind === "research-break"
    ) {

        return active

            ? "Take some time to reset, recharge and come back refreshed."

            : "Your research break is coming up. Plan your work so you can use the break properly.";

    }

    if (
        kind === "vacation"
    ) {

        return active

            ? "Enjoy your break and take some time away from your academic work."

            : "Your vacation is coming up. Finish what you need to and prepare for your break.";

    }

    if (
        kind === "exam"
    ) {

        return active

            ? "Your exam period is here. Focus on preparation and take care of yourself."

            : "Your exam period is approaching. Start preparing early and review your notes.";

    }

    if (
        kind === "test-week"
    ) {

        return active

            ? "Your test week is here. Stay focused and give yourself time to rest."

            : "Your test week is approaching. Start preparing early so you are not rushing.";

    }

    return (
        event.description ||
        ""
    );

}

// REMOVE DUPLICATE ACADEMIC EVENTS
function removeDuplicateAcademicEvents(events) {
    const seen = new Set();

    return events.filter(event => {
        const start = getEventStartDate(event);
        const end = getEventEndDate(event);

        if (!start || !end) return true;

        const startDate = getDateString(start);
        const endDate = getDateString(end);

        let key;

        if (isMajorAcademicPeriod(event)) {
            // Treat shared periods as one event across all modules
            key = `${getAcademicEventKind(event)}-${startDate}-${endDate}`;
        } else {
            // Prevent identical imported events from appearing repeatedly
            key = [
                String(event.title || "").trim().toLowerCase(),
                String(event.type || "").trim().toLowerCase(),
                startDate,
                endDate,
                event.start_time || "",
                event.end_time || ""
            ].join("-");
        }

        if (seen.has(key)) return false;

        seen.add(key);
        return true;
    });
}

///==================================================
// FIND ACADEMIC PERIODS
//==================================================

function getAcademicPeriodsForRange(rangeStart, rangeEnd) {
    const start = startOfDay(rangeStart);
    const end = endOfDay(rangeEnd);

    const matchingEvents = academicEvents.filter(event => {
        if (!isMajorAcademicPeriod(event)) return false;

        const eventStart = getEventStartDate(event);
        const eventEnd = getEventEndDate(event);

        return (
            eventStart &&
            eventEnd &&
            eventStart <= end &&
            eventEnd >= start
        );
    });

    return removeDuplicateAcademicEvents(matchingEvents);
}

//==================================================
// ACADEMIC BANNER HEADING
//==================================================

function getAcademicBannerHeading(
    event,
    referenceDate
) {

    const kind =
        getAcademicEventKind(
            event
        );

    const active =
        isActiveAcademicEvent(
            event,
            referenceDate
        );

    const days =
        getDaysUntil(
            event,
            referenceDate
        );

    if (
        kind === "study-break"
    ) {

        return active

            ? "It’s your study break!"

            : `Study Break in ${Math.max(
                days ?? 0,
                0
            )} days`;

    }

    if (
        kind === "research-break"
    ) {

        return active

            ? "It’s your research break!"

            : `Research Break in ${Math.max(
                days ?? 0,
                0
            )} days`;

    }

    if (
        kind === "vacation"
    ) {

        return active

            ? "It’s vacation time!"

            : `Vacation in ${Math.max(
                days ?? 0,
                0
            )} days`;

    }

    if (
        kind === "exam"
    ) {

        return active

            ? "Your exam period is here"

            : `Exam Period in ${Math.max(
                days ?? 0,
                0
            )} days`;

    }

    if (
        kind === "test-week"
    ) {

        return active

            ? "Test week is here"

            : `Test Week in ${Math.max(
                days ?? 0,
                0
            )} days`;

    }

    return (
        event.title ||
        "Academic Period"
    );

}

//==================================================
// ACADEMIC PERIOD BANNER
//==================================================

function renderAcademicPeriodBanner(
    container,
    event,
    referenceDate
) {

    if (
        !container ||
        !event
    ) {

        return;

    }

    const start =
        getEventStartDate(
            event
        );

    const end =
        getEventEndDate(
            event
        );

    if (
        !start ||
        !end
    ) {

        return;

    }

    const active =
        isActiveAcademicEvent(
            event,
            referenceDate
        );

    const kind =
        getAcademicEventKind(
            event
        );

    const badge =
        active
            ? "HAPPENING NOW"
            : "UPCOMING";

    const startText =
        start.toLocaleDateString(
            "en-GB",
            {
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );

    const endText =
        end.toLocaleDateString(
            "en-GB",
            {
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );

    const banner =
        document.createElement(
            "section"
        );

    banner.className =
        `academic-period-banner ${kind}`;

    banner.innerHTML = `

        <div class="academic-period-content">

            <span class="academic-period-status-badge">
                ${badge}
            </span>

            <h2>
                ${getAcademicBannerHeading(
                    event,
                    referenceDate
                )}
            </h2>

            <p class="academic-period-dates">
                ${startText} – ${endText}
            </p>

            <p class="academic-period-message">
                ${getAcademicEventMessage(
                    event,
                    referenceDate
                )}
            </p>

        </div>

    `;

    container.appendChild(
        banner
    );

}

// ==========================================
// GROUPED ACADEMIC EVENTS PANEL
// ==========================================


function renderAcademicEventsPanel(
    container,
    events,
    referenceDate
) {

    if (!container || !events || events.length === 0) {
        return;
    }

    const panel = document.createElement("section");
     panel.className = "academic-events-panel";
    const monthName = referenceDate.toLocaleDateString(
        "en-GB",
        {
            month: "long",
            year: "numeric"
        }
    );

    panel.innerHTML = `
        <div class="academic-events-header">

            <div class="academic-events-icon">
                <i class="fa-regular fa-calendar-days"></i>
            </div>

            <div class="academic-events-heading">
                <h3>Academic Events</h3>
                <p>${events.length} upcoming events</p>
            </div>

            <button
             class="academic-events-toggle"
            type="button"
            aria-label="Expand academic events"
           >
            <i class="fa-solid fa-chevron-down"></i>
           </button>

        </div>

        <div class="academic-events-list"></div>
    `;

    const eventList = panel.querySelector(
        ".academic-events-list"
    );

    events.forEach(event => {

        const start = getEventStartDate(event);
        const end = getEventEndDate(event);

        if (!start || !end) return;

        const startText = start.toLocaleDateString(
            "en-GB",
            {
                day: "numeric",
                month: "short"
            }
        );

        const endText = end.toLocaleDateString(
            "en-GB",
            {
                day: "numeric",
                month: "short"
            }
        );

        const dateText =
            start.toDateString() === end.toDateString()
                ? startText
                : `${start.getDate()} – ${endText}`;

        const row = document.createElement("div");
        row.className = "academic-event-row";

        const dateBadge = document.createElement("div");
        dateBadge.className = "academic-event-date";

        dateBadge.innerHTML = `
            <i class="fa-regular fa-calendar"></i>
            <span>${dateText}</span>
        `;

        const divider = document.createElement("div");
        divider.className = "academic-event-divider";

        const details = document.createElement("div");
        details.className = "academic-event-details";

        const title = document.createElement("h4");
        title.textContent = event.title || "Academic Event";

        const description = document.createElement("p");
        description.textContent = getAcademicEventMessage(
            event,
            referenceDate
        );

details.appendChild(title);
details.appendChild(description);

// ACTION BUTTONS
const actions = document.createElement("div");
actions.className = "academic-event-actions";

const editBtn = document.createElement("button");
editBtn.className = "academic-event-edit";
editBtn.type = "button";
editBtn.title = "Edit academic event";
editBtn.innerHTML = '<i class="fa-regular fa-pen-to-square"></i>';

const deleteBtn = document.createElement("button");
deleteBtn.className = "academic-event-delete";
deleteBtn.type = "button";
deleteBtn.title = "Delete academic event";
deleteBtn.innerHTML = '<i class="fa-regular fa-trash-can"></i>';

// EDIT EVENT
editBtn.addEventListener("click", () => {
    editScheduleEvent(event, "academic_event");
});

// DELETE EVENT
deleteBtn.addEventListener("click", () => {
    deleteScheduleEvent(event, "academic_event");
});

actions.appendChild(editBtn);
actions.appendChild(deleteBtn);

row.appendChild(dateBadge);
row.appendChild(divider);
row.appendChild(details);
row.appendChild(actions);

eventList.appendChild(row);

    });

    // Collapse / expand functionality

    const toggle = panel.querySelector(
        ".academic-events-toggle"
    );

    toggle.addEventListener("click", () => {

        const collapsed = panel.classList.toggle("collapsed");

        toggle.innerHTML = collapsed
            ? '<i class="fa-solid fa-chevron-down"></i>'
            : '<i class="fa-solid fa-chevron-up"></i>';

        toggle.setAttribute(
            "aria-label",
            collapsed
                ? "Expand academic events"
                : "Collapse academic events"
        );

    });

    container.appendChild(panel);

}
//==================================================
// WEEK HELPERS
//==================================================

function getWeekStart(date) {

    const result =
        startOfDay(date);

    const day =
        result.getDay();

    result.setDate(
        result.getDate() -
        (
            day === 0
                ? 6
                : day - 1
        )
    );

    return result;

}

function getWeekDates(date) {

    const start =
        getWeekStart(date);

    return Array.from(
        {
            length: 7
        },
        (
            _,
            index
        ) => {

            const result =
                new Date(start);

            result.setDate(
                start.getDate() +
                index
            );

            return result;

        }
    );

}

//==================================================

function isLectureOnDate(lecture, date) {

    const selected = getDateString(date);

    // If the lecture has a start date, use the existing
    // date and repetition rules.
    if (lecture.start_date) {

        const start = String(lecture.start_date).slice(0, 10);
        const repeat = lecture.repeat_type || "none";

        const until = lecture.repeat_until
            ? String(lecture.repeat_until).slice(0, 10)
            : null;

        if (selected < start) return false;
        if (until && selected > until) return false;

        if (repeat === "none") {
            return selected === start;
        }

        const startDate = new Date(start + "T00:00:00Z");
        const selectedDate = new Date(selected + "T00:00:00Z");

        const difference = Math.round(
            (selectedDate - startDate) / 86400000
        );

        if (repeat === "daily") return true;
        if (repeat === "weekly") return difference % 7 === 0;
        if (repeat === "biweekly") return difference % 14 === 0;

        if (repeat === "custom") {
            const interval = Math.max(
                1,
                Number(lecture.repeat_interval) || 1
            );

            return difference % interval === 0;
        }

        return false;
    }

    // Imported classes without start_date:
    // match their saved weekday against the selected date.
    if (lecture.day) {

        const days = [
            "sunday",
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday"
        ];

        const savedDay = String(lecture.day)
            .trim()
            .toLowerCase();

        const selectedDay = days[date.getDay()];

        return (
            savedDay === selectedDay ||
            savedDay === selectedDay.slice(0, 3)
        );
    }

    return false;
}

//==================================================
// GET LECTURES FOR DATE
//==================================================

function getLecturesForDate(date) {

    const rest = academicEvents.some(event =>
        isRestPeriod(event) &&
        eventOverlapsDate(event, date)
    );

    if (rest) return [];

    return lectures
        .filter(lecture => isLectureOnDate(lecture, date))
        .sort((a, b) =>
            String(a.start_time || "").localeCompare(
                String(b.start_time || "")
            )
        );
}



//==================================================
// GET TASKS FOR DATE
//==================================================

function getTasksForDate(
    date
) {

    const dateString =
        getDateString(date);

    return tasks
        .filter(
            task => {

                if (!task.due_date) {
                    return false;
                }

                const value =
                    String(
                        task.due_date
                    ).trim();

                let normalizedDate = "";

                if (
                    /^\d{4}-\d{2}-\d{2}/.test(
                        value
                    )
                ) {

                    normalizedDate =
                        value.substring(
                            0,
                            10
                        );

                } else {

                    const parsedDate =
                        new Date(value);

                    if (
                        !isNaN(
                            parsedDate.getTime()
                        )
                    ) {

                        normalizedDate =
                            `${parsedDate.getFullYear()}-${String(
                                parsedDate.getMonth() + 1
                            ).padStart(2, "0")}-${String(
                                parsedDate.getDate()
                            ).padStart(2, "0")}`;

                    }

                }

                return (
                    normalizedDate ===
                    dateString
                );

            }
        )
        .sort(
            (a, b) =>
                String(
                    a.due_time ||
                    "23:59"
                ).localeCompare(
                    String(
                        b.due_time ||
                        "23:59"
                    )
                )
        );

}

//==================================================
// GET ASSESSMENTS FOR DATE
//==================================================

function getAssessmentsForDate(
    date
) {

    const dateString =
        getDateString(date);

    return assessments
        .filter(
            assessment => {

                const dueDate =
                    assessment.due_date ||
                    assessment.date;

                if (!dueDate) {
                    return false;
                }

                const value =
                    String(dueDate).trim();

                let normalizedDate = "";

                if (
                    /^\d{4}-\d{2}-\d{2}/.test(
                        value
                    )
                ) {

                    normalizedDate =
                        value.substring(
                            0,
                            10
                        );

                } else {

                    const parsedDate =
                        new Date(value);

                    if (
                        !isNaN(
                            parsedDate.getTime()
                        )
                    ) {

                        normalizedDate =
                            `${parsedDate.getFullYear()}-${String(
                                parsedDate.getMonth() + 1
                            ).padStart(2, "0")}-${String(
                                parsedDate.getDate()
                            ).padStart(2, "0")}`;

                    }

                }

                return (
                    normalizedDate ===
                    dateString
                );

            }
        )
        .sort(
            (a, b) =>
                String(
                    a.due_time ||
                    "23:59"
                ).localeCompare(
                    String(
                        b.due_time ||
                        "23:59"
                    )
                )
        );

}
      

//==================================================
// GET TOPICS FOR DATE
//==================================================

function getTopicsForDate(
    date
) {

    const current =
        startOfDay(date);

    return weeklyTopics.filter(
        topic => {

            if (
                !topic.start_date ||
                !topic.end_date
            ) {

                return false;

            }

            const start =
                startOfDay(
                    new Date(
                        `${String(
                            topic.start_date
                        ).slice(
                            0,
                            10
                        )}T00:00:00`
                    )
                );

            const end =
                endOfDay(
                    new Date(
                        `${String(
                            topic.end_date
                        ).slice(
                            0,
                            10
                        )}T00:00:00`
                    )
                );

            return (
                current >= start &&
                current <= end
            );

        }
    );

}

//==================================================
// ACADEMIC EVENTS FOR DATE
//==================================================

function getAcademicEventsForDate(date) {
    return academicEvents
        .filter(event => {
            // Multi-day academic periods belong in the top banners only.
            if (isMajorAcademicPeriod(event)) return false;

            return eventOverlapsDate(event, date);
        })
        .sort((a, b) =>
            String(a.start_time || "").localeCompare(
                String(b.start_time || "")
            )
        );
}
//==================================================
// MONTH EVENTS
//
// IMPORTANT:
// academicEvents are intentionally NOT included.
// Study breaks, exams, vacations, etc.
// are shown only in the banner at the top.
//==================================================

function getEventsForDate(
    date
) {

    const result = [];

    getLecturesForDate(
        date
    ).forEach(
        lecture => {

            const module =
                getModule(
                    lecture.module_id
                );

            result.push({

                type: "class",

                title:
                    module?.module_name ||
                    "Class",

                colour:
                    module?.colour ||
                    "#3048C8",

                time:
                    lecture.start_time ||
                    "",

                data:
                    lecture

            });

        }
    );

    getTasksForDate(
        date
    ).forEach(
        task => {

            result.push({

                type: "task",

                title:
                    task.title ||
                    "Task",

                colour:
                    getModuleColour(
                        task.module_id
                    ),

                time:
                    task.due_time ||
                    "00:00",

                data:
                    task

            });

        }
    );

    getAssessmentsForDate(
        date
    ).forEach(
        assessment => {

            result.push({

                type:
                    "assessment",

                title:
                    assessment.title ||
                    "Assessment",

                colour:
                    "#7C3AED",

                time:
                    assessment.due_time ||
                    "00:00",

                data:
                    assessment

            });

        }
    );

        // ACADEMIC EVENTS
    getAcademicEventsForDate(date).forEach(event => {

        const module = getModule(event.module_id);

        result.push({
            type: "academic_event",
            title: event.title || "Academic Event",
            colour: module?.colour || "#3048C8",
            time: event.start_time || "00:00",
            data: event
        });

    });
    return result.sort(
        (a, b) =>
            String(
                a.time
            ).localeCompare(
                String(
                    b.time
                )
            )
    );

}

//==================================================
// DUE LABEL
//==================================================

function formatDueLabel(
    date
) {

    const today =
        startOfDay(
            new Date()
        );

    const target =
        startOfDay(
            date
        );

    if (
        isSameDate(
            today,
            target
        )
    ) {

        return "Due today";

    }

    return (
        `Due ${target.toLocaleDateString(
            "en-GB",
            {
                day: "numeric",
                month: "short"
            }
        )}`
    );

}


//==================================================
// SAVE EVENT COMPLETION
//==================================================

async function saveScheduleEventCompletion(item, type, completed) {

    const userId = auth.currentUser?.uid;

    const tables = {
        lecture: "lectures",
        task: "tasks",
        assessment: "assessments",
        academic_event: "academic_events",
        weekly_topic: "weekly_topics"
    };

    const table = tables[type];

    if (!userId || !table || !item?.id) {
        console.error("Missing event information:", {
            type,
            item
        });

        return false;
    }

    const { error } = await supabase
        .from(table)
        .update({
            completed: completed
        })
        .eq("id", item.id)
        .eq("user_id", userId);

    if (error) {
        console.error("EVENT COMPLETION ERROR:", error);
        return false;
    }

    item.completed = completed;

    return true;
}

//==================================================
// ADD EVENT COMPLETION CHECKBOX
//==================================================
function addEventCompletionCheckbox(
    card,
    item,
    type,
    insertInto = null
) {
    const checkbox = document.createElement("input");

    card.style.setProperty(
        "--event-colour",
        getModuleColour(item.module_id)
    );

    checkbox.type = "checkbox";
    checkbox.className = "schedule-event-checkbox";
    checkbox.checked = item.completed === true;

    checkbox.setAttribute(
        "aria-label",
        "Mark event as completed"
    );

    const applyCompletion = (completed) => {
        card.classList.toggle("completed", completed);


           const title = card.querySelector(
    ".lecture-details h3, .lecture-details h4, .schedule-event-title, .lecture-event strong, .task-event strong"
);

        if (title) {
            title.classList.toggle("is-completed", completed);
        }

        const status = card.querySelector(".schedule-task-status");

        if (status && type === "task") {
            status.textContent = completed
                ? "Completed"
                : formatDueLabel(
                    new Date(
                        `${String(item.due_date).slice(0, 10)}T00:00:00`
                    )
                );
        }
    };

    applyCompletion(checkbox.checked);

    checkbox.addEventListener("click", event => {
        event.stopPropagation();
    });

    checkbox.addEventListener("change", async event => {
        event.stopPropagation();

        const completed = checkbox.checked;

        applyCompletion(completed);
        checkbox.disabled = true;

        const saved = await saveScheduleEventCompletion(
            item,
            type,
            completed
        );

        if (!saved) {
            checkbox.checked = !completed;
            applyCompletion(!completed);
        }

        checkbox.disabled = false;
    });

    const target =
        insertInto ||
        card.querySelector(".lecture-main") ||
        card;

    target.prepend(checkbox);
}

//==================================================
// PRIORITY TOAST NOTIFICATION
//==================================================


function showPriorityToast(message, isPriority) {
    let toast = document.getElementById("priorityToast");

    if (!toast) {
        toast = document.createElement("div");
        toast.id = "priorityToast";
        toast.className = "priority-toast";
        document.body.appendChild(toast);
    }

    toast.innerHTML = `
        <div class="priority-toast-icon">
            <i class="fa-solid fa-star"></i>
        </div>

        <div class="priority-toast-copy">
            <strong>${isPriority ? "Added to priorities" : "Priority removed"}</strong>
            <small>${message}</small>
        </div>
    `;

    toast.classList.toggle("removed", !isPriority);
    toast.classList.remove("show");

    requestAnimationFrame(() => {
        toast.classList.add("show");
    });

    clearTimeout(toast.hideTimer);

    toast.hideTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}

//==================================================
// SCHEDULE EVENT PRIORITY
//==================================================

function addSchedulePriorityToggle(card, item, table) {

    const isPriority =
        item.priority === true ||
        item.priority === "true";

    const title = card.querySelector(
    ".schedule-event-title, .timeline-event strong"
     );

    if (!title) return;

    const titleRow = document.createElement("div");
    titleRow.className = "schedule-task-title-row";

    title.parentNode.insertBefore(titleRow, title);
    titleRow.appendChild(title);

    const priorityButton = document.createElement("button");

    priorityButton.type = "button";
    priorityButton.className =
        `task-priority-toggle ${isPriority ? "active" : ""}`;

    priorityButton.setAttribute(
        "aria-label",
        isPriority ? "Remove priority" : "Mark as priority"
    );

    priorityButton.setAttribute("aria-pressed", String(isPriority));
    priorityButton.title = isPriority ? "Remove priority" : "Mark as priority";

    priorityButton.innerHTML = `
        <i class="${isPriority ? "fa-solid" : "fa-regular"} fa-star"></i>
    `;
// Day view: place the star directly inside the event card.

if (card.classList.contains("timeline-event")) {
    card.appendChild(priorityButton);
} else {
    titleRow.appendChild(priorityButton);
}

    priorityButton.addEventListener("click", async event => {

        event.stopPropagation();

        const newPriority = !(
            item.priority === true ||
            item.priority === "true"
        );

        const userId = auth.currentUser?.uid;

        if (!userId) return;

        priorityButton.disabled = true;

        const { error } = await supabase
            .from(table)
            .update({ priority: newPriority })
            .eq("id", item.id)
            .eq("user_id", userId);

        if (error) {
            console.error("Could not update event priority:", error);
            priorityButton.disabled = false;
            return;
        }

       item.priority = newPriority;

        showPriorityToast(
         newPriority
        ? "Priority added — this event is now a priority."
        : "Priority removed — this event is no longer prioritised.",
    newPriority
     );

     priorityButton.classList.toggle("active", newPriority);

        priorityButton.innerHTML = `
            <i class="${newPriority ? "fa-solid" : "fa-regular"} fa-star"></i>
        `;

        priorityButton.setAttribute("aria-pressed", String(newPriority));

        priorityButton.setAttribute(
            "aria-label",
            newPriority ? "Remove priority" : "Mark as priority"
        );

        priorityButton.title =
            newPriority ? "Remove priority" : "Mark as priority";

        priorityButton.disabled = false;

    });
}
//==================================================
// LECTURE CARD
//==================================================

function createLectureCard(
    lecture
) {

    const module =
        getModule(
            lecture.module_id
        );

    const colour =
        module?.colour ||
        "#3048C8";

    const card =
        document.createElement(
            "div"
        );

    card.className =
        "week-lecture";

    card.innerHTML = `

        <div
            class="lecture-bar"
            style="background:${colour}"
        ></div>

        <div class="lecture-main">

            <div class="lecture-time">

                <strong>
                    ${lecture.start_time || "--:--"}
                </strong>

                <span>
                    ${lecture.end_time || "--:--"}
                </span>

            </div>

            <div class="lecture-details">

                <p
                    class="event-type"
                    style="color:${colour}"
                >
                    Class
                </p>

                  <h3 class="schedule-event-title">
                         ${module?.module_name || "Unknown Module"}
                  </h3>
                <p class="event-module">
                    ${lecture.venue || "No venue"}
                </p>

            </div>

               </div>

    `;


//==================================================
// EVENT ACTION MENU
 //==================================================

    addEventCompletionCheckbox(
    card,
    lecture,
    "lecture"
);
addSchedulePriorityToggle(card, lecture, "lectures");

card.addEventListener(
    "click",
    event => {

        if (event.target.closest(".schedule-event-checkbox")) {
            return;
        }

        event.stopPropagation();

        openEventActionMenu(
            lecture,
            "lecture",
            card
        );

    }
);

return card;}

//==================================================
// UPDATE TASK COMPLETION
//==================================================

async function saveScheduleTaskCompletion(task, completed) {

    const userId = auth.currentUser?.uid;

    if (!userId) {
        console.error("No authenticated user found.");
        return false;
    }

    const { error } = await supabase
        .from("tasks")
        .update({
            completed: completed
        })
        .eq("id", task.id)
        .eq("user_id", userId);

    if (error) {
        console.error("TASK COMPLETION UPDATE ERROR:", error);
        return false;
    }

    task.completed = completed;

    const matchingTask = tasks.find(
        item => String(item.id) === String(task.id)
    );

    if (matchingTask) {
        matchingTask.completed = completed;
    }

    return true;
}
//==================================================
// TASK CARD
//==================================================
function createTaskCard(task) {

    const colour = getModuleColour(task.module_id);

    const moduleName =
        task.module_name ||
        getModule(task.module_id)?.module_name ||
        "";

    const dueDate = new Date(
        `${String(task.due_date).slice(0, 10)}T00:00:00`
    );

    const isCompleted = task.completed === true;

    const isPriority =
        task.priority === true ||
        task.priority === "true";

    const card = document.createElement("div");

    card.className = `week-lecture task-card-event ${isCompleted ? "completed" : ""}`;

    card.innerHTML = `

        <div
            class="lecture-bar"
            style="background:${colour}"
        ></div>

        <div class="lecture-main">

            <div class="lecture-time">

                <strong>${task.due_time || "--:--"}</strong>

                <span>Due</span>

            </div>

            <div class="lecture-details">

                <p class="event-type" style="color:${colour}">
                    Task
                </p>

               <div class="schedule-task-title-row">

    <h3 class="schedule-task-title ${isCompleted ? "is-completed" : ""}">
        ${task.title || "Task"}
    </h3>

    <button
        type="button"
        class="task-priority-toggle ${isPriority ? "active" : ""}"
        aria-label="${isPriority ? "Remove priority" : "Mark as priority"}"
        aria-pressed="${isPriority}"
        title="${isPriority ? "Remove priority" : "Mark as priority"}"
    >
        <i class="${isPriority ? "fa-solid" : "fa-regular"} fa-star"></i>
    </button>

</div>

                ${moduleName ? `
                    <p class="event-module">${moduleName}</p>
                ` : ""}

                <span class="event-due schedule-task-status">
                    ${isCompleted ? "Completed" : formatDueLabel(dueDate)}
                </span>

        

            </div>

        </div>
    `;

   
addEventCompletionCheckbox(card, task, "task");


// TOGGLE TASK PRIORITY
const priorityButton = card.querySelector(".task-priority-toggle");

priorityButton.addEventListener("click", async event => {
    event.stopPropagation();

    const previousPriority =
        task.priority === true || task.priority === "true";

    const newPriority = !previousPriority;
    const userId = auth.currentUser?.uid;

    if (!userId) return;

    priorityButton.disabled = true;

    const { error } = await supabase
        .from("tasks")
        .update({ priority: newPriority })
        .eq("id", task.id)
        .eq("user_id", userId);

    if (error) {
        console.error("Could not update task priority:", error);
        priorityButton.disabled = false;
        return;
    }

    task.priority = newPriority;
    //popup

    showPriorityToast(
    newPriority
        ? "Priority added — this task is now a priority."
        : "Priority removed — this task is no longer prioritised.",
    newPriority
);

    priorityButton.classList.toggle("active", newPriority);

    priorityButton.innerHTML = `
        <i class="${newPriority ? "fa-solid" : "fa-regular"} fa-star"></i>
    `;

    priorityButton.setAttribute("aria-pressed", String(newPriority));
    priorityButton.setAttribute(
        "aria-label",
        newPriority ? "Remove priority" : "Mark as priority"
    );

    priorityButton.title =
        newPriority ? "Remove priority" : "Mark as priority";

    priorityButton.disabled = false;
});
    card.addEventListener("click", event => {

        if (event.target.closest(".schedule-event-checkbox")) {
            return;
        }

        event.stopPropagation();

        openEventActionMenu(task, "task", card);

    });

    return card;
}//==================================================
// ASSESSMENT CARD
//==================================================

function createAssessmentCard(
    assessment
) {
    //get module colour
const colour = getModuleColour(assessment.module_id);

    const card =
        document.createElement(
            "div"
        );

    card.className =
        "week-lecture assessment-card-event";

    card.innerHTML = `

        <div
            class="lecture-bar"
            style="background:${colour}"
        ></div>

        <div class="lecture-main">

            <div class="lecture-time">

                <strong>
                    ${assessment.due_time || "--:--"}
                </strong>

                <span>
                    Due
                </span>

            </div>

            <div class="lecture-details">

                <p
                    class="event-type"
                    style="color:${colour}"
                >
                    Assessment
                </p>

                    <h3 class="schedule-event-title">
                         ${assessment.title || "Assessment"}
                    </h3>

                <p class="event-module">
                    ${
                        getModule(
                            assessment.module_id
                        )?.module_name ||
                        "General"
                    }
                </p>

            </div>

              </div>

    `;

    // ADD COMPLETION CHECKBOX
    addEventCompletionCheckbox(
        card,
        assessment,
        "assessment"
    );

    addSchedulePriorityToggle(card, assessment, "assessments");
    //==================================================
    // EVENT ACTION MENU
    //==================================================

    card.addEventListener(
    "click",
    event => {

        // Do not open the edit/delete menu when ticking the checkbox
        if (event.target.closest(".schedule-event-checkbox")) {
            return;
        }

        event.stopPropagation();

        openEventActionMenu(
            assessment,
            "assessment",
            card
        );

    }
);


    return card;

}


//==================================================
// ACADEMIC EVENT CARD
//==================================================

function createAcademicEventCard(
    event
) {

    const module =
        getModule(
            event.module_id
        );

    const colour =
        module?.colour ||
        "#3048C8";

    const card =
        document.createElement(
            "div"
        );

    card.className =
        "week-lecture";

    card.innerHTML = `

        <div
            class="lecture-bar"
            style="background:${colour}"
        ></div>

        <div class="lecture-main">

            <div class="lecture-time">

                <strong>
                    ${event.start_time || "--:--"}
                </strong>

                <span>
                    ${event.end_time || " "}
                </span>

            </div>

            <div class="lecture-details">

                <p
                    class="event-type"
                    style="color:${colour}"
                >
                    ${event.type || "Event"}
                </p>

                <h3 class="schedule-event-title">
                   ${event.title || "Event"}
                  </h3>

                <p class="event-module">

                    ${
                        module?.module_name ||
                        event.venue ||
                        "Personal"
                    }

                </p>

                ${
                    event.venue
                        ? `
                            <span class="event-due">
                                ${event.venue}
                            </span>
                        `
                        : ""
                }

            </div>

               </div>

    `;

        // ADD COMPLETION CHECKBOX
    addEventCompletionCheckbox(
        card,
        event,
        "academic_event"
    );
    addSchedulePriorityToggle(card, event, "academic_events");

    //==================================================
    // EVENT ACTION MENU
    //==================================================

    card.addEventListener(
    "click",
    clickEvent => {

        // Do not open the edit/delete menu when ticking the checkbox
        if (clickEvent.target.closest(".schedule-event-checkbox")) {
            return;
        }

        clickEvent.stopPropagation();

        openEventActionMenu(
            event,
            "academic_event",
            card
        );

    }
);


    return card;

}

//==================================================
// TOPIC CARD
//==================================================

function createTopicCard(
    topic
) {

    const card =
        document.createElement(
            "div"
        );

    card.className =
        "week-lecture";

    card.innerHTML = `

        <div
            class="lecture-bar"
            style="background:#4F46E5"
        ></div>

        <div class="lecture-main">

            <div class="lecture-details">

                <p
                    class="event-type"
                    style="color:#4F46E5"
                >
                    Study
                </p>

                <h3>
                    ${
                        topic.topic ||
                        "Study session"
                    }
                </h3>

                <p class="event-module">
                    Week ${topic.week || ""}
                </p>

            </div>

        </div>

    `;

    // ADD COMPLETION CHECKBOX
    addEventCompletionCheckbox(
        card,
        topic,
        "weekly_topic"
    );

    return card;

}

//==================================================
// WEEK VIEW
//==================================================

function renderWeek() {

    if (
        !calendar ||
        !scheduleList
    ) {

        return;

    }

    calendar.innerHTML = "";
    scheduleList.innerHTML = "";

    const dates =
        getWeekDates(
            currentDate
        );

    const weekStart =
        dates[0];

    const weekEnd =
        dates[6];


    //==================================================
    // WEEK STRIP
    //==================================================

    const weekStrip =
        document.createElement(
            "div"
        );

    weekStrip.className =
        "week-strip";

    const shortDays = [
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat",
        "Sun"
    ];

    dates.forEach(
        (
            date,
            index
        ) => {

            const button =
                document.createElement(
                    "button"
                );

            button.type =
                "button";

            button.className =
                "week-strip-day";

            if (
                isSameDate(
                    date,
                    currentDate
                )
            ) {

                button.classList.add(
                    "active"
                );

            }

            button.innerHTML = `

                <span class="strip-day">
                    ${shortDays[index]}
                </span>

                <span class="strip-date">
                    ${date.getDate()}
                </span>

            `;

            button.addEventListener(
                "click",
                () => {

                    currentDate =
                        new Date(date);

                    if (view) {
                        view.value =
                            "day";
                    }

                    updateCalendar();

                }
            );

            weekStrip.appendChild(
                button
            );

        }
    );

    calendar.appendChild(
        weekStrip
    );

    //==================================================
    // DAY CARDS
    //==================================================

    const days = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
    ];

    const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
    ];

    dates.forEach(
        (
            date,
            index
        ) => {

            const dayName =
                days[index];

           const dayLectures =
    getLecturesForDate(
        date
    );

     const dayTasks =
    getTasksForDate(
        date
    );

    const dayAssessments =
    getAssessmentsForDate(
        date
    );

    const dayAcademicEvents =
    getAcademicEventsForDate(
        date
    );

    const dayTopics =
    getTopicsForDate(
        date
    );
            const section =
                document.createElement(
                    "div"
                );

            section.className =
                "week-day-card";

            section.innerHTML = `

                <div class="week-card-header">

                    <div>

                        <h2>
                            ${dayName}
                        </h2>

                        <span>
                            ${date.getDate()}
                            ${months[
                                date.getMonth()
                            ]}
                        </span>

                    </div>

                    <div class="lecture-count">

    ${
        dayLectures.length +
        dayTasks.length +
        dayAssessments.length +
        dayAcademicEvents.length +
        dayTopics.length
    }

    ${
        (
            dayLectures.length +
            dayTasks.length +
            dayAssessments.length +
            dayAcademicEvents.length +
            dayTopics.length
        ) === 1
            ? "Activity"
            : "Activities"
    }

</div>

                </div>

                <div class="week-card-body"></div>

            `;

            const body =
                section.querySelector(
                    ".week-card-body"
                );

            const hasItems =
            dayLectures.length > 0 ||
            dayTasks.length > 0 ||
            dayAssessments.length > 0 ||
            dayAcademicEvents.length > 0 ||
            dayTopics.length > 0;
            if (!hasItems) {

                body.innerHTML = `

                    <div class="empty-week-day">

                        <p>
                            No events scheduled
                        </p>

                    </div>

                `;

            }


            dayLectures.forEach(
                lecture => {

                    body.appendChild(
                        createLectureCard(
                            lecture
                        )
                    );

                }
            );

            dayTasks.forEach(
                task => {

                    body.appendChild(
                        createTaskCard(
                            task
                        )
                    );

                }
            );



            dayAcademicEvents.forEach(
    event => {

        body.appendChild(
            createAcademicEventCard(
                event
            )
        );

    }
);

            dayAssessments.forEach(
                assessment => {

                    body.appendChild(
                        createAssessmentCard(
                            assessment
                        )
                    );

                }
            );

            dayTopics.forEach(
                topic => {

                    body.appendChild(
                        createTopicCard(
                            topic
                        )
                    );

                }
            );

            section.addEventListener(
                "click",
                () => {

                    currentDate =
                        new Date(date);

                    if (view) {
                        view.value =
                            "day";
                    }

                    updateCalendar();

                }
            );

            scheduleList.appendChild(
                section
            );

        }
    );

}

//==================================================
// DAY VIEW
//==================================================

function renderDay() {

    if (!calendar) {
        return;
    }

    calendar.innerHTML = "";

    // Clear Week view cards
    if (scheduleList) {
        scheduleList.innerHTML = "";
    }

    const dayView =
        document.createElement(
            "div"
        );

    dayView.className =
        "day-view";

    dayView.id =
        "dayView";

    dayView.innerHTML = `

    <div
        class="day-summary"
        id="daySummary"
    ></div>

    <!-- ALL-DAY TASKS AND ASSESSMENTS -->
    <div
        class="timeline-all-day-list"
        id="allDayEvents"
    ></div>

    <div class="timeline">

    ${
        Array.from(
            {
                length: 24
            },
            (_, hour) => `

                <div
                    class="time-slot"
                    id="hour-${hour}"
                >

                    <div class="time-label">
                        ${String(hour).padStart(2, "0")}:00
                    </div>

                    <div
                        class="events"
                        data-hour="${hour}"
                    ></div>

                </div>

            `
        ).join("")
    }

    <div class="timeline-events-layer"></div>

</div>

    `;

    calendar.appendChild(
        dayView
    );


//==================================================
// ACADEMIC EVENTS FOR SELECTED DAY ONLY
//==================================================

const academicPeriods = getAcademicPeriodsForRange(
    currentDate,
    currentDate
);

renderAcademicEventsPanel(
    dayView.querySelector("#daySummary"),
    academicPeriods,
    currentDate
);
//==================================================
 // NORMAL EVENTS ONLY
 //==================================================

const dayItems = [];

// LECTURES
getLecturesForDate(currentDate).forEach(lecture => {
    dayItems.push({
        type: "lecture",
        data: lecture,
        time: lecture.start_time || null,
        isAllDay: !lecture.start_time
    });
});

// TASKS
getTasksForDate(currentDate).forEach(task => {
    dayItems.push({
        type: "task",
        data: task,
        time: task.due_time || null,
        isAllDay: !task.due_time
    });
});

// ASSESSMENTS
getAssessmentsForDate(currentDate).forEach(assessment => {
    dayItems.push({
        type: "assessment",
        data: assessment,
        time: assessment.due_time || null,
        isAllDay: !assessment.due_time
    });
});

// OTHER ACADEMIC EVENTS
getAcademicEventsForDate(currentDate).forEach(event => {
    dayItems.push({
        type: "academic_event",
        data: event,
        time: event.start_time || null,
        isAllDay: !event.start_time
    });
});

//==================================================
// GROUP EVENTS THAT OVERLAP IN TIME
//==================================================

const eventLayouts = new Map();

const getMinutes = (time) => {
    const [hours, minutes] = String(time || "00:00")
        .slice(0, 5)
        .split(":")
        .map(Number);

    return (hours * 60) + (minutes || 0);
};

// Prepare each event's start and end time
const timedItems = dayItems
    .filter(item => !item.isAllDay)
    .map(item => {

    const start = getMinutes(item.time);

    let endTime = item.data.end_time || "";

    if (
        item.type === "task" ||
        item.type === "assessment"
    ) {
        endTime = "";
    }

    const end = endTime
        ? getMinutes(endTime)
        : start + 60;

    return {
        item,
        start,
        end: Math.max(start + 60, end)
    };

});

// Sort events by their start time
timedItems.sort((a, b) => a.start - b.start);

// Group events into overlapping clusters
const overlapGroups = [];
let currentGroup = [];
let groupEnd = -1;

timedItems.forEach(entry => {

    if (
        currentGroup.length === 0 ||
        entry.start < groupEnd
    ) {
        currentGroup.push(entry);
        groupEnd = Math.max(groupEnd, entry.end);
    } else {
        overlapGroups.push(currentGroup);
        currentGroup = [entry];
        groupEnd = entry.end;
    }

});

if (currentGroup.length > 0) {
    overlapGroups.push(currentGroup);
}

// Assign each event its horizontal lane
overlapGroups.forEach(group => {

    const laneEnds = [];

    group.forEach(entry => {

        let laneIndex = laneEnds.findIndex(
            laneEnd => laneEnd <= entry.start
        );

        if (laneIndex === -1) {
            laneIndex = laneEnds.length;
            laneEnds.push(entry.end);
        } else {
            laneEnds[laneIndex] = entry.end;
        }

        eventLayouts.set(entry.item, {
            laneIndex,
            laneCount: 0
        });

    });

    // Every event in this overlapping group
    // uses the same number of horizontal columns
    group.forEach(entry => {

        const layout = eventLayouts.get(entry.item);

        layout.laneCount = laneEnds.length;

    });

});

//==================================================
// PLACE EVENTS IN THE CORRECT TIMELINE LOCATION
//==================================================

const isMobileLayout = window.matchMedia(
    "(max-width: 768px)"
).matches;

dayItems.forEach(item => {

    // Events without an allocated time go at the top
    const container = item.isAllDay
        ? dayView.querySelector("#allDayEvents")
        : isMobileLayout
            ? dayView.querySelector(
                `.events[data-hour="${parseInt(item.time.split(":")[0], 10)}"]`
            )
            : dayView.querySelector(".timeline-events-layer");

    if (!container) return;

    const event = document.createElement("div");

    //==================================================
    // EVENT TIME AND DURATION
    //==================================================

    const [startHour, startMinute] =
        item.isAllDay
            ? [0, 0]
            : item.time.split(":").map(Number);

    let endTime = item.data.end_time || "";

    if (
        item.type === "task" ||
        item.type === "assessment"
    ) {
        endTime = "";
    }

    const [endHour, endMinute] = endTime
        ? endTime.split(":").map(Number)
        : [startHour + 1, startMinute];

    const hourHeight =
        dayView.querySelector(".time-slot")
            .getBoundingClientRect().height;

    const startPosition =
        (startHour * 60 + startMinute) / 60 * hourHeight;

    const duration = Math.max(
        30,
        (endHour * 60 + endMinute) -
        (startHour * 60 + startMinute)
    );

    const eventHeight = Math.max(
        76,
        duration / 60 * hourHeight - 10
    );

    //==================================================
    // DESKTOP POSITIONING
    //==================================================

    if (!item.isAllDay && !isMobileLayout) {

        const layout = eventLayouts.get(item);

        const groupIndex = layout?.laneIndex ?? 0;
        const groupCount = layout?.laneCount ?? 1;
        const cardWidth = 100 / groupCount;

        event.style.position = "absolute";

        event.style.setProperty(
            "--event-top",
            `${startPosition + 10}px`
        );

        event.style.setProperty(
            "--event-height",
            `${eventHeight}px`
        );

        event.style.setProperty(
            "--event-left",
            `calc(${groupIndex * cardWidth}% + 6px)`
        );

        event.style.setProperty(
            "--event-width",
            `calc(${cardWidth}% - 12px)`
        );

        container.style.height =
            `${hourHeight * 24}px`;

    } else {

        // Mobile and all-day cards remain in normal flow
        event.style.position = "relative";
        event.style.top = "auto";
        event.style.left = "auto";
        event.style.right = "auto";
        event.style.width = "auto";
        event.style.height = "auto";
    }
//==================================================
// LECTURE
//==================================================

            if (
                item.type ===
                "lecture"
            ) {

                const lecture =
                    item.data;

                const module =
                    getModule(
                        lecture.module_id
                    );

                const colour =
                    module?.colour ||
                    "#3048C8";

                event.className =
                    "lecture-event";

                event.style.setProperty(
                   "--event-colour",
                   colour
                  );

                event.innerHTML = `

                    <span
                        class="event-type"
                        style="color:${colour}"
                    >
                        Class
                    </span>

                    

                    <small>
                        ${
                            lecture.start_time ||
                            "--:--"
                        }

                        –

                        ${
                            lecture.end_time ||
                            "--:--"
                        }

                        ·

                        ${
                            lecture.venue ||
                            "No venue"
                        }

                    </small>

                `;

            }

            //==================================================
            // TASK
            //==================================================

            if (
                item.type ===
                "task"
            ) {

                const task =
                    item.data;

                const colour =
                    getModuleColour(
                        task.module_id
                    );

                const moduleName =
                task.module_name ||
                 getModule(task.module_id)?.module_name ||
                 "";

                event.className =
                 "task-event";

                event.style.borderLeft =
                `6px solid ${colour}`;

               event.style.setProperty(
               "--event-colour",
                colour
                 );

                event.innerHTML = `

                    <span
                        class="event-type"
                        style="color:${colour}"
                    >
                        Task
                    </span>

                    <strong>
                        ${
                            task.title ||
                            "Task"
                        }
                    </strong>

                    <small>

                        ${
                            task.due_time ||
                            "All day"
                        }

                        ·

                        ${moduleName}

                    </small>

                `;

            }

            //==================================================
            // ASSESSMENT
            //==================================================

            if (
                item.type ===
                "assessment"
            ) {

                const assessment =
               item.data;

                const colour =
                   getModuleColour(assessment.module_id);


                   event.className =
                   "task-event assessment-event";

               event.style.borderLeft =
                      `6px solid ${colour}`;

                 event.style.setProperty(
    "--event-colour",
    colour
                     );

                 

                event.innerHTML = `

                    <span
                        class="event-type"
                        style="color:${colour}"
                    >
                        Assessment
                    </span>

                    <strong>
                        ${
                            assessment.title ||
                            "Assessment"
                        }
                    </strong>

                    <small>

                        ${
                            assessment.due_time ||
                            "00:00"
                        }

                        ·

                        ${
                            getModule(
                                assessment.module_id
                            )?.module_name ||
                            "General"
                        }

                    </small>

                `;

            }
//==================================================
// ACADEMIC EVENT
//==================================================

if (
    item.type ===
    "academic_event"
) {

    const academicEvent =
        item.data;

    const module =
        getModule(
            academicEvent.module_id
        );

    const colour =
        module?.colour ||
        "#3048C8";

    event.className =
    "lecture-event";

     event.style.borderLeft =
    `6px solid ${colour}`;

   event.style.setProperty(
    "--event-colour",
    colour
);

    event.innerHTML = `

        <span
            class="event-type"
            style="color:${colour}"
        >
            ${academicEvent.type || "Event"}
        </span>

        <strong>
            ${academicEvent.title || "Event"}
        </strong>

        <small>

            ${
                academicEvent.start_time ||
                "--:--"
            }

            –

            ${
                academicEvent.end_time ||
                "--:--"
            }

            ·

            ${
                module?.module_name ||
                academicEvent.venue ||
                "Personal"
            }

        </small>

    `;

}


// ADD COMPLETION CHECKBOX TO EVERY DAY VIEW EVENT
addEventCompletionCheckbox(
    event,
    item.data,
    item.type
);

// ADD PRIORITY STAR TO DAY VIEW EVENTS

const priorityTables = {
    lecture: "lectures",
    task: "tasks",
    assessment: "assessments",
    academic_event: "academic_events"
};

event.classList.add("timeline-event");

addSchedulePriorityToggle(
    event,
    item.data,
    priorityTables[item.type]
);

// OPEN EDIT / DELETE MENU
event.addEventListener(
    "click",
    clickEvent => {

        // Prevent checkbox clicks from opening the action menu
        if (clickEvent.target.closest(".schedule-event-checkbox")) {
            return;
        }

        clickEvent.stopPropagation();

        openEventActionMenu(
            item.data,
            item.type,
            event
        );

    }
);


            event.classList.add("timeline-event");

               container.appendChild(
                event
             );

        }
    );

    if (
    !dayItems.length &&
    !academicPeriods.length
) {
        const summary =
            dayView.querySelector(
                "#daySummary"
            );

        summary.innerHTML = `

            <div class="empty-week-day">

                <p>
                    No events scheduled
                </p>

            </div>

        `;

    }

    // Scroll only when the selected day has events
const firstTimedItem = dayItems.find(
    item => !item.isAllDay
);

if (firstTimedItem) {
    setTimeout(() => {
        scrollToRelevantHour(firstTimedItem.time);
    }, 100);
}}

//==================================================
// CLOSE MONTH EVENTS POPOVER
//==================================================

function closeMonthEventsPopover() {

    const existingPopover =
        document.querySelector(
            ".month-events-popover"
        );

    if (existingPopover) {

        existingPopover._cleanup?.();

        existingPopover.remove();

    }

}


//==================================================
// OPEN MONTH EVENTS POPOVER
// Display all events for the selected date
//==================================================

function openMonthEventsPopover(
    date,
    events,
    trigger
) {

    // Close any previously opened popover

    closeMonthEventsPopover();


    //==================================================
    // CREATE POPOVER
    //==================================================

    const popover =
        document.createElement("div");

    popover.className =
        "month-events-popover";


    //==================================================
    // FORMAT SELECTED DATE
    //==================================================

    const dateHeading =
        date.toLocaleDateString(
            "en-GB",
            {
                weekday: "long",
                day: "numeric",
                month: "long"
            }
        );


    //==================================================
    // POPOVER HEADER
    //==================================================

    const header =
        document.createElement("div");

    header.className =
        "month-popover-header";


    const heading =
        document.createElement("div");

    heading.className =
        "month-popover-heading";


    const weekday =
        document.createElement("span");

    weekday.textContent =
        date.toLocaleDateString(
            "en-GB",
            {
                weekday: "short"
            }
        );


    const dateTitle =
        document.createElement("h3");

    dateTitle.textContent =
        dateHeading;


    heading.append(
        weekday,
        dateTitle
    );


    //==================================================
    // CLOSE BUTTON
    //==================================================

    const closeButton =
        document.createElement("button");

    closeButton.type =
        "button";

    closeButton.className =
        "month-popover-close";

    closeButton.setAttribute(
        "aria-label",
        "Close events"
    );

    closeButton.innerHTML =
        '<i class="fa-solid fa-xmark"></i>';

    closeButton.addEventListener(
        "click",
        closeMonthEventsPopover
    );


    header.append(
        heading,
        closeButton
    );

    popover.appendChild(
        header
    );


    //==================================================
    // EVENT LIST
    // Display every event for this date
    //==================================================

    const eventList =
        document.createElement("div");

    eventList.className =
        "month-popover-list";


    events.forEach(item => {

        const eventButton =
            document.createElement("button");

        eventButton.type =
            "button";

        eventButton.className =
            "month-popover-event";


        // Event colour indicator

        const dot =
            document.createElement("span");

        dot.className =
            "month-popover-dot";

        dot.style.background =
            item.colour || "#5483B3";


        // Event information

        const details =
            document.createElement("span");

        details.className =
            "month-popover-details";


        const eventTitle =
            document.createElement("strong");

        eventTitle.textContent =
            item.title || "Untitled event";


        const eventMeta =
            document.createElement("small");


        const eventType =
            item.type === "class"
                ? "Class"
                : item.type === "academic_event"
                    ? "Academic event"
                    : item.type === "assessment"
                        ? "Assessment"
                        : "Task";


        eventMeta.textContent =
            `${eventType} · ${item.time || "All day"}`;


        details.append(
            eventTitle,
            eventMeta
        );


        eventButton.append(
            dot,
            details
        );


        //==================================================
        // OPEN EXISTING EDIT / DELETE MENU
        //==================================================

        eventButton.addEventListener(
            "click",
            clickEvent => {

                clickEvent.stopPropagation();

                const actionType =
                    item.type === "class"
                        ? "lecture"
                        : item.type;

                openEventActionMenu(
                    item.data,
                    actionType,
                    eventButton
                );


            }
        );


        eventList.appendChild(
            eventButton
        );

    });


    popover.appendChild(
        eventList
    );


    //==================================================
    // ADD POPOVER TO PAGE
    //==================================================

    document.body.appendChild(
        popover
    );


    //==================================================
    // POSITION POPOVER
    // Keep it inside the screen
    //==================================================

    const triggerRect =
        trigger.getBoundingClientRect();

    const popoverRect =
        popover.getBoundingClientRect();

    const spacing = 8;

    const left =
        Math.max(
            12,
            Math.min(
                triggerRect.left,
                window.innerWidth -
                    popoverRect.width -
                    12
            )
        );

    let top =
        triggerRect.bottom + spacing;

    if (
        top + popoverRect.height >
        window.innerHeight - 12
    ) {

        top =
            triggerRect.top -
            popoverRect.height -
            spacing;

    }

    top =
        Math.max(
            12,
            top
        );

    popover.style.left =
        `${left}px`;

    popover.style.top =
        `${top}px`;


    //==================================================
    // CLOSE POPOVER WHEN CLICKING OUTSIDE
    //==================================================

    const handleOutsideClick = clickEvent => {

    const actionMenu = document.querySelector(
        ".schedule-event-menu"
    );

    if (
        !popover.contains(clickEvent.target) &&
        !trigger.contains(clickEvent.target) &&
        !actionMenu?.contains(clickEvent.target)
    ) {
        closeMonthEventsPopover();
    }

};

    //==================================================
    // CLOSE POPOVER WITH ESCAPE
    //==================================================

    const handleEscape =
        keyboardEvent => {

            if (
                keyboardEvent.key === "Escape"
            ) {

                closeMonthEventsPopover();

            }

        };


    document.addEventListener(
        "pointerdown",
        handleOutsideClick
    );

    document.addEventListener(
        "keydown",
        handleEscape
    );


    // Remove listeners when the popover closes

    popover._cleanup = () => {

        document.removeEventListener(
            "pointerdown",
            handleOutsideClick
        );

        document.removeEventListener(
            "keydown",
            handleEscape
        );

        trigger.setAttribute(
            "aria-expanded",
            "false"
        );

    };


    trigger.setAttribute(
        "aria-expanded",
        "true"
    );

}

//==================================================
// MONTH VIEW
//==================================================

function renderMonth() {

    if (!calendar) {
        return;
    }

    calendar.innerHTML = "";

    // Clear Week view cards
    if (scheduleList) {
        scheduleList.innerHTML = "";
    }

    const firstDay =
        new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            1
        );

    const lastDay =
        new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() + 1,
            0
        );

//==================================================
// GROUPED ACADEMIC EVENTS
//==================================================

const academicPeriods = getAcademicPeriodsForRange(
    firstDay,
    lastDay
);

renderAcademicEventsPanel(
    calendar,
    academicPeriods,
    currentDate
);



    //==================================================
    // WEEK DAYS
    //==================================================

    const weekDays =
        document.createElement(
            "div"
        );

    weekDays.className =
        "week-days";

    [
        "SUN",
        "MON",
        "TUE",
        "WED",
        "THU",
        "FRI",
        "SAT"
    ].forEach(
        day => {

            const item =
                document.createElement(
                    "div"
                );

            item.className =
                "week-name";

            item.textContent =
                day;

            weekDays.appendChild(
                item
            );

        }
    );

    calendar.appendChild(
        weekDays
    );

    //==================================================
    // MONTH GRID
    //==================================================

    const grid =
        document.createElement(
            "div"
        );

    grid.className =
        "month-grid";

    //==================================================
    // EMPTY START CELLS
    //==================================================

    for (
        let i = 0;
        i < firstDay.getDay();
        i++
    ) {

        const empty =
            document.createElement(
                "div"
            );

        empty.className =
            "empty";

        grid.appendChild(
            empty
        );

    }

    //==================================================
    // DAYS
    //==================================================

    for (
        let day = 1;
        day <= lastDay.getDate();
        day++
    ) {

        const date =
            new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                day
            );
        //==================================================
        // MONTH DAY CELL
        //==================================================

        const dayCell =
            document.createElement("div");

        dayCell.className = "month-day";

        //when user clicks on card it goes to day view
        dayCell.setAttribute("role", "button");
        dayCell.setAttribute("tabindex", "0");
        dayCell.setAttribute("aria-label", `View schedule for ${date.toDateString()}`);

function openSelectedDay() {
    currentDate = new Date(date);

    if (view) {
        view.value = "day";
    }

    updateCalendar();
}

dayCell.addEventListener("click", openSelectedDay);

dayCell.addEventListener("keydown", (event) => {
    if (event.target !== dayCell) return;

    if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openSelectedDay();
    }
});

        // GET EVENTS FOR THIS DATE

        const monthEvents =
            getEventsForDate(date);

        // SHOW ONLY TWO EVENT DOTS

        const visibleEvents =
            monthEvents.slice(0, 2);

        const remaining =
            Math.max(
                monthEvents.length - visibleEvents.length,
                0
            );

        // DATE NUMBER BUTTON

        const dateButton =
            document.createElement("button");

        dateButton.type = "button";
        dateButton.className = "date-number";
        dateButton.textContent = day;

        dateButton.addEventListener("click", () => {

            currentDate = new Date(date);

            if (view) {
                view.value = "day";
            }

            updateCalendar();

        });

        dayCell.appendChild(dateButton);

        // EVENT DOTS

        const dots =
            document.createElement("div");

        dots.className = "month-dots";

        visibleEvents.forEach(event => {

            const dot =
                document.createElement("span");

            dot.className = "month-dot";
            dot.style.background = event.colour;
            dot.title = event.title;

            dots.appendChild(dot);

        });

        dayCell.appendChild(dots);

        // SHOW MORE BUTTON

        if (remaining > 0) {

            const moreButton =
                document.createElement("button");

            moreButton.type = "button";
            moreButton.className = "month-more";
            moreButton.textContent = `+${remaining} more`;

            moreButton.addEventListener("click", event => {

                event.stopPropagation();

                openMonthEventsPopover(
                    date,
                    monthEvents,
                    moreButton
                );

            });

            dayCell.appendChild(moreButton);

        }

        // HIGHLIGHT TODAY

        const today = new Date();

        if (isSameDate(date, today)) {

            dayCell.classList.add("active-day");

        }

        // ADD DAY TO MONTH GRID

        grid.appendChild(dayCell);

    }

    calendar.appendChild(
        grid
    );

}

//==================================================
// UPDATE CALENDAR HEADER AND DATE NAVIGATION
//==================================================

function updateCalendarHeader() {

    //==================================================
    // CHECK REQUIRED ELEMENTS
    //==================================================

    if (
        !view ||
        !calendarTitle ||
        !calendarSubtitle
    ) {

        return;

    }

    //==================================================
    // CALENDAR NAVIGATION ELEMENTS
    //==================================================

    const navLabel =
        document.getElementById("calendarNavLabel");

    const weekNumber =
        document.getElementById("calendarWeekNumber");


    //==================================================
    // DATE FORMATTING FUNCTION
    //==================================================

    const formatDate = (date, options) => {

        return date.toLocaleDateString(
            "en-GB",
            options
        );

    };


    //==================================================
    // DAY VIEW
    // Display the selected date
    //==================================================

    if (
        view.value === "day"
    ) {

        const dateText =
            formatDate(
                currentDate,
                {
                    weekday: "short",
                    day: "2-digit",
                    month: "long",
                    year: "numeric"
                }
            );

        // Update calendar heading

        calendarTitle.textContent =
            "Today";

        calendarSubtitle.textContent =
            dateText;


        // Update date navigation label

        if (navLabel) {

            navLabel.textContent =
                formatDate(
                    currentDate,
                    {
                        weekday: "long",
                        day: "2-digit",
                        month: "long",
                        year: "numeric"
                    }
                );

        }

    }


    //==================================================
    // WEEK VIEW
    // Display the current week's date range
    //==================================================

    else if (
        view.value === "week"
    ) {

        // Get all seven days of the selected week

        const dates =
            getWeekDates(
                currentDate
            );


        // Get the first and last dates of the week

        const startText =
            formatDate(
                dates[0],
                {
                    day: "numeric",
                    month: "short"
                }
            );

        const endText =
            formatDate(
                dates[6],
                {
                    day: "numeric",
                    month: "short",
                    year: "numeric"
                }
            );


        // Update calendar heading

        calendarTitle.textContent =
            "This Week";

        calendarSubtitle.textContent =
            "Organise your schedule for the week.";


        // Update date navigation label

        if (navLabel) {

            navLabel.textContent =
                `${startText} – ${endText}`;

        }

    }


    //==================================================
    // MONTH VIEW
    // Display the selected month and year
    //==================================================

    else if (
        view.value === "month"
    ) {

        // Get the selected month and year

        const monthText =
            formatDate(
                currentDate,
                {
                    month: "long",
                    year: "numeric"
                }
            );


        // Update calendar heading

        calendarTitle.textContent =
         monthText;

        calendarSubtitle.textContent =
            "View and manage your monthly schedule.";


        // Update date navigation label

        if (navLabel) {

            navLabel.textContent =
                monthText;

        }

    }


    //==================================================
    // CLEAR WEEK NUMBER
    //==================================================

    if (weekNumber) {

        weekNumber.textContent = "";

    }

}

//==================================================
// UPDATE CALENDAR
//==================================================

function updateCalendar() {

    if (
        !calendar ||
        !view
    ) {

        return;


    }

    updateCalendarHeader();

    updateViewButtons();
    //==================================================
    // CLEAR WEEK CARDS WHEN LEAVING WEEK VIEW
    //==================================================

    if (
        view.value !== "week" &&
        scheduleList
    ) {

        scheduleList.innerHTML = "";

    }

    //==================================================
    // RENDER SELECTED VIEW
    //==================================================

    if (
        view.value ===
        "day"
    ) {

        renderDay();

    } else if (
        view.value ===
        "month"
    ) {

        renderMonth();

    } else {

        renderWeek();

    }

    updateScheduleLayout();

}

//==================================================
// VIEW SELECT
//==================================================

if (view) {

    view.addEventListener(
        "change",
        updateCalendar
    );

}

//==================================================
// DAY / WEEK / MONTH SELECTOR
//==================================================

const viewButtons = document.querySelectorAll(".view-option");

function updateViewButtons() {

    viewButtons.forEach(button => {

        const isSelected = button.dataset.view === view.value;

        button.classList.toggle("active", isSelected);

        button.setAttribute(
            "aria-pressed",
            isSelected
        );

    });

}

// Listen for button clicks
viewButtons.forEach(button => {

    button.addEventListener("click", () => {

        const selectedView = button.dataset.view;

        view.value = selectedView;

        updateCalendar();

    });

});

// Set selected state on page load
updateViewButtons();

//==================================================
// PREVIOUS
//==================================================

if (calendarPrevBtn) {

    calendarPrevBtn.addEventListener(
        "click",
        () => {

            if (!view) {
                return;
            }

            if (
                view.value ===
                "month"
            ) {

                currentDate.setMonth(
                    currentDate.getMonth() -
                    1
                );

            } else if (
                view.value ===
                "week"
            ) {

                currentDate.setDate(
                    currentDate.getDate() -
                    7
                );

            } else {

                currentDate.setDate(
                    currentDate.getDate() -
                    1
                );

            }

            updateCalendar();

        }
    );

}

//==================================================
// NEXT
//==================================================

if (calendarNextBtn) {

    calendarNextBtn.addEventListener(
        "click",
        () => {

            if (!view) {
                return;
            }

            if (
                view.value ===
                "month"
            ) {

                currentDate.setMonth(
                    currentDate.getMonth() +
                    1
                );

            } else if (
                view.value ===
                "week"
            ) {

                currentDate.setDate(
                    currentDate.getDate() +
                    7
                );

            } else {

                currentDate.setDate(
                    currentDate.getDate() +
                    1
                );

            }

            updateCalendar();

        }
    );

}

//==================================================
// SCHEDULE LAYOUT
//==================================================

function updateScheduleLayout() {

    if (lectureCount) {

        lectureCount.textContent =
            lectures.length;

    }

    if (scheduleEmpty) {

        const hasContent =
            lectures.length > 0 ||
            tasks.length > 0 ||
            assessments.length > 0 ||
            weeklyTopics.length > 0 ||
            academicEvents.length > 0;

        scheduleEmpty.style.display =
            hasContent
                ? "none"
                : "block";

    }

}

//==================================================
// AUTO SCROLL TO FIRST EVENT
//==================================================

function scrollToRelevantHour(firstEventTime) {

    // No event time means no automatic scrolling
    if (!firstEventTime) {
        return;
    }

    const hour = parseInt(
        String(firstEventTime).split(":")[0],
        10
    );

    if (isNaN(hour)) {
        return;
    }

    const slot = document.getElementById(
        `hour-${hour}`
    );

    if (slot) {

        slot.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    }

}
//==================================================
// CREATE OVERLAY
//==================================================

function closeCreateOverlay() {

    if (
        createOverlay
    ) {

        createOverlay.style.display =
            "none";

    }

}

if (
    navAdd &&
    createOverlay
) {

    navAdd.addEventListener(
        "click",
        () => {

            createOverlay.style.display =
                "flex";

        }
    );

}

if (closeSheet) {

    closeSheet.addEventListener(
        "click",
        closeCreateOverlay
    );

}

if (createOverlay) {

    createOverlay.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                createOverlay
            ) {

                closeCreateOverlay();

            }

        }
    );

}

//==================================================
// CREATE MODULE
//==================================================

if (newModule) {

    newModule.addEventListener(
        "click",
        () => {

            window.location.href =
                "08 modules.html";

        }
    );

}

//==================================================
// CREATE TASK
//==================================================

if (newTask) {

    newTask.addEventListener(
        "click",
        () => {

            window.location.href =
                "21 addTask.html";

        }
    );

}

//==================================================
// CREATE LECTURE
//==================================================

if (newLecture) {

    newLecture.addEventListener(
        "click",
        () => {

            window.location.href =
                "21 addevent.html";

        }
    );

}

//==================================================
// CREATE ASSESSMENT
//==================================================

if (newAssessment) {

    newAssessment.addEventListener(
        "click",
        () => {

            window.location.href =
                "21 addevent.html";

        }
    );

}

//====CARDS EDIT AND DELETE OPTIONS======

//==================================================
// EVENT ACTION MENU
//==================================================

let selectedScheduleEvent = null;
let selectedScheduleEventType = null;


//==================================================
// OPEN EVENT ACTION MENU
//==================================================

function openEventActionMenu(
    event,
    type,
    card
){

    selectedScheduleEvent = event;
    selectedScheduleEventType = type;


    // REMOVE EXISTING MENU

    const existingMenu =
        document.querySelector(
            ".schedule-event-menu"
        );

    if(existingMenu){
        existingMenu.remove();
    }


    // CREATE MENU

    const menu =
        document.createElement("div");

    menu.className =
        "schedule-event-menu";


    menu.innerHTML = `

        <button
            type="button"
            class="schedule-event-edit"
        >
            Edit
        </button>


        <button
            type="button"
            class="schedule-event-delete"
        >
            Delete
        </button>

    `;


    document.body.appendChild(menu);


//==================================================
// POSITION EDIT / DELETE MENU
// KEEP MENU ABOVE ALL SCHEDULE CARDS
//==================================================

// Force menu above other page elements
menu.style.setProperty("position", "fixed", "important");
menu.style.setProperty("z-index", "2147483647", "important");
menu.style.setProperty("display", "flex", "important");
menu.style.setProperty("visibility", "visible", "important");

// Get clicked card position
const rect = card.getBoundingClientRect();

// Measure menu
const menuHeight = menu.offsetHeight;
const menuWidth = menu.offsetWidth;

const spacing = 10;

// Available screen space
const viewportHeight = window.innerHeight;
const viewportWidth = window.innerWidth;

// Position menu below the card initially
let top = rect.bottom + spacing;

// If there is not enough space below,
// move the menu above the card.
if (top + menuHeight > viewportHeight - spacing) {

    top = rect.top - menuHeight - spacing;

}

// Prevent menu from going outside the screen
top = Math.max(
    spacing,
    Math.min(
        top,
        viewportHeight - menuHeight - spacing
    )
);

// Align menu with the clicked card
let left = rect.left;

// Prevent horizontal overflow
left = Math.max(
    spacing,
    Math.min(
        left,
        viewportWidth - menuWidth - spacing
    )
);

// Apply final position
menu.style.setProperty("top", `${top}px`, "important");
menu.style.setProperty("left", `${left}px`, "important");

    // EDIT BUTTON

    const editButton =
        menu.querySelector(
            ".schedule-event-edit"
        );

    editButton.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            menu.remove();

            editScheduleEvent(
                selectedScheduleEvent,
                selectedScheduleEventType
            );

        }
    );


    // DELETE BUTTON

    const deleteButton =
        menu.querySelector(
            ".schedule-event-delete"
        );

       deleteButton.addEventListener(
        "click",
        async event => {

            event.stopPropagation();

            menu.remove();

            await deleteScheduleEvent(
                selectedScheduleEvent,
                selectedScheduleEventType
            );

        }
    );

    deleteButton.addEventListener(
        "click",
        async event => {

            event.stopPropagation();

            menu.remove();

            await deleteScheduleEvent(
                selectedScheduleEvent,
                selectedScheduleEventType
            );

        }
    );

// PREVENT CARD CLICK

menu.addEventListener(
    "click",
    event => {

        event.stopPropagation();

    }
);

}

//==================================================
// EDIT SCHEDULE EVENT
//==================================================


function editScheduleEvent(event, type) {

    if (!event || !event.id) {

        alert("Could not edit this item.");
        return;

    }

    // TASK
    if (type === "task") {

        window.location.href =
            `21 addtask.html?edit=${event.id}`;

        return;

    }

    // ASSESSMENT
    if (type === "assessment") {

        window.location.href =
            `21 addevent.html?edit=${event.id}&type=assessment`;

        return;

    }

    // ACADEMIC EVENT
    if (type === "academic_event") {

        window.location.href =
            `21 addevent.html?edit=${event.id}&type=academic_event`;

        return;

    }

    // LECTURE
    if (type === "lecture") {

        window.location.href =
            `21 addevent.html?edit=${event.id}&type=lecture`;

        return;

    }

    alert("Could not identify this item.");

}

//==================================================
// DELETE SCHEDULE EVENT
//==================================================

async function deleteScheduleEvent(
    event,
    type
){

    if(!event || !event.id){
        alert(
            "Could not delete this item."
        );

        return;
    }


    const confirmed =
        confirm(
            `Are you sure you want to delete "${event.title || "this item"}"?`
        );


    if(!confirmed){
        return;
    }


    let table = "";


    if(type === "lecture"){
        table = "lectures";
    }

    else if(type === "task"){
        table = "tasks";
    }

    else if(type === "assessment"){
        table = "assessments";
    }

    else if(type === "academic_event"){
        table = "academic_events";
    }


    if(!table){
        alert(
            "Could not identify this item."
        );

        return;
    }


    const user =
        auth.currentUser;


    if(!user){
        alert(
            "You must be logged in."
        );

        return;
    }


    const {
        error
    } = await supabase

        .from(table)

        .delete()

        .eq(
            "id",
            event.id
        )

        .eq(
            "user_id",
            user.uid
        );


    if(error){

        console.error(
            "Could not delete schedule item:",
            error
        );

        alert(
            "Could not delete this item."
        );

        return;

    }


    // REMOVE FROM LOCAL DATA

    if(type === "lecture"){

        lectures =
            lectures.filter(
                item =>
                    item.id !==
                    event.id
            );

    }

    else if(type === "task"){

        tasks =
            tasks.filter(
                item =>
                    item.id !==
                    event.id
            );

    }

    else if(type === "assessment"){

        assessments =
            assessments.filter(
                item =>
                    item.id !==
                    event.id
            );

    }

    else if(type === "academic_event"){

        academicEvents =
            academicEvents.filter(
                item =>
                    item.id !==
                    event.id
            );

    }


    updateCalendar();

}
//==================================================
// CLOSE EVENT ACTION MENU
//==================================================

document.addEventListener(
    "click",
    () => {

        const menu =
            document.querySelector(
                ".schedule-event-menu"
            );

        if(menu){
            menu.remove();
        }

    }
);