const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

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
    users.push({ username, password, email, role }); // Save role

    // Save users to JSON file
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
    
    console.log(users); // Log the users array
    res.json({ success: true, message: 'User registered successfully!' });
});

// GET endpoint for users
app.get('/users', (req, res) => {
    res.json(users); // Return the users array as JSON
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`); // Backticks for interpolation
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    console.log(`Login attempt - Username: ${username}, Password: ${password}`); // Log the attempt

    const user = users.find(u => 
        u.username === username && u.password === password
    );

    if (user) {
        res.json({ success: true, role: user.role });
    } else {
        res.json({ success: false, message: 'Invalid username or password' });
    }
});
