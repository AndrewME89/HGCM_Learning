const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto'); // For generating tokens
const nodemailer = require('nodemailer'); // For sending emails
const bcrypt = require('bcrypt'); // For password hashing

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Serve static files from the root directory
app.use(express.static(path.join(__dirname, '..'))); // Serve from the parent directory

// Load users from JSON file at startup
const usersFilePath = path.join(__dirname, 'users.json'); // Ensure this path is correct
let users = [];

if (fs.existsSync(usersFilePath)) {
    const fileData = fs.readFileSync(usersFilePath);
    users = JSON.parse(fileData);
    console.log(users); // Log the users array to check loaded users
}

// Registration endpoint
app.post('/register', (req, res) => {
    const { username, password, email, role } = req.body; // Include role
    const hashedPassword = bcrypt.hashSync(password, 10); // Hash the password before storing
    users.push({ username, password: hashedPassword, email, role }); // Save role

    // Save users to JSON file
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));

    console.log(users); // Log the users array
    res.json({ success: true, message: 'User registered successfully!' });
});

// GET endpoint for users
app.get('/users', (req, res) => {
    res.json(users); // Return the users array as JSON
});

// Login endpoint
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    console.log(`Login attempt - Username: ${username}, Password: ${password}`); // Log the attempt

    const user = users.find(u => u.username === username);
    
    // Check if user exists and if the password matches
    if (user && bcrypt.compareSync(password, user.password)) {
        res.json({ success: true, role: user.role });
    } else {
        res.json({ success: false, message: 'Invalid username or password' });
    }
});

// Set up nodemailer transporter (you may need to configure this based on your email provider)
const transporter = nodemailer.createTransport({
    service: 'Gmail', // Use your email service
    auth: {
        user: 'your-email@gmail.com', // Your email
        pass: 'your-email-password' // Your email password
    }
});

// Forgot password endpoint
app.post('/forgot-password', (req, res) => {
    const { email } = req.body;
    const user = users.find(u => u.email === email);

    if (!user) {
        return res.json({ success: false, message: 'No user found with this email.' });
    }

    // Generate a reset token and expiration
    const token = crypto.randomBytes(20).toString('hex'); // Create a random token
    user.resetToken = token;
    user.resetTokenExpires = Date.now() + 3600000; // Token valid for 1 hour

    // Save updated user list back to the JSON file
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));

    // Send email with the reset link
    const resetLink = `http://localhost:3000/resetPword.html?token=${token}`; // Link to resetPword.html

    const mailOptions = {
        from: 'your-email@gmail.com', // Sender address
        to: email, // List of recipients
        subject: 'Password Reset', // Subject line
        text: `You requested a password reset. Click the following link to reset your password: ${resetLink}` // Plain text body
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return res.json({ success: false, message: 'Error sending email. Please try again later.' });
        }
        res.json({ success: true, message: 'A password reset link has been sent to your email!' });
    });
});

// Reset password endpoint
app.post('/reset-password', async (req, res) => {
    const { token, newPassword } = req.body;

    // Find user by token and ensure it has not expired
    const user = users.find(u => 
        u.resetToken === token && u.resetTokenExpires > Date.now()
    );

    if (!user) {
        return res.json({ success: false, message: 'Invalid or expired token.' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword; // Update user's password

    // Remove token and expiration
    user.resetToken = undefined;
    user.resetTokenExpires = undefined;

    // Save updated user list back to the JSON file
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));

    res.json({ success: true, message: 'Password has been reset successfully!' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`); // Backticks for interpolation
});
