document.addEventListener("DOMContentLoaded", () => {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  const isMobile = window.matchMedia("(max-width: 991.98px)").matches;
  const connection =
    navigator.connection ||
    navigator.mozConnection ||
    navigator.webkitConnection;
  const saveData = Boolean(connection?.saveData);
  const slowNetwork = ["slow-2g", "2g", "3g"].includes(
    connection?.effectiveType || "",
  );
  const lowCpu = Boolean(
    navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4,
  );
  const lowMem = Boolean(navigator.deviceMemory && navigator.deviceMemory <= 4);
  const reduceEffects =
    prefersReducedMotion ||
    isMobile ||
    saveData ||
    slowNetwork ||
    lowCpu ||
    lowMem;

  if (reduceEffects) {
    document.body.classList.add("effects-lite");
  }

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
  const cubeCluster = document.querySelector("[data-cube-cluster]");

  if (bitsLayer && !reduceEffects) {
    const bitCount = window.innerWidth < 1200 ? 20 : 32;
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

    let animationFrameId = null;

    const animateBits = (time) => {
      if (document.hidden) {
        animationFrameId = null;
        return;
      }
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

      animationFrameId = window.requestAnimationFrame(animateBits);
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

      animationFrameId = window.requestAnimationFrame(animateBits);

      document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
          if (animationFrameId) {
            window.cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
          }
          return;
        }

        if (!animationFrameId) {
          animationFrameId = window.requestAnimationFrame(animateBits);
        }
      });
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

  if (cubeCluster && !reduceEffects) {
    let scrollFrame = null;
    let latestScrollY = window.scrollY || 0;

    const renderClusterParallax = () => {
      const offsetY = latestScrollY * 0.12;
      const rotate = latestScrollY * 0.006;
      cubeCluster.style.transform = `translate3d(0, ${offsetY.toFixed(2)}px, 0) rotate(${rotate.toFixed(2)}deg)`;
      scrollFrame = null;
    };

    const scheduleClusterParallax = () => {
      if (scrollFrame !== null) {
        return;
      }

      scrollFrame = window.requestAnimationFrame(renderClusterParallax);
    };

    window.addEventListener(
      "scroll",
      () => {
        latestScrollY = window.scrollY || 0;
        scheduleClusterParallax();
      },
      { passive: true },
    );

    renderClusterParallax();
  }
  if (bitsLayer && reduceEffects) {
    bitsLayer.style.display = "none";
  }

});
