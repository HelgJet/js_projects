const imageContainer = document.getElementById("image-container");
const loader = document.getElementById("loader");
const sentinel = document.getElementById("sentinel");

let ready = false;
let imagesLoaded = 0;
let totalImages = 0;
let photosArray = [];
let imageCount = 5;
let initialLoad = true;

// Unsplash API Configuration
const API_KEY = "7qYbYhFJZRAqpeDqz9vmnJCbJANIdmOrup74_y_xbBM";

// Dynamic API URL
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

// Check if all images were loaded
function imageLoaded() {
  imagesLoaded++;
  if (imagesLoaded === totalImages) {
    ready = true;
    initialLoad = false;
    imageCount = 20; // Increase count after initial load
    apiUrl = updateApiUrl();
    observer.observe(sentinel); // Reattach observer after images are ready
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
}

// Unsplash API
async function getImages() {
  showLoading();
  try {
    const res = await fetch(apiUrl);
    photosArray = await res.json();
    displayPhotos();
  } catch (error) {
    console.error("Error fetching photos:", error);
  } finally {
    removeLoading();
  }
}

// Check to see if scrolling near bottom of page, Load More Photos
// Intersection Observer Callback
const observerCallback = (entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting && ready) {
      ready = false; // Prevent multiple triggers
      observer.unobserve(sentinel); // Unobserve until new images load
      getImages();
    }
  });
};

// Intersection Observer Options
const observerOptions = {
  root: null,
  threshold: 1.0,
  rootMargin: "0px 0px 300px 0px",
};

const observer = new IntersectionObserver(observerCallback, observerOptions);

// Start observing the sentinel
observer.observe(sentinel);

// On load
getImages();
