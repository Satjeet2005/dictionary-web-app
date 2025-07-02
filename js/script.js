// ========
// THEME CHANGE
// ========

// fetchData('keyboard');
// scroll Btn Transition On Click
const scrollBtn = document.querySelector(".scroll-btn");
const scrollBall = document.querySelector(".scroll-ball");
scrollBtn.addEventListener("click", () => {
  changeTheme();
});

// theme change icon transition
const themeChangeIcon = document.querySelector(".theme-change-icon");
themeChangeIcon.addEventListener("click", () => {
  changeTheme();
});

function changeTheme() {
  scrollBall.classList.toggle("move-left");
  scrollBtn.classList.toggle("scroll-btn-transition");

  const body = document.querySelector("body");
  body.classList.toggle("body--dark");
  body.classList.toggle("body--light");
}

// =======
// FONT SELECTION
// =======

// font selection div Trigger : click on selected font
const fontSelectionContainer = document.querySelector(
  ".font-selection-container"
);
const selectedFontContainer = document.querySelector(
  ".selected-font-container"
);
const selectedFont = document.querySelector(".selected-font");
selectedFont.addEventListener("click", () => {
  fontSelectionContainer.classList.toggle("hidden");
});

// Trigger: chevron-down
const chevronDown = document.querySelector(".chevron-down");
chevronDown.addEventListener("click", () => {
  fontSelectionContainer.classList.toggle("hidden");
});

//font selection
const fontOptions = document.querySelectorAll(".font-option");
fontOptions.forEach((fontOption) => {
  fontOption.addEventListener("click", (e) => {
    selectedFont.innerHTML = e.target.innerHTML;
    changePageFont(e.target.dataset.font);
    fontSelectionContainer.classList.add("hidden");
  });
});

//font selection container to hide on blur
document.addEventListener("click", (e) => {
  if (
    !fontSelectionContainer.contains(e.target) &&
    !selectedFontContainer.contains(e.target)
  ) {
    fontSelectionContainer.classList.add("hidden");
  }
});

//change page font
function changePageFont(font) {
  const body = document.querySelector("body");
  body.classList.remove("font--mono");
  body.classList.remove("font--sans-serif");
  body.classList.remove("font-serif");

  body.classList.add(`font--${font}`);
}

// ======
// INPUT
// ======

// make input active
const input = document.querySelector("#text-input");
const inputContainer = document.querySelector(".input-container");
input.addEventListener("focus", () => {
  inputContainer.classList.add("input-container--active");
});

// make input inactive
document.addEventListener("click", (e) => {
  if (!inputContainer.contains(e.target)) {
    inputContainer.classList.remove("input-container--active");
  }
});

//search keyword on input
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    hitAPI();
  }
});

window.addEventListener("blur", () => {
  inputContainer.classList.remove("input-container--active");
});

//search icon active and outer div inactive
const searchIcon = document.querySelector(".search-button");
searchIcon.addEventListener("focus", () => {
  inputContainer.classList.remove("input-container--active");
});

//search icon API HIT
searchIcon.addEventListener("click", () => {
  hitAPI();
});

function hitAPI() {
  fetchData(input.value);
  input.value = "";
}

// =====
// WORD SECTION
// =====

// play button
const playButton = document.querySelector(".play-button");
const audioButton = document.querySelector(".audio");
playButton.addEventListener("click", () => {
  if (audioButton.getAttribute("src") !== "") {
    audioButton.play();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  fetchData("keyboard");
});

// =======
// API DATA FETCH
// =======

// fetch data fun
async function fetchData(word) {
  try {
    let response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    );

    let data = await response.json();
    console.log(data);
    if (!response.ok) {
      toggleErrorState("show");
      toggleSafeState("hide");
      return;
    }

    toggleErrorState("hide");
    toggleSafeState("show");
    renderData(data);
  } catch (error) {
    console.error();
  }
}

// ======
// UPDATE API URL
// ======

