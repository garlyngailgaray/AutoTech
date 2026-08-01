# 🚗 AutoTech - Vehicle & Motor Repair Management System

**AutoTech** is a modern, responsive, single-page web application designed for an auto and motorcycle repair shop. It features a clean user interface, smooth page transitions, and a fully functional mock authentication system with role-based user accounts.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

---

## ✨ Features

- **Single Page Application (SPA) Feel:** Smooth fade and slide transitions between pages without reloading.
- **Role-Based Authentication:** Users can sign up and log in with specific roles (Client, Cashier, Staff, Admin).
- **Mock Database:** Uses the browser's `localStorage` to save user accounts and persist data across sessions.
- **Interactive UI:** Custom button click animations, hover effects, and dynamic success/error messages.
- **Fully Responsive:** Looks great on desktops, tablets, and mobile devices.
- **Clean Codebase:** Separated into semantic HTML, modular CSS, and vanilla JavaScript.

---

## 🛠️ Tech Stack

- **Frontend:** HTML5, CSS3 (Flexbox, Grid, Animations)
- **Logic:** Vanilla JavaScript (ES6+)
- **Storage:** Web API `localStorage` (No backend required)

---

## 📁 Project Structure


---

## 🚀 How to Run Locally

Since this is a pure frontend project, there is no need to install any dependencies or set up a server.

### Method 1: Direct Browser (Easiest)
1. Clone or download this repository to your computer.
2. Open the project folder.
3. Double-click on `index.html`.
4. The website will open in your default web browser.

### Method 2: Using VS Code (Recommended for Developers)
1. Open the project folder in **Visual Studio Code**.
2. Install the **Live Server** extension.
3. Right-click `index.html` and select **"Open with Live Server"**.
4. The site will open in your browser and automatically refresh when you edit the code.

---

## 🧑‍💻 Usage Guide

Because this project uses `localStorage` as a mock database, you can test the full user flow right in your browser:

1. **Create an Account:** 
   - Click **Login** in the top navigation, then click **Sign up here**.
   - Fill out the form (Name, Address, Vehicle Problem, Username, Password).
   - Select a role (Client, Cashier, Staff, or Admin).
   - Click **Submit**. You will see a success message and be redirected to the Login page.
2. **Log In:** 
   - Enter the exact username and password you just created.
   - You will be redirected to the **Dashboard**, which will greet you by name and display your assigned role.
3. **Log Out:** 
   - Click the **Logout** button on the dashboard to return to the homepage.

*Note: To clear all saved accounts and start fresh, open your browser's Developer Tools (F12), go to the **Application** (or **Storage**) tab, and clear **Local Storage**.*

---

## 📌 Pages Included

- **Home:** Hero section with a call-to-action.
- **Services:** Grid layout showcasing repair services.
- **About:** Company history and mission.
- **Contact:** Shop address, phone, email, and operating hours.
- **Sign Up / Login:** Secure-looking forms with validation and animated feedback.
- **Dashboard:** Post-login welcome screen.

---

## 📝 Future Enhancements (Ideas)

- [ ] Connect to a real backend (Node.js/Express, PHP, or Python) and a database (MongoDB/MySQL).
- [ ] Implement password hashing for security.
- [ ] Add an Admin Dashboard to view all registered clients and their vehicle problems.
- [ ] Add a booking/appointment scheduling system.

---

## 📄 License

This project is open-source and available for educational and portfolio purposes. 
