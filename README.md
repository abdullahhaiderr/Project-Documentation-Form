# Creative Haider — Project Brief

A premium, single-file client requirements wizard. A prospective client completes a
multi-step brief; the studio receives the answers by email together with a branded
PDF document, and the client can download their own copy.

The whole application is one self-contained `index.html` (about 228 KB). No build
step, database, framework or server is required to use it.

---

## Files

| File | What it is |
|---|---|
| `index.html` | **The deliverable.** Open or host this one file. Everything is inline: CSS, JavaScript, the question set and the studio logo. |
| `docs/email-setup.md` | How to make the emailed document arrive reliably, with the two supported routes, exact steps and a copy-paste Google Apps Script. |
| `docs/client-requirements-prompt.md` | Ready-to-send client email and WhatsApp message, a plain-language requirements prompt by project type, and an AI scoping prompt. |
| `docs/sample-brief.pdf` | An example of the PDF the studio receives (generated from the demo answers). |
| `src/` | Readable source parts: `style.css`, `body.html`, `app.js`, `data-model.js`, the logo. |
| `build.py` | Rebuilds `index.html` from `src/`. |
| `tests/` | Optional headless-browser checks used to verify this build. Not needed to use the brief. |

---

## Quick start

Double-click `index.html`, or host it anywhere static (Netlify, Vercel, GitHub Pages,
cPanel, S3). It works on desktop and mobile.

When opened as a local file, the page can generate and download the PDF but cannot
send email from the browser. For automatic delivery from a local file, do section B
below. On a hosted URL, FormSubmit handles it after a one-time activation.

---

## Make the email arrive

Both routes are documented in detail, with limits and sources, in
[`docs/email-setup.md`](docs/email-setup.md). The short version:

### A. Hosted page + FormSubmit (no account, about 2 minutes)

1. Upload `index.html` to any static host and open the public `https://` URL.
2. Complete the brief once and submit it.
3. FormSubmit sends a **one-time activation email** to
   `contact.abdullahhaider@gmail.com`. Click the link inside it.
4. Submit again to confirm the message and the PDF attachment arrive.

Until activation is confirmed, the page cannot guarantee delivery. Test before
sending the link to a client.

### B. Local file, or a guaranteed PDF attachment: Google Apps Script (about 10 minutes)

This is the more reliable route: it sends a real PDF attachment, works from a
`file://` page, and can never mail anyone other than the studio (the recipient is
hard-coded). It is free with a Gmail account.

1. Follow section 5 of [`docs/email-setup.md`](docs/email-setup.md) to create and
   deploy the script (it includes the full `Code.gs` file and deployment steps).
2. Copy the deployment URL (it ends in `/exec`) and the shared secret into the config
   block in `index.html`:

```js
var CFG = {
  studio: "Creative Haider",
  email: "contact.abdullahhaider@gmail.com",
  delivery: "auto",                       // auto | formsubmit | apps-script | manual
  appsScriptUrl: "https://script.google.com/macros/s/PASTE_DEPLOYMENT_ID/exec",
  appsScriptSecret: "PASTE_A_LONG_RANDOM_SECRET",  // must match SHARED_SECRET
  pdfCdn: "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"
};
```

With `appsScriptUrl` set, the page uses it automatically, including when opened from
disk. Leave it empty to use FormSubmit on hosted pages and the download-and-email
fallback elsewhere.

### Delivery behaviour

| Page opened from | `appsScriptUrl` empty | `appsScriptUrl` set |
|---|---|---|
| Hosted `https://` page | FormSubmit (best effort), then download + email fallback | Apps Script |
| Local `file://` page | Complete screen with PDF download and an `mailto:` link | Apps Script |

Nothing is ever lost: before sending, the PDF is built in the browser. If delivery
fails, the page keeps the answers on the device, offers the PDF download and an email
link, and offers to try again.

---

## Editing the questions

The question set lives in `src/data-model.js`, and the wording hints and
placeholders are at the top of `src/app.js`.

- Each section is `{ n: name, t: title, i: intro, w: [service indexes], q: [...] }`.
- Each question is `[key, label, type, options, required]`, where `type` is one of
  `t` text, `a` long text, `e` email, `p` phone, `d` date, `r` one choice,
  `c` many choices, `P` palette picker.
- `w` hides a section unless one of the selected services matches. The service list
  is `SV` in `src/data-model.js`.
- **Question keys must be unique across all sections.** `build.py` refuses to build
  if two questions share a key, because answers would overwrite each other.

After editing, rebuild:

```bash
python build.py          # from this folder
```

---

## What the client experiences

1. **Welcome** — what the brief is for, time estimate (calculated from the question
   count), autosave and privacy notes.
2. **Adaptive steps** — sections appear only for the services the client chooses.
   Answers autosave to the browser (per device), so the client can leave and return.
3. **Helpful details** — hints under selected questions, character counters,
   palette picker with real swatches, inline validation with an error summary,
   keyboard support (`Ctrl`/`Cmd` + `Enter` to continue), reduced-motion support.
4. **Review** — every answer grouped by section with an edit link, a consent
   checkbox, and a clear explanation of where the answers go.
5. **Completion** — reference number, honest delivery status, PDF download, next
   steps, and the option to start another brief.

On desktop the progress ring, section list and autosave state stay visible in the
left rail. On mobile the same information becomes a sticky top bar.

---

## The emailed document

The PDF is generated in the browser with jsPDF: A4, studio wordmark on a dark header,
gold rules, contact summary panel, answers grouped by section, an "Still to confirm"
list for unanswered questions, page numbers and a reference number. If the PDF library
cannot load (offline), the page falls back to a text copy and still sends the answers
in the email body.

---

## Notes and limits

- **Local storage only.** Answers are saved in the client's browser, never uploaded
  until they press send. "Start over" clears them.
- **Question model.** The brief asks 28 questions for a minimal website project and up
  to 104 when several services are selected; the estimate on the welcome screen is
  derived from that total.
- **FormSubmit attachments** are officially documented for native multipart posts,
  not the AJAX endpoint. The page sends the full answers in the email body as well, so
  no information is lost if an attachment is dropped. Apps Script is the reliable
  attachment route.
- **Apps Script limits:** 25 MB total attachments per message, 200 KB email body and
  100 recipients/day on free Gmail. The page must send a PDF small enough for these
  limits; the script rejects anything over 8 MB.
- **No analytics, cookies or third-party trackers.** The only external requests are
  Google Fonts and the jsPDF CDN.
- **Privacy:** the page is marked `noindex`.

---

## Verification performed on this build

Run in headless Edge via the Chrome DevTools Protocol (`tests/cdp_check.js`):

- All screens rendered with no page exceptions: welcome, step, services, palette,
  full-page review, manual delivery screen, and simulated successful delivery.
- Responsive at 1440 px and 390 px (mobile emulation, 2× device pixel ratio).
- PDF generated from the demo brief: **8 pages, 253 KB**, with the studio wordmark,
  contact panel, every section, "Still to confirm", footer and reference present and
  properly paginated (`tests/check_pdf.py` validates the decompressed PDF streams).
- HTML structure checks: one inline stylesheet, one inline script, one logo payload,
  no leftover build placeholders (`tests/make_assets.py`).
# Project-Documentation-Form
