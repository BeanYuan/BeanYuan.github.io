// =========================
// Theme toggle (Light/Dark)
// =========================
const THEME_KEY = "lizhuoyuan_theme";

function applyTheme(theme) {
    document.body.classList.toggle("theme-light", theme === "light");
}

(function initTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "light" || saved === "dark") {
        applyTheme(saved);
    } else {
        // Default: light (brighter)
        applyTheme("light");
        localStorage.setItem(THEME_KEY, "light");
    }
})();

const toggleBtn = document.querySelector(".theme-toggle");
if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
        const isLight = document.body.classList.contains("theme-light");
        const next = isLight ? "dark" : "light";
        applyTheme(next);
        localStorage.setItem(THEME_KEY, next);
    });
}

// =========================
// Footer year
// =========================
const yearSpan = document.getElementById("year");
if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
}

// =========================
// Smooth scrolling (anchors only)
// =========================
document.querySelectorAll(".nav a").forEach((link) => {
    link.addEventListener("click", (event) => {
        const targetId = link.getAttribute("href");
        if (!targetId || !targetId.startsWith("#")) return;

        event.preventDefault();
        const target = document.querySelector(targetId);
        if (target) {
            target.scrollIntoView({ behavior: "smooth" });
        }
    });
});
