import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    totalXP: {
        type: Number,
        default: 0
    },
    level: {
        type: Number,
        default: 1
    },
    googleId: {
        type: String,
        sparse: true,
        unique: true
    },
    profilePicture: {
        type: String
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    badges: [{
        id: String,
        name: String,
        description: String,
        icon: String,
        habitId: mongoose.Schema.Types.ObjectId,
        earnedAt: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

// Calculate level based on XP
userSchema.methods.calculateLevel = function () {
    // If no XP, level is 0. Otherwise, start at level 1 with 0-99 XP
    this.level = this.totalXP === 0 ? 0 : Math.floor(this.totalXP / 100) + 1;
    return this.level;
};

export default mongoose.model('User', userSchema);
