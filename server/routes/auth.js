const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || 'placeholder-client-id');

// Register
router.post('/register', async (req, res) => {
    const { name, email, password, role, department, year } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }
        user = new User({ name, email, password, role, department, year });
        await user.save();

        const payload = { user: { id: user.id, role: user.role, email: user.email } };
        jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        const payload = { user: { id: user.id, role: user.role, email: user.email } };
        jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Google Login
router.post('/google', async (req, res) => {
    const { credential, role } = req.body;
    try {
        // Fallback for development if CLIENT_ID is not configured
        const clientId = process.env.GOOGLE_CLIENT_ID;
        let payload;

        // Check if credential is a JWT (ID Token) or an Access Token
        // JWTs have 3 parts separated by dots, Access Tokens (ya29.) might have 1 dot
        const isJwt = typeof credential === 'string' && credential.split('.').length === 3;
        
        if (isJwt) {
            // ID Token flow
            if (clientId && clientId !== 'placeholder-client-id') {
                const ticket = await client.verifyIdToken({
                    idToken: credential,
                    audience: clientId,
                });
                payload = ticket.getPayload();
            } else {
                // Warning: Development fallback without signature verification
                const base64Url = credential.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));
                payload = JSON.parse(jsonPayload);
            }
        } else {
            // Access Token flow (from useGoogleLogin custom button)
            client.setCredentials({ access_token: credential });
            const userInfoRes = await client.request({ 
                url: 'https://www.googleapis.com/oauth2/v3/userinfo' 
            });
            payload = userInfoRes.data;
        }

        const { email, name } = payload;

        if (!email.endsWith('@bitsathy.ac.in')) {
            return res.status(403).json({ message: 'Access Denied: Please use your official college email ID.' });
        }
        
        let user = await User.findOne({ email });
        
        if (!user) {
            // Auto register them securely
            const password = await bcrypt.hash(Math.random().toString(36).slice(-8), 10);
            user = new User({ 
                name, 
                email, 
                password,
                role: role || 'student',
            });
            await user.save();
        }

        const jwtPayload = { user: { id: user.id, role: user.role, email: user.email } };
        jwt.sign(jwtPayload, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
        });
    } catch (err) {
        console.error('Google Auth Error:', err.message);
        res.status(401).json({ message: 'Invalid Google Token' });
    }
});

module.exports = router;
