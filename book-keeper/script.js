const modal = document.getElementById("modal");
const modalShow = document.getElementById("show-modal");
const modalClose = document.getElementById("close-modal");
const bookmarkForm = document.getElementById("bookmark-form");
const websiteNameEl = document.getElementById("website-name");
// const websiteUrlEl = document.getElementById("website-url");
const bookmarksContainer = document.getElementById("bookmarks-container");

let bookmarks = [];

// Show modal, focus on Input
function showModal() {
  modal.classList.add("show-modal");
  websiteNameEl.focus();
}

// Modal Event listeners
modalShow.addEventListener("click", showModal);
modalClose.addEventListener("click", () =>
  modal.classList.remove("show-modal")
);
window.addEventListener("click", (e) =>
  e.target === modal ? modal.classList.remove("show-modal") : false
);

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
  bookmarks.forEach((bookmark) => {
    const { name, url } = bookmark;
    // item
    const item = document.createElement("div");
    item.classList.add("item");
    // Close item
    const closeIcon = document.createElement("i");
    closeIcon.classList.add("fas", "fa-times");
    closeIcon.setAttribute("title", "Delete Bookmark");
    closeIcon.setAttribute("onclick", `deleteBookmark('${url}')`);
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
  if (localStorage.getItem("bookmarks")) {
    bookmarks = JSON.parse(localStorage.getItem("bookmarks"));
  } else {
    // Create bookmarks arra in localStorage
    bookmarks = [
      {
        name: "Oleh Kozub",
        url: "https://github.com/HelgJet",
      },
    ];
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
  bookmarks.push(bookmark);
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  fetchBookmarks();
  bookmarkForm.reset();
  websiteNameEl.focus();
}

// Delete Bookmark
function deleteBookmark(url) {
  //   bookmarks.forEach((bookmark, i) => {
  //     if (bookmark.url === url) {
  //       bookmarks.splice(i, 1);
  //     }
  //   });
  // Filter out the bookmark with the specified URL
  bookmarks = bookmarks.filter((bookmark) => bookmark.url !== url);
  // Update bookmarks array in localStorage, re-populate DOM
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  fetchBookmarks();
}

// Event Listeners
bookmarkForm.addEventListener("submit", storeBookmark);

// On load, Fetch Bookmarks
fetchBookmarks();
