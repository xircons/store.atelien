document.addEventListener('DOMContentLoaded', function() {
    // Check admin access by trying to fetch orders (protected route)
    fetch('/api/admin/orders', { credentials: 'include' })
        .then(res => {
            if (res.status === 403 || res.status === 401) {
                alert('Admin access required. Redirecting to login.');
                window.location.href = '/login.html';
                return Promise.reject('Not admin');
            }
            return res.json();
        })
        .then(data => renderOrders(data))
        .catch(() => {});

    // Fetch and render coupons
    fetch('/api/admin/coupons', { credentials: 'include' })
        .then(res => res.json())
        .then(data => renderCoupons(data));

    // Fetch and render products
    fetch('/api/admin/products', { credentials: 'include' })
        .then(res => res.json())
        .then(data => renderProducts(data));
});

function renderOrders(orders) {
    const list = document.getElementById('orders-list');
    if (!orders || orders.length === 0) {
        list.innerHTML = '<p>No orders found.</p>';
        return;
    }
    list.innerHTML = '<table><tr><th>ID</th><th>Status</th><th>Actions</th></tr>' +
        orders.map(order => `<tr><td>${order.id}</td><td><input value="${order.status}" id="order-status-${order.id}"/></td><td><button onclick="updateOrderStatus(${order.id})">Update</button></td></tr>`).join('') + '</table>';
}

function updateOrderStatus(orderId) {
    const status = document.getElementById(`order-status-${orderId}`).value;
    fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status })
    }).then(res => res.json()).then(() => location.reload());
}

function renderCoupons(coupons) {
    const list = document.getElementById('coupons-list');
    if (!coupons || coupons.length === 0) {
        list.innerHTML = '<p>No coupons found.</p>';
        return;
    }
    list.innerHTML = '<table><tr><th>ID</th><th>Code</th><th>Discount</th><th>Expires At</th><th>Actions</th></tr>' +
        coupons.map(c => `<tr><td>${c.id}</td><td><input value="${c.code}" id="coupon-code-${c.id}"/></td><td><input value="${c.discount}" id="coupon-discount-${c.id}"/></td><td><input value="${c.expires_at}" id="coupon-expires-${c.id}"/></td><td><button onclick="updateCoupon(${c.id})">Update</button></td></tr>`).join('') + '</table>';
}

function updateCoupon(id) {
    const code = document.getElementById(`coupon-code-${id}`).value;
    const discount = document.getElementById(`coupon-discount-${id}`).value;
    const expires_at = document.getElementById(`coupon-expires-${id}`).value;
    fetch(`/api/admin/coupons/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ code, discount, expires_at })
    }).then(res => res.json()).then(() => location.reload());
}

function renderProducts(products) {
    const list = document.getElementById('products-list');
    if (!products || products.length === 0) {
        list.innerHTML = '<p>No products found.</p>';
        return;
    }
    list.innerHTML = `
        <table>
            <tr>
                <th>ID</th><th>Name</th><th>Description</th><th>Price</th><th>Category</th><th>Image</th><th>Image Hover</th><th>Maker</th><th>Lead Time</th><th>Created At</th><th>Visuality</th><th>Actions</th>
            </tr>
            ${products.map(p => `
                <tr>
                    <td>${p.id}</td>
                    <td><input value="${p.name}" id="product-name-${p.id}"/></td>
                    <td><input value="${p.description}" id="product-desc-${p.id}"/></td>
                    <td><input value="${p.price}" id="product-price-${p.id}"/></td>
                    <td><input value="${p.category}" id="product-category-${p.id}"/></td>
                    <td><input value="${p.image}" id="product-image-${p.id}"/></td>
                    <td><input value="${p.image_hover}" id="product-image-hover-${p.id}"/></td>
                    <td><input value="${p.maker}" id="product-maker-${p.id}"/></td>
                    <td><input value="${p.lead_time}" id="product-leadtime-${p.id}"/></td>
                    <td>${p.created_at}</td>
                    <td><input type="checkbox" id="product-visuality-${p.id}" ${p.visuality ? 'checked' : ''}/></td>
                    <td><button onclick="updateProduct(${p.id})">Update</button></td>
                </tr>
            `).join('')}
        </table>
    `;
    // Add product form
    document.getElementById('add-product-form').innerHTML = `
        <h3>Add New Product</h3>
        <form id="new-product-form">
            <input placeholder="Name" id="new-product-name" required />
            <input placeholder="Description" id="new-product-desc" required />
            <input placeholder="Price" id="new-product-price" type="number" step="0.01" required />
            <input placeholder="Category" id="new-product-category" required />
            <input placeholder="Image" id="new-product-image" required />
            <input placeholder="Image Hover" id="new-product-image-hover" required />
            <input placeholder="Maker" id="new-product-maker" required />
            <input placeholder="Lead Time" id="new-product-leadtime" required />
            <label>Visible <input type="checkbox" id="new-product-visuality" checked /></label>
            <button type="submit">Add Product</button>
        </form>
    `;
    document.getElementById('add-product-form').style.display = 'block';
    document.getElementById('new-product-form').onsubmit = function(e) {
        e.preventDefault();
        addProduct();
    };
}

function updateProduct(id) {
    const name = document.getElementById(`product-name-${id}`).value;
    const description = document.getElementById(`product-desc-${id}`).value;
    const price = document.getElementById(`product-price-${id}`).value;
    const category = document.getElementById(`product-category-${id}`).value;
    const image = document.getElementById(`product-image-${id}`).value;
    const image_hover = document.getElementById(`product-image-hover-${id}`).value;
    const maker = document.getElementById(`product-maker-${id}`).value;
    const lead_time = document.getElementById(`product-leadtime-${id}`).value;
    const visuality = document.getElementById(`product-visuality-${id}`).checked ? 1 : 0;
    fetch(`/api/admin/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name, description, price, category, image, image_hover, maker, lead_time, visuality })
    }).then(res => res.json()).then(() => location.reload());
}

function addProduct() {
    const name = document.getElementById('new-product-name').value;
    const description = document.getElementById('new-product-desc').value;
    const price = document.getElementById('new-product-price').value;
    const category = document.getElementById('new-product-category').value;
    const image = document.getElementById('new-product-image').value;
    const image_hover = document.getElementById('new-product-image-hover').value;
    const maker = document.getElementById('new-product-maker').value;
    const lead_time = document.getElementById('new-product-leadtime').value;
    const visuality = document.getElementById('new-product-visuality').checked ? 1 : 0;
    fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name, description, price, category, image, image_hover, maker, lead_time, visuality })
    }).then(res => res.json()).then(() => location.reload());
} 