function updateAPI(api){
  const apiURLText = document.querySelector('.api-URL-text');
  const apiURL = document.querySelector('.api-URL');
  apiURLText.innerHTML = `${api}`;
  apiURL.setAttribute('href',api);
}

// ========
// RENDER DATA
// ========
function renderData(object) {
  let keyword = object[0].word;
  let phonetic = object[0].phonetics;
  let meaning = object[0].meanings;

  let partOfSpeech = ["noun", "verb", "pronoun", "interjection", "adjective"];

  renderkeyword(keyword);
  renderPhonetic(phonetic);
  renderAudio(phonetic);

  partOfSpeech.forEach((itr) => {
    renderMeaning(meaning, itr);
    renderSynonyms(meaning, itr);
  });

  updateAPI(object[0].sourceUrls[0]);
}

// ======
// KEYWORD
// =======
function renderkeyword(keyword) {
  const keywordText = document.querySelector(".word");
  keywordText.innerHTML = `${keyword}`;
}

// ========
// PHONETIC
// =======

function renderPhonetic(object) {
  const keywordProText = document.querySelector(".word-pro");
  if (object.length === 0) {
    keywordProText.innerHTML = "";
    return;
  }

  let phonetic = object.find((o) => {
    return o.text !== "" && o.text !== undefined;
  });

  keywordProText.innerHTML =
    phonetic && phonetic.text !== ""
      ? (keywordProText.innerHTML = `${phonetic.text}`)
      : (keywordProText.innerHTML = "");
}

// ======
// RENDER AUDIO
// ======

function renderAudio(object) {
  const audioButton = document.querySelector(".audio");
  const errorText = document.querySelector(".error-container");
  if (object.length === 0) {
    audioButton.setAttribute("src", "");
    errorText.classList.remove("hidden");
    return;
  }

  let URL = object.find((o) => {
    return o.audio !== "" && o.audio !== undefined;
  });

  if (URL && URL.audio !== "") {
    audioButton.setAttribute("src", `${URL.audio}`);
    errorText.classList.add("hidden");
  } else {
    audioButton.setAttribute("src", "");
    errorText.classList.remove("hidden");
  }
}

// =======
// RENDER MEANING
// ======

function renderMeaning(object, partOfSpeech) {
  const maximumMeaning = 3;
  if (!object.length) {
    checkSection(`#${partOfSpeech}-meaning`);
    return;
  }

  cleanUnorderedList(`#${partOfSpeech}-meaning`);

  const meanings = getValidMeanings(object, partOfSpeech);
  const targetSelector = `#${partOfSpeech}-meaning`;

  const definitions = extractDefinitions(meanings, maximumMeaning);
  const examples = extractExamples(meanings, partOfSpeech, maximumMeaning);

  definitions.forEach((def, index) => {
    appendList(createList(def, "font", "meaning"), targetSelector);

    if (partOfSpeech === "verb" && examples[index]) {
      appendList(
        createParagraph(`"${examples[index]}"`, "verb-example"),
        targetSelector
      );
    }
  });

  checkSection(targetSelector);
}


// =======
// HELPER FUNCTION
// ========
function getValidMeanings(object, partOfSpeech) {
  return object.filter(
    (meaning) =>
      meaning.partOfSpeech === `${partOfSpeech}` &&
      meaning.definitions.some((def) => def.definition?.trim())
  );
}

function extractDefinitions(meanings, limit = 3) {
  const defs = [];
  for (let meaning of meanings) {
    for (let def of meaning.definitions) {
      if (def.definition?.trim()) {
        defs.push(def.definition);
        if (defs.length === limit) return defs;
      }
    }
  }
  return defs;
}

function extractExamples(meanings) {
  const examples = [];
  for (let meaning of meanings) {
    for (let def of meaning.definitions) {
      if (def.example?.trim()) {
        examples.push(def.example);
      }
    }
  }

  return examples;
}

