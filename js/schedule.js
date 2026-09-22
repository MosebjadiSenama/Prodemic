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

//==================================================
// SIDEBAR
//==================================================

if (sidebar && sidebarToggle) {

    sidebarToggle.addEventListener(
        "click",
        () => {

            sidebar.classList.toggle(
                "collapsed"
            );

        }
    );

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

function isMajorAcademicPeriod(
    event
) {

    const start =
        getEventStartDate(
            event
        );

    const end =
        getEventEndDate(
            event
        );

    return (
        !!start &&
        !!end
    );

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

///==================================================
// FIND ACADEMIC PERIODS
//==================================================

function getAcademicPeriodsForRange(
    rangeStart,
    rangeEnd
) {

    const start =
        startOfDay(
            rangeStart
        );

    const end =
        endOfDay(
            rangeEnd
        );

    return academicEvents
        .filter(
            isMajorAcademicPeriod
        )
        .filter(
            event => {

                const eventStart =
                    getEventStartDate(
                        event
                    );

                const eventEnd =
                    getEventEndDate(
                        event
                    );

                if (
                    !eventStart ||
                    !eventEnd
                ) {

                    return false;

                }

                return (
                    eventStart <= end &&
                    eventEnd >= start
                );

            }
        )
        .sort(
            (a, b) =>
                getEventStartDate(a) -
                getEventStartDate(b)
        );

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
// GET LECTURES FOR DATE
//==================================================

function getLecturesForDate(
    date
) {

    const dayName =
        date.toLocaleDateString(
            "en-GB",
            {
                weekday: "long"
            }
        );


    //==================================================
    // ACADEMIC BREAK
    //==================================================

    const rest =
        academicEvents.some(
            event =>
                isRestPeriod(event) &&
                eventOverlapsDate(
                    event,
                    date
                )
        );

    if (
        rest
    ) {

        return [];

    }


    //==================================================
    // GET CLASSES
    //==================================================

    return lectures
        .filter(
            lecture =>
                String(
                    lecture.day ||
                    ""
                ).trim().toLowerCase() ===
                dayName.toLowerCase()
        )
        .sort(
            (a, b) =>
                String(
                    a.start_time ||
                    ""
                ).localeCompare(
                    String(
                        b.start_time ||
                        ""
                    )
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

function getAcademicEventsForDate(
    date
) {

    return academicEvents
        .filter(
            event =>
                eventOverlapsDate(
                    event,
                    date
                )
        )
        .sort(
            (a, b) =>
                String(
                    a.start_time || ""
                ).localeCompare(
                    String(
                        b.start_time || ""
                    )
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
                    "23:59",

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
                    "23:59",

                data:
                    assessment

            });

        }
    );

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

                <h3>
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

    card.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            openEventActionMenu(
                lecture,
                "lecture",
                card
            );

        }
    );


    return card;

}
//==================================================
// TASK CARD
//==================================================

function createTaskCard(
    task
) {

    const colour =
        getModuleColour(
            task.module_id
        );

    const moduleName =
        task.module_name ||
        getModule(
            task.module_id
        )?.module_name ||
        "General";

    const dueDate =
        new Date(
            `${String(
                task.due_date
            ).slice(
                0,
                10
            )}T00:00:00`
        );

    const card =
        document.createElement(
            "div"
        );

    card.className =
        "week-lecture task-card-event";

    card.innerHTML = `

        <div
            class="lecture-bar"
            style="background:${colour}"
        ></div>

        <div class="lecture-main">

            <div class="lecture-time">

                <strong>
                    ${task.due_time || "--:--"}
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
                    Task
                </p>

                <h3>
                    ${task.title || "Task"}
                </h3>

                <p class="event-module">
                    ${moduleName}
                </p>

                <span class="event-due">
                    ${formatDueLabel(
                        dueDate
                    )}
                </span>

            </div>

               </div>

    `;


    //==================================================
    // EVENT ACTION MENU
    //==================================================

    card.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            openEventActionMenu(
                task,
                "task",
                card
            );

        }
    );


    return card;

}
//==================================================
// ASSESSMENT CARD
//==================================================

