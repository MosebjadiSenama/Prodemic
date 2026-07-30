//===================================================================================================================nav bar menu

const menuBtn = document.getElementById("menuBtn");
const navBar = document.querySelector(".nav-bar");
const homeContent = document.querySelector(".home-content");

menuBtn.addEventListener("click", () => {

    navBar.classList.toggle("open");

    homeContent.classList.toggle("shift");

});