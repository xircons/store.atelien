// Admin Dashboard JS - Vanilla, minimal, well-commented
// Simulated MySQL data (replace with API calls in production)
const products = [
  { id: 1, name: 'Minimal Chair', price: 320, category: 'Seating', stock: 12 },
  { id: 2, name: 'Modern Table', price: 540, category: 'Tables', stock: 5 },
  { id: 3, name: 'Sleek Lamp', price: 120, category: 'Lighting', stock: 20 }
];
const orders = [
  { id: 101, customer: 'Alice', total: 320, status: 'Paid', date: '2024-06-01' },
  { id: 102, customer: 'Bob', total: 540, status: 'Pending', date: '2024-06-02' }
];
const coupons = [
  { id: 1, code: 'WELCOME10', discount: '10%', expires: '2024-12-31' },
  { id: 2, code: 'SUMMER15', discount: '15%', expires: '2024-08-31' }
];

// DOM Elements
const navItems = document.querySelectorAll('.nav-item');
const dashboardContent = document.getElementById('dashboard-content');

// Navigation click handler
navItems.forEach(item => {
  item.addEventListener('click', function() {
    document.querySelector('.nav-item.active').classList.remove('active');
    this.classList.add('active');
    renderSection(this.dataset.section);
  });
});

// Render section based on nav
function renderSection(section) {
  if (section === 'products') {
    renderProducts();
  } else if (section === 'orders') {
    renderOrders();
  } else if (section === 'coupons') {
    renderCoupons();
  }
}

// Render Products Table
function renderProducts() {
  dashboardContent.innerHTML = `
    <h2>Products</h2>
    <table>
      <thead>
        <tr><th>ID</th><th>Name</th><th>Price</th><th>Category</th><th>Stock</th></tr>
      </thead>
      <tbody>
        ${products.map(p => `<tr><td>${p.id}</td><td>${p.name}</td><td>$${p.price}</td><td>${p.category}</td><td>${p.stock}</td></tr>`).join('')}
      </tbody>
    </table>
    <!-- Future: Add/Edit/Delete product functionality -->
  `;
}

// Render Orders Table
function renderOrders() {
  dashboardContent.innerHTML = `
    <h2>Orders</h2>
    <table>
      <thead>
        <tr><th>ID</th><th>Customer</th><th>Total</th><th>Status</th><th>Date</th></tr>
      </thead>
      <tbody>
        ${orders.map(o => `<tr><td>${o.id}</td><td>${o.customer}</td><td>$${o.total}</td><td>${o.status}</td><td>${o.date}</td></tr>`).join('')}
      </tbody>
    </table>
    <!-- Future: Update order status, view details -->
  `;
}

// Render Coupons Table
function renderCoupons() {
  dashboardContent.innerHTML = `
    <h2>Discount Coupons</h2>
    <table>
      <thead>
        <tr><th>ID</th><th>Code</th><th>Discount</th><th>Expires</th></tr>
      </thead>
      <tbody>
        ${coupons.map(c => `<tr><td>${c.id}</td><td>${c.code}</td><td>${c.discount}</td><td>${c.expires}</td></tr>`).join('')}
      </tbody>
    </table>
    <!-- Future: Add/Edit/Delete coupon functionality -->
  `;
}

// Initial render (default to Products)
renderProducts(); 