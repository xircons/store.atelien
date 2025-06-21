document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const collection = params.get('collection') || 'all';

    // ตั้งชื่อหัวเรื่อง (category title)
    const titleEl = document.getElementById('category-title');
    titleEl.textContent = capitalize(collection);

    // ดึงข้อมูลสินค้าจาก API
    fetch(`/api/products?collection=${collection}`)
        .then(res => res.json())
        .then(products => {
            const container = document.getElementById('products-container');
            container.innerHTML = ''; // ล้างของเดิม

            if (products.length === 0) {
                container.innerHTML = '<p>No products found in this collection.</p>';
                return;
            }

            products.forEach(product => {
                const card = document.createElement('div');
                card.className = 'product-card';

                card.innerHTML = `
                    <img src="${product.image}" alt="${product.name}"
                         onerror="this.onerror=null;this.src='/images/fallback.jpg';"
                         loading="lazy" />
                    <h3>${product.name}</h3>
                    <p>Price: ${product.price.toLocaleString()} Baht</p>
                `;

                container.appendChild(card);
            });
        })
        .catch(error => {
            console.error('Error fetching products:', error);
            document.getElementById('products-container').innerHTML = '<p>Failed to load products.</p>';
        });
});

// ช่วยทำให้ตัวอักษรแรกเป็นพิมพ์ใหญ่
function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}
