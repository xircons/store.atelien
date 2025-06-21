document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');

    // Check if user is already logged in
    if (window.auth && window.auth.isAuthenticated()) {
        window.location.href = '/index.html';
        return;
    }

    // Form submission handler
    registerForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        // Validation
        if (!email || !password || !confirmPassword) {
            showError('Please fill in all fields.');
            return;
        }

        if (!isValidEmail(email)) {
            showError('Please enter a valid email address.');
            return;
        }

        if (password.length < 6) {
            showError('Password must be at least 6 characters long.');
            return;
        }

        if (password !== confirmPassword) {
            showError('Passwords do not match.');
            return;
        }

        // Show loading state
        const submitBtn = registerForm.querySelector('.login-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Creating Account...';
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            
            const data = await response.json();
            
            if (data.success) {
                showSuccess('Registration successful!');
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
            } else {
                showError(data.error || 'Registration failed.');
            }
        } catch (err) {
            console.error('Registration error:', err);
            showError('An error occurred. Please try again.');
        } finally {
            // Reset button state
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');
        }
    });

    // Email validation
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Password strength validation (real-time)
    passwordInput.addEventListener('input', () => {
        const password = passwordInput.value;
        if (password.length > 0 && password.length < 6) {
            passwordInput.style.borderColor = '#ff6b6b';
        } else if (password.length >= 6) {
            passwordInput.style.borderColor = '#51cf66';
        } else {
            passwordInput.style.borderColor = '#e0e0e0';
        }
    });

    // Confirm password validation (real-time)
    confirmPasswordInput.addEventListener('input', () => {
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        if (confirmPassword.length > 0 && password !== confirmPassword) {
            confirmPasswordInput.style.borderColor = '#ff6b6b';
        } else if (confirmPassword.length > 0 && password === confirmPassword) {
            confirmPasswordInput.style.borderColor = '#51cf66';
        } else {
            confirmPasswordInput.style.borderColor = '#e0e0e0';
        }
    });

    // Error message display
    function showError(message) {
        // Remove existing error messages
        removeMessages();
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        
        registerForm.insertBefore(errorDiv, registerForm.firstChild);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 5000);
    }

    // Success message display
    function showSuccess(message) {
        // Remove existing messages
        removeMessages();
        
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.textContent = message;
        
        registerForm.insertBefore(successDiv, registerForm.firstChild);
    }

    // Remove existing messages
    function removeMessages() {
        const existingMessages = registerForm.querySelectorAll('.error-message, .success-message');
        existingMessages.forEach(msg => msg.remove());
    }

    // Input focus effects
    const inputs = registerForm.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.style.transform = 'translateY(-2px)';
        });
        
        input.addEventListener('blur', () => {
            input.parentElement.style.transform = 'translateY(0)';
        });
    });
}); 