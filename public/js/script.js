document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.getElementById('searchBtn');
    const header = document.getElementById('header');
    const searchInput = document.getElementById('searchInput');
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.querySelector('.nav-menu');
    const navRight = document.querySelector('.nav-right');

    searchBtn.addEventListener('click', () => {
        header.classList.toggle('search-mode');
        if (header.classList.contains('search-mode')) {
            searchInput.focus();
        }
    });

    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navRight.classList.toggle('active');
    });

    // Close mobile menu when clicking a nav item
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navRight.classList.remove('active');
        });
    });

    // Close search mode and mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!header.contains(e.target) && !navMenu.contains(e.target) && !navRight.contains(e.target)) {
            header.classList.remove('search-mode');
            navMenu.classList.remove('active');
            navRight.classList.remove('active');
        }
    });
});