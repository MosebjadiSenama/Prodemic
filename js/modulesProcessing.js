//==================================================
// ELEMENTS
//==================================================

const progressFill = document.getElementById("progressFill");
const progressPercent = document.getElementById("progressPercent");
const processingText = document.getElementById("processingText");

const steps = [

    document.getElementById("step1"),
    document.getElementById("step2"),
    document.getElementById("step3"),
    document.getElementById("step4"),
    document.getElementById("step5"),
    document.getElementById("step6"),
    document.getElementById("step7")

];

//==================================================
// START
//==================================================

window.addEventListener("DOMContentLoaded", () => {

    processModule();

});

//==================================================
// PROCESS
//==================================================

async function processModule(){

    const moduleText = localStorage.getItem("moduleOutlineText");

    if(!moduleText){

        alert("No module outline found.");

        window.location.href = "17 pasteModule.html";

        return;

    }

    let progress = 0;

    const messages = [

        "Reading module outline...",
        "Identifying module...",
        "Extracting lecturer...",
        "Finding lecture schedule...",
        "Finding assessments...",
        "Generating summary...",
        "Finalising..."

    ];

    let current = 0;

    const animation = setInterval(()=>{

        progress++;

        if(progress > 95){

            progress = 95;

        }

        progressFill.style.width = progress + "%";
        progressPercent.textContent = progress + "%";

        if(progress % 14 === 0 && current < steps.length){

            steps[current].classList.add("completed");

            processingText.textContent = messages[current];

            current++;

        }

    },80);

    try{

        const response = await fetch(

            "http://localhost:3000/module-outline",

            {

                method:"POST",

                headers:{

                    "Content-Type":"application/json"

                },

                body:JSON.stringify({

                    text:moduleText

                })

            }

        );

        const text = await response.text();

        if(!response.ok){

            throw new Error(text);

        }

        const moduleData = JSON.parse(text);

        localStorage.setItem(

            "moduleData",

            JSON.stringify(moduleData)

        );

        localStorage.removeItem(

            "moduleOutlineText"

        );

        clearInterval(animation);

        progressFill.style.width = "100%";
        progressPercent.textContent = "100%";

        processingText.textContent =

        "Analysis Complete";

        steps.forEach(step=>{

            step.classList.add("completed");

        });

        setTimeout(()=>{

            window.location.href =

            "15 reviewModule.html";

        },1000);

    }

    catch(error){

        clearInterval(animation);

        console.error(error);

        alert(error.message);

        window.location.href =

        "17 pasteModule.html";

    }

}