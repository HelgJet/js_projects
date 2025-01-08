const quoteContainer = document.getElementById("quote-container");
const quoteText = document.getElementById("quote");
const authorText = document.getElementById("author");
const twitterBtn = document.getElementById("twitter");
const newQuoteBtn = document.getElementById("new-quote");
const loader = document.getElementById("loader");

function showLoadingSpinner() {
  loader.hidden = false;
  quoteContainer.hidden = true;
}

function removeLoadingSpinner() {
  if (!loader.hidden) {
    quoteContainer.hidden = false;
    loader.hidden = true;
  }
}

// Get Quote from API
async function getQuote() {
  showLoadingSpinner();
  const apiUrl = "https://dummyjson.com/quotes/random";
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    // If autor is blank
    if (data.author === " ") {
      authorText.innerText = "Unknow";
    } else {
      authorText.innerText = data.author;
    }

    // Reduce font-size for long quotes.
    const dataQuote = data.quote;

    // Alternative
    // quoteTextLength = dataQuote.split(" ").length;
    // if (quoteTextLength > 5) {
    //   document.querySelector(".quote-text").style.fontSize = "2rem";
    // }

    if (dataQuote.length > 100) {
      quoteText.classList.add("long-quote");
    } else {
      quoteText.classList.remove("long-quote");
    }

    quoteText.innerText = dataQuote;

    removeLoadingSpinner();
  } catch (error) {
    getQuote();
  }
}

function tweetQuote() {
  const quote = quoteText.innerText;
  const author = authorText.innerText;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${quote} - ${author}`;
  window.open(twitterUrl, "_blank");
}

// Event listeners
newQuoteBtn.addEventListener("click", getQuote);
twitterBtn.addEventListener("click", tweetQuote);

// on load
getQuote();
