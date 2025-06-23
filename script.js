"use strict";


const authContainer = document.getElementById("auth-container");
const appContainer = document.getElementById("app-container");
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const showRegister = document.getElementById("show-register");
const showLogin = document.getElementById("show-login");
const loginBtn = document.getElementById("login-btn");
const registerBtn = document.getElementById("register-btn");
const logoutBtn = document.getElementById("logout-btn");
const usernameDisplay = document.getElementById("username-display");
const btnAdd = document.querySelector(".btn_add");
const notesContainer = document.getElementById("notes-container");


showRegister.addEventListener("click", (e) => {
    e.preventDefault();
    loginForm.classList.add("hidden");
    registerForm.classList.remove("hidden");
});

showLogin.addEventListener("click", (e) => {
    e.preventDefault();
    registerForm.classList.add("hidden");
    loginForm.classList.remove("hidden");
});

loginBtn.addEventListener("click", handleLogin);
registerBtn.addEventListener("click", handleRegister);
logoutBtn.addEventListener("click", handleLogout);
btnAdd.addEventListener("click", () => addNote());


function handleRegister() {
    const username = document.getElementById("register-username").value;
    const password = document.getElementById("register-password").value;
    
    if (!username || !password) {
        alert("Please enter both username and password");
        return;
    }
    
    const users = JSON.parse(localStorage.getItem("users")) || {};
    
    if (users[username]) {
        alert("Username already exists");
        return;
    }
    
    users[username] = { password };
    localStorage.setItem("users", JSON.stringify(users));
    
    alert("Registration successful! Please login.");
    registerForm.classList.add("hidden");
    loginForm.classList.remove("hidden");
    document.getElementById("register-username").value = "";
    document.getElementById("register-password").value = "";
}

function handleLogin() {
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;
    
    if (!username || !password) {
        alert("Please enter both username and password");
        return;
    }
    
    const users = JSON.parse(localStorage.getItem("users")) || {};
    
    if (!users[username] || users[username].password !== password) {
        alert("Invalid username or password");
        return;
    }
    
    
    authContainer.classList.add("hidden");
    appContainer.classList.remove("hidden");
    usernameDisplay.textContent = username;
    

    const userNotes = JSON.parse(localStorage.getItem(`notes_${username}`)) || [];
    userNotes.forEach((noteTxt) => addNote(noteTxt));
    
    document.getElementById("login-username").value = "";
    document.getElementById("login-password").value = "";
}

function handleLogout() {
    authContainer.classList.remove("hidden");
    appContainer.classList.add("hidden");
    notesContainer.innerHTML = "";
}


function addNote(text = "") {
    const note = document.createElement("div");
    note.classList.add("note-wrapper");
    note.innerHTML = `
        <div class="operations">
            <button class="edit fas fa-edit"></button>
            <button class="delete fas fa-trash-alt"></button>
        </div>
        <div class="main ${text ? "" : "hidden"}"></div>
        <textarea class="${text ? "hidden" : ""}"></textarea>
    `;
    
    const editBtn = note.querySelector(".edit");
    const deleteBtn = note.querySelector(".delete");
    const mainEl = note.querySelector(".main");
    const textAreaEl = note.querySelector("textarea");
    
    textAreaEl.value = text;
    mainEl.innerHTML = text;
    
    deleteBtn.addEventListener("click", () => {
        note.remove();
        updateNotes();
    });
    
    editBtn.addEventListener("click", () => {
        mainEl.classList.toggle("hidden");
        textAreaEl.classList.toggle("hidden");
    });
    
    textAreaEl.addEventListener("input", (e) => {
        const { value } = e.target;
        mainEl.innerHTML = value;
        updateNotes();
    });
    
    notesContainer.appendChild(note);
}

function updateNotes() {
    const username = usernameDisplay.textContent;
    if (!username) return;
    
    const noteTexts = Array.from(document.querySelectorAll("textarea")).map(textarea => textarea.value);
    localStorage.setItem(`notes_${username}`, JSON.stringify(noteTexts));
}


if (localStorage.getItem("currentUser")) {
    const username = localStorage.getItem("currentUser");
    authContainer.classList.add("hidden");
    appContainer.classList.remove("hidden");
    usernameDisplay.textContent = username;
    
    const userNotes = JSON.parse(localStorage.getItem(`notes_${username}`)) || [];
    userNotes.forEach((noteTxt) => addNote(noteTxt));
}