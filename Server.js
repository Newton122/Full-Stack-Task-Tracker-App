const express = require('express');
const cors = require('cors');


const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

const routes = require('./Routes/ToDoRoutes');
const authRoutes = require('./Routes/authRoutes');

// Middleware setup BEFORE routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Routes
app.use('/api/todo', routes); // prefix todo routes with /api/todo
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});


mongoose.connect(process.env.MONGODB_URL)
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.log(err));
