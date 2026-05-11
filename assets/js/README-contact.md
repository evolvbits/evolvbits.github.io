# Activating the contact form


## Google Apps Script

### Using Cloudflare

If you want to use Cloudflare to protect the form submission, this is the script you should put in [Google Apps Script](https://script.google.com/):

> Note: You only need to change the constants "TO_ADDRESS", "SITE", "LOGO_URL" and "MINIMUM_MESSAGE".

```js
/**
 * GOOGLE APPS SCRIPT - HYBRID VERSION (RECAPTCHA & TURNSTYLE)
 * by William Canin
 */

const TO_ADDRESS = "william.costa.canin@gmail.com";
const SITE = "https://williamcanin.github.io";
const LOGO_URL = "https://raw.githubusercontent.com/williamcanin/williamcanin.github.io/refs/heads/main/assets/images/wcanin_dark.png";
const MINIMUM_MESSAGE = 50;

// Accessing script properties
const props = PropertiesService.getScriptProperties();

/**
 * HTML sanitization and Header Injection prevention
 */
function sanitize(str, isHeader = false) {
  if (!str) return "";
  let clean = str.trim();
  if (isHeader) clean = clean.replace(/[\r\n]/g, "");
  return clean.replace(/[&<>"']/g, function(m) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m];
  });
}

/**
 * Cloudflare Turnstile Validation
 */
function validateTurnstile(token) {
  if (!token) throw new Error("[Script]: Turnstile token missing.");
  const secret = props.getProperty("TURNSTILE_SECRET_KEY");

  const response = UrlFetchApp.fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "post",
    payload: { secret: secret, response: token }
  });

  const result = JSON.parse(response.getContentText());
  if (!result.success) throw new Error("[Script]: Turnstile validation failed.");
  return true;
}

/**
 * Google reCAPTCHA Validation
 */
function validateRecaptcha(token) {
  if (!token) throw new Error("[Script]: reCAPTCHA token missing.");
  const secret = props.getProperty("RECAPTCHA_SECRET_KEY");

  const response = UrlFetchApp.fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "post",
    payload: { secret: secret, response: token }
  });

  const result = JSON.parse(response.getContentText());
  if (!result.success) throw new Error("[Script]: reCAPTCHA failed.");
  return true;
}

/**
 * Main Function
 */
function doPost(e) {
  try {
    const contents = e.postData ? e.postData.contents : null;
    if (!contents) throw new Error("No data received");

    const data = JSON.parse(contents);

    // Identifies the token coming from the front-end (accepts both names)
    const token = data['g-recaptcha-response'] || data['turnstileToken'] || data['cf-turnstile-response'];

    let antiRobot = "Unknown";

    // Hybrid Logic: Validates according to the key present in the Script.
    if (props.getProperty('RECAPTCHA_SECRET_KEY')) {
      antiRobot = "Google reCAPTCHA";
      validateRecaptcha(token);
    } else if (props.getProperty('TURNSTILE_SECRET_KEY')) {
      validateTurnstile(token);
      antiRobot = "Cloudflare Turnstile";
    } else {
      throw new Error("No Captcha Secret Key configured in Script Properties.");
    }

    const name = sanitize(data.name, true);
    const email = sanitize(data.email, true);
    const message = data.message || "";
    const pageUrl = data.page_url ? sanitize(data.page_url, true) : SITE;
    const locationInfo = data.location_info || "Unknown";

    if (!name || !email || !message) throw new Error("[Script]: Missing form data.");
    if (message.length < MINIMUM_MESSAGE) throw new Error("[Script]: Message too short.");

    // Anti-Spam Rate Limit
    const lastSent = props.getProperty(`last_sent_${email}`);
    const now = Date.now();
    if (lastSent && (now - lastSent < 60000)) throw new Error("[Script]: Please wait 1 minute.");
    props.setProperty(`last_sent_${email}`, now.toString());

    // --- MESSAGE PROCESSING ---
    let escapedContent = sanitize(message);
    let codeBlocks = [];
    let placeholder = "___CODE_BLOCK_";

    let cleanMessage = escapedContent.replace(/```([\s\S]+?)```/g, function(match, code) {
      const id = codeBlocks.length;

      const codeHtml = `<pre style="background: #f6f8fa; color: #24292e; padding: 15px; border-radius: 6px; overflow-x: auto; font-family: 'Fira Code','Consolas',SFMono-Regular, SF Mono, Menlo, monospace; font-size: 15px; line-height: 1.85; border: 1px solid #d1d5da; border-bottom: 3px solid #a1a2a7; border-right: 1px solid #a1a2a7; border-top: 1px solid #a1a2a7; border-left: 1px solid #a1a2a7;">${code.trim()}</pre>`;

      codeBlocks.push(codeHtml);
      return placeholder + id + "___";
    });

    cleanMessage = cleanMessage.replace(/\n/g, '<br>');
    codeBlocks.forEach((block, index) => {
      cleanMessage = cleanMessage.replace(placeholder + index + "___", block);
    });

    const subject = `Message from: ${name} (${SITE})`;
    const htmlBody = `
    <div style="font-family: sans-serif; color: #333; max-width: 820px; border: 1px solid #eee; padding: 20px;">
      ${LOGO_URL ? `
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="${LOGO_URL}" alt="Logo" style="width: 150px; padding: 10px; border-radius: 50%; border: 1px solid #ddd;">
        </div>
      ` : ''}

      <h2 style="color: #333; border-bottom: 2px solid #333; padding-bottom: 10px;"></h2>

      <div style="margin-top: 20px;">
        <p><b>Name:</b> ${name}</p>
        <p><b>From:</b> <a href="mailto:${email}">${email}</a></p>
        <p><b>Message:</b></p>
        <div style="background: #fff; font-size: 15px; color: black; border: 1px solid transparent; padding: 15px; border-radius: 5px;">
          ${cleanMessage}
        </div>
      </div>

      <footer style="margin-top: 30px; font-size: 12px; color: #888; border-top: 1px solid #eee; padding-top: 10px;">
        This is an automated email sent by your form ${pageUrl} using ${antiRobot}/Google Script.<br>
        &copy; ${new Date().getFullYear()} ${SITE.replace('https://', '')} - ${new Date().toLocaleString('pt-BR')} - <b>${locationInfo}</b>
      </footer>
    </div>`;

    MailApp.sendEmail({ to: TO_ADDRESS, subject: subject, htmlBody: htmlBody, replyTo: email });

    return ContentService.createTextOutput(JSON.stringify({ 'result': 'success' })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ 'result': 'error', 'debug': err.message })).setMimeType(ContentService.MimeType.JSON);
  }
}
```

### Options

Execute as: I (example@email.com) / Eu (example@email.com)
Who can access it: Anyone / Qualquer pessoa
