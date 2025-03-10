// Pages
const gamePage = document.getElementById("game-page");
const scorePage = document.getElementById("score-page");
const splashPage = document.getElementById("splash-page");
const countdownPage = document.getElementById("countdown-page");
// Splash Page
const startForm = document.getElementById("start-form");
const radioContainers = document.querySelectorAll(".radio-container");
const radioInputs = document.querySelectorAll("input");
const bestScores = document.querySelectorAll(".best-score-value");
// Countdown Page
const countdown = document.querySelector(".countdown");
// Game Page
const itemContainer = document.querySelector(".item-container");
// Score Page
const finalTimeEl = document.querySelector(".final-time");
const baseTimeEl = document.querySelector(".base-time");
const penaltyTimeEl = document.querySelector(".penalty-time");
const playAgainBtn = document.querySelector(".play-again");

// Equations
let questionAmount = 0;
let equationsArray = [];
let playerGuessArray = [];

// Game Page
let firstNumber = 0;
let secondNumber = 0;
let equationObject = {};
const wrongFormat = [];
let bestScoreArray = [];

// Time
let timer;
let timePlayed = 0;
let baseTime = 0;
let penaltyTime = 0;
let finalTime = 0;
let finalTimeDisplay = "0.0";

// Scroll
let valueY = 0;

// update Best Score Array
function updateBestScore() {
  bestScoreArray.forEach((score, index) => {
    // select correct Best Score to update
    if (questionAmount == score.equation) {
      // Return Best Score as number with one decimal
      const savedBestScore = Number(bestScoreArray[index].bestScore);
      // Update if the new final score is less or replacing zero
      if (savedBestScore === 0 || savedBestScore > finalTime) {
        bestScoreArray[index].bestScore = finalTimeDisplay;
      }
    }
  });
  // Update Splash Page
  bestScoreToDOM();
  // Save to local Storage
  localStorage.setItem("bestScore", JSON.stringify(bestScoreArray));
}

// Refresh Splash Page Best Scores
function bestScoreToDOM() {
  bestScores.forEach((bestScore, index) => {
    const bestScoresEl = bestScore;
    bestScoresEl.textContent = `${bestScoreArray[index].bestScore}s`;
  });
}

// Check Local Storage for Best Scores, set bestScoreArray
function getSavedBestScore() {
  if (localStorage.getItem("bestScores")) {
    bestScoreArray = JSON.parse(localStorage.getItem("bestScores"));
  } else {
    bestScoreArray = [
      {
        equation: 10,
        bestScore: finalTimeDisplay,
      },
      {
        equation: 25,
        bestScore: finalTimeDisplay,
      },
      {
        equation: 50,
        bestScore: finalTimeDisplay,
      },
      {
        equation: 99,
        bestScore: finalTimeDisplay,
      },
    ];
    localStorage.setItem("bestScore", JSON.stringify(bestScoreArray));
  }
  bestScoreToDOM();
}

// Reset Game
function playAgain() {
  gamePage.addEventListener("click", startTimer);
  scorePage.hidden = true;
  splashPage.hidden = false;
  equationsArray = [];
  playerGuessArray = [];
  valueY = 0;
  playAgainBtn.hidden = true;
}

// Format & Display Time in DOM
function scoreToDOM() {
  finalTimeDisplay = finalTime.toFixed(1);
  baseTime = timePlayed.toFixed(1);
  penaltyTime = penaltyTime.toFixed(1);
  finalTimeEl.textContent = `${finalTimeDisplay}s`;
  baseTimeEl.textContent = `Base Time: ${baseTime}s`;
  penaltyTimeEl.textContent = `Penalty: +${penaltyTime}s`;
  updateBestScore();
  // Scroll to Top, Go to Score Page
  itemContainer.scrollTo({ top: 0, behavior: "instant" });
  showScorePage();
}

// Stop Timer, Process Results, Go to Score Page
function checkTime() {
  if (playerGuessArray.length == questionAmount) {
    clearInterval(timer);
    equationsArray.forEach((equation, index) => {
      if (equation.evaluated === playerGuessArray[index]) {
        // Correct Guess, No Penalty
      } else {
        // Wrong Guess, Add Penalty
        penaltyTime += 0.5;
      }
    });
    finalTime = timePlayed + penaltyTime;
    scoreToDOM();
  }
}
// Add a tenth of  a second to timePlayed
function addTime() {
  timePlayed += 0.1;
  checkTime();
}

// Start timer when game page is clicked
function startTimer() {
  // Reset times
  timePlayed = 0;
  penaltyTime = 0;
  finalTime = 0;
  timer = setInterval(addTime, 100);
  gamePage.removeEventListener("click", startTimer);
}

