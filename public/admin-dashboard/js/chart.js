let chart;
let currentMetric = 'revenue';
let realData = null;
let selectedYear = '2025';

function setLoading(isLoading) {
    const loading = document.getElementById('loading');
    if (loading) loading.style.display = isLoading ? 'block' : 'none';
}

function initChart(data, metric) {
    const ctx = document.getElementById('performanceChart').getContext('2d');
    if (chart) chart.destroy();
    // Create gradient for line and fill
    const lineGradient = ctx.createLinearGradient(0, 0, 0, 400);
    lineGradient.addColorStop(0, '#2a2a2a');
    lineGradient.addColorStop(1, '#bdbdbd');
    const fillGradient = ctx.createLinearGradient(0, 0, 0, 400);
    fillGradient.addColorStop(0, 'rgba(42,42,42,0.12)');
    fillGradient.addColorStop(1, 'rgba(42,42,42,0)');
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [
                'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
            ],
            datasets: [{
                label: metric === 'revenue' ? 'Total Revenue ($)' : metric === 'orders' ? 'Total Orders' : 'New Users',
                data: data,
                borderColor: lineGradient,
                backgroundColor: fillGradient,
                borderWidth: 1,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#2a2a2a',
                pointBorderColor: '#2a2a2a',
                pointBorderWidth: 1,
                pointRadius: 2.5,
                pointHoverRadius: 3.5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    bodyFont: { family: 'Jost, sans-serif', size: 11, weight: '300' },
                    titleFont: { family: 'Jost, sans-serif', size: 11, weight: '300' },
                    bodyColor: '#fff',
                    titleColor: '#fff',
                }
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: {
                        color: '#000000',
                        font: { family: 'Jost, sans-serif', size: 13, weight: '300' }
                    }
                },
                y: {
                    grid: { color: 'rgba(42, 42, 42, 0.08)' },
                    ticks: {
                        color: '#000000',
                        font: { family: 'Jost, sans-serif', size: 13, weight: '300' },
                        callback: v => metric === 'revenue' ? '$' + v.toLocaleString() : v.toLocaleString()
                    }
                }
            },
            interaction: { intersect: false, mode: 'index' }
        }
    });
}

function switchChart(metric) {
    if (!realData) return;
    if (metric === currentMetric) return;
    currentMetric = metric;
    document.getElementById('statRevenue').classList.toggle('active', metric === 'revenue');
    document.getElementById('statOrders').classList.toggle('active', metric === 'orders');
    document.getElementById('statUsers').classList.toggle('active', metric === 'users');
    initChart(realData[selectedYear][metric], metric);
}

function updateStatCards() {
    if (!realData || !realData[selectedYear]) return;
    const dThis = realData[selectedYear];
    const prevYear = (parseInt(selectedYear) - 1).toString();
    const dPrev = realData[prevYear];
    // Sum for the whole year
    const revenueThis = dThis.revenue.reduce((a, b) => a + b, 0);
    const revenuePrev = dPrev ? dPrev.revenue.reduce((a, b) => a + b, 0) : 0;
    const revenueGrowth = revenuePrev ? ((revenueThis - revenuePrev) / revenuePrev) * 100 : 0;
    document.getElementById('totalRevenue').textContent = `$${revenueThis.toLocaleString()}`;
    document.getElementById('revenueChange').textContent = (revenueGrowth >= 0 ? '+' : '') + revenueGrowth.toFixed(1) + `% from last year`;
    document.getElementById('revenueChange').className = 'change ' + (revenueGrowth >= 0 ? 'positive' : 'negative');
    // Orders
    const ordersThis = dThis.orders.reduce((a, b) => a + b, 0);
    const ordersPrev = dPrev ? dPrev.orders.reduce((a, b) => a + b, 0) : 0;
    const ordersGrowth = ordersPrev ? ((ordersThis - ordersPrev) / ordersPrev) * 100 : 0;
    document.getElementById('totalOrders').textContent = `${ordersThis.toLocaleString()}`;
    document.getElementById('ordersChange').textContent = (ordersGrowth >= 0 ? '+' : '') + ordersGrowth.toFixed(1) + `% from last year`;
    document.getElementById('ordersChange').className = 'change ' + (ordersGrowth >= 0 ? 'positive' : 'negative');
    // Users
    const usersThis = dThis.users.reduce((a, b) => a + b, 0);
    const usersPrev = dPrev ? dPrev.users.reduce((a, b) => a + b, 0) : 0;
    const usersGrowth = usersPrev ? ((usersThis - usersPrev) / usersPrev) * 100 : 0;
    document.getElementById('totalUsers').textContent = `${usersThis.toLocaleString()}`;
    document.getElementById('usersChange').textContent = (usersGrowth >= 0 ? '+' : '') + usersGrowth.toFixed(1) + `% from last year`;
    document.getElementById('usersChange').className = 'change ' + (usersGrowth >= 0 ? 'positive' : 'negative');
}

