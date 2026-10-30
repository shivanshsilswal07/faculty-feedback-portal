/* =========================================================
   FACULTY FEEDBACK & COURSE EVALUATION PORTAL
   script.js
   Plain JavaScript only — no frameworks, no backend.
   Every function below is written to be small and explainable
   in a first-year viva. Section headers match the comments.
   ========================================================= */

/* ---------------------------------------------------------
   0. DEMO / SAMPLE DATA
   This project is a static frontend (GitHub Pages), so there
   is no real database. This object plays the role of a tiny
   "database" that lives only in the browser.
--------------------------------------------------------- */
const courseFacultyData = {
  CSE101: { name: "Programming Fundamentals", faculty: ["Dr. A. Sharma", "Dr. R. Verma"] },
  CSE102: { name: "Computer Organization", faculty: ["Dr. N. Singh"] },
  CSE103: { name: "Data Structures", faculty: ["Dr. A. Sharma", "Dr. P. Kaur"] },
  MTH101: { name: "Engineering Mathematics", faculty: ["Dr. S. Iyer"] },
  PHY101: { name: "Engineering Physics", faculty: ["Dr. M. Rao"] },
  ENG101: { name: "Communication Skills", faculty: ["Ms. K. Bhatia"] },
  CSE104: { name: "Web Technologies", faculty: ["Dr. P. Kaur", "Dr. R. Verma"] },
  ECE101: { name: "Basic Electronics", faculty: ["Dr. N. Singh"] },
};

// Average ratings used to draw the demo bar charts (out of 5).
const facultyRatings = [
  { name: "Dr. A. Sharma", rating: 4.6 },
  { name: "Dr. R. Verma", rating: 4.2 },
  { name: "Dr. N. Singh", rating: 4.5 },
  { name: "Dr. P. Kaur", rating: 4.7 },
  { name: "Dr. S. Iyer", rating: 4.1 },
  { name: "Ms. K. Bhatia", rating: 4.4 },
];

const courseRatings = [
  { name: "CSE101", rating: 4.5 },
  { name: "CSE102", rating: 4.0 },
  { name: "CSE103", rating: 4.6 },
  { name: "MTH101", rating: 3.9 },
  { name: "PHY101", rating: 4.1 },
  { name: "ENG101", rating: 4.3 },
];

/* ---------------------------------------------------------
   LOCAL DATABASE  (NEW)
   All feedback is stored as ONE array of objects. The array is
   turned into text with JSON.stringify and saved in the browser's
   localStorage under one key. Reading it back uses JSON.parse.
   IMPORTANT: localStorage lives inside ONE browser on ONE device.
   A real project would save this on a server instead.
--------------------------------------------------------- */
const DB_KEY = "ffcp_feedback_db";

// SELECT * : read every saved record
function dbReadAll() {
  try {
    return JSON.parse(localStorage.getItem(DB_KEY)) || [];
  } catch (error) {
    return [];
  }
}

// INSERT : add one record (with an id and a date) and save the array
function dbInsert(record) {
  const all = dbReadAll();
  record.id = "FB" + Date.now();
  record.submittedAt = new Date().toISOString();
  all.push(record);
  localStorage.setItem(DB_KEY, JSON.stringify(all));
  return record;
}

// Has this student already rated this course + faculty?
function dbExists(regNo, course, faculty) {
  return dbReadAll().some((r) => r.regNo === regNo && r.course === course && r.faculty === faculty);
}

// Stops text typed by a user from being treated as HTML
function escapeHTML(text) {
  return String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/* ---------------------------------------------------------
   1. MOBILE NAVIGATION TOGGLE
   The hamburger button toggles a CSS class that shows/hides
   the nav list on small screens (see style.css media query).
--------------------------------------------------------- */
function initMobileNav() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".main-nav");
  if (!toggle || !nav) return;
  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });
}

