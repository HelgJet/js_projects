const music = document.querySelector("audio");
const prevBtn = document.getElementById("prev");
const playBtn = document.getElementById("play");
const nextBtn = document.getElementById("next");
const image = document.querySelector("img");
const title = document.getElementById("title");
const artist = document.getElementById("artist");
const progressContainer = document.getElementById("progress-container");
const progress = document.getElementById("progress");
const currentTimeEl = document.getElementById("current-time");
const durationEl = document.getElementById("duration");

// Music
const songs = [
  {
    name: "jacinto-1",
    displayName: "Electric Chill Machine",
    artist: "Jasinto Design",
  },
  {
    name: "jacinto-2",
    displayName: "Seven Nation Army (Remix)",
    artist: "Jasinto Design",
  },
  {
    name: "jacinto-3",
    displayName: "Cool Music (Remix)",
    artist: "Jasinto Design",
  },
  {
    name: "metric-1",
    displayName: "Front Row (Remix)",
    artist: "Jasinto Design",
  },
];

// Check if Playing
let isPlaying = false;
// Current song
let songIndex = 0;

// Play music
const playMusic = () => {
  isPlaying = true;
  playBtn.classList.replace("fa-play-circle", "fa-pause-circle");
  playBtn.setAttribute("title", "Pause");
  music.play();
};

// Pause music
const pauseMusic = () => {
  isPlaying = false;
  playBtn.classList.replace("fa-pause-circle", "fa-play-circle");
  playBtn.setAttribute("title", "Play");
  music.pause();
};

// Toggle Music
const toggleMusic = () => {
  isPlaying ? pauseMusic() : playMusic();
};

// Update DOM
const loadMusic = (song) => {
  title.textContent = song.displayName;
  artist.textContent = song.artist;
  music.src = `music/${song.name}.mp3`;
  image.src = `img/${song.name}.jpg`;
};

// Change song by direction
const changeSong = (direction) => {
  songIndex = (songIndex + direction + songs.length) % songs.length;
  loadMusic(songs[songIndex]);
  playMusic();
};

//Next Song
const nextSong = () => changeSong(1);

//Prev Song
const prevSong = () => changeSong(-1);

// Update Progress Bar & Time
function updateProgressBar(e) {
  if (isPlaying) {
    const { duration, currentTime } = e.srcElement;
    // Upd progress bar width
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;

    // Format time helper function
    const formatTime = (time) => {
      const minutes = Math.floor(time / 60);
      const seconds = String(Math.floor(time % 60)).padStart(2, "0");
      return `${minutes}:${seconds}`;
    };

    // Update duration display
    if (duration) {
      durationEl.textContent = formatTime(duration);
    }

    // Update current time display
    currentTimeEl.textContent = formatTime(currentTime);
  }
}

// Set progress bar
function setProgressBar(e) {
  const width = this.clientWidth;
  const clickX = e.offsetX;
  const { duration } = music;
  music.currentTime = (clickX / width) * duration;
}

// Event Listeners
playBtn.addEventListener("click", toggleMusic);
prevBtn.addEventListener("click", prevSong);
nextBtn.addEventListener("click", nextSong);
music.addEventListener("timeupdate", updateProgressBar);
progressContainer.addEventListener("click", setProgressBar);
music.addEventListener("ended", nextSong);

// On load - select first song
loadMusic(songs[songIndex]);
