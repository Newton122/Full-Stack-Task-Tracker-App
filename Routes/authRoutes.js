const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/UserModels');

const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const username = name; // Accept 'name' field from frontend

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({
            username: username || email,
            email,
            password: hashedPassword
        });

        await newUser.save();
            res.status(201).json({ message: 'User registered successfully', user: { id: newUser._id, email: newUser.email, username: newUser.username } });
        } catch (error) {
            console.error('Error registering user:', error);
            // Handle Mongo duplicate key error (unique fields like email or username)
            if (error && error.code === 11000) {
                const dupKey = Object.keys(error.keyValue || {})[0] || 'field';
                return res.status(400).json({ error: `The ${dupKey} is already taken` });
            }
            return res.status(500).json({ error: 'Server error' });
        }
});

// Login a user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        // Compare the password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        // Create a JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });

        res.status(200).json({ message: 'Login successful', token, user: { id: user._id, email: user.email, username: user.username } });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;