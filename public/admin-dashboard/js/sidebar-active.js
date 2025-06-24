document.addEventListener('DOMContentLoaded', function() {
    // Wait for sidebar to be loaded (in case of fetch)
    setTimeout(function() {
        var path = window.location.pathname.split('/').pop();
        var links = document.querySelectorAll('.sidebar-link');
        links.forEach(function(link) {
            if (link.getAttribute('href') === path) {
                link.classList.add('active');
            }
        });
    }, 100);
}); 