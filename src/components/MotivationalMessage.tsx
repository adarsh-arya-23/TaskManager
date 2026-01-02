import React, { useMemo } from 'react';
import { Sparkles, Zap, Flame } from 'lucide-react';
import { Habit, User } from '../types';

interface MotivationalMessageProps {
    user: User | null;
    habits: Habit[];
}

const MotivationalMessage: React.FC<MotivationalMessageProps> = ({ user, habits }) => {
    const message = useMemo(() => {
        if (!user || habits.length === 0) {
            return {
                text: "Small steps lead to big changes. Ready to start today?",
                icon: <Sparkles className="w-5 h-5 text-yellow-400" />,
                gradient: "from-blue-500/10 to-purple-500/10"
            };
        }

        // Find habits with streaks
        const streakHabits = habits.filter(h => h.currentStreak > 0).sort((a, b) => b.currentStreak - a.currentStreak);
        const name = user.username.split(' ')[0]; // Use first name if available

        if (streakHabits.length > 0) {
            const topHabit = streakHabits[0];
            const streak = topHabit.currentStreak;

            const templates = [
                `Hey ${name}, don't break your ${streak}-day streak for ${topHabit.name} today! 🔥`,
                `${name}, you're on fire with a ${streak}-day streak! Keep it going for ${topHabit.name}. ✨`,
                `Consistency is your superpower, ${name}! That ${streak}-day streak looks amazing. 💪`,
                `Hey ${name}, ${topHabit.name} is waiting! Don't let your ${streak}-day streak slip away.`
            ];

            return {
                text: templates[Math.floor(Math.random() * templates.length)],
                icon: <Flame className="w-5 h-5 text-orange-400" />,
                gradient: "from-orange-500/10 to-red-500/10"
            };
        }

        // If no streaks, pick a random habit
        const randomHabit = habits[Math.floor(Math.random() * habits.length)];
        const generalTemplates = [
            `Hey ${name}, today is a great day to work on ${randomHabit.name}! 🎯`,
            `Every small step counts, ${name}. Let's make progress on ${randomHabit.name}.`,
            `Ready to tackle ${randomHabit.name} today, ${name}? You've got this! 🚀`,
            `${name}, remember why you started ${randomHabit.name}. Let's do it today!`
        ];

        return {
            text: generalTemplates[Math.floor(Math.random() * generalTemplates.length)],
            icon: <Zap className="w-5 h-5 text-yellow-400" />,
            gradient: "from-yellow-500/10 to-orange-500/10"
        };
    }, [user, habits]);

    return (
        <div className={`glass-card p-4 mb-8 overflow-hidden relative group`}>
            <div className={`absolute inset-0 bg-gradient-to-r ${message.gradient} opacity-50 group-hover:opacity-100 transition-opacity duration-500`} />
            <div className="relative flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    {message.icon}
                </div>
                <p className="text-lg md:text-xl font-medium text-white/90">
                    {message.text}
                </p>
                <div className="ml-auto opacity-20 group-hover:opacity-100 transition-opacity hidden md:block">
                    <Sparkles className="w-8 h-8 text-white/20 animate-pulse" />
                </div>
            </div>
        </div>
    );
};

export default MotivationalMessage;
