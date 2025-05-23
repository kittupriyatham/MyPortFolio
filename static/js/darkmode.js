// Dark mode toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check for saved dark mode preference
    const darkModeEnabled = localStorage.getItem('darkMode') === 'enabled';
    
    // Apply dark mode if it was previously enabled
    if (darkModeEnabled) {
        document.body.classList.add('dark-mode');
        updateToggleIcon(true);
    }
    
    // Add click event to dark mode toggle button
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', function() {
            // Toggle dark mode class on body
            const isDarkMode = document.body.classList.toggle('dark-mode');
            
            // Update localStorage
            if (isDarkMode) {
                localStorage.setItem('darkMode', 'enabled');
            } else {
                localStorage.setItem('darkMode', 'disabled');
            }
            
            // Update toggle icon
            updateToggleIcon(isDarkMode);
        });
    }
    
    // Function to update the toggle icon based on dark mode state
    function updateToggleIcon(isDarkMode) {
        const darkModeToggle = document.getElementById('dark-mode-toggle');
        if (darkModeToggle) {
            if (isDarkMode) {
                darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>'; // Sun icon for dark mode (to switch to light)
            } else {
                darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>'; // Moon icon for light mode (to switch to dark)
            }
        }
    }
    
    // Initialize the toggle icon based on current state
    updateToggleIcon(document.body.classList.contains('dark-mode'));
});