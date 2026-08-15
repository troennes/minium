"use strict";

function changeThemeSelector(theme) {
    if (theme === "dark") {
        document.querySelector("html").setAttribute("data-theme", "dark")
        localStorage.setItem("themePreference", "dark")
    } else if (theme === "light") {
        document.querySelector("html").setAttribute("data-theme", "light")
        localStorage.setItem("themePreference", "light")
    } else if (theme === "system") {
        document.querySelector("html").removeAttribute("data-theme");
        localStorage.removeItem("themePreference");
    }
}

function getThemeFromLocalStorage() {
    const theme = localStorage.getItem("themePreference");

    if (theme === "dark") {
        document.querySelector("html").setAttribute("data-theme", "dark")
    } else if (theme === "light") {
        document.querySelector("html").setAttribute("data-theme", "light")
    } 
}

getThemeFromLocalStorage()

//select color theme

const select = document.getElementById("theme-select");
const themeLinks = [...document.querySelectorAll('link[data-theme]')];

function setTheme(name) {
    themeLinks.forEach(l => l.disabled = (l.dataset.theme !== name));
    localStorage.setItem("theme", name);
}

if (select) {
    const saved = localStorage.getItem("theme") || select.value;
    select.value = saved;
    setTheme(saved);

    select.addEventListener("change", e => setTheme(e.target.value));
}
