require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const { apiLimiter } = require('./middleware/rateLimiter');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet({ crossOriginResourcePolicy: false })); // Security headers without blocking local client
app.use(cors());
app.use(express.json());
app.use('/api/', apiLimiter); // Apply general rate limit to all /api/ roads

// Database Connection
// For now, using a local mock connection or allow user to provide URI
// If no URI, we might need a fallback or just log error.
// Assuming user might want a local instance or Atlas.
// Putting a placeholder URI.
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/feedback_portal';

// Connection reuse optimizations for serverless
mongoose.connect(MONGO_URI, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
})
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB Connection Error:', err));

// Routes Placeholder
app.get('/', (req, res) => {
    res.send('Student Portal API is Running');
});

// Import Routes (will create these next)
const authRoutes = require('./routes/auth');
const feedbackRoutes = require('./routes/feedback');
const adminRoutes = require('./routes/admin');

app.use('/api/auth', authRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/admin', adminRoutes);

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
