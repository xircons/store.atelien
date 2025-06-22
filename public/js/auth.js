// Authentication utility for managing login state across the site
class Auth {
    constructor() {
        this.isLoggedIn = false;
        this.user = null;
        this.loginRequiredHandlers = new Map();
        this.initPromise = this.init();
    }

    async init() {
        await this.checkLoginStatus();
        this.updateUI();
    }

    // Check if user is logged in by calling server
    async checkLoginStatus() {
        try {
            const response = await fetch('/api/auth/status', {
                method: 'GET',
                credentials: 'include' // Include cookies in request
            });

            const data = await response.json();

            if (data.success && data.isLoggedIn) {
                // Check if this is a different user than before
                const previousUserId = localStorage.getItem('userId') || sessionStorage.getItem('userId');
                const newUserId = data.user.id;
                
                // If switching to a different user, clear the previous user's cart
                if (previousUserId && previousUserId !== newUserId.toString()) {
                    if (typeof clearAllUserCarts === 'function') {
                        clearAllUserCarts();
                    } else {
                        // Fallback: clear all cart-related localStorage items
                        const keys = Object.keys(localStorage);
                        keys.forEach(key => {
                            if (key.startsWith('cart_')) {
                                localStorage.removeItem(key);
                            }
                        });
                    }
                }
                
                // Update stored user data
                localStorage.setItem('userId', data.user.id);
                localStorage.setItem('userEmail', data.user.email);
                localStorage.setItem('username', data.user.username || '');
                localStorage.setItem('isLoggedIn', 'true');
                sessionStorage.setItem('userId', data.user.id);
                sessionStorage.setItem('userEmail', data.user.email);
                sessionStorage.setItem('username', data.user.username || '');
                sessionStorage.setItem('isLoggedIn', 'true');
                
                this.isLoggedIn = true;
                this.user = data.user;
            } else {
                this.isLoggedIn = false;
                this.user = null;
            }
        } catch (error) {
            console.error('Error checking login status:', error);
            this.isLoggedIn = false;
            this.user = null;
        }
    }

