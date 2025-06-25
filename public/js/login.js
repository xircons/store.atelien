document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    // Check if user is already logged in and redirect if necessary
    if (window.auth) {
        window.auth.initPromise.then(() => {
            if (window.auth.isAuthenticated() && window.location.pathname.includes('login.html')) {
                window.location.href = '/index.html';
            }
        });
    }

    // If there's no login form on this page, don't proceed.
    if (!loginForm) {
        return;
    }

    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    // Form submission handler
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        
        clearValidationErrors();
        
        // Custom cart-style alert for empty email
        if (!email) {
            showFieldError(emailInput, 'Email is required');
            showCartAlert('Email is required.');
            return;
        }
        // Custom cart-style alert for invalid email (missing @)
        if (!email.includes('@')) {
            showFieldError(emailInput, "Please include an '@' in the email address.");
            return;
        }
        // Custom cart-style alert for incomplete email (regex fail)
        if (!isValidEmail(email)) {
            showFieldError(emailInput, 'Email is incomplete.');
            showCartAlert('Email is incomplete.');
            return;
        }
        // Custom cart-style alert for empty password
        if (!password) {
            showFieldError(passwordInput, 'Password is required');
            showCartAlert('Password is required.');
            return;
        }
        
        // Show loading state
        const submitBtn = loginForm.querySelector('.login-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Signing In...';
        submitBtn.disabled = true;
        
        try {
            // Use auth system's login method
            const result = await window.auth.login(email, password, false);
            
            if (result.success) {
                // Success - redirect to home page
                showSuccess('Login successful!');
                setTimeout(() => {
                    window.location.href = '/index.html';
                }, 1500);
            }
            
        } catch (error) {
            console.error('Login error:', error);
            showCartAlert('Wrong emails or wrong password.');
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
    }

    // Clear validation errors
    function clearValidationErrors() {
        const inputs = loginForm.querySelectorAll('input');
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
        
        loginForm.insertBefore(errorDiv, loginForm.firstChild);
        
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
        
        loginForm.insertBefore(successDiv, loginForm.firstChild);
    }

    // Remove existing messages
    function removeMessages() {
        const existingMessages = loginForm.querySelectorAll('.error-message, .success-message');
        existingMessages.forEach(msg => msg.remove());
    }

    // Forgot password link
    const forgotPasswordLink = document.querySelector('.forgot-password');
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', (e) => {
            e.preventDefault();
            showError('Password reset functionality not implemented yet');
        });
    }

    // Input focus effects and validation clearing
    const inputs = loginForm.querySelectorAll('input');
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
                input.style.borderBottomColor = '';
                input.style.borderBottomWidth = '';
            }
        });
    });

    // Match login content height to image height
    const loginContent = document.querySelector('.login-content');
    const loginImage = document.querySelector('.login-image img');

    const setContentHeight = () => {
        // Only run on desktop layout where the image is visible
        if (loginContent && loginImage && window.innerWidth > 1024) {
            const imageHeight = loginImage.offsetHeight;
            loginContent.style.height = `${imageHeight}px`;
        } else if (loginContent) {
            loginContent.style.height = 'auto'; // Reset for smaller screens
        }
    };

    if (loginImage) {
        // Run when the image is loaded
        loginImage.addEventListener('load', setContentHeight);
        
        // If the image is already complete (from cache)
        if (loginImage.complete) {
            setContentHeight();
        }

        // Adjust on window resize
        window.addEventListener('resize', setContentHeight);
    }
});

// Function to show cart-style alerts (copied from cart.js)
function showCartAlert(message) {
    let alert = document.getElementById('cartAlert');
    if (!alert) {
        alert = document.createElement('div');
        alert.id = 'cartAlert';
        alert.className = 'cart-alert';
        alert.innerHTML = `
            <div class="alert-content">
                <span class="alert-message">${message}</span>
                <button class="alert-close" onclick="this.parentElement.parentElement.classList.remove('show')">×</button>
            </div>
        `;
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