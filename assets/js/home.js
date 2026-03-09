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
    const bitCount = window.innerWidth < 992 ? 22 : 34;
    const bitElements = [];
    const motionData = [];
    let pointerX = 0;
    let pointerY = 0;
    let frameId = null;

    const random = (min, max) => Math.random() * (max - min) + min;

    for (let index = 0; index < bitCount; index += 1) {
      const bit = document.createElement("span");
      bit.className = "home-bit";

      const size = random(8, 18);
      const speed = random(8, 40);
      const rotate = random(0, 45);
      const opacity = random(0.1, 0.45);
      const floatDuration = random(5.8, 11.5);
      const floatDelay = random(0, 4);
      const floatDistance = random(-7, 9);

      bit.style.setProperty("--bit-left", `${random(2, 98)}%`);
      bit.style.setProperty("--bit-top", `${random(3, 97)}%`);
      bit.style.setProperty("--bit-size", `${size.toFixed(2)}px`);
      bit.style.setProperty("--bit-opacity", opacity.toFixed(2));
      bit.style.setProperty("--bit-rotate", `${rotate.toFixed(2)}deg`);
      bit.style.setProperty(
        "--bit-float-duration",
        `${floatDuration.toFixed(2)}s`,
      );
      bit.style.setProperty("--bit-float-delay", `${floatDelay.toFixed(2)}s`);
      bit.style.setProperty(
        "--bit-float-distance",
        `${floatDistance.toFixed(2)}px`,
      );

      bitElements.push(bit);
      motionData.push({ speedX: speed, speedY: speed * random(0.5, 1.1) });
      bitsLayer.appendChild(bit);
    }

    const updateBitTransforms = () => {
      for (let index = 0; index < bitElements.length; index += 1) {
        const bit = bitElements[index];
        const motion = motionData[index];

        bit.style.setProperty(
          "--bit-offset-x",
          `${(pointerX * motion.speedX).toFixed(2)}px`,
        );
        bit.style.setProperty(
          "--bit-offset-y",
          `${(pointerY * motion.speedY).toFixed(2)}px`,
        );
      }

      frameId = null;
    };

    const scheduleUpdate = () => {
      if (frameId !== null) {
        return;
      }

      frameId = window.requestAnimationFrame(updateBitTransforms);
    };

    if (!prefersReducedMotion) {
      window.addEventListener(
        "mousemove",
        (event) => {
          pointerX = event.clientX / window.innerWidth - 0.5;
          pointerY = event.clientY / window.innerHeight - 0.5;
          scheduleUpdate();
        },
        { passive: true },
      );

      window.addEventListener("mouseleave", () => {
        pointerX = 0;
        pointerY = 0;
        scheduleUpdate();
      });
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
