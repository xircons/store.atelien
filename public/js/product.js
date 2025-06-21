document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('product');
    const container = document.getElementById('product-container');
    const searchBtn = document.getElementById('searchBtn');
    const searchContainer = document.querySelector('.search-container');
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.querySelector('.nav-menu');
    const navRight = document.querySelector('.nav-right');

    if (!productId) {
        container.innerHTML = '<div class="error">Product not found. Please go back to <a href="collections.html">collections</a>.</div>';
        return;
    }

    // Fetch product details
    fetch(`/api/products/${productId}`)
        .then(res => {
            if (!res.ok) throw new Error('Product not found');
            return res.json();
        })
        .then(product => {
            container.innerHTML = `
                <div class="product-detail">
                    <div class="product-image-container">
                        <img src="${product.image || '/images/product/default-fallback-image.png'}" 
                             alt="${product.name}" 
                             class="product-image"
                             onerror="this.src='/images/product/default-fallback-image.png'; this.onerror=null;"
                             onload="this.style.opacity='1';"
                             style="opacity: 0; transition: opacity 0.3s;">
                    </div>
                    <div class="product-info">
                        <h1 class="product-title">${product.name}</h1>
                        <div class="product-meta-table">
                            <table>
                                <tr><th>Maker</th><td>${product.maker || '-'}</td></tr>
                                <tr><th>Lead Time</th><td>${product.lead_time || '-'}</td></tr>
                                <tr><th>Category</th><td>${product.category || '-'}</td></tr>
                            </table>
                        </div>
                        <div class="product-price">$${Number(product.price).toLocaleString()} USD</div>
                        <button class="add-to-cart-btn" onclick="addToCart(${product.id})">Add to Cart</button>
                        <div class="product-description">${product.description || 'No description available.'}</div>
                    </div>
                </div>
            `;
        })
        .catch(error => {
            console.error('Error fetching product:', error);
            container.innerHTML = '<div class="error">Sorry, we couldn\'t load the product. Please try again later.</div>';
        });

    // Search toggle
    searchBtn.addEventListener('click', () => {
        searchContainer.style.display = searchContainer.style.display === 'block' ? 'none' : 'block';
    });

    // Mobile menu toggle
    menuToggle.addEventListener('click', () => {
        navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
        navRight.style.display = navRight.style.display === 'flex' ? 'none' : 'flex';
    });

    // Close search when clicking outside
    document.addEventListener('click', (e) => {
        if (!searchBtn.contains(e.target) && !searchContainer.contains(e.target)) {
            searchContainer.style.display = 'none';
        }
    });
});

function addToCart(productId) {
    // TODO: Implement add to cart functionality
    alert('Add to cart functionality will be implemented soon!');
} 