// Get coupon ID from URL
function getCouponIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

// Load coupon data from database
async function loadCouponData(couponId) {
    try {
        const response = await fetch(`/api/discounts/${couponId}`);
        if (!response.ok) {
            let errorMessage = 'Coupon not found';
            try {
                const errorData = await response.json();
                errorMessage = errorData.error || errorMessage;
            } catch (parseError) {
                errorMessage = `Server error: ${response.status} ${response.statusText}`;
            }
            throw new Error(errorMessage);
        }
        const data = await response.json();
        populateFormWithCouponData(data.coupon);
    } catch (error) {
        showCouponAlert(`Error loading coupon data: ${error.message}. Please check the URL and try again.`, 'error');
    }
}

// Populate form fields with coupon data
function populateFormWithCouponData(coupon) {
    const form = document.getElementById('editCouponForm');
    if (!form) return;
    form.code.value = coupon.code || '';
    form.description.value = coupon.description || '';
    form.discount_type.value = coupon.discountType || '';
    form.discount_value.value = coupon.discountValue || '';
    form.min_order_amount.value = coupon.minOrderAmount || '';
    form.max_uses.value = coupon.maxUses || '';
    form.status.value = coupon.isActive ? 'enable' : 'disable';
    document.title = `Atelien Store — Edit Coupon: ${coupon.code}`;
}

// Form submission for updating coupon
document.getElementById('editCouponForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const form = e.target;
    const submitBtn = form.querySelector('.create-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const originalText = btnText.textContent;
    const couponId = getCouponIdFromUrl();
    if (!couponId) {
        showCouponAlert('Coupon ID not found in URL.', 'error');
        return;
    }
    // Show loading state
    submitBtn.disabled = true;
    btnText.textContent = 'Updating...';
    const data = {
        code: form.code.value,
        description: form.description.value,
        discount_type: form.discount_type.value,
        discount_value: form.discount_value.value,
        min_order_amount: form.min_order_amount.value,
        max_uses: form.max_uses.value,
        status: form.status.value
    };
    try {
        const res = await fetch(`/api/discounts/${couponId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!res.ok) {
            let errorMessage = 'Failed to update coupon';
            try {
                const errorData = await res.json();
                errorMessage = errorData.error || errorMessage;
            } catch (parseError) {
                errorMessage = `Server error: ${res.status} ${res.statusText}`;
            }
            throw new Error(errorMessage);
        }
        showCouponAlert('Coupon updated successfully!', 'success');
        setTimeout(() => {
            window.location.href = 'coupon-list.html';
        }, 3000);
    } catch (err) {
        showCouponAlert('Error: ' + err.message, 'error');
    } finally {
        submitBtn.disabled = false;
        btnText.textContent = originalText;
    }
});

// Alert system functions
function showCouponAlert(message, type = 'info') {
    const alertBox = document.getElementById('couponAlert');
    const alertMessage = document.getElementById('couponAlertMessage');
    const alertClose = document.getElementById('couponAlertClose');
    if (!alertBox || !alertMessage || !alertClose) return;
    alertMessage.textContent = message;
    alertBox.classList.remove('hide');
    alertBox.classList.add('show');
    alertBox.classList.remove('success', 'error', 'info');
    alertBox.classList.add(type);
    clearTimeout(alertBox._timeout);
    alertBox._timeout = setTimeout(() => { hideCouponAlert(); }, 2000);
    alertClose.onclick = function() { hideCouponAlert(); };
}

function hideCouponAlert() {
    const alertBox = document.getElementById('couponAlert');
    if (!alertBox) return;
    alertBox.classList.add('hide');
    clearTimeout(alertBox._timeout);
    setTimeout(() => { alertBox.classList.remove('show', 'hide'); }, 300);
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    const couponId = getCouponIdFromUrl();
    if (!couponId) {
        showCouponAlert('No coupon ID provided. Please go back to the coupon list and try again.', 'error');
        return;
    }
    loadCouponData(couponId);
}); 