    // Login user
    async login(email, password, remember = false) {
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include', // Include cookies in request
                body: JSON.stringify({ email, password, remember })
            });

            const data = await response.json();

            if (data.success) {
                // Check if this is a different user logging in
                const previousUserId = localStorage.getItem('userId') || sessionStorage.getItem('userId');
                const newUserId = data.user.id;
                
                // If switching to a different user, clear the previous user's cart
                if (previousUserId && previousUserId !== newUserId.toString()) {
                    if (typeof clearAllUserCarts === 'function') {
                        clearAllUserCarts();
                    } else {
                        // Fallback: clear all cart-related localStorage items
                        const keys = Object.keys(localStorage);
                        keys.forEach(key => {
                            if (key.startsWith('cart_')) {
                                localStorage.removeItem(key);
                            }
                        });
                    }
                }
                
                // Store authentication data in cookies (handled by server)
                // Also store in localStorage/sessionStorage for backward compatibility
                if (remember) {
                    localStorage.setItem('authToken', data.token);
                    localStorage.setItem('userEmail', data.user.email);
                    localStorage.setItem('userId', data.user.id);
                    localStorage.setItem('username', data.user.username || '');
                    localStorage.setItem('isLoggedIn', 'true');
                } else {
                    sessionStorage.setItem('authToken', data.token);
                    sessionStorage.setItem('userEmail', data.user.email);
                    sessionStorage.setItem('userId', data.user.id);
                    sessionStorage.setItem('username', data.user.username || '');
                    sessionStorage.setItem('isLoggedIn', 'true');
                }
                
                this.isLoggedIn = true;
                this.user = data.user;
                this.updateUI();
                
                // Refresh cart for the newly logged in user
                if (typeof refreshCartForCurrentUser === 'function') {
                    refreshCartForCurrentUser();
                }
                
                return { success: true, user: this.user };
            } else {
                throw new Error(data.error || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    // Logout user
    async logout() {
        try {
            // Call server logout endpoint to clear cookies
            await fetch('/api/auth/logout', {
                method: 'POST',
                credentials: 'include'
            });
        } catch (error) {
            console.error('Logout error:', error);
        }

        // Clear all auth data from localStorage/sessionStorage
        localStorage.removeItem('authToken');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
        localStorage.removeItem('isLoggedIn');
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('userEmail');
        sessionStorage.removeItem('userId');
        sessionStorage.removeItem('username');
        sessionStorage.removeItem('isLoggedIn');
        
        // Note: We don't clear cart data on logout to preserve user's cart
        // Cart data will be cleared only when switching to a different user
        
        this.isLoggedIn = false;
        this.user = null;
        this.updateUI();
        
        // Redirect to home page
        window.location.href = '/index.html';
    }

    // Update UI based on login status
    updateUI() {
        const loginLink = document.querySelector('a[href="login.html"]');
        const cartLink = document.querySelector('a[href="cart.html"]');
        
        if (this.isLoggedIn) {
            // User is logged in
            if (loginLink) {
                // Create a container to maintain consistent width
                const container = document.createElement('span');
                
                // First set the email to measure its width
                const tempSpan = document.createElement('span');
                tempSpan.textContent = this.user.email;
                tempSpan.style.cssText = `
                    position: absolute;
                    visibility: hidden;
                    white-space: nowrap;
                    font-family: inherit;
                    font-size: inherit;
                `;
                document.body.appendChild(tempSpan);
                const emailWidth = tempSpan.offsetWidth;
                document.body.removeChild(tempSpan);
                
                container.style.cssText = `
                    display: inline-block;
                    width: ${emailWidth}px;
                    text-align: center;
                    cursor: pointer;
                    transition: color 0.3s ease;
                    white-space: nowrap;
                    text-decoration: none;
                `;
                
                // Replace the link content with the container
                loginLink.innerHTML = '';
                loginLink.appendChild(container);
                
                // Set initial text
                container.textContent = this.user.email;
                
                loginLink.href = '#';
                
                // Calculate spaces needed to match email length
                const emailLength = this.user.email.length;
                const logoutText = 'logout?';
                const spacesNeeded = emailLength - logoutText.length;
                const leftSpaces = Math.floor(spacesNeeded / 2);
                const rightSpaces = spacesNeeded - leftSpaces;
                
                // Use regular spaces for consistent spacing
                const leftPadding = ' '.repeat(leftSpaces);
                const rightPadding = ' '.repeat(rightSpaces);
                const paddedLogout = leftPadding + logoutText + rightPadding;
                
                // Add hover effect
                loginLink.addEventListener('mouseenter', () => {
                    container.textContent = paddedLogout;
                    container.style.color = '#ff0000';
                    container.style.textDecoration = 'none';
                });
                
                loginLink.addEventListener('mouseleave', () => {
                    container.textContent = this.user.email;
                    container.style.color = '';
                    container.style.textDecoration = '';
                });
                
                loginLink.onclick = (e) => {
                    e.preventDefault();
                    this.logout();
                };
            }
            
            // Enable cart functionality
            if (cartLink) {
                cartLink.style.pointerEvents = 'auto';
                cartLink.style.opacity = '1';
            }
            
            // Enable add to cart buttons
            this.enableAddToCartButtons();
            
        } else {
            // User is not logged in
            if (loginLink) {
                loginLink.innerHTML = 'Login';
                loginLink.href = 'login.html';
                loginLink.onclick = null;
            }
            
            // Disable cart functionality
            if (cartLink) {
                cartLink.style.pointerEvents = 'none';
                cartLink.style.opacity = '0.5';
            }
            
            // Disable add to cart buttons
            this.disableAddToCartButtons();
            
            // Clear cart for unauthenticated user
            if (typeof clearCartForUnauthenticatedUser === 'function') {
                clearCartForUnauthenticatedUser();
            }
        }
    }

    // Enable add to cart buttons
    enableAddToCartButtons() {
        const buttons = document.querySelectorAll('.add-to-cart-btn, #add-to-cart-btn');
        buttons.forEach(button => {
            button.disabled = false;
            button.style.opacity = '1';
            button.style.cursor = 'pointer';

            // Remove the 'login required' click listener if it was added
            const handler = this.loginRequiredHandlers.get(button);
            if (handler) {
                button.removeEventListener('click', handler, true);
                this.loginRequiredHandlers.delete(button);
            }
        });
    }

    // Disable add to cart buttons
    disableAddToCartButtons() {
        const buttons = document.querySelectorAll('.add-to-cart-btn, #add-to-cart-btn');
        buttons.forEach(button => {
            button.disabled = true;
            button.style.opacity = '0.5';
            button.style.cursor = 'not-allowed';
            
            // Remove any old listener before adding a new one
            let handler = this.loginRequiredHandlers.get(button);
            if (handler) {
                button.removeEventListener('click', handler, true);
            }

            // Define, store, and add the new "blocker" listener
            handler = (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.showLoginRequired();
            };
            
            this.loginRequiredHandlers.set(button, handler);
            // Use capture phase to ensure this listener runs before any others
            button.addEventListener('click', handler, true);
        });
    }

    // Show login required message
    showLoginRequired() {
        // Create modal or alert
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;
        
        modal.innerHTML = `
            <div style="
                background: white;
                padding: 2rem;
                border-radius: 8px;
                max-width: 400px;
                text-align: center;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            ">
                <h3 style="margin-bottom: 1rem; color: #333;">Login Required</h3>
                <p style="margin-bottom: 1.5rem; color: #666;">Please log in to add items to your cart.</p>
                <div style="display: flex; gap: 1rem; justify-content: center;">
                    <button onclick="window.location.href='/login.html'" style="
                        padding: 0.75rem 1.5rem;
                        background: #2a2a2a;
                        color: white;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                    ">Login</button>
                    <button onclick="this.closest('.modal').remove()" style="
                        padding: 0.75rem 1.5rem;
                        background: #f0f0f0;
                        color: #333;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                    ">Cancel</button>
                </div>
            </div>
        `;
        
        modal.className = 'modal';
        document.body.appendChild(modal);
        
        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    // Get current user
    getCurrentUser() {
        return this.user;
    }

    // Check if user is logged in
    isAuthenticated() {
        return this.isLoggedIn;
    }
}

// Initialize auth system
const auth = new Auth();

// Export for use in other scripts
window.auth = auth; 