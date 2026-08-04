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
        } else if (pageId === 'admin-dashboard') {
            loadAdminDashboard();
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

// --- HANDLE ROLE BOX CLICK ---
function selectRole(role) {
    selectedRole = role; // Save the chosen role
    
    // Update the login page heading dynamically
    const roleNames = {
        'client': 'Client',
        'staff': 'Staff Member',
        'admin': 'Administrator',
        'cashier': 'Cashier'
    };
    
    const heading = document.getElementById('loginHeading');
    if (heading) {
        heading.innerText = `Login as ${roleNames[role]}`;
    }
    
    // Transition to the actual login form
    showPage('login');
}

// --- GO BACK TO ROLE SELECTION ---
function backToRoleSelection() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) loginForm.reset();
    
    const loginError = document.getElementById('loginError');
    if (loginError) loginError.style.display = 'none';
    
    showPage('role-selection');
}

// --- THEME TOGGLE LOGIC ---
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const icon = document.getElementById('theme-icon');
    if (icon) {
        if (theme === 'dark') {
            // Sun icon for dark mode (to switch to light)
            icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
        } else {
            // Moon icon for light mode (to switch to dark)
            icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
        }
    }
}

// ... [Keep all your existing SVG constants and global variables here] ...

// --- INIT ON PAGE LOAD ---
document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Theme
    initTheme();
    
    // 2. Check if admin exists on page load
    const users = JSON.parse(localStorage.getItem('autotech_users')) || [];
    const adminExists = users.some(u => u.role === 'admin');
    
    if (!adminExists) {
        setTimeout(() => {
            showPage('admin-setup');
        }, 500);
    }

    // 3. CLEAR LOGIN ERROR ON CLICK OR TYPING
    document.addEventListener('click', () => {
        const errorMsg = document.getElementById('loginError');
        if (errorMsg && errorMsg.style.display === 'block') {
            errorMsg.style.display = 'none';
        }
    });

    const lUsername = document.getElementById('l_username');
    const lPassword = document.getElementById('l_password');
    
    if (lUsername) {
        lUsername.addEventListener('input', () => {
            const errorMsg = document.getElementById('loginError');
            if (errorMsg) errorMsg.style.display = 'none';
        });
    }
    if (lPassword) {
        lPassword.addEventListener('input', () => {
            const errorMsg = document.getElementById('loginError');
            if (errorMsg) errorMsg.style.display = 'none';
        });
    }

    // 4. SCROLL REVEAL ANIMATION
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

// ... [Keep all your existing functions (showPage, handleSignup, handleLogin, etc.) exactly as they were] ...

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

// --- SIGNUP LOGIC (Public Client Signup) ---
function handleSignup(event) {
    event.preventDefault();
    console.log("Signup form submitted!"); // Debug log

    try {
        const sexElement = document.querySelector('input[name="s_sex"]:checked');
        const sex = sexElement ? sexElement.value : 'Not specified';

        // Safely get all elements
        const firstNameEl = document.getElementById('s_firstname');
        const lastNameEl = document.getElementById('s_lastname');
        const emailEl = document.getElementById('s_email');
        const phoneEl = document.getElementById('s_phone');
        const addressEl = document.getElementById('s_address');
        const vehicleTypeEl = document.getElementById('s_vehicle_type');
        const problemEl = document.getElementById('s_problem');
        const usernameEl = document.getElementById('s_username');
        const passwordEl = document.getElementById('s_password');

        // Safety check: ensure all HTML elements exist
        if (!firstNameEl || !lastNameEl || !addressEl || !vehicleTypeEl || !problemEl || !usernameEl || !passwordEl) {
            console.error("Missing form fields! Check your HTML IDs.");
            alert("System Error: Missing form fields. Please refresh the page.");
            return;
        }

        const firstName = firstNameEl.value.trim();
        const lastName = lastNameEl.value.trim();
        const fullName = `${firstName} ${lastName}`;

        const email = emailEl.value.trim();
        const phone = phoneEl.value.trim();

        // Validation: At least one contact method must be provided
        if (!email && !phone) {
            alert("Please provide either an email address or phone number.");
            return;
        }

        const user = {
            name: fullName,
            email: email || 'Not provided',
            phone: phone || 'Not provided',
            address: addressEl.value,
            sex: sex,
            vehicleType: vehicleTypeEl.value,
            problem: problemEl.value,
            role: 'client',
            username: usernameEl.value,
            password: passwordEl.value,
            status: 'Pending Approval'
        };

        let users = JSON.parse(localStorage.getItem('autotech_users')) || [];

        if (users.some(u => u.username === user.username)) {
            alert("Username already exists! Please choose another.");
            return;
        }

        if (email && email !== 'Not provided' && users.some(u => u.email === email)) {
            alert("This email is already registered! Please use another email.");
            return;
        }

        // Save to localStorage
        users.push(user);
        localStorage.setItem('autotech_users', JSON.stringify(users));
        localStorage.setItem('autotech_current_user', user.username);

        // Show success and redirect
        const successMsg = document.getElementById('signupSuccess');
        if (successMsg) successMsg.style.display = 'block';
        
        document.getElementById('signupForm').reset();

        setTimeout(() => {
            if (successMsg) successMsg.style.display = 'none';
            showPage('user-dashboard');
        }, 2000);

    } catch (error) {
        console.error("Signup Error:", error);
        alert("An error occurred during signup. Please check the browser console (F12) for details.");
    }
}

