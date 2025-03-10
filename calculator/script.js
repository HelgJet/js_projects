const elements = {
  calculator: document.querySelector(".calculator"),
  calculatorDisplay: document.querySelector("h1"),
  inputBtns: document.querySelectorAll("button"),
  clearBtn: document.getElementById("clear-btn"),
};

let firstValue = null;
let operatorValue = "";
let displayOperator = "";
let awaitingNextValue = false;

// Calculate first and second values depending on operator
const calculate = {
  "/": (firstNumber, secondNumber) =>
    secondNumber === 0 ? "Error" : firstNumber / secondNumber,
  "*": (firstNumber, secondNumber) => firstNumber * secondNumber,
  "-": (firstNumber, secondNumber) => firstNumber - secondNumber,
  "+": (firstNumber, secondNumber) => firstNumber + secondNumber,
};

function sendNumberValue(number) {
  const { calculatorDisplay } = elements;

  if (awaitingNextValue) {
    calculatorDisplay.textContent += number;
    awaitingNextValue = false;
  } else {
    calculatorDisplay.textContent =
      calculatorDisplay.textContent === "0"
        ? number
        : calculatorDisplay.textContent + number;
  }
}

function sendOperatorValue(operator) {
  const { calculatorDisplay } = elements;
  const currentValue = Number(calculatorDisplay.textContent);

  if (operator === "*") {
    displayOperator = "x";
  } else if (operator === "/") {
    displayOperator = "÷";
  } else {
    displayOperator = operator;
  }

  if (operatorValue && awaitingNextValue) {
    operatorValue = operator;
    calculatorDisplay.textContent = `${firstValue} ${displayOperator}`;
    return;
  }

  if (firstValue === null) {
    firstValue = currentValue;
  } else if (operatorValue) {
    const secondValue = parseFloat(
      calculatorDisplay.textContent.split(operatorValue)[1]
    ); // get second value
    if (!isNaN(secondValue)) {
      firstValue = calculate[operatorValue](firstValue, secondValue);
      calculatorDisplay.textContent = `${firstValue} ${displayOperator}`;
    }
  }

  awaitingNextValue = true;
  calculatorDisplay.textContent += ` ${displayOperator} `;
  operatorValue = operator;
}

// Computed result by click "="
function calculateResult() {
  if (!firstValue || !operatorValue) return;

  const expressionParts = elements.calculatorDisplay.textContent.split(" ");
  const secondValue = parseFloat(expressionParts[2]);

  if (isNaN(secondValue)) return;

  const result = calculate[operatorValue](firstValue, secondValue);
  elements.calculatorDisplay.textContent = `${firstValue} ${displayOperator} ${secondValue} = ${result}`;

  firstValue = result;
  operatorValue = "";
  awaitingNextValue = true;
}

function addDecimal() {
  const { calculatorDisplay } = elements;

  const expressionParts = calculatorDisplay.textContent.split(" ");
  const lastNumber = expressionParts[expressionParts.length - 1];

  if (lastNumber.includes(".")) return;
  calculatorDisplay.textContent += ".";
}

function handleButtonNumberClick(e) {
  const value = e.target.value;
  sendNumberValue(value);
}

function handleButtonOperatorClick(e) {
  const value = e.target.value;
  sendOperatorValue(value);
}

function handleButtonDecimalClick() {
  // Decimal
  addDecimal();
}

// Add Event listeners for numbers, operators, decimals buttons
elements.inputBtns.forEach((inputBtn) => {
  if (!inputBtn.classList.length) {
    inputBtn.addEventListener("click", handleButtonNumberClick);
  } else if (
    inputBtn.classList.contains("operator") &&
    !inputBtn.classList.contains("equal-sign")
  ) {
    inputBtn.addEventListener("click", handleButtonOperatorClick);
  } else if (inputBtn.classList.contains("equal-sign")) {
    inputBtn.addEventListener("click", calculateResult);
  } else if (inputBtn.classList.contains("decimal")) {
    inputBtn.addEventListener("click", handleButtonDecimalClick);
  }
});

function resetAll() {
  firstValue = null;
  secondValue = null;
  operatorValue = "";
  awaitingNextValue = false;
  elements.calculatorDisplay.textContent = "0";
}

elements.clearBtn.addEventListener("click", resetAll);
