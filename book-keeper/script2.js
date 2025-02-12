const modal = document.getElementById("modal");
const modalShow = document.getElementById("show-modal");
const modalClose = document.getElementById("close-modal");
const bookmarkForm = document.getElementById("bookmark-form");
const websiteNameEl = document.getElementById("website-name");
// const websiteUrlEl = document.getElementById("website-url");
const bookmarksContainer = document.getElementById("bookmarks-container");

let bookmarks = {};

// Show modal, focus on Input
function showModal() {
  modal.classList.add("show-modal");
  websiteNameEl.focus();
}

// Hide modal
function hideModal() {
  modal.classList.remove("show-modal");
}

// Modal Event listeners
modalShow.addEventListener("click", showModal);
modalClose.addEventListener("click", hideModal);
window.addEventListener("click", (e) => {
  if (e.target === modal) {
    hideModal();
  }
});

// Validate Form
function validate(nameValue, urlValue) {
  const expression =
    /^((https?|ftp|smtp):\/\/)?(www\.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(\/[\w#]+)*(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+(&[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+)*)?$/g;
  const regex = new RegExp(expression);
  if (!nameValue || !urlValue) {
    alert("Please submit values for both fields.");
    return false;
  }
  if (!urlValue.match(regex)) {
    alert("Please provide a valid web address");
    return false;
  }
  // valid
  return true;
}

// Build Bookmarks DOM
function buildBookmarks() {
  // Remove all bookmarks elements
  bookmarksContainer.textContent = "";
  // Build items
  Object.keys(bookmarks).forEach((id) => {
    const { name, url } = bookmarks[id];
    // item
    const item = document.createElement("div");
    item.classList.add("item");
    // Close item
    const closeIcon = document.createElement("i");
    closeIcon.classList.add("fas", "fa-times");
    closeIcon.setAttribute("title", "Delete Bookmark");
    closeIcon.addEventListener("click", () => deleteBookmark(id));
    // Favicon / Link Container
    const linkInfo = document.createElement("div");
    linkInfo.classList.add("name");
    // Favicon
    const fav = document.createElement("img");
    fav.setAttribute(
      "src",
      `https://s2.googleusercontent.com/s2/favicons?domain=${url}`
    );
    fav.setAttribute("alt", "Favicon");
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.textContent = name;
    // Append to bookmarks container
    linkInfo.append(fav, link);
    item.append(closeIcon, linkInfo);
    bookmarksContainer.append(item);
  });
}

// Fetch Bookmarks
function fetchBookmarks() {
  if (localStorage.getItem("bookmarks") && Object.keys(bookmarks).length > 0) {
    bookmarks = JSON.parse(localStorage.getItem("bookmarks"));
  } else {
    // Create bookmarks object in localStorage
    const id = `https://github.com/HelgJet`;
    bookmarks[id] = {
      name: "Oleh Kozub",
      url: "https://github.com/HelgJet",
    };
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  }
  buildBookmarks();
}

// Handle data from form
function storeBookmark(e) {
  e.preventDefault();
  const nameValue = e.target.querySelector("#website-name").value;
  let urlValue = e.target.querySelector("#website-url").value;
  // HTTP validation
  if (!urlValue.includes("https://") && !urlValue.includes("http://")) {
    urlValue = `https://${urlValue}`;
  }

  if (!validate(nameValue, urlValue)) {
    return false;
  }

  const bookmark = {
    name: nameValue,
    url: urlValue,
  };
  bookmarks[urlValue] = bookmark;
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  fetchBookmarks();
  bookmarkForm.reset();
  websiteNameEl.focus();
}

// Delete Bookmark
function deleteBookmark(id) {
  // loop through the bookmarks array
  if (bookmarks[id]) {
    delete bookmarks[id];
  }
  // Update bookmarks array in localStorage, re-populate DOM
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  fetchBookmarks();
}

// Event Listeners
bookmarkForm.addEventListener("submit", storeBookmark);

// On load, Fetch Bookmarks
fetchBookmarks();
