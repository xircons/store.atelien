// Function to get user-specific cart key
function getCartKey() {
    const userId = localStorage.getItem('userId') || sessionStorage.getItem('userId');
    return userId ? `cart_${userId}` : 'cart_guest';
}

// Function to clear all user carts (used when logging out)
function clearAllUserCarts() {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
        if (key.startsWith('cart_')) {
            localStorage.removeItem(key);
        }
    });
}

// Function to show cart alerts
function showCartAlert(message) {
    // Create alert element if it doesn't exist
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
    
    // Show alert
    alert.classList.add('show');
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
        alert.classList.remove('show');
    }, 3000);
}

// Global function to add item to cart (called from product pages)
window.addToCart = function(productId, productName, quantity = 1) {
    // Check if user is authenticated using the Auth class
    if (!window.auth || !window.auth.isAuthenticated()) {
        // User not authenticated, show login prompt
        if (window.auth && window.auth.showLoginRequired) {
            window.auth.showLoginRequired();
        } else {
            window.location.href = '/login.html';
        }
        return;
    }

    // Get current cart from user-specific localStorage
    const cartKey = getCartKey();
    const currentCart = JSON.parse(localStorage.getItem(cartKey) || '{"items": []}');
    
    // Get product details from the current page using correct selectors
    const productImage = document.querySelector('.gallery-main img')?.src || '';
    const productPriceElement = document.getElementById('product-price');
    const productPrice = productPriceElement ? parseFloat(productPriceElement.textContent.replace(/[^0-9.]/g, '')) : 0;
    const productMakerElement = document.getElementById('product-maker');
    const productMaker = productMakerElement ? productMakerElement.textContent.trim() : '';
    const productLeadTimeElement = document.getElementById('product-lead-time');
    const productLeadTime = productLeadTimeElement ? productLeadTimeElement.textContent.trim() : '';
    
    // Check if product already exists in cart
    const existingItemIndex = currentCart.items.findIndex(item => item.id == productId);
    
    if (existingItemIndex !== -1) {
        // Update quantity of existing item
        currentCart.items[existingItemIndex].quantity += quantity;
    } else {
        // Add new item with full product details
        currentCart.items.push({
            id: productId,
            name: productName,
            quantity: quantity,
            price: productPrice,
            image: productImage,
            maker: productMaker,
            lead_time: productLeadTime
        });
    }

    // Save to user-specific localStorage
    localStorage.setItem(cartKey, JSON.stringify(currentCart));

    fetch('/api/cart', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include', // Include cookies in request
        body: JSON.stringify({ 
            productId, 
            quantity,
            cartItems: currentCart.items
        })
    })
    .then(res => {
        if (!res.ok) {
            if (res.status === 401) {
                // User not authenticated, show login prompt
                if (window.auth && window.auth.showLoginRequired) {
                    window.auth.showLoginRequired();
                } else {
                    window.location.href = '/login.html';
                }
                // Return a promise that never resolves to stop the chain
                return new Promise(() => {}); 
            }
            throw new Error('Failed to add item to cart');
        }
        return res.json();
    })
    .then(data => {
        // Don't update localStorage with server response to prevent duplicates
        // The localStorage already has the correct data
        
        // data.items now contains the updated cart
        if (data && data.items) {
            showCartAlert(`${productName} added to cart`);
        }
    })
    .catch(error => {
        console.error('Error adding to cart:', error);
        showCartAlert('Failed to add item to cart');
    });
};