/* ---------------------------------------------------------
   2. FOOTER YEAR
   Keeps the copyright year correct without editing HTML.
--------------------------------------------------------- */
function initFooterYear() {
  const el = document.getElementById("current-year");
  if (el) el.textContent = new Date().getFullYear();
}

/* ---------------------------------------------------------
   3. RANGE SLIDER LIVE OUTPUT
   Every <input type="range"> with data-output="id" updates
   the element with that id as the slider moves.
--------------------------------------------------------- */
function initRangeOutputs() {
  document.querySelectorAll('input[type="range"][data-output]').forEach((slider) => {
    const output = document.getElementById(slider.dataset.output);
    const sync = () => { if (output) output.textContent = slider.value; };
    slider.addEventListener("input", sync);
    sync();
  });
}

/* ---------------------------------------------------------
   4. STUDENT LOGIN (DEMO ONLY)
   IMPORTANT: This is NOT real authentication. No password is
   checked against a server because there is no server. We only
   simulate a logged-in state using localStorage so the rest of
   the site (dashboard, feedback form) can greet the student.
--------------------------------------------------------- */
function initLoginForm() {
  const form = document.getElementById("login-form");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const studentId = document.getElementById("login-id").value.trim();
    const email = document.getElementById("login-email").value.trim();
    const msg = document.getElementById("login-msg");

    if (!studentId || !email) {
      showMessage(msg, "error", "Please fill in your Student ID and email to continue.");
      return;
    }

    // Simulate a successful login — store demo session data only.
    localStorage.setItem("ffcp_student_id", studentId);
    localStorage.setItem("ffcp_student_email", email);
    showMessage(msg, "success", "Login successful. Redirecting to your dashboard...");

    setTimeout(() => { window.location.href = "dashboard.html"; }, 900);
  });
}

/* ---------------------------------------------------------
   5. DASHBOARD GREETING
   Reads the demo session written by initLoginForm() and shows
   a personalized greeting. If no session exists, the visitor
   is invited to log in first (no hard redirect, since a viva
   evaluator may open dashboard.html directly).
--------------------------------------------------------- */
function initDashboardGreeting() {
  const greetEl = document.getElementById("dashboard-greeting");
  if (!greetEl) return;
  const studentId = localStorage.getItem("ffcp_student_id");
  greetEl.textContent = studentId
    ? `Welcome back, ${studentId}.`
    : "Welcome, guest. Log in to see your personalized status.";
}

/* ---------------------------------------------------------
   6. FEEDBACK FORM: dynamic faculty dropdown
   When a student picks a course, the faculty <select> is
   refilled with only the faculty who teach that course.
   This demonstrates reading form data and writing new
   <option> elements into the DOM.
--------------------------------------------------------- */
function initCourseFacultyLink() {
  const courseSelect = document.getElementById("fb-course");
  const facultySelect = document.getElementById("fb-faculty");
  if (!courseSelect || !facultySelect) return;

  courseSelect.addEventListener("change", () => {
    const data = courseFacultyData[courseSelect.value];
    facultySelect.innerHTML = '<option value="">Select faculty</option>';
    if (!data) return;
    data.faculty.forEach((name) => {
      const opt = document.createElement("option");
      opt.value = name;
      opt.textContent = name;
      facultySelect.appendChild(opt);
    });
  });
}

