const toggleSwitch = document.querySelector('input[type="checkbox"]');
const nav = document.getElementById("nav");
const toggleIcon = document.querySelector(".toggle-icon");
const image1 = document.getElementById("image1");
const image2 = document.getElementById("image2");
const image3 = document.getElementById("image3");
const textBox = document.getElementById("text-box");

const DARK_THEME = "dark";
const LIGHT_THEME = "light";

// Check local storage for theme(key)
const currentTheme = localStorage.getItem("theme") || DARK_THEME;

if (currentTheme) {
  document.documentElement.setAttribute("data-theme", currentTheme);
  toggleMode(currentTheme);
  if (currentTheme === DARK_THEME) {
    toggleSwitch.checked = true;
  }
}

// Toggle mode
function toggleMode(mode) {
  const isDarkMode = mode === DARK_THEME;
  // Upd styles
  nav.style.backgroundColor = isDarkMode
    ? "rgb(0 0 0 / 50%)"
    : "rgb(255 255 255 / 50%)";
  textBox.style.backgroundColor = isDarkMode
    ? "rgb(255 255 255 / 50%)"
    : "rgb(0 0 0 / 50%)";

  // Upd text toggle icon and shadow class
  toggleIcon.children[0].textContent = isDarkMode ? "Dark Mode" : "Light Mode";
  toggleIcon.children[2].classList.toggle("shadow-for--dark", isDarkMode);
  toggleIcon.children[2].classList.toggle("shadow-for--light", !isDarkMode);

  // Upd images
  const imageSuffix = isDarkMode ? DARK_THEME : LIGHT_THEME;
  image1.src = `img/undraw_proud_coder_${imageSuffix}.svg`;
  image2.src = `img/undraw_feeling_proud_${imageSuffix}.svg`;
  image3.src = `img/undraw_conceptual_idea_${imageSuffix}.svg`;
}

// Switch Theme Dynamically
function switchTheme(event) {
  const mode = event.target.checked ? DARK_THEME : LIGHT_THEME;
  document.documentElement.setAttribute("data-theme", mode);
  localStorage.setItem("theme", mode);
  toggleMode(mode);
}

// Event Listener
toggleSwitch.addEventListener("change", switchTheme);
