const itemForm = document.getElementById("item-form");
const itemList = document.getElementById("item-list");
const itemInput = document.getElementById("item-input");
const itemFilter = document.getElementById("filter");
const clearBtn = document.getElementById("clear");
const formBtn = itemForm.querySelector("button");
let isEditMode = false;

function displayItems() {
    let itemFromStorage = getItemsFromStorage();
    itemFromStorage.forEach(item => addItemToDOM(item));

    checkUI();
}

function onAddItemSubmit(e) {
    e.preventDefault();

    const newItem = itemInput.value;
    // Validate Input
    if(newItem === "") {
        alert("Plese add an item");
        return;
    }

    // Check for edit mode
    if(isEditMode) {
        const itemToEdit = itemList.querySelector(".edit-mode");

        removeItemFromStorage(itemToEdit.textContent);
        itemToEdit.classList.remove("edit-mode");
        itemToEdit.remove();
        isEditMode = false;
    } else {
        if(checkIfItemExists(newItem)) {
            alert("That item already exists!");
            return;
        } 
    }
    // Create item DOM element
    addItemToDOM(newItem);

    // Add item to local storage
    addItemToStorage(newItem);

    checkUI();

    itemInput.value = "";
}

function addItemToDOM(item) {
    // add Item to DOM
    const li = document.createElement("li");
    li.appendChild(document.createTextNode(item));

    const button = createButton("remove-item btn-link text-red");
    
    li.appendChild(button);

    itemList.appendChild(li);
}

function createButton(classes) {
    const button = document.createElement("button");
    button.classList = classes;
    const icon = createIcon("fa-solid fa-xmark");
    button.appendChild(icon);
    return button;
}

function createIcon(classes) {
    const icon = document.createElement("i");
    icon.classList = classes;
    return icon;
}

function addItemToStorage(items) {
    let itemsFromStorage = getItemsFromStorage();

    // Add new item to array
    itemsFromStorage.push(items);

    // Convert to JSON string and set to local storage 
    localStorage.setItem("items", JSON.stringify(itemsFromStorage));
}

function getItemsFromStorage() {
    let itemsFromStorage;

    if(localStorage.getItem("items") === null) {
        itemsFromStorage = [];
    } else {
        itemsFromStorage = JSON.parse(localStorage.getItem("items"));
    }

    return itemsFromStorage;
}

function filterItems(e) {
    const text = e.target.value.toLowerCase();
    const items = itemList.querySelectorAll("li");

    items.forEach(item => {
        const itemName = item.firstChild.textContent.toLowerCase();

        if(itemName.indexOf(text) != -1) {
            item.style.display = "flex";
        } else {
            item.style.display = "none";
        }
    })
}



function checkUI() {
    const items = itemList.querySelectorAll("li");

    if(items.length === 0) {
        itemFilter.style.display = "none";
        clearBtn.style.display = "none";
    } else {
        itemFilter.style.display = "block";
        clearBtn.style.display = "block";
    }

    formBtn.innerHTML = "<i class='fa-solid fa-plus'>Add Item</i>";
    formBtn.style.backgroundColor = "#333";

    isEditMode = false;
}

function onClickItem(e) {
    if(e.target.parentElement.classList.contains("remove-item")) {
        removeItem(e.target.parentElement.parentElement);
    } else {
        setItemToEdit(e.target);
    }
}

function checkIfItemExists(item) {
    const itemsFromStorage = getItemsFromStorage();
    return itemsFromStorage.includes(item);
}

function setItemToEdit(item) {
    isEditMode = true;

    itemList.querySelectorAll("li").forEach(i => i.classList.remove("edit-mode"));
    item.classList.add("edit-mode");
    formBtn.innerHTML = "<i class='fa-solid fa-pen'> Update Item</i>";
    formBtn.style.backgroundColor = "#228b22";
    itemInput.value = item.textContent;
}

function removeItem(item) {
    if(confirm("Are you sure?")) {
        // Remove Item from DOM
        item.remove();

        // Remove Item from local storage
        removeItemFromStorage(item.textContent);

        checkUI();
    }
}

function removeItemFromStorage(item) {
    let itemFromStorage = getItemsFromStorage();

    // Filter out items to be removed
    itemFromStorage = itemFromStorage.filter((i) => i !== item);

    localStorage.setItem("items", JSON.stringify(itemFromStorage));
}

function clearItems() {
    while(itemList.firstChild) {
        itemList.removeChild(itemList.firstChild);
    }

    // Clear from localstorage
    localStorage.removeItem("items");

    checkUI();
}

// Initiliase app
function innit() {
    // Event Listeners
    itemForm.addEventListener("submit", onAddItemSubmit);
    itemList.addEventListener("click", onClickItem);
    clearBtn.addEventListener("click", clearItems);
    itemFilter.addEventListener("input", filterItems);
    document.addEventListener("DOMContentLoaded", displayItems);

    checkUI();
}

innit();

