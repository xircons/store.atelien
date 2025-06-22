document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const collection = params.get('collection') || 'all';
    const searchQuery = params.get('search');
    const container = document.getElementById('products-container');
    const searchResultsInfo = document.getElementById('search-results-info');
    const searchBtn = document.getElementById('searchBtn');
    const searchContainer = document.querySelector('.search-container');
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.querySelector('.nav-menu');
    const navRight = document.querySelector('.nav-right');

    // If there's a search query, let search.js handle it
    if (searchQuery) {
        // Search functionality will be handled by search.js
        return;
    }

    // Display collection header
    displayCollectionHeader(collection);

    // Fetch products for collection view (when not searching)
    container.innerHTML = '<p>Loading...</p>';
    fetch(`/api/products?collection=${collection}`)
        .then(res => {
            if (!res.ok) throw new Error('Network response was not ok');
            return res.json();
        })
        .then(products => {
            container.innerHTML = '';
            
            // Update search results info with collection name and product count
            if (searchResultsInfo) {
                const collectionName = getCollectionDisplayName(collection);
                searchResultsInfo.innerHTML = `
                    <div class="collection-header page-header">
                        <h1>${collectionName}</h1>
                        <p class="product-count sub-heading">${products.length} product${products.length !== 1 ? 's' : ''} found</p>
                    </div>
                `;
            }

            if (products.length === 0) {
                container.innerHTML = '<p class="no-products">No products found in this collection.</p>';
                return;
            }

            products.forEach(product => {
                const card = document.createElement('div');
                card.className = 'product-card';
                card.style.cursor = 'pointer';
                card.innerHTML = `
                    <img src="${product.image || '/images/product/default-fallback-image.png'}" alt="${product.name}"
                         onerror="this.src='/images/product/default-fallback-image.png'; this.onerror=null;"
                         loading="lazy">
                    <div class="product-info">
                        <h3>${product.name}</h3>
                        <p class="maker">${product.maker || 'N/A'}</p>
                        <p class="price">$${Number(product.price).toLocaleString()} USD</p>
                    </div>
                `;
                
                // Add click event to navigate to product detail page
                card.addEventListener('click', () => {
                    window.location.href = `product.html?product=${product.id}`;
                });
                
                container.appendChild(card);
            });
        })
        .catch(error => {
            console.error('Error fetching products:', error);
            container.innerHTML = '<p>Sorry, we couldn\'t load the products. Please try again later.</p>';
        });

    // Search toggle (only for showing/hiding search input, actual search handled by search.js)
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

function getCollectionDisplayName(collection) {
    const collectionNames = {
        'all': 'Shop All',
        'seating': 'Seating',
        'tables': 'Tables',
        'lighting': 'Lighting',
        'storage': 'Storage',
        'accessories': 'Accessories'
    };
    return collectionNames[collection] || 'All Collections';
}

function displayCollectionHeader(collection) {
    const collectionName = getCollectionDisplayName(collection);
    const searchResultsInfo = document.getElementById('search-results-info');
    
    if (searchResultsInfo) {
        searchResultsInfo.innerHTML = `
            <div class="collection-header page-header">
                <h1>${collectionName}</h1>
                <p class="product-count sub-heading">Loading...</p>
            </div>
        `;
    }
}

function capitalize(str) {
    if (!str || str === 'all') return 'All Collections';
    return str.charAt(0).toUpperCase() + str.slice(1);
}