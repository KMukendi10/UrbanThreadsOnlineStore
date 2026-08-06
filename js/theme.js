// theme.js
//
// Dark mode toggle. The `data-theme` attribute is already set on <html>
// before first paint by the inline script in each page's <head> (avoids a
// flash of the wrong theme on load); this module just wires up the toggle
// button, swaps its icon, and keeps localStorage in sync whenever the user
// flips it.

const STORAGE_KEY = "ut-theme";

function applyIcon(button, theme) {

    button.textContent = theme === "dark" ? "☀️" : "🌙";

    button.setAttribute(
        "aria-label",
        theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
    );

}

const toggleBtn = document.getElementById("theme-toggle");

if (toggleBtn) {

    applyIcon(toggleBtn, document.documentElement.getAttribute("data-theme") || "light");

    toggleBtn.addEventListener("click", () => {

        const current = document.documentElement.getAttribute("data-theme") || "light";
        const next = current === "dark" ? "light" : "dark";

        document.documentElement.setAttribute("data-theme", next);
        localStorage.setItem(STORAGE_KEY, next);
        applyIcon(toggleBtn, next);

    });

}
