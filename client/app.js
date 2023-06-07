let menuOpen = document.getElementById("menu-open");
let menu = document.querySelector(".first");
let close = document.getElementById("menu-close");
let cover = document.querySelector(".cover");

menuOpen.addEventListener("click", function () {
  menu.classList.add("open");
  close.classList.add("close-open");
  cover.classList.add("show-cover");
});

let isDarkmode = false;
close.addEventListener("click", function () {
  menu.classList.remove("open");
  close.classList.remove("close-open");
});

//Darkmode
let dark = document.getElementById("dark-mode");
let allLight = document.querySelectorAll(".light");
let svgs = document.querySelectorAll(".svg-li");
let stroke = document.querySelectorAll(".stroke");
let list = document.querySelectorAll(".list-item");
let conQueries = document.querySelector(".co");
let textDesc = document.querySelector(".bright");
console.log(textDesc);
dark.addEventListener("click", function (e) {
  e.preventDefault();
  isDarkmode = true;
  let main = document.querySelector(".second");
  main.classList.toggle("dark-mode");

  allLight.forEach((element) => {
    element.classList.toggle("light-white");
  });

  svgs.forEach((elements) => {
    elements.classList.toggle("svg-ligh");
  });

  stroke.forEach((element) => {
    element.classList.toggle("stroke-fill");
  });

  list.forEach((element) => {
    element.classList.toggle("hover");
  });

  conQueries.classList.toggle("query");
  textDesc.classList.toggle("dark-desc");
  document.body.classList.toggle("backgroud");
});

let inpu = document.querySelectorAll("input");
