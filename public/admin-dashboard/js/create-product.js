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

// Form submission
document.getElementById('createProductForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const form = e.target;
    const submitBtn = form.querySelector('.create-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const originalText = btnText.textContent;
    
    // Show loading state
    submitBtn.disabled = true;
    btnText.textContent = 'Creating...';
    
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
    
    // Alternative way to get cost_price
    const costPriceField = form.querySelector('input[name="cost_price"]');
    const costPriceValue = costPriceField ? costPriceField.value : null;
    
    // Debug logging
    console.log('=== FRONTEND DEBUG ===');
    console.log('Form data being sent:', data);
    console.log('cost_price field value:', form.cost_price.value);
    console.log('cost_price field type:', typeof form.cost_price.value);
    console.log('Form field exists:', !!form.cost_price);
    console.log('Form field name:', form.cost_price?.name);
    console.log('Form field id:', form.cost_price?.id);
    console.log('Alternative cost_price value:', costPriceValue);
    console.log('Alternative cost_price type:', typeof costPriceValue);
    console.log('All form fields:', Array.from(form.elements).map(el => ({ name: el.name, value: el.value })));
    console.log('======================');
    
    try {
        const res = await fetch('/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Failed to create product');
        showProductAlert('Product created successfully!', 'success');
        form.reset();
    } catch (err) {
        showProductAlert('Error: ' + err.message, 'error');
    } finally {
        // Reset button state
        submitBtn.disabled = false;
        btnText.textContent = originalText;
    }
});

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
    alertBox._timeout = setTimeout(() => { hideProductAlert(); }, 10000);
    alertClose.onclick = function() { hideProductAlert(); };
}

function hideProductAlert() {
    const alertBox = document.getElementById('productAlert');
    if (!alertBox) return;
    alertBox.classList.add('hide');
    clearTimeout(alertBox._timeout);
    setTimeout(() => { alertBox.classList.remove('show', 'hide'); }, 300);
}