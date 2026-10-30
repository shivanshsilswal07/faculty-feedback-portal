# Faculty Feedback & Course Evaluation Portal

A web-based academic feedback system built as a **CA1 project** for B.Tech CSE (1st year), Lovely Professional University.

Built with **HTML5, CSS3 and plain JavaScript** — no frameworks, no build tools, no backend.

---

## Problem Statement

The Faculty Feedback & Course Evaluation Portal is a web-based system that enables students to provide structured feedback about courses and faculty members. Students can select a course or faculty member and submit ratings using stars, sliders, scales, or predefined questions. The platform supports anonymous feedback while maintaining validation to prevent duplicate or invalid submissions. Administrators view summarized results through dashboards containing average ratings, charts, and course-wise or faculty-wise analysis.

## Objective

Make academic feedback faster, more organized, data-driven, and easier for administrators to analyze — while demonstrating HTML fundamentals, semantic HTML and HTML forms.

---

## Features

- Structured course and faculty evaluation form with sliders, selects, radios and text areas
- Anonymous or identified feedback mode, with the difference explained at the point of choice
- Dynamic faculty dropdown driven by the selected course
- HTML5 + JavaScript form validation with friendly inline messages
- Duplicate-submission prevention (browser-side demonstration)
- Student dashboard showing per-course feedback status
- Admin dashboard with summary statistics, CSS bar charts and comparison tables
- Public analytics page with rating distribution
- Course & faculty mapping table
- Frontend-only login simulation
- Fully responsive layout (desktop, tablet, mobile)

## Technologies Used

| Technology | Role |
|---|---|
| HTML5 | Structure, semantics, forms, tables, media |
| CSS3 | Custom properties, Grid, Flexbox, media queries |
| JavaScript (vanilla) | Validation, DOM updates, localStorage demo, charts |
| GitHub Pages | Static hosting |

## HTML Concepts Demonstrated

Document structure (`<!DOCTYPE>`, `<html>`, `<head>`, `<meta>`, `<title>`, `<body>`), headings `h1`–`h4`, `<p>`, `<strong>`, `<em>`, `<mark>`, `<small>`, `<hr>`, links and anchor navigation, `<img>` with `alt`, `<video>`, `<audio>`, `<ul>`, `<ol>`, `<li>`, `<dl>`/`<dt>`/`<dd>`, and a full data table with `<caption>`, `<thead>`, `<tbody>`, `<th>`, `<td>`.

## Semantic HTML Demonstrated

`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`, `<figure>`, `<figcaption>`, `<details>`, `<summary>`, `<address>`.

## Forms and Validation

`<form>`, `<fieldset>`, `<legend>`, `<label>`, `<input>` (text, email, password, number, tel, search, date, radio, checkbox, range), `<select>`/`<option>`, `<textarea>`, `<button>`.

Attributes used purposefully: `id`, `name`, `value`, `placeholder`, `required`, `min`, `max`, `step`, `minlength`, `maxlength`, `pattern`, `autocomplete`.

Validation is layered: HTML5 attributes handle format and presence checks; JavaScript handles the rules HTML can't express, such as "a course and a faculty must both be chosen" and the duplicate-submission check.

---

## Project Structure

```
faculty-feedback-portal/
├── index.html         Home / landing page
├── login.html         Student login (demo)
├── dashboard.html     Student dashboard
├── courses.html       Course & faculty mapping
├── feedback.html      Feedback submission form
├── analytics.html     Results & analytics
├── admin.html         Admin dashboard
├── about.html         About the portal + limitations
├── contact.html       Contact / help
├── style.css          All styling
├── script.js          All JavaScript
├── assets/
│   └── images/        Local images (optional)
└── README.md
```

---

## How to Run Locally

1. Download or clone the repository.
2. Open `index.html` in any modern browser.

That's it — there is no install step, no server and no dependencies.

Optionally, for a local server: `python3 -m http.server 8000`, then visit `http://localhost:8000`.

## How to Deploy on GitHub Pages

```bash
git init
git add .
git commit -m "Faculty Feedback & Course Evaluation Portal"
git branch -M main
git remote add origin https://github.com/<your-username>/faculty-feedback-portal.git
git push -u origin main
```

Then on GitHub: **Settings → Pages → Source: Deploy from a branch → Branch: `main` / `root` → Save.**

The site goes live at `https://<your-username>.github.io/faculty-feedback-portal/` within a minute or two.

---

## Screenshots

_Add screenshots here before submission._

- `screenshots/home.png` — Home page hero
- `screenshots/feedback-form.png` — Feedback form
- `screenshots/validation.png` — Validation error message
- `screenshots/duplicate.png` — Duplicate submission blocked
- `screenshots/admin.png` — Admin dashboard charts
- `screenshots/mobile.png` — Mobile responsive view

---

## Limitations (stated honestly)

This is a **static frontend project**. It has no backend server, no database and no real authentication. The login is simulated, feedback is not transmitted anywhere, duplicate-submission prevention uses the browser's `localStorage` (which a user can clear), and all analytics figures are sample data. The Admin Dashboard is publicly reachable because static hosting cannot enforce access control.

## Future Improvements

- Backend API and database for real submission storage
- Server-side authentication with hashed passwords
- Role-based access control for the admin dashboard
- Server-enforced uniqueness on (student, course, faculty)
- True anonymization at the storage layer
- Export of results to CSV/PDF for department heads

---

## Team Contribution

| Member | Responsibility |
|---|---|
| Member 1 — _Name, Reg. No._ | HTML structure and semantic markup across all pages |
| Member 2 — _Name, Reg. No._ | Forms, input types, HTML5 and JavaScript validation |
| Member 3 — _Name, Reg. No._ | CSS design system, responsive layout, accessibility |
| Member 4 — _Name, Reg. No._ | JavaScript logic, dashboards, testing and documentation |

---

## License

Academic project — created for coursework demonstration. Faculty names, courses and all data are fictional.