/* ---------------------------------------------------------
   7. FEEDBACK FORM: save to the database + duplicate prevention
   (CHANGED) The form now saves a full record, including the
   student's name and registration number, in the local database.
--------------------------------------------------------- */
function initFeedbackForm() {
  const form = document.getElementById("feedback-form");
  if (!form) return;
  const msg = document.getElementById("feedback-msg");

  // If the student logged in, fill the registration number and email.
  const savedId = localStorage.getItem("ffcp_student_id");
  const savedEmail = localStorage.getItem("ffcp_student_email");
  if (savedId) document.getElementById("fb-reg").value = savedId;
  if (savedEmail) document.getElementById("fb-email").value = savedEmail;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);          // reads every field by its name attribute

    const name = data.get("studentName").trim();
    const regNo = data.get("regNo").trim();
    const course = data.get("course");
    const faculty = data.get("faculty");
    const mode = data.get("fb-mode");

    if (name.length < 3) {
      showMessage(msg, "error", "Please enter your full name.");
      return;
    }
    if (!/^[0-9]{8}$/.test(regNo)) {
      showMessage(msg, "error", "Your registration number must be exactly 8 digits.");
      return;
    }
    if (!course || !faculty) {
      showMessage(msg, "error", "Please select both a course and a faculty member.");
      return;
    }
    if (!mode) {
      showMessage(msg, "error", "Please choose Anonymous or Identified feedback mode.");
      return;
    }
    if (!document.getElementById("fb-confirm").checked) {
      showMessage(msg, "error", "Please confirm that this feedback is genuine before submitting.");
      return;
    }

    // One submission per student + course + faculty (checked in the database).
    if (dbExists(regNo, course, faculty)) {
      showMessage(msg, "error", `You have already submitted feedback for ${course} / ${faculty}.`);
      return;
    }

    const record = {
      name: name,
      regNo: regNo,
      email: (data.get("email") || "").trim(),
      course: course,
      courseName: courseFacultyData[course].name,
      faculty: faculty,
      section: (data.get("section") || "").trim(),
      semester: data.get("semester") || "",
      mode: mode,
      ratings: {
        overall: Number(data.get("ratingOverall")),
        clarity: Number(data.get("ratingClarity")),
        effectiveness: Number(data.get("ratingEffectiveness")),
        knowledge: Number(data.get("ratingKnowledge")),
        interaction: Number(data.get("ratingInteraction")),
        examples: Number(data.get("ratingExamples")),
        material: Number(data.get("ratingMaterial")),
        punctuality: Number(data.get("ratingPunctuality")),
        doubts: Number(data.get("ratingDoubts")),
      },
      comments: {
        liked: (data.get("liked") || "").trim(),
        improve: (data.get("improve") || "").trim(),
        suggestions: (data.get("suggestions") || "").trim(),
      },
      recommend: data.get("fb-recommend"),
    };

    dbInsert(record);                         // <-- saved in the local database
    showMessage(msg, "success", "Thank you, " + escapeHTML(name.split(" ")[0]) + "! Your feedback was saved and now appears under Recent Feedback below.");
    form.reset();
    document.getElementById("fb-faculty").innerHTML = '<option value="">Select course first</option>';
    syncRangeOutputs();
    if (savedId) document.getElementById("fb-reg").value = savedId;
    if (savedEmail) document.getElementById("fb-email").value = savedEmail;
    renderRecentFeedback();                   // show the new feedback straight away
  });
}

/* ---------------------------------------------------------
   7b. RECENT FEEDBACK (NEW)
   Reads the database and shows the newest records as cards.
   Anonymous students are never named. The registration number
   is never shown.
--------------------------------------------------------- */
function starText(value) {
  return "\u2605".repeat(value) + "\u2606".repeat(5 - value);
}

