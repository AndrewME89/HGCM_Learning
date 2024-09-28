document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    // Set the token value in the hidden input field
    document.getElementById('token').value = token;

    document.getElementById('resetPasswordForm').addEventListener('submit', async function (e) {
        e.preventDefault(); // Prevent default form submission

        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const token = document.getElementById('token').value;

        if (newPassword !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        const response = await fetch('http://localhost:3000/reset-password', { // Your server endpoint
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token, newPassword }) // Send token and new password to the server
        });

        const result = await response.json();

        if (result.success) {
            alert('Your password has been reset successfully!');
            window.location.href = 'index.html'; // Redirect to login page or wherever you want
        } else {
            alert('Error: ' + result.message);
        }
    });
});
