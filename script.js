// --- SVG ICONS FOR PASSWORD TOGGLE ---
const eyeOpenSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
const eyeClosedSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`;

// --- GLOBAL VARIABLES ---
let selectedRole = ''; 

// --- SHOW A SPECIFIC PAGE ---
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

// --- NAVIGATE TO A SECTION ON THE MAIN PAGE ---
function navigateToSection(sectionId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
    });

    setTimeout(() => {
        document.getElementById('main-page').classList.add('active');

        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            setTimeout(() => {
                targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 150);
        }

        clearNavHighlights();
        const activeLink = document.querySelector(`.nav-link[data-target="${sectionId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }, 100);
}

// --- GO TO LOGIN (Now goes to Role Selection first) ---
function goToLogin() {
    const loginLink = document.querySelector('.nav-login');
    
    loginLink.classList.remove('nav-login-click');
    const forceReflow = loginLink.offsetWidth;
    loginLink.classList.add('nav-login-click');

    setTimeout(() => {
        loginLink.classList.remove('nav-login-click');
    }, 500);

    showPage('role-selection'); // Show role boxes instead of login form
}

// --- CLEAR ALL NAV HIGHLIGHTS ---
function clearNavHighlights() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
}

// --- NEW: HANDLE ROLE BOX CLICK ---
function selectRole(role) {
    selectedRole = role; // Save the chosen role
    
    // Update the login page heading dynamically
    const roleNames = {
        'client': 'Client',
        'staff': 'Staff Member',
        'admin': 'Administrator',
        'cashier': 'Cashier'
    };
    
    document.getElementById('loginHeading').innerText = `Login as ${roleNames[role]}`;
    
    // Transition to the actual login form
    showPage('login');
}

// --- NEW: GO BACK TO ROLE SELECTION ---
function backToRoleSelection() {
    document.getElementById('loginForm').reset();
    document.getElementById('loginError').style.display = 'none';
    showPage('role-selection');
}

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
        vehicleType: document.getElementById('s_vehicle_type').value,
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

// --- LOGIN LOGIC (Updated to use selectedRole) ---
function handleLogin(event) {
    event.preventDefault();

    const role = selectedRole; // Use the globally stored role
    const username = document.getElementById('l_username').value;
    const password = document.getElementById('l_password').value;
    const errorMsg = document.getElementById('loginError');

    const users = JSON.parse(localStorage.getItem('autotech_users')) || [];
    const foundUser = users.find(u => u.username === username && u.password === password);

    if (foundUser) {
        errorMsg.style.display = 'none';
        document.getElementById('loginForm').reset();
        localStorage.setItem('autotech_current_user', foundUser.username);
        
        // Route based on the selected role box they clicked earlier
        if (role === 'client') {
            loadUserDashboard();
            showPage('user-dashboard');
        } else if (role === 'staff') {
            document.getElementById('staffWelcome').innerText = `Welcome, ${foundUser.name} (Staff)`;
            showPage('staff-dashboard');
        } else if (role === 'admin') {
            showPage('admin-dashboard');
        } else if (role === 'cashier') {
            showPage('cashier-dashboard');
        } else {
             showPage('main-page'); // Fallback
        }
    } else {
        errorMsg.style.display = 'block';
        errorMsg.style.animation = 'none';
        const forceReflow = errorMsg.offsetWidth;
        errorMsg.style.animation = 'popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
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

// --- LOGOUT LOGIC (Clear the selected role) ---
function handleLogout() {
    localStorage.removeItem('autotech_current_user');
    selectedRole = ''; // Clear role on logout
    navigateToSection('home-section');
}

// --- INIT ON PAGE LOAD ---
document.addEventListener('DOMContentLoaded', () => {

    // 1. Button click animation
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function() {
            this.classList.remove('btn-click-effect');
            const forceReflow = this.offsetWidth;
            this.classList.add('btn-click-effect');
        });
    });

    // 2. SCROLL SPY: Highlight nav links as user scrolls
    const sections = document.querySelectorAll('.scroll-section');
    const sectionNavLinks = document.querySelectorAll('.nav-link[data-target]');

    const observerOptions = {
        root: null,
        rootMargin: '-40% 0px -60% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
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

    // 3. SCROLL REVEAL ANIMATION: Animate sections as they come into view
    const scrollSections = document.querySelectorAll('.scroll-section');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    scrollSections.forEach(section => {
        revealObserver.observe(section);
    });
});