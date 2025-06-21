document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('product');
    
    // Get all the elements we need to update
    const elements = {
        // Breadcrumb elements
        productCategory: document.getElementById('product-category'),
        productName: document.getElementById('product-name'),
        
        // Gallery elements
        mainImage: document.getElementById('main-image'),
        galleryThumbnails: document.getElementById('gallery-thumbnails'),
        
        // Product info elements
        productTitle: document.getElementById('product-title'),
        productMaker: document.getElementById('product-maker'),
        productPrice: document.getElementById('product-price'),
        productLeadTime: document.getElementById('product-lead-time'),
        productCategoryDisplay: document.getElementById('product-category-display'),
        productDescriptionText: document.getElementById('product-description-text'),
        
        // Specification elements
        specWidth: document.getElementById('spec-width'),
        specDepth: document.getElementById('spec-depth'),
        specHeight: document.getElementById('spec-height'),
        specMaterial: document.getElementById('spec-material'),
        specYear: document.getElementById('spec-year'),
        
        // Related products
        relatedProducts: document.getElementById('related-products'),
        
        // Buttons
        addToCartBtn: document.getElementById('add-to-cart-btn')
    };

    if (!productId) {
        showError('Product not found. Please go back to <a href="collections.html">collections</a>.');
        return;
    }

    // Fetch product details
    fetch(`/api/products/${productId}`)
        .then(res => {
            if (!res.ok) throw new Error('Product not found');
            return res.json();
        })
        .then(product => {
            console.log('=== RAW PRODUCT DATA ===');
            console.log('Full product object:', product);
            console.log('image_hover field:', product.image_hover);
            console.log('image_hover type:', typeof product.image_hover);
            console.log('image_hover length:', product.image_hover ? product.image_hover.length : 'null');
            console.log('=== END RAW DATA ===');
            
            if (!product) {
                showError('Product not found');
                return;
            }
            populateProductData(product, elements);
            loadRelatedProducts(product.category, productId);
        })
        .catch(error => {
            console.error('Error fetching product:', error);
            showError('Sorry, we couldn\'t load the product. Please try again later.');
        });

    // Add event listeners for buttons
    if (elements.addToCartBtn) {
        elements.addToCartBtn.addEventListener('click', () => addToCart(productId));
    }

    // Initialize quantity controls
    initializeQuantityControls();
});

// Initialize quantity controls with better error handling
function initializeQuantityControls() {
    const quantityInput = document.getElementById('quantity');
    const decreaseBtn = document.getElementById('decrease-btn');
    const increaseBtn = document.getElementById('increase-btn');

    // Check if all elements exist
    if (!quantityInput || !decreaseBtn || !increaseBtn) {
        console.error('Quantity control elements not found');
        return;
    }

    // Decrease button functionality
    decreaseBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const currentValue = parseInt(quantityInput.value) || 1;
        if (currentValue > 1) {
            quantityInput.value = currentValue - 1;
            // Trigger change event to update any dependent elements
            quantityInput.dispatchEvent(new Event('change', { bubbles: true }));
        }
    });

    // Increase button functionality
    increaseBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const currentValue = parseInt(quantityInput.value) || 1;
        if (currentValue < 99) {
            quantityInput.value = currentValue + 1;
            // Trigger change event to update any dependent elements
            quantityInput.dispatchEvent(new Event('change', { bubbles: true }));
        }
    });

    // Input validation and sanitization
    quantityInput.addEventListener('input', (e) => {
        let value = parseInt(e.target.value);
        
        // Handle empty or invalid input
        if (isNaN(value) || value < 1) {
            value = 1;
        } else if (value > 99) {
            value = 99;
        }
        
        // Update the input value if it was changed
        if (value !== parseInt(e.target.value)) {
            e.target.value = value;
        }
    });

    // Handle direct input changes (paste, etc.)
    quantityInput.addEventListener('change', (e) => {
        let value = parseInt(e.target.value);
        if (isNaN(value) || value < 1) {
            e.target.value = 1;
        } else if (value > 99) {
            e.target.value = 99;
        }
    });

    // Prevent non-numeric input (except for navigation keys)
    quantityInput.addEventListener('keydown', (e) => {
        // Allow: backspace, delete, tab, escape, enter, and navigation keys
        if ([8, 9, 27, 13, 46, 37, 39].indexOf(e.keyCode) !== -1 ||
            // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
            (e.keyCode === 65 && e.ctrlKey === true) ||
            (e.keyCode === 67 && e.ctrlKey === true) ||
            (e.keyCode === 86 && e.ctrlKey === true) ||
            (e.keyCode === 88 && e.ctrlKey === true)) {
            return;
        }
        
        // Allow numbers only
        if ((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105)) {
            return;
        }
        
        e.preventDefault();
    });

    console.log('Quantity controls initialized successfully');
}

