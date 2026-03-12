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
class VideoPlayer extends HTMLElement {
  connectedCallback() {
    const video = this.dataset.video;
    const thumb = this.dataset.thumb;
    const label = this.dataset.label || "Play video";
    const buttonText = this.dataset.button || "Play";

    this.innerHTML = `
      <div class="video-wrapper">

        <div class="video-skeleton"></div>

        <img
          class="video-thumb"
          src="${thumb}"
          alt="${label}"
          loading="lazy"
          decoding="async"
        >

        <button class="video-play" aria-label="${label}">
          <div class="button-play-wrapper">
            <span class="video-play-icon"></span>
            <span class="video-play-text">${buttonText}</span>
          </div>
        </button>

      </div>
    `;

    const wrapper = this.querySelector(".video-wrapper");
    const button = this.querySelector(".video-play");
    const skeleton = this.querySelector(".video-skeleton");
    const thumbImg = this.querySelector(".video-thumb");

    const hideOverlay = () => {
      if (skeleton && skeleton.isConnected) skeleton.remove();
    };

    if (thumbImg) {
      thumbImg.addEventListener("load", hideOverlay, { once: true });
      thumbImg.addEventListener("error", hideOverlay, { once: true });
      if (thumbImg.complete) hideOverlay();
    }

    const createPlayer = () => {
      if (wrapper.classList.contains("playing")) return;

      wrapper.classList.add("playing");
      hideOverlay();

      let element;

      if (video.includes("youtube") || video.includes("youtu.be")) {
        const id =
          video.split("v=")[1]?.split("&")[0] || video.split("/").pop();

        element = document.createElement("iframe");

        element.src = `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;

        element.allow =
          "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";

        element.allowFullscreen = true;

        element.addEventListener("load", hideOverlay, { once: true });
      } else {
        element = document.createElement("video");

        element.src = video;
        element.controls = true;
        element.autoplay = true;
        element.playsInline = true;
        element.preload = "metadata";

        element.addEventListener("loadeddata", hideOverlay, { once: true });
      }

      wrapper.appendChild(element);
    };

    button.addEventListener("click", createPlayer);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            const vid = wrapper.querySelector("video");

            if (vid) vid.pause();
          }
        });
      },
      { threshold: 0.1 },
    );

    observer.observe(wrapper);
  }
}

customElements.define("video-player", VideoPlayer);
