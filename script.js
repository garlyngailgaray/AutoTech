// --- SVG ICONS FOR PASSWORD TOGGLE ---
const eyeOpenSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
const eyeClosedSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`;

// --- SHOW A SPECIFIC PAGE (Login, Signup, Dashboard) ---
function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
    });

    setTimeout(() => {
        document.getElementById(pageId).classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });

        if (pageId === 'user-dashboard') {
            loadUserDashboard();
        }

        // Remove active highlight from ALL nav links when on non-main pages
        if (pageId !== 'main-page') {
            clearNavHighlights();
        }
    }, 100);
}

// --- NAVIGATE TO A SECTION ON THE MAIN PAGE (works from ANY page) ---
function navigateToSection(sectionId) {
    // First, make sure the main page is visible
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
    });

    setTimeout(() => {
        document.getElementById('main-page').classList.add('active');

        // Scroll to the target section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            setTimeout(() => {
                targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 150);
        }

        // Highlight the correct nav link
        clearNavHighlights();
        const activeLink = document.querySelector(`.nav-link[data-target="${sectionId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }, 100);
}

// --- GO TO LOGIN (with flash animation, NO persistent highlight) ---
function goToLogin() {
    const loginLink = document.querySelector('.nav-login');
    
    // Trigger flash animation
    loginLink.classList.remove('nav-login-click');
    const forceReflow = loginLink.offsetWidth;
    loginLink.classList.add('nav-login-click');

    // Remove flash class after animation ends
    setTimeout(() => {
        loginLink.classList.remove('nav-login-click');
    }, 500);

    // Navigate to login page
    showPage('login');
}

// --- CLEAR ALL NAV HIGHLIGHTS ---
function clearNavHighlights() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
}

