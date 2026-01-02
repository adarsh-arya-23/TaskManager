import express from 'express';
import { body, validationResult } from 'express-validator';
import Habit from '../models/Habit.js';
import DailyLog from '../models/DailyLog.js';
import User from '../models/User.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Get all habits for user
router.get('/', auth, async (req, res) => {
    try {
        const habits = await Habit.find({ userId: req.userId }).sort({ createdAt: -1 });
        res.json(habits);
    } catch (error) {
        console.error('Get habits error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get single habit
router.get('/:id', auth, async (req, res) => {
    try {
        const habit = await Habit.findOne({ _id: req.params.id, userId: req.userId });
        if (!habit) {
            return res.status(404).json({ message: 'Habit not found' });
        }
        res.json(habit);
    } catch (error) {
        console.error('Get habit error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create habit
router.post('/',
    auth,
    [
        body('name').trim().notEmpty().withMessage('Habit name is required'),
        body('description').trim().notEmpty().withMessage('Description is required'),
        body('category').notEmpty().withMessage('Category is required'),
        body('icon').notEmpty().withMessage('Icon is required'),
        body('color').notEmpty().withMessage('Color is required')
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: errors.array()[0].msg });
            }

            const {
                name,
                description,
                category,
                icon,
                color,
                goalType = 'daily',
                difficultyLevel = 'medium',
                reminderTime = null,
                reminderEnabled = false
            } = req.body;

            // Calculate XP based on difficulty
            const xpMap = { easy: 5, medium: 10, hard: 20 };
            const xpPerCompletion = xpMap[difficultyLevel] || 10;

            const habit = new Habit({
                userId: req.userId,
                name,
                description,
                category,
                icon,
                color,
                goalType,
                difficultyLevel,
                reminderTime,
                reminderEnabled,
                xpPerCompletion
            });

            await habit.save();
            res.status(201).json(habit);
        } catch (error) {
            console.error('Create habit error:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }
);

// Delete habit
router.delete('/:id', auth, async (req, res) => {
    try {
        const habitId = req.params.id;
        const habit = await Habit.findOne({ _id: habitId, userId: req.userId });

        if (!habit) {
            return res.status(404).json({ message: 'Habit not found' });
        }

        // 1. Delete the habit first
        await Habit.findByIdAndDelete(habitId);

        // 2. Delete all logs for this habit
        await DailyLog.deleteMany({ habitId });

        // 3. Recalculate user stats from scratch based on REMAINING habits only
        const user = await User.findById(req.userId);
        if (user) {
            // Get all remaining habits for this user
            const remainingHabits = await Habit.find({ userId: req.userId });

            // Recalculate total XP from all remaining habits' logs
            let totalXP = 0;

            if (remainingHabits.length > 0) {
                const allRemainingLogs = await DailyLog.find({
                    userId: req.userId,
                    habitId: { $in: remainingHabits.map(h => h._id) }
                });

                totalXP = allRemainingLogs.reduce((sum, log) => sum + (log.xpEarned || 0), 0);
            } else {
                // No habits left - clean up any orphaned logs and reset everything
                await DailyLog.deleteMany({ userId: req.userId });
                totalXP = 0;
            }

            // Remove ALL badges tied to the deleted habit
            user.badges = user.badges.filter(badge =>
                !badge.habitId || badge.habitId.toString() !== habitId
            );

            // Update user with recalculated stats
            user.totalXP = totalXP;
            user.calculateLevel();
            await user.save();

            console.log(`User ${user.username} stats after deletion:`, {
                totalXP: user.totalXP,
                level: user.level,
                remainingHabits: remainingHabits.length,
                badges: user.badges.length
            });
        }

        res.json({
            message: 'Habit and all related data deleted successfully',
            updatedUser: {
                totalXP: user.totalXP,
                level: user.level,
                badges: user.badges
            }
        });
    } catch (error) {
        console.error('Delete habit error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get logs for a habit
router.get('/:id/logs', auth, async (req, res) => {
    try {
        const habit = await Habit.findOne({ _id: req.params.id, userId: req.userId });
        if (!habit) {
            return res.status(404).json({ message: 'Habit not found' });
        }

        const logs = await DailyLog.find({ habitId: req.params.id }).sort({ date: -1 });
        res.json(logs);
    } catch (error) {
        console.error('Get logs error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create or update daily log
router.post('/:id/logs', auth, async (req, res) => {
    try {
        const { date, completed = true, note = '' } = req.body;

        const habit = await Habit.findOne({ _id: req.params.id, userId: req.userId });
        if (!habit) {
            return res.status(404).json({ message: 'Habit not found' });
        }

        // Parse date to start of day
        const logDate = new Date(date);
        logDate.setHours(0, 0, 0, 0);

        // Check if log already exists
        let log = await DailyLog.findOne({
            habitId: req.params.id,
            date: logDate
        });

        if (log) {
            return res.status(400).json({ message: 'Log already exists for this date' });
        }

        // Create new log
        log = new DailyLog({
            habitId: req.params.id,
            userId: req.userId,
            date: logDate,
            completed,
            note,
            xpEarned: completed ? habit.xpPerCompletion : 0
        });

        await log.save();

        // Update habit stats
        if (completed) {
            habit.totalCompletions += 1;

            // Update user XP
            const user = await User.findById(req.userId);
            user.totalXP += habit.xpPerCompletion;
            user.calculateLevel();
            await user.save();
        }

        // Recalculate streak
        await updateHabitStreak(habit);

        // Check and award badges
        await checkAndAwardBadges(req.userId, habit);

        res.status(201).json(log);
    } catch (error) {
        console.error('Create log error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update daily log
router.put('/:id/logs/:logId', auth, async (req, res) => {
    try {
        const { completed, note } = req.body;

        const habit = await Habit.findOne({ _id: req.params.id, userId: req.userId });
        if (!habit) {
            return res.status(404).json({ message: 'Habit not found' });
        }

        const log = await DailyLog.findOne({ _id: req.params.logId, habitId: req.params.id });
        if (!log) {
            return res.status(404).json({ message: 'Log not found' });
        }

        const wasCompleted = log.completed;
        const xpChange = completed !== wasCompleted ? (completed ? habit.xpPerCompletion : -habit.xpPerCompletion) : 0;

        log.completed = completed !== undefined ? completed : log.completed;
        log.note = note !== undefined ? note : log.note;
        log.xpEarned = log.completed ? habit.xpPerCompletion : 0;

        await log.save();

        // Update habit stats
        if (completed !== wasCompleted) {
            if (completed) {
                habit.totalCompletions += 1;
            } else {
                habit.totalCompletions = Math.max(0, habit.totalCompletions - 1);
            }

            // Update user XP
            const user = await User.findById(req.userId);
            user.totalXP = Math.max(0, user.totalXP + xpChange);
            user.calculateLevel();
            await user.save();
        }

        // Recalculate streak
        await updateHabitStreak(habit);

        // Check and award badges
        await checkAndAwardBadges(req.userId, habit);

        res.json(log);
    } catch (error) {
        console.error('Update log error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Helper function to calculate streak
async function updateHabitStreak(habit) {
    const logs = await DailyLog.find({ habitId: habit._id }).sort({ date: -1 });

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Calculate current streak (from today backwards)
    for (let i = 0; i < logs.length; i++) {
        const logDate = new Date(logs[i].date);
        logDate.setHours(0, 0, 0, 0);

        const expectedDate = new Date(today);
        expectedDate.setDate(today.getDate() - i);
        expectedDate.setHours(0, 0, 0, 0);

        if (logDate.getTime() === expectedDate.getTime() && logs[i].completed) {
            currentStreak++;
        } else {
            break;
        }
    }

    // Calculate longest streak
    for (const log of logs) {
        if (log.completed) {
            tempStreak++;
            longestStreak = Math.max(longestStreak, tempStreak);
        } else {
            tempStreak = 0;
        }
    }

    habit.currentStreak = currentStreak;
    habit.longestStreak = Math.max(habit.longestStreak, longestStreak);
    await habit.save();
}

// Helper function to check and award badges
async function checkAndAwardBadges(userId, habit) {
    const user = await User.findById(userId);
    const logs = await DailyLog.find({ habitId: habit._id }).sort({ date: -1 });

    const newBadges = [];

    // 7-Day Streak Badge
    if (habit.currentStreak >= 7 && !user.badges.some(b => b.id === '7-day-streak')) {
        newBadges.push({
            id: '7-day-streak',
            name: '7-Day Warrior',
            description: 'Completed 7 days in a row!',
            icon: '🔥',
            habitId: habit._id,
            earnedAt: new Date()
        });
    }

    // 30-Day Streak Badge
    if (habit.currentStreak >= 30 && !user.badges.some(b => b.id === '30-day-streak')) {
        newBadges.push({
            id: '30-day-streak',
            name: 'Monthly Master',
            description: 'Completed 30 days in a row!',
            icon: '🏆',
            habitId: habit._id,
            earnedAt: new Date()
        });
    }

    // Comeback Badge - returned after missing 3+ days
    if (logs.length >= 2) {
        const recentLogs = logs.slice(0, 10);
        let hadBreak = false;
        let consecutiveMissed = 0;

        for (let i = 0; i < recentLogs.length - 1; i++) {
            if (!recentLogs[i].completed) {
                consecutiveMissed++;
                if (consecutiveMissed >= 3) {
                    hadBreak = true;
                }
            } else {
                consecutiveMissed = 0;
            }
        }

        if (hadBreak && habit.currentStreak >= 3 && !user.badges.some(b => b.id === 'comeback-hero')) {
            newBadges.push({
                id: 'comeback-hero',
                name: 'Comeback Hero',
                description: 'Returned strong after a break!',
                icon: '💪',
                habitId: habit._id,
                earnedAt: new Date()
            });
        }
    }

    // Perfect Week Badge - 7 days completed
    if (habit.totalCompletions >= 7 && !user.badges.some(b => b.id === 'perfect-week')) {
        newBadges.push({
            id: 'perfect-week',
            name: 'Perfect Week',
            description: 'Completed your first week!',
            icon: '⭐',
            habitId: habit._id,
            earnedAt: new Date()
        });
    }

    // Add new badges to user
    if (newBadges.length > 0) {
        user.badges.push(...newBadges);
        await user.save();
    }

    return newBadges;
}

export default router;
