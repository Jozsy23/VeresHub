const SELECTORS = {
  reveal: "[data-reveal]",
  nav: "[data-elevate-on-scroll]",
  navToggle: ".nav__toggle",
  mobileMenu: "#mobileMenu",
  mobileLinks: ".mobile-menu__link, .mobile-menu__cta",
  auditForm: "#auditForm",
  formSuccess: "#formSuccess",
  langLinks: "[data-lang]",
};

function setAriaExpanded(el, expanded) {
  el.setAttribute("aria-expanded", expanded ? "true" : "false");
}

function setupMobileMenu() {
  const toggle = document.querySelector(SELECTORS.navToggle);
  const menu = document.querySelector(SELECTORS.mobileMenu);
  if (!toggle || !menu) return;

  function closeMenu() {
    menu.hidden = true;
    setAriaExpanded(toggle, false);
    toggle.setAttribute("aria-label", "Open menu");
  }

  function openMenu() {
    menu.hidden = false;
    setAriaExpanded(toggle, true);
    toggle.setAttribute("aria-label", "Close menu");
  }

  toggle.addEventListener("click", () => {
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    if (expanded) closeMenu();
    else openMenu();
  });

  menu.addEventListener("click", (e) => {
    const target = e.target;
    if (!(target instanceof Element)) return;
    if (target.matches(SELECTORS.mobileLinks)) closeMenu();
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 900) closeMenu();
  });
}

function setupReveal() {
  const nodes = document.querySelectorAll(SELECTORS.reveal);
  if (!nodes.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      }
    },
    { root: null, threshold: 0.12 }
  );

  nodes.forEach((n) => io.observe(n));
}

function setupNavElevation() {
  const nav = document.querySelector(SELECTORS.nav);
  if (!nav) return;

  const onScroll = () => {
    const y = window.scrollY || 0;
    nav.style.boxShadow = y > 8 ? "0 8px 24px rgba(0,0,0,0.5)" : "none";
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

function setupAuditForm() {
  const form = document.querySelector(SELECTORS.auditForm);
  const success = document.querySelector(SELECTORS.formSuccess);
  if (!form || !success) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const fd = new FormData(form);
    const payload = Object.fromEntries(fd.entries());

    // Placeholder behavior: show success state.
    // Hook up to your email/CRM endpoint later if needed.
    console.log("Audit request:", payload);

    success.hidden = false;
    form.querySelectorAll("input, button").forEach((el) => {
      el.disabled = true;
    });

    // Keep the success visible without jumping.
    success.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
}

function setupLanguagePreference() {
  const langLinks = document.querySelectorAll(SELECTORS.langLinks);
  if (!langLinks.length) return;

  const path = window.location.pathname;
  const isRomanianPage = path.endsWith("/ro.html");
  const currentLang = isRomanianPage ? "ro" : "en";

  try {
    localStorage.setItem("vh_lang", currentLang);
  } catch (e) {
    // ignore storage errors
  }

  langLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const lang = link.getAttribute("data-lang");
      if (!lang) return;
      try {
        localStorage.setItem("vh_lang", lang);
      } catch (e) {
        // ignore storage errors
      }
    });
  });
}

setupMobileMenu();
setupReveal();
setupNavElevation();
setupAuditForm();
setupLanguagePreference();