function renderRecentFeedback() {
  const box = document.getElementById("recent-feedback");
  if (!box) return;
  const limit = Number(box.dataset.limit) || 6;
  const records = dbReadAll()
    .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt))   // newest first
    .slice(0, limit);

  if (records.length === 0) {
    box.innerHTML = '<div class="empty-state"><p>No feedback has been submitted yet. Be the first to share yours.</p></div>';
    return;
  }

  box.innerHTML = records.map((r) => {
    const who = r.mode === "anonymous" ? "Anonymous student" : escapeHTML(r.name);
    const badge = r.mode === "anonymous"
      ? '<span class="badge badge-pending">Anonymous</span>'
      : '<span class="badge badge-success">Identified</span>';
    const date = new Date(r.submittedAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
    const comment = r.comments.liked || r.comments.improve || "No written comment.";
    return '<article class="record-card">' +
      '<header class="record-head"><div><h3>' + r.course + " &middot; " + escapeHTML(r.courseName) + "</h3>" +
      '<p class="record-meta">' + escapeHTML(r.faculty) + "</p></div>" + badge + "</header>" +
      '<p class="record-stars" aria-label="Overall rating ' + r.ratings.overall + ' out of 5">' + starText(r.ratings.overall) + " <strong>" + r.ratings.overall + "/5</strong></p>" +
      "<blockquote>" + escapeHTML(comment) + "</blockquote>" +
      '<footer class="record-foot"><small>' + who + " &middot; <time datetime=\"" + r.submittedAt + '">' + date + "</time></small></footer></article>";
  }).join("");
}

// Puts the number beside each slider back in step after a form reset.
function syncRangeOutputs() {
  document.querySelectorAll('input[type="range"][data-output]').forEach((slider) => {
    const output = document.getElementById(slider.dataset.output);
    if (output) output.textContent = slider.value;
  });
}

/* ---------------------------------------------------------
   8. Small shared helper for showing form messages.
--------------------------------------------------------- */
function showMessage(el, type, text) {
  if (!el) return;
  el.textContent = text;
  el.className = `form-msg show ${type}`;
}

/* ---------------------------------------------------------
   9. DASHBOARD BAR CHARTS (CSS-only bars, built with JS)
   Reads the facultyRatings / courseRatings arrays above and
   builds one .bar-row per entry — this avoids any charting
   library while still producing a graphical report.
--------------------------------------------------------- */
function renderBarChart(containerId, dataset) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = "";
  dataset.forEach((item) => {
    const percent = (item.rating / 5) * 100;
    const row = document.createElement("div");
    row.className = "bar-row";
    row.innerHTML = `
      <span>${item.name}</span>
      <span class="bar-track"><span class="bar-fill" style="width:${percent}%"></span></span>
      <span class="bar-value">${item.rating.toFixed(1)}/5</span>
    `;
    container.appendChild(row);
  });
}

// Average of a list of numbers
function average(numbers) {
  return numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
}

// Groups saved records by faculty or course and averages their ratings (NEW)
function groupAverages(records, keyOf, scoreOf) {
  const groups = {};
  records.forEach((r) => {
    const key = keyOf(r);
    if (!groups[key]) groups[key] = [];
    groups[key].push(scoreOf(r));
  });
  return Object.keys(groups).map((name) => ({ name: name, rating: average(groups[name]) }))
    .sort((a, b) => b.rating - a.rating);
}

// The charts use LIVE data when the database has records, otherwise the demo data.
function initDashboards() {
  const records = dbReadAll();
  const live = records.length > 0;
  const facultyScore = (r) => average([r.ratings.clarity, r.ratings.effectiveness, r.ratings.knowledge, r.ratings.interaction, r.ratings.examples, r.ratings.punctuality, r.ratings.doubts]);
  const courseScore = (r) => average([r.ratings.overall, r.ratings.material]);
  renderBarChart("faculty-bar-chart", live ? groupAverages(records, (r) => r.faculty, facultyScore) : facultyRatings);
  renderBarChart("course-bar-chart", live ? groupAverages(records, (r) => r.course, courseScore) : courseRatings);
  document.querySelectorAll(".chart-source").forEach((el) => {
    el.textContent = live ? "Live data from the local database (" + records.length + " submissions)" : "Demo data (no feedback saved yet)";
  });
}

/* ---------------------------------------------------------
   10. RUN EVERYTHING ONCE THE DOM IS READY
--------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  initMobileNav();
  initFooterYear();
  initRangeOutputs();
  initLoginForm();
  initDashboardGreeting();
  initCourseFacultyLink();
  initFeedbackForm();
  initDashboards();
  renderRecentFeedback();
});
