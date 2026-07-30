class ModuleParser {

    constructor(text) {

        this.text = text;

        this.lines = text
            .split(/\r?\n/)
            .map(line => line.trim())
            .filter(line => line.length > 0);

    }

    // ==========================================
    // MAIN PARSER
    // ==========================================
parse() {

  const weeks = this.getWeeks();

const topics = this.getTopics();

const assessments = this.getAssessments();

return {

    moduleName: this.getModuleName(),

    moduleCode: this.getModuleCode(),

    semester: this.getSemester(),

    weeks,

    topics,

    assessments,

    lectures: topics.filter(t => t.type === "Lecture"),

    tutorials: topics.filter(t => t.type === "Tutorial"),

    labs: topics.filter(t => t.type === "Lab"),

    workshops: topics.filter(t => t.type === "Workshop"),

    consultations: topics.filter(t => t.type === "Consultation"),

    presentations: topics.filter(t => t.type === "Presentation"),

    independentWork: topics.filter(t => t.type === "Independent Work"),

    breaks: topics.filter(t =>
        t.type === "Study Break" ||
        t.type === "Research Break" ||
        t.type === "Vacation"
    ),

    exams: assessments.filter(a =>
        a.type === "Exam"
    )

};}

    // ==========================================
    // MODULE CODE
    // ==========================================

  getModuleCode() {

    const regex = /\b[A-Z]{3,5}\d{4}[A-Z]?\b/g;

    for (const line of this.lines) {

        const matches = line.match(regex);

        if (!matches) continue;

        // Prefer 4000-level code if present
        const preferred = matches.find(code => code.startsWith("DIGA4"));

        if (preferred) return preferred;

        return matches[0];

    }

    return "Unknown";

}

    // ==========================================
    // MODULE NAME
    // ==========================================

   getModuleName() {

    for (let i = 0; i < this.lines.length; i++) {

        const line = this.lines[i];

        if (
            line.toUpperCase().includes("COURSE SUMMARY")
        ) {

            for (let j = i - 1; j >= 0; j--) {

                const candidate = this.lines[j].trim();

                if (!candidate) continue;

                if (/^Page/i.test(candidate)) continue;

                if (/^\d+\s+of\s+\d+/i.test(candidate)) continue;

                if (candidate.includes("|")) {

                    return candidate.split("|")[0].trim();

                }

                if (
                    candidate.includes("DIGA") ||
                    candidate.includes("COMS") ||
                    candidate.includes("INFO") ||
                    candidate.includes("PSYC")
                ) {

                    return candidate
                        .replace(/[A-Z]{3,5}\d{4}[A-Z]?(\/[A-Z]{3,5}\d{4}[A-Z]?)?/g, "")
                        .replace(/[-–]/g, "")
                        .trim();

                }

            }

        }

    }

    return "Unknown Module";

}

    // ==========================================
    // SEMESTER
    // ==========================================

  getSemester() {

    for (const line of this.lines) {

        const upper = line.toUpperCase();

        if (upper.includes("SEMESTER 1")) return "Semester 1";

        if (upper.includes("SEMESTER 2")) return "Semester 2";

        if (upper.includes("BLOCK 1")) return "Semester 1";

        if (upper.includes("BLOCK 2")) return "Semester 2";

    }

    return "Unknown";

}

    // ==========================================
    // WEEKS
    // ==========================================

  getWeeks() {

    const weeks = [];

    let currentWeek = null;

    let inCurriculum = false;

    for (const line of this.lines) {

        const text = line.trim();

        if (text.toUpperCase().includes("CURRICULUM BREAKDOWN")) {

            inCurriculum = true;

            continue;

        }

        if (!inCurriculum) continue;

        if (/^EXAMS$/i.test(text)) break;

        if (/^Week\s+\d+/i.test(text)) {

            if (currentWeek) weeks.push(currentWeek);

            currentWeek = {

                week: Number(text.match(/\d+/)[0]),

                title: text,

                startDate: "",

                endDate: "",

                events: []

            };

            continue;

        }

        if (!currentWeek) continue;

        if (/^\d{1,2}\s+\w+\s*-\s*\d{1,2}\s+\w+/i.test(text)) {

            const dates = text.split("-");

            currentWeek.startDate = dates[0].trim();

            currentWeek.endDate = dates[1].trim();

            continue;

        }

        if (/^\d{1,2}\s+\w+\s+\d{4}$/i.test(text)) {

            currentWeek.startDate = text;

            continue;

        }

        currentWeek.events.push(text);

    }

    if (currentWeek) weeks.push(currentWeek);

    return weeks;

}
    // ==========================================
    // TOPICS
    // ==========================================

getTopics() {

    const topics = [];

    const weeks = this.getWeeks();

    const keywords = {

        Lecture: [
            "lecture",
            "api",
            "gsap",
            "figma",
            "design",
            "javascript",
            "html",
            "css"
        ],

        Tutorial: [
            "tutorial"
        ],

        Lab: [
            "lab"
        ],

        Workshop: [
            "workshop"
        ],

        Consultation: [
            "consultation",
            "consult"
        ],

        Presentation: [
            "presentation",
            "present"
        ],

       Guest: [
    "guest lecture"
],

Orientation: [
    "orientation"
],

Independent: [
    "independent work",
    "independent work session"
],

Lecture: [
    "lecture",
    "api",
    "apis",
    "gsap",
    "figma",
    "design",
    "motion",
    "javascript",
    "html",
    "css",
    "research",
    "analysis",
    "storytelling",
    "information architecture",
    "professional workflows",
    "development ready",
    "ai literacy"
],

        Break: [
            "study break",
            "research break",
            "vacation"
        ]

    };

    weeks.forEach(week => {

        week.events.forEach(event => {

            let type = "Event";

            const text = event.toLowerCase();

            Object.entries(keywords).forEach(([name, words]) => {

                words.forEach(word => {

                    if(text.includes(word)){

                        type = name;

                    }

                });

            });
            const e = event.toLowerCase();

if (

    e.includes("students will") ||

    e.includes("assignment") ||

    e.includes("submit") ||

    e.includes("arrive in class") ||

    e.includes("write the abstract") ||

    e.includes("the tutors will") ||

    e.includes("brief will be") ||

    e.includes("read assignment brief") ||

    e.includes("answers the") ||

    e.includes("answering the") ||

    e.includes("practice writing") ||

    e.includes("in-person assignment")

){

    return;

}
if (event.length > 80) {
    return;
}


         const topic = event
.replace(
/^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)(\s*\(.*?\))?:/i,
""
)
.trim();

topics.push({

    week: week.week,

    startDate: week.startDate,

    endDate: week.endDate,

    day:
        event.match(
            /^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)/i
        )?.[0] || "",

    topic,

    title: topic,

    type,

    completed:false

});

        });

    });

    return topics;

}

