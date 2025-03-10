const form = document.getElementById("form");
const password1El = document.getElementById("password1");
const password2El = document.getElementById("password2");
const messageContainer = document.querySelector(".message-container");
const message = document.getElementById("message");

let isValid = false;
let passwordMatch = false;

// Helper function to update the message and border colors
function validateColorTextHelper(color, text = "", isPassword = false) {
  message.style.color = color;
  messageContainer.style.borderColor = color;
  message.textContent = text;
  if (isPassword) {
    password1El.style.borderColor = color;
    password2El.style.borderColor = color;
  }
}

function validateForm() {
  // Using Constraint API to validate form fields
  isValid = form.checkValidity();
  if (!isValid) {
    validateColorTextHelper("red", "Please fill out all fields.");
    return false;
  }

  // Check if passwords match
  if (password1El.value !== password2El.value) {
    passwordMatch = false;
    validateColorTextHelper("red", "Make sure passwords match", true);
    return false;
  } else {
    passwordMatch = true;
  }

  if (isValid && passwordMatch) {
    // If form is valid and passwords match, display success message
    validateColorTextHelper(
      "green",
      "Registration Form Success Submitted",
      true
    );
    return true;
  }
}

function storeFormData() {
  const user = {
    name: form.name.value,
    phone: form.phone.value,
    email: form.email.value,
    website: form.website.value,
    password: form.password.value,
  };
  // Do something with data
  console.log(user);
}

function processFormData(e) {
  e.preventDefault();
  // Validation Form
  validateForm();
  // Submit Data if Valid
  if (isValid && passwordMatch) {
    storeFormData();
  }
}

// Event Listener
form.addEventListener("submit", processFormData);
