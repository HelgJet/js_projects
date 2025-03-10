// Constants
const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 700;
const PADDLE_HEIGHT = 10;
const PADDLE_WIDTH = 50;
const PADDLE_DIFF = 25;
const BALL_RADIUS = 5;
const WINNING_SCORE = 7;

// DOM elements
const { body } = document;
const canvas = document.createElement("canvas");
const context = canvas.getContext("2d");
const gameOverEl = document.createElement("div");

// State game
const game = {
  isGameOver: true,
  isNewGame: true,
  playerScore: 0,
  computerScore: 0,
};

// Positions and ball Speeds
const ball = {
  x: CANVAS_WIDTH / 2,
  y: CANVAS_HEIGHT / 2,
  speedX: 0,
  speedY: 0,
  trajectoryX: 0,
};

const paddle = {
  bottomX: 225,
  topX: 225,
  playerMoved: false,
  paddleContact: false,
  computerSpeed: 3,
};

const isMobile = window.matchMedia("(max-width: 600px)");
// Change Mobile Settings
if (isMobile.matches) {
  ball.speedY = -2;
  ball.speedX = speedY;
  paddle.computerSpeed = 4;
} else {
  ball.speedY = -1;
  ball.speedX = ball.speedY;
  paddle.computerSpeed = 3;
}

// Create Canvas Element
function createCanvas() {
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  body.appendChild(canvas);
  renderCanvas();
}

// Render Everything on Canvas
function renderCanvas() {
  // Canvas Background
  context.fillStyle = "black";
  context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  // Paddle Color
  context.fillStyle = "white";
  // Player Paddle (Bottom)
  context.fillRect(
    paddle.bottomX,
    CANVAS_HEIGHT - 20,
    PADDLE_WIDTH,
    PADDLE_HEIGHT
  );
  // Computer Paddle (Top)
  context.fillRect(paddle.topX, 10, PADDLE_WIDTH, PADDLE_HEIGHT);
  // Dashed Center Line
  context.beginPath();
  context.setLineDash([4]);
  context.moveTo(0, CANVAS_HEIGHT / 2);
  context.lineTo(CANVAS_WIDTH, CANVAS_HEIGHT / 2);
  context.strokeStyle = "grey";
  context.stroke();
  // Ball
  context.beginPath();
  context.arc(ball.x, ball.y, BALL_RADIUS, 0, 2 * Math.PI);
  context.fillStyle = "white";
  context.fill();
  // Score
  context.font = "32px Courier New";
  context.fillText(game.playerScore, 20, CANVAS_HEIGHT / 2 + 50);
  context.fillText(game.computerScore, 20, CANVAS_HEIGHT / 2 - 30);
}

// Reset Ball to Center
function resetBall() {
  ball.x = CANVAS_WIDTH / 2;
  ball.y = CANVAS_HEIGHT / 2;
  ball.speedY = -3;
  paddle.paddleContact = false;
}

// Adjust Ball Movement
function moveBall() {
  // Vertical Speed
  ball.y += -ball.speedY;
  // Horizontal Speed
  if (paddle.playerMoved && paddle.paddleContact) {
    ball.x += ball.speedX;
  }
}

// Determine What Ball Bounces Off, Score Points, Reset Ball
function checkBallBoundaries() {
  // Bounce off Left / Right Wall
  if (
    (ball.x < 0 && ball.speedX < 0) ||
    (ball.x > CANVAS_WIDTH && ball.speedX > 0)
  ) {
    ball.speedX = -ball.speedX;
  }

  // Bounce off player paddle (bottom)
  if (ball.y > CANVAS_HEIGHT - PADDLE_DIFF) {
    if (ball.x > paddle.bottomX && ball.x < paddle.bottomX + PADDLE_WIDTH) {
      paddle.paddleContact = true;
      // Add Speed on Hit
      if (paddle.playerMoved) {
        ball.speedY -= 1;
        // Max Speed
        if (ball.speedY < -5) {
          ball.speedY = -5;
          paddle.computerSpeed = 6;
        }
      }
      ball.speedY = -ball.speedY;
      ball.trajectoryX = ball.x - (paddle.bottomX + PADDLE_DIFF);
      ball.speedX = ball.trajectoryX * 0.3;
    } else if (ball.y > CANVAS_HEIGHT) {
      // Reset Ball, add to Computer Score
      resetBall();
      game.computerScore++;
    }
  }
  // Bounce off computer paddle (top)
  if (ball.y < PADDLE_DIFF) {
    if (ball.x > paddle.topX && ball.x < paddle.topX + PADDLE_WIDTH) {
      // Add Speed on Hit
      if (paddle.playerMoved) {
        ball.speedY += 1;
        // Max Speed
        if (ball.speedY > 5) {
          ball.speedY = 5;
        }
      }
      ball.speedY = -ball.speedY;
    } else if (ball.y < 0) {
      // Reset Ball, add to Player Score
      resetBall();
      game.playerScore++;
    }
  }
}

// Computer Movement
function computerAI() {
  if (paddle.playerMoved) {
    const computerPaddleCenter = paddle.topX + PADDLE_WIDTH / 2;
    if (computerPaddleCenter < ball.x - 10) {
      paddle.topX += paddle.computerSpeed;
    } else if (computerPaddleCenter > ball.x + 10) {
      paddle.topX -= paddle.computerSpeed;
    }
    paddle.topX = Math.max(
      0,
      Math.min(paddle.topX, CANVAS_WIDTH - PADDLE_WIDTH)
    );
  }
}

function showGameOverEl(winner) {
  // Hide Canvas
  canvas.hidden = true;
  // Container
  gameOverEl.textContent = "";
  gameOverEl.classList.add("game-over-container");
  // Title
  const title = document.createElement("h1");
  title.textContent = `${winner} Wins!`;
  // Button
  const playAgainBtn = document.createElement("button");
  playAgainBtn.setAttribute("onclick", "startGame()");
  playAgainBtn.textContent = "Play Again";
  // Append
  gameOverEl.append(title, playAgainBtn);
  body.appendChild(gameOverEl);
}

// Check If One Player Has Winning Score, If They Do, End Game
function checkGameOver() {
  if (
    game.playerScore === WINNING_SCORE ||
    game.computerScore === WINNING_SCORE
  ) {
    game.isGameOver = true;
    // Set Winner
    const winner = game.playerScore === WINNING_SCORE ? "Player 1" : "Computer";
    showGameOverEl(winner);
  }
}

// Called Every Frame
function animate() {
  renderCanvas();
  moveBall();
  checkBallBoundaries();
  computerAI();
  checkGameOver();
  if (!game.isGameOver) {
    window.requestAnimationFrame(animate);
  }
}

// Start Game, Reset Everything
function startGame() {
  if (game.isGameOver && !game.isNewGame) {
    body.removeChild(gameOverEl);
    canvas.hidden = false;
  }
  game.isGameOver = false;
  game.isNewGame = false;
  game.playerScore = 0;
  game.computerScore = 0;
  resetBall();
  createCanvas();
  animate();
  canvas.addEventListener("mousemove", (e) => handleMouseMove(e));
}

function handleMouseMove(e) {
  paddle.playerMoved = true; // For computer react
  // Compensate for canvas being centered
  const canvasRect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - canvasRect.left;
  paddle.bottomX = Math.max(
    0,
    Math.min(mouseX - PADDLE_WIDTH / 2, CANVAS_WIDTH - PADDLE_WIDTH)
  );

  // Hide Cursor
  canvas.style.cursor = "none";
}

// On Load
startGame();
