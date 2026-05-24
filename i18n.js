// =========================================================
// Bilingual (EN / ZH) support
// - IP-based auto-detect on first visit, with fallbacks
// - manual toggle, choice remembered in localStorage
// =========================================================
(function () {
    "use strict";

    var LANG_KEY = "lizhuoyuan_lang";
    var ZH_REGIONS = ["CN", "HK", "MO", "TW"];

    // ---- translation dictionary ------------------------------------------
    var I18N = {
        "doc.title": {
            en: "Lizhuoyuan Wan — Programmer & Game Designer",
            zh: "Lizhuoyuan Wan — 程序员与游戏设计师"
        },

        // nav
        "nav.work": { en: "Work", zh: "作品" },
        "nav.about": { en: "About", zh: "关于" },
        "nav.contact": { en: "Contact", zh: "联系" },
        "nav.cv": { en: "CV", zh: "简历" },
        "nav.theme": { en: "Theme", zh: "主题" },

        // hero
        "hero.eyebrow": {
            en: "Programmer · Game & System Designer",
            zh: "程序员 · 游戏与系统设计师"
        },
        "hero.lead": {
            en: "I build systems, games, and interactive experiences — from large-scale MMORPG servers to mechanic-driven prototypes.",
            zh: "从大型 MMORPG 服务端到机制驱动的原型——注重系统设计和交互体验的游戏设计师"
        },
        "hero.btnWork": { en: "View work", zh: "查看作品" },
        "hero.btnContact": { en: "Get in touch", zh: "联系我" },

        // about
        "about.label": { en: "About", zh: "关于" },
        "about.lead": {
            en: "I'm a programmer and designer who combines system thinking, gameplay feel, and technical implementation — building things that are logically consistent under the hood and engaging to interact with.",
            zh: "我是一名程序员与设计师，擅长将系统思维、游戏手感与技术实现结合起来 —— 做出底层逻辑严谨、交互体验有趣的东西。"
        },
        "about.skillsH": { en: "Skills", zh: "技能" },
        "about.skill1": { en: "Programming & architecture design", zh: "编程与架构设计" },
        "about.skill2": { en: "Game / system mechanics design", zh: "游戏 / 系统机制设计" },
        "about.skill3": { en: "Documentation & case-study writing", zh: "文档与案例撰写" },
        "about.valueH": { en: "What I value", zh: "我所看重的" },
        "about.value1": { en: "Clear logic and clean structure", zh: "清晰的逻辑与整洁的结构" },
        "about.value2": { en: "Player / user experience", zh: "玩家 / 用户体验" },
        "about.value3": { en: "Long-term maintainability", zh: "长期可维护性" },

        // work section
        "work.label": { en: "Selected Work", zh: "精选作品" },

        // shared — detail headings
        "detail.design": { en: "Design & Planning", zh: "策划与设计" },
        "detail.dev": { en: "Development", zh: "开发" },

        // shared — meta labels
        "meta.role": { en: "Role", zh: "职责" },
        "meta.team": { en: "Team", zh: "团队" },
        "meta.type": { en: "Type", zh: "类型" },
        "meta.status": { en: "Status", zh: "状态" },
        "meta.genre": { en: "Genre", zh: "品类" },
        "meta.format": { en: "Format", zh: "形式" },
        "meta.platform": { en: "Platform", zh: "平台" },
        "meta.scope": { en: "Scope", zh: "规模" },
        "meta.advisor": { en: "Advisor", zh: "指导教授" },
        "meta.focus": { en: "Focus", zh: "重点" },

        // shared — links / notes
        "link.pdf": { en: "Project PDF", zh: "项目 PDF" },
        "note.inDev": { en: "In development", zh: "开发中" },
        "note.caseStudy": { en: "Case study in progress", zh: "案例研究撰写中" },
        "note.writeup": { en: "Write-up in progress", zh: "详细说明撰写中" },

        // ---- project 1 — Witcher 3 in Minecraft ----
        "p1.kind": { en: "MMORPG Server", zh: "MMORPG 服务端" },
        "p1.dd.role": {
            en: "Producer / Java Main Programmer / Designer",
            zh: "制作人 / Java 主程 / 设计"
        },
        "p1.dd.team": {
            en: "11 people — art, programming, design, marketing",
            zh: "11 人 —— 美术、程序、策划、市场"
        },
        "p1.dd.type": {
            en: "Long-term personal studio project",
            zh: "长期个人工作室项目"
        },
        "p1.desc": {
            en: "An innovative MMORPG built on Minecraft and inspired by The Witcher 3 — a long-term personal studio project that I lead end to end.",
            zh: "一款基于《我的世界》、灵感源自《巫师3》的创新 MMORPG —— 由我从头到尾主导的长期个人工作室项目。"
        },
        "p1.vcap": { en: "Public-test gameplay PV.", zh: "公测玩法 PV。" },
        "p1.design1": {
            en: "Designed the class & skill systems for five classes — Warrior, Mage, Priest, Rogue, and Archer — each with 25+ active and passive skills.",
            zh: "策划五个职业（战、法、牧、刺、射）的职业与技能系统，每个职业包含 25 个及以上主动 / 被动技能。"
        },
        "p1.design2": {
            en: "Designed skill-synergy mechanics and distinct build archetypes (playstyles) for every class.",
            zh: "设计技能之间的联动机制，以及各职业的流派（玩法构筑）。"
        },
        "p1.design3": {
            en: "Designed boss-instance mechanics and potion / item functions, and arranged the story-driven player progression and the ordering of reward instances.",
            zh: "设计 BOSS 副本机制与药水 / 道具功能，并根据剧情编排玩家流程与奖励副本的顺序。"
        },
        "p1.design4": {
            en: "Designed and shipped a roguelike tower-climb mode and a life-skill system (fishing) — randomized routes, reward builds, and a growth / output loop — tied into hidden instances to extend the content lifecycle.",
            zh: "设计并落地肉鸽爬塔模式与生活技能系统（钓鱼）—— 随机路线、奖励构筑、成长产出闭环 —— 并联动隐藏副本以延长内容生命周期。"
        },
        "p1.dev1": {
            en: "As main Java programmer, built the MMORPG's core systems early on: combat damage resolution and the damage-formula system, inventory and item-type storage, and a potion / item crafting and recipe system.",
            zh: "作为 Java 主程，项目前期搭建 MMORPG 核心系统：战斗伤害判定与伤害公式系统、背包道具种类与储存、药水 / 道具合成与配方系统。"
        },
        "p1.dev2": {
            en: "Engineered asynchronous scene & instance loading, and the open-world and instance party (group) system.",
            zh: "实现异步加载场景副本系统，以及大世界与副本组队系统。"
        },
        "p1.dev3": {
            en: "Implemented class skill-book progression with skill-point requirements, and the logic coordinating passive-skill triggers with active-skill cast conditions.",
            zh: "实现职业技能书学习与加点需求逻辑，以及被动技能判定与主动技能释放条件的协调机制。"
        },
        "p1.dev4": {
            en: "Designed and implemented the late-game large-raid & boss combat system — phase mechanics, skill triggers, target selection, and damage resolution — with refined combat feedback and multiplayer co-op.",
            zh: "设计并实现后期大型团本与 Boss 战斗体系 —— 阶段机制、技能触发、目标选择与伤害判定 —— 并优化战斗反馈与多人协作体验。"
        },

        // ---- project 2 — TurretCoop ----
        "p2.kind": { en: "Co-op Tower Defense · Roguelike", zh: "合作塔防 · 肉鸽" },
        "p2.dd.role": { en: "Designer / Programmer", zh: "设计 / 程序" },
        "p2.dd.status": { en: "In development", zh: "开发中" },
        "p2.dd.genre": {
            en: "Tower Defense · Co-op · Roguelike",
            zh: "塔防 · 合作 · 肉鸽"
        },
        "p2.desc": {
            en: "A co-op tower-defense game with roguelike elements, currently in development. Battles play out on a field that gradually widens — and what it widens into is never the same twice. (TurretCoop is a working title.)",
            zh: "一款带肉鸽元素的合作塔防游戏，目前正在开发中。战斗在一片逐渐拓宽的战场上展开 —— 而它每次拓宽出的样子都不相同。（TurretCoop 为暂定名。）"
        },
        "p2.gcap": {
            en: "In-development prototype — combat, modular tower parts, the roguelike upgrade screen, and building placement on the expanding battlefield.",
            zh: "开发中的原型 —— 战斗、模块化塔部件、肉鸽增益选择界面，以及在拓宽战场上的建造放置。"
        },
        "p2.design1": {
            en: "Expanding battlefield — instead of a fixed map, the combat field widens as a run progresses.",
            zh: "拓宽战场 —— 不是固定地图，战斗区域随对局推进不断拓宽。"
        },
        "p2.design2": {
            en: "Each new section is drawn from different module types, reshuffling layout and pacing for roguelike variety.",
            zh: "每段新区域抽取自不同的模块类型，重排布局与节奏，带来肉鸽式的随机性。"
        },
        "p2.design3": {
            en: "Modular towers — defenses are split into base, body, and top attack module, so players freely assemble their own towers.",
            zh: "模块化防御塔 —— 防御塔拆分为底座、塔身、塔顶攻击模块，玩家可自由组装自己的塔。"
        },
        "p2.dev1": {
            en: "Wave Function Collapse (WFC) drives procedural terrain generation.",
            zh: "波函数坍塌（WFC）驱动程序化地形生成。"
        },
        "p2.dev2": {
            en: "Part-based tower system — base / body / top modules combine into player-built towers.",
            zh: "部件化塔系统 —— 底座 / 塔身 / 塔顶模块组合成玩家自建的防御塔。"
        },

        // ---- project 3 — Demons & Knights ----
        "p3.kind": { en: "Turn-based Strategy", zh: "回合制策略" },
        "p3.dd.role": { en: "Designer / Unity Programmer", zh: "设计 / Unity 程序" },
        "p3.dd.format": { en: "2-player · Turn-based", zh: "双人 · 回合制" },
        "p3.dd.type": { en: "School Unity project", zh: "学校 Unity 项目" },
        "p3.desc": {
            en: "A two-player confrontation game where players use cards and grid-based movement to outplay each other turn by turn.",
            zh: "一款双人对抗游戏，玩家在各自回合用卡牌与基于格子的移动来博弈、压制对手。"
        },
        "p3.fcap": {
            en: "Board elements — knights, the demon castle, barriers, traps, lava, bridges, and item chests.",
            zh: "棋盘元素 —— 骑士、恶魔城堡、屏障、陷阱、熔岩、桥梁与道具宝箱。"
        },
        "p3.design1": { en: "Grid, unit, and card design.", zh: "格子、单位与卡牌设计。" },
        "p3.design2": {
            en: "Turn-based combat flow and balancing.",
            zh: "回合制战斗流程与数值平衡。"
        },
        "p3.dev1": {
            en: "Unity implementation of the board, units, and card logic.",
            zh: "用 Unity 实现棋盘、单位与卡牌逻辑。"
        },

        // ---- project 4 — Flux ----
        "p4.kind": { en: "2D Platformer", zh: "2D 平台跳跃" },
        "p4.dd.role": { en: "Designer / Unity Programmer", zh: "设计 / Unity 程序" },
        "p4.dd.platform": {
            en: "Mobile · 2D side-scroller",
            zh: "移动端 · 2D 横版"
        },
        "p4.dd.type": { en: "School Unity project", zh: "学校 Unity 项目" },
        "p4.desc": {
            en: "A 2D side-scrolling mobile game where the player travels to any past moment and reshapes space to progress through each level.",
            zh: "一款 2D 横版移动游戏，玩家可穿越到任意过去的时刻并重塑空间，从而通关每个关卡。"
        },
        "p4.design1": {
            en: "Time-travel / space-transform mechanic design.",
            zh: "时间穿越 / 空间变换机制设计。"
        },
        "p4.design2": {
            en: "Level design for the mobile side-scroller.",
            zh: "移动端横版关卡设计。"
        },
        "p4.dev1": {
            en: "Unity implementation of movement and the time/space mechanic.",
            zh: "用 Unity 实现角色移动与时间 / 空间机制。"
        },

        // ---- project 5 — Scrollscape ----
        "p5.kind": { en: "Exploration", zh: "探索" },
        "p5.dd.role": {
            en: "Unity Developer / Systems Designer",
            zh: "Unity 开发 / 系统设计"
        },
        "p5.dd.scope": { en: "Team project · 16 scenes", zh: "团队项目 · 16 个场景" },
        "p5.desc": {
            en: "An open-ended, galaxy-style exploration project built in Unity, shipped as a playable vertical slice.",
            zh: "一个在 Unity 中打造的开放式、银河风格探索项目，最终交付为可游玩的纵向切片。"
        },
        "p5.vcap": { en: "Gameplay video.", zh: "玩法视频。" },
        "p5.design1": {
            en: "Systems design for exploration and gameplay modules.",
            zh: "探索玩法与玩法模块的系统设计。"
        },
        "p5.dev1": {
            en: "Unity development across gameplay modules.",
            zh: "在各玩法模块上的 Unity 开发。"
        },
        "p5.dev2": {
            en: "Rapid iteration on a 16-scene vertical slice.",
            zh: "围绕 16 个场景的纵向切片进行快速迭代。"
        },

        // ---- project 6 — VR experiment ----
        "p6.title": {
            en: "VR Ball Localization & Grasping Accuracy Experiment",
            zh: "小球定位与抓取精度实验"
        },
        "p6.kind": {
            en: "Research — Proprioception & Sensorimotor Integration",
            zh: "研究 —— 本体感觉与感觉运动整合"
        },
        "p6.dd.role": {
            en: "Experiment Designer / Unity Developer",
            zh: "实验设计 / Unity 开发"
        },
        "p6.dd.advisor": { en: "Prof. Wallace Lages", zh: "Wallace Lages 教授" },
        "p6.dd.focus": {
            en: "Experimental paradigm · Data pipeline",
            zh: "实验范式 · 数据管线"
        },
        "p6.desc": {
            en: "Designed and developed under Professor Wallace Lages — a VR-based ball-localization and grasping experimental paradigm that quantifies the localization precision and error bounds of proprioception and sensorimotor integration.",
            zh: "在 Wallace Lages 教授指导下，设计并开发基于 VR 的小球定位与抓取实验范式，用于量化本体感觉与感觉运动整合的定位精度与误差边界。"
        },
        "p6.gcap": {
            en: "VR training prototype — arcane calibration, the rune-core lock task, and the end-of-session performance report.",
            zh: "VR 训练原型 —— 奥术校准、符文核心锁定任务，以及训练结束后的成绩报告。"
        },
        "p6.design1": {
            en: "Defined the experimental paradigm — how each trial localizes and grasps a target ball under controlled conditions.",
            zh: "定义实验范式 —— 每个试次如何在可控条件下定位并抓取目标球。"
        },
        "p6.design2": {
            en: "Independent variables: target-ball position (x / y / z), distance, viewing angle (yaw / pitch), and feedback on/off.",
            zh: "自变量：目标球位置（x / y / z）、距离、视角（yaw / pitch）以及反馈有 / 无。"
        },
        "p6.design3": {
            en: "Dependent measures: hit deviation, angular error, reaction time, and success rate.",
            zh: "因变量指标：命中偏差、角度误差、反应时与成功率。"
        },
        "p6.dev1": {
            en: "Built the full interaction flow in Unity, with trial randomization across conditions.",
            zh: "在 Unity 中实现完整交互流程，并对各条件进行试次随机化。"
        },
        "p6.dev2": {
            en: "Implemented per-trial data logging and export to feed downstream statistical analysis.",
            zh: "实现逐试次的数据记录与导出，为后续统计分析提供数据。"
        },
        "p6.dev3": {
            en: "Delivered a stable platform supporting repeated runs and fast experiment iteration.",
            zh: "交付一个支持重复运行、便于快速迭代实验的稳定平台。"
        },

        // contact
        "contact.label": { en: "Contact", zh: "联系" },
        "contact.lead": {
            en: "If you'd like to talk about projects, collaboration, or anything around programming and design — reach out.",
            zh: "如果你想聊聊项目、合作，或任何与编程和设计相关的话题 —— 欢迎联系我。"
        },
        "contact.kEmail": { en: "Email", zh: "邮箱" },

        // footer
        "footer.role": {
            en: "Programmer & Game Designer",
            zh: "程序员与游戏设计师"
        }
    };

    // ---- apply a language ------------------------------------------------
    var currentLang = "en";

    function apply(lang) {
        currentLang = lang;
        document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";

        var nodes = document.querySelectorAll("[data-i18n]");
        for (var i = 0; i < nodes.length; i++) {
            var entry = I18N[nodes[i].getAttribute("data-i18n")];
            if (entry && entry[lang] != null) {
                nodes[i].textContent = entry[lang];
            }
        }

        if (I18N["doc.title"]) {
            document.title = I18N["doc.title"][lang];
        }

        var toggle = document.querySelector(".lang-toggle");
        if (toggle) {
            toggle.textContent = lang === "zh" ? "EN" : "中文";
            toggle.setAttribute(
                "aria-label",
                lang === "zh" ? "Switch to English" : "切换到中文"
            );
        }
    }

    function setLang(lang, persist) {
        apply(lang);
        if (persist) {
            try {
                localStorage.setItem(LANG_KEY, lang);
            } catch (e) {}
        }
    }

    // ---- toggle (event delegation, robust if button added later) ---------
    document.addEventListener("click", function (e) {
        var btn = e.target && e.target.closest && e.target.closest(".lang-toggle");
        if (!btn) return;
        setLang(currentLang === "zh" ? "en" : "zh", true);
    });

    // ---- init: saved choice > IP geolocation > browser language > en ----
    var saved = null;
    try {
        saved = localStorage.getItem(LANG_KEY);
    } catch (e) {}

    if (saved === "en" || saved === "zh") {
        apply(saved);
        return;
    }

    // immediate best-guess from browser language (avoids a flash for zh users)
    var guess =
        (navigator.language || "en").toLowerCase().indexOf("zh") === 0
            ? "zh"
            : "en";
    apply(guess);

    // refine by IP geolocation, then remember the result
    fetch("https://ipapi.co/json/")
        .then(function (r) {
            return r.ok ? r.json() : Promise.reject();
        })
        .then(function (data) {
            var cc =
                data && data.country_code
                    ? String(data.country_code).toUpperCase()
                    : "";
            setLang(ZH_REGIONS.indexOf(cc) >= 0 ? "zh" : "en", true);
        })
        .catch(function () {
            // IP lookup unavailable — keep the browser-language guess
            setLang(guess, true);
        });
})();
