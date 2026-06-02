require('dotenv').config();
const express = require('express');
const cors = require('cors');
const predictionRoutes = require('./routes/prediction.routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Register API routes
app.use('/api/v1', predictionRoutes);

// Health check route
app.get('/health', (req, res) => {
    res.json({ status: 'UP', message: 'Node.js Backend is running' });
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`🚀 Estate-AI Node Backend running on port ${PORT}`);
});