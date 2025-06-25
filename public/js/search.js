// Search functionality for Atelien Store
class ProductSearch {
    constructor() {
        this.allProducts = [];
        this.filteredProducts = [];
        this.searchQuery = '';
        this.currentCollection = 'all';
        this.isSearchMode = false;
        
        this.init();
    }

    async init() {
        // Get URL parameters
        const params = new URLSearchParams(window.location.search);
        this.searchQuery = params.get('search') || '';
        this.currentCollection = params.get('collection') || 'all';
        
        // Only proceed with search functionality if there's a search query
        if (this.searchQuery) {
            // Load all products
            await this.loadAllProducts();
            
            // Apply search if query exists
            this.isSearchMode = true;
            this.performSearch(this.searchQuery);
            
            // Set up event listeners
            this.setupEventListeners();
        }
        // If no search query, let collections.js handle the display
    }

    async loadAllProducts() {
        try {
            const response = await fetch('/api/products?collection=all');
            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }
            this.allProducts = await response.json();
            console.log('Loaded', this.allProducts.length, 'products');
        } catch (error) {
            console.error('Error loading products:', error);
            this.showError('Failed to load products. Please try again.');
        }
    }

    performSearch(query) {
        if (!query || query.trim() === '') {
            this.filteredProducts = this.allProducts;
            this.displayProducts(this.filteredProducts);
            return;
        }

        const searchTerms = query.toLowerCase().trim().split(/\s+/).filter(term => term.length > 0);
        
        // Filter out very short search terms (less than 3 characters)
        const validSearchTerms = searchTerms.filter(term => term.length >= 3);
        
        // If no valid search terms, return empty results
        if (validSearchTerms.length === 0) {
            this.filteredProducts = [];
            this.displayProducts(this.filteredProducts);
            this.updateSearchResultsInfo(query);
            return;
        }
        
        // Filter products using strict AND-based keyword matching
        this.filteredProducts = this.allProducts.filter(product => {
            // ALL valid search terms must be present in at least one field
            return validSearchTerms.every(term => {
                const nameMatch = product.name && this.hasStrictTermMatch(term, product.name.toLowerCase());
                const descriptionMatch = product.description && 
                                       this.hasStrictTermMatch(term, product.description.toLowerCase());
                const makerMatch = product.maker && 
                                 this.hasStrictTermMatch(term, product.maker.toLowerCase());
                const categoryMatch = product.category && 
                                    this.hasStrictTermMatch(term, product.category.toLowerCase());
                
                return nameMatch || descriptionMatch || makerMatch || categoryMatch;
            });
        });

        console.log(`Strict AND-based search for "${validSearchTerms.join(' ')}" found ${this.filteredProducts.length} products`);
        this.displayProducts(this.filteredProducts);
        this.updateSearchResultsInfo(query);
    }

    // Check if a search term matches any word in the text with strict matching
    hasStrictTermMatch(searchTerm, text) {
        if (!text || searchTerm.length < 3) return false;
        
        // Split text into words using word boundaries
        const words = text.split(/\W+/).filter(word => word.length > 0);
        
        // Check for exact word match first (highest priority)
        if (words.includes(searchTerm)) {
            return true;
        }
        
        // Check for exact substring match (but only if search term is substantial)
        if (searchTerm.length >= 4 && text.includes(searchTerm)) {
            return true;
        }
        
        // Check for word containing the search term (but only for longer search terms)
        if (searchTerm.length >= 4 && words.some(word => word.includes(searchTerm))) {
            return true;
        }
        
        // Use fuzzy matching only for longer terms and with higher threshold
        if (searchTerm.length >= 4) {
            for (const word of words) {
                if (word.length < 3) continue; // Skip very short words
                
                const similarity = this.calculateSimilarity(searchTerm, word);
                if (similarity >= 0.8) { // Very high threshold for accuracy
                    return true;
                }
            }
        }
        
        return false;
    }

    // Calculate Levenshtein distance between two strings
    levenshteinDistance(str1, str2) {
        const matrix = [];
        
        for (let i = 0; i <= str2.length; i++) {
            matrix[i] = [i];
        }
        
        for (let j = 0; j <= str1.length; j++) {
            matrix[0][j] = j;
        }
        
        for (let i = 1; i <= str2.length; i++) {
            for (let j = 1; j <= str1.length; j++) {
                if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1, // substitution
                        matrix[i][j - 1] + 1,     // insertion
                        matrix[i - 1][j] + 1      // deletion
                    );
                }
            }
        }
        
        return matrix[str2.length][str1.length];
    }

    // Calculate similarity score between two strings (0-1)
    calculateSimilarity(str1, str2) {
        if (str1 === str2) return 1;
        if (str1.length === 0 || str2.length === 0) return 0;
        
        const distance = this.levenshteinDistance(str1, str2);
        const maxLength = Math.max(str1.length, str2.length);
        return 1 - (distance / maxLength);
    }

    // Helper method to escape special regex characters (kept for highlighting)
    escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    displayProducts(products) {
        const container = document.getElementById('products-container');
        const resultsInfo = document.getElementById('search-results-info');
        if (!container) {
            console.error('Products container not found');
            return;
        }

        if (products.length === 0) {
            // Clear the products container
            container.innerHTML = '';
            
            // Create no-results container outside products-grid
            const noResultsContainer = document.createElement('div');
            noResultsContainer.className = 'no-results-container';
            noResultsContainer.innerHTML = `
                <div class="no-results">
                    <p>No Results Found.</p>
                </div>
            `;
            
            // Insert after search results info
            if (resultsInfo && resultsInfo.nextSibling) {
                resultsInfo.parentNode.insertBefore(noResultsContainer, resultsInfo.nextSibling);
            } else if (resultsInfo) {
                resultsInfo.parentNode.appendChild(noResultsContainer);
            }
            return;
        }

        // Remove any existing no-results container
        const existingNoResults = document.querySelector('.no-results-container');
        if (existingNoResults) {
            existingNoResults.remove();
        }

        container.innerHTML = products.map(product => `
            <div class="product-card" style="cursor: pointer;">
                <img src="${product.image || '/images/product/default-fallback-image.png'}" 
                     alt="${product.name}"
                     onerror="this.src='/images/product/default-fallback-image.png'; this.onerror=null;"
                     loading="lazy">
                <div class="product-info">
                    <h3>${this.highlightSearchTerm(product.name)}</h3>
                    <p class="maker">${product.maker || 'N/A'}</p>
                    <p class="price">$${Number(product.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD</p>
                </div>
            </div>
        `).join('');

        // Add click events to product cards
        container.querySelectorAll('.product-card').forEach((card, index) => {
            card.addEventListener('click', () => {
                window.location.href = `product.html?product=${products[index].id}`;
            });
        });
    }

    highlightSearchTerm(text) {
        if (!this.searchQuery || !text) return text;
        
        const searchTerms = this.searchQuery.toLowerCase().trim().split(/\s+/).filter(term => term.length >= 3);
        let highlightedText = text;
        
        // Highlight each valid search term that matches in this text
        searchTerms.forEach(term => {
            const words = text.toLowerCase().split(/\W+/).filter(word => word.length > 0);
            const originalWords = text.split(/\W+/).filter(word => word.length > 0);
            
            // Find all matching words for this search term
            const matchingWords = [];
            
            for (let i = 0; i < words.length; i++) {
                const word = words[i];
                if (word.length < 3) continue;
                
                // Check if this word matches the search term using strict matching
                if (this.hasStrictTermMatch(term, word)) {
                    matchingWords.push(originalWords[i]);
                }
            }
            
            // Highlight all matching words
            matchingWords.forEach(matchWord => {
                const escapedWord = this.escapeRegex(matchWord);
                const regex = new RegExp(`\\b${escapedWord}\\b`, 'gi');
                highlightedText = highlightedText.replace(regex, '<mark>$&</mark>');
            });
        });
        
        return highlightedText;
    }

    updateSearchResultsInfo(query) {
        const resultsInfo = document.getElementById('search-results-info');
        if (!resultsInfo) return;

        const resultCount = this.filteredProducts.length;
        const queryText = query ? ` "${query}"` : '';
        
        resultsInfo.innerHTML = `
            <div class="search-results-header">
                <h2>Search:${queryText}</h2>
                <p>${resultCount} product${resultCount !== 1 ? 's' : ''} found</p>
            </div>
        `;
    }

    clearSearch() {
        this.searchQuery = '';
        this.isSearchMode = false;
        this.filteredProducts = this.allProducts;
        this.displayProducts(this.filteredProducts);
        
        // Update URL without search parameter
        const url = new URL(window.location);
        url.searchParams.delete('search');
        window.history.replaceState({}, '', url);
        
        // Clear search results info
        const resultsInfo = document.getElementById('search-results-info');
        if (resultsInfo) {
            resultsInfo.innerHTML = '';
        }
    }

    setupEventListeners() {
        // Real-time search input (if search input exists on this page)
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            let searchTimeout;
            
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                const query = e.target.value.trim();
                
                searchTimeout = setTimeout(() => {
                    this.performSearch(query);
                }, 300); // Debounce search for better performance
            });

            // Set initial value if search query exists
            if (this.searchQuery) {
                searchInput.value = this.searchQuery;
            }
        }

        // Handle browser back/forward buttons
        window.addEventListener('popstate', () => {
            const params = new URLSearchParams(window.location.search);
            this.searchQuery = params.get('search') || '';
            
            if (this.searchQuery) {
                this.performSearch(this.searchQuery);
            } else {
                this.clearSearch();
            }
        });
    }

    showError(message) {
        const container = document.getElementById('products-container');
        if (container) {
            container.innerHTML = `
                <div class="error-message">
                    <h3>Error</h3>
                    <p>${message}</p>
                    <button onclick="location.reload()">Try Again</button>
                </div>
            `;
        }
    }

    // Public method to perform search from external calls
    search(query) {
        this.searchQuery = query;
        this.performSearch(query);
        
        // Update URL
        const url = new URL(window.location);
        if (query) {
            url.searchParams.set('search', query);
        } else {
            url.searchParams.delete('search');
        }
        window.history.pushState({}, '', url);
    }
}

// Initialize search functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize on collections page
    if (window.location.pathname.includes('collections.html')) {
        window.productSearch = new ProductSearch();
    }
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProductSearch;
} 