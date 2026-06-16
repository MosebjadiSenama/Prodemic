// Splash screen loading bar

if(window.location.pathname.includes("index.html")){
setTimeout(() =>{
    window.location.href = "onboarding.html";
}, 3000);
}
//=========================================================================ONBOARDING SCREENS=======================================================================

const screens = [

    {
        image: "assets/images/1.png",
        welcome: "Welcome to",
        title: "Prodemic",
        description: "Your all-in-one space to study smarter, stay organised, and get more done with AI",
    },

    {

      image: "assets/images/2.png",
        welcome: "",
        title: "Stay on top of deadlines",
        description: "Track assignments, tests and submissions",
      
    },

    {

      image: "assets/images/3.png",
        welcome: "",
        title: "All-in one student ecosystem",
        description: "Plan your study time, build better habits, and manage everything — all in one place.",
      
    },
];

let currentScreen = 0;


function updateScreen(){

    document.getElementById("onboarding-img").src =
     screens[currentScreen].image;

     document.getElementById("welcome-to"). textContent = 
      screens[currentScreen].welcome;

     document.getElementById("title"). textContent = 
      screens[currentScreen].title;


     document.getElementById("description"). textContent = 
      screens[currentScreen].description;

    const nextBtn = 
    document.querySelector(".next-btn");

     const skipBtn = 
    document.querySelector(".skip-btn");

    


    if(currentScreen === screens.length -1){
        nextBtn.textContent = " Get Started";

        nextBtn.classList.add("get-started-btn");


        skipBtn.style.display = "none";
    }

    else{
        nextBtn.innerHTML = "Next &#x276F";
        nextBtn.classList.remove("get-started-btn");

        skipBtn.style.display= "block";
    }


    const buttonContainer =
    document.querySelector(".onboarding-buttons");

    if(currentScreen === screens.length -1){
        buttonContainer.style.justifyContent = "center";
    }

    else{
        buttonContainer.style.justifyContent = "space-between"
    }
   
}


//===================================================================NEXT BUTTON==================================

document.querySelector(".next-btn")
.addEventListener("click", () => {
    currentScreen++;

    if(currentScreen < screens.length){
    updateScreen();
}else{
    
//go to authentication page after onboarding process
    window.location.href = "authentication.html"
}


});

updateScreen();



//===============================================FORM VALIDATION==================================================
