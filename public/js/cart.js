document.addEventListener('DOMContentLoaded', () => {
    const cartItems = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    const subtotal = document.getElementById('subtotal');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const cartAlert = document.getElementById('cartAlert');
    const alertMessage = document.getElementById('alertMessage');
    const alertClose = document.getElementById('alertClose');

    // Load cart on page load
    loadCart();

    // Event listeners
    alertClose.addEventListener('click', () => {
        hideAlert();
    });

    // Auto-hide alert after 3 seconds
    let alertTimeout;

    function showAlert(message) {
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

    function hideAlert() {
        cartAlert.classList.remove('show');
    }

    function loadCart() {
        fetch('/api/cart', {
            credentials: 'include' // Include cookies in request
        })
        .then(res => {
            if (!res.ok) {
                if (res.status === 401) {
                    // User not authenticated, show empty cart
                    updateCartForLoggedOutUser();
                    return;
                }
                throw new Error('Failed to load cart');
            }
            return res.json();
        })
        .then(data => {
            if (data.items && data.items.length > 0) {
                displayCartItems(data.items);
                updateCartSummary(data);
            } else {
                updateCartForLoggedOutUser();
            }
        })
        .catch(error => {
            console.error('Error loading cart:', error);
            updateCartForLoggedOutUser();
        });
    }

    function updateCartForLoggedOutUser() {
        const existingItems = cartItems.querySelectorAll('.cart-item');
        existingItems.forEach(item => item.remove());
        
        cartCount.textContent = '0 Items';
        subtotal.textContent = '$0.00';
        checkoutBtn.disabled = true;
    }

    function displayCartItems(items) {
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
        
        cartCount.textContent = `${itemCount} Item${itemCount !== 1 ? 's' : ''}`;
        subtotal.textContent = `$${subtotalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        checkoutBtn.disabled = itemCount === 0;
    }

    // Global functions for cart operations
    window.updateQuantity = function(productId, newQuantity) {
        if (newQuantity < 1) {
            newQuantity = 1;
        }

        fetch(`/api/cart/${productId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include', // Include cookies in request
            body: JSON.stringify({ quantity: parseInt(newQuantity) })
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
        fetch(`/api/cart/${productId}`, {
            method: 'DELETE',
            credentials: 'include' // Include cookies in request
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
                displayCartItems(data.items);
                updateCartSummary(data);
            } else {
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
    checkoutBtn.addEventListener('click', () => {
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        if (!token) {
            showAlert('Please log in to proceed to checkout');
            return;
        }
        
        // For now, just show a message
        showAlert('Checkout functionality coming soon!');
    });
});

// Global function to add item to cart (called from product pages)
window.addToCart = function(productId, productName, quantity = 1) {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    if (!token) {
        // Redirect to login if not authenticated
        window.location.href = '/login.html';
        return;
    }

    fetch('/api/cart', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productId: productId, quantity: quantity })
    })
    .then(res => {
        if (!res.ok) throw new Error('Failed to add item to cart');
        return res.json();
    })
    .then(data => {
        // Show success alert
        const alert = document.getElementById('cartAlert');
        const alertMessage = document.getElementById('alertMessage');
        
        if (alert && alertMessage) {
            alertMessage.textContent = `${productName} added to cart`;
            alert.classList.add('show');
            
            // Auto-hide after 3 seconds
            setTimeout(() => {
                alert.classList.remove('show');
            }, 3000);
        }
    })
    .catch(error => {
        console.error('Error adding to cart:', error);
        // Show error alert
        const alert = document.getElementById('cartAlert');
        const alertMessage = document.getElementById('alertMessage');
        
        if (alert && alertMessage) {
            alertMessage.textContent = 'Failed to add item to cart';
            alert.classList.add('show');
            
            setTimeout(() => {
                alert.classList.remove('show');
            }, 3000);
        }
    });
}; 