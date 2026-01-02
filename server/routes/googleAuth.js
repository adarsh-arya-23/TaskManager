import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// Google OAuth login endpoint
router.post('/google', async (req, res) => {
    try {
        const { email, name, googleId, picture } = req.body;

        if (!email || !googleId) {
            return res.status(400).json({ message: 'Email and Google ID are required' });
        }

        // Check if user exists
        let user = await User.findOne({ email });

        if (user) {
            // User exists - update Google ID if not set
            if (!user.googleId) {
                user.googleId = googleId;
                user.profilePicture = picture;
                await user.save();
            }
        } else {
            // Create new user
            user = new User({
                username: name || email.split('@')[0],
                email,
                googleId,
                profilePicture: picture,
                password: 'google-oauth-' + Math.random().toString(36) // Random password (not used)
            });
            await user.save();
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            token,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                totalXP: user.totalXP,
                level: user.level,
                badges: user.badges,
                profilePicture: user.profilePicture
            }
        });
    } catch (error) {
        console.error('Google OAuth error:', error);
        res.status(500).json({ message: 'Server error during Google authentication' });
    }
});

export default router;
