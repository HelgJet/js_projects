(() => {
  // DOM Elements
  const inputContainer = document.getElementById("input-container");
  const countdownForm = document.getElementById("countdownForm");
  const countdownTitleEl = document.getElementById("countdown-title");
  const dateEl = document.getElementById("data-picker");
  const countdownEl = document.getElementById("countdown");
  const resetCountdownBtn = document.getElementById("countdown-button");
  const timeElements = document.querySelectorAll("span");
  const completeEl = document.getElementById("complete");
  const completeElInfo = document.getElementById("complete-info");
  const resetCompleteBtn = document.getElementById("complete-button");

  // Time constants in milliseconds
  const MILLISECONDS = {
    second: 1000,
    minute: 60 * 1000,
    hour: 60 * 60 * 1000,
    day: 24 * 60 * 60 * 1000,
  };

  // State variables
  let countdownInterval;
  let targetTime = null; // Target time in milliseconds
  let targetTitle = "";

  // Set the minimum date for the date picker (today)
  const today = new Date().toISOString().split("T")[0];
  dateEl.min = today;

  // Function to update the countdown display in the DOM
  function updateCountdownDisplay() {
    const now = Date.now();
    const distance = targetTime - now;

    // If the countdown has ended, show the completion message
    if (distance < 0) {
      clearInterval(countdownInterval);
      countdownEl.hidden = true;
      completeElInfo.textContent = `${targetTitle} finished on ${new Date(
        targetTime
      ).toLocaleDateString()}`;
      completeEl.hidden = false;
      return;
    }

    // Calculate days, hours, minutes, and seconds remaining
    const days = Math.floor(distance / MILLISECONDS.day);
    const hours = Math.floor((distance % MILLISECONDS.day) / MILLISECONDS.hour);
    const minutes = Math.floor(
      (distance % MILLISECONDS.hour) / MILLISECONDS.minute
    );
    const seconds = Math.floor(
      (distance % MILLISECONDS.minute) / MILLISECONDS.second
    );

    // Update the countdown display
    countdownTitleEl.textContent = targetTitle;
    timeElements[0].textContent = days;
    timeElements[1].textContent = hours.toString().padStart(2, "0");
    timeElements[2].textContent = minutes.toString().padStart(2, "0");
    timeElements[3].textContent = seconds.toString().padStart(2, "0");

    // Toggle display elements
    completeEl.hidden = true;
    countdownEl.hidden = false;
  }

  // Function to start the countdown
  function startCountdown() {
    inputContainer.hidden = true;
    // Update the countdown immediately, then every second
    updateCountdownDisplay();
    countdownInterval = setInterval(
      updateCountdownDisplay,
      MILLISECONDS.second
    );
  }

  // Handler for the form submission event
  function onCountdownFormSubmit(event) {
    event.preventDefault();

    // Access the inputs by their IDs using querySelector since no name attributes are set
    const titleInput = event.target.querySelector("#title");
    const dateInput = event.target.querySelector("#data-picker");

    if (!titleInput || !dateInput) {
      console.error("Could not find title or date input elements.");
      return;
    }

    targetTitle = titleInput.value;
    const dateValue = dateInput.value;

    if (!dateValue) {
      alert("Please select a date for the countdown.");
      return;
    }

    targetTime = new Date(dateValue).getTime();

    // Save countdown data to localStorage
    const countdownData = { title: targetTitle, date: dateValue };
    localStorage.setItem("countdown", JSON.stringify(countdownData));

    startCountdown();
  }

  // Function to reset the countdown
  function resetCountdown() {
    clearInterval(countdownInterval);
    countdownEl.hidden = true;
    completeEl.hidden = true;
    inputContainer.hidden = false;

    // Clear state values
    targetTitle = "";
    targetTime = null;
    localStorage.removeItem("countdown");
  }

  // Restore countdown from localStorage if available
  function restoreCountdown() {
    const storedCountdown = localStorage.getItem("countdown");
    if (storedCountdown) {
      const { title, date } = JSON.parse(storedCountdown);
      targetTitle = title;
      targetTime = new Date(date).getTime();
      startCountdown();
    }
  }

  // Set up event listeners
  countdownForm.addEventListener("submit", onCountdownFormSubmit);
  resetCountdownBtn.addEventListener("click", resetCountdown);
  resetCompleteBtn.addEventListener("click", resetCountdown);

  // On page load, restore any saved countdown
  restoreCountdown();
})();
