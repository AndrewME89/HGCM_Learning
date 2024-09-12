const toggleButton = document.getElementById('dark-mode-toggle');
const body = document.body;

// Check if dark mode was previously enabled
if (localStorage.getItem('dark-mode') === 'enabled') {
  body.classList.add('dark-mode');
}

toggleButton.addEventListener('click', () => {
  body.classList.toggle('dark-mode');
  
  // Save the user's preference
  if (body.classList.contains('dark-mode')) {
    localStorage.setItem('dark-mode', 'enabled');
  } else {
    localStorage.setItem('dark-mode', 'disabled');
  }
});