// ==========================================
// ASSESSMENTS
getAssessments() {

    const assessments = [];

    let inAssessment = false;

    for (let i = 0; i < this.lines.length; i++) {

        const line = this.lines[i].trim();

        if (line === "ASSESSMENT") {
            inAssessment = true;
            continue;
        }

        if (!inAssessment) continue;

        if (
            line.includes("CORE READINGS") ||
            line.includes("CURRICULUM BREAKDOWN")
        ) {
            break;
        }

        if (!/^ASSIGNMENT\s+\d+/i.test(line)) continue;

        const title = line;

        let description = "";
        let dueDate = "";
        let weighting = "";

        for (let j = i + 1; j < this.lines.length; j++) {

            const next = this.lines[j].trim();

            if (/^ASSIGNMENT\s+\d+/i.test(next)) break;

            if (
                next.includes("CORE READINGS") ||
                next.includes("CURRICULUM BREAKDOWN")
            ) break;

            if (/^\d{1,2}$/.test(next)) {

                dueDate = next + " March 2026";
                continue;

            }

            if (/^\d+%$/.test(next)) {

                weighting = next;
                continue;

            }

            description += " " + next;

        }

        assessments.push({

            type: "Assignment",

            title,

            description: description.trim(),

            dueDate,

            weighting,

            completed: false

        });

    }

    return assessments;

}

    }


export default ModuleParser;


