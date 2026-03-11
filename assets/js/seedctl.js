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

function onScroll() {
  if (prefersReduced) return;
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

window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

const lazyVideo = document.querySelector(".video-lazy");
if (lazyVideo) {
  const playBtn = lazyVideo.querySelector(".video-play");
  const videoUrl =
    lazyVideo.dataset.videoUrl || "https://www.w3schools.com/html/mov_bbb.mp4";

  playBtn?.addEventListener("click", () => {
    const video = document.createElement("video");
    video.src = videoUrl;
    video.controls = true;
    video.autoplay = true;
    video.playsInline = true;
    video.preload = "metadata";
    video.setAttribute("aria-label", "SeedCTL walkthrough video");
    video.style.width = "100%";
    video.style.height = "100%";
    video.style.objectFit = "cover";

    lazyVideo.innerHTML = "";
    lazyVideo.appendChild(video);
  });
}

const carousels = document.querySelectorAll("[data-carousel]");
carousels.forEach((carousel) => {
  const items = [...carousel.querySelectorAll("[data-carousel-item]")];
  if (!items.length) return;

  const controls = carousel.parentElement?.querySelector(
    ".cli-carousel-controls",
  );
  const prevBtn = controls?.querySelector("[data-carousel-prev]");
  const nextBtn = controls?.querySelector("[data-carousel-next]");

  let index = 0;

  const scrollToIndex = (nextIndex) => {
    index = (nextIndex + items.length) % items.length;
    items[index].scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start",
    });
  };

  const updateIndexFromScroll = () => {
    const containerLeft = carousel.getBoundingClientRect().left;
    let bestIndex = 0;
    let bestOffset = Number.POSITIVE_INFINITY;

    items.forEach((item, i) => {
      const offset = Math.abs(
        item.getBoundingClientRect().left - containerLeft,
      );
      if (offset < bestOffset) {
        bestOffset = offset;
        bestIndex = i;
      }
    });

    index = bestIndex;
  };

  prevBtn?.addEventListener("click", () => scrollToIndex(index - 1));
  nextBtn?.addEventListener("click", () => scrollToIndex(index + 1));
  carousel.addEventListener("scroll", updateIndexFromScroll, {
    passive: true,
  });
  updateIndexFromScroll();
});
