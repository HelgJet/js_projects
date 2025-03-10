const player = document.querySelector(".player");
const playBtn = document.getElementById("play-btn");
const video = document.querySelector("video");
const progressRange = document.querySelector(".progress-range");
const progressBar = document.querySelector(".progress-bar");
const volumeIcon = document.getElementById("volume-icon");
const volumeRange = document.querySelector(".volume-range");
const volumeBar = document.querySelector(".volume-bar");
const currentTimeEl = document.querySelector(".time-elasped");
const durationEl = document.querySelector(".time-duration");
const fullscreenBtn = document.querySelector(".fullscreen");
const speed = document.querySelector(".player-speed");

// Play & Pause ----------------------------------- //
// Check if Playing
let isPlaying = false;

// Show icon play / change title

const showPlayIcon = () => {
  playBtn.classList.replace("fa-pause", "fa-play");
  playBtn.setAttribute("title", "Play");
  isPlaying = false;
};

// Play
const playVideo = () => {
  isPlaying = true;
  playBtn.classList.replace("fa-play", "fa-pause");
  playBtn.setAttribute("title", "Pause");
  video.play();
};

// Pause
const pauseVideo = () => {
  showPlayIcon();
  video.pause();
};

// Toggle Video
const toggleVideo = () => {
  isPlaying ? pauseVideo() : playVideo();
};

// Progress Bar ---------------------------------- //

// Format time helper function
function formatTime(time) {
  const minutes = Math.floor(time / 60);
  const seconds = String(Math.floor(time % 60)).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

// Update Progress Bar & Time
function updateProgressBar(e) {
  const mediaElement = e.srcElement || e.target;
  const { duration, currentTime } = mediaElement;

  // Upd progress bar width
  const progressPercent = (currentTime / duration) * 100;
  progressBar.style.width = `${progressPercent}%`;

  // Update duration display
  if (duration) {
    durationEl.textContent = duration ? formatTime(duration) : "0:00";
  }

  // Update current time display
  currentTimeEl.textContent = `${formatTime(currentTime)} /`;
}

// Set progress bar
function setProgressBar(e) {
  const width = this.clientWidth;
  const clickX = e.offsetX;
  const { duration } = video;
  video.currentTime = (clickX / width) * duration;
}

// Volume Controls --------------------------- //

let lastVolume = 1;

function updateVolumeIcon(volume, forcedMute = false) {
  // Reset any existing classes
  volumeIcon.className = "";

  if (forcedMute) {
    volumeIcon.classList.add("fas", "fa-volume-mute");
  } else if (volume > 0.7) {
    volumeIcon.classList.add("fas", "fa-volume-up");
  } else if (volume > 0 && volume <= 0.7) {
    volumeIcon.classList.add("fas", "fa-volume-down");
  } else {
    volumeIcon.classList.add("fas", "fa-volume-off");
  }
}

// Mute/Unmute
function toogleMute() {
  volumeIcon.className = "";
  if (video.volume > 0) {
    lastVolume = video.volume;
    video.volume = 0;
    volumeBar.style.width = "0%";
    updateVolumeIcon(0, true);
    volumeIcon.setAttribute("title", "Unmute");
  } else {
    video.volume = lastVolume;
    volumeBar.style.width = `${lastVolume * 100}%`;
    updateVolumeIcon(lastVolume);
    volumeIcon.setAttribute("title", "Mute");
  }
}

function changeVolume(e) {
  const width = this.offsetWidth;
  const clickX = e.offsetX;
  let volumeLevel = clickX / width;

  if (volumeLevel < 0.1) {
    volumeLevel = 0;
  } else if (volumeLevel > 0.9) {
    volumeLevel = 1;
  }

  volumeBar.style.width = `${volumeLevel * 100}%`;
  video.volume = volumeLevel;
  updateVolumeIcon(volumeLevel);
  lastVolume = volumeLevel;
}

// Change Playback Speed -------------------- //
function changeSpeed() {
  video.playbackRate = speed.value;
}
// Fullscreen ------------------------------- //

// Utility function to request fullscreen on an element
function requestFullscreen(elem) {
  const request =
    elem.requestFullscreen ||
    elem.mozRequestFullScreen ||
    elem.webkitRequestFullscreen ||
    elem.msRequestFullscreen;
  if (request) {
    request.call(elem);
  }
}

// Utility function to exit fullscreen mode
function exitFullscreen() {
  const exit =
    document.exitFullscreen ||
    document.mozCancelFullScreen ||
    document.webkitExitFullscreen ||
    document.msExitFullscreen;
  if (exit) {
    exit.call(document);
  }
}

let fullscreen = false;

// Toggle fullscreen mode for the player and update the video class accordingly
function toggleFullscreen() {
  if (!fullscreen) {
    requestFullscreen(player);
    video.classList.add("video-fullscreen");
  } else {
    exitFullscreen();
    video.classList.remove("video-fullscreen");
  }
  fullscreen = !fullscreen;
}

// Event listeners
playBtn.addEventListener("click", toggleVideo);
video.addEventListener("ended", showPlayIcon);
video.addEventListener("canplay", updateProgressBar);
video.addEventListener("timeupdate", updateProgressBar);
progressRange.addEventListener("click", setProgressBar);
volumeRange.addEventListener("click", changeVolume);
volumeIcon.addEventListener("click", toogleMute);
speed.addEventListener("change", changeSpeed);
fullscreenBtn.addEventListener("click", toggleFullscreen);
