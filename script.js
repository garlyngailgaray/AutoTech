// --- PAGE NAVIGATION & TRANSITIONS ---
function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
    });

    setTimeout(() => {
        document.getElementById(pageId).classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
}

// --- BUTTON CLICK ANIMATION ---
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function() {
            this.classList.remove('btn-click-effect');
            // Assigning to a variable satisfies linters that flag "unused expressions"
            const forceReflow = // Force reflow to restart animation
this.offsetWidth; 
            this.classList.add('btn-click-effect');
        });
    });
});

// --- SIGNUP LOGIC ---
function handleSignup(event) {
    event.preventDefault();
    
    const user = {
        role: document.getElementById('role').value,
        name: document.getElementById('s_name').value,
        address: document.getElementById('s_address').value,
        problem: document.getElementById('s_problem').value,
        username: document.getElementById('s_username').value,
        password: document.getElementById('s_password').value
    };

    let users = JSON.parse(localStorage.getItem('autotech_users')) || [];
    
    if (users.some(u => u.username === user.username)) {
        alert("Username already exists! Please choose another.");
        return;
    }

    users.push(user);
    localStorage.setItem('autotech_users', JSON.stringify(users));

    const successMsg = document.getElementById('signupSuccess');
    successMsg.style.display = 'block';
    document.getElementById('signupForm').reset();

    setTimeout(() => {
        successMsg.style.display = 'none';
        showPage('login');
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
        document.getElementById('welcomeMsg').innerText = `Hello ${foundUser.name}! You are logged in as a ${foundUser.role}.`;
        showPage('dashboard');
    } else {
        errorMsg.style.display = 'block';
        errorMsg.style.animation = 'none';
        const forceReflow = errorMsg.offsetWidth;
        errorMsg.style.animation = 'slideDown 0.5s ease-out';
    }
}

// --- LOGOUT LOGIC ---
function handleLogout() {
    showPage('home');
}