document.addEventListener('DOMContentLoaded', () => {
    const cartItems = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    const subtotal = document.getElementById('subtotal');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const cartAlert = document.getElementById('cartAlert');
    const alertMessage = document.getElementById('alertMessage');
    const alertClose = document.getElementById('alertClose');

    // Check if user has changed and refresh cart if needed
    checkUserChangeAndRefreshCart();

    // Load cart on page load
    loadCart();

    // Event listeners
    if (alertClose) {
        alertClose.addEventListener('click', () => {
            hideAlert();
        });
    }

    // Auto-hide alert after 3 seconds
    let alertTimeout;

    function showAlert(message) {
        if (alertMessage && cartAlert) {
            alertMessage.textContent = message;
            cartAlert.classList.add('show');
            
            // Clear existing timeout
            if (alertTimeout) {
                clearTimeout(alertTimeout);
            }
            
            // Auto-hide after 3 seconds
            alertTimeout = setTimeout(() => {
                hideAlert();
            }, 3000);
        }
    }

    function hideAlert() {
        if (cartAlert) {
            cartAlert.classList.remove('show');
        }
    }

    function loadCart() {
        // Load cart from user-specific localStorage
        const cartData = getCartFromStorage();
        if (!cartData || !cartData.items || cartData.items.length === 0) {
            updateCartForLoggedOutUser();
            return;
        }
        // Get all product IDs in the cart
        const productIds = cartData.items.map(item => item.id).join(',');
        // Fetch only enabled products from the API
        fetch(`/api/products?status=enable`)
            .then(res => res.json())
            .then(products => {
                // Only keep items in cart that are still enabled
                const enabledIds = new Set(products.map(p => String(p.id)));
                const filteredItems = cartData.items.filter(item => enabledIds.has(String(item.id)));
                // If any items were removed, update localStorage (no alert)
                if (filteredItems.length !== cartData.items.length) {
                    saveCartToStorage({ items: filteredItems });
                }
                if (filteredItems.length > 0) {
                    displayCartItems(filteredItems);
                    updateCartSummary({ items: filteredItems });
                } else {
                    updateCartForLoggedOutUser();
                }
            })
            .catch(err => {
                // If API fails, just show the cart as is
                displayCartItems(cartData.items);
                updateCartSummary(cartData);
            });
    }

    function getCartFromStorage() {
        const cartKey = getCartKey();
        const cartData = localStorage.getItem(cartKey);
        return cartData ? JSON.parse(cartData) : { items: [] };
    }

    function saveCartToStorage(cartData) {
        const cartKey = getCartKey();
        localStorage.setItem(cartKey, JSON.stringify(cartData));
    }

    function updateCartForLoggedOutUser() {
        if (cartItems) {
            const existingItems = cartItems.querySelectorAll('.cart-item');
            existingItems.forEach(item => item.remove());
        }
        
        if (cartCount) cartCount.textContent = '0 Items';
        if (subtotal) subtotal.textContent = '$0.00';
        if (checkoutBtn) checkoutBtn.disabled = true;
    }

    function displayCartItems(items) {
        if (!cartItems) return;
        
        // Clear existing items
        const existingItems = cartItems.querySelectorAll('.cart-item');
        existingItems.forEach(item => item.remove());

        items.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-product">
                    <img src="${item.image || '/images/product/default-fallback-image.png'}" 
                         alt="${item.name}" 
                         class="cart-item-image"
                         onerror="this.src='/images/product/default-fallback-image.png'; this.onerror=null;">
                    <div class="cart-item-details">
                        <h3 class="cart-item-name">${item.name}</h3>
                        <p class="cart-item-maker">Brand: ${item.maker || 'N/A'}</p>
                        <p class="cart-item-lead-time">Lead Time: ${item.lead_time || 'N/A'}</p>
                        <button class="remove-item" onclick="removeItem(${item.id})">Remove</button>
                    </div>
                </div>
                <div class="cart-item-price">
                    <p>$${Number(item.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
                <div class="cart-item-quantity">
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">−</button>
                        <input type="text" class="quantity-input" value="${item.quantity}" readonly>
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                    </div>
                </div>
            `;
            cartItems.appendChild(cartItem);
        });
    }

    function updateCartSummary(data) {
        const itemCount = data.items.reduce((total, item) => total + item.quantity, 0);
        const subtotalAmount = data.items.reduce((total, item) => total + (item.price * item.quantity), 0);
        
        if (cartCount) cartCount.textContent = `${itemCount} Item${itemCount !== 1 ? 's' : ''}`;
        if (subtotal) subtotal.textContent = `$${subtotalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        if (checkoutBtn) checkoutBtn.disabled = itemCount === 0;
    }

    // Global functions for cart operations
    window.updateQuantity = function(productId, newQuantity) {
        if (newQuantity < 1) {
            newQuantity = 1;
        }

        const currentCart = getCartFromStorage();

        fetch(`/api/cart/${productId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include', // Include cookies in request
            body: JSON.stringify({ 
                quantity: parseInt(newQuantity),
                cartItems: currentCart.items
            })
        })
        .then(res => {
            if (!res.ok) {
                if (res.status === 401) {
                    showAlert('Please log in to update your cart');
                    return;
                }
                throw new Error('Failed to update quantity');
            }
            return res.json();
        })
        .then(data => {
            if (data) {
                saveCartToStorage(data);
                displayCartItems(data.items);
                updateCartSummary(data);
                showAlert('Cart updated successfully');
            }
        })
        .catch(error => {
            console.error('Error updating quantity:', error);
            showAlert('Failed to update cart');
        });
    };

    window.removeItem = function(productId) {
        const currentCart = getCartFromStorage();

        fetch(`/api/cart/${productId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include', // Include cookies in request
            body: JSON.stringify({ cartItems: currentCart.items })
        })
        .then(res => {
            if (!res.ok) {
                if (res.status === 401) {
                    showAlert('Please log in to remove items from your cart');
                    return;
                }
                throw new Error('Failed to remove item');
            }
            return res.json();
        })
        .then(data => {
            if (data.items && data.items.length > 0) {
                saveCartToStorage(data);
                displayCartItems(data.items);
                updateCartSummary(data);
            } else {
                saveCartToStorage({ items: [] });
                updateCartForLoggedOutUser();
            }
            showAlert('Item removed from cart');
        })
        .catch(error => {
            console.error('Error removing item:', error);
            showAlert('Failed to remove item');
        });
    };

    // Checkout button functionality
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            // Check if user is authenticated using the Auth class
            if (window.auth && window.auth.isAuthenticated()) {
                // User is authenticated, proceed to checkout
                window.location.href = 'checkout.html';
            } else {
                // User not authenticated, show login prompt
                if (window.auth && window.auth.showLoginRequired) {
                    window.auth.showLoginRequired();
                } else {
                    showAlert('Please log in to proceed to checkout');
                }
            }
        });
    }
});

