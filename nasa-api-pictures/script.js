// NASA APi
const COUNT = 10;
const apiKey = "DEMO_KEY";
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${COUNT}`;
const resultsNav = document.getElementById("resultsNav");
const favoritesNav = document.getElementById("favoritesNav");
const imageContainer = document.querySelector(".images-container");
const saveConfirmed = document.querySelector(".save-confirmed");
const loader = document.querySelector(".loader");

let resultsArray = [];
let favorites = JSON.parse(localStorage.getItem("favorites")) || {};

function showContent(pageType) {
  window.scrollTo({ top: 0, behavior: "instant" });
  if (pageType === "results") {
    resultsNav.classList.remove("hidden");
    favoritesNav.classList.add("hidden");
  } else {
    resultsNav.classList.add("hidden");
    favoritesNav.classList.remove("hidden");
  }
  loader.classList.add("hidden");
}

function createDOMNodes(pageType) {
  const currentArray =
    pageType === "results" ? resultsArray : Object.values(favorites);
  imageContainer.textContent = "";
  currentArray.forEach((result) => {
    const card = createCard(result, pageType);
    imageContainer.appendChild(card);
  });
}

// Create dynamiс NODS element
const createElement = (tag, options = {}) => {
  const element = document.createElement(tag);

  // Add class
  if (options.classNames) {
    options.classNames.forEach((className) => element.classList.add(className));
  }

  // Add text
  if (options.textContent) {
    element.textContent = options.textContent;
  }

  // Add attributes
  if (options.attributes) {
    Object.entries(options.attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
  }

  // Add children elements
  if (options.children) {
    options.children.forEach((child) => element.appendChild(child));
  }

  return element;
};

const createImageLink = (result) => {
  return createElement("a", {
    attributes: {
      href: result.hdurl,
      title: "View full image",
      target: "_blank",
    },
    children: [
      createElement("img", {
        attributes: {
          src: result.url,
          alt: "NASA Picture of the day",
          loading: "lazy",
        },
        classNames: ["card-img-top"],
      }),
    ],
  });
};

const createCardBody = (result, pageType) => {
  return createElement("div", {
    classNames: ["card-body"],
    children: [
      createElement("h5", {
        classNames: ["card-title"],
        textContent: result.title,
      }),
      createElement("p", {
        classNames: ["clickable"],
        textContent:
          pageType === "results" ? "Add to Favorites" : "Remove Favorites",
        attributes: {
          onclick:
            pageType === "results"
              ? `saveFavorite('${result.url}')`
              : `removeFavorite('${result.url}')`,
        },
      }),
      createElement("p", {
        classNames: ["card-text"],
        textContent: result.explanation,
      }),
      createElement("small", {
        classNames: ["text-muted"],
        children: [
          createElement("strong", { textContent: result.date }),
          createElement("span", { textContent: result.copyright || "" }),
        ],
      }),
    ],
  });
};

const createCard = (result, pageType) => {
  return createElement("div", {
    classNames: ["card"],
    children: [createImageLink(result), createCardBody(result, pageType)],
  });
};

function updateDOM(pageType) {
  createDOMNodes(pageType);
  showContent(pageType);
}

// Add result to Favorites
// function saveFavorite(itemUrl) {
//   // Loop through Results Array to select Favorite

//   resultsArray.forEach((result) => {
//     if (result.url.includes(itemUrl) && !favorites[itemUrl]) {
//       favorites[itemUrl] = result;
//       saveConfirmed.hidden = false;
//       setTimeout(() => {
//         saveConfirmed.hidden = true;
//       }, 2000);
//       localStorage.setItem("favorites", JSON.stringify(favorites));
//     }
//   });
// }
const saveFavorite = (itemUrl) => {
  const result = resultsArray.find((result) => result.url.includes(itemUrl));
  if (result && !favorites[itemUrl]) {
    favorites[itemUrl] = result;
    localStorage.setItem("favorites", JSON.stringify(favorites));
    saveConfirmed.hidden = false;
    setTimeout(() => (saveConfirmed.hidden = true), 2000);
  }
};

const removeFavorite = (itemUrl) => {
  if (favorites[itemUrl]) {
    delete favorites[itemUrl];
    localStorage.setItem("favorites", JSON.stringify(favorites));
    saveConfirmed.hidden = false;
    saveConfirmed.textContent = "REMOVED";
    setTimeout(() => {
      saveConfirmed.hidden = true;
    }, 2000);
  }
  updateDOM("favorites");
};

// Get 10 mages from NASA API
async function getNasaPictures() {
  // Show loader
  loader.classList.remove("hidden");
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error("Network response was not ok");
    resultsArray = await response.json();
    updateDOM("results");
  } catch (error) {
    // Catch Error Here
    console.error("Error fetching NASA pictures:", error);
  }
}

// On load
getNasaPictures();
