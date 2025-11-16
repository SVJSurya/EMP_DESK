# Capstone Project: Employee Skill Tracker Dashboard

## Overview of the App

This project is a dynamic, single-page web application designed for an HR department to track employee skills, certifications, and basic information. It provides a clean, modern dashboard interface with features for adding, editing, deleting, and filtering employees. All data is persisted in the browser's local storage.

## Key JavaScript Concepts Applied

This project demonstrates a wide range of foundational and modern JavaScript concepts:

* **Variables, Data Types, & Operators:** Used for storing state, form data (strings, booleans), and performing calculations (e.g., stats).
* **Functions:** The code is modularized into reusable functions like `renderTable()`, `updateStats()`, `validateForm()`, etc.
* **DOM Manipulation:** Extensively used `querySelector()`, `getElementById()`, `createElement()`, and `addEventListener()` to build a dynamic and interactive UI without a page reload.
* **Event Handling:** Handled `submit`, `click`, and `blur` events to manage form submissions, validation, button clicks, and table interactions.
* **Event Delegation:** Used on the employee table to efficiently handle "Edit" and "Delete" clicks on dynamically generated rows.
* **Array & String Manipulations:**
    * **`forEach()`:** To loop through the employee array and render table rows.
    * **`filter()`:** To implement the filtering logic (by department, certification).
    * **`map()`:** To update the employee array after an edit and to format data for CSV export.
    * **`reduce()`:** Used to dynamically compute the "Most Common Skill" statistic.
    * **`flatMap()`:** To create a flat array of all skills for the `reduce()` calculation.
    * **`join()`:** To convert the skills array into a comma-separated string for display.
* **Objects:** Employee data is stored as objects inside a central `employees` array.
* **Local Storage:** Used `localStorage.setItem()` and `localStorage.getItem()` (with `JSON.stringify`/`JSON.parse`) to persist the employee list across browser sessions.

## Feature List

### Core Features
* **Employee Registration Form:** A validated form to add new employees.
    * Inline validation on `blur` and `submit`.
    * Error messages for required fields, min length, and email format.
* **Dynamic Employee Table:** A real-time table that updates as employees are added, edited, or deleted.
* **Live Stats Dashboard:** Stat cards that dynamically update:
    * Total Employees
    * Certified vs. Non-Certified Count
    * Most Common Skill
* **Filtering:** Filter the employee list by "All", "Engineering", "HR", "Sales", "Finance", or "Certified Only".
* **Delete Employee:** Remove an employee from the list with a confirmation.

### Stand-Out (Bonus) Features
* **Edit Employee:** Edit details in a clean, modal-based form.
* **Local Storage Persistence:** All data is saved, so you don't lose your list on refresh.
* **CSV Export:** A "Download Report" button to export the full employee list as a `.csv` file.
* **Toast Notifications:** Non-intrusive success/error messages for a modern UX.

## How to Run/Test the App

1.  **Clone or Download:** Get the project files (`index.html`, `style.css`, `script.js`, `README.md`) onto your local machine.
2.  **Open in VS Code:** Open the project folder in Visual Studio Code.
3.  **Use Live Server (Recommended):**
    * If you don't have it, install the "Live Server" extension in VS Code.
    * Right-click on the `index.html` file.
    * Select "Open with Live Server".
4.  **Open Manually (Alternative):**
    * Navigate to the project folder in your file explorer.
    * Double-click the `index.html` file to open it in your default web browser.

Once open, you can test all features.