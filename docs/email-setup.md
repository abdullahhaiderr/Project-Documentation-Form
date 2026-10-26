# Email delivery for the Creative Haider Project Brief

How to get a completed brief, including the branded PDF, into
`contact.abdullahhaider@gmail.com` from a single static HTML file, with no server to
maintain and no paid infrastructure if it can be avoided.

All provider facts below were checked against the providers' own documentation on
26 October 2026. Where something could not be confirmed, it is marked
**unverified - test before relying on it**. Nothing in this document is a guess about
a limit or a feature; if a provider does not document something, that is said
explicitly.

---

## 1. Short answer

| | Recommendation | Why |
|---|---|---|
| **#1** | **Google Apps Script web app**, deployed by the studio owner | Free. Sends a real PDF attachment and the answers in the email body. Works from both `https://` and `file://` pages. The recipient address is hard-coded in the script, so a leaked URL cannot be used to email anyone else. Only the owner's Google account is involved. |
| **#2** | **FormSubmit.co**, native multipart form POST (hosted pages only) | Zero signup, genuinely free, 10 MB attachment limit. But FormSubmit officially refuses pages opened as local HTML files, and its AJAX endpoint is not documented for file uploads. Use only when the page is hosted and #1 is impossible. |

The page now contains two transports: FormSubmit AJAX + `FormData` (the original
route) and an optional Apps Script route. The FormSubmit path is **not a reliable
attachment path**: see section 3.

**Hard limits at a glance** (details and sources in section 4):

- Apps Script: 25 MB total attachments per message, 200 KB email body, 100 email
  recipients/day on free Gmail, 6 minutes per script execution.
- FormSubmit: 10 MB combined attachments per submission, no file storage.
- The config in this document caps the PDF at 8 MB, well below both.

---

## 2. The constraint that decides the design

The page is one self-contained HTML file, opened either from disk (`file://`) or from
a static host. It has no backend, and the studio does not want to maintain one.

Consequences:

- A `<form action="...">` POST that navigates away is possible, but it loses the
  page state and the branded "thank you" step. It also fails from `file://` on at
  least one provider (FormSubmit).
- `fetch()` to a third-party endpoint works from a hosted page (CORS), but from
  `file://` the browser sends `Origin: null`. A simple request (no custom headers,
  no preflight) is still sent; a request that triggers a CORS preflight can fail
  before it is ever sent.
- Therefore the safest transport is a **simple request**: `POST` with
  `Content-Type: text/plain`, body = JSON string, `mode: 'no-cors'` when the
  endpoint does not return readable CORS headers. The email is the confirmation,
  not the HTTP response.

The Apps Script approach in section 5 is built exactly around that constraint.

---

## 3. FormSubmit.co: what the official documentation actually says