// --- LOGIN LOGIC ---
function handleLogin(event) {
    event.preventDefault();

    const role = selectedRole; // Use your globally stored role
    const username = document.getElementById('l_username').value.trim();
    const password = document.getElementById('l_password').value;
    const errorMsg = document.getElementById('loginError');

    const users = JSON.parse(localStorage.getItem('autotech_users')) || [];
    const foundUser = users.find(u => u.username === username && u.password === password);

    // Check if trying to log in as Admin but none exist
    if (role === 'admin' && !users.some(u => u.role === 'admin')) {
        alert("No admin account exists yet. Please create the first admin account.");
        showPage('admin-setup');
        return;
    }

    if (foundUser) {
        // Verify the logged-in user's role matches the selected role box
        if (foundUser.role !== role) {
            errorMsg.innerText = `This account is registered as a ${foundUser.role}, not ${role}.`;
            errorMsg.style.display = 'block';
            return;
        }

        errorMsg.style.display = 'none';
        document.getElementById('loginForm').reset();
        localStorage.setItem('autotech_current_user', foundUser.username);
        
        // Route based on the selected role
        if (role === 'client') {
            loadUserDashboard();
            showPage('user-dashboard');
        } else if (role === 'staff') {
            if(document.getElementById('staffWelcome')) {
                document.getElementById('staffWelcome').innerText = `Welcome, ${foundUser.name} (Staff)`;
            }
            showPage('staff-dashboard');
        } else if (role === 'admin') {
            loadAdminDashboard();
            showPage('admin-dashboard');
        } else if (role === 'cashier') {
            showPage('cashier-dashboard');
        } else {
             showPage('main-page'); // Fallback
        }
    } else {
        errorMsg.innerText = "Invalid username or password.";
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
        const welcomeEl = document.getElementById('userWelcome');
        if (welcomeEl) {
            welcomeEl.innerText = `Welcome, ${title} ${user.name}!`;
        }
        
        if (document.getElementById('userEmail')) {
            document.getElementById('userEmail').innerText = `Email: ${user.email}`;
        }
        
        const problemEl = document.getElementById('reportedProblem');
        if (problemEl) {
            problemEl.innerText = `Vehicle: ${user.vehicleType}\n\nProblem: ${user.problem}`;
        }

        const statusBadge = document.getElementById('approvalStatus');
        if (statusBadge) {
            statusBadge.innerText = user.status;
            if (user.status === 'Approved') {
                statusBadge.className = 'status-badge status-approved';
            } else {
                statusBadge.className = 'status-badge status-pending';
            }
        }
    }
} 

// --- CHECK IF ADMIN EXISTS AND SHOW SETUP PAGE ---
function checkAndShowAdminSetup() {
    const users = JSON.parse(localStorage.getItem('autotech_users')) || [];
    const adminExists = users.some(u => u.role === 'admin');
    
    if (adminExists) {
        alert('An admin account already exists! Please contact the administrator.');
    } else {
        showPage('admin-setup');
    }
}

