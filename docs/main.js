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

function populateExampleCodeBlocks() {
  const examples = document.querySelectorAll(".example");

  for (const example of examples) {
    const article = example.querySelector(":scope > article");
    let pre = example.querySelector(":scope > pre");

    if (!article) continue;

    if (!pre) {
      pre = document.createElement("pre");
      example.append(pre);
    }

    let code = pre.querySelector(":scope > code");
    if (!code) {
      code = document.createElement("code");
      code.className = "lang-html";
      pre.replaceChildren(code);
    } else {
      code.classList.add("lang-html");
    }

    if (!code.textContent.trim()) {
      const lines = article.innerHTML.trim().split("\n");
      const normalized = lines
        .map((line, index) => {
          if (index === 0) return line;
          return line.startsWith("    ") ? line.slice(4) : line;
        })
        .join("\n")
        // Drop the ="" the browser adds to boolean attributes (e.g. popover="").
        .replace(/(\s[a-zA-Z][a-zA-Z0-9-]*)=""/g, "$1");

      code.textContent = normalized;
    }

    if (window.Prism?.highlightElement) {
      window.Prism.highlightElement(code);
    }
  }
}

function setActiveSidebarLink(sidebar) {
  const links = [...sidebar.querySelectorAll("a[href]")];
  if (links.length === 0) return;

  const currentUrl = new URL(window.location.href);
  const normalizePathname = (pathname) => pathname.replace(/\/index\.html$/, "/");
  const pathMatches = links.filter((link) => {
    const linkUrl = new URL(link.getAttribute("href"), currentUrl);
    return normalizePathname(linkUrl.pathname) === normalizePathname(currentUrl.pathname);
  });

  let activeLink = null;

  if (currentUrl.hash) {
    activeLink = pathMatches.find((link) => {
      const linkUrl = new URL(link.getAttribute("href"), currentUrl);
      return linkUrl.hash === currentUrl.hash;
    }) ?? null;
  }

  if (!activeLink) {
    activeLink = pathMatches.find((link) => {
      const linkUrl = new URL(link.getAttribute("href"), currentUrl);
      return linkUrl.hash === "";
    }) ?? pathMatches[0] ?? null;
  }

  if (!activeLink) return;

  activeLink.setAttribute("aria-current", "true");
  const parentDetails = activeLink.closest("details");
  if (parentDetails) {
    parentDetails.open = true;
  }
}

