import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import cron from 'node-cron';
import authRoutes from './routes/auth.js';
import habitRoutes from './routes/habits.js';
import adminRoutes from './routes/admin.js';
// Removed: googleAuthRoutes import (because we are defining it in this file)

// NEW: Import Google Auth libraries using 'import' syntax
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

// MongoDB Connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI); // Removed deprecated options
        console.log('✅ MongoDB Connected Successfully');
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error.message);
        process.exit(1);
    }
};

// Daily streak reset job
cron.schedule('0 0 * * *', async () => {
    console.log('Running daily streak check...');
});

// Start Server Logic
const startServer = async () => {
    await connectDB();

    // Initialize Google Client
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

    // Google Login Route
    app.post('/api/auth/google', async (req, res) => {
        const { token } = req.body;

        try {
            // 1. Verify the token with Google
            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: process.env.GOOGLE_CLIENT_ID,
            });

            // 2. Get User Info
            const payload = ticket.getPayload();
            const { email, name, picture } = payload;

            // 3. User Logic (Placeholder)
            // Check if user exists, create if not...

            // 4. Create Session Token
            const userToken = jwt.sign(
                { email, name, picture },
                process.env.JWT_SECRET || 'mysecret',
                { expiresIn: '1h' }
            );

            res.status(200).json({
                message: "Login successful",
                token: userToken,
                user: { name, email, picture }
            });

        } catch (error) {
            console.error("Google Auth Error:", error);
            res.status(401).json({ message: "Invalid Google Token" });
        }
    });

    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`🔗 API: http://localhost:${PORT}/api`);
    });
};

startServer();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
    process.exit(1);
});