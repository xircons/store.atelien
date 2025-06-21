const shopToggle = document.getElementById('shopToggle');
const navDropdown = document.getElementById('navDropdown');
const searchBtn = document.getElementById('searchBtn');
const header = document.getElementById('header');
const searchInput = document.getElementById('searchInput');
let isDropdownOpen = false;

// Toggle shop dropdown
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

// Toggle search mode
searchBtn.addEventListener('click', function() {
    if (header.classList.contains('search-mode')) {
        // Exit search mode
        header.classList.remove('search-mode');
        searchInput.value = '';
    } else {
        // Enter search mode
        header.classList.add('search-mode');
        setTimeout(() => {
            searchInput.focus();
        }, 100);
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

// Mobile menu toggle functionality
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.querySelector('.nav-menu');

if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', function() {
        navMenu.classList.toggle('mobile-active');
    });
}