const darkToggle = document.getElementById("headertoggle");

const applyDarkToggle = function () {
  document.body.classList.toggle("dark-mode");
};

darkToggle.addEventListener("click", applyDarkToggle);
