document.addEventListener("DOMContentLoaded", () => {

  //  PRELOADER
  const preloader = document.getElementById("preloader");

  setTimeout(() => {
    preloader.classList.add("hide");
  }, 300);


  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  let revealElements = Array.from(document.querySelectorAll("[data-reveal]"));

  if (!revealElements.length) {
    const fallback = document.querySelectorAll(
      "main section, .legal-card, .legal-context__article",
    );
    fallback.forEach((element) => element.setAttribute("data-reveal", ""));
    revealElements = Array.from(document.querySelectorAll("[data-reveal]"));
  }

  revealElements.forEach((element, index) => {
    const delay = Math.min(index * 45, 240);
    element.style.setProperty("--reveal-delay", `${delay}ms`);
  });

  if (prefersReducedMotion) {
    revealElements.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  document.body.classList.add("reveal-ready");

  const observer = new IntersectionObserver(
    (entries, instance) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          instance.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -8% 0px",
    },
  );

  revealElements.forEach((element) => observer.observe(element));

  const contactForm = document.getElementById("contactForm");
  const contactStatus = document.getElementById("contactFormStatus");

  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const emailTo = contactForm.dataset.contactEmail || "";
      const name = contactForm.name.value.trim();
      const email = contactForm.email.value.trim();
      const subject = contactForm.subject.value.trim();
      const message = contactForm.message.value.trim();

      if (!name || !email || !subject || !message || !emailTo) {
        if (contactStatus) {
          contactStatus.textContent =
            "Please complete all fields before sending.";
        }
        return;
      }

      const mailSubject = encodeURIComponent(`[EvolvBits] ${subject}`);
      const mailBody = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      );

      if (contactStatus) {
        contactStatus.textContent = "Opening your email app...";
      }

      window.location.href = `mailto:${emailTo}?subject=${mailSubject}&body=${mailBody}`;
    });
  }
});


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