// Debug function to test quantity controls
function testQuantityControls() {
    const quantityInput = document.getElementById('quantity');
    const decreaseBtn = document.getElementById('decrease-btn');
    const increaseBtn = document.getElementById('increase-btn');
    
    console.log('Testing quantity controls:');
    console.log('Quantity input:', quantityInput);
    console.log('Decrease button:', decreaseBtn);
    console.log('Increase button:', increaseBtn);
    
    if (quantityInput && decreaseBtn && increaseBtn) {
        console.log('All elements found! Quantity controls should be working.');
        
        // Test click events
        decreaseBtn.addEventListener('click', () => {
            console.log('Decrease button clicked!');
        });
        
        increaseBtn.addEventListener('click', () => {
            console.log('Increase button clicked!');
        });
        
        console.log('Test event listeners added. Check console for click events.');
    } else {
        console.error('Some elements are missing!');
    }
}

// Uncomment the line below to test quantity controls
// testQuantityControls();

function populateProductData(product, elements) {
    // Update breadcrumb
    if (elements.productCategory) {
        elements.productCategory.textContent = capitalize(product.category || 'Category');
    }
    if (elements.productName) {
        elements.productName.textContent = product.name;
    }

    // Update main product info
    if (elements.productTitle) {
        elements.productTitle.textContent = product.name;
    }
    if (elements.productMaker) {
        elements.productMaker.textContent = product.maker || 'Unknown Maker';
    }
    if (elements.productDesigner) {
        elements.productDesigner.textContent = product.designer || 'Unknown Designer';
    }
    if (elements.productPrice) {
        elements.productPrice.textContent = `$${Number(product.price).toLocaleString()}`;
    }
    if (elements.productLeadTime) {
        elements.productLeadTime.textContent = product.lead_time || 'Contact for availability';
    }
    if (elements.productCategoryDisplay) {
        elements.productCategoryDisplay.textContent = capitalize(product.category || 'Uncategorized');
    }
    if (elements.productDescriptionText) {
        elements.productDescriptionText.textContent = product.description || 'No description available.';
    }

    // Update specifications (you can extend this based on your database schema)
    if (elements.specWidth) {
        elements.specWidth.textContent = product.width || '-';
    }
    if (elements.specDepth) {
        elements.specDepth.textContent = product.depth || '-';
    }
    if (elements.specHeight) {
        elements.specHeight.textContent = product.height || '-';
    }
    if (elements.specMaterial) {
        elements.specMaterial.textContent = product.material || '-';
    }
    if (elements.specYear) {
        elements.specYear.textContent = product.year || '-';
    }

    // Setup gallery
    setupGallery(product, elements);
}

function setupGallery(product, elements) {
    // Get images array - first image is main, second is hover
    const mainImage = product.image || '/images/product/default-fallback-image.png';
    const hoverImage = product.image_hover || null;
    const images = [mainImage];
    
    console.log('=== GALLERY SETUP DEBUG ===');
    console.log('Product:', product.name);
    console.log('Product ID:', product.id);
    console.log('Main image:', mainImage);
    console.log('Hover image:', hoverImage);
    console.log('Hover image type:', typeof hoverImage);
    console.log('Hover image length:', hoverImage ? hoverImage.length : 'null');
    
    // Set main image
    if (elements.mainImage) {
        elements.mainImage.src = mainImage;
        elements.mainImage.alt = product.name;
        elements.mainImage.onerror = function() {
            this.src = '/images/product/default-fallback-image.png';
            this.onerror = null;
        };
    }

    // Set hover image only if it exists
    const hoverImageElement = document.getElementById('hover-image');
    const galleryMain = document.querySelector('.gallery-main');
    
    console.log('Hover image element found:', !!hoverImageElement);
    console.log('Gallery main element found:', !!galleryMain);
    
    if (hoverImage && hoverImageElement && galleryMain) {
        console.log('Setting up hover effect with image:', hoverImage);
        
        // Add hover image to images array for thumbnails
        images.push(hoverImage);
        
        // Set hover image source
        hoverImageElement.src = hoverImage;
        hoverImageElement.alt = product.name;
        
        // Add load event listener to debug image loading
        hoverImageElement.onload = function() {
            console.log('✅ Hover image loaded successfully:', hoverImage);
        };
        
        hoverImageElement.onerror = function() {
            console.log('❌ Hover image failed to load:', hoverImage);
            this.src = '/images/product/default-fallback-image.png';
            this.onerror = null;
        };
        
        // Enable hover effect
        galleryMain.classList.add('has-hover-image');
        console.log('✅ Added has-hover-image class to gallery');
        
        // Test if class was actually added
        setTimeout(() => {
            console.log('Gallery has hover class:', galleryMain.classList.contains('has-hover-image'));
            console.log('Hover image display style:', window.getComputedStyle(hoverImageElement).display);
            console.log('Hover image opacity:', window.getComputedStyle(hoverImageElement).opacity);
        }, 100);
        
    } else if (galleryMain) {
        // Disable hover effect if no hover image
        galleryMain.classList.remove('has-hover-image');
        console.log('❌ Removed has-hover-image class - no hover image available');
        console.log('Reason: hoverImage =', hoverImage, 'hoverImageElement =', !!hoverImageElement, 'galleryMain =', !!galleryMain);
    }

    // Create thumbnails if there are multiple images
    if (elements.galleryThumbnails && images.length > 1) {
        elements.galleryThumbnails.innerHTML = '';
        images.forEach((image, index) => {
            const thumbnail = document.createElement('div');
            thumbnail.className = `gallery-thumbnail ${index === 0 ? 'active' : ''}`;
            thumbnail.innerHTML = `<img src="${image}" alt="${product.name}" onerror="this.src='/images/product/default-fallback-image.png'; this.onerror=null;">`;
            
            thumbnail.addEventListener('click', () => {
                // Update main image
                if (elements.mainImage) {
                    elements.mainImage.src = image;
                }
                
                // Update active thumbnail
                document.querySelectorAll('.gallery-thumbnail').forEach(thumb => {
                    thumb.classList.remove('active');
                });
                thumbnail.classList.add('active');
            });
            
            elements.galleryThumbnails.appendChild(thumbnail);
        });
    } else if (elements.galleryThumbnails) {
        elements.galleryThumbnails.style.display = 'none';
    }
    
    console.log('=== END GALLERY SETUP ===');
}

