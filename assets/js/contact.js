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

  const formStart = Date.now();

  function showToast(message, type = "success") {
    const toastEl = document.getElementById("formToast");
    const toastMessage = document.getElementById("formToastMessage");
    toastMessage.textContent = message;
    // remove todas as cores possíveis
    toastEl.classList.remove(
      "text-bg-success",
      "text-bg-danger",
      "text-bg-warning",
      "text-bg-info",
      "text-bg-dark"
    );
    if (type === "success") {
      toastEl.classList.add("text-bg-success");
    } else {
      toastEl.classList.add("text-bg-danger");
    }
    const toast = new bootstrap.Toast(toastEl, {
      delay: 4000
    });
    toast.show();
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

    const formData = new FormData(form);
    formData.append("turnstileToken", token);
    // proteção tempo mínimo
    formData.append("form_duration", Date.now() - formStart);
    setFormDisabled(true);
    submitButton.textContent =
      "{{ contents.contact.message.status }}";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: formData
      });

      // de .text() para .json()
      const result = await response.json();

      // verifica a propriedade 'result' do objeto
      if (result.result === 'success') {
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
        // Exibe a mensagem de erro que veio do script ou a padrão
        showToast(
          result.debug || result.message || "{{ contents.contact.message.error.content }}",
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
