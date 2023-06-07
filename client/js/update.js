let search = document.getElementById("search-val");
let searchQuer = document.querySelector(".search-query");

search.addEventListener("focus", function () {
  searchQuer.classList.add("hover-sea");
});

search.addEventListener("blur", function () {
  searchQuer.classList.remove("hover-sea");
});
