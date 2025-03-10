// Constants
const MAX_PARTICLE_COUNT = 150; // Maximum number of confetti particles
const PARTICLE_SPEED = 4; // Speed of particle animation
const COLORS = [
  "DodgerBlue",
  "OliveDrab",
  "Gold",
  "Pink",
  "SlateBlue",
  "LightBlue",
  "Violet",
  "PaleGreen",
  "SteelBlue",
  "SandyBrown",
  "Chocolate",
  "Crimson",
]; // Colors for confetti particles

// State variables
let streamingConfetti = false; // Whether confetti animation is running
let animationTimer = null; // Timer for animation loop
let particles = []; // Array to store confetti particles
let waveAngle = 0; // Angle for wave-like motion

// Canvas and context
let canvas = null;
let context = null;

// Initialize canvas
function initializeCanvas() {
  canvas = document.getElementById("confetti-canvas");
  if (!canvas) {
    canvas = document.createElement("canvas");
    canvas.setAttribute("id", "confetti-canvas");
    canvas.setAttribute(
      "style",
      "display:block;z-index:999999;pointer-events:none"
    );
    document.body.appendChild(canvas);
  }
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  context = canvas.getContext("2d");

  // Handle window resize
  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

// Reset a particle to its initial state
function resetParticle(particle, width, height) {
  return {
    color: COLORS[(Math.random() * COLORS.length) | 0],
    x: Math.random() * width,
    y: Math.random() * height - height,
    diameter: Math.random() * 10 + 5,
    tilt: Math.random() * 10 - 10,
    tiltAngleIncrement: Math.random() * 0.07 + 0.05,
    tiltAngle: 0,
  };
}

// Start confetti animation
function startConfetti() {
  if (!canvas) initializeCanvas();

  // Request animation frame with fallback
  window.requestAnimFrame =
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
      return window.setTimeout(callback, 16.6666667);
    };

  // Fill particles array if needed
  while (particles.length < MAX_PARTICLE_COUNT) {
    particles.push(resetParticle({}, window.innerWidth, window.innerHeight));
  }

  streamingConfetti = true;

  // Start animation loop if not already running
  if (!animationTimer) {
    const runAnimation = () => {
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);
      if (particles.length === 0) {
        animationTimer = null;
      } else {
        updateParticles();
        drawParticles();
        animationTimer = requestAnimFrame(runAnimation);
      }
    };
    runAnimation();
  }
}

// Stop confetti animation
function stopConfetti() {
  streamingConfetti = false;
}

// Remove all confetti particles
function removeConfetti() {
  stopConfetti();
  particles = [];
}

// Toggle confetti animation
function toggleConfetti() {
  if (streamingConfetti) stopConfetti();
  else startConfetti();
}

// Draw particles on the canvas
function drawParticles() {
  particles.forEach((particle) => {
    context.beginPath();
    context.lineWidth = particle.diameter;
    context.strokeStyle = particle.color;
    const x = particle.x + particle.tilt;
    context.moveTo(x + particle.diameter / 2, particle.y);
    context.lineTo(x, particle.y + particle.tilt + particle.diameter / 2);
    context.stroke();
  });
}

// Update particle positions and handle recycling
function updateParticles() {
  const width = window.innerWidth;
  const height = window.innerHeight;

  waveAngle += 0.01; // Increment wave angle for wave-like motion

  particles.forEach((particle, index) => {
    if (!streamingConfetti && particle.y < -15) {
      particle.y = height + 100; // Move particle off-screen if animation is stopped
    } else {
      particle.tiltAngle += particle.tiltAngleIncrement;
      particle.x += Math.sin(waveAngle); // Horizontal movement
      particle.y +=
        (Math.cos(waveAngle) + particle.diameter + PARTICLE_SPEED) * 0.5; // Vertical movement
      particle.tilt = Math.sin(particle.tiltAngle) * 15; // Tilt effect
    }

    // Recycle or remove particles that go off-screen
    if (particle.x > width + 20 || particle.x < -20 || particle.y > height) {
      if (streamingConfetti && particles.length <= MAX_PARTICLE_COUNT) {
        resetParticle(particle, width, height); // Reuse particle
      } else {
        particles.splice(index, 1); // Remove particle
      }
    }
  });
}

// Export public functions
export { startConfetti, stopConfetti, removeConfetti };
