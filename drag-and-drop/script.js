// DOM Elements
const addBtns = document.querySelectorAll(".add-btn:not(.solid)");
const saveItemBtns = document.querySelectorAll(".solid");
const addItemContainers = document.querySelectorAll(".add-container");
const addItems = document.querySelectorAll(".add-item");
const listColumns = document.querySelectorAll(".drag-item-list");

// Items
let updatedOnload = false;
let draggedItem;
let dragging = false;
let currentColumn;

const listElements = {
  backlog: document.getElementById("backlog-list"),
  progress: document.getElementById("progress-list"),
  complete: document.getElementById("complete-list"),
  onHold: document.getElementById("on-hold-list"),
};

// Default Data of Lists
const defaultLists = {
  backlog: ["Release the course", "Sit back and relax"],
  progress: ["Work on projects", "Listen to music"],
  complete: ["Being cool", "Getting stuff done"],
  onHold: ["Being uncool"],
};

// Initialize Arrays
const listArrays = {
  backlog: [],
  progress: [],
  complete: [],
  onHold: [],
};

// Drag Functionality

// Get Arrays from localStorage if available, set default values if not
function getSavedColumns() {
  Object.keys(listArrays).forEach((key) => {
    const storageKey = `${key}Items`;
    const storedData = localStorage.getItem(storageKey);
    listArrays[key] = storedData ? JSON.parse(storedData) : defaultLists[key];
  });
}

// Set localStorage Arrays
function updateSavedColumns() {
  Object.keys(listArrays).forEach((key) => {
    const filteredArray = filterArray(listArrays[key]);
    const storageKey = `${key}Items`;
    localStorage.setItem(storageKey, JSON.stringify(filteredArray));
  });
}

// Filter Arrays to remove empty items
function filterArray(array) {
  return array.filter((item) => item !== null && item !== "");
}

// Create DOM Elements for each list item
function createItemEl(columnEl, column, item, index) {
  const listEl = document.createElement("li");
  listEl.classList.add("drag-item");
  listEl.textContent = item;
  listEl.draggable = true;
  listEl.contentEditable = true;
  listEl.id = `${index}-${column}`;
  listEl.addEventListener("dragstart", dragStart);
  listEl.addEventListener("focusout", () =>
    updateItem(listEl.id, index, column)
  );
  columnEl.appendChild(listEl);
}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {
  if (!updatedOnload) {
    getSavedColumns();
    updatedOnload = true;
  }

  Object.keys(listElements).forEach((key) => {
    const columnEl = listElements[key];
    columnEl.textContent = "";

    const filteredArray = filterArray(listArrays[key]);
    filteredArray.forEach((item, index) => {
      createItemEl(columnEl, key, item, index);
    });
  });

  updateSavedColumns();
}

// Update Item - Delete if necessary, or update Array value
function updateItem(id, index, column) {
  if (!dragging) {
    const updatedText = document.getElementById(id)?.textContent.trim();

    if (!updatedText) {
      listArrays[column].splice(index, 1); // Remove empty items
    } else {
      listArrays[column][index] = updatedText; // Update item text
    }

    updateDOM();
  }
}

// Rebuild listArrays based on the current DOM state
function rebuildListArrays() {
  Object.keys(listElements).forEach((key) => {
    const columnEl = listElements[key];
    listArrays[key] = Array.from(columnEl.children).map(
      (item) => item.textContent
    );
  });
  updateSavedColumns();
}

// Drag and Drop Logic

// When item starts Dragging
const dragStart = (e) => {
  draggedItem = e.target;
  draggedItem.classList.add("dragging");
  dragging = true;
};

// Column Allows for Item to Drop
function allowDrop(e) {
  e.preventDefault();
}

// Dropping Item in Column
function drop(e) {
  e.preventDefault();
  listColumns.forEach((column) => dragLeave(column));

  const parent = listColumns[currentColumn];
  const afterElement = getDragAfterElement(parent, e.clientY);

  if (afterElement) {
    parent.insertBefore(draggedItem, afterElement);
  } else {
    parent.appendChild(draggedItem);
  }

  dragging = false;
  draggedItem.classList.remove("dragging");
  rebuildListArrays();
}

// Get position to drop element
function getDragAfterElement(container, y) {
  const draggableElements = [
    ...container.querySelectorAll(".drag-item:not(.dragging)"),
  ];

  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;

      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element;
}

// When Item in Column Area
function dragEnter(index) {
  listColumns[index].classList.add("over");
  currentColumn = index;
}

// When Item Leaves Column Area
function dragLeave(column) {
  column.classList.remove("over");
}

// Add new text to new item
function addToColumn(columnIndex) {
  const itemText = addItems[columnIndex].textContent.trim();
  const selectedArray = Object.keys(listArrays)[columnIndex];

  if (itemText) {
    listArrays[selectedArray].push(itemText);
    addItems[columnIndex].textContent = "";
    updateDOM();
  }
}

// Hide / Show Item Input box
function toggleInputBox(columnIndex, show) {
  addBtns[columnIndex].style.visibility = show ? "hidden" : "visible";
  saveItemBtns[columnIndex].style.display = show ? "flex" : "none";
  addItemContainers[columnIndex].style.display = show ? "flex" : "none";
  if (!show) addToColumn(columnIndex);
}

// Event listeners
listColumns.forEach((column, index) => {
  column.addEventListener("dragover", allowDrop);
  column.addEventListener("drop", drop);
  column.addEventListener("dragenter", () => dragEnter(index));
  column.addEventListener("dragleave", () => column.classList.remove("over"));
});

addBtns.forEach((btn, index) =>
  btn.addEventListener("click", () => toggleInputBox(index, true))
);

saveItemBtns.forEach((btn, index) =>
  btn.addEventListener("click", () => toggleInputBox(index, false))
);

// On load
updateDOM();
