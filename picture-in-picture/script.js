const videoElement = document.getElementById("video");
const pipButton = document.getElementById("pipButton");

// prompt to sleect media stream, pass to video element, then play

async function selectMediaStream() {
  try {
    const mediaStream = await navigator.mediaDevices.getDisplayMedia();
    videoElement.srcObject = mediaStream;
    videoElement.onloadedmetadata = () => {
      videoElement.play();
    };
  } catch (error) {
    console.log("whoops, Error selecting media stream::", error);
  }
}

// Handles the Picture-in-Picture functionality when the button is clicked.
async function handlePictureInPicture() {
  pipButton.disabled = true;
  try {
    await videoElement.requestPictureInPicture();
  } catch (error) {
    console.error("Error starting Picture-in-Picture:", error);
  } finally {
    pipButton.disabled = false;
  }
}

// Add event listener to the button
pipButton.addEventListener("click", handlePictureInPicture);

// On load
selectMediaStream();
