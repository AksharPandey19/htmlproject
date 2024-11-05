const keys = document.querySelectorAll('.key');

// Function to highlight the key when the corresponding physical key is pressed
document.addEventListener('keydown', (event) => {
    const key = event.key.toUpperCase(); // Get the pressed key and convert to uppercase
    keys.forEach(k => {
        // Check if the key text matches the pressed key
        if (k.textContent === key) {
            // Remove highlight from all keys
            keys.forEach(k => k.classList.remove('highlight'));
            // Highlight the corresponding key
            k.classList.add('highlight');
        }
    });
});

// Optional: Remove highlight on keyup
document.addEventListener('keyup', () => {
    keys.forEach(k => k.classList.remove('highlight'));
});
