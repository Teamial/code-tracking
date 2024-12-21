// app.js

// Determine the current page
const currentPage = window.location.pathname;

// Handle Registration
if (currentPage.includes("register.html")) {
    handleRegistration();
} else if (currentPage.includes("index.html")) {
    handleLogin();
}

// Function to handle user registration
function handleRegistration() {
    const registerForm = document.getElementById("register-form");

    registerForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const username = document.getElementById("register-username").value.trim();
        const email = document.getElementById("register-email").value.trim().toLowerCase();
        const password = document.getElementById("register-password").value;

        if (username === "" || email === "" || password === "") {
            alert("Please fill in all fields.");
            return;
        }

        if (!isValidEmail(email)) {
            alert("Please enter a valid email address.");
            return;
        }

        // Check if user already exists
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const userExists = users.find(user => user.email === email);

        if (userExists) {
            alert("User with this email already exists.");
            return;
        }

        // Hash the password (optional for demonstration)
        const hashedPassword = sha256(password);

        // Save new user
        users.push({ username, email, password: hashedPassword });
        localStorage.setItem("users", JSON.stringify(users));
        alert("Registration successful! You can now log in.");
        registerForm.reset();
        // Redirect to login page
        window.location.href = "/index.html";
    });
}

// Function to handle user login
function handleLogin() {
    const loginForm = document.getElementById("login-form");
    const forgotPassword = document.getElementById("forgot-password");

    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = document.getElementById("email").value.trim().toLowerCase();
        const password = document.getElementById("password").value;
        const rememberMe = document.getElementById("remember-me").checked;

        if (email === "" || password === "") {
            alert("Please enter both email and password.");
            return;
        }

        if (!isValidEmail(email)) {
            alert("Please enter a valid email address.");
            return;
        }

        // Load users from localStorage
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const hashedPassword = sha256(password);
        const user = users.find(user => user.email === email && user.password === hashedPassword);

        if (user) {
            // Set session
            if (rememberMe) {
                localStorage.setItem("loggedInUser", JSON.stringify(user));
            } else {
                sessionStorage.setItem("loggedInUser", JSON.stringify(user));
            }
            // Redirect to todo app
            window.location.href = "/todo_app/todo.html";
        } else {
            alert("Invalid email or password.");
        }
    });

    // Handle Forgot Password (Basic Implementation)
    forgotPassword.addEventListener("click", (e) => {
        e.preventDefault();
        const email = prompt("Please enter your registered email:");

        if (email) {
            const users = JSON.parse(localStorage.getItem("users")) || [];
            const user = users.find(user => user.email === email.trim().toLowerCase());

            if (user) {
                // In a real application, you'd send a password reset email.
                // For this demo, we'll just allow the user to reset their password directly.
                const newPassword = prompt("Enter your new password:");
                if (newPassword) {
                    user.password = sha256(newPassword); // Hash the new password
                    localStorage.setItem("users", JSON.stringify(users));
                    alert("Password reset successful! You can now log in with your new password.");
                }
            } else {
                alert("No user found with this email.");
            }
        }
    });
}

// Helper function to validate email format
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.toLowerCase());
}