async function loadChartData() {
    setLoading(true);
    try {
        const res = await fetch('/api/admin/monthly-stats?years=2024,2025');
        if (!res.ok) throw new Error('Failed to fetch chart data');
        realData = await res.json();
        // Default to revenue (2025)
        initChart(realData[selectedYear]['revenue'], 'revenue');
        updateStatCards();
        setLoading(false);
    } catch (e) {
        setLoading(false);
        alert('Error loading chart data: ' + e.message);
    }
}

async function loadTopProducts() {
    const list = document.getElementById('topProductList');
    if (!list) return;
    list.innerHTML = '<li>Loading...</li>';
    try {
        const res = await fetch('/api/admin/top-products?year=2025&month=12');
        if (!res.ok) throw new Error('Failed to fetch top products');
        let products = await res.json();
        // Sort by growth descending (positive growth first, largest at top)
        products = products.sort((a, b) => {
            // Treat null growth as lowest
            const growthA = a.growth === null ? -Infinity : a.growth;
            const growthB = b.growth === null ? -Infinity : b.growth;
            return growthB - growthA;
        }).slice(0, 7);
        if (!products.length) {
            list.innerHTML = '<li>No data available.</li>';
            return;
        }
        list.innerHTML = '';
        products.forEach(product => {
            const growth = product.growth === null ? '' : (product.growth > 0 ? `+${(product.growth*100).toFixed(1)}%` : `${(product.growth*100).toFixed(1)}%`);
            const badgeClass = product.growth === null ? '' : (product.growth > 0 ? 'positive' : 'negative');
            const li = document.createElement('li');
            li.className = 'top-product-item';
            li.innerHTML = `
                <img src="${product.image_url}" alt="${product.name}">
                <div class="top-product-info">
                    <div class="top-product-name">${product.name}</div>
                    <div class="top-product-sold">Sold: ${product.units_sold}</div>
                </div>
                <span class="top-product-badge ${badgeClass}">${growth}</span>
            `;
            list.appendChild(li);
        });
    } catch (e) {
        list.innerHTML = `<li>Error loading products: ${e.message}</li>`;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    loadChartData();
    loadTopProducts();
    // Attach global for HTML onclick
    window.switchChart = switchChart;
    // Year toggle
    const yearToggle = document.getElementById('yearToggle');
    if (yearToggle) {
        yearToggle.addEventListener('change', function() {
            selectedYear = this.value;
            // Always show revenue chart on year switch
            currentMetric = 'revenue';
            document.getElementById('statRevenue').classList.add('active');
            document.getElementById('statOrders').classList.remove('active');
            document.getElementById('statUsers').classList.remove('active');
            if (realData && realData[selectedYear]) {
                initChart(realData[selectedYear]['revenue'], 'revenue');
                updateStatCards();
            }
        });
    }
});