import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import User from '../models/User.js';
import Habit from '../models/Habit.js';
import DailyLog from '../models/DailyLog.js';

const router = express.Router();

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Admin only.' });
    }
};

// Get all users (admin only)
router.get('/users', authenticateToken, isAdmin, async (req, res) => {
    try {
        const users = await User.find()
            .select('-password')
            .sort({ createdAt: -1 });

        res.json(users);
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get platform statistics (admin only)
router.get('/stats', authenticateToken, isAdmin, async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalHabits = await Habit.countDocuments();
        const totalLogs = await DailyLog.countDocuments();
        const completedLogs = await DailyLog.countDocuments({ completed: true });

        // Get users registered in last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const newUsers = await User.countDocuments({ createdAt: { $gte: sevenDaysAgo } });

        // Get active users (users with logs in last 7 days)
        const activeUserIds = await DailyLog.distinct('userId', {
            date: { $gte: sevenDaysAgo.toISOString().split('T')[0] }
        });
        const activeUsers = activeUserIds.length;

        // Top habits by category
        const habitsByCategory = await Habit.aggregate([
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]);

        // Average completion rate
        const completionRate = totalLogs > 0 ? ((completedLogs / totalLogs) * 100).toFixed(1) : 0;

        res.json({
            totalUsers,
            totalHabits,
            totalLogs,
            completedLogs,
            completionRate,
            newUsers,
            activeUsers,
            habitsByCategory
        });
    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get user activity details (admin only)
router.get('/users/:userId/activity', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const habits = await Habit.find({ userId });
        const allLogs = await DailyLog.find({ userId }).sort({ date: -1 });
        const recentLogs = allLogs.slice(0, 50);

        const totalCompletions = allLogs.filter(log => log.completed).length;
        const completionRate = allLogs.length > 0 ? ((totalCompletions / allLogs.length) * 100).toFixed(1) : 0;

        res.json({
            user,
            habits,
            recentLogs,
            allLogs, // Added for export
            stats: {
                totalHabits: habits.length,
                totalLogs: allLogs.length,
                completedLogs: totalCompletions,
                completionRate
            }
        });
    } catch (error) {
        console.error('Get user activity error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update user details (admin only)
router.put('/users/:userId', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { userId } = req.params;
        const { username, email, role, level, totalXP } = req.body;

        const user = await User.findByIdAndUpdate(
            userId,
            { username, email, role, level, totalXP },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update user role (legacy - kept for compatibility)
router.put('/users/:userId/role', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { userId } = req.params;
        const { role } = req.body;

        if (!['user', 'admin'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role' });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { role },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('Update role error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete user (admin only)
router.delete('/users/:userId', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { userId } = req.params;

        // Delete user's habits and logs as well
        await Promise.all([
            User.findByIdAndDelete(userId),
            Habit.deleteMany({ userId }),
            DailyLog.deleteMany({ userId })
        ]);

        res.json({ message: 'User and all related data deleted successfully' });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get recent activity across platform (admin only)
router.get('/recent-activity', authenticateToken, isAdmin, async (req, res) => {
    try {
        const recentLogs = await DailyLog.find()
            .sort({ createdAt: -1 })
            .limit(20)
            .populate('userId', 'username email')
            .populate('habitId', 'name category');

        res.json(recentLogs);
    } catch (error) {
        console.error('Get recent activity error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