// Function to refresh cart when user changes
function refreshCartForCurrentUser() {
    // This will be called when user logs in to load their specific cart
    if (typeof loadCart === 'function') {
        loadCart();
    }
}

// Function to clear cart when user is not authenticated
function clearCartForUnauthenticatedUser() {
    // Clear any existing cart data when user is not authenticated
    const cartKey = getCartKey();
    if (cartKey === 'cart_guest') {
        localStorage.removeItem(cartKey);
    }
}

// Function to check if user has changed and refresh cart
function checkUserChangeAndRefreshCart() {
    const currentUserId = localStorage.getItem('userId') || sessionStorage.getItem('userId');
    const lastKnownUserId = localStorage.getItem('lastKnownUserId');
    
    // If user has changed, refresh the cart
    if (currentUserId !== lastKnownUserId) {
        // Update the last known user ID
        localStorage.setItem('lastKnownUserId', currentUserId);
        
        // Refresh cart for the current user
        if (typeof loadCart === 'function') {
            loadCart();
        }
    }
}

// Function to completely reset user's cart after successful checkout
function resetUserCart() {
    const cartKey = getCartKey();
    
    // Clear from localStorage
    localStorage.removeItem(cartKey);
    
    // Clear from sessionStorage
    sessionStorage.removeItem(cartKey);
    
    // Clear any other cart-related data
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
        if (key.startsWith('cart_')) {
            localStorage.removeItem(key);
        }
    });
    
    // Reset cart count in UI
    const cartCountElement = document.getElementById('cartCount');
    if (cartCountElement) {
        cartCountElement.textContent = '0 Items';
    }
    
    // Reset cart items display
    const cartItemsElement = document.getElementById('cartItems');
    if (cartItemsElement) {
        cartItemsElement.innerHTML = '';
    }
    
    // Reset subtotal
    const subtotalElement = document.getElementById('subtotal');
    if (subtotalElement) {
        subtotalElement.textContent = '$0.00';
    }
    
    console.log('User cart has been completely reset');
}

// Make functions globally available
window.getCartKey = getCartKey;
window.clearAllUserCarts = clearAllUserCarts;
window.refreshCartForCurrentUser = refreshCartForCurrentUser;
window.clearCartForUnauthenticatedUser = clearCartForUnauthenticatedUser;
window.checkUserChangeAndRefreshCart = checkUserChangeAndRefreshCart;
window.resetUserCart = resetUserCart; 