Sources: [FormSubmit documentation](https://formsubmit.co/documentation),
[AJAX documentation](https://formsubmit.co/ajax-documentation),
[Help/FAQ](https://formsubmit.co/help),
[API documentation](https://formsubmit.co/api-documentation).

| Question | Official answer | Notes |
|---|---|---|
| AJAX / JSON submission? | **Yes.** `POST https://formsubmit.co/ajax/you@example.com`, docs say it "works cross-origin" and show fetch, Axios and jQuery examples with a JSON body. | [AJAX documentation](https://formsubmit.co/ajax-documentation) |
| File attachments? | **Yes**, through a **normal multipart form POST**: set `enctype="multipart/form-data"` and add an `<input type="file" name="...">`. | [Documentation - File uploads](https://formsubmit.co/documentation) |
| Attachment size limit | **10 MB combined** across all file inputs in one submission. Per-file limit and allowed file types are not documented. | [Documentation](https://formsubmit.co/documentation). A third-party guide records that the limit was 5 MB until early 2026: [splitforms](https://splitforms.com/blog/formsubmit-file-uploads-attachments). |
| Are files stored? | **No.** "Uploaded files won't retain or can't access through the API." Text submissions are kept 30 days, readable through the API up to 5 times a day. | [Documentation - API](https://formsubmit.co/api-documentation) |
| Activation | **First submission triggers a confirmation email.** Submissions made before confirmation are delivered after confirming, but uploaded files from before activation are not kept. | [Documentation](https://formsubmit.co/documentation), [Help](https://formsubmit.co/help) |
| Cost / limits | Free, no registration, unlimited forms and submissions. | [Documentation](https://formsubmit.co/documentation) |
| Does it work from `file://`? | **No, not officially.** Help: "Make sure you open this page through a web server, FormSubmit will not work in pages browsed as HTML files." The listed workaround is a hidden `_url` field with the real page URL. | [Help](https://formsubmit.co/help). Whether `_url` fully fixes a `file://` AJAX submission is **unverified**. |
| AJAX + file attachment together? | **Not documented.** Every AJAX example sends JSON; the file-upload example is a native form POST. No official page shows a file going to `/ajax/`. | A third-party guide says the AJAX endpoint with files is undocumented and must be tested: [splitforms](https://splitforms.com/blog/formsubmit-file-uploads-attachments). |
| Autoresponse | Works for native form posts, **not** for AJAX submissions. | [Documentation](https://formsubmit.co/documentation) |
| Spam | reCAPTCHA is on by default. Help recommends checking the spam folder; FormSubmit emails are sometimes filtered. | [Help](https://formsubmit.co/help) |

**CORS observed in practice:** an `OPTIONS` request to
`https://formsubmit.co/ajax/contact.abdullahhaider@gmail.com` with
`Origin: null` returned `200` with `Access-Control-Allow-Origin: *` and
`Allow: POST` (tested 26 October 2026). So a cross-origin AJAX request is
permitted by the browser; the open question is whether the server accepts a
multipart body on the AJAX endpoint, which is not documented.

**Conclusion about the current code.** Posting `FormData` with the PDF to
`https://formsubmit.co/ajax/contact.abdullahhaider@gmail.com` is outside what
FormSubmit documents. It may deliver the text fields and silently drop the
attachment. Do not treat it as the primary path. If FormSubmit is used at all,
send a native multipart POST (section 6).

---

## 4. Zero-backend options compared

Only options that can deliver to a normal Gmail inbox without running a server are
included. "Setup steps" counts the actions a non-developer must take by hand.

### 4.1 Can it deliver a real attachment, and what does it cost?

| Provider | Real PDF attached to the email? | Free tier | Attachment limit | Paid step needed? |
|---|---|---|---|---|
| **Google Apps Script** (web app) | **Yes** - `MailApp.sendEmail({attachments:[...]})` | Yes, free with a Gmail account | 25 MB total per message; 250 attachments per message ([quotas](https://developers.google.com/apps-script/guides/services/quotas)) | No |
| **FormSubmit** | **Yes**, via native multipart POST | Yes, unlimited submissions | 10 MB combined | No |
| **Web3Forms** | **Yes**, but only on Pro | 250 submissions/month | Default HTML5 uploader: one file up to 5 MB. Larger/multiple files need the "Advanced File Uploader", whose limit is not stated on the page (**unverified**) | **Yes** - file attachments are a Pro feature, $12/month ([pricing](https://web3forms.com/pricing), [file attachments docs](https://docs.web3forms.com/getting-started/pro-features/file-attachments)) |
| **EmailJS** | **Yes**, but only on paid plans | 200 requests/month, requests up to 50 KB, 2 templates | Personal $9/month: 500 KB; Professional $15/month: 2 MB; Business $40/month: 30 MB. Free plan shows "-" for attachment size ([pricing](https://www.emailjs.com/pricing/)) | **Yes** - free tier has no attachments ([attachments docs](https://www.emailjs.com/docs/user-guide/file-attachments/)) |
| **Formspree** | **No - files are stored and emailed as links.** Docs: "No files will be sent directly by email." | 50 submissions/month, file uploads 0 GB | Paid plans: 10 files per submission, 25 MB each, 100 MB request ([file uploads](https://help.formspree.io/articles/building-your-form/file-uploads.md), [limits](https://help.formspree.io/articles/account-management/account-limits.md)) | **Yes** - Personal from $15/month, or $10/month billed annually ([plans](https://formspree.io/plans)) |
| **Formcarry** | Paid only; files are shown in the dashboard, whether they are attached to the notification email is not stated (**unverified**) | 50 submissions/month | 10 MB per file, paid plans only ([docs](https://formcarry.com/docs/features/file-uploads)) | **Yes** |

### 4.2 Setup effort, protocol behaviour and caveats

| Provider | Setup steps | Works from `file://`? | AJAX / CORS | Activation, spam and reliability caveats |
|---|---|---|---|---|
| **Google Apps Script** | About 9 (create project, paste code, set two constants, authorise, deploy as web app, copy URL, paste into page, test) | **Yes** with a simple `text/plain` no-cors POST; verify once on the real browser | Apps Script is not documented to answer CORS preflight; community reports say preflighted requests fail, so use `mode:'no-cors'` and treat the response as opaque | No third-party spam filter - add a shared secret and a honeypot. No provider dashboard or delivery log beyond the script's own Executions page. Free Gmail quota: **100 email recipients/day**; script runtime 6 min/execution; 25 MB attachments/message; 200 KB email body ([quotas](https://developers.google.com/apps-script/guides/services/quotas)) |
| **FormSubmit** | 2 (point form, confirm activation email) | **No** (official) | AJAX/JSON works cross-origin; files only on native multipart POST | Activation email on first use; submissions before activation are delayed; spam filtering can misfile; files are never stored |
| **Web3Forms** | 3 (get access key by email, add hidden field, add file input) | Likely, but **unverified** for `file://`; their JS examples use `FormData` with no manual headers | Uses `https://api.web3forms.com/submit`; access key is public by design; docs warn not to set `Content-Type` manually | Paid Pro plan needed for attachments; spam protection (hCaptcha/reCAPTCHA) can be enabled |
| **EmailJS** | About 6 (account, connect Gmail service via OAuth, create template, add attachment in template editor, copy service/template/public key, call SDK) | Likely, but **unverified** for `file://` | Browser SDK; origin/domain allowlist is a paid feature | Free plan cannot attach; even the $9 plan caps attachments at 500 KB, which is tight for a PDF |
| **Formspree** | 3 (account, verify email, create form) | Likely, but **unverified** for `file://` | Official AJAX support on all plans | **Fails the requirement**: files arrive as dashboard links, not as an email attachment |
| **Formcarry** | 3+ (account, create form, configure notifications) | **unverified** | Standard multipart / JSON with `Accept: application/json` | Uploads are paid; free plan is 50 submissions/month |

### 4.3 What this means

- Only **Apps Script**, **FormSubmit** and **Web3Forms Pro** are viable free-or-cheap
  routes to an actual attachment in the Gmail inbox.
- Web3Forms Pro costs $12/month for the attachment feature, which the brief says to
  avoid if possible.
- EmailJS free cannot attach, and its cheapest paid tier caps attachments at 500 KB.
- Formspree does not attach files at all.
- FormSubmit is free and attaches, but its supported transport is a normal form
  POST, and it officially does not work from `file://`.

---

## 5. Recommendation #1: Google Apps Script web app

### 5.1 Why it wins

1. **Free and owner-controlled.** Runs on the studio's own Gmail account; no
   third-party form service receives the client's answers.
2. **A real attachment.** `MailApp.sendEmail()` supports attachments and HTML
   bodies, so the PDF and the answers can arrive in one email.
3. **Works from disk and from a host.** The page posts a simple `text/plain`
   request with `mode:'no-cors'`; the browser does not need to read the response,
   so there is no CORS failure and no `file://` restriction.
4. **The recipient cannot be abused.** The script hard-codes
   `contact.abdullahhaider@gmail.com` and never reads a recipient from the request.
   A leaked URL can at worst send junk mail to the studio.
5. **No monthly limit in practice.** One recipient per submission against a free
   Gmail quota of 100 recipients/day ([quotas](https://developers.google.com/apps-script/guides/services/quotas)).

Trade-offs, stated plainly: about 10-15 minutes of one-time setup; a public URL;
no client-facing delivery receipt; Google shows an "unverified app" warning during
the owner's own authorisation (normal for a personal script); code changes require
publishing a new deployment version.

### 5.2 What the page already does, and the two additions it needs

The current build of `index.html` already contains the Apps Script transport:
`CFG.delivery` (`auto | apps-script | formsubmit | manual`), `CFG.appsScriptUrl`,
`resolveMode()` (which prefers Apps Script when the URL is set and does not block
`file://`), and `deliverWithAppsScript()` (JSON posted as `text/plain` with
`mode:'no-cors'`).

Two changes are needed before it is ready:

1. Add a shared secret, so anyone who copies the URL cannot post arbitrary content
   into the studio inbox.
2. Soften the success message. With `no-cors` the browser cannot read the response,
   so the page can only say the request was sent, not that Google confirmed it.

The config after the change (the first four entries already exist; the fifth is new):

```js
var CFG = {
  studio: "Creative Haider",
  email: "contact.abdullahhaider@gmail.com",

  // "auto" prefers Apps Script when a URL is set, otherwise FormSubmit on a
  // hosted page. "manual" always shows the download + mailto fallback.
  delivery: "auto",

  // Deploy > Manage deployments > copy the URL ending in /exec.
  appsScriptUrl: "https://script.google.com/macros/s/PASTE_DEPLOYMENT_ID/exec",

  // NEW: must match SHARED_SECRET in the Apps Script file. 32+ characters.
  appsScriptSecret: "PASTE_A_LONG_RANDOM_SECRET",

  pdfCdn: "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"
};
```

The payload the page sends today, with the additions marked NEW:

| Field | Value today | Notes |
|---|---|---|
| `subject` | `Project brief: <business> (<ref>)` | Used as the email subject |
| `reference` | Brief reference | Shown in the email |
| `name` | Client name | |
| `email` | Client email | Used as Reply-To |
| `business` | Business name | |
| `services` | Comma-joined services | |
| `message` | `plainText()` | All answers, newline separated |
| `pdfBase64` | PDF as raw base64 | Empty string if PDF generation failed |
| `pdfName` | Attachment filename | |
| `to` | `CFG.email` | Ignored by the script; recipient is hard-coded |
| `secret` | **NEW** | Request is rejected if it does not match |
| `phone` | **NEW, optional** | Completes the header block |
| `formUrl` | **NEW, optional** | `location.href`, shown in the footer |

A structured `client` / `answers` shape is not needed: `message` already contains
every answer. The script below accepts both shapes, so a future refactor will not
break it.

### 5.3 Patch for `deliverWithAppsScript()`

Only the payload object and the success note change:

```js
function deliverWithAppsScript() {
  var payload = {
    secret: CFG.appsScriptSecret,   // NEW: must match SHARED_SECRET
    subject: "Project brief: " + (state.data.biz || state.data.name || "New client") + " (" + state.ref + ")",
    reference: state.ref,
    name: state.data.name || "",
    email: state.data.email || "",
    phone: state.data.phone || "",  // NEW
    business: state.data.biz || "",
    services: (state.data.svc || []).join(", "),
    formUrl: location.href,         // NEW
    message: plainText(),
    pdfName: pdfName(),
    pdfBase64: ""
  };
  var withPdf = state.pdfBlob
    ? blobToBase64(state.pdfBlob).then(function (b64) { payload.pdfBase64 = b64; })
    : Promise.resolve();

  return withPdf.then(function () {
    return fetch(CFG.appsScriptUrl, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload)
    });
  }).then(function () {
    // no-cors: the response cannot be read. Say only what is true.
    return { ok: true, note: "Your brief has been sent. We will confirm by email." };
  });
}
```

### 5.4 The Apps Script file (matches the page, copy-paste)

Paste this as the full contents of `Code.gs`. Replace `OWNER_EMAIL` and
`SHARED_SECRET`; the secret must be identical to `CFG.appsScriptSecret`.

```js
/**
 * Creative Haider - Project Brief receiver.
 * Set OWNER_EMAIL and SHARED_SECRET, then deploy as a web app.
 */

const OWNER_EMAIL = 'contact.abdullahhaider@gmail.com';
const SHARED_SECRET = 'PASTE_A_LONG_RANDOM_SECRET';
const MAX_PDF_BYTES = 8 * 1024 * 1024;       // 8 MB binary
const MAX_BODY_CHARS = 12 * 1024 * 1024;     // guard for the whole request
const MAX_TEXT_CHARS = 40000;                // keeps the HTML inside 200 KB
const MAX_ANSWER_CHARS = 500;                // per table row; message has the rest
const MAX_TABLE_CHARS = 80000;               // drop the table if it gets too big

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return json({ ok: false, error: 'Empty request' });
    }
    if (e.postData.contents.length > MAX_BODY_CHARS) {
      return json({ ok: false, error: 'Request too large' });
    }

    const data = JSON.parse(e.postData.contents);
    if (data.secret !== SHARED_SECRET) {
      return json({ ok: false, error: 'Not authorised' });
    }

    // Accept either the page's flat payload or a client/answers payload.
    const client = data.client || {
      name: data.name,
      email: data.email,
      phone: data.phone,
      business: data.business
    };
    const answers = Array.isArray(data.answers) ? data.answers : [];
    const message = String(data.message || '');

    const attachments = [];
    let attachmentNote = '';

    if (data.pdfBase64) {
      const bytes = Utilities.base64Decode(data.pdfBase64);
      if (bytes.length <= MAX_PDF_BYTES) {
        attachments.push(
          Utilities.newBlob(
            bytes,
            'application/pdf',
            safeFileName(data.pdfName || data.pdfFileName)
          )
        );
      } else {
        attachmentNote =
          'The PDF was too large to attach (' +
          Math.round(bytes.length / 1048576) +
          ' MB). The answers below are complete.';
      }
    }

    const fallbackSubject =
      'New Project Brief - ' + (client.business || client.name || 'Client');
    const subject = String(data.subject || fallbackSubject)
      .replace(/[\r\n]+/g, ' ')
      .slice(0, 200);

    const options = {
      to: OWNER_EMAIL, // never taken from the request
      subject: subject,
      htmlBody: buildHtml(client, answers, message, data, attachmentNote),
      name: 'Creative Haider Project Brief',
      attachments: attachments
    };
    if (client.email) options.replyTo = client.email;

    MailApp.sendEmail(options);
    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function safeFileName(name) {
  const base = String(name || 'Project-Brief.pdf').replace(/[^A-Za-z0-9._-]/g, '-');
  return /\.pdf$/i.test(base) ? base : base + '.pdf';
}

function esc(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildHtml(client, answers, message, data, attachmentNote) {
  const answerRows = answers
    .map(function (a) {
      const answer = esc(String(a.answer || '').slice(0, MAX_ANSWER_CHARS))
        .replace(/\n/g, '<br>');
      return (
        '<tr>' +
        '<td style="padding:6px 10px;border-bottom:1px solid #eee;vertical-align:top;width:40%">' +
        '<strong>' + esc(a.question) + '</strong>' +
        '</td>' +
        '<td style="padding:6px 10px;border-bottom:1px solid #eee;vertical-align:top">' +
        answer +
        '</td>' +
        '</tr>'
      );
    })
    .join('');

  const messageHtml = esc(message.slice(0, MAX_TEXT_CHARS)).replace(/\n/g, '<br>');
  const services = Array.isArray(data.services)
    ? data.services.join(', ')
    : String(data.services || '');

  return (
    '<div style="font-family:Arial,Helvetica,sans-serif;color:#222;max-width:720px">' +
    '<h2 style="margin:0 0 4px">New Project Brief</h2>' +
    '<p style="margin:0 0 16px;color:#777">' +
    esc(new Date().toUTCString()) +
    '</p>' +
    '<p>' +
    '<strong>Name:</strong> ' + esc(client.name) + '<br>' +
    '<strong>Business:</strong> ' + esc(client.business) + '<br>' +
    '<strong>Email:</strong> ' + esc(client.email) + '<br>' +
    '<strong>Phone:</strong> ' + esc(client.phone) + '<br>' +
    '<strong>Services:</strong> ' + esc(services) + '<br>' +
    '<strong>Reference:</strong> ' + esc(data.reference) +
    '</p>' +
    '<p>The full PDF brief is attached. The answers are also below.</p>' +
    (attachmentNote
      ? '<p style="color:#b04a00"><strong>' + esc(attachmentNote) + '</strong></p>'
      : '') +
    (answerRows && answerRows.length <= MAX_TABLE_CHARS
      ? '<h3 style="font-size:15px">Answers</h3>' +
        '<table style="border-collapse:collapse;width:100%;font-size:14px">' +
        answerRows +
        '</table>'
      : '') +
    (messageHtml
      ? '<h3 style="font-size:15px">Brief</h3>' +
        '<div style="font-size:14px;line-height:1.5">' + messageHtml + '</div>'
      : '') +
    '<p style="color:#888;font-size:12px;margin-top:20px">' +
    'Sent from ' + esc(data.formUrl || 'the Project Brief page') +
    '</p>' +
    '</div>'
  );
}

/** Run once from the Apps Script editor to confirm sending works. */
function testSend() {
  MailApp.sendEmail({
    to: OWNER_EMAIL,
    subject: 'Creative Haider brief receiver - test',
    body: 'If you can read this, the mail sender works.'
  });
}
```

Why this code is written this way:

- `Utilities.newBlob(Utilities.base64Decode(...), 'application/pdf', name)` builds
  the attachment; `MailApp.sendEmail` takes an array of `BlobSource` objects as
  `attachments`
  ([MailApp reference](https://developers.google.com/apps-script/reference/mail/mail-app)).
- `replyTo` is set from the client's email, so Reply in Gmail answers the client.
- `message` and every answer are HTML-escaped, so a client typing `<script>` cannot
  break the email.
- The recipient is a constant, never a request field.
- The `answers` array is optional; the page's `message` alone is enough.

### 5.5 Deployment steps (exact)

1. Sign in to Google as **contact.abdullahhaider@gmail.com**.
2. Open <https://script.google.com>, then **New project**.
3. Replace the contents of `Code.gs` with the file in 5.4. Set `OWNER_EMAIL` and a
   long random `SHARED_SECRET` (32+ characters, for example from a password
   manager).
4. Save, select `testSend` in the function dropdown, click **Run**. Approve the
   permissions: **Review permissions > choose the account > Advanced > Go to
   (project name) (unsafe) > Allow**. Google shows this because the script is not
   a published add-on; it is your own code.
5. Check the Gmail inbox for the test message.
6. **Deploy > New deployment**. Next to "Select type" click the gear and choose
   **Web app**.
7. Set **Description** (e.g. `Project Brief receiver v1`), **Execute as: Me**,
   **Who has access: Anyone**. Deploy.
   ([Web apps guide](https://developers.google.com/apps-script/guides/web))
8. Copy the **Web app URL**. It ends in `/exec`. Paste it into
   `CFG.appsScriptUrl` in `index.html`.
9. After any later code change: **Deploy > Manage deployments > edit (pencil) >
   Version: New version > Deploy**. Editing the file alone does not update the
   live URL
   ([deployments](https://developers.google.com/apps-script/concepts/deployments)).

Notes:

- "Anyone" is the option that lets a client submit without a Google login. If the
  account is a Google Workspace account, an administrator may have removed that
  option; a personal Gmail account is usually the simplest place to run this
  ([web app permissions](https://developers.google.com/apps-script/guides/web)).
- The `/exec` URL is public in the page source. That is acceptable here because the
  worst case is junk mail to the owner's own inbox. Rotate the secret if it is ever
  abused.
- Apps Script's redirect after `doPost` returns the JSON to a URL the page cannot
  read (`no-cors`), which is expected. The email is the receipt.
- The script quota is 100 email recipients/day on a free Gmail account and 25 MB
  total attachments per message
  ([quotas](https://developers.google.com/apps-script/guides/services/quotas)).
  The 8 MB PDF cap in the config sits comfortably below both.

### 5.6 First-run test without the page

Open the browser console on any page (including the local `index.html`) and run:

```js
fetch('https://script.google.com/macros/s/PASTE_DEPLOYMENT_ID/exec', {
  method: 'POST',
  mode: 'no-cors',
  headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
  body: JSON.stringify({
    secret: 'PASTE_A_LONG_RANDOM_SECRET',
    subject: 'Project brief: Test Co (TEST-1)',
    reference: 'TEST-1',
    name: 'Test Client',
    email: 'test@example.com',
    phone: '',
    business: 'Test Co',
    services: 'Website design and development',
    formUrl: 'console-test',
    message: 'Did this arrive?',
    pdfName: 'test.pdf',
    pdfBase64: ''
  })
});
```

Expect an email with the subject "Project brief: Test Co (TEST-1)" within a minute
or two. If nothing arrives, open the Apps Script editor's **Executions** page and
read the error.

---

## 6. Recommendation #2: FormSubmit, native multipart POST (hosted pages only)

Use this only if the page is served over `http(s)://` and the studio does not want
to set up Apps Script. It is free and genuinely attaches files, but it cannot work
from `file://` and the page cannot stay on the last step unless the POST is sent
through a hidden iframe.

### 6.1 Config

This snippet is standalone: it is only needed if the page's current FormSubmit
attempt is replaced by the native multipart path. It is separate from `CFG`.

```js
const FORMSUBMIT_FALLBACK = {
  endpoint: 'https://formsubmit.co/contact.abdullahhaider@gmail.com',
  subject: 'New Project Brief',
  pageUrl: 'https://your-domain.example/client-brief/', // required hidden _url
  maxPdfBytes: 9 * 1024 * 1024 // FormSubmit allows 10 MB total
};
```

### 6.2 Transport

Create a hidden iframe and a hidden multipart form once, fill it, attach the PDF
with `DataTransfer`, and submit. The page never navigates. This whole path is
**unverified end-to-end** (the documented FormSubmit path is a normal form POST);
test it before launch. It needs a browser that supports the `DataTransfer`
constructor (current Chrome, Edge, Firefox and Safari; if unavailable, fall back to
`mailto:`). Keep the `_url` value in the form identical to
`FORMSUBMIT_FALLBACK.pageUrl`.

```html
<iframe name="brief-sink" id="brief-sink" title="Submission target"
        style="display:none"></iframe>

<form id="brief-fallback" method="POST" enctype="multipart/form-data"
      target="brief-sink" style="display:none"
      action="https://formsubmit.co/contact.abdullahhaider@gmail.com">
  <input type="hidden" name="_subject" value="New Project Brief">
  <input type="hidden" name="_template" value="table">
  <input type="hidden" name="_captcha" value="false">
  <input type="text" name="_honey" value="" style="display:none">
  <input type="hidden" name="_url" value="https://your-domain.example/client-brief/">
  <input type="hidden" name="name">
  <input type="hidden" name="email">
  <input type="hidden" name="phone">
  <input type="hidden" name="business">
  <input type="hidden" name="answers">
  <input type="file" name="attachment">
</form>
```

```js
function deliverBriefViaFormSubmit({ client, answers, pdfBlob, fileName }) {
  const form = document.getElementById('brief-fallback');
  form.elements.name.value = client.name || '';
  form.elements.email.value = client.email || '';
  form.elements.phone.value = client.phone || '';
  form.elements.business.value = client.business || '';

  const answerText = answers
    .map(function (a) { return a.question + ': ' + a.answer; })
    .join('\n');
  form.elements.answers.value = answerText;

  // Attach the already-generated PDF without a file picker.
  const transfer = new DataTransfer();
  transfer.items.add(new File([pdfBlob], fileName, { type: 'application/pdf' }));
  form.elements.attachment.files = transfer.files;

  form.submit(); // posted into the hidden iframe
}
```

### 6.3 Caveats you must accept

- **First submission triggers FormSubmit's activation email.** Click the link, then
  submit again; files from before activation are not retained
  ([docs](https://formsubmit.co/documentation)). If the studio has already
  activated this address in earlier testing, this step is already done.
- **reCAPTCHA must be off for the hidden form to work.** A hidden iframe cannot
  solve a challenge, so `_captcha=false` is included above. FormSubmit warns that
  disabling it can attract spam; the shared `_honey` honeypot field is a partial
  substitute. This combination is **unverified end-to-end - test it**.
- **No delivery confirmation.** The iframe swallows the response. Tell the client
  the download is their copy and the studio will confirm by email.
- **`file://` is not supported.** If the page is opened from disk, fall back to the
  existing `mailto:` link and ask the client to attach the PDF.
- **FormSubmit may filter the mail to spam.** Check and mark as not spam
  ([help](https://formsubmit.co/help)).
- Files are not stored by FormSubmit, so if the email is lost the PDF is lost
  ([docs](https://formsubmit.co/documentation)).

---

## 7. Options that do not meet the requirement

| Option | Why it is not recommended here |
|---|---|
| Web3Forms free + Pro | Free plan has no attachments; Pro is $12/month. The default uploader is limited to one file up to 5 MB, and the "Advanced File Uploader" limit is not documented on the page. It would work, but it adds a subscription the studio wants to avoid. |
| EmailJS free / Personal | Free plan cannot attach. Personal is $9/month and caps the whole attachment at 500 KB, which a branded multi-page PDF can exceed. Business (30 MB) costs $40/month. |
| Formspree | Attachments require a paid plan, and even then files are delivered as dashboard links, not email attachments. Fails the core requirement. |
| Formcarry | Uploads are paid-only per its docs; attachment-to-email behaviour is not documented. |
| Netlify Forms, Basin, Getform and similar | Not evaluated in detail here. If one is chosen, confirm in its own docs that (a) the file is emailed as an attachment, not a link, (b) it accepts a `file://`-less static page, and (c) its free tier includes uploads. |

---

## 8. Verification checklist

Run these in order after wiring the page. Do not announce the form to clients until
every line passes.

### 8.1 One-time setup

- [ ] `testSend()` from the Apps Script editor arrives in the Gmail inbox.
- [ ] The deployed URL ends in `/exec` and was pasted into `CFG.appsScriptUrl`.
- [ ] `SHARED_SECRET` is identical to `CFG.appsScriptSecret` (case-sensitive).
- [ ] Deploy settings: **Execute as: Me**, **Who has access: Anyone**.
- [ ] With `CFG.appsScriptUrl` set, a `file://` page no longer falls to the manual
      screen.

### 8.2 First real submission (hosted page)

- [ ] Fill the brief on the live URL and submit.
- [ ] The email arrives at `contact.abdullahhaider@gmail.com` (check Spam and
      Promotions as well; mark as not spam if needed).
- [ ] The PDF is a **real attachment** with the expected filename, opens, and
      matches the downloaded copy page for page.
- [ ] The email body lists the answers, with the correct client name, business,
      email and phone.
- [ ] Reply-To is the client's email (hit Reply, check the To field, then discard).
- [ ] `formUrl` in the footer is correct (if the optional `formUrl` field was
      added).
- [ ] Test once with a PDF near the cap (e.g. 7-8 MB) and once with a normal one
      (under 1 MB).

### 8.3 Local file test

- [ ] Open `index.html` from disk (`file://`) and submit a full brief.
- [ ] The same email and attachment arrive.
- [ ] If it does not, check the browser console for a blocked request and fall back
      to the `mailto:` link.

### 8.4 Failure paths

- [ ] Turn off Wi-Fi and submit: the page shows an honest "could not send" state
      and keeps the PDF download available.
- [ ] In Apps Script, **Executions** shows `doPost` runs with no error for each
      submission.
- [ ] A request with a wrong `secret` gets `{"ok":false,"error":"Not authorised"}`
      and sends no email.
- [ ] A submission without a PDF still sends the email with the answers.

### 8.5 FormSubmit-specific (only if used as fallback)

- [ ] First submission triggers the activation email; click it.
- [ ] Submit again and confirm the attachment arrives (files from before
      activation are not retained).
- [ ] Confirm the form works from the public `https://` URL, not from `file://`.
- [ ] Check spam and mark as not spam.

---

## 9. Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| No email after `testSend` | Authorisation not completed, or mail quota exhausted | Re-run and approve; check Executions |
| Email arrives with no attachment | `pdfBase64` empty, or PDF larger than the cap | Check the page's `pdfToBase64`; confirm the guard message |
| Email arrives but the body is empty | `message` was empty when posted | Check `plainText()` in the page before sending |
| Page says sent but no email arrives | Script rejected the request (secret) or the daily quota is exhausted | Check Executions; verify the secret; wait for the quota reset |
| Email arrives only sometimes | Quota or spam filtering | Check daily quota; mark not spam; add a Gmail filter/label |
| Browser console: CORS error | A preflight was triggered | Use `text/plain` and `mode:'no-cors'`; do not set JSON headers |
| No email; Executions shows "Not authorised" | Secret mismatch | Copy the exact string to both sides |
| Error "Request too large" | Payload above the 12M character guard | Reduce the PDF or raise the cap carefully |
| Edits not live | Deployment version not published | Manage deployments > New version |
| FormSubmit: "Unable to submit form" | Page opened as `file://` | Host the page, or use Apps Script |

---

## 10. What remains to change in the current `index.html`

The page already implements the transport described above. These are the remaining
edits; nothing else in the page needs to change.

1. **Add the secret.** Add `appsScriptSecret` to `CFG` (section 5.2), then add
   `secret: CFG.appsScriptSecret` and `phone`/`formUrl` to the payload in
   `deliverWithAppsScript()` (section 5.3). The Apps Script rejects requests without
   it.
2. **Deploy the script** (section 5.5) and paste the `/exec` URL into
   `CFG.appsScriptUrl`.
3. **Fix the success copy.** The current note says "Google confirmed the request was
   received". With `mode:'no-cors'` the page cannot see the response. Use "Your brief
   has been sent. We will confirm by email." instead.
4. **Leave `CFG.delivery` at `"auto"`.** With `appsScriptUrl` set, Apps Script wins
   on both hosted and `file://` pages. Without it, hosted pages use FormSubmit and
   `file://` falls to the manual screen, which is the correct behaviour.
5. **Keep the FormSubmit attempt as best effort.** The page posts multipart to
   `/ajax/...` with the PDF and retries without it; that retry is a sensible
   degradation. Remember the first attempt is **unverified** (section 3), so if the
   studio relies on FormSubmit rather than Apps Script, replace it with the native
   multipart path in section 6.
6. **Keep the download and mailto fallback.** The PDF download is the client's copy;
   the `mailto:` link is the last resort when the network is down.

Acceptance criteria: a client on a phone, on a laptop, on the hosted URL and from
the local file can submit the brief; the studio receives one email with the answers
and an openable PDF attachment, and Reply goes to the client.

## 11. Sources

- FormSubmit: [documentation](https://formsubmit.co/documentation),
  [AJAX](https://formsubmit.co/ajax-documentation),
  [help](https://formsubmit.co/help),
  [API](https://formsubmit.co/api-documentation)
- Web3Forms: [pricing](https://web3forms.com/pricing),
  [file attachments](https://docs.web3forms.com/getting-started/pro-features/file-attachments),
  [installation](https://docs.web3forms.com/getting-started/installation)
- EmailJS: [pricing](https://www.emailjs.com/pricing/),
  [file attachments](https://www.emailjs.com/docs/user-guide/file-attachments/)
- Formspree: [file uploads](https://help.formspree.io/articles/building-your-form/file-uploads.md),
  [account limits](https://help.formspree.io/articles/account-management/account-limits.md),
  [plans](https://formspree.io/plans)
- Formcarry: [file uploads](https://formcarry.com/docs/features/file-uploads)
- Google Apps Script: [web apps](https://developers.google.com/apps-script/guides/web),
  [deployments](https://developers.google.com/apps-script/concepts/deployments),
  [MailApp](https://developers.google.com/apps-script/reference/mail/mail-app),
  [quotas](https://developers.google.com/apps-script/guides/services/quotas)
- Third-party note on FormSubmit's AJAX upload gap:
  [splitforms](https://splitforms.com/blog/formsubmit-file-uploads-attachments)
