const BRUSH_TIMEOUT = 1200;

const activeToolEl = document.getElementById("active-tool");
const brushColorBtn = document.getElementById("brush-color");
const brushIcon = document.getElementById("brush");
const brushSize = document.getElementById("brush-size");
const brushSlider = document.getElementById("brush-slider");
const bucketColorBtn = document.getElementById("bucket-color");
const eraser = document.getElementById("eraser");
const clearCanvasBtn = document.getElementById("clear-canvas");
const saveStorageBtn = document.getElementById("save-storage");
const loadStorageBtn = document.getElementById("load-storage");
const clearStorageBtn = document.getElementById("clear-storage");
const downloadBtn = document.getElementById("download");
const { body } = document;

// Global Variables
const canvas = document.createElement("canvas");
canvas.id = "canvas";
const context = canvas.getContext("2d");

let currentSize = 10;
let bucketColor = "#FFFFFF";
let currentColor = "#A51DAB";

let isEraser = false;
let isMouseDown = false;
let drawnArray = [];

// Formatting Brush Size
function displayBrushSize() {
  brushSize.textContent = currentSize;
}

function setBrushSize(size) {
  currentSize = size.padStart(2, "0");
  displayBrushSize();
}

function setBucketColor(color) {
  bucketColor = `#${color}`;
  createCanvas();
  restoreCanvas();
}

function setBrushColor(color) {
  isEraser = false;
  currentColor = `#${color}`;
}

function activateEraser() {
  isEraser = true;
  brushIcon.style.color = "white";
  eraser.style.color = "black";
  activeToolEl.textContent = "Eraser";
  currentColor = bucketColor;
  currentSize = 50;
}

// // Switch back to Brush
function switchToBrush() {
  isEraser = false;
  activeToolEl.textContent = "Brush";
  brushIcon.style.color = "black";
  eraser.style.color = "white";
  currentColor = `#${brushColorBtn.value}`;
  currentSize = 10;
  activeToolEl.textContent = "Eraser";
  brushSlider.value = 10;
  displayBrushSize();
}

function brushTimeSetTimeout(ms) {
  setTimeout(switchToBrush, ms);
}

// Create Canvas
function createCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - 50;
  context.fillStyle = bucketColor;
  context.fillRect(0, 0, canvas.width, canvas.height);
  body.appendChild(canvas);
  switchToBrush();
}

function clearCanvas() {
  createCanvas();
  drawnArray = [];
  // Active Tool
  activeToolEl.textContent = "Canvas Cleared";
  brushTimeSetTimeout(BRUSH_TIMEOUT);
}

// // Draw what is stored in DrawnArray
function restoreCanvas() {
  for (let i = 1; i < drawnArray.length; i++) {
    context.beginPath();
    context.moveTo(drawnArray[i - 1].x, drawnArray[i - 1].y);
    context.lineWidth = drawnArray[i].size;
    context.lineCap = "round";
    context.strokeStyle = drawnArray[i].erase
      ? bucketColor
      : drawnArray[i].color;
    context.lineTo(drawnArray[i].x, drawnArray[i].y);
    context.stroke();
  }
}

// Store Drawn Lines in DrawnArray
function storeDrawn(x, y, size, color, erase) {
  const line = {
    x,
    y,
    size,
    color,
    erase,
  };
  drawnArray.push(line);
}

// Get Mouse Position
function getMousePosition(event) {
  const boundaries = canvas.getBoundingClientRect();
  return {
    x: event.clientX - boundaries.left,
    y: event.clientY - boundaries.top,
  };
}

function handleMouseDown(event) {
  isMouseDown = true;
  const currentPosition = getMousePosition(event);
  context.moveTo(currentPosition.x, currentPosition.y);
  context.beginPath();
  context.lineWidth = currentSize;
  context.lineCap = "round";
  context.strokeStyle = currentColor;
}

function handleMouseMove(event) {
  if (isMouseDown) {
    const currentPosition = getMousePosition(event);
    context.lineTo(currentPosition.x, currentPosition.y);
    context.stroke();
    storeDrawn(
      currentPosition.x,
      currentPosition.y,
      currentSize,
      currentColor,
      isEraser
    );
  } else {
    storeDrawn(undefined);
  }
}

function handleMouseUp() {
  isMouseDown = false;
}

function svaeToLocalStorage() {
  localStorage.setItem("savedCanvas", JSON.stringify(drawnArray));
  // Active Tool
  activeToolEl.textContent = "Canvas Saved";
  brushTimeSetTimeout(BRUSH_TIMEOUT);
}

function loadFromLocalStorage() {
  if (localStorage.getItem("savedCanvas")) {
    drawnArray = JSON.parse(localStorage.savedCanvas);
    restoreCanvas();
    // Active Tool
    activeToolEl.textContent = "Canvas Loaded";
    brushTimeSetTimeout(BRUSH_TIMEOUT);
  } else {
    activeToolEl.textContent = "No Canvas Found";
  }
}

function clearLocalStorage() {
  localStorage.removeItem("savedCanvas");
  // Active Tool
  activeToolEl.textContent = "Local Storage Cleared";
  brushTimeSetTimeout(BRUSH_TIMEOUT);
}

function downloadImage() {
  const dataURL = canvas.toDataURL("image/jpeg", 1.0);
  downloadBtn.href = dataURL;
  downloadBtn.download = "paint-example.jpg";
  // Active Tool
  activeToolEl.textContent = "Image File Saved";
  brushTimeSetTimeout(BRUSH_TIMEOUT);
}

// Setting Brush Color
brushColorBtn.addEventListener("change", (e) => setBrushColor(e.target.value));

// Setting Background Color
bucketColorBtn.addEventListener("change", (e) =>
  setBucketColor(e.target.value)
);

// Setting Brush Size
brushSlider.addEventListener("change", (e) => setBrushSize(e.target.value));

// Eraser
eraser.addEventListener("click", activateEraser);

// // Clear Canvas
clearCanvasBtn.addEventListener("click", clearCanvas);

// // Save to Local Storage
saveStorageBtn.addEventListener("click", svaeToLocalStorage);

// Load from Local Storage
loadStorageBtn.addEventListener("click", loadFromLocalStorage);

// // Clear Local Storage
clearStorageBtn.addEventListener("click", clearLocalStorage);

// // Download Image
downloadBtn.addEventListener("click", downloadImage);

// // Event Listener
brushIcon.addEventListener("click", switchToBrush);

// Mouse Up
canvas.addEventListener("mouseup", handleMouseUp);

// Mouse Move
canvas.addEventListener("mousemove", handleMouseMove);

// Mouse Down
canvas.addEventListener("mousedown", handleMouseDown);

// On Load
createCanvas();
