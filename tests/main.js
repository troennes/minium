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
// [name, primary swatch, accent swatch]; keep in sync with scripts/themes.json
const colorThemes = [
    ["gray", "#202020", "#5b5bd6"],
    ["mauve", "#211f26", "#6e56cf"],
    ["slate", "#1c2024", "#3e63dd"],
    ["sage", "#1a211e", "#12a594"],
    ["olive", "#1d211c", "#bdee63"],
    ["sand", "#21201c", "#978365"],
    ["bronze", "#a18072", "#12a594"],
    ["gold", "#978365", "#8e4ec6"],
    ["brown", "#ad7f58", "#7ce2fe"],
    ["orange", "#f76b15", "#3e63dd"],
    ["tomato", "#e54d2e", "#12a594"],
    ["red", "#e5484d", "#978365"],
    ["ruby", "#e54666", "#29a383"],
    ["crimson", "#e93d82", "#00a2c7"],
    ["pink", "#d6409f", "#86ead4"],
    ["plum", "#ab4aba", "#5b5bd6"],
    ["purple", "#8e4ec6", "#978365"],
    ["violet", "#6e56cf", "#d6409f"],
    ["iris", "#5b5bd6", "#ab4aba"],
    ["indigo", "#3e63dd", "#f76b15"],
    ["blue", "#0090ff", "#8e4ec6"],
    ["cyan", "#00a2c7", "#6e56cf"],
    ["sky", "#7ce2fe", "#d6409f"],
    ["teal", "#12a594", "#f76b15"],
    ["jade", "#29a383", "#e54666"],
    ["green", "#30a46c", "#978365"],
    ["grass", "#46a758", "#ffe629"],
    ["mint", "#86ead4", "#d6409f"],
    ["lime", "#bdee63", "#6e56cf"],
    ["yellow", "#ffe629", "#30a46c"],
    ["amber", "#ffc53d", "#5b5bd6"]
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

    const items = [["default"], ...colorThemes].map(([name, primary, accent]) => {
        const swatches = primary
            ? `<span class="theme-swatch" style="background: ${primary}"></span><span class="theme-swatch" style="background: ${accent}"></span>`
            : `<span class="theme-swatch"></span><span class="theme-swatch"></span>`;
        const label = name === "default" ? "Default (core)" : name;
        return `<li><button data-color-theme="${name}">${swatches} ${label}</button></li>`;
    });
    list.innerHTML = items.join("");
    list.addEventListener("click", e => {
        const button = e.target.closest("button[data-color-theme]");
        if (button) setColorTheme(button.dataset.colorTheme);
    });

    setColorTheme(localStorage.getItem("colorTheme") || "default");
}

buildColorThemeList()
