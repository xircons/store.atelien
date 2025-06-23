// Function to get user-specific cart key
function getCartKey() {
    const userId = localStorage.getItem('userId') || sessionStorage.getItem('userId');
    return userId ? `cart_${userId}` : 'cart_guest';
}

// Function to show cart alerts
function showCartAlert(message) {
    // Create alert element if it doesn't exist
    let alert = document.getElementById('checkoutAlert');
    if (!alert) {
        alert = document.createElement('div');
        alert.id = 'checkoutAlert';
        alert.className = 'checkout-alert';
        alert.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #2a2a2a;
            color: white;
            padding: 15px 20px;
            border-radius: 4px;
            z-index: 10000;
            font-size: 14px;
            max-width: 300px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        document.body.appendChild(alert);
    }
    
    // Set message and show alert
    alert.textContent = message;
    alert.style.transform = 'translateX(0)';
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
        alert.style.transform = 'translateX(100%)';
    }, 3000);
}

// Dummy cart data for demonstration
const cartItems = [
  {
    image: 'images/product/chair.webp',
    title: 'Men Top Black Puffed Jacket',
    desc: "Men's Black",
    price: 999.00
  },
  {
    image: 'images/product/default-fallback-image.png',
    title: 'Women Jacket',
    desc: 'Women top',
    price: 1200.00
  }
];

const taxes = 5.00;
const shippingOptions = {
  free: 0,
  express: 9
};

