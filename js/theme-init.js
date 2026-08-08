// Runs before first paint (loaded as a plain, non-module <script> in
// <head>, ahead of the stylesheet) so the correct theme is set on <html>
// before anything renders. Kept as its own tiny file — separate from
// theme.js — because it has to run synchronously and early, before the
// DOM the rest of theme.js depends on even exists.

(function () {
    var stored = localStorage.getItem("ut-theme");
    var theme = stored || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", theme);
})();
