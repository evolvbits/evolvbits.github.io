---
---

{%- include assign.liquid -%}

document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("contactForm");

  const endpoint = "{{ contents.contact.google.app_web }}";

  form.addEventListener("submit", async (e) => {

    e.preventDefault();

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