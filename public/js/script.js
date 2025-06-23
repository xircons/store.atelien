// Initialize authentication system
if (typeof Auth !== 'undefined' && !window.auth) {
    window.auth = new Auth();
}

// Video initialization for index page
function initializeVideo() {
    const video = document.querySelector('video');
    if (video) {
        console.log('Initializing video...');
        
        // Ensure video loads and plays
        video.load();
        
        // Set up event listeners for video
        video.addEventListener('loadeddata', () => {
            console.log('Video data loaded');
            video.play().catch(error => {
                console.log('Autoplay prevented:', error);
                // Try to play again on user interaction
                document.addEventListener('click', () => {
                    video.play().catch(e => console.log('Play failed:', e));
                }, { once: true });
            });
        });
        
        video.addEventListener('error', (e) => {
            console.error('Video error:', e);
        });
        
        video.addEventListener('canplay', () => {
            console.log('Video can play');
        });
        
        // Force play attempt
        setTimeout(() => {
            video.play().catch(error => {
                console.log('Initial autoplay attempt failed:', error);
            });
        }, 100);
    }
}

// Check if we're coming from checkout
function checkForCheckoutRedirect() {
    const urlParams = new URLSearchParams(window.location.search);
    const fromCheckout = urlParams.get('fromCheckout');
    
    if (fromCheckout === 'true') {
        console.log('Detected checkout redirect, forcing video initialization');
        // Remove the parameter from URL
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
        
        // Force video initialization with a longer delay
        setTimeout(() => {
            const video = document.querySelector('video');
            if (video) {
                video.load();
                video.play().catch(error => {
                    console.log('Checkout redirect video play failed:', error);
                });
            }
        }, 500);
    }
}

// Initialize video when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initializeVideo();
        checkForCheckoutRedirect();
    });
} else {
    // DOM is already ready
    initializeVideo();
    checkForCheckoutRedirect();
}

// Also initialize video when page becomes visible (for when navigating back)
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        const video = document.querySelector('video');
        if (video && video.paused) {
            console.log('Page became visible, attempting to play video');
            video.play().catch(error => {
                console.log('Visibility change play failed:', error);
            });
        }
    }
});

// Initialize video on page focus (for when returning from checkout)
window.addEventListener('focus', () => {
    const video = document.querySelector('video');
    if (video && video.paused) {
        console.log('Window focused, attempting to play video');
        video.play().catch(error => {
            console.log('Focus play failed:', error);
        });
    }
});

// Handle page show event (when navigating back to the page)
window.addEventListener('pageshow', (event) => {
    // Check if this is a back-forward navigation
    if (event.persisted) {
        console.log('Page restored from back-forward cache, reinitializing video');
        setTimeout(initializeVideo, 100);
    }
});

// Handle beforeunload to ensure video is properly handled
window.addEventListener('beforeunload', () => {
    const video = document.querySelector('video');
    if (video) {
        video.pause();
    }
});

// Additional initialization for when page becomes visible again
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        setTimeout(() => {
            const video = document.querySelector('video');
            if (video && video.paused) {
                console.log('Page became visible, attempting to play video');
                video.load();
                video.play().catch(error => {
                    console.log('Visibility change play failed:', error);
                });
            }
        }, 50);
    }
});

const shopToggle = document.getElementById('shopToggle');
const navDropdown = document.getElementById('navDropdown');
const searchBtn = document.getElementById('searchBtn');
const header = document.getElementById('header');
const searchInput = document.getElementById('searchInput');
let isDropdownOpen = false;

// Toggle shop dropdown
if (shopToggle && navDropdown) {
    shopToggle.addEventListener('click', function(e) {
        e.preventDefault();
        
        if (isDropdownOpen) {
            // Close dropdown
            navDropdown.classList.remove('show');
            shopToggle.classList.remove('active');
            isDropdownOpen = false;
        } else {
            // Open dropdown
            navDropdown.classList.add('show');
            shopToggle.classList.add('active');
            isDropdownOpen = true;
        }
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!shopToggle.contains(e.target) && !navDropdown.contains(e.target)) {
            navDropdown.classList.remove('show');
            shopToggle.classList.remove('active');
            isDropdownOpen = false;
        }
    });
}

// Enhanced search button/input logic
if (searchBtn && header && searchInput) {
    searchBtn.addEventListener('click', function () {
        if (header.classList.contains('search-mode')) {
            // If already in search mode and input is not empty, perform search
            const query = searchInput.value.trim();
            if (query) {
                window.location.href = `collections.html?search=${encodeURIComponent(query)}`;
            } else {
                // If input is empty, just close search mode
                header.classList.remove('search-mode');
                searchInput.value = '';
            }
        } else {
            // Enter search mode
            header.classList.add('search-mode');
            setTimeout(() => {
                searchInput.focus();
            }, 100);
        }
    });

    // Listen for Enter key in search input
    searchInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            const query = searchInput.value.trim();
            if (query) {
                window.location.href = `collections.html?search=${encodeURIComponent(query)}`;
            } else {
                // If input is empty, just close search mode
                header.classList.remove('search-mode');
                searchInput.value = '';
            }
        }
    });

    // Close search mode when pressing Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && header.classList.contains('search-mode')) {
            header.classList.remove('search-mode');
            searchInput.value = '';
        }
    });

    // Close search mode when clicking outside
    document.addEventListener('click', function(e) {
        if (header.classList.contains('search-mode') && 
            !searchBtn.contains(e.target) && 
            !searchInput.contains(e.target)) {
            header.classList.remove('search-mode');
            searchInput.value = '';
        }
    });
}

// Mobile menu toggle functionality
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.querySelector('.nav-menu');

if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', function() {
        navMenu.classList.toggle('mobile-active');
    });
}