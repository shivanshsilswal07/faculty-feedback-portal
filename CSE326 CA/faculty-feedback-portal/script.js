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
   7. FEEDBACK FORM: submission + duplicate prevention
   Because there is no database, "already submitted" is
   simulated with a localStorage flag keyed by student + course
   + faculty. This is clearly a frontend demonstration only.
--------------------------------------------------------- */
function initFeedbackForm() {
  const form = document.getElementById("feedback-form");
  if (!form) return;
  const msg = document.getElementById("feedback-msg");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const mode = form.querySelector('input[name="fb-mode"]:checked');
    const course = document.getElementById("fb-course").value;
    const faculty = document.getElementById("fb-faculty").value;
    const confirmBox = document.getElementById("fb-confirm");
    const studentId = document.getElementById("fb-student-id").value.trim();

    if (!course || !faculty) {
      showMessage(msg, "error", "Please select both a course and a faculty member.");
      return;
    }
    if (!mode) {
      showMessage(msg, "error", "Please choose Anonymous or Identified feedback mode.");
      return;
    }
    if (!confirmBox.checked) {
      showMessage(msg, "error", "Please confirm that this feedback is genuine before submitting.");
      return;
    }

    // Build a duplicate-submission key. Anonymous submissions use
    // a generic key so the demo can still show the duplicate check
    // without storing an identifying student ID.
    const idPart = mode.value === "identified" && studentId ? studentId : "anonymous-demo-user";
    const submissionKey = `ffcp_submitted_${idPart}_${course}_${faculty}`.replace(/\s+/g, "-");

    if (localStorage.getItem(submissionKey)) {
      showMessage(msg, "error", `You have already submitted feedback for ${course} / ${faculty}.`);
      return;
    }

    localStorage.setItem(submissionKey, "true");
    showMessage(msg, "success", "Thank you — your feedback has been recorded for this demo session.");
    form.reset();
    // Faculty dropdown must be reset back to its placeholder state too.
    document.getElementById("fb-faculty").innerHTML = '<option value="">Select course first</option>';
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

function initDashboards() {
  renderBarChart("faculty-bar-chart", facultyRatings);
  renderBarChart("course-bar-chart", courseRatings);
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
});
