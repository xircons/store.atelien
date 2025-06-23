// Fetch and render products in the admin dashboard grid

document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/products')
        .then(res => res.json())
        .then(products => renderProductGrid(products))
        .catch(err => {
            document.getElementById('productItems').innerHTML = '<div class="error">Failed to load products.</div>';
        });
});

function renderProductGrid(products) {
    const container = document.getElementById('productItems');
    if (!container) return;
    if (!Array.isArray(products) || products.length === 0) {
        container.innerHTML = '<div class="empty">No products found.</div>';
        return;
    }
    container.innerHTML = products.map(product => {
        const statusIcon = product.status === 'enable' ? 'bi-eye' : 'bi-eye-slash';
        const statusClass = product.status === 'enable' ? 'status-enabled' : 'status-disabled';
        
        return `
        <div class="product-row" data-product-id="${product.id}">
            <span class="product-info">
                <div class="product-image-box">
                    <img src="${product.image || '/images/product/default-fallback-image.png'}" alt="${product.name}" class="product-thumb">
                </div>
                <span class="product-info-text">
                    <div class="product-card-title">${product.name}</div>
                    <div class="product-card-id">ID: ${product.id}</div>
                </span>
            </span>
            <span class="product-price">$${Number(product.price).toLocaleString()}</span>
            <span class="product-category">${product.category || '-'}</span>
            <span class="product-status">
                <i class="bi ${statusIcon} status-toggle ${statusClass}" data-id="${product.id}" data-status="${product.status}" title="Click to toggle status"></i>
            </span>
            <span class="product-edit"><i class="bi bi-pencil-square"></i></span>
            <span class="product-delete"><i class="bi bi-trash3"></i></span>
        </div>
    `}).join('');
    
    addDeleteEventListeners();
    addStatusToggleEventListeners();
}

function addStatusToggleEventListeners() {
    const statusIcons = document.querySelectorAll('.product-status .status-toggle');
    statusIcons.forEach(icon => {
        icon.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const productId = this.getAttribute('data-id');
            const currentStatus = this.getAttribute('data-status');
            const productName = this.closest('.product-row').querySelector('.product-card-title').textContent;
            
            toggleProductStatus(productId, this, currentStatus, productName);
        });
    });
}

function toggleProductStatus(productId, iconElement, currentStatus, productName) {
    // Show loading state
    iconElement.style.opacity = '0.5';
    iconElement.style.pointerEvents = 'none';
    
    fetch(`/api/products/${productId}/toggle-status`, {
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
        // Update the icon and data attributes
        const newStatus = data.status;
        const newIconClass = newStatus === 'enable' ? 'bi-eye' : 'bi-eye-slash';
        const newStatusClass = newStatus === 'enable' ? 'status-enabled' : 'status-disabled';
        
        iconElement.className = `bi ${newIconClass} status-toggle ${newStatusClass}`;
        iconElement.setAttribute('data-status', newStatus);
        
        // Remove loading state
        iconElement.style.opacity = '1';
        iconElement.style.pointerEvents = 'auto';
        
        // Show success message
        const statusText = newStatus === 'enable' ? 'enabled' : 'disabled';
        const truncatedName = productName.length > 20 ? productName.substring(0, 20) + '...' : productName;
        showProductAlert(`Product "${truncatedName}" ${statusText} successfully`, 'success');
    })
    .catch(error => {
        console.error('Error toggling product status:', error);
        
        // Remove loading state
        iconElement.style.opacity = '1';
        iconElement.style.pointerEvents = 'auto';
        
        showProductAlert('Failed to toggle product status. Please try again.', 'error');
    });
}

function addDeleteEventListeners() {
    const deleteButtons = document.querySelectorAll('.product-delete i.bi-trash3');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const productRow = this.closest('.product-row');
            const productId = productRow.getAttribute('data-product-id');
            const productName = productRow.querySelector('.product-card-title').textContent;
            if (confirm(`Are you sure you want to delete "${productName}" (ID: ${productId})?`)) {
                deleteProduct(productId, productRow, productName);
            }
        });
    });
}

function deleteProduct(productId, productRow, productName) {
    fetch(`/api/products/${productId}`, {
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
        if (productRow) productRow.remove();
        
        // Truncate long product names for the alert
        const truncatedName = productName.length > 20 ? productName.substring(0, 20) + '...' : productName;
        showProductAlert(`Deleted: ${truncatedName}`, 'success');
        
        // If no more products, show empty state
        if (document.querySelectorAll('.product-row').length === 0) {
            document.getElementById('productItems').innerHTML = '<div class="empty">No products found.</div>';
        }
    })
    .catch(error => {
        showProductAlert('Failed to delete product. Please try again.', 'error');
    });
}

// Show alert using the new product-alert style
function showProductAlert(message, type = 'info') {
    const alertBox = document.getElementById('productAlert');
    const alertMessage = document.getElementById('productAlertMessage');
    const alertClose = document.getElementById('productAlertClose');
    if (!alertBox || !alertMessage || !alertClose) return;

    alertMessage.textContent = message;
    alertBox.classList.remove('hide');
    alertBox.classList.add('show');

    // Optionally, you can style by type (info/success/error)
    alertBox.classList.remove('success', 'error', 'info');
    alertBox.classList.add(type);

    // Auto-hide after 3 seconds
    clearTimeout(alertBox._timeout);
    alertBox._timeout = setTimeout(() => {
        hideProductAlert();
    }, 10000);

    // Close button
    alertClose.onclick = function() {
        hideProductAlert();
    };
}

function hideProductAlert() {
    const alertBox = document.getElementById('productAlert');
    if (!alertBox) return;
    
    alertBox.classList.add('hide');
    clearTimeout(alertBox._timeout);
    
    // Remove the element after animation completes
    setTimeout(() => {
        alertBox.classList.remove('show', 'hide');
    }, 300);
} 