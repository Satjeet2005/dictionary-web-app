// scroll Btn Transition On Click
const scrollBtn = document.querySelector(".scroll-btn");
const scrollBall = document.querySelector(".scroll-ball");
scrollBtn.addEventListener("click", () => {
  scrollBall.classList.toggle("move-left");
});

// theme change icon transition
const themeChangeIcon = document.querySelector('.theme-change-icon')
themeChangeIcon.addEventListener('click', () => {
  scrollBall.classList.toggle('move-left');
})

// =======
// FONT SELECTION
// =======

// font selection div Trigger : click on selected font
const fontSelectionContainer = document.querySelector('.font-selection-container');
const selectedFontContainer = document.querySelector('.selected-font-container');
const selectedFont = document.querySelector('.selected-font');
selectedFont.addEventListener('click', () => {
  fontSelectionContainer.classList.toggle('hidden');
})

// Trigger: chevron-down
const chevronDown = document.querySelector('.chevron-down');
chevronDown.addEventListener('click',() => {
    fontSelectionContainer.classList.toggle('hidden');
})

//font selection
const fontOptions = document.querySelectorAll('.font-option');
fontOptions.forEach((fontOption) => {
  fontOption.addEventListener('click',(e) => {
    selectedFont.innerHTML = e.target.innerHTML;
    changePageFont(e.target.dataset.font);
    fontSelectionContainer.classList.add('hidden');
  })
})

//font selection container to hide on blur
document.addEventListener('click', (e) => {
  if(!fontSelectionContainer.contains(e.target) && !selectedFontContainer.contains(e.target)){
    fontSelectionContainer.classList.add('hidden');
  }
})

//change page font
function changePageFont(font){
  const body = document.querySelector('body');
  body.classList.remove('font--mono');
  body.classList.remove('font--sans-serif');
  body.classList.remove('font-serif');

  body.classList.add(`font--${font}`);
}
