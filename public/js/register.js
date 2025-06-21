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

        // Basic validation
        if (!email || !password || !confirmPassword) {
            showError('Please fill in all fields.');
            return;
        }

        if (!isValidEmail(email)) {
            showError('Please enter a valid email address.');
            return;
        }

        if (password !== confirmPassword) {
            showError('Passwords do not match.');
            return;
        }

        if (password.length < 6) {
            showError('Password must be at least 6 characters long.');
            return;
        }

        // Show loading state
        const submitBtn = registerForm.querySelector('.login-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Creating Account...';
        submitBtn.disabled = true;

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
            passwordInput.style.borderColor = '#c33';
        } else {
            passwordInput.style.borderColor = '#e0e0e0';
        }
    });

    // Confirm password validation (real-time)
    confirmPasswordInput.addEventListener('input', () => {
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        if (confirmPassword.length > 0 && password !== confirmPassword) {
            confirmPasswordInput.style.borderColor = '#c33';
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
        errorDiv.style.cssText = `
            background-color: #fee;
            color: #c33;
            padding: 0.75rem;
            border-radius: 4px;
            margin-bottom: 1rem;
            font-size: 0.9rem;
            border: 1px solid #fcc;
        `;
        
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
        successDiv.style.cssText = `
            background-color: #efe;
            color: #363;
            padding: 0.75rem;
            border-radius: 4px;
            margin-bottom: 1rem;
            font-size: 0.9rem;
            border: 1px solid #cfc;
        `;
        
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

    // Match register content height to image height
    const registerContent = document.querySelector('.login-content');
    const registerImage = document.querySelector('.login-image img');

    const setContentHeight = () => {
        // Only run on desktop layout where the image is visible
        if (registerContent && registerImage && window.innerWidth > 1024) {
            const imageHeight = registerImage.offsetHeight;
            registerContent.style.height = `${imageHeight}px`;
        } else if (registerContent) {
            registerContent.style.height = 'auto'; // Reset for smaller screens
        }
    };

    if (registerImage) {
        // Run when the image is loaded
        registerImage.addEventListener('load', setContentHeight);
        
        // If the image is already complete (from cache)
        if (registerImage.complete) {
            setContentHeight();
        }

        // Adjust on window resize
        window.addEventListener('resize', setContentHeight);
    }
}); 