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