function find(pattern, text) {
    const match = text.match(pattern);
    return match ? match[1].trim() : "";
}

export default function extractModuleData(text) {

    const moduleName =
        find(/^(.*?)\s+\|\s+DIGA/im, text);

    const moduleCode =
        find(/\|\s*([A-Z]{4}\d+[A-Z]?)/, text);

    const lecturer =
        find(/LECTURERS[\s\S]*?\n([A-Za-z\s]+)\n/i, text);

    return {

        module: {
            name: moduleName,
            code: moduleCode,
            lecturer: lecturer,
            semester: ""
        },

        timetable: [],
        assessments: [],
        weeklyTopics: [],
        summary: ""

    };

}