// --- CREATE FIRST ADMIN ACCOUNT ---
function handleFirstAdminSetup(event) {
    event.preventDefault();

    const firstName = document.getElementById('setup_firstname').value.trim();
    const lastName = document.getElementById('setup_lastname').value.trim();
    const fullName = `${firstName} ${lastName}`;

    const email = document.getElementById('setup_email').value.trim();
    const phone = document.getElementById('setup_phone').value.trim();

    if (!email && !phone) {
        alert("Please provide either an email address or phone number.");
        return;
    }

    const user = {
        name: fullName,
        email: email || 'Not provided',
        phone: phone || 'Not provided',
        address: document.getElementById('setup_address').value,
        role: 'admin',
        username: document.getElementById('setup_username').value,
        password: document.getElementById('setup_password').value,
        status: 'Active'
    };

    let users = JSON.parse(localStorage.getItem('autotech_users')) || [];

    if (users.some(u => u.role === 'admin')) {
        alert("An admin account already exists!");
        return;
    }

    if (users.some(u => u.username === user.username)) {
        alert("Username already exists! Please choose another.");
        return;
    }

    users.push(user);
    localStorage.setItem('autotech_users', JSON.stringify(users));

    const successMsg = document.getElementById('setupSuccess');
    if (successMsg) successMsg.style.display = 'block';
    document.getElementById('setupForm').reset();

    setTimeout(() => {
        if (successMsg) successMsg.style.display = 'none';
        showPage('login');
    }, 2000);
}

// --- ADMIN DASHBOARD LOGIC ---
function loadAdminDashboard() {
    const currentUsername = localStorage.getItem('autotech_current_user');
    const users = JSON.parse(localStorage.getItem('autotech_users')) || [];
    const user = users.find(u => u.username === currentUsername);

    if (user && user.role === 'admin') {
        const welcomeEl = document.getElementById('adminWelcome');
        if (welcomeEl) {
            welcomeEl.innerText = `Welcome, Admin ${user.name}!`;
        }
        
        // Update stats
        const totalUsers = users.length;
        const totalClients = users.filter(u => u.role === 'client').length;
        const totalStaff = users.filter(u => u.role === 'staff').length;
        const totalCashiers = users.filter(u => u.role === 'cashier').length;
        
        const elUsers = document.getElementById('totalUsers');
        const elClients = document.getElementById('totalClients');
        const elStaff = document.getElementById('totalStaff');
        const elCashiers = document.getElementById('totalCashiers');

        if (elUsers) elUsers.innerText = totalUsers;
        if (elClients) elClients.innerText = totalClients;
        if (elStaff) elStaff.innerText = totalStaff;
        if (elCashiers) elCashiers.innerText = totalCashiers;
        
        // Load users list
        loadUsersList();
        loadPendingApprovals();
    }
}

function showTab(tabId) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    event.target.classList.add('active');
    document.getElementById(tabId).classList.add('active');
}

// --- LOAD USERS LIST (Updated with Delete Button) ---
function loadUsersList() {
    const users = JSON.parse(localStorage.getItem('autotech_users')) || [];
    const currentUsername = localStorage.getItem('autotech_current_user');
    const usersList = document.getElementById('usersList');
    
    if (!usersList) return;

    if (users.length === 0) {
        usersList.innerHTML = '<p style="color: #cbd5e1; text-align: center; padding: 2rem;">No users registered yet.</p>';
        return;
    }
    
    let html = '';
    users.forEach(user => {
        const roleClass = `role-${user.role}`;
        const isSelf = user.username === currentUsername;
        
        // Prevent admin from deleting their own account
        const deleteButton = isSelf 
            ? '<span style="color: #888; font-size: 0.85rem; font-style: italic; padding: 0.6rem 1.2rem;">(Current User)</span>' 
            : `<button class="btn-delete" onclick="deleteUser('${user.username}')">Delete Account</button>`;

        html += `
            <div class="user-card">
                <div class="user-card-header">
                    <h3>${user.name}</h3>
                    <span class="role-badge ${roleClass}">${user.role}</span>
                </div>
                <div class="user-details">
                    <p><strong>Username:</strong> ${user.username}</p>
                    <p><strong>Email:</strong> ${user.email || 'Not provided'}</p>
                    <p><strong>Phone:</strong> ${user.phone || 'Not provided'}</p>
                    <p><strong>Address:</strong> ${user.address}</p>
                    ${user.role === 'client' ? `
                        <p><strong>Vehicle:</strong> ${user.vehicleType}</p>
                        <p><strong>Status:</strong> ${user.status}</p>
                    ` : ''}
                </div>
                <div class="approval-actions" style="margin-top: 1rem; justify-content: flex-end;">
                    ${deleteButton}
                </div>
            </div>
        `;
    });
    
    usersList.innerHTML = html;
}

