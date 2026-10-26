/* ==========================================================================
   Creative Haider — Project Brief
   A single-file, no-build client requirements wizard.

   Everything the studio needs to change lives in CFG below.
   ========================================================================== */
(function () {
  "use strict";

  /* ---------------------------------------------------------------------- */
  /* Studio configuration                                                    */
  /* ---------------------------------------------------------------------- */
  var CFG = {
    studio: "Creative Haider",
    email: "contact.abdullahhaider@gmail.com",

    // Delivery: "auto" picks the best option available below.
    // "formsubmit" (default, hosted page) | "apps-script" (optional, works from file://) | "manual"
    delivery: "auto",

    // Optional: deployed Google Apps Script Web App URL (ends in /exec). When
    // present it is preferred over FormSubmit, and it also works when the page
    // is opened straight from disk. See docs/email-setup.md.
    appsScriptUrl: "",

    // Must match SHARED_SECRET in the Apps Script file. 32+ random characters.
    appsScriptSecret: "",

    pdfCdn: "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"
  };

  /* ---------------------------------------------------------------------- */
  /* Brand logo, defined once and reused by the UI, the favicon and the PDF   */
  /* ---------------------------------------------------------------------- */
  var LOGO = "__LOGO__";

  var STORE_KEY = "ch-brief-v2";
  var MAXLEN = 2000;

  /* ---------------------------------------------------------------------- */
  /* Question model (sections, conditional visibility, palettes)             */
  /* ---------------------------------------------------------------------- */
  /*__DATA_MODEL__*/

  /* ---------------------------------------------------------------------- */
  /* Short helper text shown under selected questions                        */
  /* ---------------------------------------------------------------------- */
  var HINTS = {
    email: "We reply here, so please use an address you check.",
    biz: "The name you trade under. It appears on your proposal.",
    what: "A sentence or two is plenty: who you help and how.",
    site: "Paste the link, or leave it blank if you do not have one yet.",
    social: "Instagram, LinkedIn, Facebook, TikTok. Paste the links.",
    approver: "The person who signs off designs and copy.",
    proj: "What you want built, in your own words. No jargon needed.",
    prob: "What is not working today, or what is missing?",
    action: "The one thing you most want a visitor to do.",
    audience: "Age, location, job. The more specific, the sharper the work.",
    diff: "What can you offer that competitors cannot?",
    metric: "Enquiries, sales, bookings or sign-ups: whatever matters most.",
    users: "List the roles, and roughly what each one needs to do.",
    core: "The features the first version cannot launch without.",
    later: "Useful, but not essential for launch.",
    data: "Systems it must talk to, for example Xero, Shopify, a CRM or a spreadsheet.",
    dash: "What should people be able to see and do on the dashboard?",
    similar: "Two or three links, with a note on what you like about each.",
    scale: "A rough number is fine.",
    aproc: "The repetitive work that eats the most time.",
    astep: "The steps in order, including who does what.",
    atrig: "What event starts the automation?",
    aout: "What does done look like?",
    avol: "Every time an order arrives, or once a month?",
    splat: "Where you want us to post.",
    sfreq: "How often you would like to post.",
    screate: "Photos and video make or break social content.",
    sgoal: "The single outcome you want from social.",
    comp: "Links help most.",
    admire: "Any industry, not just yours.",
    avoid: "Colours, cliches or styles you dislike.",
    logo: "Vector files are best: .svg, .ai or .eps.",
    guide: "Colours, fonts and logo files.",
    pers: "Choose the words that sound like you.",
    tone: "How your copy should read.",
    lang: "For example English and Urdu.",
    own: "Leave blank if you do not have set colours.",
    theme: "Light, dark, or both with a switch.",
    font: "Serif feels established. Sans serif feels modern.",
    layout: "How much space you want around the content.",
    img: "What kind of imagery should carry the site?",
    anim: "Subtle is usually safer for a business site.",
    pages: "Tick everything you need now or soon.",
    services: "One service per line.",
    menu: "Top-level items, with what sits under each.",
    home: "What should the first screen say and show?",
    svcpage: "What should every service page include?",
    contact: "How should people reach you?",
    feats: "Tick what visitors should be able to do.",
    top3: "If only three things worked, which three?",
    tools: "Anything you already pay for.",
    formto: "This applies to every form on the site.",
    photos: "Real photos build trust faster than stock.",
    shoot: "We can arrange this locally or remotely.",
    files: "Paste a shared folder link.",
    due: "Content delays are the biggest cause of late launches.",
    presence: "Pick what you need help with.",
    kw: "Words customers would type, plus towns or cities.",
    blog: "Only commit to a rhythm you can keep.",
    domain: "If you do not have one, we will suggest options.",
    host: "Leave blank if you are not sure.",
    mail: "Business email sends from your own domain.",
    legal: "Required if you collect data or sell online.",
    rules: "For example health, finance or children's data.",
    access: "We build to WCAG 2.2 AA by default.",
    platform: "Only if you have a reason to choose.",
    edit: "We can set up a simple editor and training.",
    launch: "An aim is enough.",
    deadline: "For example an event, a season or a funding date.",
    budget: "A range is fine. It helps us scope honestly, not inflate.",
    rounds: "Most projects include two structured rounds.",
    signoff: "Who has the final say?",
    after: "Ongoing care is optional but sensible.",
    via: "How you prefer to be contacted.",
    notes: "Anything the questions missed."
  };

  var PLACEHOLDER = {
    name: "e.g. Sarah Ahmed",
    email: "name@company.com",
    phone: "+92 300 0000000",
    biz: "Registered or trading name",
    what: "We fit kitchens across Lahore for homeowners and developers.",
    since: "2018, a team of four",
    addr: "Street, city and opening hours",
    site: "https://",
    social: "Instagram: @yourbusiness   LinkedIn: /company/yourbusiness",
    approver: "Name and role",
    proj: "What you want built and why.",
    prob: "What is not working today.",
    goals: "1. ...   2. ...   3. ...",
    action: "e.g. Request a quote",
    audience: "e.g. Homeowners, 35 to 55, Lahore and Islamabad",
    areas: "e.g. Pakistan and the UAE",
    diff: "We install in 48 hours because everything is cut in our own workshop.",
    metric: "Enquiries, sales, bookings",
    users: "Admin: ...   Staff: ...   Customer: ...",
    core: "Feature one, feature two",
    later: "Nice to have",
    data: "e.g. Xero, Shopify, Google Sheets",
    similar: "https://",
    scale: "e.g. 500 users in year one",
    tech: "e.g. React and Node, or leave blank",
    aproc: "e.g. copying orders into a spreadsheet",
    astep: "Step 1 ...  Step 2 ...",
    atrig: "e.g. A new form submission",
    aout: "e.g. Invoice created and emailed",
    avol: "e.g. 20 times a day",
    shand: "Instagram, LinkedIn",
    comp: "https://competitor.com: I like their clear pricing",
    admire: "https://",
    avoid: "e.g. no clip art, no stock handshakes",
    tag: "e.g. Built to last",
    lang: "e.g. English and Urdu",
    own: "#1F6FB2, #F4F4F4",
    avoidc: "e.g. no purple",
    services: "One service per line",
    menu: "Home, Services, Projects, About, Contact",
    count: "e.g. 8 pages",
    top3: "1. ...   2. ...   3. ...",
    tools: "e.g. Mailchimp, HubSpot, Calendly",
    formto: "e.g. hello@yourbusiness.com",
    files: "https://drive.google.com/",
    budget: "e.g. GBP 3,000 to 5,000",
    rounds: "e.g. two rounds",
    signoff: "Name and role",
    deadline: "e.g. Trade show on 12 March",
    domain: "e.g. yourbusiness.com",
    reg: "e.g. GoDaddy",
    rules: "e.g. patient data, financial advice, children's data",
    kw: "e.g. kitchen fitters Lahore",
    notes: "Anything else we should know."
  };

  /* ---------------------------------------------------------------------- */
  /* Tiny helpers                                                            */
  /* ---------------------------------------------------------------------- */
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  function esc(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function pad(n) { return String(n).padStart(2, "0"); }
  function todayISO() {
    var d = new Date();
    return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
  }
  function fmtTime(ts) {
    try { return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }); }
    catch (e) { return ""; }
  }
  function debounce(fn, ms) {
    var t = null;
    return function () {
      var args = arguments, self = this;
      clearTimeout(t);
      t = setTimeout(function () { fn.apply(self, args); }, ms);
    };
  }
  function isEmpty(v) {
    if (v == null) return true;
    if (Array.isArray(v)) return v.length === 0;
    return String(v).trim() === "";
  }
  function isEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v || "").trim());
  }
  function escAttr(s) { return esc(s); }

  /* Icons used in markup (inline, no icon font) */
  var IC = {
    clock: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    save: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z"/><path d="M17 21v-8H7v8M7 3v5h8"/></svg>',
    lock: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" aria-hidden="true"><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>',
    check: '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>',
    alert: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4M12 17h.01"/></svg>',
    arrow: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    download: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5M12 15V3"/></svg>',
    mail: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 6 10-6"/></svg>',
    edit: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>'
  };

  /* ---------------------------------------------------------------------- */
  /* State + persistence                                                     */
  /* ---------------------------------------------------------------------- */
  var state = {
    screen: "welcome",
    step: 0,
    maxStep: 0,
    data: {},
    ref: "",
    busy: false,
    result: null,
    pdfBlob: null,
    savedAt: 0
  };

  var view = $("#view");
  var logoPromise = null;

  function makeRef() {
    var d = new Date();
    var rnd = Math.random().toString(36).slice(2, 6).toUpperCase();
    return "CH-" + String(d.getFullYear()).slice(2) + pad(d.getMonth() + 1) + pad(d.getDate()) + "-" + rnd;
  }

  function sections() {
    var svc = Array.isArray(state.data.svc) ? state.data.svc : [];
    return ALL.filter(function (s) { return !s.w || s.w.some(function (i) { return svc.indexOf(SV[i]) !== -1; }); });
  }
  function questionsOf(list) {
    var out = [];
    (list || sections()).forEach(function (s) { out = out.concat(s.q); });
    return out;
  }
  function hasAnswers() {
    return Object.keys(state.data).some(function (k) {
      var v = state.data[k];
      if (Array.isArray(v)) return v.length > 0;
      return v != null && String(v).trim() !== "";
    });
  }
  function countAnswered(list) {
    var total = 0;
    (list || sections()).forEach(function (s) {
      s.q.forEach(function (q) { if (!isEmpty(state.data[q[0]])) total++; });
    });
    return total;
  }
  function sectionComplete(sec) {
    return sec.q.every(function (q) { return isEmpty(state.data[q[0]]); }) === false &&
      sec.q.every(function (q) { return !q[4] || !isEmpty(state.data[q[0]]); });
  }

  function readStore() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY) || "null"); } catch (e) { return null; }
  }
  function loadStore() {
    var s = readStore();
    if (s && s.v === 2 && s.data && typeof s.data === "object") {
      state.data = s.data;
      if (!Array.isArray(state.data.svc) && typeof state.data.svc === "string") state.data.svc = [state.data.svc];
      state.step = Math.max(0, parseInt(s.step, 10) || 0);
      state.maxStep = Math.max(0, parseInt(s.maxStep, 10) || 0);
      state.savedAt = s.at || 0;
      return true;
    }
    return false;
  }
  function persist() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify({
        v: 2, at: Date.now(), data: state.data, step: state.step, maxStep: state.maxStep
      }));
      state.savedAt = Date.now();
      return true;
    } catch (e) {
      return false;
    }
  }
  var scheduleSave = debounce(function () {
    var ok = persist();
    var wrap = $("#saveState"), txt = $("#saveText");
    if (wrap) wrap.classList.remove("is-saving");
    if (txt) txt.textContent = ok ? "Saved " + fmtTime(Date.now()) : "Not saved in this browser";
  }, 380);

  function markSaving() {
    var wrap = $("#saveState"), txt = $("#saveText");
    if (!wrap || !txt) return;
    wrap.classList.add("is-saving");
    txt.textContent = "Saving...";
    scheduleSave();
  }

  function clearStore() {
    try { localStorage.removeItem(STORE_KEY); } catch (e) { /* storage unavailable */ }
  }

  /* ---------------------------------------------------------------------- */
  /* Logo + favicon                                                          */
  /* ---------------------------------------------------------------------- */
  function primeBrand() {
    var big = $("#brandImg"), small = $("#brandImgMobile");
    var ready = function () {
      if (big) big.classList.add("ready");
      if (small) small.classList.add("ready");
    };
    if (big) {
      big.onload = ready;
      big.onerror = function () {
        big.hidden = true;
        if (small) small.hidden = true;
        var fb = $("#brandFallback");
        if (fb) fb.hidden = false;
      };
      big.src = LOGO;
      if (big.complete && big.naturalWidth) ready();
    }
    if (small) small.src = LOGO;

    var link = document.createElement("link");
    link.rel = "icon";
    link.href = LOGO;
    document.head.appendChild(link);
  }

  function getLogoImage() {
    if (logoPromise) return logoPromise;
    logoPromise = new Promise(function (resolve, reject) {
      var im = new Image();
      im.onload = function () { resolve(im); };
      im.onerror = function () { reject(new Error("Logo could not be loaded")); };
      im.src = LOGO;
    });
    return logoPromise;
  }

  /* ---------------------------------------------------------------------- */
  /* Rendering: welcome                                                      */
  /* ---------------------------------------------------------------------- */
  function renderWelcome() {
    var totalAll = ALL.reduce(function (n, s) { return n + s.q.length; }, 0);
    var mins = Math.min(20, Math.max(8, Math.round(totalAll * 0.14)));
    var saved = readStore();
    var resume = !!(saved && saved.v === 2 && saved.data);
    var answered = resume ? countAnswered() : 0;

    var resumeHtml = "";
    var actionsHtml = "";
    if (resume && hasAnswers()) {
      resumeHtml =
        '<div class="resume">' +
        "<p><b>You have a brief in progress.</b> " + answered + " answer" + (answered === 1 ? "" : "s") +
        (saved.at ? " saved " + fmtTime(saved.at) : "") + ". Pick up where you left off.</p>" +
        '<div class="actions">' +
        '<button class="btn btn-primary" id="resumeBtn" type="button">Continue brief ' + IC.arrow + "</button>" +
        '<button class="btn btn-ghost" id="freshBtn" type="button">Start fresh</button>' +
        "</div></div>";
      actionsHtml = "";
    } else {
      actionsHtml =
        '<div class="hero-actions">' +
        '<button class="btn btn-primary" id="startBtn" type="button">Start the brief ' + IC.arrow + "</button>" +
        "</div>";
    }

    view.innerHTML =
      '<section class="screen">' +
        '<p class="eyebrow">Client project brief</p>' +
        '<div class="hero">' +
          '<h1 class="display">A clear brief makes a <em>better website.</em></h1>' +
          '<p class="lead">Tell us what you need, in your own words. It is how we shape the plan, the timeline and the quote, so that nothing important gets guessed.</p>' +
          '<ul class="facts">' +
            "<li><span class=\"facts-k\">" + IC.clock + "</span><span class=\"facts-v\">About " + mins + " minutes. The questions adapt to your project</span></li>" +
            "<li><span class=\"facts-k\">" + IC.save + "</span><span class=\"facts-v\">Saves as you go. Leave and return any time</span></li>" +
            "<li><span class=\"facts-k\">" + IC.lock + "</span><span class=\"facts-v\">Only " + esc(CFG.studio) + " sees your answers</span></li>" +
          "</ul>" +
          resumeHtml +
          actionsHtml +
          '<p class="hero-note">' + IC.lock + " Nothing is sent until you review your answers and press send.</p>" +
        "</div>" +
      "</section>";

    var start = $("#startBtn");
    if (start) start.onclick = function () { state.screen = "form"; state.step = 0; state.maxStep = 0; render(); };
    var resumeBtn = $("#resumeBtn");
    if (resumeBtn) resumeBtn.onclick = function () {
      state.screen = "form";
      state.step = Math.min(Math.max(0, state.step), Math.max(0, sections().length - 1));
      render();
    };
    var fresh = $("#freshBtn");
    if (fresh) fresh.onclick = function () {
      if (!window.confirm("Start again? This clears the answers saved in this browser.")) return;
      resetAll();
    };
  }

  /* ---------------------------------------------------------------------- */
  /* Rendering: one step                                                     */
  /* ---------------------------------------------------------------------- */
  function fieldHtml(q) {
    var k = q[0], label = q[1], type = q[2], options = q[3], required = q[4];
    var v = state.data[k];
    var fid = "fld-" + k;
    var hint = HINTS[k] ? '<p class="field-hint" id="' + fid + '-hint">' + esc(HINTS[k]) + "</p>" : "";
    var reqTag = required ? '<span class="req-tag">Required</span>' : "";
    var ph = PLACEHOLDER[k] ? ' placeholder="' + escAttr(PLACEHOLDER[k]) + '"' : "";
    var ariaReq = ' aria-required="' + (required ? "true" : "false") + '"';
    var ariaDesc = HINTS[k] ? ' aria-describedby="' + fid + '-hint"' : "";
    var body = "";

    if (type === "t" || type === "e" || type === "p" || type === "d") {
      var inputType = { t: "text", e: "email", p: "tel", d: "date" }[type];
      var extra = "";
      if (type === "e") extra = ' inputmode="email" autocomplete="email" spellcheck="false"';
      if (type === "p") extra = ' inputmode="tel" autocomplete="tel"';
      if (type === "d") extra = ' min="' + todayISO() + '"';
      if (type === "t" && k === "name") extra = ' autocomplete="name"';
      var val = v == null ? "" : String(v);
      body = '<input class="control" id="' + fid + '" name="' + k + '" data-k="' + k + '" type="' + inputType +
        '" value="' + escAttr(val) + '"' + ph + ariaReq + ariaDesc + extra + ">";
    } else if (type === "a") {
      var text = v == null ? "" : String(v);
      body = '<div class="ta-wrap">' +
        '<textarea class="control" id="' + fid + '" name="' + k + '" data-k="' + k + '" rows="4" maxlength="' + MAXLEN + '"' +
        ph + ariaReq + ariaDesc + ">" + esc(text) + "</textarea>" +
        '<span class="counter" aria-hidden="true">' + text.length + " / " + MAXLEN + "</span>" +
        "</div>";
    } else if (type === "r" || type === "c") {
      body = '<div class="chips">' + options.map(function (opt, i) {
        var id = fid + "-" + i;
        var checked = type === "r" ? v === opt : (Array.isArray(v) && v.indexOf(opt) !== -1);
        return '<label class="chip" for="' + id + '"><input id="' + id + '" type="' + (type === "r" ? "radio" : "checkbox") +
          '" name="' + k + '" data-k="' + k + '" value="' + escAttr(opt) + '"' + (checked ? " checked" : "") + "><span>" + esc(opt) + "</span></label>";
      }).join("") + "</div>";
    } else if (type === "P") {
      body = '<div class="palettes">' + PAL.map(function (p, i) {
        var id = fid + "-" + i;
        return '<label class="pal" for="' + id + '"><input id="' + id + '" type="radio" name="' + k + '" data-k="' + k +
          '" value="' + escAttr(p[0]) + '"' + (v === p[0] ? " checked" : "") + '><div class="pal-body">' +
          '<span class="swatches">' + p[2].map(function (c) { return '<i style="background:' + c + '"></i>'; }).join("") + "</span>" +
          '<span class="pal-name">' + esc(p[0]) + "</span>" +
          '<span class="pal-mood">' + esc(p[1]) + "</span>" +
          "</div></label>";
      }).join("") + "</div>";
    }

    return '<fieldset class="field' + (type === "a" ? " is-textarea" : "") + '" id="' + fid + '-fs" data-field="' + k + '">' +
      "<legend>" + esc(label) + reqTag + "</legend>" + hint + body + '<p class="msg" hidden></p></fieldset>';
  }

  function renderStep() {
    var S = sections();
    if (!S.length) { state.screen = "welcome"; renderWelcome(); return; }
    state.step = Math.min(Math.max(0, state.step), S.length - 1);
    var sec = S[state.step];

    var html = '<section class="screen">' +
      '<p class="eyebrow"><span class="num">' + pad(state.step + 1) + "</span><span>" + esc(sec.n) + "</span></p>" +
      '<h2 class="display">' + esc(sec.t) + "</h2>" +
      '<p class="lead">' + esc(sec.i) + "</p>" +
      '<div id="errorSummary" class="error-summary" hidden></div>' +
      '<form class="step-form" id="stepForm" novalidate>' +
      sec.q.map(fieldHtml).join("") +
      '<button type="submit" class="sr-only">Continue</button>' +
      "</form></section>";

    view.innerHTML = html;

    var form = $("#stepForm");
    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        goNext();
      });
    }
    // restore auto-grown textareas
    $$("textarea.control", view).forEach(function (t) { autosize(t); });
    updateRail();
    updateActionbar();
    rememberStep();
  }

  function autosize(t) {
    if (!t) return;
    t.style.height = "auto";
    t.style.height = Math.max(118, t.scrollHeight + 2) + "px";
  }

  function rememberStep() {
    state.maxStep = Math.max(state.maxStep, state.step);
    persist();
  }

  /* ---------------------------------------------------------------------- */
  /* Rendering: review                                                       */
  /* ---------------------------------------------------------------------- */
  function valueHtml(v) {
    if (isEmpty(v)) return '<span class="empty">Not answered</span>';
    if (Array.isArray(v)) {
      return v.map(function (x) { return '<span class="pill">' + esc(x) + "</span>"; }).join("");
    }
    return esc(String(v)).replace(/\n/g, "<br>");
  }

  function renderReview() {
    var S = sections();
    var groups = S.map(function (sec, idx) {
      var rows = sec.q.map(function (q) {
        return "<dt>" + esc(q[1]) + "</dt><dd class=\"" + (isEmpty(state.data[q[0]]) ? "empty" : "") + "\">" + valueHtml(state.data[q[0]]) + "</dd>";
      }).join("");
      return '<article class="review-card">' +
        '<div class="review-head"><h3>' + esc(sec.n) + "</h3>" +
        '<button class="edit-btn" type="button" data-edit="' + idx + '">' + IC.edit + " Edit</button></div>" +
        '<dl class="review-dl">' + rows + "</dl></article>";
    }).join("");

    view.innerHTML =
      '<section class="screen">' +
        '<p class="eyebrow"><span class="num">' + pad(S.length + 1) + "</span><span>Before you send</span></p>" +
        '<h2 class="display">One last look</h2>' +
        '<p class="lead">Check that everything reads correctly. You can change any answer now. Nothing is sent until you press send.</p>' +
        '<div class="review-list">' + groups + "</div>" +
        '<div class="send-card">' +
          "<h3>Send your brief</h3>" +
          "<p>Your answers are attached as a formatted PDF and sent to <span class=\"send-to\">" + esc(CFG.email) + "</span>.</p>" +
          '<label class="consent" id="consentWrap"><input type="checkbox" id="consent">' +
          "<span>I am happy for " + esc(CFG.studio) + " to contact me about this project. My answers will only be used to prepare a proposal.</span></label>" +
          '<div class="send-status" id="sendStatus"></div>' +
        "</div>" +
      "</section>";
  }

  /* ---------------------------------------------------------------------- */
  /* Rendering: done                                                         */
  /* ---------------------------------------------------------------------- */
  function renderDone() {
    var r = state.result || { ok: false, reason: "unknown" };
    var ok = !!r.ok;
    var heading = ok ? (r.unverified ? "Your brief has been sent." : "Thank you. Your brief is in.") : "Your brief is ready to send.";
    var lead;
    if (ok) {
      lead = r.unverified
        ? "Your answers are on their way to " + esc(CFG.email) + ", with the PDF brief attached. If anything changes in the next day, reply to our confirmation email."
        : "A copy has been emailed to " + esc(CFG.email) + ". We will review it and reply within one working day with the next step.";
    } else if (r.reason === "file") {
      lead = "This page is open directly from a file on this device, so it cannot send email by itself. Your answers are complete and saved. Download the PDF and reply to the email, or send it from the hosted page.";
    } else {
      lead = "Your answers are complete and saved, but the email service did not confirm delivery. Download the PDF and send it to us, or try again.";
    }

    var alertHtml = "";
    if (!ok) {
      var msg = r.detail ? esc(r.detail) : "We could not confirm that the email was delivered.";
      alertHtml = '<div class="alert">' + IC.alert +
        "<div><b>Nothing is lost.</b> " + msg +
        " You can download the PDF below and email it to <a href=\"mailto:" + esc(CFG.email) + "\">" + esc(CFG.email) + "</a>." +
        (r.reason !== "file" ? " If this is the first submission, check that inbox for a one-time activation link from FormSubmit, click it, then try again." : "") +
        "</div></div>";
    } else if (r.note) {
      alertHtml = '<div class="alert">' + IC.alert + "<div>" + esc(r.note) + "</div></div>";
    }

    view.innerHTML =
      '<section class="screen done">' +
        '<div class="seal">' + (ok ? IC.check : IC.alert) + "</div>" +
        "<h1>" + heading + "</h1>" +
        '<p class="lead">' + lead + "</p>" +
        '<div class="done-ref">Reference <b>' + esc(state.ref) + "</b></div>" +
        alertHtml +
        '<div class="done-actions">' +
          '<button class="btn btn-primary" id="doneDownload" type="button">' + IC.download + " Download PDF</button>" +
          (ok ? "" : '<button class="btn btn-ghost" id="doneRetry" type="button">Try sending again</button>') +
          (ok ? "" : '<button class="btn btn-ghost" id="doneMail" type="button">' + IC.mail + " Open email app</button>") +
          '<button class="btn btn-quiet" id="doneNew" type="button">Start another brief</button>' +
        "</div>" +
        '<ol class="next-steps">' +
          "<li><b>1</b><strong>We read your brief</strong><span>Usually the same or next working day.</span></li>" +
          "<li><b>2</b><strong>You get a clear plan</strong><span>Scope, timeline and a fixed quote.</span></li>" +
          "<li><b>3</b><strong>We start building</strong><span>Kick-off call, then design and development.</span></li>" +
        "</ol>" +
        '<p class="done-foot">' + esc(CFG.studio) + " &middot; Design. Develop. Grow.</p>" +
      "</section>";
  }

  /* ---------------------------------------------------------------------- */
  /* Rail, mobile bar, action bar                                            */
  /* ---------------------------------------------------------------------- */
  function updateRail() {
    var S = sections();
    var total = questionsOf(S).length;
    var answered = countAnswered(S);
    var pct = total ? Math.round((answered / total) * 100) : 0;
    var showProgress = state.screen !== "welcome";

    var block = $("#progressBlock"), navBlock = $("#navBlock");
    if (block) block.hidden = !showProgress;
    if (navBlock) navBlock.hidden = !showProgress;
    var prep = $("#railPrep");
    if (prep) prep.hidden = !(state.screen === "welcome" && !hasAnswers());

    var ring = $("#ringFill");
    if (ring) ring.style.strokeDashoffset = String(276.46 * (1 - pct / 100));
    var pctEl = $("#ringPct");
    if (pctEl) pctEl.textContent = pct + "%";

    var title = $("#progressTitle"), sub = $("#progressSub");
    if (title) {
      title.textContent = state.screen === "done" ? "Brief sent" :
        state.screen === "review" ? "Review" :
        "Step " + (state.step + 1) + " of " + S.length;
    }
    if (sub) sub.textContent = answered + " of " + total + " answered";

    var nav = $("#nav");
    if (nav) {
      nav.innerHTML = S.map(function (sec, i) {
        var isCurrent = state.screen === "form" && i === state.step;
        var isDone = (state.screen !== "welcome") && (i < state.step || state.screen === "review" || state.screen === "done");
        var cls = isCurrent ? "is-current" : isDone ? "is-done" : "";
        var disabled = i > state.maxStep;
        return '<li class="' + cls + '"><button class="step-btn" type="button" data-step="' + i + '"' +
          (disabled ? " disabled" : "") + ' aria-current="' + (isCurrent ? "step" : "false") + '">' +
          '<span class="dot" aria-hidden="true">' + (isDone ? "\u2713" : i + 1) + "</span>" +
          "<span>" + esc(sec.n) + "</span></button></li>";
      }).join("");
    }

    var reset = $("#resetBtn");
    if (reset) reset.hidden = !hasAnswers() || state.screen === "done";
  }

  function updateActionbar() {
    var bar = $("#actionbar");
    if (!bar) return;
    var show = state.screen === "form" || state.screen === "review";
    bar.hidden = !show;
    if (!show) return;

    var back = $("#btnBack"), next = $("#btnNext");
    if (back) back.classList.toggle("ghost-hidden", state.screen === "form" && state.step === 0);
    if (next) {
      var label = state.screen === "review" ? "Send my brief" :
        state.step === sections().length - 1 ? "Review answers" : "Continue";
      if (state.busy) {
        next.disabled = true;
        next.innerHTML = '<span class="spinner" aria-hidden="true"></span> ' + (state.busyLabel || "Sending...");
      } else {
        next.disabled = false;
        next.innerHTML = esc(label) + (state.screen === "review" ? "" : " " + IC.arrow);
      }
    }
  }

  function updateMobile() {
    var S = sections();
    var stepEl = $("#mobileStep"), barEl = $("#mobileProgress");
    var pct = 0;
    var total = questionsOf(S).length;
    if (total) pct = Math.round((countAnswered(S) / total) * 100);
    if (stepEl) {
      stepEl.textContent = state.screen === "welcome" ? "Project brief" :
        state.screen === "done" ? "Sent" :
        state.screen === "review" ? "Review" :
        "Step " + (state.step + 1) + " / " + S.length;
    }
    if (barEl) barEl.style.width = pct + "%";
  }

  function setBusy(on, label) {
    state.busy = on;
    state.busyLabel = label || "";
    updateActionbar();
    var status = $("#sendStatus");
    if (status) {
      if (on) { status.className = "send-status"; status.innerHTML = '<span class="spinner" aria-hidden="true"></span> ' + esc(label || "Working..."); }
    }
  }

  /* ---------------------------------------------------------------------- */
  /* Render dispatcher                                                       */
  /* ---------------------------------------------------------------------- */
  function render(opts) {
    opts = opts || {};
    var S = sections();
    state.step = Math.min(Math.max(0, state.step), Math.max(0, S.length - 1));
    if (view) view.classList.toggle("is-welcome", state.screen === "welcome");

    if (state.screen === "welcome") renderWelcome();
    else if (state.screen === "form") renderStep();
    else if (state.screen === "review") renderReview();
    else renderDone();

    updateRail();
    updateActionbar();
    updateMobile();

    if (opts.focus !== false) {
      var h = view.querySelector("h1.display, h2.display, h1");
      if (h) {
        h.setAttribute("tabindex", "-1");
        try { h.focus({ preventScroll: true }); } catch (e) { h.focus(); }
      }
    }
    if (opts.scroll !== false) {
      try { window.scrollTo({ top: 0, behavior: opts.smooth ? "smooth" : "auto" }); }
      catch (e) { window.scrollTo(0, 0); }
    }
  }

  /* ---------------------------------------------------------------------- */
  /* Field input handling                                                    */
  /* ---------------------------------------------------------------------- */
  function onInput(e) {
    var t = e.target;
    if (!t || (t.tagName !== "INPUT" && t.tagName !== "TEXTAREA")) return;
    var key = t.getAttribute("data-k") || t.name;
    if (!key) return;

    // Remember which section is on screen before the service list changes.
    var prevSection = key === "svc" ? sections()[state.step] : null;

    if (t.type === "checkbox") {
      state.data[key] = $$('input[name="' + key + '"]:checked', view).map(function (i) { return i.value; });
    } else if (t.type === "radio") {
      state.data[key] = t.value;
    } else {
      state.data[key] = t.value;
    }

    var fs = t.closest(".field");
    if (fs) {
      fs.classList.remove("is-error");
      var m = fs.querySelector(".msg");
      if (m) m.hidden = true;
      t.removeAttribute("aria-invalid");
    }

    if (t.tagName === "TEXTAREA") {
      var counter = fs ? fs.querySelector(".counter") : null;
      if (counter) counter.textContent = t.value.length + " / " + MAXLEN;
      autosize(t);
    }

    if (key === "svc") syncSections(prevSection);

    markSaving();
    updateRail();
    updateMobile();
    hideEmptySummary();
  }

  function hideEmptySummary() {
    var sum = $("#errorSummary");
    if (!sum || sum.hidden) return;
    if (!sum.querySelector("li")) sum.hidden = true;
  }

  function syncSections(prevSection) {
    var S = sections();
    var maxIdx = Math.max(0, S.length - 1);
    state.maxStep = Math.min(state.maxStep, maxIdx);

    // Keep the visitor on the same section if it is still relevant. Ignore the
    // change if they are not on a form step (for example, during a submit).
    if (state.screen === "form" && prevSection) {
      var idx = S.indexOf(prevSection);
      if (idx === -1) {
        state.step = 0;
        state.maxStep = 0;
        render({ smooth: true });
        toast("Sections changed to match your services. Please check the first step.");
        return;
      }
      state.step = idx;
    }
    state.step = Math.min(Math.max(0, state.step), maxIdx);
    updateRail();
    updateMobile();
    updateActionbar();
  }

  /* ---------------------------------------------------------------------- */
  /* Validation                                                              */
  /* ---------------------------------------------------------------------- */
  function checkSection(sec) {
    var problems = [];
    sec.q.forEach(function (q) {
      var k = q[0], label = q[1], type = q[2], required = q[4];
      var v = state.data[k];
      var empty = isEmpty(v);
      var msg = "";
      if (required && empty) {
        msg = type === "c" ? "Choose at least one option." : "This answer is needed to prepare an accurate proposal.";
      } else if (type === "e" && !empty && !isEmail(v)) {
        msg = "Use a valid email address, for example name@company.com.";
      } else if (type === "d" && !empty && String(v) < todayISO()) {
        msg = "Choose today or a future date.";
      }
      if (msg) problems.push({ k: k, label: label, msg: msg });
    });
    return problems;
  }

  function markProblems(problems) {
    $$(".field", view).forEach(function (fs) {
      var m = fs.querySelector(".msg");
      if (m) { m.textContent = ""; m.hidden = true; }
      fs.classList.remove("is-error");
      var ctl = fs.querySelector("input,textarea");
      if (ctl) ctl.removeAttribute("aria-invalid");
    });
    problems.forEach(function (p) {
      var fs = view.querySelector('[data-field="' + p.k + '"]');
      if (!fs) return;
      fs.classList.add("is-error");
      var m = fs.querySelector(".msg");
      if (m) { m.textContent = p.msg; m.hidden = false; }
      var ctl = fs.querySelector("input,textarea");
      if (ctl) ctl.setAttribute("aria-invalid", "true");
    });

    var sum = $("#errorSummary");
    if (!sum) return;
    if (!problems.length) { sum.hidden = true; sum.innerHTML = ""; return; }
    sum.hidden = false;
    sum.innerHTML = "<h3>" + problems.length + " thing" + (problems.length === 1 ? "" : "s") + " to check</h3><ul>" +
      problems.map(function (p) {
        return '<li><button type="button" data-goto="' + p.k + '">' + esc(p.label) + "</button> &mdash; " + esc(p.msg) + "</li>";
      }).join("") + "</ul>";
  }

  function focusProblem(key) {
    var fs = view.querySelector('[data-field="' + key + '"]');
    if (!fs) return;
    var ctl = fs.querySelector('input:not([type="hidden"]),textarea');
    if (ctl) {
      try { ctl.focus({ preventScroll: true }); } catch (e) { ctl.focus(); }
      if (fs.scrollIntoView) fs.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  function validateCurrent() {
    var S = sections();
    var problems = checkSection(S[state.step]);
    markProblems(problems);
    if (problems.length) {
      var first = problems[0].k;
      focusProblem(first);
      announce(problems.length + " question" + (problems.length === 1 ? "" : "s") + " need attention.");
      return false;
    }
    return true;
  }

  function validateAll() {
    var S = sections();
    for (var i = 0; i < S.length; i++) {
      var problems = checkSection(S[i]);
      if (problems.length) {
        state.screen = "form";
        state.step = i;
        render();
        markProblems(problems);
        focusProblem(problems[0].k);
        toast("A required answer is missing. We have taken you back to it.");
        return false;
      }
    }
    return true;
  }

  /* ---------------------------------------------------------------------- */
  /* Navigation                                                              */
  /* ---------------------------------------------------------------------- */
  function goNext() {
    if (state.busy) return;
    if (state.screen === "welcome") {
      state.screen = "form";
      state.step = 0;
      render();
      return;
    }
    var S = sections();
    if (state.screen === "form") {
      if (!validateCurrent()) return;
      if (state.step < S.length - 1) {
        state.step += 1;
        state.maxStep = Math.max(state.maxStep, state.step);
        persist();
        render({ smooth: true });
      } else {
        state.screen = "review";
        state.maxStep = Math.max(state.maxStep, state.step);
        persist();
        render({ smooth: true });
      }
      return;
    }
    if (state.screen === "review") submit();
  }

  function goBack() {
    if (state.busy) return;
    if (state.screen === "review") {
      state.screen = "form";
      state.step = Math.max(0, sections().length - 1);
      render({ smooth: true });
      return;
    }
    if (state.screen === "form") {
      if (state.step > 0) {
        state.step -= 1;
        persist();
        render({ smooth: true });
      } else {
        state.screen = "welcome";
        render();
      }
    }
  }

  function jumpTo(stepIdx) {
    if (state.busy) return;
    var S = sections();
    if (stepIdx < 0 || stepIdx >= S.length) return;
    if (stepIdx > state.maxStep) return;
    if (state.screen === "form" && state.step === stepIdx) return;
    // Leaving the current step: keep whatever is filled in, no blocking.
    state.screen = "form";
    state.step = stepIdx;
    render({ smooth: true });
  }

  function startFresh() {
    if (hasAnswers() && !window.confirm("Start a new brief? This clears the answers saved in this browser.")) return;
    resetAll();
  }

  function resetAll() {
    state.data = {};
    state.step = 0;
    state.maxStep = 0;
    state.result = null;
    state.pdfBlob = null;
    state.screen = "welcome";
    state.ref = makeRef();
    clearStore();
    render({ scroll: false });
    toast("Starting fresh.");
  }

  /* ---------------------------------------------------------------------- */
  /* Plain-text export + PDF                                                 */
  /* ---------------------------------------------------------------------- */
  function plainText() {
    var S = sections();
    var out = "CREATIVE HAIDER - PROJECT BRIEF\n";
    out += "Reference: " + state.ref + "\n";
    out += "Submitted: " + new Date().toLocaleString("en-GB") + "\n";
    S.forEach(function (sec) {
      out += "\n== " + sec.t + " ==\n";
      sec.q.forEach(function (q) {
        var v = state.data[q[0]];
        out += q[1] + ": " + (isEmpty(v) ? "Not answered" : Array.isArray(v) ? v.join(", ") : String(v)) + "\n";
      });
    });
    return out;
  }

  function sanitizeFile(s) {
    return String(s || "Client").replace(/[^\w\-]+/g, "_").replace(/_+/g, "_").replace(/^_|_$/g, "").slice(0, 40) || "Client";
  }
  function pdfName() {
    return "Project-Brief-" + sanitizeFile(state.data.biz || state.data.name) + "-" + state.ref + ".pdf";
  }

  function ensurePdfLib() {
    return new Promise(function (resolve, reject) {
      if (window.jspdf && window.jspdf.jsPDF) return resolve(window.jspdf.jsPDF);
      var existing = document.querySelector('script[data-pdf-lib]');
      var done = false;
      var finish = function (fn) {
        return function () { if (done) return; done = true; fn(); };
      };
      var ok = finish(function () {
        if (window.jspdf && window.jspdf.jsPDF) resolve(window.jspdf.jsPDF);
        else reject(new Error("PDF library did not initialise"));
      });
      var fail = finish(function () { reject(new Error("PDF library could not be loaded")); });
      if (existing) {
        existing.addEventListener("load", ok);
        existing.addEventListener("error", fail);
      } else {
        var s = document.createElement("script");
        s.src = CFG.pdfCdn;
        s.async = true;
        s.setAttribute("data-pdf-lib", "1");
        s.addEventListener("load", ok);
        s.addEventListener("error", fail);
        document.head.appendChild(s);
      }
      setTimeout(fail, 12000);
    });
  }

  function makePdf() {
    return ensurePdfLib().then(function (jsPDF) {
      return getLogoImage().then(function (im) {
        var cv = document.createElement("canvas");
        cv.width = im.naturalWidth;
        cv.height = im.naturalHeight;
        cv.getContext("2d").drawImage(im, 0, 0);
        var logo = cv.toDataURL("image/png");

        var doc = new jsPDF({ unit: "mm", format: "a4", compress: true });
        var W = 210, H = 297, M = 18, TW = W - 2 * M;
        var DARK = [21, 23, 28], GOLD = [224, 168, 28], INK = [27, 30, 37],
          MUTED = [104, 110, 124], SOFT = [217, 220, 226], PANEL = [238, 238, 243], LINE = [224, 223, 217];
        var y = 0;

        function fill(c) { doc.setFillColor(c[0], c[1], c[2]); }
        function ink(c) { doc.setTextColor(c[0], c[1], c[2]); }
        function header(full) {
          if (full) {
            fill(DARK); doc.rect(0, 0, W, 42, "F");
            fill(GOLD); doc.rect(0, 42, W, 1.2, "F");
            return;
          }
          // Slim band on continuation pages: small mark, reference on the right.
          fill(DARK); doc.rect(0, 0, W, 14, "F");
          fill(GOLD); doc.rect(0, 14, W, 1, "F");
          var sw = 24, sh = sw * (im.naturalHeight / im.naturalWidth);
          doc.addImage(logo, "PNG", M, (14 - sh) / 2, sw, sh);
          doc.setFont("helvetica", "bold");
          doc.setFontSize(8.2);
          ink(GOLD);
          doc.text("Project brief", W - M, 9.2, { align: "right" });
          doc.setFont("helvetica", "normal");
          doc.setFontSize(7.4);
          ink([160, 165, 175]);
          doc.text(state.ref, W - M, 12.4, { align: "right" });
        }
        function need(h) {
          if (y + h > 276) {
            doc.addPage();
            header(false);
            y = 23; // clear the 14 mm continuation band
          }
        }

        var BIZ = (state.data.biz || state.data.name || "").toString();

        header(true);
        var lw = 56, lh = lw * (im.naturalHeight / im.naturalWidth);
        doc.addImage(logo, "PNG", M, 10, lw, lh);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(17);
        ink(GOLD);
        doc.text("Project brief", W - M, 19, { align: "right" });
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9.5);
        ink(SOFT);
        if (BIZ) doc.text(BIZ.slice(0, 58), W - M, 26, { align: "right" });
        doc.setFontSize(8.5);
        ink([160, 165, 175]);
        doc.text(new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }), W - M, 32, { align: "right" });
        doc.text("Ref " + state.ref, W - M, 37, { align: "right" });

        y = 54;

        /* contact summary panel */
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10.2);
        var rows = [
          ["Client", state.data.name],
          ["Email", state.data.email],
          ["Phone", state.data.phone],
          ["Business", state.data.biz],
          ["Services", (state.data.svc || []).join(", ")]
        ].filter(function (r) { return !isEmpty(r[1]); }).map(function (r) {
          return [r[0], doc.splitTextToSize(String(r[1]), TW - 40)];
        });
        var bh = rows.reduce(function (t, r) { return t + r[1].length * 4.6 + 2.5; }, 0) + 7;
        fill(PANEL);
        doc.roundedRect(M, y, TW, bh, 2.2, 2.2, "F");
        var yy = y + 8;
        rows.forEach(function (r) {
          doc.setFont("helvetica", "bold"); doc.setFontSize(8.6); ink([104, 110, 124]);
          doc.text(r[0], M + 5, yy);
          doc.setFont("helvetica", "normal"); doc.setFontSize(10.2); ink(INK);
          doc.text(r[1], M + 36, yy);
          yy += r[1].length * 4.6 + 2.5;
        });
        y += bh + 13;

        /* answers by section */
        var S = sections();
        var skipped = [];
        S.forEach(function (sec) {
          var items = [];
          sec.q.forEach(function (q) {
            var v = state.data[q[0]];
            if (isEmpty(v)) skipped.push(q[1]);
            else items.push([q[1], Array.isArray(v) ? v.join(", ") : String(v)]);
          });
          if (!items.length) return;
          need(22);
          fill(GOLD); doc.rect(M, y - 4.2, 1.8, 6.2, "F");
          doc.setFont("helvetica", "bold"); doc.setFontSize(12.5); ink(DARK);
          doc.text(sec.n, M + 5, y);
          y += 8;
          items.forEach(function (it) {
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10.2);
            var lines = doc.splitTextToSize(it[1], TW - 4);
            need(11 + lines.length * 4.7);
            doc.setFont("helvetica", "bold"); doc.setFontSize(8.4); ink([104, 110, 124]);
            doc.text(it[0], M, y);
            y += 4.6;
            doc.setFont("helvetica", "normal"); doc.setFontSize(10.2); ink(INK);
            doc.text(lines, M, y);
            y += lines.length * 4.7 + 2.5;
            doc.setDrawColor(LINE[0], LINE[1], LINE[2]);
            doc.setLineWidth(0.15);
            doc.line(M, y, W - M, y);
            y += 4.4;
          });
          y += 4;
        });

        /* open questions */
        if (skipped.length) {
          need(20);
          fill(GOLD); doc.rect(M, y - 4.2, 1.8, 6.2, "F");
          doc.setFont("helvetica", "bold"); doc.setFontSize(11); ink(DARK);
          doc.text("Still to confirm", M + 5, y);
          y += 7.5;
          doc.setFont("helvetica", "normal");
          doc.setFontSize(9);
          var left = doc.splitTextToSize(skipped.join("  \u00b7  "), TW);
          need(left.length * 4.4);
          doc.setFont("helvetica", "normal"); doc.setFontSize(9); ink(MUTED);
          doc.text(left, M, y);
          y += left.length * 4.4 + 6;
        }

        need(16);
        doc.setDrawColor(GOLD[0], GOLD[1], GOLD[2]);
        doc.setLineWidth(0.4);
        doc.line(M, y, M + 22, y);
        y += 6;
        doc.setFont("helvetica", "bold"); doc.setFontSize(9.5); ink(INK);
        doc.text("Prepared by " + CFG.studio, M, y);
        doc.setFont("helvetica", "normal"); doc.setFontSize(9); ink(MUTED);
        y += 4.8;
        doc.text("Thank you for the time you put into this brief. We will reply within one working day.", M, y);

        /* footer on every page */
        var pages = doc.getNumberOfPages();
        for (var p = 1; p <= pages; p++) {
          doc.setPage(p);
          doc.setDrawColor(LINE[0], LINE[1], LINE[2]);
          doc.setLineWidth(0.2);
          doc.line(M, 282, W - M, 282);
          doc.setFont("helvetica", "normal"); doc.setFontSize(7.6); ink([124, 130, 144]);
          doc.text(CFG.studio + "  \u00b7  Design. Develop. Grow.", M, 287);
          doc.text("Page " + p + " of " + pages + "  \u00b7  " + state.ref, W - M, 287, { align: "right" });
        }

        return doc;
      });
    });
  }

  function triggerDownload(blob, filename) {
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      URL.revokeObjectURL(url);
      if (a.parentNode) a.parentNode.removeChild(a);
    }, 1500);
  }

  function downloadPdf() {
    var btn = $("#doneDownload");
    if (btn) { btn.disabled = true; btn.innerHTML = '<span class="spinner" aria-hidden="true"></span> Preparing...'; }
    var finish = function () {
      if (btn) { btn.disabled = false; btn.innerHTML = IC.download + " Download PDF"; }
    };
    if (state.pdfBlob) {
      triggerDownload(state.pdfBlob, pdfName());
      finish();
      return;
    }
    makePdf().then(function (doc) {
      state.pdfBlob = doc.output("blob");
      triggerDownload(state.pdfBlob, pdfName());
      finish();
    }).catch(function (err) {
      console.warn(err);
      // Last resort: a readable text copy, so the client is never stranded.
      triggerDownload(new Blob([plainText()], { type: "text/plain;charset=utf-8" }), pdfName().replace(/\.pdf$/, ".txt"));
      toast("The PDF library was unavailable, so a text copy was downloaded instead.");
      finish();
    });
  }

  /* ---------------------------------------------------------------------- */
  /* Delivery                                                               */
  /* ---------------------------------------------------------------------- */
  function resolveMode() {
    if (CFG.delivery === "apps-script") return CFG.appsScriptUrl ? "apps-script" : "manual";
    if (CFG.delivery === "formsubmit") return location.protocol === "file:" ? "manual" : "formsubmit";
    if (CFG.delivery === "manual") return "manual";
    if (CFG.appsScriptUrl) return "apps-script";
    if (location.protocol === "file:") return "manual";
    return "formsubmit";
  }

  function fetchTimeout(url, options, ms) {
    if (typeof AbortController === "undefined") return fetch(url, options);
    var ctrl = new AbortController();
    var timer = setTimeout(function () { ctrl.abort(); }, ms || 30000);
    options.signal = ctrl.signal;
    return fetch(url, options).finally(function () { clearTimeout(timer); });
  }

  function formSubmitBody(withPdf) {
    var fd = new FormData();
    fd.append("_subject", "Project brief: " + (state.data.biz || state.data.name || "New client") + " (" + state.ref + ")");
    fd.append("_template", "table");
    fd.append("_captcha", "false");
    fd.append("_honey", "");
    fd.append("name", state.data.name || "");
    fd.append("email", state.data.email || "");
    fd.append("phone", state.data.phone || "");
    fd.append("business", state.data.biz || "");
    fd.append("services", (state.data.svc || []).join(", "));
    fd.append("reference", state.ref);
    fd.append("message", plainText());
    if (withPdf && state.pdfBlob) {
      try { fd.append("attachment", state.pdfBlob, pdfName()); } catch (e) { /* ignore */ }
    }
    return fd;
  }

  function readJson(r) {
    return r.json().catch(function () { return {}; });
  }
  function formSubmitOk(j) {
    return !!j && (j.success === true || j.success === "true");
  }

  function deliverWithFormSubmit() {
    var url = "https://formsubmit.co/ajax/" + encodeURIComponent(CFG.email);
    var attempt = function (withPdf) {
      return fetchTimeout(url, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formSubmitBody(withPdf)
      }, 30000).then(function (r) {
        return readJson(r).then(function (j) { return { status: r.status, json: j }; });
      });
    };
    return attempt(true).then(function (first) {
      if (formSubmitOk(first.json)) return { ok: true };
      var firstMsg = (first.json && first.json.message) || "";
      return attempt(false).then(function (second) {
        if (formSubmitOk(second.json)) {
          return { ok: true, note: "Your brief was sent, but the PDF attachment could not be included. The full answers are in the email body." };
        }
        var msg = (second.json && second.json.message) || firstMsg || ("The email service replied with status " + second.status + ".");
        return { ok: false, reason: "rejected", detail: "The email service replied: " + msg };
      });
    });
  }

  function blobToBase64(blob) {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onload = function () {
        var s = String(reader.result || "");
        var i = s.indexOf(",");
        resolve(i >= 0 ? s.slice(i + 1) : s);
      };
      reader.onerror = function () { reject(new Error("Could not read the PDF file")); };
      reader.readAsDataURL(blob);
    });
  }

  function deliverWithAppsScript() {
    var payload = {
      secret: CFG.appsScriptSecret,
      subject: "Project brief: " + (state.data.biz || state.data.name || "New client") + " (" + state.ref + ")",
      reference: state.ref,
      name: state.data.name || "",
      email: state.data.email || "",
      phone: state.data.phone || "",
      business: state.data.biz || "",
      services: (state.data.svc || []).join(", "),
      formUrl: location.href,
      message: plainText(),
      pdfName: pdfName(),
      pdfBase64: ""
    };
    var withPdf = state.pdfBlob
      ? blobToBase64(state.pdfBlob).then(function (b64) { payload.pdfBase64 = b64; })
      : Promise.resolve();

    return withPdf.then(function () {
      // Apps Script web apps do not send CORS headers, so the response is
      // opaque by design. A resolved fetch means the request left the browser.
      return fetch(CFG.appsScriptUrl, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload)
      });
    }).then(function () {
      return { ok: true, unverified: true };
    });
  }

  function mailtoHref() {
    var subject = "Project brief: " + (state.data.biz || state.data.name || "New client") + " (" + state.ref + ")";
    var body = plainText();
    if (body.length > 1700) body = body.slice(0, 1700) + "\n\n[Full answers are in the attached PDF.]";
    return "mailto:" + CFG.email + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
  }

  function submit() {
    if (state.busy) return;

    var consent = $("#consent");
    var wrap = $("#consentWrap");
    var status = $("#sendStatus");
    if (consent && !consent.checked) {
      if (wrap) {
        wrap.classList.add("is-error");
        if (wrap.scrollIntoView) wrap.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      if (status) {
        status.className = "send-status is-error";
        status.textContent = "Please confirm we may contact you before sending.";
      }
      try { consent.focus(); } catch (e) { /* noop */ }
      return;
    }
    if (!validateAll()) return;

    state.busy = true;
    state.busyLabel = "Preparing PDF";
    updateActionbar();
    if (status) { status.className = "send-status"; status.innerHTML = '<span class="spinner" aria-hidden="true"></span> Preparing your PDF...'; }

    var pdfPromise = makePdf().then(function (doc) {
      state.pdfBlob = doc.output("blob");
    }).catch(function (err) {
      console.warn("PDF unavailable:", err);
      state.pdfBlob = null;
    });

    pdfPromise.then(function () {
      var mode = resolveMode();
      if (status) status.innerHTML = '<span class="spinner" aria-hidden="true"></span> Sending to ' + esc(CFG.email) + "...";

      if (mode === "manual") {
        state.busy = false;
        state.result = { ok: false, reason: "file" };
        state.screen = "done";
        render();
        return null;
      }

      var job = mode === "apps-script" ? deliverWithAppsScript() : deliverWithFormSubmit();
      return job.then(function (res) {
        state.busy = false;
        if (res.ok) {
          clearStore();
          state.result = res;
          state.screen = "done";
          state.maxStep = sections().length;
          render();
        } else {
          state.result = res;
          state.screen = "done";
          render();
        }
      });
    }).catch(function (err) {
      console.warn(err);
      state.busy = false;
      var offline = typeof navigator !== "undefined" && navigator.onLine === false;
      state.result = {
        ok: false,
        reason: "network",
        detail: offline
          ? "You appear to be offline. Reconnect and try again."
          : "The email service could not be reached from this browser."
      };
      state.screen = "done";
      render();
    });
  }

  /* ---------------------------------------------------------------------- */
  /* Misc UI                                                                */
  /* ---------------------------------------------------------------------- */
  var toastTimer = null;
  function toast(msg) {
    var el = $("#toast");
    if (!el) return;
    el.textContent = msg;
    el.classList.add("is-on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove("is-on"); }, 3200);
  }
  function announce(msg) {
    var live = $("#live");
    if (!live) return;
    live.textContent = "";
    setTimeout(function () { live.textContent = msg; }, 60);
  }

  /* ---------------------------------------------------------------------- */
  /* Event wiring                                                            */
  /* ---------------------------------------------------------------------- */
  view.addEventListener("input", onInput);

  view.addEventListener("change", function (e) {
    if (e.target && e.target.id === "consent") {
      var wrap = $("#consentWrap"), status = $("#sendStatus");
      if (wrap) wrap.classList.remove("is-error");
      if (status && status.classList.contains("is-error")) { status.className = "send-status"; status.textContent = ""; }
    }
  });

  view.addEventListener("click", function (e) {
    var edit = e.target.closest("[data-edit]");
    if (edit) {
      var idx = parseInt(edit.getAttribute("data-edit"), 10);
      state.screen = "form";
      state.step = idx;
      render({ smooth: true });
      return;
    }
    var goto = e.target.closest("[data-goto]");
    if (goto) { focusProblem(goto.getAttribute("data-goto")); return; }

    if (e.target.closest("#doneDownload")) { downloadPdf(); return; }
    if (e.target.closest("#doneRetry")) {
      state.screen = "review";
      state.result = null;
      render();
      return;
    }
    if (e.target.closest("#doneMail")) {
      window.location.href = mailtoHref();
      return;
    }
    if (e.target.closest("#doneNew")) { startFresh(); return; }
  });

  var backBtn = $("#btnBack"), nextBtn = $("#btnNext");
  if (backBtn) backBtn.addEventListener("click", goBack);
  if (nextBtn) nextBtn.addEventListener("click", goNext);

  var nav = $("#nav");
  if (nav) {
    nav.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-step]");
      if (!btn || btn.disabled) return;
      jumpTo(parseInt(btn.getAttribute("data-step"), 10));
    });
  }

  document.addEventListener("keydown", function (e) {
    var mod = e.ctrlKey || e.metaKey;
    if (mod && e.key === "Enter") {
      e.preventDefault();
      goNext();
      return;
    }
    if (e.key === "Escape" && state.screen === "done") {
      // no-op: keeps accidental exits predictable
    }
  });

  /* ---------------------------------------------------------------------- */
  /* Boot                                                                    */
  /* ---------------------------------------------------------------------- */
  function boot() {
    state.ref = makeRef();
    primeBrand();
    loadStore();
    state.maxStep = Math.min(state.maxStep, Math.max(0, sections().length - 1));
    state.step = Math.min(state.step, state.maxStep);
    var saveTxt = $("#saveText");
    if (saveTxt) saveTxt.textContent = hasAnswers() ? "Saved " + fmtTime(state.savedAt || Date.now()) : "Answers save automatically";
    render({ scroll: false });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
