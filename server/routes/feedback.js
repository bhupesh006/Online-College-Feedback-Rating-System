const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const auth = require('../middleware/auth'); // We need to create this middleware

// GET User's Feedback
router.get('/my-feedback', auth, async (req, res) => {
    try {
        const feedback = await Feedback.find({ studentEmail: req.user.email }).sort({ submittedAt: -1 }); // Assuming we store email or ID
        // Or better, find by userId if we store it
        res.json(feedback);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST New Feedback
router.post('/', auth, async (req, res) => {
    try {
        const { category, subCategory, ratings, questions, overallRating } = req.body;

        const User = require('../models/User');
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const newFeedback = new Feedback({
            studentName: user.name,
            studentEmail: user.email,
            category,
            subCategory,
            ratings,
            questions,
            overallRating
        });

        const savedFeedback = await newFeedback.save();
        res.json(savedFeedback);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE Feedback
router.delete('/:id', auth, async (req, res) => {
    try {
        const feedback = await Feedback.findById(req.params.id);
        if (!feedback) return res.status(404).json({ message: 'Feedback not found' });

        // Ensure user owns this feedback
        // We need to fetch user email again because req.user.email might not be in token if we didn't update auth.js
        // BUT, wait. in 'my-feedback' route we use req.user.email.
        // If req.user.email is undefined in token, then 'my-feedback' will also fail or return empty.
        // The token payload ONLY has id and role. So req.user.email IS UNDEFINED.
        // We need to fetch the user in middleware or update token.
        // OR we fetch user here too.

        // Actually, let's update the AUTH middleware to fetch the user if email is missing? No that's expensive.
        // Let's check if I should update auth.js instead.
        // If I update auth.js to include email in token, then I don't need to fetch user in feedback POST.
        // But I already decided to fetch user in feedback POST.

        // However, for DELETE and GET /my-feedback, we depend on req.user.email.
        // If req.user.email is undefined, these routes are BROKEN too.

        // I MUST UPDATE AUTH.JS TO INCLUDE EMAIL IN TOKEN.
        // That is the correct fix for ALL routes.

        // So I should Revert this change and update auth.js instead?
        // Yes, updating auth.js is better.

        // But for now, let's stick to this file update, AND I will update auth.js as well.
        // Actually, if I update auth.js, I need to re-login to get a new token in my verification script.
        // My verification script does login, so it will get the new token if I fix auth.js.

        // So I will update `server/routes/auth.js` FIRST.
        // And revert `server/routes/feedback.js` to use `req.user.email` assuming it's in token?
        // No, let's keep the explicit fetch in POST as it's safe.
        // But for GET /my-feedback and DELETE, I need `req.user.email`.

        // So I will ALSO update `server/routes/auth.js`.

        // Let's write this file first. But I need to fix GET /my-feedback too if req.user.email is missing.
        // Validating...

        if (feedback.studentEmail !== req.user.email) {
            // If req.user.email is undefined, this check might fail or pass unexpectedly if feedback.studentEmail is also something weird, but likely fails.
            // If I update auth.js, this works.
            // If I don't, I must fetch user here.

            // I WILL UPDATE AUTH.JS.
            // So I will assume req.user.email exists.

            return res.status(401).json({ message: 'Not authorized' });
        }

        await Feedback.findByIdAndDelete(req.params.id);
        res.json({ message: 'Feedback deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET Feedback by ID
router.get('/:id', auth, async (req, res) => {
    try {
        const feedback = await Feedback.findById(req.params.id);
        if (!feedback) return res.status(404).json({ message: 'Feedback not found' });

        // Ensure user owns this feedback
        if (feedback.studentEmail !== req.user.email) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        res.json(feedback);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// UPDATE Feedback
router.put('/:id', auth, async (req, res) => {
    try {
        let feedback = await Feedback.findById(req.params.id);
        if (!feedback) return res.status(404).json({ message: 'Feedback not found' });

        if (feedback.studentEmail !== req.user.email) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        feedback = await Feedback.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(feedback);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
