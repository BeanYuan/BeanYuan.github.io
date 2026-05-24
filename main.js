// =========================
// Theme toggle (Light/Dark)
// =========================
const THEME_KEY = "lizhuoyuan_theme_v2";

function applyTheme(theme) {
    document.body.classList.toggle("theme-light", theme === "light");
}

(function initTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "light" || saved === "dark") {
        applyTheme(saved);
    } else {
        // Default: dark
        applyTheme("dark");
        localStorage.setItem(THEME_KEY, "dark");
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

// =========================
// Scroll reveal
// =========================
const revealEls = document.querySelectorAll(".reveal");

function revealAll() {
    revealEls.forEach((el) => el.classList.add("in"));
}

// 仅在能正常观察视口时启用动画，否则直接显示内容（保证内容永不卡在隐藏态）
const canObserve =
    "IntersectionObserver" in window && window.innerHeight > 0;

if (canObserve && revealEls.length) {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                const delay = Number(el.dataset.revealDelay) || 0;
                setTimeout(() => el.classList.add("in"), delay);
                observer.unobserve(el);
            });
        },
        { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    revealEls.forEach((el) => observer.observe(el));

    // 安全兜底：若 8s 后仍有元素未触发（异常环境），强制显示
    setTimeout(() => {
        if (document.querySelectorAll(".reveal:not(.in)").length === revealEls.length) {
            revealAll();
        }
    }, 8000);
} else {
    revealAll();
}
