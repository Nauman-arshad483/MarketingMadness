let images = document.querySelectorAll(".desc");

images.forEach((element) => {
  element.addEventListener("mouseenter", function () {
    element.style.opacity = ".9";
  });
  element.addEventListener("mouseleave", function () {
    element.style.opacity = "0";
  });
});

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
/*images.forEach((element) => {
  element.addEventListener("mouseenter", function () {
    let x = element.parentElement.querySelector(".desc");
    x.style.display = "block";
  });
  element.addEventListener("mouseleave", function () {
    let x = element.parentElement.querySelector(".desc");
    x.style.display = "none";
  });
});*/

//Darkmode
let stroke = document.querySelectorAll(".stroke");

let dark = document.getElementById("dark-mode");
dark.addEventListener("click", function () {
  isDarkmode = !isDarkmode;
  if (isDarkmode) {
    localStorage.setItem("darkMode", "true");
  } else {
    localStorage.setItem("darkMode", "false");
  }
  let b = document.getElementById("body");
  // console.log(b);
  b.classList.toggle("dark-photo");

  stroke.forEach((element) => {
    element.classList.toggle("stroke-fill");
  });
});

const generateImageBtn = document.getElementById("generate-img");
const loader = document.getElementById("loader");
const noImage = document.getElementById("no-image");
const gallery = document.getElementById("gallery");
const recentGallery = document.getElementById("recent-gallery");
generateImageBtn.addEventListener("click", generateImage);

async function generateImage(e) {
  const searchText = document.getElementById("search-img").value;
  let ImageData = [];
  if (searchText) {
    noImage.style.display = "none"; // hidding message
    gallery.innerHTML = "";
    e.target.disabled = true;
    try {
      loader.style.display = "flex"; // displaying loader
      const response = await fetch("http://103.107.184.159:7000/image-generation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: searchText }),
      });
      const result = await response.json();
      ImageData = result.data;

      if (ImageData?.length) {
        ImageData.forEach((image, i) => {
          const imageCard = `
            <div class="image-container">
              <img src="${image?.url}" alt="${image?.url}" />
              <div class="card-content">
                <button class="image-download">Try it</button>
              </div>
            </div>
          `;
          gallery.innerHTML += imageCard;
          recentGallery.innerHTML = imageCard + recentGallery.innerHTML;
        });
        //
        const imageDownloads = document.querySelectorAll(".image-download");
        imageDownloads.forEach((imageDownload, i) => {
          imageDownload.addEventListener("click", (e) => {
            const link = document.createElement("a");
            link.download = "image.png";
            link.href = ImageData[i]?.url + ".png";
            link.click();
          });
        });
      } else {
        noImage.style.display = "flex"; // hidding message
      }
      loader.style.display = "none"; // displaying loader
    } catch (err) {
      console.log(err);
    } finally {
      e.target.disabled = false;
    }
  }
}

const bestGeneration = document.getElementById("best-generation");
const recentGeneration = document.getElementById("recent-generation");

bestGeneration.addEventListener("click", (event) => {
  event.target.style.borderBottom = "2px solid #10f";
  recentGeneration.style.borderBottom = "2px solid rgb(114, 114, 114)";
  recentGallery.style.display = "none";
  gallery.style.display = "flex";
});
recentGeneration.addEventListener("click", (event) => {
  event.target.style.borderBottom = "2px solid #10f";
  bestGeneration.style.borderBottom = "2px solid rgb(114, 114, 114)";
  gallery.style.display = "none";
  recentGallery.style.display = "flex";
});

const signoutButton = document.getElementById("logout");

signoutButton.addEventListener("click", async () => {
  try {
    const response = await fetch("/signout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });
  } catch (err) {
    console.log(err);
  }
});

const goToChatButton = document.getElementById("new-chat");

goToChatButton.addEventListener("click", (e) => {
  document.location.assign("/dashboard");
});

window.onload = async function () {
  if (localStorage.getItem("darkMode") === "true") {
    isDarkmode = true;
    let b = document.getElementById("body");
    // console.log(b);
    b.classList.toggle("dark-photo");

    stroke.forEach((element) => {
      element.classList.toggle("stroke-fill");
    });
  }
  try {
    const response = await fetch("/check-active-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });

    const data = await response.json();
    if (data.user) {
      // console.log(data.user);
    }
  } catch (err) {
    console.log(err);
  }
};