function createAssessmentCard(
    assessment
) {

    const card =
        document.createElement(
            "div"
        );

    card.className =
        "week-lecture assessment-card-event";

    card.innerHTML = `

        <div
            class="lecture-bar"
            style="background:#7C3AED"
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
                    style="color:#7C3AED"
                >
                    Assessment
                </p>

                <h3>
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


    //==================================================
    // EVENT ACTION MENU
    //==================================================

    card.addEventListener(
        "click",
        event => {

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

                <h3>
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


    //==================================================
    // EVENT ACTION MENU
    //==================================================

    card.addEventListener(
        "click",
        clickEvent => {

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
// ACADEMIC PERIOD BANNER
//==================================================

const academicPeriods =
    getAcademicPeriodsForRange(
        weekStart,
        weekEnd
    );

academicPeriods.forEach(
    event => {

        renderAcademicPeriodBanner(
            calendar,
            event,
            currentDate
        );

    }
);        

  //==================================================
// WEEK DATE RANGE
//==================================================

const weekStartText =
    weekStart.toLocaleDateString(
        "en-GB",
        {
            day: "numeric",
            month: "short"
        }
    );

const weekEndText =
    weekEnd.toLocaleDateString(
        "en-GB",
        {
            day: "numeric",
            month: "short"
        }
    );

const weekYear =
    weekEnd.getFullYear();

    const weekDateHeading =
        document.createElement(
            "div"
        );

    weekDateHeading.className =
        "week-date-heading";

   weekDateHeading.innerHTML = `
     <span>
        ${weekStartText} – ${weekEndText} ${weekYear}
    </span>
`;

   

    calendar.appendChild(
        weekDateHeading
    );

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

                        ${dayLectures.length}

                        ${
                            dayLectures.length === 1
                                ? "Lecture"
                                : "Lectures"
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

        <h2 class="day-title">

            ${
                currentDate.toLocaleDateString(
                    "en-GB",
                    {
                        weekday:
                            "long",

                        day:
                            "2-digit",

                        month:
                            "long",

                        year:
                            "numeric"
                    }
                )
            }

        </h2>

        <div
            class="day-summary"
            id="daySummary"
        ></div>

        <div class="timeline">

            ${
                Array.from(
                    {
                        length: 24
                    },
                    (
                        _,
                        hour
                    ) => `

                        <div
                            class="time-slot"
                            id="hour-${hour}"
                        >

                            <div class="time-label">

                                ${
                                    String(
                                        hour
                                    ).padStart(
                                        2,
                                        "0"
                                    )
                                }:00

                            </div>

                            <div
                                class="events"
                                data-hour="${hour}"
                            ></div>

                        </div>

                    `
                ).join("")
            }

        </div>

    `;

    calendar.appendChild(
        dayView
    );

//==================================================
// ACADEMIC PERIOD BANNERS
//==================================================

const academicPeriods =
    getAcademicPeriodsForRange(
        currentDate,
        currentDate
    );

academicPeriods.forEach(
    event => {

        renderAcademicPeriodBanner(
            dayView.querySelector(
                "#daySummary"
            ),
            event,
            currentDate
        );

    }
);
    //==================================================
    // NORMAL EVENTS ONLY
    //==================================================

    const dayItems = [];

    getLecturesForDate(
        currentDate
    ).forEach(
        lecture => {

            dayItems.push({

                type:
                    "lecture",

                data:
                    lecture,

                time:
                    lecture.start_time ||
                    "00:00"

            });

        }
    );

    getTasksForDate(
        currentDate
    ).forEach(
        task => {

            dayItems.push({

                type:
                    "task",

                data:
                    task,

                time:
                    task.due_time ||
                    "23:59"

            });

        }
    );

    getAssessmentsForDate(
        currentDate
    ).forEach(
        assessment => {

            dayItems.push({

                type:
                    "assessment",

                data:
                    assessment,

                time:
                    assessment.due_time ||
                    "23:59"

            });

        }
    );
    getAcademicEventsForDate(
        currentDate
    ).forEach(
        event => {

            dayItems.push({

                type:
                    "academic_event",

                data:
                    event,

                time:
                    event.start_time ||
                    "00:00"

            });

        }
    );

    dayItems.sort(
        (a, b) =>
            String(
                a.time
            ).localeCompare(
                String(
                    b.time
                )
            )
    );

    dayItems.forEach(
        item => {

            const hour =
                Math.min(
                    23,
                    Math.max(
                        0,
                        parseInt(
                            String(
                                item.time
                            ).split(":")[0],
                            10
                        ) || 0
                    )
                );

            const container =
                dayView.querySelector(
                    `.events[data-hour="${hour}"]`
                );

            if (!container) {
                return;
            }

            const event =
                document.createElement(
                    "div"
                );

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

                event.style.borderLeft =
                    `6px solid ${colour}`;

                event.innerHTML = `

                    <span
                        class="event-type"
                        style="color:${colour}"
                    >
                        Class
                    </span>

                    <strong>
                        ${
                            module?.module_name ||
                            "Unknown Module"
                        }
                    </strong>

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
                    getModule(
                        task.module_id
                    )?.module_name ||
                    "General";

                event.className =
                    "task-event";

                event.style.borderLeft =
                    `6px solid ${colour}`;

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
                            "23:59"
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

                event.className =
                    "task-event assessment-event";

                event.style.borderLeft =
                    "6px solid #7C3AED";

                event.innerHTML = `

                    <span
                        class="event-type"
                        style="color:#7C3AED"
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
                            "23:59"
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
                       event.addEventListener(
                "click",
                clickEvent => {

                    clickEvent.stopPropagation();

                    openEventActionMenu(
                        item.data,
                        item.type,
                        event
                    );

                }
            );


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

    setTimeout(
        scrollToRelevantHour,
        100
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
// ACADEMIC PERIOD BANNERS
//==================================================

const academicPeriods =
    getAcademicPeriodsForRange(
        firstDay,
        lastDay
    );

academicPeriods.forEach(
    event => {

        renderAcademicPeriodBanner(
            calendar,
            event,
            currentDate
        );

    }
);

    //==================================================
    // MONTH TITLE
    //==================================================

    const title =
        document.createElement(
            "h2"
        );

    title.className =
        "month-title";

    title.textContent =
        currentDate.toLocaleString(
            "default",
            {
                month:
                    "long",

                year:
                    "numeric"
            }
        );

    calendar.appendChild(
        title
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

        const button =
            document.createElement(
                "button"
            );

        button.type =
            "button";

        button.className =
            "month-day";

// IMPORTANT:
// getEventsForDate returns
// classes/tasks/assessments
// and normal academic events.========================================================================================================================================
// Major academic periods are
// still shown in the banner.

        const monthEvents =
            getEventsForDate(
                date
            );

        const visibleEvents =
            monthEvents.slice(
                0,
                2
            );

        const remaining =
            Math.max(
                monthEvents.length -
                visibleEvents.length,
                0
            );

        button.innerHTML = `

            <span class="date-number">
                ${day}
            </span>

            <div class="month-dots">

                ${
                    visibleEvents
                        .map(
                            event => `

                                <span
                                    class="month-dot"
                                    style="
                                        background:${event.colour}
                                    "
                                    title="${event.title}"
                                ></span>

                            `
                        )
                        .join("")
                }

            </div>

            ${
                remaining
                    ? `
                        <span class="month-more">
                            +${remaining}
                        </span>
                    `
                    : ""
            }

        `;

        const today =
            new Date();

        if (
            isSameDate(
                date,
                today
            )
        ) {

            button.classList.add(
                "active-day"
            );

        }

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

        grid.appendChild(
            button
        );

    }

    calendar.appendChild(
        grid
    );

}
 //==================================================
// UPDATE CALENDAR HEADER
//==================================================

function updateCalendarHeader() {

    if (
        !view ||
        !calendarTitle ||
        !calendarSubtitle
    ) {

        return;

    }

    if (
        view.value ===
        "day"
    ) {

        calendarTitle.textContent =
            "Today";

        calendarSubtitle.textContent =
            "Organise your schedule for the day.";

    } else if (
        view.value ===
        "month"
    ) {

        calendarTitle.textContent =
            "This Month";

        calendarSubtitle.textContent =
            "Organise your schedule for the month.";

    } else {

        calendarTitle.textContent =
            "This Week";

        calendarSubtitle.textContent =
            "Organise your schedule for the week.";

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

    if(
        requestedView === "day"
    ){}
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
// AUTO SCROLL
//==================================================

function scrollToRelevantHour() {

    const now =
        new Date();

    const isToday =
        isSameDate(
            currentDate,
            now
        );

    const hour =
        isToday
            ? now.getHours()
            : 8;

    const slot =
        document.getElementById(
            `hour-${hour}`
        );

    if (slot) {

        slot.scrollIntoView({
            behavior:
                "smooth",

            block:
                "center"
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


    // POSITION MENU

    const rect =
        card.getBoundingClientRect();

    menu.style.top =
        `${rect.bottom + window.scrollY + 6}px`;

    menu.style.left =
        `${rect.left + window.scrollX}px`;


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

function editScheduleEvent(
    event,
    type
){

    if(!event || !event.id){

        alert(
            "Could not edit this item."
        );

        return;
    }


    if(type === "task"){

        window.location.href =
            `21 addevent.html?edit=${event.id}`;

        return;
    }


    if(type === "assessment"){

        window.location.href =
            `21 addevent.html?edit=${event.id}`;

        return;
    }


    if(type === "academic_event"){

        window.location.href =
            `21 addevent.html?edit=${event.id}`;

        return;
    }


    if(type === "lecture"){

        window.location.href =
            `21 addevent.html?edit=${event.id}`;

        return;
    }


    alert(
        "Could not identify this item."
    );

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