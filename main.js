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
// Work dashboard (overview grid built from the detail articles)
// =========================
(function buildDash() {
    const list = document.querySelector(".work-list");
    const grid = document.getElementById("dash-grid");
    const detail = document.getElementById("work-detail");
    const back = document.querySelector(".work-back");
    if (!list || !grid || !detail || !back) return;

    const articles = Array.from(list.querySelectorAll("article.project"));

    function el(tag, cls, text) {
        const e = document.createElement(tag);
        if (cls) e.className = cls;
        if (text != null) e.textContent = text;
        return e;
    }

    function openProject(i) {
        articles.forEach((a, k) => a.classList.toggle("is-open", k === i));
        articles[i].classList.add("in");
        list.classList.add("has-open");
        detail.classList.add("is-open");
        detail.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    articles.forEach((art, i) => {
        const tags = (art.dataset.tags || "").split(",").filter(Boolean);
        const card = el("article", "dash-card");
        card.tabIndex = 0;
        card.setAttribute("role", "button");
        card.dataset.tags = tags.join(",");

        const thumb = el("div", "dash-thumb");
        const img = art.querySelector(".project-visual img");
        if (img) {
            const im = document.createElement("img");
            im.src = img.getAttribute("src");
            im.alt = img.getAttribute("alt") || "";
            im.loading = "lazy";
            thumb.appendChild(im);
        }
        card.appendChild(thumb);

        const body = el("div", "dash-body");
        const head = el("div", "dash-head");
        const idx = art.querySelector(".project-index");
        head.appendChild(el("span", "dash-index", idx ? idx.textContent.trim() : ""));
        const title = art.querySelector(".project-title");
        if (title) head.appendChild(title.cloneNode(true));
        body.appendChild(head);

        const kind = art.querySelector(".project-kind");
        if (kind) body.appendChild(kind.cloneNode(true));

        const meta = art.querySelector(".project-meta");
        if (meta) {
            const dl = el("dl", "dash-meta");
            const dts = meta.querySelectorAll("dt");
            const dds = meta.querySelectorAll("dd");
            for (let k = 0; k < Math.min(3, dts.length, dds.length); k++) {
                dl.appendChild(dts[k].cloneNode(true));
                dl.appendChild(dds[k].cloneNode(true));
            }
            body.appendChild(dl);
        }

        const desc = art.querySelector(".project-desc");
        if (desc) body.appendChild(desc.cloneNode(true));

        if (tags.length) {
            const tg = el("div", "dash-tags");
            tags.forEach((t) => {
                const s = el("span", "dash-tag", t);
                s.setAttribute("data-i18n", "tag." + t);
                tg.appendChild(s);
            });
            body.appendChild(tg);
        }
        card.appendChild(body);

        const foot = el("div", "dash-foot");
        const links = art.querySelector(".project-links");
        if (links) {
            Array.from(links.children).forEach((c) => {
                const cl = c.cloneNode(true);
                cl.addEventListener("click", (e) => e.stopPropagation());
                foot.appendChild(cl);
            });
        }
        const btn = el("button", "dash-details", "Full case \u2192");
        btn.type = "button";
        btn.setAttribute("data-i18n", "dash.details");
        foot.appendChild(btn);
        card.appendChild(foot);

        card.addEventListener("click", () => openProject(i));
        card.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                openProject(i);
            }
        });
        grid.appendChild(card);
    });

    back.addEventListener("click", () => {
        detail.classList.remove("is-open");
        list.classList.remove("has-open");
        articles.forEach((a) => a.classList.remove("is-open"));
        const work = document.getElementById("work");
        if (work) work.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    document.querySelectorAll(".dash-filters button").forEach((b) => {
        b.addEventListener("click", () => {
            document.querySelectorAll(".dash-filters button").forEach((x) => x.classList.remove("is-active"));
            b.classList.add("is-active");
            const f = b.dataset.filter;
            grid.querySelectorAll(".dash-card").forEach((c) => {
                const has = (c.dataset.tags || "").split(",").indexOf(f) >= 0;
                c.classList.toggle("is-hidden", f !== "all" && !has);
            });
        });
    });
})();

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

// =========================
// Modal (games experience)
// =========================
function openModal(id) {
    const m = document.getElementById(id);
    if (!m) return;
    m.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
}

function closeAllModals() {
    document.querySelectorAll('.modal[aria-hidden="false"]').forEach((m) => {
        m.setAttribute("aria-hidden", "true");
    });
    document.body.classList.remove("modal-open");
}

document.addEventListener("click", (e) => {
    const trigger = e.target.closest && e.target.closest("[data-modal-open]");
    if (trigger) {
        e.preventDefault();
        openModal(trigger.getAttribute("data-modal-open"));
        return;
    }
    if (e.target.closest && e.target.closest(".modal-close, .modal-backdrop")) {
        closeAllModals();
    }
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAllModals();
});
