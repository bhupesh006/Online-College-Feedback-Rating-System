const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/feedback_portal';

mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => {
        console.error(err);
        process.exit(1);
    });

const testLogin = async () => {
    try {
        const email = 'student@college.edu';
        const password = 'student123';

        const user = await User.findOne({ email });
        if (!user) {
            console.log('User not found in DB');
            process.exit(1);
        }
        console.log('User found:', user.email);
        console.log('Stored Hash:', user.password);

        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Password Match Result:', isMatch);

        if (isMatch) {
            console.log('LOGIN SUCCESSFUL');
        } else {
            console.log('LOGIN FAILED - Hash mismatch');
        }
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

testLogin();