// --- NEW: DELETE USER ACCOUNT ---
function deleteUser(username) {
    const currentUsername = localStorage.getItem('autotech_current_user');
    
    // Safety check: Prevent deleting the currently logged-in admin
    if (username === currentUsername) {
        alert("You cannot delete your own account while logged in.");
        return;
    }

    // Confirmation prompt
    if (confirm(`Are you sure you want to permanently delete the account for "${username}"?\n\nThis action cannot be undone.`)) {
        let users = JSON.parse(localStorage.getItem('autotech_users')) || [];
        
        // Filter out the deleted user
        users = users.filter(u => u.username !== username);
        
        // Save back to localStorage
        localStorage.setItem('autotech_users', JSON.stringify(users));
        
        // Refresh the UI and stats
        loadUsersList();
        loadAdminDashboard();
        
        alert('Account deleted successfully.');
    }
}

function loadPendingApprovals() {
    const users = JSON.parse(localStorage.getItem('autotech_users')) || [];
    const pendingUsers = users.filter(u => u.role === 'client' && u.status === 'Pending Approval');
    const pendingList = document.getElementById('pendingList');
    
    if (!pendingList) return;

    if (pendingUsers.length === 0) {
        pendingList.innerHTML = '<p style="color: #cbd5e1; text-align: center; padding: 2rem;">No pending approvals.</p>';
        return;
    }
    
    let html = '';
    pendingUsers.forEach(user => {
        html += `
            <div class="user-card">
                <div class="user-card-header">
                    <h3>${user.name}</h3>
                    <span class="role-badge role-client">Client</span>
                </div>
                <div class="user-details">
                    <p><strong>Vehicle:</strong> ${user.vehicleType}</p>
                    <p><strong>Problem:</strong> ${user.problem}</p>
                    <p><strong>Contact:</strong> ${user.email || user.phone}</p>
                </div>
                <div class="approval-actions">
                    <button class="btn-approve" onclick="approveUser('${user.username}')">Approve</button>
                    <button class="btn-reject" onclick="rejectUser('${user.username}')">Reject</button>
                </div>
            </div>
        `;
    });
    
    pendingList.innerHTML = html;
}

function approveUser(username) {
    let users = JSON.parse(localStorage.getItem('autotech_users')) || [];
    const userIndex = users.findIndex(u => u.username === username);
    
    if (userIndex !== -1) {
        users[userIndex].status = 'Approved';
        localStorage.setItem('autotech_users', JSON.stringify(users));
        loadPendingApprovals();
        alert('Vehicle problem approved successfully!');
    }
}

function rejectUser(username) {
    let users = JSON.parse(localStorage.getItem('autotech_users')) || [];
    const userIndex = users.findIndex(u => u.username === username);
    
    if (userIndex !== -1) {
        users[userIndex].status = 'Rejected';
        localStorage.setItem('autotech_users', JSON.stringify(users));
        loadPendingApprovals();
        alert('Vehicle problem rejected.');
    }
}

// --- STAFF SIGNUP (Admin Only) ---
function handleStaffSignup(event) {
    event.preventDefault();

    const firstName = document.getElementById('staff_firstname').value.trim();
    const lastName = document.getElementById('staff_lastname').value.trim();
    const fullName = `${firstName} ${lastName}`;

    const email = document.getElementById('staff_email').value.trim();
    const phone = document.getElementById('staff_phone').value.trim();

    if (!email && !phone) {
        alert("Please provide either an email address or phone number.");
        return;
    }

    const user = {
        name: fullName,
        email: email || 'Not provided',
        phone: phone || 'Not provided',
        address: document.getElementById('staff_address').value,
        role: 'staff',
        username: document.getElementById('staff_username').value,
        password: document.getElementById('staff_password').value,
        status: 'Active'
    };

    let users = JSON.parse(localStorage.getItem('autotech_users')) || [];

    if (users.some(u => u.username === user.username)) {
        alert("Username already exists! Please choose another.");
        return;
    }

    users.push(user);
    localStorage.setItem('autotech_users', JSON.stringify(users));

    const successMsg = document.getElementById('staffSuccess');
    if (successMsg) successMsg.style.display = 'block';
    document.getElementById('staffForm').reset();

    setTimeout(() => {
        if (successMsg) successMsg.style.display = 'none';
        loadAdminDashboard();
    }, 2000);
}

