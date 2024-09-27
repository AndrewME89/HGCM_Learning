// Login form submission
document.getElementById('loginForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent default form submission

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Make a POST request to the server
    const response = await fetch('http://localhost:3000/login', {  // Correct URL for the login route
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password }) // Send credentials
    });

    const result = await response.json(); // Parse the response

    if (result.success) {
        // Store the user's role in localStorage
        localStorage.setItem('userRole', result.role);

        // Redirect based on user role
        if (result.role === 'DM') {
            window.location.href = 'home_DM.html';
        } else if (result.role === 'GSA') {
            window.location.href = 'home_GSA.html';
        } else {
            alert('Role not recognized.');
        }
    } else {
        alert('Login failed: ' + result.message); // Show error message
    }
});
