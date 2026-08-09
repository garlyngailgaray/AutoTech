// ==========================================
// 1. CONSTANTS & GLOBAL VARIABLES
// ==========================================
const eyeOpenSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
const eyeClosedSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`;

let selectedRole = ''; 

// ==========================================
// 2. AUTO-GENERATION & SECURITY HELPERS
// ==========================================
function generateId(role) {
    const users = JSON.parse(localStorage.getItem('autotech_users')) || [];
    const prefix = { 'client': 'CLT', 'staff': 'STF', 'cashier': 'CSH', 'admin': 'ADM' };
    const roleUsers = users.filter(u => u.role === role);
    const nextNumber = roleUsers.length + 1;
    return `${prefix[role]}-${String(nextNumber).padStart(3, '0')}`;
}

function generateUsername(firstName, lastName) {
    const base = `${firstName.toLowerCase()}.${lastName.toLowerCase()}`;
    const randomNum = Math.floor(Math.random() * 1000);
    return `${base}${randomNum}`;
}

function generateTempPassword() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$';
    let password = '';
    for (let i = 0; i < 10; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}

function hashPassword(password) {
    const encoded = btoa(password).split('').reverse().join('');
    return `ENC_${encoded}`;
}

function verifyPassword(inputPassword, storedPassword) {
    if (storedPassword && storedPassword.startsWith('ENC_')) {
        const decoded = storedPassword.substring(4).split('').reverse().join('');
        const original = atob(decoded);
        return inputPassword === original;
    }
    return inputPassword === storedPassword;
}

// ==========================================
// 3. THEME LOGIC
// ==========================================
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
            icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
        } else {
            icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
        }
    }
}

// ==========================================
// 4. NAVIGATION & UI FUNCTIONS
// ==========================================
function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));

    setTimeout(() => {
        const target = document.getElementById(pageId);
        if (target) target.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });

        if (pageId === 'user-dashboard') loadUserDashboard();
        else if (pageId === 'admin-dashboard') loadAdminDashboard();
        else if (pageId === 'staff-dashboard') loadStaffDashboard();
        else if (pageId === 'cashier-dashboard') loadCashierDashboard();

        if (pageId !== 'main-page') clearNavHighlights();
    }, 100);
}

function navigateToSection(sectionId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    setTimeout(() => {
        document.getElementById('main-page').classList.add('active');
        const targetSection = document.getElementById(sectionId);
        if (targetSection) setTimeout(() => targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150);
        clearNavHighlights();
        const activeLink = document.querySelector(`.nav-link[data-target="${sectionId}"]`);
        if (activeLink) activeLink.classList.add('active');
    }, 100);
}

function goToLogin() {
    const loginLink = document.querySelector('.nav-login');
    if (loginLink) {
        loginLink.classList.remove('nav-login-click');
        const forceReflow = loginLink.offsetWidth;
        loginLink.classList.add('nav-login-click');
        setTimeout(() => loginLink.classList.remove('nav-login-click'), 500);
    }
    showPage('role-selection');
}

function clearNavHighlights() {
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
}

function selectRole(role) {
    selectedRole = role;
    const roleNames = { 'client': 'Client', 'staff': 'Staff Member', 'admin': 'Administrator', 'cashier': 'Cashier' };
    const heading = document.getElementById('loginHeading');
    if (heading) heading.innerText = `Login as ${roleNames[role]}`;
    showPage('login');
}

function backToRoleSelection() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) loginForm.reset();
    const loginError = document.getElementById('loginError');
    if (loginError) loginError.style.display = 'none';
    showPage('role-selection');
}

// UPDATED: Scoped to admin-container to prevent conflicts with cashier tabs
function showTab(tabId, event) {
    document.querySelectorAll('.admin-container .tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.admin-container .tab-content').forEach(content => content.classList.remove('active'));
    if (event && event.target) event.target.classList.add('active');
    const tab = document.getElementById(tabId);
    if (tab) tab.classList.add('active');
}

function showCashierTab(tabId, event) {
    document.querySelectorAll('#cashier-dashboard .tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('#cashier-dashboard .tab-content').forEach(content => content.classList.remove('active'));
    if (event && event.target) event.target.classList.add('active');
    document.getElementById(`cashier-${tabId}`).classList.add('active');
}

function togglePasswordVisibility(inputId, iconElement) {
    const input = document.getElementById(inputId);
    if (input) {
        if (input.type === "password") {
            input.type = "text";
            iconElement.innerHTML = eyeClosedSVG;
        } else {
            input.type = "password";
            iconElement.innerHTML = eyeOpenSVG;
        }
    }
}

// ==========================================
// 5. AUTH & SIGNUP LOGIC
// ==========================================
function handleSignup(event) {
    event.preventDefault();
    const sexElement = document.querySelector('input[name="s_sex"]:checked');
    const sex = sexElement ? sexElement.value : 'Not specified';

    const firstName = document.getElementById('s_firstname')?.value.trim() || '';
    const lastName = document.getElementById('s_lastname')?.value.trim() || '';
    const fullName = `${firstName} ${lastName}`;
    const email = document.getElementById('s_email')?.value.trim() || '';
    const phone = document.getElementById('s_phone')?.value.trim() || '';
    const address = document.getElementById('s_address')?.value.trim() || '';
    const vehicleType = document.getElementById('s_vehicle_type')?.value.trim() || '';
    const problem = document.getElementById('s_problem')?.value.trim() || '';

    if (!email && !phone) { alert("Please provide either an email address or phone number."); return; }

    const userId = generateId('client');
    const username = generateUsername(firstName, lastName);
    const tempPassword = generateTempPassword();

    const user = { id: userId, name: fullName, email: email || 'Not provided', phone: phone || 'Not provided', address, sex, vehicleType, problem, role: 'client', username, password: tempPassword, passwordChanged: false, status: 'Pending Approval', paymentStatus: 'Unpaid', billAmount: 0 };

    let users = JSON.parse(localStorage.getItem('autotech_users')) || [];
    if (email && email !== 'Not provided' && users.some(u => u.email === email)) { alert("This email is already registered!"); return; }

    users.push(user);
    localStorage.setItem('autotech_users', JSON.stringify(users));
    localStorage.setItem('autotech_current_user', user.username);

    const successMsg = document.getElementById('signupSuccess');
    if (successMsg) {
        successMsg.innerHTML = `<h3 style="margin-bottom: 0.5rem;">Account Created Successfully!</h3><p style="margin-bottom: 1rem;">Your account is pending admin approval.</p><div style="background: rgba(255,255,255,0.1); padding: 1rem; border-radius: 8px; text-align: left; margin-bottom: 1rem; border: 1px dashed currentColor;"><p><strong>Your ID:</strong> ${userId}</p><p><strong>Username:</strong> ${username}</p><p><strong>Temp Password:</strong> ${tempPassword}</p></div><p style="font-size: 0.85rem; opacity: 0.8;">Please save these credentials. You will be prompted to change your password on your first login.</p>`;
        successMsg.style.display = 'block';
    }
    const form = document.getElementById('signupForm');
    if (form) form.reset();
    setTimeout(() => { if (successMsg) { successMsg.style.display = 'none'; successMsg.innerHTML = 'Account Created Successfully!'; } showPage('user-dashboard'); }, 8000);
}

function handleStaffSignup(event) {
    event.preventDefault();
    const firstName = document.getElementById('staff_firstname').value.trim();
    const lastName = document.getElementById('staff_lastname').value.trim();
    const email = document.getElementById('staff_email').value.trim();
    const phone = document.getElementById('staff_phone').value.trim();
    const sexElement = document.querySelector('input[name="staff_sex"]:checked');
    const sex = sexElement ? sexElement.value : 'Not specified';
    const age = document.getElementById('staff_age')?.value.trim() || 'Not provided';

    if (!email && !phone) { alert("Please provide either an email address or phone number."); return; }

    const userId = generateId('staff');
    const username = generateUsername(firstName, lastName);
    const tempPassword = generateTempPassword();
    const user = { id: userId, name: `${firstName} ${lastName}`, email: email || 'Not provided', phone: phone || 'Not provided', age, sex, address: document.getElementById('staff_address').value.trim(), role: 'staff', username, password: tempPassword, passwordChanged: false, status: 'Active', availability: 'Available' };
    
    let users = JSON.parse(localStorage.getItem('autotech_users')) || [];
    users.push(user);
    localStorage.setItem('autotech_users', JSON.stringify(users));

    const credDiv = document.getElementById('staffCredentials');
    if (credDiv) { credDiv.innerHTML = `<h3>Account Created!</h3><p><strong>ID:</strong> ${userId}</p><p><strong>Username:</strong> ${username}</p><p><strong>Temp Password:</strong> ${tempPassword}</p>`; credDiv.style.display = 'block'; }
    document.getElementById('staffSuccess').style.display = 'block';
    document.getElementById('staffForm').reset();
    setTimeout(() => document.getElementById('staffSuccess').style.display = 'none', 4000);
}

function handleCashierSignup(event) {
    event.preventDefault();
    const firstName = document.getElementById('cashier_firstname').value.trim();
    const lastName = document.getElementById('cashier_lastname').value.trim();
    const email = document.getElementById('cashier_email').value.trim();
    const phone = document.getElementById('cashier_phone').value.trim();
    const sexElement = document.querySelector('input[name="cashier_sex"]:checked');
    const sex = sexElement ? sexElement.value : 'Not specified';
    const age = document.getElementById('cashier_age')?.value.trim() || 'Not provided';

    if (!email && !phone) { alert("Please provide either an email address or phone number."); return; }

    const userId = generateId('cashier');
    const username = generateUsername(firstName, lastName);
    const tempPassword = generateTempPassword();
    const user = { id: userId, name: `${firstName} ${lastName}`, email: email || 'Not provided', phone: phone || 'Not provided', age, sex, address: document.getElementById('cashier_address').value.trim(), role: 'cashier', username, password: tempPassword, passwordChanged: false, status: 'Active' };
    
    let users = JSON.parse(localStorage.getItem('autotech_users')) || [];
    users.push(user);
    localStorage.setItem('autotech_users', JSON.stringify(users));

    const credDiv = document.getElementById('cashierCredentials');
    if (credDiv) { credDiv.innerHTML = `<h3>Account Created!</h3><p><strong>ID:</strong> ${userId}</p><p><strong>Username:</strong> ${username}</p><p><strong>Temp Password:</strong> ${tempPassword}</p>`; credDiv.style.display = 'block'; }
    document.getElementById('cashierSuccess').style.display = 'block';
    document.getElementById('cashierForm').reset();
    setTimeout(() => document.getElementById('cashierSuccess').style.display = 'none', 4000);
}

function handleClientSignup(event) {
    event.preventDefault();
    const sexElement = document.querySelector('input[name="client_sex"]:checked');
    const sex = sexElement ? sexElement.value : 'Not specified';
    const firstName = document.getElementById('client_firstname').value.trim();
    const lastName = document.getElementById('client_lastname').value.trim();
    const email = document.getElementById('client_email').value.trim();
    const phone = document.getElementById('client_phone').value.trim();
    if (!email && !phone) { alert("Please provide either an email address or phone number."); return; }

    const userId = generateId('client');
    const username = generateUsername(firstName, lastName);
    const tempPassword = generateTempPassword();
    const user = { id: userId, name: `${firstName} ${lastName}`, email: email || 'Not provided', phone: phone || 'Not provided', address: document.getElementById('client_address').value.trim(), sex, vehicleType: document.getElementById('client_vehicle_type').value.trim(), problem: document.getElementById('client_problem').value.trim(), role: 'client', username, password: tempPassword, passwordChanged: false, status: 'Pending Approval', paymentStatus: 'Unpaid', billAmount: 0 };
    
    let users = JSON.parse(localStorage.getItem('autotech_users')) || [];
    users.push(user);
    localStorage.setItem('autotech_users', JSON.stringify(users));

    const credDiv = document.getElementById('clientCredentials');
    if (credDiv) { credDiv.innerHTML = `<h3>Account Created!</h3><p><strong>ID:</strong> ${userId}</p><p><strong>Username:</strong> ${username}</p><p><strong>Temp Password:</strong> ${tempPassword}</p>`; credDiv.style.display = 'block'; }
    document.getElementById('clientSuccess').style.display = 'block';
    document.getElementById('clientForm').reset();
    setTimeout(() => document.getElementById('clientSuccess').style.display = 'none', 4000);
}

function handleFirstAdminSetup(event) {
    event.preventDefault();
    const firstName = document.getElementById('setup_firstname').value.trim();
    const lastName = document.getElementById('setup_lastname').value.trim();
    const email = document.getElementById('setup_email').value.trim();
    const phone = document.getElementById('setup_phone').value.trim();
    if (!email && !phone) { alert("Please provide either an email address or phone number."); return; }

    const user = { name: `${firstName} ${lastName}`, email: email || 'Not provided', phone: phone || 'Not provided', address: document.getElementById('setup_address').value.trim(), role: 'admin', username: document.getElementById('setup_username').value.trim(), password: document.getElementById('setup_password').value, status: 'Active' };
    let users = JSON.parse(localStorage.getItem('autotech_users')) || [];
    if (users.some(u => u.role === 'admin')) { alert("An admin account already exists!"); return; }
    if (users.some(u => u.username === user.username)) { alert("Username already exists!"); return; }

    users.push(user);
    localStorage.setItem('autotech_users', JSON.stringify(users));
    const successMsg = document.getElementById('setupSuccess');
    if (successMsg) successMsg.style.display = 'block';
    document.getElementById('setupForm').reset();
    setTimeout(() => { if (successMsg) successMsg.style.display = 'none'; showPage('login'); }, 2000);
}

function handleLogin(event) {
    event.preventDefault();
    const role = selectedRole;
    const username = document.getElementById('l_username').value.trim();
    const password = document.getElementById('l_password').value;
    const errorMsg = document.getElementById('loginError');

    const users = JSON.parse(localStorage.getItem('autotech_users')) || [];
    const foundUser = users.find(u => u.username === username && verifyPassword(password, u.password));

    if (role === 'admin' && !users.some(u => u.role === 'admin')) { alert("No admin account exists yet."); showPage('admin-setup'); return; }

    if (foundUser) {
        if (foundUser.role !== role) { errorMsg.innerText = `This account is registered as a ${foundUser.role}, not ${role}.`; errorMsg.style.display = 'block'; return; }
        errorMsg.style.display = 'none';
        document.getElementById('loginForm').reset();
        localStorage.setItem('autotech_current_user', foundUser.username);
        
        if (!foundUser.passwordChanged && foundUser.role !== 'admin') { showChangePasswordModal(); return; }
        
        if (role === 'client') { loadUserDashboard(); showPage('user-dashboard'); } 
        else if (role === 'staff') { loadStaffDashboard(); showPage('staff-dashboard'); } 
        else if (role === 'admin') { loadAdminDashboard(); showPage('admin-dashboard'); } 
        else if (role === 'cashier') { loadCashierDashboard(); showPage('cashier-dashboard'); }
    } else {
        errorMsg.innerText = "Invalid username or password.";
        errorMsg.style.display = 'block';
        errorMsg.style.animation = 'none';
        const forceReflow = errorMsg.offsetWidth;
        errorMsg.style.animation = 'popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    }
}

function showChangePasswordModal() { document.getElementById('changePasswordModal').classList.add('active'); }
function closeModalOnOutsideClick(event) { if (event.target.id === 'changePasswordModal') backToLoginFromModal(); }
function backToLoginFromModal() {
    const modal = document.getElementById('changePasswordModal');
    if (modal) modal.classList.remove('active');
    localStorage.removeItem('autotech_current_user');
    const form = document.getElementById('changePasswordForm');
    if (form) form.reset();
    showPage('login');
}

function handleChangePassword(event) {
    event.preventDefault();
    const currentPassword = document.getElementById('current_password').value;
    const newPassword = document.getElementById('new_password').value;
    const confirmPassword = document.getElementById('confirm_password').value;
    if (newPassword !== confirmPassword) { alert("New passwords do not match!"); return; }

    const currentUsername = localStorage.getItem('autotech_current_user');
    let users = JSON.parse(localStorage.getItem('autotech_users')) || [];
    const userIndex = users.findIndex(u => u.username === currentUsername);

    if (userIndex !== -1) {
        if (!verifyPassword(currentPassword, users[userIndex].password)) { alert("Current password is incorrect!"); return; }
        users[userIndex].password = hashPassword(newPassword);
        users[userIndex].passwordChanged = true;
        localStorage.setItem('autotech_users', JSON.stringify(users));
        document.getElementById('changePasswordModal').classList.remove('active');
        document.getElementById('changePasswordForm').reset();
        alert("Password changed successfully!");
        const user = users[userIndex];
        if (user.role === 'client') { loadUserDashboard(); showPage('user-dashboard'); } 
        else if (user.role === 'staff') { loadStaffDashboard(); showPage('staff-dashboard'); } 
        else if (user.role === 'cashier') { loadCashierDashboard(); showPage('cashier-dashboard'); }
    }
}

function handleForgotPassword(event) {
    event.preventDefault();
    const idNumber = document.getElementById('forgot_id').value.trim();
    const emailOrPhone = document.getElementById('forgot_email').value.trim();
    const newPassword = document.getElementById('forgot_new_password').value;
    let users = JSON.parse(localStorage.getItem('autotech_users')) || [];
    const userIndex = users.findIndex(u => u.id === idNumber && (u.email === emailOrPhone || u.phone === emailOrPhone));
    const successMsg = document.getElementById('forgotSuccess');
    const errorMsg = document.getElementById('forgotError');

    if (userIndex !== -1) {
        users[userIndex].password = hashPassword(newPassword);
        users[userIndex].passwordChanged = true;
        localStorage.setItem('autotech_users', JSON.stringify(users));
        successMsg.style.display = 'block';
        document.getElementById('forgotForm').reset();
        setTimeout(() => { successMsg.style.display = 'none'; showPage('login'); }, 2000);
    } else {
        errorMsg.style.display = 'block';
        setTimeout(() => { errorMsg.style.display = 'none'; }, 3000);
    }
}

function handleLogout() { localStorage.removeItem('autotech_current_user'); navigateToSection('home-section'); }
function checkAndShowAdminSetup() {
    const users = JSON.parse(localStorage.getItem('autotech_users')) || [];
    if (users.some(u => u.role === 'admin')) alert('An admin account already exists!'); else showPage('admin-setup');
}

// ==========================================
// 6. DASHBOARD LOADING LOGIC
// ==========================================
function loadUserDashboard() {
    const currentUsername = localStorage.getItem('autotech_current_user');
    const users = JSON.parse(localStorage.getItem('autotech_users')) || [];
    const user = users.find(u => u.username === currentUsername);
    if (user) {
        const title = user.sex === 'Female' ? "Ma'am" : "Sir";
        const welcomeEl = document.getElementById('userWelcome');
        if (welcomeEl) welcomeEl.innerHTML = `Welcome, ${title} ${user.name}! <span class="id-badge">${user.id}</span>`;
        const problemEl = document.getElementById('reportedProblem');
        if (problemEl) problemEl.innerText = `Vehicle: ${user.vehicleType}\n\nProblem: ${user.problem}`;
        const statusBadge = document.getElementById('approvalStatus');
        if (statusBadge) {
            statusBadge.innerText = user.status;
            let statusClass = 'status-pending';
            if (user.status === 'Approved') statusClass = 'status-approved';
            else if (user.status === 'Ongoing Repair') statusClass = 'status-ongoing';
            else if (user.status === 'Fixed' || user.status === 'Completed') statusClass = 'status-fixed';
            else if (user.status === 'Rejected') statusClass = 'status-rejected';
            statusBadge.className = `status-badge ${statusClass}`;
        }
    }
} 

function loadStaffDashboard() {
    const currentUsername = localStorage.getItem('autotech_current_user');
    const users = JSON.parse(localStorage.getItem('autotech_users')) || [];
    const staffUser = users.find(u => u.username === currentUsername);
    if (staffUser && staffUser.role === 'staff') {
        const welcomeEl = document.getElementById('staffWelcome');
        if (welcomeEl) welcomeEl.innerHTML = `Welcome, ${staffUser.name}! <span class="id-badge">${staffUser.id}</span>`;
        
        const availBadge = document.getElementById('staffAvailabilityBadge');
        if (availBadge) {
            const isAvailable = staffUser.availability !== 'Busy';
            availBadge.innerText = isAvailable ? 'Available' : 'Busy';
            availBadge.className = `status-badge ${isAvailable ? 'status-available' : 'status-busy'}`;
        }

        const changePwdBtn = document.getElementById('staffChangePasswordBtn');
        if (changePwdBtn) changePwdBtn.style.display = staffUser.passwordChanged ? 'none' : 'inline-flex';

        const staffClientList = document.getElementById('staffClientList');
        if (!staffClientList) return;
        const clients = users.filter(u => u.role === 'client' && (u.status === 'Approved' || u.status === 'Ongoing Repair'));

        if (clients.length === 0) { staffClientList.innerHTML = '<p style="color: var(--text-secondary); text-align: center; padding: 2rem;">No pending or ongoing repair requests.</p>'; return; }

        let html = '';
        clients.forEach(client => {
            const isOngoing = client.status === 'Ongoing Repair';
            let actionButtons = '';
            if (isOngoing) actionButtons = `<button class="btn-approve" onclick="markAsFixed('${client.username}')">Mark as Fixed</button>`;
            else {
                const canStart = staffUser.availability !== 'Busy';
                if (canStart) actionButtons = `<button class="btn-approve" onclick="startRepair('${client.username}')">Start Repair</button>`;
                else actionButtons = `<span style="color: var(--text-secondary); font-size: 0.85rem; font-style: italic;">You are currently busy</span>`;
            }
            html += `<div class="user-card"><div class="user-card-header"><h3>${client.name} <span class="id-badge">${client.id}</span></h3><span class="role-badge role-client">${client.status}</span></div><div class="user-details"><p><strong>Vehicle:</strong> ${client.vehicleType}</p><p><strong>Problem:</strong> ${client.problem}</p><p><strong>Contact:</strong> ${client.phone !== 'Not provided' ? client.phone : client.email}</p></div><div class="approval-actions" style="margin-top: 1rem; justify-content: flex-end;">${actionButtons}</div></div>`;
        });
        staffClientList.innerHTML = html;
    }
}

function startRepair(clientUsername) {
    const currentUsername = localStorage.getItem('autotech_current_user');
    let users = JSON.parse(localStorage.getItem('autotech_users')) || [];
    const staffIndex = users.findIndex(u => u.username === currentUsername);
    const clientIndex = users.findIndex(u => u.username === clientUsername);
    if (staffIndex !== -1 && clientIndex !== -1) {
        if (users[staffIndex].availability === 'Busy') { alert("You are currently busy with another repair."); return; }
        users[clientIndex].status = 'Ongoing Repair';
        users[staffIndex].availability = 'Busy';
        localStorage.setItem('autotech_users', JSON.stringify(users));
        loadStaffDashboard();
        alert("Repair started! Your status is now 'Busy'.");
    }
}

function markAsFixed(clientUsername) {
    const currentUsername = localStorage.getItem('autotech_current_user');
    let users = JSON.parse(localStorage.getItem('autotech_users')) || [];
    const staffIndex = users.findIndex(u => u.username === currentUsername);
    const clientIndex = users.findIndex(u => u.username === clientUsername);
    if (staffIndex !== -1 && clientIndex !== -1) {
        users[clientIndex].status = 'Fixed';
        users[staffIndex].availability = 'Available';
        localStorage.setItem('autotech_users', JSON.stringify(users));
        loadStaffDashboard();
        alert("Vehicle marked as Fixed! Ready for cashier billing.");
    }
}

// ==========================================
// 7. CASHIER DASHBOARD LOGIC
// ==========================================
function loadCashierDashboard() {
    const currentUsername = localStorage.getItem('autotech_current_user');
    const users = JSON.parse(localStorage.getItem('autotech_users')) || [];
    const transactions = JSON.parse(localStorage.getItem('autotech_transactions')) || [];
    const cashier = users.find(u => u.username === currentUsername);

    if (cashier && cashier.role === 'cashier') {
        document.getElementById('cashierWelcome').innerHTML = `Welcome, ${cashier.name}! <span class="id-badge">${cashier.id}</span>`;

        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        const monthlyTransactions = transactions.filter(t => {
            const d = new Date(t.date);
            return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
        });

        const monthlyIncome = monthlyTransactions.reduce((sum, t) => sum + parseFloat(t.amount), 0);
        const pendingPayments = users.filter(u => u.role === 'client' && u.paymentStatus === 'Unpaid' && (u.status === 'Fixed' || u.status === 'Completed')).length;
        const completedPayments = transactions.length;

        document.getElementById('cashierMonthlyIncome').innerText = `₱${monthlyIncome.toLocaleString()}`;
        document.getElementById('cashierTotalTransactions').innerText = completedPayments;
        document.getElementById('cashierPendingPayments').innerText = pendingPayments;
        document.getElementById('cashierCompletedPayments').innerText = completedPayments;

        const billingList = document.getElementById('billingList');
        const pendingClients = users.filter(u => u.role === 'client' && (u.status === 'Fixed' || u.status === 'Completed') && u.paymentStatus !== 'Paid');
        
        if (pendingClients.length === 0) {
            billingList.innerHTML = '<p style="color: var(--text-secondary); text-align: center; padding: 2rem;">No pending bills. All clients are paid up!</p>';
        } else {
            let html = '';
            pendingClients.forEach(client => {
                html += `
                    <div class="user-card">
                        <div class="user-card-header">
                            <h3>${client.name} <span class="id-badge">${client.id}</span></h3>
                            <span class="status-badge status-pending">Unpaid</span>
                        </div>
                        <div class="user-details">
                            <p><strong>Vehicle:</strong> ${client.vehicleType}</p>
                            <p><strong>Service/Problem:</strong> ${client.problem}</p>
                            <p><strong>Contact:</strong> ${client.phone !== 'Not provided' ? client.phone : client.email}</p>
                        </div>
                        <div class="approval-actions" style="margin-top: 1rem; align-items: center; flex-wrap: wrap;">
                            <input type="number" id="billAmount_${client.username}" placeholder="Enter Amount (₱)" value="${client.billAmount || ''}">
                            <button class="btn-approve" onclick="processPayment('${client.username}')">Process Payment</button>
                        </div>
                    </div>
                `;
            });
            billingList.innerHTML = html;
        }

        const historyList = document.getElementById('historyList');
        if (transactions.length === 0) {
            historyList.innerHTML = '<p style="color: var(--text-secondary); text-align: center; padding: 2rem;">No transaction history yet.</p>';
        } else {
            const sortedTransactions = [...transactions].reverse();
            let html = '';
            sortedTransactions.forEach(t => {
                html += `
                    <div class="user-card">
                        <div class="user-card-header">
                            <h3>Receipt #${t.receiptId}</h3>
                            <span class="status-badge status-approved">Paid</span>
                        </div>
                        <div class="user-details">
                            <p><strong>Client:</strong> ${t.clientName} (${t.clientId})</p>
                            <p><strong>Service:</strong> ${t.service}</p>
                            <p><strong>Amount:</strong> ₱${parseFloat(t.amount).toLocaleString()}</p>
                            <p><strong>Date & Time:</strong> ${t.date} at ${t.time}</p>
                            <p><strong>Cashier:</strong> ${t.cashierName}</p>
                        </div>
                    </div>
                `;
            });
            historyList.innerHTML = html;
        }

        renderIncomeGraph(transactions);
    }
}

function processPayment(clientUsername) {
    const amountInput = document.getElementById(`billAmount_${clientUsername}`);
    const amount = parseFloat(amountInput.value);

    if (!amount || amount <= 0) {
        alert("Please enter a valid bill amount.");
        return;
    }

    const currentUsername = localStorage.getItem('autotech_current_user');
    let users = JSON.parse(localStorage.getItem('autotech_users')) || [];
    let transactions = JSON.parse(localStorage.getItem('autotech_transactions')) || [];
    
    const clientIndex = users.findIndex(u => u.username === clientUsername);
    const cashier = users.find(u => u.username === currentUsername);

    if (clientIndex !== -1 && cashier) {
        const client = users[clientIndex];
        const now = new Date();
        const dateStr = now.toLocaleDateString('en-US');
        const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        const receiptId = `RCP-${String(transactions.length + 1).padStart(4, '0')}`;

        client.paymentStatus = 'Paid';
        client.billAmount = amount;
        client.status = 'Completed';

        const transaction = {
            receiptId,
            clientName: client.name,
            clientId: client.id,
            service: client.problem,
            amount: amount,
            date: dateStr,
            time: timeStr,
            cashierName: cashier.name,
            cashierId: cashier.id
        };

        transactions.push(transaction);

        localStorage.setItem('autotech_users', JSON.stringify(users));
        localStorage.setItem('autotech_transactions', JSON.stringify(transactions));

        alert(`Payment of ₱${amount.toLocaleString()} processed successfully!\nReceipt ID: ${receiptId}`);
        loadCashierDashboard();
    }
}

function renderIncomeGraph(transactions) {
    const graphContainer = document.getElementById('incomeGraph');
    const serviceIncome = {};
    
    transactions.forEach(t => {
        const service = t.service.split(' ')[0] || 'General Service'; 
        if (!serviceIncome[service]) serviceIncome[service] = 0;
        serviceIncome[service] += parseFloat(t.amount);
    });

    const maxIncome = Math.max(...Object.values(serviceIncome), 1);

    if (Object.keys(serviceIncome).length === 0) {
        graphContainer.innerHTML = '<p style="color: var(--text-secondary); text-align: center; padding: 2rem;">No income data available yet.</p>';
        return;
    }

    let html = '<div style="display: flex; flex-direction: column; gap: 1.5rem; margin-top: 1rem;">';
    for (const [service, income] of Object.entries(serviceIncome)) {
        const percentage = (income / maxIncome) * 100;
        html += `
            <div>
                <div class="bar-label">
                    <span>${service} Repair/Service</span>
                    <span>₱${income.toLocaleString()}</span>
                </div>
                <div class="bar-track">
                    <div class="bar-fill" style="width: ${percentage}%;"></div>
                </div>
            </div>
        `;
    }
    html += '</div>';
    graphContainer.innerHTML = html;
}

// ==========================================
// 8. ADMIN DASHBOARD LOGIC (UPDATED FOR SEPARATED LISTS)
// ==========================================
function loadAdminDashboard() {
    const currentUsername = localStorage.getItem('autotech_current_user');
    const users = JSON.parse(localStorage.getItem('autotech_users')) || [];
    const user = users.find(u => u.username === currentUsername);
    if (user && user.role === 'admin') {
        const welcomeEl = document.getElementById('adminWelcome');
        if (welcomeEl) welcomeEl.innerText = `Welcome, Admin ${user.name}!`;
        const elUsers = document.getElementById('totalUsers'); if (elUsers) elUsers.innerText = users.length;
        const elClients = document.getElementById('totalClients'); if (elClients) elClients.innerText = users.filter(u => u.role === 'client').length;
        const elStaff = document.getElementById('totalStaff'); if (elStaff) elStaff.innerText = users.filter(u => u.role === 'staff').length;
        const elCashiers = document.getElementById('totalCashiers'); if (elCashiers) elCashiers.innerText = users.filter(u => u.role === 'cashier').length;
        
        // Load the separated lists
        loadClientsList();
        loadStaffList();
        loadCashiersList();
        loadPendingApprovals();
    }
}

// NEW: Generic function to render users by specific role
function renderUserListByRole(role, containerId) {
    const users = JSON.parse(localStorage.getItem('autotech_users')) || [];
    const currentUsername = localStorage.getItem('autotech_current_user');
    const container = document.getElementById(containerId);
    
    if (!container) return;

    const filteredUsers = users.filter(u => u.role === role);

    if (filteredUsers.length === 0) {
        container.innerHTML = `<p style="color: var(--text-secondary); text-align: center; padding: 2rem;">No ${role}s registered yet.</p>`;
        return;
    }

    let html = '';
    filteredUsers.forEach(user => {
        const roleClass = `role-${user.role}`;
        const isSelf = user.username === currentUsername;
        const passwordDisplay = user.passwordChanged ? '<em style="color: var(--text-secondary);">Encrypted</em>' : `<code style="color: var(--accent);">${user.password}</code>`;
        const deleteButton = isSelf ? '<span style="color: var(--text-secondary); font-size: 0.85rem; font-style: italic;">(Current User)</span>' : `<button class="btn-delete" onclick="deleteUser('${user.username}')">Delete Account</button>`;
        
        let extraDetails = '';
        if (role === 'client') {
            extraDetails = `
                <p><strong>Vehicle:</strong> ${user.vehicleType}</p>
                <p><strong>Status:</strong> ${user.status}</p>
                <p><strong>Payment:</strong> ${user.paymentStatus || 'N/A'}</p>
            `;
        } else {
            extraDetails = `
                <p><strong>Age:</strong> ${user.age || 'N/A'}</p>
                <p><strong>Gender:</strong> ${user.sex || 'N/A'}</p>
            `;
        }

        html += `
            <div class="user-card">
                <div class="user-card-header">
                    <h3>${user.name} <span class="id-badge">${user.id || 'N/A'}</span></h3>
                    <span class="role-badge ${roleClass}">${user.role}</span>
                </div>
                <div class="user-details">
                    <p><strong>Username:</strong> ${user.username}</p>
                    <p><strong>Password:</strong> ${passwordDisplay}</p>
                    <p><strong>Email:</strong> ${user.email || 'Not provided'}</p>
                    <p><strong>Phone:</strong> ${user.phone || 'Not provided'}</p>
                    <p><strong>Address:</strong> ${user.address}</p>
                    ${extraDetails}
                </div>
                <div class="approval-actions" style="margin-top: 1rem; justify-content: flex-end;">
                    ${deleteButton}
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
}

