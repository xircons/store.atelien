document.addEventListener('DOMContentLoaded', function () {
    fetch('/api/admin/orders')
        .then(res => res.json())
        .then(data => {
            if (!data.success) throw new Error(data.message || 'Failed to fetch orders');
            renderOrders(data.orders);
        })
        .catch(err => showAlert(err.message));

    function renderOrders(orders) {
        const container = document.getElementById('orderItems');
        if (!orders.length) {
            container.innerHTML = '<div style="padding:1em;">No orders found.</div>';
            return;
        }
        container.innerHTML = '';
        orders.forEach(order => {
            const row = document.createElement('div');
            row.className = 'product-row';
            row.setAttribute('data-order-id', order.id);
            
            // Determine color classes for status selects
            let statusColorClass = getStatusColorClass(order.status);
            let deliveryColorClass = getDeliveryStatusColorClass(order.status_delivery);
            
            row.innerHTML = `
                <div class="product-item">
                    <span class="header-product">${order.id}</span>
                    <span class="header-price">${escapeHtml(order.user_id)}</span>
                    <span class="header-info">${escapeHtml(order.shipping_info)}</span>
                    <span class="header-submitted">${escapeHtml(order.shipping_method)}</span>
                    <span class="header-total total-amount">$${parseFloat(order.total).toFixed(2)}</span>
                    <span class="header-created">${formatDate(order.created_at)}</span>
                    <span class="header-category">
                        <div class="status-container">
                            <span class="status-dot ${getStatusDotClass(order.status)}"></span>
                            <div style="display: flex; align-items: center; gap: 2px;">
                                <select class="status-select ${statusColorClass}" data-id="${order.id}" data-current-status="${order.status}" data-type="status">
                                    <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
                                    <option value="paid" ${order.status === 'paid' ? 'selected' : ''}>Paid</option>
                                    <option value="failed" ${order.status === 'failed' ? 'selected' : ''}>Failed</option>
                                    <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                                </select>
                                <i class="bi bi-chevron-down"></i>
                            </div>
                        </div>
                    </span>
                    <span class="header-message">
                        <div class="status-container">
                            <span class="status-dot ${getDeliveryStatusDotClass(order.status_delivery)}"></span>
                            <div style="display: flex; align-items: center; gap: 2px;">
                                <select class="status-select ${deliveryColorClass}" data-id="${order.id}" data-current-delivery-status="${order.status_delivery}" data-type="delivery">
                                    <option value="pending" ${order.status_delivery === 'pending' ? 'selected' : ''}>Pending</option>
                                    <option value="in_transit" ${order.status_delivery === 'in_transit' ? 'selected' : ''}>In Transit</option>
                                    <option value="delivered" ${order.status_delivery === 'delivered' ? 'selected' : ''}>Delivered</option>
                                    <option value="failed" ${order.status_delivery === 'failed' ? 'selected' : ''}>Failed</option>
                                    <option value="cancelled" ${order.status_delivery === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                                </select>
                                <i class="bi bi-chevron-down"></i>
                            </div>
                        </div>
                    </span>
                </div>`;
            container.appendChild(row);
        });
        
        // Add event listeners for status dropdowns
        container.querySelectorAll('.status-select[data-type="status"]').forEach(select => {
            select.addEventListener('change', function(e) {
                handleStatusChange(this, 'status');
            });
        });
        
        container.querySelectorAll('.status-select[data-type="delivery"]').forEach(select => {
            select.addEventListener('change', function(e) {
                handleStatusChange(this, 'delivery');
            });
        });
        
        // Make .status-container clickable to open the select
        container.querySelectorAll('.status-container').forEach(containerEl => {
            containerEl.addEventListener('click', function(e) {
                const select = this.querySelector('.status-select');
                if (e.target !== select) {
                    select.focus();
                    select.click();
                }
            });
        });
    }

    function handleStatusChange(select, type) {
        const orderId = select.getAttribute('data-id');
        const previousStatus = type === 'status' 
            ? select.getAttribute('data-current-status') 
            : select.getAttribute('data-current-delivery-status');
        const newStatus = select.value;
        const dot = select.parentElement.parentElement.querySelector('.status-dot');
        
        // Update select color
        if (type === 'status') {
            select.classList.remove('status-select-red', 'status-select-blue', 'status-select-green', 'status-select-yellow');
            select.classList.add(getStatusColorClass(newStatus));
        } else {
            select.classList.remove('status-select-red', 'status-select-blue', 'status-select-green', 'status-select-yellow');
            select.classList.add(getDeliveryStatusColorClass(newStatus));
        }
        
        // Update dot color
        if (type === 'status') {
            dot.className = 'status-dot ' + getStatusDotClass(newStatus);
        } else {
            dot.className = 'status-dot ' + getDeliveryStatusDotClass(newStatus);
        }
        
        // Send update to server
        const endpoint = type === 'status' ? '/api/admin/update-order-status' : '/api/admin/update-order-delivery';
        const updateData = {
            orderId: orderId,
            [type === 'status' ? 'status' : 'status_delivery']: newStatus
        };
        
        fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updateData)
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                showOrderAlert('Status updated successfully!', 'success');
                // Update the stored current status
                if (type === 'status') {
                    select.setAttribute('data-current-status', newStatus);
                } else {
                    select.setAttribute('data-current-delivery-status', newStatus);
                }
            } else {
                showOrderAlert('Failed to update status: ' + (data.message || 'Unknown error'), 'error');
                // Revert on error
                select.value = previousStatus;
                if (type === 'status') {
                    select.classList.remove('status-select-red', 'status-select-blue', 'status-select-green', 'status-select-yellow');
                    select.classList.add(getStatusColorClass(previousStatus));
                    dot.className = 'status-dot ' + getStatusDotClass(previousStatus);
                } else {
                    select.classList.remove('status-select-red', 'status-select-blue', 'status-select-green', 'status-select-yellow');
                    select.classList.add(getDeliveryStatusColorClass(previousStatus));
                    dot.className = 'status-dot ' + getDeliveryStatusDotClass(previousStatus);
                }
            }
        })
        .catch(err => {
            showOrderAlert('Error updating status: ' + err.message, 'error');
            // Revert on error
            select.value = previousStatus;
            if (type === 'status') {
                select.classList.remove('status-select-red', 'status-select-blue', 'status-select-green', 'status-select-yellow');
                select.classList.add(getStatusColorClass(previousStatus));
                dot.className = 'status-dot ' + getStatusDotClass(previousStatus);
            } else {
                select.classList.remove('status-select-red', 'status-select-blue', 'status-select-green', 'status-select-yellow');
                select.classList.add(getDeliveryStatusColorClass(previousStatus));
                dot.className = 'status-dot ' + getDeliveryStatusDotClass(previousStatus);
            }
        });
    }

    function getStatusDotClass(status) {
        switch (status) {
            case 'pending': return 'dot-yellow';
            case 'paid': return 'dot-green';
            case 'failed': return 'dot-red';
            case 'cancelled': return 'dot-red';
            default: return 'dot-blue';
        }
    }

    function getDeliveryStatusDotClass(status) {
        switch (status) {
            case 'pending': return 'dot-yellow';
            case 'in_transit': return 'dot-blue';
            case 'delivered': return 'dot-green';
            case 'failed': return 'dot-red';
            case 'cancelled': return 'dot-red';
            default: return 'dot-blue';
        }
    }

    function getStatusColorClass(status) {
        switch (status) {
            case 'pending': return 'status-select-yellow';
            case 'paid': return 'status-select-green';
            case 'failed': return 'status-select-red';
            case 'cancelled': return 'status-select-red';
            default: return 'status-select-blue';
        }
    }

    function getDeliveryStatusColorClass(status) {
        switch (status) {
            case 'pending': return 'status-select-yellow';
            case 'in_transit': return 'status-select-blue';
            case 'delivered': return 'status-select-green';
            case 'failed': return 'status-select-red';
            case 'cancelled': return 'status-select-red';
            default: return 'status-select-blue';
        }
    }

    function formatDate(dateStr) {
        const d = new Date(dateStr);
        if (isNaN(d)) return '';
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}/${month}/${day}`;
    }

    function showAlert(message) {
        const alertBox = document.getElementById('orderAlert');
        const alertMsg = document.getElementById('orderAlertMessage');
        alertMsg.textContent = message;
        alertBox.style.display = 'block';
        document.getElementById('orderAlertClose').onclick = () => {
            alertBox.style.display = 'none';
        };
    }

    function escapeHtml(text) {
        const map = {
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
        };
        return String(text).replace(/[&<>"']/g, m => map[m]);
    }

    // Show custom alert at bottom right
    function showOrderAlert(message, type = 'info') {
        const alertBox = document.getElementById('orderAlert');
        const alertMsg = document.getElementById('orderAlertMessage');
        alertMsg.textContent = message;
        alertBox.classList.add('show');
        clearTimeout(window._orderAlertTimeout);
        window._orderAlertTimeout = setTimeout(() => {
            alertBox.classList.remove('show');
        }, 3000);
    }

    // Close button
    const alertCloseBtn = document.getElementById('orderAlertClose');
    if (alertCloseBtn) {
        alertCloseBtn.onclick = function() {
            document.getElementById('orderAlert').classList.remove('show');
        };
    }
}); 