// =======
// SYNONYMS
// ======
function renderSynonyms(object, partOfSpeech) {
  if (object.length === 0) {
    checkSynonymsList(
      `#${partOfSpeech}-synonyms-heading`,
      `#${partOfSpeech}-synonyms-list`
    );
    return;
  }

  cleanUnorderedList(`#${partOfSpeech}-synonyms-list`);

  let definition = object.filter((o) => {
    return (
      o.partOfSpeech === `${partOfSpeech}` &&
      o.synonyms !== "" &&
      o.synonyms !== undefined
    );
  });

  const maximunSynonyms = 5;
  let iterator = 0;
  definition.forEach((def) => {
    def.synonyms.forEach((synonym) => {
      if (iterator === maximunSynonyms) {
        return;
      }
      appendList(
        createList(synonym, "synonyms-list", "clickable"),
        `#${partOfSpeech}-synonyms-list`
      );
      iterator++;
    });
  });

  checkSynonymsList(
    `#${partOfSpeech}-synonyms-heading`,
    `#${partOfSpeech}-synonyms-list`
  );
}

// synonyms click event
let synonymsList = document.querySelectorAll(".synonyms-list-container");
synonymsList.forEach((synonym) => {
  synonym.addEventListener("click", (e) => {
    console.log("ki");
    if (e.target.classList.contains("synonyms-list")) {
      fetchData(`${e.target.innerHTML}`);
    }
  });
});

// check if syn exist or not
function checkSynonymsList(heading, list) {
  let synonymHeading = document.querySelector(`${heading}`);
  let listInnerHTML = document.querySelector(`${list}`).innerHTML;
  if (listInnerHTML === "") {
    synonymHeading.classList.add("hidden");
  } else {
    synonymHeading.classList.remove("hidden");
  }
}

// check if meaning exist or not
function checkSection(section) {
  let sectionContainer = document.querySelector(`${section}`).parentElement;
  let sectionInnerHTML = document.querySelector(`${section}`).innerHTML;
  if (sectionInnerHTML === "") {
    sectionContainer.classList.add("hidden");
  } else {
    sectionContainer.classList.remove("hidden");
  }
}

// =======
// LIST CREATION & CLEAN UP
// ========
// create a list
function createList(string, ...classess) {
  let li = document.createElement("li");
  classess.forEach((c) => {
    li.classList.add(`${c}`);
  });
  li.innerHTML = `${string}`;

  return li;
}

//append list
function appendList(list, listContainer) {
  const ul = document.querySelector(`${listContainer}`);
  ul.appendChild(list);
}

//clean unordered list
function cleanUnorderedList(listContainer) {
  const ul = document.querySelector(`${listContainer}`);
  ul.innerHTML = "";
}

// =======
// ANCHOR CREATION
// ======

function createAnchor(link, ...classess) {
  let anchor = document.createElement("a");
  anchor.setAttribute("href", `${link}`);
  classess.forEach((c) => {
    anchor.classList.add(`${c}`);
  });

  return anchor;
}

// ========
// PARAGRAPH CREATION
// ========

function createParagraph(string, ...classess) {
  let p = document.createElement("p");
  p.innerHTML = `${string}`;

  classess.forEach((c) => {
    p.classList.add(`${c}`);
  });

  return p;
}

// ========
// DIV CREATION
// =========

function createDiv() {
  let div = document.createElement("div");
  return div;
}

// =========
// ERROR SECTION
// =========

function toggleErrorState(operation) {
  if (operation === "hide") {
    document.querySelector(".error-section").classList.add("hidden");
  } else {
    document.querySelector(".error-section").classList.remove("hidden");
  }
}

function toggleSafeState(operation) {
  if (operation === "hide") {
    document
      .querySelectorAll(".safe-state")
      .forEach((element) => element.classList.add("hidden"));
  } else {
    document
      .querySelectorAll(".safe-state")
      .forEach((element) => element.classList.remove("hidden"));
  }
}
