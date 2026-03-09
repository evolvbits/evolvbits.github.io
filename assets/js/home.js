document.addEventListener("DOMContentLoaded", () => {
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
  } else {
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
  }

  const bitsLayer = document.querySelector("[data-bits-bg]");

  if (bitsLayer) {
    const bitCount = window.innerWidth < 992 ? 24 : 40;
    const bits = [];
    let targetX = window.innerWidth * 0.5;
    let targetY = window.innerHeight * 0.35;
    let leaderX = targetX;
    let leaderY = targetY;

    const random = (min, max) => Math.random() * (max - min) + min;

    for (let index = 0; index < bitCount; index += 1) {
      const bit = document.createElement("span");
      bit.className = "home-bit";

      const baseRadius = random(14, 86);
      const size = random(6, 14);
      const phase = random(0, Math.PI * 2);
      const speed = random(0.8, 2.4);
      const lag = random(0.08, 0.2);
      const wobble = random(0.4, 1.4);

      bit.style.setProperty("--bit-size", `${size.toFixed(2)}px`);
      bit.style.setProperty("--bit-opacity", random(0.25, 0.65).toFixed(2));
      bit.style.setProperty("--bit-rotate", `${random(0, 65).toFixed(2)}deg`);

      bitsLayer.appendChild(bit);

      bits.push({
        element: bit,
        x: targetX,
        y: targetY,
        phase,
        speed,
        lag,
        baseRadius,
        wobble,
      });
    }

    const animateBits = (time) => {
      const seconds = time * 0.001;
      leaderX += (targetX - leaderX) * 0.14;
      leaderY += (targetY - leaderY) * 0.14;

      for (let index = 0; index < bits.length; index += 1) {
        const bit = bits[index];
        const wave = seconds * bit.speed + bit.phase;
        const radiusX = bit.baseRadius * (1 + Math.sin(wave * 0.8) * 0.18);
        const radiusY = bit.baseRadius * 0.65 * bit.wobble;
        const targetBitX = leaderX + Math.cos(wave) * radiusX;
        const targetBitY = leaderY + Math.sin(wave * 1.15) * radiusY;

        bit.x += (targetBitX - bit.x) * bit.lag;
        bit.y += (targetBitY - bit.y) * bit.lag;

        bit.element.style.transform = `translate3d(${bit.x.toFixed(2)}px, ${bit.y.toFixed(2)}px, 0) rotate(${(wave * 30).toFixed(2)}deg)`;
      }

      window.requestAnimationFrame(animateBits);
    };

    if (!prefersReducedMotion) {
      window.addEventListener(
        "mousemove",
        (event) => {
          targetX = event.clientX;
          targetY = event.clientY;
        },
        { passive: true },
      );

      window.addEventListener("mouseleave", () => {
        targetX = window.innerWidth * 0.5;
        targetY = window.innerHeight * 0.35;
      });

      window.addEventListener("resize", () => {
        targetX = Math.min(targetX, window.innerWidth);
        targetY = Math.min(targetY, window.innerHeight);
      });

      window.requestAnimationFrame(animateBits);
    } else {
      for (let index = 0; index < bits.length; index += 1) {
        const bit = bits[index];
        const angle = (index / bits.length) * Math.PI * 2;
        const x = targetX + Math.cos(angle) * bit.baseRadius * 0.7;
        const y = targetY + Math.sin(angle) * bit.baseRadius * 0.45;
        bit.element.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
      }
    }
  }

  // Contact
  // const contactForm = document.getElementById("contactForm");
  // const contactStatus = document.getElementById("contactFormStatus");

  // if (contactForm) {
  //   contactForm.addEventListener("submit", (event) => {
  //     event.preventDefault();

  //     const emailTo = contactForm.dataset.contactEmail || "";
  //     const name = contactForm.name.value.trim();
  //     const email = contactForm.email.value.trim();
  //     const subject = contactForm.subject.value.trim();
  //     const message = contactForm.message.value.trim();

  //     if (!name || !email || !subject || !message || !emailTo) {
  //       if (contactStatus) {
  //         contactStatus.textContent =
  //           "Please complete all fields before sending.";
  //       }
  //       return;
  //     }

  //     const mailSubject = encodeURIComponent(`[EvolvBits] ${subject}`);
  //     const mailBody = encodeURIComponent(
  //       `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
  //     );

  //     if (contactStatus) {
  //       contactStatus.textContent = "Opening your email app...";
  //     }

  //     window.location.href = `mailto:${emailTo}?subject=${mailSubject}&body=${mailBody}`;
  //   });
  // }
});