// Scroll, Store User selection in playerGuessArray
function select(guessedTrue) {
  // Scroll 80px
  valueY += 80;
  itemContainer.scroll(0, valueY);
  // Add player guess to array
  return guessedTrue
    ? playerGuessArray.push("true")
    : playerGuessArray.push("false");
}

// Display Score Page
function showScorePage() {
  // Show Play Again button after 1 second
  setTimeout(() => {
    playAgainBtn.hidden = false;
  }, 1000);
  gamePage.hidden = true;
  scorePage.hidden = false;
}

// Displays Game Page
function showGamePage() {
  gamePage.hidden = false;
  countdownPage.hidden = true;
}
// Get Random Number
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

// Add equations to DOM

function equationsToDOM() {
  equationsArray.forEach((equation) => {
    // Item
    const item = document.createElement("div");
    item.classList.add("item");
    // Equation Text
    const equationText = document.createElement("h1");
    equationText.textContent = equation.value;
    // Append
    item.appendChild(equationText);
    itemContainer.appendChild(item);
  });
}

// Create Correct/Incorrect Random Equations
function createEquations() {
  const correctEquations = getRandomInt(questionAmount);
  const wrongEquations = questionAmount - correctEquations;

  // Generate correct equations
  generateEquations(correctEquations, true);

  // Generate wrong equations
  generateEquations(wrongEquations, false);

  // Shuffle the equations array
  shuffleArray(equationsArray);
}

function generateEquations(count, isCorrect) {
  for (let i = 0; i < count; i++) {
    firstNumber = getRandomInt(9);
    secondNumber = getRandomInt(9);
    const equationValue = firstNumber * secondNumber;

    let equation;
    if (isCorrect) {
      equation = `${firstNumber} x ${secondNumber} = ${equationValue}`;
    } else {
      equation = generateWrongEquation(
        firstNumber,
        secondNumber,
        equationValue
      );
    }

    equationObject = { value: equation, evaluated: isCorrect.toString() };
    equationsArray.push(equationObject);
  }
}

function generateWrongEquation(firstNumber, secondNumber, equationValue) {
  const wrongFormat = [
    `${firstNumber} x ${secondNumber + 1} = ${equationValue}`,
    `${firstNumber} x ${secondNumber} = ${equationValue - 1}`,
    `${firstNumber + 1} x ${secondNumber} = ${equationValue}`,
  ];

  const formatChoice = getRandomInt(3);
  return wrongFormat[formatChoice];
}

// Dynamically adding correct/incorrect equations
function populateGamePage() {
  // Reset DOM, Set Blank Space Above
  itemContainer.textContent = "";
  // Spacer
  const topSpacer = document.createElement("div");
  topSpacer.classList.add("height-240");
  // Selected Item
  const selectedItem = document.createElement("div");
  selectedItem.classList.add("selected-item");
  // Append
  itemContainer.append(topSpacer, selectedItem);

  // Create Equations, Build Elements in DOM
  createEquations();
  equationsToDOM();

  // Set Blank Space Below
  const bottomSpacer = document.createElement("div");
  bottomSpacer.classList.add("height-500");
  itemContainer.appendChild(bottomSpacer);
}

function countdownStart() {
  let count = 3;
  countdown.textContent = count;

  const timeCountDown = setInterval(() => {
    count--;
    if (count === 0) {
      countdown.textContent = "GO!";
    } else if (count === -1) {
      clearInterval(timeCountDown);
      showGamePage();
    } else {
      countdown.textContent = count;
    }
  }, 1000);
}

// Navigate from splash page to Countdown Page
function showCountdown() {
  countdownPage.hidden = false;
  splashPage.hidden = true;
  populateGamePage();
  countdownStart();
}

// Get the value from selected radio button
function getValue() {
  let radioValue;
  radioInputs.forEach((input) => {
    if (input.checked) {
      radioValue = input.value;
    }
  });

  return radioValue;
}

function selectQuestionAmount(e) {
  e.preventDefault();
  questionAmount = getValue();

  if (questionAmount) {
    showCountdown();
  }
}

startForm.addEventListener("click", () => {
  radioContainers.forEach((radioEl) => {
    // Remove Selected label
    radioEl.classList.remove("selected-label");
    // Add it back if radio input is checked
    if (radioEl.children[1].checked) {
      radioEl.classList.add("selected-label");
    }
  });
});

// Event Listeners
startForm.addEventListener("submit", selectQuestionAmount);
gamePage.addEventListener("click", startTimer);

// On load
getSavedBestScore();
