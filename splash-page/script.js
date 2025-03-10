const { body } = document;

const backgroundClasses = {
  1: "background-1",
  2: "background-2",
  3: "background-3",
};

const BACKGROUND_KEY = "selectedBackground";

function removeBackgroundClasses() {
  Object.values(backgroundClasses).forEach((className) => {
    body.classList.remove(className);
  });
}

function addBackgroundClass(value) {
  // Check if background already showing

  //   let previousBackground;
  //   if (body.className) {
  //     previousBackground = body.className;
  //   }
  //   return previousBackground === backgroundClasses[value]
  //     ? false
  //     : body.classList.add(backgroundClasses[value]);

  const newClass = backgroundClasses[value];

  if (newClass && !body.classList.contains(newClass)) {
    body.classList.add(newClass);
  }
}

function changeBackground(number) {
  removeBackgroundClasses();

  //   switch (number) {
  //     case "1":
  //       addBackgroundClass(number);
  //       break;
  //     case "2":
  //       addBackgroundClass(number);

  //       break;
  //     case "3":
  //       addBackgroundClass(number);
  //       break;

  //     default:
  //       break;
  //   }

  if (backgroundClasses[number]) {
    addBackgroundClass(number);
    localStorage.setItem(BACKGROUND_KEY, number);
  } else {
    localStorage.removeItem(BACKGROUND_KEY);
  }
}

function restoreBackground() {
  const savedBackground = localStorage.getItem(BACKGROUND_KEY);
  if (savedBackground && backgroundClasses[savedBackground]) {
    changeBackground(savedBackground);
  }
}

// Init selected background
document.addEventListener("DOMContentLoaded", restoreBackground);

// Check memory example
// let count = 0;
// const ourMemory = {
//   [count]: Array(1000).fill("*"),
// };
// inside function
//   count++;
//   ourMemory[count] = Array(1000).fill("*");
