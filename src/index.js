const express = require('express');
// We need uuid to generate unique IDs as required by the assignment
const { v4: uuidv4 } = require('uuid');

const app = express();

// Middleware: This is CRITICAL. It allows Express to read JSON data sent in the request body (POST/PUT)
app.use(express.json());

// In-memory storage (as required by the assignment)
let users = [];

// ==================================================================
// 1. Create a User
// POST /users
// ==================================================================
app.post('/users', (req, res) => {
    const { name, email } = req.body;

    // Requirement: Returns 400 Bad Request if name or email is missing.
    if (!name || !email) {
        return res.status(400).json({ error: 'Both name and email are required.' });
    }

    const newUser = {
        id: uuidv4(), // Requirement: The id must be a unique string.
        name: name,
        email: email
    };

    users.push(newUser);

    // Requirement: Response (201 Created) with the new user object
    res.status(201).json(newUser);
});

// ==================================================================
// 2. Retrieve a User
// GET /users/:id
// ==================================================================
app.get('/users/:id', (req, res) => {
    const { id } = req.params;

    // Find the user in our array
    const user = users.find(u => u.id === id);

    // Requirement: Returns 404 Not Found if the user ID does not exist.
    if (!user) {
        return res.status(404).json({ error: 'User not found.' });
    }

    // Requirement: Response (200 OK) with the user object
    res.status(200).json(user);
});

// ==================================================================
// 3. Update a User
// PUT /users/:id
// ==================================================================
app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;

    // Requirement: Returns 400 Bad Request if name or email is missing.
    if (!name || !email) {
        return res.status(400).json({ error: 'Both name and email are required for update.' });
    }

    // Find the index of the user we want to update
    const userIndex = users.findIndex(u => u.id === id);

    // Requirement: Returns 404 Not Found if the user ID does not exist.
    if (userIndex === -1) {
        return res.status(404).json({ error: 'User not found.' });
    }

    // Update the user at that index, keeping the original ID but updating name/email
    users[userIndex] = {
        id: id,
        name: name,
        email: email
    };

    // Requirement: Response (200 OK) with the updated user object
    res.status(200).json(users[userIndex]);
});

// ==================================================================
// 4. Delete a User
// DELETE /users/:id
// ==================================================================
app.delete('/users/:id', (req, res) => {
    const { id } = req.params;

    // Find the index of the user we want to delete
    const userIndex = users.findIndex(u => u.id === id);

    // Requirement: Returns 404 Not Found if the user ID does not exist.
    if (userIndex === -1) {
        return res.status(404).json({ error: 'User not found.' });
    }

    // Remove the user from the array
    users.splice(userIndex, 1);

    // Requirement: Response (204 No Content). No response body is returned.
    res.status(204).send();
});

// Export the app so it can be used by the tests and the server start script
module.exports = app;