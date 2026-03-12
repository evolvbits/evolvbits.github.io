---
---

{%- include assign.liquid -%}

document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("contactForm");
  const endpoint = "{{ contents.contact.google.app_web }}";

  const textarea = document.getElementById("textMessage");
  const counter = document.getElementById("messageCounter");

  const MIN_CHARS = 50;

  function updateCounter() {

    const length = textarea.value.trim().length;

    const remaining = Math.max(MIN_CHARS - length, 0);

    counter.textContent =
      `Minimum ${MIN_CHARS} characters (${remaining} remaining)`;

  }

  textarea.addEventListener("input", updateCounter);

  updateCounter();


  form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const message = textarea.value.trim();

    if (message.length < MIN_CHARS) {
      alert(`Message must contain at least ${MIN_CHARS} characters.`);
      return;
    }

    const token =
      document.querySelector('[name="cf-turnstile-response"]').value;

    if (!token) {
      alert("Verify captcha");
      return;
    }

    const formData = new FormData(form);

    formData.append("turnstileToken", token);

    try {

      const response = await fetch(endpoint, {
        method: "POST",
        body: formData
      });

      const text = await response.text();

      if (text === "success") {

        alert("Message sent!");

        form.reset();

        updateCounter();

        if (window.turnstile) {
          turnstile.reset();
        }

      } else {

        alert(text || "Error sending message");

      }

    } catch (err) {

      console.error(err);

      alert("Network error");

    }

  });

});