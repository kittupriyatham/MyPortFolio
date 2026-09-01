var MOON_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
var SUN_SVG  = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"></path></svg>';

document.addEventListener('DOMContentLoaded', function() {
    var darkModeEnabled = localStorage.getItem('darkMode') === 'enabled';

    if (darkModeEnabled) {
        document.body.classList.add('dark-mode');
    }

    updateToggleIcon(darkModeEnabled);

    var darkModeToggle = document.getElementById('dark-mode-toggle');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', function() {
            var isDarkMode = document.body.classList.toggle('dark-mode');

            if (isDarkMode) {
                localStorage.setItem('darkMode', 'enabled');
            } else {
                localStorage.setItem('darkMode', 'disabled');
            }

            updateToggleIcon(isDarkMode);
        });
    }

    function updateToggleIcon(isDarkMode) {
        var btn = document.getElementById('dark-mode-toggle');
        if (!btn) return;
        btn.innerHTML = isDarkMode ? SUN_SVG : MOON_SVG;
        btn.setAttribute('aria-label', isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode');
        btn.setAttribute('title', isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode');
    }
});
