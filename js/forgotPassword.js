document.getElementById('forgotPasswordForm').addEventListener('submit', async function(e) {
    e.preventDefault(); // Prevent default form submission

    const email = document.getElementById('email').value;

    try {
        const response = await fetch('http://localhost:3000/forgot-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email }) // Send email to server
        });

        const result = await response.json();

        if (response.ok) {
            if (result.success) {
                alert('A password reset link has been sent to your email!');
            } else {
                alert('Error: ' + result.message);
            }
        } else {
            alert('Server error. Please try again later.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Network error. Please check your connection and try again.');
    }
});
