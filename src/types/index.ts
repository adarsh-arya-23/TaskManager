export interface User {
    _id: string;
    username: string;
    email: string;
    role: 'user' | 'admin';
    totalXP: number;
    level: number;
    badges: Badge[];
    createdAt: string;
}

export interface Habit {
    _id: string;
    userId: string;
    name: string;
    description: string;
    category: string;
    icon: string;
    color: string;
    currentStreak: number;
    longestStreak: number;
    totalCompletions: number;
    xpPerCompletion: number;
    goalType: 'daily' | 'weekly';
    difficultyLevel: 'easy' | 'medium' | 'hard';
    reminderTime: string | null;
    reminderEnabled: boolean;
    createdAt: string;
}

export interface DailyLog {
    _id: string;
    habitId: string;
    userId: string;
    date: string;
    completed: boolean;
    note?: string;
    xpEarned: number;
    createdAt: string;
}

export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string;
    earnedAt: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}

export interface HabitStats {
    completionRate: number;
    currentStreak: number;
    longestStreak: number;
    totalDays: number;
    completedDays: number;
    missedDays: number;
}
