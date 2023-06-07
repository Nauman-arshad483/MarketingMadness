const firebaseConfig = {
  apiKey: "AIzaSyAEzOqN9OYpYIhPFqM4meEAMHEPGNZm3ko",
  authDomain: "react-firebase-authentic-fc1d7.firebaseapp.com",
  projectId: "react-firebase-authentic-fc1d7",
  storageBucket: "react-firebase-authentic-fc1d7.appspot.com",
  messagingSenderId: "257981421544",
  appId: "1:257981421544:web:f5bd30b9c8e4b8082a365d",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
let GoogleProvider = new firebase.auth.GoogleAuthProvider();

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
  if (!emailInput.value) {
    emailError.innerHTML = "Please fill out the email field";
    emailError.style.display = "inline-block";
  } else {
    emailError.innerHTML = "";
    emailError.style.display = "none";
  }
  if (!passwordInput.value) {
    passwordError.innerHTML = "Please enter correct password";
    passwordError.style.display = "inline-block";
  } else {
    passwordError.innerHTML = "";
    passwordError.style.display = "none";
  }

  if (emailInput.value && passwordInput.value) {
    if (!Array.isArray(validateEmail(emailInput.value))) {
      emailError.innerHTML = "Please enter a valid email";
      emailError.style.display = "inline-block";
    } else if (passwordInput.value.length < 6) {
      passwordError.innerHTML = "Please enter minimum 6 charachter of password";
      passwordError.style.display = "inline-block";
    } else {
      try {
        const res = await fetch("/signin", {
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
          passwordError.innerHTML = data.errors.password;
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
        const res = await fetch("/signin", {
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
