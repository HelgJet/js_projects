// import { startConfetti, stopConfetti, removeConfetti } from "./conffeti.js";

// DOM elements grouped for better organization
const elements = {
  playerScore: document.getElementById("playerScore"),
  playerChoice: document.getElementById("playerChoice"),
  computerScore: document.getElementById("computerScore"),
  computerChoice: document.getElementById("computerChoice"),
  resultText: document.getElementById("resultText"),
  playerIcons: {
    rock: document.getElementById("playerRock"),
    paper: document.getElementById("playerPaper"),
    scissors: document.getElementById("playerScissors"),
    lizard: document.getElementById("playerLizard"),
    spock: document.getElementById("playerSpock"),
  },
  computerIcons: {
    rock: document.getElementById("computerRock"),
    paper: document.getElementById("computerPaper"),
    scissors: document.getElementById("computerScissors"),
    lizard: document.getElementById("computerLizard"),
    spock: document.getElementById("computerSpock"),
  },
  allGameIcons: document.querySelectorAll(".far"), // All game icons for resetting selections
};

// Game choices with their properties and what they defeat
const choices = {
  rock: { name: "Rock", defeats: ["scissors", "lizard"] },
  paper: { name: "Paper", defeats: ["rock", "spock"] },
  scissors: { name: "Scissors", defeats: ["paper", "lizard"] },
  lizard: { name: "Lizard", defeats: ["paper", "spock"] },
  spock: { name: "Spock", defeats: ["scissors", "rock"] },
};

// Scores for player and computer
let scores = {
  player: 0,
  computer: 0,
};

// Variable to store the computer's choice
let computerChoice = "";

// Function to reset all selected icons and stop confetti
function resetSelected() {
  elements.allGameIcons.forEach((icon) => icon.classList.remove("selected"));

  import("./conffeti.js").then((module) => {
    module.stopConfetti();
    module.removeConfetti();
  });
}

// Function to reset the entire game (scores, choices, and UI)
function resetAll() {
  resetSelected();
  scores = { player: 0, computer: 0 };
  computerChoice = "";
  elements.playerScore.textContent = scores.player;
  elements.computerScore.textContent = scores.computer;
  elements.playerChoice.textContent = "";
  elements.computerChoice.textContent = "";
  elements.resultText.textContent = "";
}

// Function to get a random choice for the computer
function getRandomChoice() {
  const choicesArray = Object.keys(choices); // Get array of choice keys (rock, paper, etc.)
  const randomIndex = Math.floor(Math.random() * choicesArray.length); // Random index
  return choicesArray[randomIndex];
}

// Function to display the selected choice (for player or computer)
function displayChoice(choice, isPlayer = true) {
  const icons = isPlayer ? elements.playerIcons : elements.computerIcons; // Select icons based on player/computer
  const choiceElement = elements[isPlayer ? "playerChoice" : "computerChoice"]; // Select text element

  if (icons[choice]) {
    icons[choice].classList.add("selected"); // Add 'selected' class to the icon
    choiceElement.textContent = ` --- ${choices[choice].name}`; // Update choice text
  }
}

// Function to update the score and result text based on the game outcome
function updateScore(playerChoice) {
  if (playerChoice === computerChoice) {
    elements.resultText.textContent = "It is a tie!"; // Tie condition
  } else {
    const playerWins = choices[playerChoice].defeats.includes(computerChoice); // Check if player wins
    if (playerWins) {
      import("./conffeti.js").then((module) => {
        module.startConfetti(); // Celebrate win
        elements.resultText.textContent = "You Won!";
        scores.player++; // Increment player score
        elements.playerScore.textContent = scores.player;
      });
    } else {
      elements.resultText.textContent = "You lose!";
      scores.computer++;
      elements.computerScore.textContent = scores.computer;
    }
  }
}

// Function to check the result of the game
function checkResult(playerChoice) {
  resetSelected(); // Reset all selected icons
  computerChoice = getRandomChoice(); // Get computer's random choice
  displayChoice(computerChoice, false); // Display computer's choice
  updateScore(playerChoice); // Update score and result text
}

// Function to handle player's selection
function select(playerChoice) {
  checkResult(playerChoice); // Check the result based on player's choice
  displayChoice(playerChoice, true); // Display player's choice
}

// Expose functions to the global scope for use in HTML
window.select = select;
window.resetAll = resetAll;

// Initialize the game by resetting everything
resetAll();
