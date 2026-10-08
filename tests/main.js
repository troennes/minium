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

// Color theme: swaps one <link> to dist/themes/<name>.css, like users load a theme
// [name, primary swatch]; keep in sync with scripts/themes.json
const colorThemes = [
    ["gray", "#202020"],
    ["mauve", "#211f26"],
    ["slate", "#1c2024"],
    ["sage", "#1a211e"],
    ["olive", "#1d211c"],
    ["sand", "#21201c"],
    ["bronze", "#a18072"],
    ["gold", "#978365"],
    ["brown", "#ad7f58"],
    ["orange", "#f76b15"],
    ["tomato", "#e54d2e"],
    ["red", "#e5484d"],
    ["ruby", "#e54666"],
    ["crimson", "#e93d82"],
    ["pink", "#d6409f"],
    ["plum", "#ab4aba"],
    ["purple", "#8e4ec6"],
    ["violet", "#6e56cf"],
    ["iris", "#5b5bd6"],
    ["indigo", "#3e63dd"],
    ["blue", "#0090ff"],
    ["cyan", "#00a2c7"],
    ["sky", "#7ce2fe"],
    ["teal", "#12a594"],
    ["jade", "#29a383"],
    ["green", "#30a46c"],
    ["grass", "#46a758"],
    ["mint", "#86ead4"],
    ["lime", "#bdee63"],
    ["yellow", "#ffe629"],
    ["amber", "#ffc53d"]
];

function setColorTheme(name) {
    let link = document.getElementById("color-theme-link");

    if (name === "default") {
        link?.remove();
        localStorage.removeItem("colorTheme");
    } else {
        if (!link) {
            link = document.createElement("link");
            link.id = "color-theme-link";
            link.rel = "stylesheet";
            document.head.append(link);
        }
        link.href = `../dist/themes/${name}.css`;
        localStorage.setItem("colorTheme", name);
    }

    document.getElementById("color-theme-name").textContent = name === "default" ? "Default" : name;
    document.querySelectorAll("#color-theme-list button").forEach(button => {
        button.setAttribute("aria-pressed", button.dataset.colorTheme === name);
    });
}

function buildColorThemeList() {
    const list = document.getElementById("color-theme-list");
    if (!list) return;

    const items = [["default"], ...colorThemes].map(([name, primary]) => {
        const swatch = primary
            ? `<span class="theme-swatch" style="background: ${primary}"></span>`
            : `<span class="theme-swatch"></span>`;
        const label = name === "default" ? "Default (core)" : name;
        return `<li><button data-color-theme="${name}">${swatch} ${label}</button></li>`;
    });
    list.innerHTML = items.join("");
    list.addEventListener("click", e => {
        const button = e.target.closest("button[data-color-theme]");
        if (button) setColorTheme(button.dataset.colorTheme);
    });

    setColorTheme(localStorage.getItem("colorTheme") || "default");
}

buildColorThemeList()