// --- INIT ON PAGE LOAD ---
document.addEventListener('DOMContentLoaded', () => {

    // Button click animation
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function() {
            this.classList.remove('btn-click-effect');
            const forceReflow = this.offsetWidth;
            this.classList.add('btn-click-effect');
        });
    });

    // --- SCROLL SPY: Highlight nav links as user scrolls ---
    const sections = document.querySelectorAll('.scroll-section');
    const sectionNavLinks = document.querySelectorAll('.nav-link[data-target]');

    const observerOptions = {
        root: null,
        rootMargin: '-40% 0px -60% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        // Only run scroll spy if main page is active
        const mainPage = document.getElementById('main-page');
        if (!mainPage.classList.contains('active')) return;

        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                sectionNavLinks.forEach(link => link.classList.remove('active'));
                const activeLink = document.querySelector(`.nav-link[data-target="${id}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });
});

// --- PASSWORD VISIBILITY TOGGLE ---
function togglePasswordVisibility(inputId, iconElement) {
    const input = document.getElementById(inputId);
    if (input.type === "password") {
        input.type = "text";
        iconElement.innerHTML = eyeClosedSVG;
    } else {
        input.type = "password";
        iconElement.innerHTML = eyeOpenSVG;
    }
}

// --- SIGNUP LOGIC ---
function handleSignup(event) {
    event.preventDefault();

    const sexElement = document.querySelector('input[name="s_sex"]:checked');
    const sex = sexElement ? sexElement.value : 'Not specified';

    const user = {
        name: document.getElementById('s_name').value,
        address: document.getElementById('s_address').value,
        sex: sex,
        vehicleType: document.getElementById('s_vehicle_type').value, // <-- Captures vehicle type
        problem: document.getElementById('s_problem').value,
        username: document.getElementById('s_username').value,
        password: document.getElementById('s_password').value,
        status: 'Pending Approval'
    };

    let users = JSON.parse(localStorage.getItem('autotech_users')) || [];

    if (users.some(u => u.username === user.username)) {
        alert("Username already exists! Please choose another.");
        return;
    }

    users.push(user);
    localStorage.setItem('autotech_users', JSON.stringify(users));
    localStorage.setItem('autotech_current_user', user.username);

    const successMsg = document.getElementById('signupSuccess');
    successMsg.style.display = 'block';
    document.getElementById('signupForm').reset();

    setTimeout(() => {
        successMsg.style.display = 'none';
        showPage('user-dashboard');
    }, 2000);
}// --- SIGNUP LOGIC ---
function handleSignup(event) {
    event.preventDefault();

    const sexElement = document.querySelector('input[name="s_sex"]:checked');
    const sex = sexElement ? sexElement.value : 'Not specified';

    const user = {
        name: document.getElementById('s_name').value,
        address: document.getElementById('s_address').value,
        sex: sex,
        vehicleType: document.getElementById('s_vehicle_type').value, // <-- Captures vehicle type
        problem: document.getElementById('s_problem').value,
        username: document.getElementById('s_username').value,
        password: document.getElementById('s_password').value,
        status: 'Pending Approval'
    };

    let users = JSON.parse(localStorage.getItem('autotech_users')) || [];

    if (users.some(u => u.username === user.username)) {
        alert("Username already exists! Please choose another.");
        return;
    }

    users.push(user);
    localStorage.setItem('autotech_users', JSON.stringify(users));
    localStorage.setItem('autotech_current_user', user.username);

    const successMsg = document.getElementById('signupSuccess');
    successMsg.style.display = 'block';
    document.getElementById('signupForm').reset();

    setTimeout(() => {
        successMsg.style.display = 'none';
        showPage('user-dashboard');
    }, 2000);
}

// --- LOGIN LOGIC ---
function handleLogin(event) {
    event.preventDefault();

    const username = document.getElementById('l_username').value;
    const password = document.getElementById('l_password').value;
    const errorMsg = document.getElementById('loginError');

    const users = JSON.parse(localStorage.getItem('autotech_users')) || [];
    const foundUser = users.find(u => u.username === username && u.password === password);

    if (foundUser) {
        errorMsg.style.display = 'none';
        document.getElementById('loginForm').reset();
        localStorage.setItem('autotech_current_user', foundUser.username);
        showPage('user-dashboard');
    } else {
        errorMsg.style.display = 'block';
        errorMsg.style.animation = 'none';
        const forceReflow = errorMsg.offsetWidth;
        errorMsg.style.animation = 'slideDown 0.5s ease-out';
    }
}

// --- LOAD USER DASHBOARD DATA ---
function loadUserDashboard() {
    const currentUsername = localStorage.getItem('autotech_current_user');
    const users = JSON.parse(localStorage.getItem('autotech_users')) || [];
    const user = users.find(u => u.username === currentUsername);

    if (user) {
        const title = user.sex === 'Female' ? "Ma'am" : "Sir";
        document.getElementById('userWelcome').innerText = `Welcome, ${title} ${user.name}!`;
        
        // Display both Vehicle Type and Problem neatly
        document.getElementById('reportedProblem').innerText = `Vehicle: ${user.vehicleType}\n\nProblem: ${user.problem}`;

        const statusBadge = document.getElementById('approvalStatus');
        statusBadge.innerText = user.status;

        if (user.status === 'Approved') {
            statusBadge.className = 'status-badge status-approved';
        } else {
            statusBadge.className = 'status-badge status-pending';
        }
    }
}

// --- LOGOUT LOGIC ---
function handleLogout() {
    localStorage.removeItem('autotech_current_user');
    navigateToSection('home-section');
}

// --- SCROLL REVEAL ANIMATION ---
document.addEventListener('DOMContentLoaded', () => {
    
    // ... (keep your existing button click and navigation code here) ...

    // Observe sections for scroll animation
    const scrollSections = document.querySelectorAll('.scroll-section');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.15, // Triggers when 15% of the section is visible
        rootMargin: '0px 0px -50px 0px'
    });

    scrollSections.forEach(section => {
        revealObserver.observe(section);
    });
});