const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
    studentName: { type: String, required: true },
    studentEmail: { type: String, required: true }, // Verified from Auth
    category: { type: String, required: true },
    subCategory: { type: String, required: true },
    ratings: {
        type: Map,
        of: Number // e.g., "Teaching Quality": 5
    },
    questions: {
        type: Map,
        of: String // e.g., "What did you like": "Everything"
    },
    overallRating: { type: Number, required: true },
    status: {
        type: String,
        enum: ['Submitted', 'Under Progress', 'Reviewed'],
        default: 'Submitted'
    },
    submittedAt: { type: Date, default: Date.now }
});

// Indexes for faster querying
FeedbackSchema.index({ studentEmail: 1 });
FeedbackSchema.index({ status: 1 });
FeedbackSchema.index({ category: 1 });
FeedbackSchema.index({ submittedAt: -1 });

module.exports = mongoose.model('Feedback', FeedbackSchema);
