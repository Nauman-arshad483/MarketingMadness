let isDarkmode = false;
let menuOpen = document.getElementById("menu-open");
let menu = document.querySelector(".first");
let close = document.getElementById("menu-close");
let cover = document.querySelector(".cover");
let addChat = document.querySelector("#add-chat");
let newChat = document.querySelector(".new-chat");
let queries = document.getElementById("queries");
let isNewChat = true;
let updateChat = {};
let histories = [];
const user = {};
const historyContainer = document.getElementById("history");

let inpu = document.querySelectorAll("input");
let userQueries = document.querySelector(".user-queries#queries");
let exampleTexts = document.querySelectorAll(".example-text");

//display result screen

let result = document.getElementById("result");
let text = "";
let regenerateButton = document.getElementById("regenerate-btn");
let dots = document.getElementById("dots");
let mainSec = document.querySelector(".result-page");

menuOpen.addEventListener("click", function () {
  menu.classList.add("open");
  close.classList.add("close-open");
  cover.classList.add("show-cover");
  addChat.style.display = "none";
});

exampleTexts.forEach((exampleText) => {
  exampleText.addEventListener("click", () => {
    queries.value = exampleText.innerHTML
      .trimEnd()
      .slice(-exampleText.innerHTML.length, -1);
  });
});

newChat.addEventListener("click", () => {
  // window.location.assign("/dashboard");

  let main = document.querySelector(".item-ls");
  let logo = document.querySelector(".logo-h");
  let resultPage = document.querySelector(".result-page");
  resultPage.style.display = "none";
  main.style.display = "grid";
  logo.style.display = "inline-block";
  let titleTab = document.querySelector(".title");
  let container = document.querySelector(".x");
  container.classList.remove("result-container");
  titleTab.style.display = "flex";
  mainSec.innerHTML = "";
  isNewChat = true;
  regenerateButton.style.display = "none";
  queries.focus();
});

close.addEventListener("click", function () {
  menu.classList.remove("open");
  close.classList.remove("close-open");
  addChat.style.display = "inline-block";
});

//Darkmode
let dark = document.getElementById("dark-mode");
let allLight = document.querySelectorAll(".light");
let svgs = document.querySelectorAll(".svg-li");
let stroke = document.querySelectorAll(".stroke");
let list = document.querySelectorAll(".list-item");
let conQueries = document.querySelector(".co");
let textDesc = document.querySelector(".bright");
let container = document.querySelector(".result-page");
let question = document.querySelector(".question-sec");
dark.addEventListener("click", function (e) {
  e.preventDefault();
  isDarkmode = !isDarkmode;
  if (isDarkmode) {
    localStorage.setItem("darkMode", "true");
  } else {
    localStorage.setItem("darkMode", "false");
  }
  console.log(localStorage.getItem("darkMode"));

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

  container.classList.toggle("dark-b");
  conQueries.classList.toggle("query");
  textDesc.classList.toggle("dark-desc");
  document.body.classList.toggle("backgroud");
});

result.addEventListener("click", handleUserQuery);

async function handleUserQuery() {
  if (queries.value === "") {
    alert("Please enter a valid query");
    return false;
  } else {
    regenerateButton.disabled = true;
    result.disabled = true;
    regenerateButton.style.display = "none";
    result.style.display = "none";
    dots.style.width = "50px";
    dots.style.height = "20px";
    text = queries.value;
    queries.value = "";

    let main = document.querySelector(".item-ls");
    let logo = document.querySelector(".logo-h");
    let resultPage = document.querySelector(".result-page");
    resultPage.style.display = "block";
    main.style.display = "none";
    logo.style.display = "none";
    let titleTab = document.querySelector(".title");
    let container = document.querySelector(".x");
    container.classList.add("result-container");
    titleTab.style.display = "none";
    await createNewQuestion();
    isNewChat = false;
  }
}

