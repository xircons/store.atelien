let chart;
    let currentMetric = 'profit';
    const mockData = {
        profit: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            data: [12500, 15200, 18900, 22100, 19800, 25600, 28900, 32100, 29800, 35200, 38600, 42300]
        },
        orders: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            data: [245, 298, 367, 423, 389, 456, 512, 578, 534, 623, 689, 756]
        },
        users: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            data: [120, 134, 156, 178, 165, 190, 210, 230, 220, 245, 260, 275]
        }
    };
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
                labels: data.labels,
                datasets: [{
                    label: metric === 'profit' ? 'Profit ($)' : metric === 'orders' ? 'Orders' : 'New Users',
                    data: data.data,
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
                            callback: v => metric === 'profit' ? '$' + v.toLocaleString() : v.toLocaleString()
                        }
                    }
                },
                interaction: { intersect: false, mode: 'index' }
            }
        });
    }
    function switchChart(metric) {
        if (metric === currentMetric) return;
        currentMetric = metric;
        document.getElementById('statProfit').classList.toggle('active', metric === 'profit');
        document.getElementById('statOrders').classList.toggle('active', metric === 'orders');
        document.getElementById('statUsers').classList.toggle('active', metric === 'users');
        initChart(mockData[metric], metric);
    }
    document.addEventListener('DOMContentLoaded', function() {
        initChart(mockData.profit, 'profit');
    });