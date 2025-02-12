const menuBars = document.getElementById("menu-bars");
const overlay = document.getElementById("overlay");
const navItems = Array.from(document.querySelectorAll("[id^='nav-']"));

// Control Direction Animation
const navAnimation = (direction1, direction2) => {
  navItems.forEach((nav, i) => {
    nav.classList.replace(
      `slide-${direction1}-${i + 1}`,
      `slide-${direction2}-${i + 1}`
    );
  });
};

// Toggle Navigation
const toggleNav = () => {
  const isActive = overlay.classList.toggle("overlay-active");
  menuBars.classList.toggle("change");
  overlay.classList.replace(
    `overlay-slide-${isActive ? "left" : "right"}`,
    `overlay-slide-${isActive ? "right" : "left"}`
  );
  navAnimation(isActive ? "out" : "in", isActive ? "in" : "out");
};

// Event Listeners
menuBars.addEventListener("click", toggleNav);
navItems.forEach((nav) => nav.addEventListener("click", toggleNav));
