---
---

{%- include assign.liquid -%}

document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("contactForm");
  const endpoint = "{{ contents.contact.google.app_web }}";

  const inputName = document.getElementById("inputName");
  const inputEmail = document.getElementById("inputEmail");
  const textarea = document.getElementById("textMessage");

  const counter = document.getElementById("messageCounter");
  const progressBar = document.getElementById("messageProgressBar");
  const submitButton = document.getElementById("submitButton");

  const MIN_CHARS = {{ contents.contact.message.characters.min }};

  function showToast(message, type = "success") {

    const toast = document.getElementById("formToast");
    const toastMessage = document.getElementById("formToastMessage");

    toastMessage.textContent = message;

    toast.classList.remove("success", "error");
    toast.classList.add(type);
    toast.classList.add("show");

    setTimeout(() => {
      toast.classList.remove("show");
    }, 4000);

  }

  function setFormDisabled(state) {

    inputName.disabled = state;
    inputEmail.disabled = state;
    textarea.disabled = state;

    if (state) {
      submitButton.disabled = true;
    } else {
      updateUI();
    }

  }

  function updateUI() {

    const length = textarea.value.trim().length;
    const remaining = Math.max(MIN_CHARS - length, 0);
    const progress = Math.min(length / MIN_CHARS * 100, 100);

    counter.textContent =
      `Minimum ${MIN_CHARS} characters (${remaining} remaining)`;
    progressBar.style.width = progress + "%";
    submitButton.disabled = length < MIN_CHARS;

  }

  textarea.addEventListener("input", updateUI);
  updateUI();

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const message = textarea.value.trim();

    if (message.length < MIN_CHARS) {
      showToast(
        `Message must contain at least ${MIN_CHARS} characters.`,
        "error"
      );
      return;
    }

    const token =
      document.querySelector('[name="cf-turnstile-response"]').value;

    if (!token) {
      showToast("Verify captcha", "error");
      return;
    }

    // 🔹 CRIA FormData antes de desabilitar campos
    const formData = new FormData(form);
    formData.append("turnstileToken", token);
    setFormDisabled(true);
    submitButton.textContent =
      "{{ contents.contact.message.status }}";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: formData
      });

      const text = await response.text();

      if (text === "success") {
        showToast(
          "{{ contents.contact.message.success.content }}",
          "success"
        );
        form.reset();
        updateUI();

        if (window.turnstile) {
          turnstile.reset();
        }

      } else {

        showToast(
          text ||
          "{{ contents.contact.message.error.content }}",
          "error"
        );

      }

    } catch (err) {
      console.error(err);
      showToast(
        "{{ contents.contact.message.network.error }}",
        "error"
      );
    } finally {
      setFormDisabled(false);
      submitButton.textContent =
        "{{ contents.contact.button.text }}";
      updateUI();
    }
  });
});