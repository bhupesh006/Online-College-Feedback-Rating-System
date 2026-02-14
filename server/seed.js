const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/feedback_portal';

mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => {
        console.error(err);
        process.exit(1);
    });

const seedUsers = async () => {
    try {
        await User.deleteMany({});

        // User model handles hashing in pre-save hook, so we pass plain text

        // Admin User
        const admin = new User({
            name: 'Admin User',
            email: 'admin@college.edu',
            password: 'admin123',
            role: 'admin',
            department: 'Administration',
            year: 'N/A'
        });

        // Student User
        const student = new User({
            name: 'John Doe',
            email: 'student@college.edu',
            password: 'student123',
            role: 'student',
            department: 'Computer Science',
            year: '3rd Year'
        });

        await admin.save();
        await student.save();

        console.log('Users Seeded Successfully');
        console.log('Admin: admin@college.edu / admin123');
        console.log('Student: student@college.edu / student123');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedUsers();
