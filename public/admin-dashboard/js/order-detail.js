document.addEventListener('DOMContentLoaded', function () {
    // Get order ID from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('id');
    
    // Alert system functions (duplicated and adapted from coupon-edit.js)
    function showOrderAlert(message, type = 'error') {
        const alertBox = document.getElementById('cartAlert');
        const alertMessage = document.getElementById('cartAlertMessage');
        const alertClose = document.getElementById('cartAlertClose');
        if (!alertBox || !alertMessage || !alertClose) return;
        alertMessage.textContent = message;
        alertBox.classList.remove('hide');
        alertBox.classList.add('show');
        alertBox.classList.remove('success', 'error', 'info');
        alertBox.classList.add(type);
        clearTimeout(alertBox._timeout);
        alertBox._timeout = setTimeout(() => { hideOrderAlert(); }, 2000);
        alertClose.onclick = function() { hideOrderAlert(); };
    }
    function hideOrderAlert() {
        const alertBox = document.getElementById('cartAlert');
        if (!alertBox) return;
        alertBox.classList.add('hide');
        clearTimeout(alertBox._timeout);
        setTimeout(() => { alertBox.classList.remove('show', 'hide'); }, 300);
    }

    if (!orderId) {
        showOrderAlert('No order ID provided. Please go back to the order list and try again.', 'error');
        // Render with dashes for all database fields
        renderOrderDetail({
            id: '-',
            user_id: '-',
            created_at: '-',
            status: '-',
            status_delivery: '-',
            shipping_method: '-',
            subtotal: '-',
            shipping_cost: '-',
            taxes: '-',
            discount_code: '',
            discount_amount: '-',
            total: '-',
            shipping_info: JSON.stringify({
                firstName: '-',
                lastName: '-',
                address: '-',
                apartment: '',
                city: '-',
                state: '-',
                zip: '-',
                country: '-',
                phone: '-'
            }),
            items: JSON.stringify([])
        });
        return;
    }
    
    // Add print button functionality
    const printBtn = document.querySelector('.btn.print');
    if (printBtn) {
        printBtn.addEventListener('click', function() {
            // Hide sidebar before printing
            const sidebarContainer = document.getElementById('sidebar-container');
            if (sidebarContainer) {
                sidebarContainer.style.display = 'none';
            }
            
            // Print the page
            window.print();
            
            // Show sidebar again after printing
            setTimeout(() => {
                if (sidebarContainer) {
                    sidebarContainer.style.display = 'block';
                }
            }, 100);
        });
    }
    
    // Fetch order details
    fetch(`/api/admin/orders/${orderId}`)
        .then(res => res.json())
        .then(data => {
            if (!data.success) throw new Error(data.message || 'Failed to fetch order details');
            renderOrderDetail(data.order);
        })
        .catch(err => showError(err.message));

    // Helper to display clean placeholder
    function displayValue(val) {
        if (val === undefined || val === null) return '-';
        if (typeof val === 'string' && (val.trim() === '' || val.trim() === '-' || val.trim().toLowerCase() === 'nan')) return '-';
        if (typeof val === 'number' && isNaN(val)) return '-';
        return val;
    }

    // Helper to format amounts with commas
    function formatAmount(amount) {
        if (amount === undefined || amount === null || amount === '-' || amount === '') return '-';
        const num = parseFloat(amount);
        if (isNaN(num)) return '-';
        return '$' + num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    // Helper to convert country codes to full names
    function formatCountry(countryCode) {
        if (!countryCode || countryCode === '-') return '-';
        const countryMap = {
            'TH': 'Thailand',
            'US': 'United States'
        };
        return countryMap[countryCode.toUpperCase()] || countryCode;
    }

    // Helper to format phone numbers with dashes
    function formatPhone(phone) {
        if (!phone || phone === '-') return '-';
        // Remove all non-digit characters
        const digits = phone.replace(/\D/g, '');
        if (digits.length === 10) {
            return digits.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
        } else if (digits.length === 11 && digits.startsWith('1')) {
            return digits.replace(/(\d{1})(\d{3})(\d{3})(\d{4})/, '$1-$2-$3-$4');
        }
        return phone; // Return original if not in expected format
    }

    function renderOrderDetail(order) {
        const container = document.getElementById('orderDetailContent');
        
        // Parse shipping info and items
        const shippingInfo = JSON.parse(order.shipping_info);
        const items = JSON.parse(order.items);
        
        // Helper for combined fields
        function combined(...args) {
            if (args.some(v => displayValue(v) === '-')) return '-';
            return args.join(' ');
        }
        
        container.innerHTML = `
            <div class="order-info-grid">
                <div class="order-section">
                    <h3>Order Information</h3>
                    <div class="info-row">
                        <span class="info-label">Order ID:</span>
                        <span class="info-value">${order.id === '-' ? '-' : '#' + order.id}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">User ID:</span>
                        <span class="info-value">${displayValue(order.user_id)}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Order Date:</span>
                        <span class="info-value">${displayValue(formatDateTime(order.created_at))}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Payment Status:</span>
                        <span class="info-value">
                            <span class="status-badge status-${displayValue(order.status)}"><span class="status-dot"></span>${displayValue(capitalizeFirst(order.status))}</span>
                        </span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Delivery Status:</span>
                        <span class="info-value">
                            <span class="status-badge status-${displayValue(order.status_delivery)}"><span class="status-dot"></span>${displayValue(formatDeliveryStatus(order.status_delivery))}</span>
                        </span>
                    </div>
                </div>
                
                <div class="order-section">
                    <h3>Shipping Information</h3>
                    <div class="info-row">
                        <span class="info-label">Name:</span>
                        <span class="info-value">${combined(shippingInfo.firstName, shippingInfo.lastName)}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Address:</span>
                        <span class="info-value">${combined(shippingInfo.address, shippingInfo.apartment)}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">City:</span>
                        <span class="info-value">${combined(shippingInfo.city, shippingInfo.state, shippingInfo.zip)}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Country:</span>
                        <span class="info-value">${formatCountry(shippingInfo.country)}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Phone:</span>
                        <span class="info-value">${formatPhone(shippingInfo.phone)}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Shipping Method:</span>
                        <span class="info-value">${displayValue(capitalizeFirst(order.shipping_method))}</span>
                    </div>
                </div>
            </div>
            
            <div class="order-section">
                <h3>Order Summary</h3>
                <div class="info-row">
                    <span class="info-label">Subtotal:</span>
                    <span class="info-value">${formatAmount(order.subtotal)}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Shipping Cost:</span>
                    <span class="info-value">${formatAmount(order.shipping_cost)}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Taxes:</span>
                    <span class="info-value">${formatAmount(order.taxes)}</span>
                </div>
                ${order.discount_code ? `
                <div class="info-row">
                    <span class="info-label">Discount (${order.discount_code}):</span>
                    <span class="info-value">${order.discount_amount === '-' ? '-' : '-' + formatAmount(order.discount_amount)}</span>
                </div>
                ` : ''}
                <div class="info-row">
                    <span class="info-label"><strong>Total:</strong></span>
                    <span class="info-value"><strong>${formatAmount(order.total)}</strong></span>
                </div>
            </div>
            
            <div class="order-items">
                <h3>Order Items (${items.length})</h3>
                <table class="orders-table">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Details</th>
                            <th>Quantity</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${items.length === 0 ? `<tr><td colspan="4" style="text-align:center;">-</td></tr>` : items.map(item => `
                            <tr>
                                <td>
                                    <div style="display: flex; align-items: center; gap: 1rem;">
                                        <img src="${displayValue(item.image)}" alt="${displayValue(item.name)}" style="width: 160px; height: 160px; object-fit: cover;" onerror="this.src='/images/product/default-fallback-image.png'">
                                        <span style="font-size: 1rem; font-weight: 400; align-self: flex-start;">${displayValue(item.name)}</span>
                                    </div>
                                </td>
                                <td style="display: flex; flex-direction: column; align-items: flex-start;">
                                    <div style="font-size: 0.8rem; color: rgba(6, 29, 27, 0.6);">
                                        <div>Maker: ${displayValue(item.maker)}</div>
                                        <div>Lead Time: ${displayValue(item.lead_time)}</div>
                                    </div>
                                </td>
                                <td style="text-align: left; font-weight: 400; color: rgba(6, 29, 27, 1);">${displayValue(item.quantity)}</td>
                                <td class="amount" style="align-items: flex-start;">${formatAmount(item.price)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    function formatDateTime(dateStr) {
        const d = new Date(dateStr);
        if (isNaN(d)) return '';
        return d.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    function capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    function formatDeliveryStatus(status) {
        const statusMap = {
            'pending': 'Pending',
            'in_transit': 'In Transit',
            'delivered': 'Delivered',
            'failed': 'Failed',
            'cancelled': 'Cancelled'
        };
        return statusMap[status] || capitalizeFirst(status);
    }

    function showError(message) {
        const container = document.getElementById('orderDetailContent');
        container.innerHTML = `<div class="error">Error: ${message}</div>`;
    }
}); 