function setupDocsNavToggle(sidebar) {
  const sidebarAside = sidebar.closest("aside");
  if (!sidebarAside) return;

  const navToggle = document.createElement("button");
  navToggle.type = "button";
  navToggle.className = "docs-nav-toggle icon-only";
  navToggle.setAttribute("aria-controls", sidebar.id);
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "Open navigation");

  function setDocsNavOpen(isOpen) {
    sidebarAside.toggleAttribute("data-nav-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  }

  navToggle.addEventListener("click", function() {
    setDocsNavOpen(!sidebarAside.hasAttribute("data-nav-open"));
  });

  sidebar.addEventListener("click", function(event) {
    if (event.target.closest("a[href]")) {
      setDocsNavOpen(false);
    }
  });

  sidebar.before(navToggle);
}



getThemeFromLocalStorage()

document.addEventListener('DOMContentLoaded', function() {
  const header = document.getElementById('header');
  const sidebar = document.getElementById('sidebar');
  const footer = document.getElementById('footer');

  header.innerHTML = `
  <nav class="container">
  <ul>
    <li><strong><a href="/">Minium CSS</a></strong></li>
  </ul>
  <ul class="gap-2xs">
    <li>
      <a href="/llms.txt" role="button" class="icon-only" data-tooltip="View llms.txt for agents" data-placement="left">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
      </a>
    </li>
    <li>
      <a href="https://github.com/troennes/minium-css" role="button" class="icon-only" data-tooltip="View on GitHub" data-placement="left"><svg class="icon" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z" transform="scale(64)" fill="currentColor"/></svg></a>
    </li>
    <li>
      <div class="dropdown">
        <button popovertarget="theme-selector" class="icon-only" data-tooltip="Choose theme" data-placement="left">
          <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 24 24" width="24" fill="currentColor"><path d="M10 18c.112 0 .112-5.333 0-16a8 8 0 1 0 0 16zm0 2C4.477 20 0 15.523 0 10S4.477 0 10 0s10 4.477 10 10-4.477 10-10 10z"></path></svg>
        </button>
        <nav id="theme-selector" popover>
          <ul>
            <li><button onclick="changeThemeSelector('dark')">
              <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="-4 -2 24 24" width="24" fill="currentColor"><path d="M2 10c0 4.43 3.478 8 7.742 8 .658 0 1.302-.085 1.922-.248-2.996-2.2-4.896-5.786-4.896-9.752 0-2.09.527-4.095 1.489-5.853C4.699 2.863 2 6.097 2 10zm6.768-2c0 4.632 3.068 8.528 7.232 9.665A9.555 9.555 0 0 1 9.742 20C4.362 20 0 15.523 0 10S4.362 0 9.742 0c.868 0 1.71.117 2.511.335A10.086 10.086 0 0 0 8.768 8z"></path></svg>
              Dark
            </button></li>
            <li><button onclick="changeThemeSelector('light')">
              <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 24 24" width="24" fill="currentColor"><path d="M10 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 2a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm0-15a1 1 0 0 1 1 1v2a1 1 0 0 1-2 0V1a1 1 0 0 1 1-1zm0 16a1 1 0 0 1 1 1v2a1 1 0 0 1-2 0v-2a1 1 0 0 1 1-1zM1 9h2a1 1 0 1 1 0 2H1a1 1 0 0 1 0-2zm16 0h2a1 1 0 0 1 0 2h-2a1 1 0 0 1 0-2zm.071-6.071a1 1 0 0 1 0 1.414l-1.414 1.414a1 1 0 1 1-1.414-1.414l1.414-1.414a1 1 0 0 1 1.414 0zM5.757 14.243a1 1 0 0 1 0 1.414L4.343 17.07a1 1 0 1 1-1.414-1.414l1.414-1.414a1 1 0 0 1 1.414 0zM4.343 2.929l1.414 1.414a1 1 0 0 1-1.414 1.414L2.93 4.343A1 1 0 0 1 4.343 2.93zm11.314 11.314l1.414 1.414a1 1 0 0 1-1.414 1.414l-1.414-1.414a1 1 0 1 1 1.414-1.414z"></path></svg>
              Light
            </button></li>
            <li><button onclick="changeThemeSelector('system')">
              <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 24 24" width="24" fill="currentColor"><path d="M10 18c.112 0 .112-5.333 0-16a8 8 0 1 0 0 16zm0 2C4.477 20 0 15.523 0 10S4.477 0 10 0s10 4.477 10 10-4.477 10-10 10z"></path></svg>
              System
            </button></li>
          </ul>
        </nav>
      </div>
    </li>
  </ul>
  </nav>
`;

  sidebar.innerHTML = `
  <ul>
    <li>
      <details>
        <summary>Getting started</summary>
        <ul>
          <li><a href="index.html">Quick start</a></li>
          <li><a href="customization.html">Customization</a></li>
          <li><a href="colors.html">Colors</a></li>
        </ul>
      </details>
    </li>
    <li>
      <details>
        <summary>Layout</summary>
        <ul>
          <li><a href="layout.html">Overview</a></li>
          <li><a href="layout-frame.html">Frame</a></li>
          <li><a href="layout-flow.html">Flow</a></li>
          <li><a href="layout-cluster.html">Cluster</a></li>
          <li><a href="layout-containers.html">Containers</a></li>
          <li><a href="layout-grid.html">Grid</a></li>
          <li><a href="layout-landmarks.html">Landmarks</a></li>
          <li><a href="layout-repel.html">Repel</a></li>
          <li><a href="layout-sidebar.html">Sidebar</a></li>
          <li><a href="layout-switcher.html">Switcher</a></li>
        </ul>
      </details>
    </li>
    <li>
      <details>
        <summary>Content</summary>
        <ul>
          <li><a href="content-typography.html">Typography</a></li>
          <li><a href="content-code.html">Code</a></li>
          <li><a href="content-button.html">Button</a></li>
          <li><a href="content-table.html">Table</a></li>
          <li><a href="content-link.html">Link</a></li>
        </ul>
      </details>
    </li>
    <li>
      <details>
        <summary>Forms</summary>
        <ul>
          <li><a href="forms.html">Overview</a></li>
          <li><a href="forms-inputs.html">Inputs</a></li>
          <li><a href="forms-textarea.html">Textarea</a></li>
          <li><a href="forms-select.html">Select</a></li>
          <li><a href="forms-checkbox.html">Checkboxes</a></li>
          <li><a href="forms-radio.html">Radio</a></li>
          <li><a href="forms-switch.html">Switch</a></li>
        </ul>
      </details>
    </li>
    <li>
      <details>
        <summary>Components</summary>
        <ul>
          <li><a href="component-accordion.html">Accordions</a></li>
          <li><a href="component-alert.html">Alerts</a></li>
          <li><a href="component-avatar.html">Avatar</a></li>
          <li><a href="component-badge.html">Badges</a></li>
          <li><a href="component-breadcrumb.html">Breadcrumb</a></li>
          <li><a href="component-card.html">Cards</a></li>
          <li><a href="component-dropdown.html">Dropdown</a></li>
          <li><a href="component-group.html">Group</a></li>
          <li><a href="component-icon.html">Icon</a></li>
          <li><a href="component-modal.html">Modal</a></li>
          <li><a href="component-navbar.html">Navbar</a></li>
          <li><a href="component-sidemenu.html">Side menu</a></li>
          <li><a href="component-skeleton.html">Skeleton</a></li>
          <li><a href="component-tabs.html">Tabs</a></li>
          <li><a href="component-progress.html">Progress</a></li>
          <li><a href="component-pagination.html">Pagination</a></li>
          <li><a href="component-tooltip.html">Tooltip</a></li>
        </ul>
      </details>
    </li>
    <li><a href="utility.html">Utility</a></li>
    <li><a href="integrations.html">Integrations</a></li>
  </ul>
  <p>&nbsp;</p>
`;

footer.innerHTML = `
<div class="container">
    <p><small>Made by <a href="https://github.com/troennes">Kim Trønnes</a>. Licensed under the <a href="https://github.com/troennes/minium/blob/main/LICENSE">MIT license</a>.</small></p>
</div>
`;

  populateExampleCodeBlocks();
  setActiveSidebarLink(sidebar);
  setupDocsNavToggle(sidebar);
  
});
