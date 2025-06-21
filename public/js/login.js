document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    // Check if user is already logged in
    if (window.auth && window.auth.isAuthenticated()) {
        window.location.href = '/index.html';
        return;
    }

    // Form submission handler
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        
        // Basic validation
        if (!email || !password) {
            showError('Please fill in all fields');
            return;
        }
        
        if (!isValidEmail(email)) {
            showError('Please enter a valid email address');
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
            showError(error.message || 'Login failed. Please try again.');
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

    // Input focus effects
    const inputs = loginForm.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.style.transform = 'translateY(-2px)';
        });
        
        input.addEventListener('blur', () => {
            input.parentElement.style.transform = 'translateY(0)';
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