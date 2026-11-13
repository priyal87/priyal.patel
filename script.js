/* ==========================================================================
   Priyal Patel — Portfolio interactions
   Theme, navigation, scroll effects, counters
   ========================================================================== */
(() => {
  "use strict";

  const root = document.documentElement;
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(pointer: fine)");

  /* ----------------------------------------------------------------------
     Theme
     ---------------------------------------------------------------------- */
  const themeToggle = $("#theme-toggle");
  const metaTheme = $('meta[name="theme-color"]');
  const themeColors = { dark: "#06080f", light: "#f6f7fb" };

  const syncThemeUI = () => {
    const isDark = root.dataset.theme === "dark";
    if (themeToggle) {
      themeToggle.setAttribute(
        "aria-label",
        isDark ? "Switch to light theme" : "Switch to dark theme"
      );
    }
    if (metaTheme) {
      metaTheme.setAttribute("content", isDark ? themeColors.dark : themeColors.light);
    }
  };

  themeToggle?.addEventListener("click", () => {
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* storage unavailable — theme still applies for this visit */
    }
    syncThemeUI();
  });

  syncThemeUI();

  /* ----------------------------------------------------------------------
     Header state + back to top
     ---------------------------------------------------------------------- */
  const header = $("#site-header");
  const toTop = $("#to-top");
  let scrollQueued = false;

  const updateScrollUI = () => {
    const y = window.scrollY;
    header?.classList.toggle("is-scrolled", y > 8);
    toTop?.classList.toggle("is-visible", y > 640);
    scrollQueued = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (!scrollQueued) {
        scrollQueued = true;
        requestAnimationFrame(updateScrollUI);
      }
    },
    { passive: true }
  );
  updateScrollUI();

  toTop?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: reducedMotion.matches ? "auto" : "smooth" });
    $(".brand")?.focus({ preventScroll: true });
  });

  /* ----------------------------------------------------------------------
     Mobile navigation
     ---------------------------------------------------------------------- */
  const nav = $("#nav");
  const menuToggle = $("#menu-toggle");

  const setMenu = (open, returnFocus = false) => {
    if (!nav || !menuToggle) return;
    nav.classList.toggle("is-open", open);
    document.body.classList.toggle("nav-open", open);
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    if (open) {
      nav.querySelector("a")?.focus({ preventScroll: true });
    } else if (returnFocus) {
      menuToggle.focus();
    }
  };

  menuToggle?.addEventListener("click", () => {
    setMenu(menuToggle.getAttribute("aria-expanded") !== "true");
  });

  $$(".nav-link").forEach((link) => {
    link.addEventListener("click", () => setMenu(false));
  });

  $$(".nav-cta a").forEach((link) => {
    link.addEventListener("click", () => setMenu(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && nav?.classList.contains("is-open")) {
      setMenu(false, true);
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) setMenu(false);
  });

  /* ----------------------------------------------------------------------
     Scroll spy
     ---------------------------------------------------------------------- */
  const spyLinks = new Map();
  $$(".nav-link").forEach((link) => {
    const id = link.getAttribute("href");
    if (id && id.startsWith("#")) spyLinks.set(id.slice(1), link);
  });

  const spySections = ["about", "skills", "work", "contact"]
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  const setActiveLink = (id) => {
    spyLinks.forEach((link, key) => {
      const active = key === id;
      link.classList.toggle("is-active", active);
      if (active) {
        link.setAttribute("aria-current", "true");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };

  if ("IntersectionObserver" in window) {
    const spyObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveLink(entry.target.id);
        });
      },
      { rootMargin: "-42% 0px -52% 0px", threshold: 0 }
    );
    spySections.forEach((section) => spyObserver.observe(section));

    const heroObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) setActiveLink("");
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
    );
    const hero = $("#top");
    if (hero) heroObserver.observe(hero);
  }

  /* ----------------------------------------------------------------------
     Reveal on scroll
     ---------------------------------------------------------------------- */
  const revealEls = $$(".reveal");

  if (!("IntersectionObserver" in window) || reducedMotion.matches) {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    revealEls.forEach((el) => revealObserver.observe(el));
  }

  /* ----------------------------------------------------------------------
     Animated stat counters
     ---------------------------------------------------------------------- */
  const counters = $$("[data-count]");
  const statsBlock = $(".hero-stats");

  const runCounter = (el) => {
    const target = Number(el.dataset.count) || 0;
    if (reducedMotion.matches) {
      el.textContent = String(target);
      return;
    }
    const duration = 1400;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = String(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  if (statsBlock && counters.length) {
    if (!("IntersectionObserver" in window)) {
      counters.forEach(runCounter);
    } else {
      const statsObserver = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            counters.forEach(runCounter);
            statsObserver.disconnect();
          }
        },
        { threshold: 0.4 }
      );
      statsObserver.observe(statsBlock);
    }
  }

  /* ----------------------------------------------------------------------
     Footer year
     ---------------------------------------------------------------------- */
  const year = $("#year");
  if (year) year.textContent = String(new Date().getFullYear());

  /* ----------------------------------------------------------------------
     Placeholder links (replace the hrefs in index.html)
     ---------------------------------------------------------------------- */
  $$('a[href="#"]').forEach((link) => {
    link.addEventListener("click", (event) => event.preventDefault());
  });
})();