function loadClientsList() {
    renderUserListByRole('client', 'clientsList');
}

function loadStaffList() {
    renderUserListByRole('staff', 'staffList');
}

function loadCashiersList() {
    renderUserListByRole('cashier', 'cashiersList');
}

function loadPendingApprovals() {
    const users = JSON.parse(localStorage.getItem('autotech_users')) || [];
    const pendingUsers = users.filter(u => u.role === 'client' && u.status === 'Pending Approval');
    const pendingList = document.getElementById('pendingList');
    if (!pendingList) return;
    if (pendingUsers.length === 0) { pendingList.innerHTML = '<p style="color: var(--text-secondary); text-align: center; padding: 2rem;">No pending approvals.</p>'; return; }
    let html = '';
    pendingUsers.forEach(user => {
        html += `<div class="user-card"><div class="user-card-header"><h3>${user.name}</h3><span class="role-badge role-client">Client</span></div><div class="user-details"><p><strong>Vehicle:</strong> ${user.vehicleType}</p><p><strong>Problem:</strong> ${user.problem}</p><p><strong>Contact:</strong> ${user.email || user.phone}</p></div><div class="approval-actions"><button class="btn-approve" onclick="approveUser('${user.username}')">Approve</button><button class="btn-reject" onclick="rejectUser('${user.username}')">Reject</button></div></div>`;
    });
    pendingList.innerHTML = html;
}

