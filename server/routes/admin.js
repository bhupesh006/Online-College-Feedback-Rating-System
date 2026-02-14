const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Middleware to check if user is admin
const adminAuth = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin only.' });
        }
        next();
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// GET Dashboard Stats
router.get('/stats', auth, adminAuth, async (req, res) => {
    try {
        const totalFeedback = await Feedback.countDocuments();

        // Count bad feedbacks (assuming overallRating < 3 is bad)
        // Adjust logic as per user requirement.
        // Let's assume 'Action Required' if rating < 3
        const pendingActions = await Feedback.countDocuments({ overallRating: { $lt: 3 } });

        // Category breakdown
        const categoryStats = await Feedback.aggregate([
            { $group: { _id: "$category", count: { $sum: 1 } } }
        ]);

        // Calculate average rating per category
        const categoryRatings = await Feedback.aggregate([
            { $group: { _id: "$category", avgRating: { $avg: "$overallRating" } } },
            { $sort: { avgRating: -1 } }
        ]);

        const topRated = categoryRatings.length > 0 ? { name: categoryRatings[0]._id, rating: categoryRatings[0].avgRating.toFixed(1) } : { name: 'N/A', rating: 0 };
        const lowRated = categoryRatings.length > 0 ? { name: categoryRatings[categoryRatings.length - 1]._id, rating: categoryRatings[categoryRatings.length - 1].avgRating.toFixed(1) } : { name: 'N/A', rating: 0 };

        // Calculate average overall rating
        const avgRatingDocs = await Feedback.aggregate([
            { $group: { _id: null, avg: { $avg: "$overallRating" } } }
        ]);
        const averageRating = avgRatingDocs.length > 0 ? avgRatingDocs[0].avg.toFixed(1) : 0;

        res.json({
            totalFeedback,
            averageRating,
            pendingActions,
            categoryStats,
            topRated,
            lowRated
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// GET All Feedback (For Reports)
router.get('/all-feedback', auth, adminAuth, async (req, res) => {
    try {
        const feedback = await Feedback.find().sort({ submittedAt: -1 });
        res.json(feedback);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// GET Analytics Data
router.get('/analytics', auth, adminAuth, async (req, res) => {
    try {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
        sixMonthsAgo.setDate(1); // Start of month

        const feedbacks = await Feedback.find({ submittedAt: { $gte: sixMonthsAgo } });

        // Helper to format date as "Mon" (e.g., "Jan")
        const getMonthLabel = (date) => date.toLocaleString('default', { month: 'short' });

        const months = [];
        for (let i = 0; i < 6; i++) {
            const d = new Date(sixMonthsAgo);
            d.setMonth(d.getMonth() + i);
            months.push(getMonthLabel(d));
        }

        // Initialize maps
        const ratingsMap = {};
        const countMap = {};
        months.forEach(m => {
            ratingsMap[m] = { sum: 0, count: 0 };
            countMap[m] = 0;
        });

        feedbacks.forEach(f => {
            const m = getMonthLabel(f.submittedAt);
            if (ratingsMap[m]) {
                ratingsMap[m].sum += f.overallRating;
                ratingsMap[m].count++;
                countMap[m]++;
            }
        });

        const ratingTrend = months.map(m => ratingsMap[m].count > 0 ? (ratingsMap[m].sum / ratingsMap[m].count).toFixed(1) : 0);
        const countTrend = months.map(m => countMap[m]);

        // Sentiment
        const allFeedbacks = await Feedback.find(); // Or just reuse limited range if specific to time, but sentiment usually overall? Let's use overall for "Overview"
        const total = allFeedbacks.length;
        const positive = allFeedbacks.filter(f => f.overallRating >= 4).length;
        const neutral = allFeedbacks.filter(f => f.overallRating === 3).length;
        const negative = allFeedbacks.filter(f => f.overallRating < 3).length;

        const sentiment = {
            positive: total ? Math.round((positive / total) * 100) : 0,
            neutral: total ? Math.round((neutral / total) * 100) : 0,
            negative: total ? Math.round((negative / total) * 100) : 0
        };

        res.json({
            ratingTrend: { labels: months, data: ratingTrend },
            countTrend: { labels: months, data: countTrend },
            sentiment
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
