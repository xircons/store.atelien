// Fetch and render coupons in the admin dashboard grid

document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/discounts')
        .then(res => res.json())
        .then(data => renderCouponGrid(data.coupons))
        .catch(err => {
            document.getElementById('couponItems').innerHTML = '<div class="error">Failed to load coupons.</div>';
        });
    // Export to Excel button handler
    const exportBtn = document.querySelector('.btn.export');
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            fetch('/api/admin/export/coupons', {
                method: 'GET',
                headers: {},
            })
            .then(response => {
                if (!response.ok) throw new Error('Failed to export data');
                return response.blob();
            })
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'coupons_export.xlsx';
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);
            })
            .catch(err => {
                showCouponAlert('Failed to export data. Please try again.', 'error');
            });
        });
    }
});

function renderCouponGrid(coupons) {
    const container = document.getElementById('couponItems');
    if (!container) return;
    if (!Array.isArray(coupons) || coupons.length === 0) {
        container.innerHTML = '<div class="empty">No coupons found.</div>';
        return;
    }
    container.innerHTML = coupons.map(coupon => {
        const statusIcon = coupon.isActive ? 'bi-eye' : 'bi-eye-slash';
        const statusClass = coupon.isActive ? 'status-enabled' : 'status-disabled';
        return `
        <div class="product-row" data-coupon-id="${coupon.id}">
            <span class="product-info">
                <div class="product-card-title">${coupon.code}</div>
            </span>
            <span class="product-price">${coupon.description || '-'}</span>
            <span class="product-category">${coupon.discountType || '-'}</span>
            <span class="product-status">${coupon.discountValue}</span>
            <span class="header-min-order">${coupon.minOrderAmount || '-'}</span>
            <span class="header-max-users">${coupon.maxUses || '-'}</span>
            <span class="header-used-count">${coupon.usedCount || 0}</span>
            <span class="product-status">
                <i class="bi ${statusIcon} status-toggle ${statusClass}" data-id="${coupon.id}" data-status="${coupon.isActive ? 'enable' : 'disable'}" title="Click to toggle status"></i>
            </span>
            <span class="product-edit">
                <a href="coupon-edit.html?id=${coupon.id}" title="Edit coupon">
                    <i class="bi bi-pencil-square"></i>
                </a>
            </span>
            <span class="product-delete"><i class="bi bi-trash3"></i></span>
        </div>
    `}).join('');
    
    addCouponDeleteEventListeners();
    addCouponStatusToggleEventListeners();
}

function addCouponStatusToggleEventListeners() {
    const statusIcons = document.querySelectorAll('.product-status .status-toggle');
    statusIcons.forEach(icon => {
        icon.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const couponId = this.getAttribute('data-id');
            const currentStatus = this.getAttribute('data-status');
            const couponCode = this.closest('.product-row').querySelector('.product-card-title').textContent;
            toggleCouponStatus(couponId, this, currentStatus, couponCode);
        });
    });
}

function toggleCouponStatus(couponId, iconElement, currentStatus, couponCode) {
    // Show loading state
    iconElement.style.opacity = '0.5';
    iconElement.style.pointerEvents = 'none';
    fetch(`/api/discounts/${couponId}/toggle-status`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        const newStatus = data.isActive;
        const newIconClass = newStatus ? 'bi-eye' : 'bi-eye-slash';
        const newStatusClass = newStatus ? 'status-enabled' : 'status-disabled';
        iconElement.className = `bi ${newIconClass} status-toggle ${newStatusClass}`;
        iconElement.setAttribute('data-status', newStatus ? 'enable' : 'disable');
        iconElement.style.opacity = '1';
        iconElement.style.pointerEvents = 'auto';
        showCouponAlert(`Coupon "${couponCode}" ${newStatus ? 'enabled' : 'disabled'} successfully`, 'success');
    })
    .catch(error => {
        iconElement.style.opacity = '1';
        iconElement.style.pointerEvents = 'auto';
        showCouponAlert('Failed to toggle coupon status. Please try again.', 'error');
    });
}

function addCouponDeleteEventListeners() {
    const deleteButtons = document.querySelectorAll('.product-delete i.bi-trash3');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const couponRow = this.closest('.product-row');
            const couponId = couponRow.getAttribute('data-coupon-id');
            const couponCode = couponRow.querySelector('.product-card-title').textContent;
            if (confirm(`Are you sure you want to delete coupon "${couponCode}" (ID: ${couponId})?`)) {
                deleteCoupon(couponId, couponRow, couponCode);
            }
        });
    });
}

function deleteCoupon(couponId, couponRow, couponCode) {
    fetch(`/api/discounts/${couponId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (couponRow) couponRow.remove();
        showCouponAlert(`Deleted: ${couponCode}`, 'success');
        if (document.querySelectorAll('.product-row').length === 0) {
            document.getElementById('couponItems').innerHTML = '<div class="empty">No coupons found.</div>';
        }
    })
    .catch(error => {
        showCouponAlert('Failed to delete coupon. Please try again.', 'error');
    });
}

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
    alertBox._timeout = setTimeout(() => {
        hideCouponAlert();
    }, 10000);
    alertClose.onclick = function() {
        hideCouponAlert();
    };
}

function hideCouponAlert() {
    const alertBox = document.getElementById('couponAlert');
    if (!alertBox) return;
    alertBox.classList.add('hide');
    clearTimeout(alertBox._timeout);
    setTimeout(() => {
        alertBox.classList.remove('show', 'hide');
    }, 300);
} 