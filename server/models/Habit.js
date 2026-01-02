import mongoose from 'mongoose';

const habitSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    currentStreak: {
        type: Number,
        default: 0
    },
    longestStreak: {
        type: Number,
        default: 0
    },
    totalCompletions: {
        type: Number,
        default: 0
    },
    xpPerCompletion: {
        type: Number,
        default: 10
    },
    goalType: {
        type: String,
        enum: ['daily', 'weekly'],
        default: 'daily'
    },
    difficultyLevel: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'medium'
    },
    reminderTime: {
        type: String,
        default: null
    },
    reminderEnabled: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

export default mongoose.model('Habit', habitSchema);
