// Constants
const imageContainer = document.getElementById("image-container");
const loader = document.getElementById("loader");
const API_KEY = "7qYbYhFJZRAqpeDqz9vmnJCbJANIdmOrup74_y_xbBM";
const SPACER_HEIGHT = 100;

let ready = false;
let imagesLoaded = 0;
let totalImages = 0;
let photosArray = [];
let initialLoad = true;

// Dynamic API URL
let imageCount = 5;
const updateApiUrl = () => {
  return `https://api.unsplash.com/photos/random?client_id=${API_KEY}&count=${imageCount}&orientation=landscape`;
};
let apiUrl = updateApiUrl();

// Helper function
function setAttributes(element, attributes) {
  Object.entries(attributes).forEach(([key, value]) =>
    element.setAttribute(key, value)
  );
}

// Loading
function showLoading() {
  loader.hidden = false;
  imageContainer.hidden = true;
}

function removeLoading() {
  if (!loader.hidden) {
    loader.hidden = true;
    imageContainer.hidden = false;
  }
}

// // Add Spacer Elements
function addSpacers() {
  if (!document.querySelector(".spacer")) {
    if (!document.querySelector(".spacer")) {
      const topSpacer = document.createElement("div");
      const bottomSpacer = document.createElement("div");
      topSpacer.style.height = `${SPACER_HEIGHT / 2}px`;
      bottomSpacer.style.height = `${SPACER_HEIGHT / 2}px`;
      topSpacer.classList.add("spacer");
      bottomSpacer.classList.add("spacer");
      imageContainer.prepend(topSpacer);
      imageContainer.append(bottomSpacer);
    }
  }
}

// Check if all images were loaded
function imageLoaded() {
  imagesLoaded++;
  if (imagesLoaded === totalImages) {
    ready = true;
    if (initialLoad) {
      initialLoad = false;
      imageCount = 20; // Increase count after initial load
      apiUrl = updateApiUrl();
    }
  }
}

// Create Elements for links, photos, add to DOM
function displayPhotos() {
  imagesLoaded = 0; // Reset for the new batch
  totalImages = photosArray.length;
  photosArray.forEach((photo) => {
    // create <a> to link
    const item = document.createElement("a");
    setAttributes(item, {
      href: photo.links.html,
      target: "_blank",
    });

    // create image for photo
    const img = document.createElement("img");

    setAttributes(img, {
      src: photo.urls.regular,
      alt: photo.alt_description,
      title: photo.alt_description,
    });

    // Event Listener, check when each is finished loading
    img.addEventListener("load", imageLoaded);

    // Put <img> inside <a>, and both put inside imageContainer
    item.appendChild(img);
    imageContainer.appendChild(item);
  });
  // Add spacers to prevent jumpy scrolling
  addSpacers();
}

// Unsplash API
async function getImages() {
  showLoading();
  try {
    const res = await fetch(API_URL);
    photosArray = await res.json();
    displayPhotos();
  } catch (error) {
    console.error("Error fetching photos:", error);
  } finally {
    removeLoading();
  }
}

// Check to see if scrolling near bottom of page, Load More Photos
window.addEventListener("scroll", () => {
  if (
    window.innerHeight + window.scrollY >=
      document.body.offsetHeight - SPACER_HEIGHT - 1000 &&
    ready
  ) {
    ready = false;
    getImages();
  }
});

// On load
getImages();
