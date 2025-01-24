// Selectors
const button = document.getElementById("button");
const audioElement = document.getElementById("audio");

// VoiceRSS API configuration
const voiceConfig = {
  key: "5d5452802b7144f7bd340a041b5c6e93",
  hl: "en-us",
  v: "Linda",
  r: 0,
  c: "mp3",
  f: "44khz_16bit_stereo",
  ssml: false,
};

// Disable/Enable button
const toggleButton = () => {
  button.disabled = !button.disabled;
};

// Text-to-Speech function
const tellMe = (joke) => {
  const formattedJoke = encodeURIComponent(joke.trim());
  VoiceRSS.speech({
    ...voiceConfig,
    src: formattedJoke,
  });
};

// Fetch a joke from the API
const getJokes = async () => {
  const apiUrl =
    "https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,political,racist";

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const { setup, delivery, joke } = await response.json();
    const jokeText = setup ? `${setup} ... ${delivery}` : joke;

    // Speak the joke
    tellMe(jokeText);

    // Disable button while joke is playing
    toggleButton();
  } catch (error) {
    console.error("Failed to fetch a joke:", error);
  }
};

// Event listeners
button.addEventListener("click", getJokes);
audioElement.addEventListener("ended", toggleButton);
