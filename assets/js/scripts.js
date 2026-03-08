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