function loadRelatedProducts(category, currentProductId) {
    const relatedProductsContainer = document.getElementById('related-products');
    if (!relatedProductsContainer) return;

    // Determine number of items based on screen width
    const screenWidth = window.innerWidth;
    const itemsToShow = screenWidth > 1024 ? 6 : 4;

    // Fetch related products from the same category
    fetch(`/api/products?collection=${category}`)
        .then(res => {
            if (!res.ok) throw new Error('Failed to load related products');
            return res.json();
        })
        .then(products => {
            // Filter out the current product
            const availableProducts = products.filter(product => product.id != currentProductId);
            
            if (availableProducts.length === 0) {
                relatedProductsContainer.innerHTML = '<p style="text-align: center; color: #666;">No related products found.</p>';
                return;
            }

            // Shuffle the products to get random selection
            const shuffledProducts = availableProducts.sort(() => 0.5 - Math.random());
            
            // Take the appropriate number of products based on screen size
            const relatedProducts = shuffledProducts.slice(0, itemsToShow);

            relatedProductsContainer.innerHTML = relatedProducts.map(product => `
                <a href="product.html?product=${product.id}" class="related-product">
                    <img src="${product.image || '/images/product/default-fallback-image.png'}" 
                         alt="${product.name}"
                         onerror="this.src='/images/product/default-fallback-image.png'; this.onerror=null;">
                    <h3>${product.name}</h3>
                    <p class="maker">${product.maker || 'Unknown Maker'}</p>
                    <p class="price">$${Number(product.price).toLocaleString()} USD</p>
                </a>
            `).join('');
        })
        .catch(error => {
            console.error('Error loading related products:', error);
            relatedProductsContainer.innerHTML = '<p style="text-align: center; color: #666;">Unable to load related products.</p>';
        });
}

// Add resize listener to update related products when screen size changes
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Reload related products when screen size changes
        const params = new URLSearchParams(window.location.search);
        const productId = params.get('product');
        if (productId) {
            // Get the current product's category from the page
            const categoryElement = document.getElementById('product-category-display');
            if (categoryElement) {
                const category = categoryElement.textContent.toLowerCase();
                loadRelatedProducts(category, productId);
            }
        }
    }, 250); // Debounce resize events
});

function addToCart(productId) {
    // Check if user is logged in
    if (!window.auth || !window.auth.isAuthenticated()) {
        window.auth.showLoginRequired();
        return;
    }
    
    const quantity = parseInt(document.getElementById('quantity').value) || 1;
    // TODO: Implement add to cart functionality
    alert(`Added ${quantity} item(s) to cart! (Product ID: ${productId})`);
}

function showError(message) {
    const container = document.querySelector('.product-page');
    if (container) {
        container.innerHTML = `<div class="error">${message}</div>`;
    }
}

function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Add test functionality for hover effect
document.addEventListener('DOMContentLoaded', () => {
    const testButton = document.getElementById('test-hover');
    if (testButton) {
        testButton.addEventListener('click', () => {
            const galleryMain = document.querySelector('.gallery-main');
            const hoverImage = document.getElementById('hover-image');
            
            console.log('=== TESTING HOVER EFFECT ===');
            console.log('Gallery main element:', galleryMain);
            console.log('Hover image element:', hoverImage);
            console.log('Has hover class:', galleryMain?.classList.contains('has-hover-image'));
            console.log('Hover image src:', hoverImage?.src);
            console.log('Hover image display:', window.getComputedStyle(hoverImage).display);
            console.log('Hover image opacity:', window.getComputedStyle(hoverImage).opacity);
            
            // Manually trigger hover
            if (galleryMain && hoverImage) {
                console.log('Manually triggering hover...');
                galleryMain.style.setProperty('--test-hover', '1');
                hoverImage.style.opacity = '1';
                
                setTimeout(() => {
                    hoverImage.style.opacity = '0';
                    console.log('Hover test completed');
                }, 2000);
            }
        });
    }
}); 