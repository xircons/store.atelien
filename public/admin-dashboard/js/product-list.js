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
    container.innerHTML = products.map(product => `
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
            <span class="product-visuality" data-visuality="${product.visuality}">
                <i class="bi ${product.visuality == 1 ? 'bi-eye' : 'bi-eye-slash'}"></i>
            </span>
            <span class="product-edit"><i class="bi bi-pencil-square"></i></span>
            <span class="product-delete"><i class="bi bi-trash3"></i></span>
        </div>
    `).join('');
} 