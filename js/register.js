// Registration form submission
document.getElementById('registrationForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const newUsername = document.getElementById('newUsername').value;
    const newPassword = document.getElementById('newPassword').value;
    const newEmail = document.getElementById('newEmail').value;
    const newRole = document.getElementById('newRole').value; // Get selected role

    console.log('Registration form submitted');
    console.log(`New User Data - Username: ${newUsername}, Email: ${newEmail}, Role: ${newRole}`);

    fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: newUsername, password: newPassword, email: newEmail, role: newRole }) // Include role
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Registration successful!');
            // Optionally, redirect to login page
            window.location.href = 'index.html';
        } else {
            alert('Registration failed: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

