// ─── Active-section tracking ─────────────────────────────────────────────────
function initActiveSections(linksSelector) {
  const links = [...document.querySelectorAll(linksSelector)];
  if (!links.length) return;

  const pairs = links
    .map((link) => ({
      link,
      el: document.getElementById(
        (link.getAttribute("href") || "").replace(/^#/, ""),
      ),
    }))
    .filter((p) => p.el);

  if (!pairs.length) return;

  const THRESHOLD = 150; // px from top of viewport

  function update() {
    let active = null;
    for (const { link, el } of pairs) {
      if (el.getBoundingClientRect().top <= THRESHOLD) {
        active = link;
      }
    }
    pairs.forEach(({ link }) => link.classList.remove("is-active"));
    if (active) active.classList.add("is-active");
  }

  window.addEventListener("scroll", update, { passive: true });
  update();
}

// Landing-page top-nav (icon buttons with href="#section")
initActiveSections(".topbar nav a");

// Docs sidebar TOC links
initActiveSections(".sidebar a");
// ─────────────────────────────────────────────────────────────────────────────

const revealEls = document.querySelectorAll(".reveal");
const parallaxEls = document.querySelectorAll("[data-parallax]");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  { threshold: 0.14 },
);

revealEls.forEach((el) => observer.observe(el));

let ticking = false;
const prefersReduced = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;
const isMobile = window.matchMedia("(max-width: 991.98px)").matches;
const disableParallax = prefersReduced || isMobile;

function onScroll() {
  if (disableParallax) return;
  if (ticking) return;

  window.requestAnimationFrame(() => {
    const y = window.scrollY;
    parallaxEls.forEach((el) => {
      const ratio = Number(el.dataset.parallax || 0.16);
      const movement = y * ratio;
      el.style.transform = `translate3d(0, ${movement}px, 0)`;
    });
    ticking = false;
  });

  ticking = true;
}

if (!disableParallax) {
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
} else {
  parallaxEls.forEach((el) => {
    el.style.transform = "translate3d(0, 0, 0)";
  });
}

// VIDEO CAROUSEL
const players = document.querySelectorAll(".video-player");

players.forEach((player) => {

  const button = player.querySelector(".video-play");
  const videoSrc = player.dataset.video;
  const type = player.dataset.type || "mp4";

  button.addEventListener("click", () => {

    if (player.classList.contains("playing")) return;

    player.classList.add("playing");

    let element;

    if (type === "youtube") {

      element = document.createElement("iframe");
      element.src = `https://www.youtube.com/embed/${videoSrc}?autoplay=1&rel=0`;
      element.allow =
        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
      element.allowFullscreen = true;

    } else {

      element = document.createElement("video");
      element.src = videoSrc;
      element.controls = true;
      element.autoplay = true;
      element.playsInline = true;
      element.preload = "metadata";

    }

    player.appendChild(element);

  });

});
