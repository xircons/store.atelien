// Mobile navigation toggle
const mobileNavToggle = document.getElementById('mobileNavToggle');
const mobileNavOverlay = document.getElementById('mobileNavOverlay');
const sidebarContainer = document.getElementById('sidebar-container');

function toggleMobileNav() {
    document.body.classList.toggle('mobile-nav-open');
    mobileNavToggle.classList.toggle('active');
}

mobileNavToggle.addEventListener('click', toggleMobileNav);
mobileNavOverlay.addEventListener('click', toggleMobileNav);

// Close mobile nav on window resize
window.addEventListener('resize', () => {
    if (window.innerWidth > 600) {
        document.body.classList.remove('mobile-nav-open');
        mobileNavToggle.classList.remove('active');
    }
});

// Get product ID from URL query parameter
function getProductIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

// Load product data from database
async function loadProductData(productId) {
    try {
        const response = await fetch(`/api/products/${productId}`);
        if (!response.ok) {
            // Try to parse error response as JSON, but handle HTML responses gracefully
            let errorMessage = 'Product not found';
            try {
                const errorData = await response.json();
                errorMessage = errorData.error || errorMessage;
            } catch (parseError) {
                // If response is not JSON (like HTML 404 page), use status text
                errorMessage = `Server error: ${response.status} ${response.statusText}`;
            }
            throw new Error(errorMessage);
        }
        const product = await response.json();
        populateFormWithProductData(product);
    } catch (error) {
        console.error('Error loading product:', error);
        showProductAlert(`Error loading product data: ${error.message}. Please check the URL and try again.`, 'error');
    }
}

// Populate form fields with product data
function populateFormWithProductData(product) {
    const form = document.getElementById('editProductForm');
    
    // Populate all form fields
    form.name.value = product.name || '';
    form.maker.value = product.maker || '';
    form.lead_time.value = product.lead_time || '';
    form.category.value = product.category || '';
    form.description.value = product.description || '';
    form.image.value = product.image || '';
    form.image_hover.value = product.image_hover || '';
    form.price.value = product.price || '';
    form.cost_price.value = product.cost_price || '';
    
    // Update page title to include product name
    document.title = `Atelien Store — Edit ${product.name}`;
}

// Form submission for updating product
document.getElementById('editProductForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const form = e.target;
    const submitBtn = form.querySelector('.create-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const originalText = btnText.textContent;
    
    const productId = getProductIdFromUrl();
    if (!productId) {
        showProductAlert('Product ID not found in URL.', 'error');
        return;
    }
    
    // Show loading state
    submitBtn.disabled = true;
    btnText.textContent = 'Updating...';
    
    const data = {
        name: form.name.value,
        description: form.description.value,
        price: form.price.value,
        cost_price: form.cost_price.value,
        category: form.category.value,
        image: form.image.value,
        image_hover: form.image_hover.value,
        maker: form.maker.value,
        lead_time: form.lead_time.value
    };
    
    try {
        const res = await fetch(`/api/products/${productId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        if (!res.ok) {
            // Try to parse error response as JSON, but handle HTML responses gracefully
            let errorMessage = 'Failed to update product';
            try {
                const errorData = await res.json();
                errorMessage = errorData.error || errorMessage;
            } catch (parseError) {
                // If response is not JSON (like HTML 404 page), use status text
                errorMessage = `Server error: ${res.status} ${res.statusText}`;
            }
            throw new Error(errorMessage);
        }
        
        showProductAlert('Product updated successfully!', 'success');
        
        // Optionally redirect back to product list after a short delay
        setTimeout(() => {
            window.location.href = 'product-list.html';
        }, 3000);
        
    } catch (err) {
        showProductAlert('Error: ' + err.message, 'error');
    } finally {
        // Reset button state
        submitBtn.disabled = false;
        btnText.textContent = originalText;
    }
});

// Alert system functions
function showProductAlert(message, type = 'info') {
    const alertBox = document.getElementById('productAlert');
    const alertMessage = document.getElementById('productAlertMessage');
    const alertClose = document.getElementById('productAlertClose');
    if (!alertBox || !alertMessage || !alertClose) return;
    
    alertMessage.textContent = message;
    alertBox.classList.remove('hide');
    alertBox.classList.add('show');
    alertBox.classList.remove('success', 'error', 'info');
    alertBox.classList.add(type);
    
    clearTimeout(alertBox._timeout);
    alertBox._timeout = setTimeout(() => { hideProductAlert(); }, 2000);
    
    alertClose.onclick = function() { hideProductAlert(); };
}

function hideProductAlert() {
    const alertBox = document.getElementById('productAlert');
    if (!alertBox) return;
    
    alertBox.classList.add('hide');
    clearTimeout(alertBox._timeout);
    
    setTimeout(() => { alertBox.classList.remove('show', 'hide'); }, 300);
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    const productId = getProductIdFromUrl();
    if (!productId) {
        showProductAlert('No product ID provided. Please go back to the product list and try again.', 'error');
        return;
    }
    
    // Load product data
    loadProductData(productId);
}); 