const createNewQuestion = async () => {
  mainSec.classList.add("push-d");
  let questionSection = document.createElement("div");
  let answerSection = document.createElement("div");

  questionSection.className = "question-sec";
  answerSection.className = "answer-sec";

  ///
  ////
  // Addeded Question
  questionSection.innerHTML = `
  <div class="wrapper">
    <svg id='svg-pro' stroke="currentColor" fill="none" stroke-width="1.5" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
    <input value="${text}" disabled placeholder="${text}" class='question-text' />
    <button id='svg-edit' class="edit-question">
      <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
    </button>
    </div>
  `;

  /// This is the Answer
  let answer = "Lorem, ipsum dolor sit amet consectetur adipisicing elit";
  const data = {
    text: text,
  };
  try {
    const response = await fetch("/text-completion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    answer = result?.choices[0].text.trim();
  } catch (error) {
    console.log("Error:", error);
  } finally {
    answerSection.innerHTML = `
    <div class='wrapper'>
      <img class="madness-logo" src="/madness-ai.png" alt="" />
      <div class='query-result answer'></div>
      <div class="feed">
      <svg id='fd-icon' stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
      <svg id='fd-icon' stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"></path></svg>
      </div>
      </div>
    `;
    ///
    ///
    /// Appended Question and Answer section
    mainSec.append(questionSection);
    mainSec.append(answerSection);
    ///
    ///
    //
    ///
    /// TODO
    // Implementing Typing Feature
    let svgEdits = document.querySelectorAll(".edit-question");

    if (svgEdits.length) {
      svgEdits.forEach((svgEdit, i) => {
        // svgEdit.style.display = "none";
        svgEdit.disabled = true;
        // console.log(svgEdit);
      });
    }
    const answerDisplay = document.querySelector(".query-result.answer");
    answerDisplay.innerHTML = "Typing ...";
    answerDisplay.innerHTML = "";
    const speed = 20;
    for (let i = 0; i < answer.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, speed));
      answerDisplay.innerHTML +=
        answer[i] === "\n"
          ? "<br>"
          : answer[i] === "\t"
          ? "&nbsp; &nbsp; &nbsp; &nbsp;"
          : answer[i];
      mainSec.scrollTop = mainSec.scrollHeight;
    }
    answerDisplay.classList.remove("answer");
  }
  text = await getSummarization(answer);
  if (isNewChat) {
    const chat = { title: text, content: `${mainSec.innerHTML}` };
    await saveUserHistoryToDB(chat, user.id);
    await loadAndRenderUserHistory(user.id, renderUserHistory);
  } else {
    const chat = { content: `${mainSec.innerHTML}` };
    const content_id = updateChat.content_id
      ? updateChat.content_id
      : histories[histories.length - 1]._id;
    await updateUserHistoryToDB(chat, user.id, content_id);
    await loadAndRenderUserHistory(user.id, renderUserHistory);
  }
  await extraFunctionality();
};

