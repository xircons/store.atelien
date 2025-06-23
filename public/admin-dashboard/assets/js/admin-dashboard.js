// Admin Dashboard JS - Overview Page
// Simulated MySQL data (replace with API calls in production)
const stats = {
  revenue: 12800,
  orders: 56,
  customers: 34
};
const recentOrders = [
  { id: 201, status: 'Paid', date: '2024-06-01', customer: 'Alice', amount: 320 },
  { id: 202, status: 'Pending', date: '2024-06-02', customer: 'Bob', amount: 540 },
  { id: 203, status: 'Failed', date: '2024-06-03', customer: 'Charlie', amount: 120 },
  { id: 204, status: 'Paid', date: '2024-06-04', customer: 'Dana', amount: 220 }
];

// Render stats cards
function renderStats() {
  document.getElementById('total-revenue').textContent = `$${stats.revenue.toLocaleString()}`;
  document.getElementById('total-orders').textContent = stats.orders;
  document.getElementById('total-customers').textContent = stats.customers;
}

// Render recent orders table
function renderOrdersTable() {
  const table = document.createElement('table');
  table.innerHTML = `
    <thead>
      <tr><th>Order ID</th><th>Status</th><th>Date</th><th>Customer Name</th><th>Amount Spent</th></tr>
    </thead>
    <tbody>
      ${recentOrders.map(o => `
        <tr>
          <td>${o.id}</td>
          <td><span class="status-badge status-${o.status.toLowerCase()}">${o.status}</span></td>
          <td>${o.date}</td>
          <td>${o.customer}</td>
          <td>$${o.amount}</td>
        </tr>
      `).join('')}
    </tbody>
  `;
  document.getElementById('orders-table').innerHTML = '';
  document.getElementById('orders-table').appendChild(table);
}

// Sidebar nav switching (future: handle more sections)
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', function() {
    document.querySelector('.nav-item.active').classList.remove('active');
    this.classList.add('active');
    // Future: load section content dynamically
  });
});

// Initial render
renderStats();
renderOrdersTable(); 