function approveUser(username) { let users = JSON.parse(localStorage.getItem('autotech_users')) || []; const i = users.findIndex(u => u.username === username); if (i !== -1) { users[i].status = 'Approved'; localStorage.setItem('autotech_users', JSON.stringify(users)); loadPendingApprovals(); alert('Approved!'); } }
function rejectUser(username) { let users = JSON.parse(localStorage.getItem('autotech_users')) || []; const i = users.findIndex(u => u.username === username); if (i !== -1) { users[i].status = 'Rejected'; localStorage.setItem('autotech_users', JSON.stringify(users)); loadPendingApprovals(); alert('Rejected.'); } }
function deleteUser(username) {
    const currentUsername = localStorage.getItem('autotech_current_user');
    if (username === currentUsername) { alert("You cannot delete your own account."); return; }
    if (confirm(`Delete account for "${username}"?`)) {
        let users = JSON.parse(localStorage.getItem('autotech_users')) || [];
        users = users.filter(u => u.username !== username);
        localStorage.setItem('autotech_users', JSON.stringify(users));
        loadAdminDashboard(); // Refreshes all lists
        alert('Account deleted.');
    }
}

// ==========================================
// 9. INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    const users = JSON.parse(localStorage.getItem('autotech_users')) || [];
    if (!users.some(u => u.role === 'admin')) setTimeout(() => showPage('admin-setup'), 500);

    document.addEventListener('click', () => { const e = document.getElementById('loginError'); if (e && e.style.display === 'block') e.style.display = 'none'; });
    const lU = document.getElementById('l_username'); const lP = document.getElementById('l_password');
    if (lU) lU.addEventListener('input', () => { const e = document.getElementById('loginError'); if (e) e.style.display = 'none'; });
    if (lP) lP.addEventListener('input', () => { const e = document.getElementById('loginError'); if (e) e.style.display = 'none'; });

    const scrollSections = document.querySelectorAll('.scroll-section');
    const revealObserver = new IntersectionObserver((entries) => { entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); }); }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
    scrollSections.forEach(section => revealObserver.observe(section));
});