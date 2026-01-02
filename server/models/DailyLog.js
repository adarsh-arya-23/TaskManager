import mongoose from 'mongoose';

const dailyLogSchema = new mongoose.Schema({
    habitId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Habit',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    note: {
        type: String,
        default: ''
    },
    xpEarned: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Ensure one log per habit per day
dailyLogSchema.index({ habitId: 1, date: 1 }, { unique: true });

export default mongoose.model('DailyLog', dailyLogSchema);