const extraFunctionality = async () => {
  ///
  let svgEdits = document.querySelectorAll(".edit-question");
  let hoverEdits = document.querySelectorAll(".question-sec");

  if (hoverEdits.length) {
    hoverEdits.forEach((hoverEdit, i) => {
      hoverEdit.classList.add("edit" + i);
    });
  }

  if (svgEdits.length) {
    svgEdits.forEach((svgEdit, i) => {
      svgEdit.classList.add("edit-btn" + i);
      // console.log(svgEdit);
    });
  }

  if (svgEdits.length) {
    svgEdits.forEach((svgEdit, i) => {
      // svgEdit.style.display = "inline-block";
      svgEdit.disabled = false;
    });
  }

  hoverEdits.forEach((_e, i) => {
    let hoverItem = document.querySelector(`.question-sec.edit${i}`);
    hoverItem.addEventListener("mouseenter", () => {
      let editBtn = document.querySelector(`.edit-question.edit-btn${i}`);
      editBtn.style.display = "block";
    });
    hoverItem.addEventListener("mouseleave", () => {
      let editBtn = document.querySelector(`.edit-question.edit-btn${i}`);
      editBtn.style.display = "none";
    });
  });

  svgEdits.forEach((_e, i) => {
    let svgEdit = document.querySelector(`.edit-question.edit-btn${i}`);
    svgEdit.addEventListener("click", (event) => {
      let questionInput = document.querySelector(
        `.question-sec.edit${i} input`
      );
      questionInput.disabled = false;
      questionInput.focus();
      // event.stopPropagation();
    });
  });
  let allAnswers = document.querySelectorAll(".query-result");
  if (allAnswers.length) {
    allAnswers.forEach((singleAnswer, i) => {
      singleAnswer.classList.add("single-answer" + i);
      // singleAnswer.classList.add(i);
      // console.log(singleAnswer);
    });
    regenerateButton.disabled = false;
    regenerateButton.style.display = "inline-block";
  } else {
    regenerateButton.disabled = true;
    regenerateButton.style.display = "none";
  }

  const questionsTexts = document.querySelectorAll(".question-text");
  if (questionsTexts.length) {
    questionsTexts.forEach((questionText, i) => {
      questionText.addEventListener("blur", (e) => {
        e.target.disabled = true;
      });
      questionText.addEventListener("keyup", async (keypressEvent) => {
        if (keypressEvent.keyCode !== 13) {
          keypressEvent.target.value = keypressEvent.target.value;
          questionText.placeholder = keypressEvent.target.value;
          console.log(questionText.value);
        }
        if (keypressEvent.keyCode === 13) {
          const singleAnswer = document.querySelector(
            ".query-result.single-answer" + i
          );
          console.log(singleAnswer);
          let answer = "";
          console.log(questionText.value);
          async function generateNewQuestion() {
            let resultButton = document.getElementById("result");
            regenerateButton.disabled = true;
            resultButton.disabled = true;
            regenerateButton.style.display = "none";
            resultButton.style.display = "none";
            dots.style.width = "50px";
            dots.style.height = "20px";
            questionText.disabled = true;

            if (svgEdits.length) {
              svgEdits.forEach((svgEdit, i) => {
                // svgEdit.style.display = "none";
                svgEdit.disabled = true;
                // console.log(svgEdit);
              });
            }

            try {
              keypressEvent.stopImmediatePropagation();
              singleAnswer.innerHTML = "Typing...";
              const response = await fetch(
                "/text-completion",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ text: questionText.value }),
                }
              );

              const result = await response.json();
              answer += result?.choices[0].text;
              singleAnswer.innerHTML = "";
              for (let i = 0; i < answer.length; i++) {
                await new Promise((resolve) => setTimeout(resolve, 20));
                singleAnswer.innerHTML +=
                  answer[i] === "\n"
                    ? "<br>"
                    : answer[i] === "\t"
                    ? "&nbsp; &nbsp; &nbsp; &nbsp;"
                    : answer[i];
                // mainSec.scrollTop = mainSec.scrollHeight;
              }
              if (!isNewChat) {
                console.log(questionText.value);
                const chat = { content: `${mainSec.innerHTML}` };
                const content_id =
                  updateChat.content_id || histories[histories.length - 1]._id;
                console.log(content_id);
                await updateUserHistoryToDB(chat, user.id, content_id);
                await loadAndRenderUserHistory(user.id, renderUserHistory);
              }
              if (svgEdits.length) {
                svgEdits.forEach((svgEdit, i) => {
                  // svgEdit.style.display = "inline-block";
                  svgEdit.disabled = false;
                  // console.log(svgEdit);
                });
              }
              resultButton.disabled = false;
              resultButton.style.display = "inline-block";
              regenerateButton.disabled = false;
              regenerateButton.style.display = "inline-block";
              dots.style.width = "0px";
              dots.style.height = "0px";
            } catch (err) {
              console.log(err);
            } finally {
              isNewChat = false;
            }
          }

          await generateNewQuestion();
        } else {
          return false;
        }
      });
    });
  }

  const headerTitle = document.getElementById("title");
  headerTitle.innerHTML = text;

  //
  result.disabled = false;
  result.style.display = "inline-block";
  regenerateButton.disabled = false;
  regenerateButton.style.display = "inline-block";
  dots.style.width = "0px";
  dots.style.height = "0px";
  //
};

regenerateButton.addEventListener("click", async (e) => {
  let resultButton = document.getElementById("result");
  resultButton.disabled = true;
  resultButton.style.display = "none";
  regenerateButton.disabled = true;
  regenerateButton.style.display = "none";
  dots.style.width = "50px";
  dots.style.height = "20px";
  const questionText =
    document.querySelectorAll(".question-text")[
      document.querySelectorAll(".question-text").length - 1
    ];
  const queryResult =
    document.querySelectorAll(".query-result")[
      document.querySelectorAll(".query-result").length - 1
    ];
  let answer = "";
  try {
    queryResult.textContent = "Typing ...";
    const response = await fetch("/text-completion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: questionText.value }),
    });
    const result = await response.json();
    answer = result?.choices[0].text;
    queryResult.innerHTML = "";

    for (let i = 0; i < answer.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 20));
      queryResult.innerHTML +=
        answer[i] === "\n"
          ? "<br>"
          : answer[i] === "\t"
          ? "&nbsp; &nbsp; &nbsp; &nbsp;"
          : answer[i];
      mainSec.scrollTop = mainSec.scrollHeight;
    }
    resultButton.disabled = false;
    resultButton.style.display = "inline-block";
    regenerateButton.disabled = false;
    regenerateButton.style.display = "inline-block";
    dots.style.width = "0px";
    dots.style.height = "0px";
    if (!isNewChat) {
      const chat = { content: `${mainSec.innerHTML}` };
      const content_id = updateChat.content_id
        ? updateChat.content_id
        : histories[histories.length - 1]._id;
      console.log(content_id);
      await updateUserHistoryToDB(chat, user.id, content_id);
      await loadAndRenderUserHistory(user.id, renderUserHistory);
    }
  } catch (error) {
    console.log("Error:", error);
  }
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
    }).then(() => {
      document.location.assign("/signin");
    });
  } catch (err) {
    console.log(err);
  }
});