// --- CASHIER SIGNUP (Admin Only) ---
function handleCashierSignup(event) {
    event.preventDefault();

    const firstName = document.getElementById('cashier_firstname').value.trim();
    const lastName = document.getElementById('cashier_lastname').value.trim();
    const fullName = `${firstName} ${lastName}`;

    const email = document.getElementById('cashier_email').value.trim();
    const phone = document.getElementById('cashier_phone').value.trim();

    if (!email && !phone) {
        alert("Please provide either an email address or phone number.");
        return;
    }

    const user = {
        name: fullName,
        email: email || 'Not provided',
        phone: phone || 'Not provided',
        address: document.getElementById('cashier_address').value,
        role: 'cashier',
        username: document.getElementById('cashier_username').value,
        password: document.getElementById('cashier_password').value,
        status: 'Active'
    };

    let users = JSON.parse(localStorage.getItem('autotech_users')) || [];

    if (users.some(u => u.username === user.username)) {
        alert("Username already exists! Please choose another.");
        return;
    }

    users.push(user);
    localStorage.setItem('autotech_users', JSON.stringify(users));

    const successMsg = document.getElementById('cashierSuccess');
    if (successMsg) successMsg.style.display = 'block';
    document.getElementById('cashierForm').reset();

    setTimeout(() => {
        if (successMsg) successMsg.style.display = 'none';
        loadAdminDashboard();
    }, 2000);
}

// --- CLIENT SIGNUP (Admin Only) ---
function handleClientSignup(event) {
    event.preventDefault();

    const sexElement = document.querySelector('input[name="client_sex"]:checked');
    const sex = sexElement ? sexElement.value : 'Not specified';

    const firstName = document.getElementById('client_firstname').value.trim();
    const lastName = document.getElementById('client_lastname').value.trim();
    const fullName = `${firstName} ${lastName}`;

    const email = document.getElementById('client_email').value.trim();
    const phone = document.getElementById('client_phone').value.trim();

    if (!email && !phone) {
        alert("Please provide either an email address or phone number.");
        return;
    }

    const user = {
        name: fullName,
        email: email || 'Not provided',
        phone: phone || 'Not provided',
        address: document.getElementById('client_address').value,
        sex: sex,
        vehicleType: document.getElementById('client_vehicle_type').value,
        problem: document.getElementById('client_problem').value,
        role: 'client',
        username: document.getElementById('client_username').value,
        password: document.getElementById('client_password').value,
        status: 'Pending Approval'
    };

    let users = JSON.parse(localStorage.getItem('autotech_users')) || [];

    if (users.some(u => u.username === user.username)) {
        alert("Username already exists! Please choose another.");
        return;
    }

    users.push(user);
    localStorage.setItem('autotech_users', JSON.stringify(users));

    const successMsg = document.getElementById('clientSuccess');
    if (successMsg) successMsg.style.display = 'block';
    document.getElementById('clientForm').reset();

    setTimeout(() => {
        if (successMsg) successMsg.style.display = 'none';
        loadAdminDashboard();
    }, 2000);
}

// --- LOGOUT LOGIC ---
function handleLogout() {
    localStorage.removeItem('autotech_current_user');
    navigateToSection('home-section');
}

// --- INIT ON PAGE LOAD ---
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Check if admin exists on page load
    const users = JSON.parse(localStorage.getItem('autotech_users')) || [];
    const adminExists = users.some(u => u.role === 'admin');
    
    // If no admin exists, automatically show setup page
    if (!adminExists) {
        setTimeout(() => {
            showPage('admin-setup');
        }, 500);
    }

    // 2. CLEAR LOGIN ERROR ON CLICK OR TYPING
    // Hide error when clicking ANYWHERE on the page
    document.addEventListener('click', () => {
        const errorMsg = document.getElementById('loginError');
        if (errorMsg && errorMsg.style.display === 'block') {
            errorMsg.style.display = 'none';
        }
    });

    // Hide error immediately when user starts typing in username or password
    const lUsername = document.getElementById('l_username');
    const lPassword = document.getElementById('l_password');
    
    if (lUsername) {
        lUsername.addEventListener('input', () => {
            const errorMsg = document.getElementById('loginError');
            if (errorMsg) errorMsg.style.display = 'none';
        });
    }
    if (lPassword) {
        lPassword.addEventListener('input', () => {
            const errorMsg = document.getElementById('loginError');
            if (errorMsg) errorMsg.style.display = 'none';
        });
    }

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