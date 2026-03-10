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

        // Student User 1
        const student1 = new User({
            name: 'Abishek',
            email: 'abishek@college.edu',
            password: 'student123',
            role: 'student',
            department: 'Computer Science',
            year: '3rd Year'
        });

        // Student User 2
        const student2 = new User({
            name: 'Bhupesh',
            email: 'bhupesh@college.edu',
            password: 'student123',
            role: 'student',
            department: 'Computer Science',
            year: '3rd Year'
        });


        await admin.save();
        await student1.save();
        await student2.save();

        console.log('Users Seeded Successfully');
        console.log('Admin: admin@college.edu / admin123');
        console.log('Students: abishek@college.edu, bhupesh@college.edu / student123');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedUsers();
