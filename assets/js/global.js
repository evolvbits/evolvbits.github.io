document.addEventListener("DOMContentLoaded", () => {
  //  PRELOADER
  const preloader = document.getElementById("preloader");

  setTimeout(() => {
    preloader.classList.add("hide");
  }, 300);

  const normalizePath = (value) => (value || "/").replace(/\/+$/, "") || "/";

  const initScrollSpyLinks = (selector, offset = 140) => {
    const links = [...document.querySelectorAll(selector)];
    if (!links.length) return;

    const pairs = links
      .map((link) => {
        const href = link.getAttribute("href") || "";
        let url;

        try {
          url = new URL(href, window.location.origin);
        } catch (error) {
          return null;
        }

        const samePage =
          normalizePath(url.pathname) ===
          normalizePath(window.location.pathname);
        if (!samePage || !url.hash) return null;

        const id = url.hash.replace(/^#/, "");
        const el = document.getElementById(id);
        if (!el) return null;

        return { link, el };
      })
      .filter(Boolean);

    if (!pairs.length) return;

    const update = () => {
      let active = null;
      for (const { link, el } of pairs) {
        if (el.getBoundingClientRect().top <= offset) {
          active = link;
        }
      }

      pairs.forEach(({ link }) => link.classList.remove("is-active"));
      if (active) active.classList.add("is-active");
    };

    window.addEventListener("scroll", update, { passive: true });
    update();
  };

  initScrollSpyLinks(".nav-right a");

  const menuBtn = document.querySelector(".menu-btn");
  const offcanvasEl = document.getElementById("ebMenu");
  const menuIcon = menuBtn?.querySelector("i");

  if (menuBtn && offcanvasEl && menuIcon) {
    offcanvasEl.addEventListener("show.bs.offcanvas", () => {
      menuBtn.classList.add("is-open");
      menuIcon.classList.remove("bi-list");
      menuIcon.classList.add("bi-x-lg");
    });

    offcanvasEl.addEventListener("hidden.bs.offcanvas", () => {
      menuBtn.classList.remove("is-open");
      menuIcon.classList.remove("bi-x-lg");
      menuIcon.classList.add("bi-list");
    });

    offcanvasEl.addEventListener("click", (event) => {
      const targetLink = event.target.closest("a");
      if (!targetLink) return;

      const instance = window.bootstrap?.Offcanvas.getInstance(offcanvasEl);
      instance?.hide();
    });
  }
});