function renderCart() {
  const cartContainer = document.querySelector('.cart-items');
  cartContainer.innerHTML = '';
  cartItems.forEach(item => {
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <img src="${item.image}" alt="${item.title}">
      <div class="cart-item-details">
        <div class="cart-item-title">${item.title}</div>
        <div class="cart-item-desc">${item.desc}</div>
      </div>
      <div class="cart-item-price">$${item.price.toFixed(2)}</div>
    `;
    cartContainer.appendChild(div);
  });
}

function calculateSummary() {
  const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);
  const shipping = getSelectedShippingCost();
  const total = subtotal + shipping + taxes;
  document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
  document.getElementById('shippingCost').textContent = `$${shipping}`;
  document.getElementById('taxes').textContent = `$${taxes.toFixed(2)}`;
  document.getElementById('total').textContent = `$${total.toFixed(2)}`;
}

function getSelectedShippingCost() {
  const selected = document.querySelector('input[name="shipping"]:checked').value;
  return shippingOptions[selected];
}

document.addEventListener('DOMContentLoaded', () => {
  const checkoutCartItems = document.getElementById('checkoutCartItems');
  const subtotal = document.getElementById('subtotal');
  const shippingCost = document.getElementById('shippingCost');
  const taxes = document.getElementById('taxes');
  const total = document.getElementById('total');
  const continueToPaymentBtn = document.getElementById('continueToPayment');
  const applyDiscountBtn = document.getElementById('applyDiscount');
  const discountCodeInput = document.getElementById('discountCode');
  const checkoutForm = document.getElementById('checkoutForm');

  let cartData = null;
  let discountApplied = false;
  let discountAmount = 0;

  // Shipping costs
  const shippingOptions = {
    standard: 650.00,
    express: 800.00
  };

  // Load cart data on page load
  loadCartData();

  // Check if user has changed and refresh cart if needed
  if (typeof checkUserChangeAndRefreshCart === 'function') {
    checkUserChangeAndRefreshCart();
  }

  // Event listeners
  continueToPaymentBtn.addEventListener('click', handleCheckout);
  applyDiscountBtn.addEventListener('click', applyDiscount);
  
  // Shipping method change
  document.querySelectorAll('input[name="shipping"]').forEach(radio => {
    radio.addEventListener('change', calculateSummary);
  });

  // Form validation - real-time validation
  const requiredFields = ['firstName', 'lastName', 'address', 'city', 'state', 'zip', 'country', 'phone'];
  
  requiredFields.forEach(fieldId => {
    const field = document.getElementById(fieldId);
    if (field) {
      // Validate on input/change
      field.addEventListener('input', validateField);
      field.addEventListener('blur', validateField);
      field.addEventListener('change', validateField);
    }
  });

  // Optional fields - clear validation on input
  const optionalFields = ['company', 'apartment'];
  optionalFields.forEach(fieldId => {
    const field = document.getElementById(fieldId);
    if (field) {
      field.addEventListener('input', () => {
        field.style.border = '';
        field.style.borderColor = '';
      });
    }
  });

  function validateField() {
    const field = this;
    const value = field.value.trim();
    
    if (requiredFields.includes(field.id)) {
      if (!value) {
        // Only show red border if validation has been triggered
        if (field.classList.contains('validation-triggered')) {
          field.style.border = '1px solid #ff0000';
          field.style.borderColor = '#ff0000';
          field.classList.add('error');
        }
      } else {
        // Show default border for filled fields
        field.style.border = '1px solid #2a2a2a';
        field.style.borderColor = '#2a2a2a';
        field.classList.remove('error');
      }
    }
    
    // Update button state
    validateForm();
  }

  // Discount input validation
  discountCodeInput.addEventListener('input', validateDiscountInput);

  function loadCartData() {
    // Load cart data from user-specific localStorage
    const cartKey = getCartKey();
    const cartDataFromStorage = localStorage.getItem(cartKey);
    const parsedCartData = cartDataFromStorage ? JSON.parse(cartDataFromStorage) : { items: [] };
    
    if (parsedCartData.items && parsedCartData.items.length > 0) {
      cartData = parsedCartData;
      renderCartItems(parsedCartData.items);
      calculateSummary();
    } else {
      // Empty cart, redirect back to cart
      window.location.href = 'cart.html';
    }
  }

  function renderCartItems(items) {
    checkoutCartItems.innerHTML = '';
    
    items.forEach(item => {
      const cartItem = document.createElement('div');
      cartItem.className = 'cart-item';
      const itemTotal = (item.price * item.quantity).toFixed(2);
      cartItem.innerHTML = `
        <img src="${item.image || '/images/product/default-fallback-image.png'}" 
             alt="${item.name}" 
             onerror="this.src='/images/product/default-fallback-image.png'; this.onerror=null;">
        <div class="cart-item-details">
          <div class="cart-item-title">${item.name}</div>
          <div class="cart-item-desc">Brand: ${item.maker || 'N/A'}</div>
          <div class="cart-item-quantity">Qty: ${item.quantity}</div>
        </div>
        <div class="cart-item-price">$${Number(itemTotal).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
      `;
      checkoutCartItems.appendChild(cartItem);
    });
  }

  function calculateSummary() {
    if (!cartData || !cartData.items) return;

    const subtotalAmount = cartData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = getSelectedShippingCost();
    const subtotalAfterDiscount = subtotalAmount - discountAmount;
    const taxAmount = subtotalAfterDiscount * 0.07; // 7% tax
    const totalAmount = subtotalAfterDiscount + shipping + taxAmount;

    subtotal.textContent = `$${subtotalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    shippingCost.textContent = `$${shipping.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    taxes.textContent = `$${taxAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    total.textContent = `$${totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    // Show/hide discount row
    const discountRow = document.getElementById('discountRow');
    const discountAmountSpan = document.getElementById('discountAmount');
    
    if (discountApplied && discountAmount > 0) {
        discountRow.style.display = 'flex';
        discountAmountSpan.textContent = `-$${discountAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } else {
        discountRow.style.display = 'none';
    }
  }

  function getSelectedShippingCost() {
    const selectedShipping = document.querySelector('input[name="shipping"]:checked');
    return selectedShipping ? shippingOptions[selectedShipping.value] : shippingOptions.standard;
  }

  function applyDiscount() {
    const code = discountCodeInput.value.trim();
    
    if (!code) {
      showCartAlert('Please enter a discount code.');
      return;
    }

    if (discountApplied) {
      showCartAlert('Discount already applied!');
      return;
    }

    // Get current subtotal for validation
    const subtotalAmount = cartData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    console.log('Applying discount:', { code, subtotalAmount });

    // Call the API to validate and apply discount
    fetch('/api/discounts/apply', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`
      },
      body: JSON.stringify({
        code: code,
        subtotal: subtotalAmount
      })
    })
    .then(response => {
      console.log('Discount response status:', response.status);
      if (!response.ok) {
        return response.json().then(data => {
          console.log('Discount error response:', data);
          throw new Error(data.error || 'Failed to apply discount code');
        });
      }
      return response.json();
    })
    .then(data => {
      console.log('Discount success response:', data);
      console.log('discountAmount type:', typeof data.coupon.discountAmount);
      console.log('discountAmount value:', data.coupon.discountAmount);
      
      if (data.success && data.coupon) {
        // Convert discountAmount to number to ensure toFixed() works
        discountAmount = parseFloat(data.coupon.discountAmount);
        console.log('Parsed discountAmount:', discountAmount);
        console.log('discountAmount type after parseFloat:', typeof discountAmount);
        
        discountApplied = true;
        calculateSummary();
        discountCodeInput.disabled = true;
        applyDiscountBtn.disabled = true;
        
        // Show success message with discount details
        const discountText = data.coupon.discountType === 'percentage' 
          ? `${data.coupon.discountValue}% off` 
          : `$${discountAmount.toFixed(2)} off`;
        
        const message = data.coupon.description 
          ? `Discount applied! ${discountText} - ${data.coupon.description}`
          : `Discount applied! ${discountText}`;
          
        showCartAlert(message);
      } else {
        console.log('Discount response missing success or coupon:', data);
        showCartAlert(data.error || 'Failed to apply discount code.');
      }
    })
    .catch(error => {
      console.error('Error applying discount:', error);
      showCartAlert(error.message || 'Failed to apply discount code. Please try again.');
    });
  }

  function validateForm() {
    const requiredFields = [
      'firstName', 'lastName', 'address', 'city', 'state', 'zip', 'country', 'phone'
    ];
    
    let isValid = true;
    
    requiredFields.forEach(fieldId => {
      const field = document.getElementById(fieldId);
      if (field) {
        const value = field.value.trim();
        if (!value) {
          // Mark field as validation triggered
          field.classList.add('validation-triggered');
          // Show red border for required empty fields
          field.style.border = '1px solid #ff0000';
          field.style.borderColor = '#ff0000';
          field.classList.add('error');
          isValid = false;
        } else {
          // Show default border for filled fields
          field.style.border = '1px solid #2a2a2a';
          field.style.borderColor = '#2a2a2a';
          field.classList.remove('error');
        }
      }
    });

    // Update button state
    continueToPaymentBtn.disabled = !isValid;
    return isValid;
  }

  function validateDiscountInput() {
    const code = discountCodeInput.value.trim();
    applyDiscountBtn.disabled = !code;
  }

  function handleCheckout(e) {
    e.preventDefault();

    // Trigger validation to show red borders for empty required fields
    if (!validateForm()) {
      return;
    }

    // Debug: Check each field individually before creating checkoutData
    console.log('=== FIELD VALUES DEBUG ===');
    console.log('firstName:', document.getElementById('firstName')?.value);
    console.log('lastName:', document.getElementById('lastName')?.value);
    console.log('address:', document.getElementById('address')?.value);
    console.log('city:', document.getElementById('city')?.value);
    console.log('state:', document.getElementById('state')?.value);
    console.log('zip:', document.getElementById('zip')?.value);
    console.log('country:', document.getElementById('country')?.value);
    console.log('phone:', document.getElementById('phone')?.value);
    console.log('company:', document.getElementById('company')?.value);
    console.log('apartment:', document.getElementById('apartment')?.value);
    console.log('=== END FIELD VALUES DEBUG ===');

    const shippingData = {
      firstName: document.getElementById('firstName')?.value || '',
      lastName: document.getElementById('lastName')?.value || '',
      company: document.getElementById('company')?.value || '',
      address: document.getElementById('address')?.value || '',
      apartment: document.getElementById('apartment')?.value || '',
      city: document.getElementById('city')?.value || '',
      state: document.getElementById('state')?.value || '',
      zip: document.getElementById('zip')?.value || '',
      phone: document.getElementById('phone')?.value || '',
      country: document.getElementById('country')?.value || ''
    };

    console.log('=== SHIPPING OBJECT DEBUG ===');
    console.log('shippingData object:', shippingData);
    console.log('shippingData JSON:', JSON.stringify(shippingData));
    console.log('=== END SHIPPING OBJECT DEBUG ===');

    const checkoutData = {
      shipping: shippingData,
      shippingMethod: document.querySelector('input[name="shipping"]:checked').value,
      cartItems: cartData.items,
      discountCode: discountApplied ? discountCodeInput.value : null,
      discountAmount: discountAmount,
      subtotal: parseFloat(subtotal.textContent.replace(/[$,]/g, '')),
      shippingCost: parseFloat(shippingCost.textContent.replace(/[$,]/g, '')),
      taxes: parseFloat(taxes.textContent.replace(/[$,]/g, '')),
      total: parseFloat(total.textContent.replace(/[$,]/g, ''))
    };
    
    // Debug: Log the shipping object
    console.log('=== SHIPPING DATA DEBUG ===');
    console.log('shipping object:', checkoutData.shipping);
    console.log('=== END SHIPPING DATA DEBUG ===');

    // Show loading state
    continueToPaymentBtn.disabled = true;
    continueToPaymentBtn.textContent = 'Processing...';

    // Send checkout data to server
    fetch('/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(checkoutData)
    })
    .then(res => {
      if (!res.ok) {
        if (res.status === 401) {
          throw new Error('Please log in to complete checkout');
        }
        throw new Error('Checkout failed. Please try again.');
      }
      return res.json();
    })
    .then(data => {
      if (data.success) {
        // Get user ID from localStorage/sessionStorage
        const userId = localStorage.getItem('userId') || sessionStorage.getItem('userId');
        
        // Clear cart after successful order
        if (userId) {
          localStorage.removeItem(`cart_${userId}`);
        }
        
        // Show success message
        showCartAlert('Order placed successfully!');
        
        // Redirect to a thank you page or home page after a short delay
        setTimeout(() => {
          window.location.href = '/?fromCheckout=true';
        }, 2000);
      } else {
        showCartAlert(data.message || 'Checkout failed. Please try again.');
      }
    })
    .catch(error => {
      console.error('Checkout error:', error);
      showCartAlert(error.message || 'Checkout failed. Please try again.');
      continueToPaymentBtn.disabled = false;
      continueToPaymentBtn.textContent = 'Continue to Payment';
    });
  }

  // Initialize discount button state
  validateDiscountInput();
}); 