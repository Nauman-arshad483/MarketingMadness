// import {firebase} from 'firebase/app';
// // import {firebase} from '../../node_modules/firebase/app/dist/app/index'
// const firebaseConfig = {
//   apiKey: "AIzaSyB7WAssAdP1dCF9L3zlO_Pm3olfHAbAB5A",
//   authDomain: "madness-2b41c.firebaseapp.com",
//   projectId: "madness-2b41c",
//   storageBucket: "madness-2b41c.appspot.com",
//   messagingSenderId: "874235632481",
//   appId: "1:874235632481:web:b36ba674d3acbdaf798320",
//   measurementId: "G-ESS8S8LTMM"
// };

// // Initialize Firebase
// firebase.initializeApp(firebaseConfig);
// let GoogleProvider = new firebase.auth.GoogleAuthProvider();

let inputPassword = document.querySelector(".password-in");
let tog = document.querySelector(".password");
let close = document.querySelector(".hide-p");
let xValu = "";

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const emailError = document.getElementById("email-error");  
const passwordError = document.getElementById("password-error");
const continueButton = document.getElementById("continue");
const continueWithGoogleButton = document.getElementById("mg-up-one");

tog.addEventListener("click", function () {
  if (inputPassword.type === "password") {
    inputPassword.type = "text";
    xValu = inputPassword.value;
    tog.style.display = "none";
    close.style.display = "block";
  }
});

close.addEventListener("click", function () {
  close.style.display = "none";
  tog.style.display = "block";
  if (inputPassword.type === "text") {
    inputPassword.type = "password";
    xValu = inputPassword.value;

    inputPassword.value = xValu;
  }
});

const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

continueButton.addEventListener("click", async (e) => {
  console.log("buton clicked")
  if (!emailInput.value) {
    console.log("email is empty");
    emailError.innerHTML = "Email is required";
    emailError.style.display = "inline-block";
  } else {
    console.log("email else")
    emailError.innerHTML = "";
    emailError.style.display = "none";
  }
  if (!passwordInput.value) {
    console.log("empty password");
    passwordError.innerHTML = "Password is Required";
    passwordError.style.display = "inline-block";
  } else {
    console.log("password else")
    passwordError.innerHTML = "";
    passwordError.style.display = "none";
  }

  if (emailInput.value && passwordInput.value) {
    console.log("check1")
    if (!Array.isArray(validateEmail(emailInput.value))) {
      emailError.innerHTML = "Please enter a valid email";
      emailError.style.display = "inline-block";
    } else if (passwordInput.value.length < 6) {
      passwordError.innerHTML = "Password must be at least 6 character";
      passwordError.style.display = "inline-block";
    } else {
      try {
        console.log("request sending  portion ")
        const res = await fetch("/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: emailInput.value,
            password: passwordInput.value,
          }),
        });
        const data = await res.json();
        if (data.errors) {
          emailError.innerHTML = data.errors.email;
          if (data.errors.email) {
            emailError.style.display = "inline-block";
          }
          passwordError.innerHTML = data.errors.password;
          if (data.errors.password) {
            passwordError.style.display = "inline-block";
          }
        }
        if (data.user) {
          document.location.assign("/dashboard");
          console.log(user);
        }
      } catch (err) {
        console.log(err);
      }
    }
  }
});

continueWithGoogleButton.addEventListener("click", (event) => {
  console.log("Google");
  firebase
    .auth()
    .signInWithPopup(GoogleProvider)
    .then(async function (result) {
      // The signed-in user info.
      var user = result.user;
      // console.log(user);
      // Do something with the user info.

      try {
        const res = await fetch("http://103.107.184.159:7000/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: "google." + user.email,
            password: user.uid,
          }),
        });
        const data = await res.json();
        if (data.errors) {
          emailError.innerHTML = data.errors.email;
          passwordError.innerHTML = data.errors.password;
        }
        if (data.user) {
          document.location.assign("/payment");
          // console.log(user);
        }
      } catch (err) {
        console.log(err);
      }
    })
    .catch(function (error) {
      // An error occurred.
      console.log(error);
    });
});
