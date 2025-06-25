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
        clearValidationErrors();
        // Custom cart-style alert for empty email
        if (!email) {
            showFieldError(emailInput, 'Email is required');
            showCartAlert('Email is required');
            return;
        }
        // Custom cart-style alert for invalid email (missing @)
        if (!email.includes('@')) {
            showFieldError(emailInput, "Please include an '@' in the email address.");
            showCartAlert(`Please include an '@' in the email address. '${email}' is missing an '@'.`);
            return;
        } else if (!isValidEmail(email)) {
            showFieldError(emailInput, 'Email is incomplete.');
            showCartAlert(`'${email}' is not a valid email format.`);
            return;
        }
        // Custom cart-style alert for empty password
        if (!password) {
            showFieldError(passwordInput, 'Password is required');
            showCartAlert('Password is required');
            return;
        }
        // Custom cart-style alert for short password
        if (password.length < 6) {
            showFieldError(passwordInput, 'Password must be at least 6 characters long.');
            showCartAlert('Password must be at least 6 characters long.');
            return;
        }

        if (!confirmPassword) {
            showFieldError(confirmPasswordInput, 'Please confirm your password');
            showCartAlert('Please confirm your password');
            return;
        } else if (password !== confirmPassword) {
            showFieldError(confirmPasswordInput, 'Passwords do not match');
            showCartAlert('Passwords do not match');
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

    // Show field-specific error
    function showFieldError(field, message) {
        field.classList.add('validation-triggered', 'error');
        field.style.borderBottomColor = '#ff0000';
        // The message parameter is kept for future use, like showing a tooltip
    }

    // Clear validation errors
    function clearValidationErrors() {
        const inputs = registerForm.querySelectorAll('input');
        inputs.forEach(input => {
            input.classList.remove('validation-triggered', 'error');
        });
    }

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

    // Input focus effects and validation clearing
    const inputs = registerForm.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.style.transform = 'translateY(-2px)';
        });
        
        input.addEventListener('blur', () => {
            input.parentElement.style.transform = 'translateY(0)';
        });

        // Clear validation errors when user starts typing
        input.addEventListener('input', () => {
            if (input.classList.contains('validation-triggered')) {
                input.classList.remove('validation-triggered', 'error');
            }
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

    // Function to show cart-style alerts (copied from cart.js)
    function showCartAlert(message) {
        let alert = document.getElementById('cartAlert');
        if (!alert) {
            alert = document.createElement('div');
            alert.id = 'cartAlert';
            alert.className = 'cart-alert';
            alert.innerHTML = `
                <div class=\"alert-content\">\n                    <span class=\"alert-message\">${message}</span>\n                    <button class=\"alert-close\" onclick=\"this.parentElement.parentElement.classList.remove('show')\">×</button>\n                </div>\n            `;
            document.body.appendChild(alert);
        } else {
            const alertMessage = alert.querySelector('.alert-message');
            if (alertMessage) {
                alertMessage.textContent = message;
            }
        }
        alert.classList.add('show');
        setTimeout(() => {
            alert.classList.remove('show');
        }, 3000);
    }
}); 