/// DOING SOME ACTION WHEN PAGE LOAD
window.onload = async function () {
  if (localStorage.getItem("darkMode") === "true") {
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

    container.classList.toggle("dark-b");
    conQueries.classList.toggle("query");
    textDesc.classList.toggle("dark-desc");
    document.body.classList.toggle("backgroud");
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
      user.id = data.user.id;
      user.email = data.user.email;
      await loadAndRenderUserHistory(user.id, renderUserHistory);
    }
  } catch (err) {
    console.log(err);
  }
};

// HISTORY RENDERER
const renderUserHistory = (histories) => {
  console.log("renderUserHistory Function runs");
  historyContainer.innerHTML = "";
  histories.forEach((his, i) => {
    const tab = `<button type="button" class="tab">
    <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
      <p>${
        his.title?.length > 20 ? his.title?.slice(0, 22) + "..." : his.title
      }</p>
      <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 delete-icon" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
    </button>`;
    historyContainer.innerHTML += tab;
  });
  const tabButtons = document.querySelectorAll(".tab");
  tabButtons.forEach((tabButton, i) => {
    tabButton.addEventListener("click", async (e) => {
      // console.log("history button clicked", i);
      isNewChat = false;
      // e.stopImmediatePropagation();
      for (let i = 0; i < tabButtons.length; i++) {
        if (tabButtons[i] === tabButton) {
          tabButton.style.backgroundColor = "rgb(26, 26, 26)";
          continue;
        }
        tabButtons[i].style.backgroundColor = "rgb(44, 44, 44)";
      }
      let main = document.querySelector(".item-ls");
      let logo = document.querySelector(".logo-h");
      let resultPage = document.querySelector(".result-page");
      resultPage.style.display = "block";
      main.style.display = "none";
      logo.style.display = "none";
      let titleTab = document.querySelector(".title");
      let container = document.querySelector(".x");
      container.classList.add("result-container");
      titleTab.style.display = "none";

      mainSec.innerHTML = "";
      mainSec.innerHTML = histories[i].content;
      updateChat.content_id = histories[i]._id;
      await extraFunctionality();
    });
    // tabButton.addEventListener("blur", (e) => {
    //   tabButton.style.backgroundColor = "rgb(44, 44, 44)";
    // });
  });

  const deleteIcons = document.querySelectorAll(".delete-icon");
  deleteIcons.forEach((deleteIcon, i) => {
    deleteIcon.addEventListener("click", async (e) => {
      e.stopImmediatePropagation();
      // console.log("deleting history", i);
      const content_id = histories[i]._id;
      await deleteUserHistoryToDB(content_id);
      histories = histories.filter((his) => his._id !== content_id);
      await loadAndRenderUserHistory(user.id, renderUserHistory);
      if (histories.length === 0) {
        // newChat.click();
        mainSec.innerHTML = "";
      } else {
        isNewChat = true;
        mainSec.innerHTML = histories[histories.length - 1].content;
      }
    });
  });
};

const loadAndRenderUserHistory = async (id, renderUserHistories) => {
  try {
    // GETTING USER HISTORY
    const response = await fetch(`/chats/${id}`);
    const chats = await response.json();
    histories = [];
    chats.forEach((chat) => {
      histories.push(chat);
    });
    renderUserHistory(histories);

    // RENDERING USER HISTORY
  } catch (err) {
    console.log(err);
  }
};

const saveUserHistoryToDB = async (data, id) => {
  const chat = {
    user_id: id,
    title: data.title,
    content: data.content,
  };
  try {
    const response = await fetch("/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(chat),
    });
  } catch (err) {
    console.log(err);
  }
};

const updateUserHistoryToDB = async (data, id, content_id) => {
  const chat = {
    user_id: id,
    content_id: content_id,
    content: data.content,
  };
  try {
    const response = await fetch("/chat", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(chat),
    });
  } catch (err) {
    console.log(err);
  }
};

const deleteUserHistoryToDB = async (content_id) => {
  const chat = {
    content_id: content_id,
  };
  try {
    const response = await fetch("/chat", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(chat),
    });
  } catch (err) {
    console.log(err);
  }
};

const getSummarization = async (answer) => {

  const chat = {
    text: answer.trim(),
  };
  let summary = "";
  try {
    const response = await fetch("/summarization", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(chat),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    console.log("data is",data)
  
    summary = data.summary;
  } catch (error) {
    console.log(error);
    // handle error by returning default value or showing error message
    summary = "Sorry, summarization failed. Please try again later.";
  }
  return summary;
};
