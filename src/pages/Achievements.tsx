import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, Trophy, Lock, Award, Star, Zap } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';

// All available badges with their criteria
const allBadges = [
    {
        id: 'perfect-week',
        name: 'Perfect Week',
        description: 'Completed your first week!',
        icon: '⭐',
        requirement: 'Complete 7 days total',
        color: 'from-yellow-400 to-orange-500'
    },
    {
        id: '7-day-streak',
        name: '7-Day Warrior',
        description: 'Completed 7 days in a row!',
        icon: '🔥',
        requirement: 'Maintain a 7-day streak',
        color: 'from-orange-400 to-red-500'
    },
    {
        id: '30-day-streak',
        name: 'Monthly Master',
        description: 'Completed 30 days in a row!',
        icon: '🏆',
        requirement: 'Maintain a 30-day streak',
        color: 'from-purple-400 to-pink-500'
    },
    {
        id: 'comeback-hero',
        name: 'Comeback Hero',
        description: 'Returned strong after a break!',
        icon: '💪',
        requirement: 'Get 3+ day streak after missing 3+ days',
        color: 'from-green-400 to-emerald-500'
    },
    {
        id: '100-day-streak',
        name: 'Century Champion',
        description: '100 days of consistency!',
        icon: '💯',
        requirement: 'Maintain a 100-day streak',
        color: 'from-blue-400 to-cyan-500',
        locked: true
    },
    {
        id: 'habit-master',
        name: 'Habit Master',
        description: 'Created 10 different habits',
        icon: '🎯',
        requirement: 'Create 10 habits',
        color: 'from-indigo-400 to-purple-500',
        locked: true
    }
];

export default function Achievements() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const earnedBadgeIds = user?.badges?.map(b => b.id) || [];
    const earnedCount = earnedBadgeIds.length;
    const totalCount = allBadges.length;
    const progress = (earnedCount / totalCount) * 100;

    return (
        <div className="min-h-screen p-4 md:p-8">
            {/* Header */}
            <div className="max-w-6xl mx-auto mb-8">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="btn-secondary flex items-center gap-2 mb-6"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Dashboard
                </button>
                <div className="flex items-center justify-between mb-6">
                    <div className="flex-1"></div>
                    <ThemeToggle />
                </div>

                <div className="glass-card p-8">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                            <Trophy className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold mb-2">Achievements</h1>
                            <p className="text-white/60">Your journey to greatness</p>
                        </div>
                    </div>

                    {/* Progress Overview */}
                    <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-white/80 font-medium">Overall Progress</span>
                            <span className="text-2xl font-bold">{earnedCount}/{totalCount}</span>
                        </div>
                        <div className="progress-bar mb-2">
                            <div
                                className="progress-fill"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                        <p className="text-sm text-white/60">
                            {earnedCount === 0 ? 'Start completing habits to earn badges!' :
                                earnedCount === totalCount ? '🎉 All badges unlocked! You\'re amazing!' :
                                    `${totalCount - earnedCount} more to unlock!`}
                        </p>
                    </div>
                </div>
            </div>

            {/* Earned Badges */}
            {earnedCount > 0 && (
                <div className="max-w-6xl mx-auto mb-8">
                    <div className="glass-card p-6 md:p-8">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <Award className="w-6 h-6 text-yellow-400" />
                            Earned Badges ({earnedCount})
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {allBadges
                                .filter(badge => earnedBadgeIds.includes(badge.id))
                                .map((badge) => {
                                    const userBadge = user?.badges?.find(b => b.id === badge.id);
                                    return (
                                        <div
                                            key={badge.id}
                                            className={`bg-gradient-to-br ${badge.color} p-6 rounded-2xl border-2 border-white/30 shadow-xl hover:scale-105 transition-transform relative overflow-hidden`}
                                        >
                                            {/* Shine effect */}
                                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent"></div>

                                            <div className="relative">
                                                <div className="text-6xl mb-4 text-center animate-bounce-slow">
                                                    {badge.icon}
                                                </div>
                                                <h3 className="text-xl font-bold text-white mb-2 text-center">
                                                    {badge.name}
                                                </h3>
                                                <p className="text-white/90 text-sm text-center mb-3">
                                                    {badge.description}
                                                </p>
                                                <div className="bg-black/20 rounded-lg p-2 text-center">
                                                    <p className="text-xs text-white/80">
                                                        Earned {userBadge?.earnedAt ? new Date(userBadge.earnedAt).toLocaleDateString() : 'Recently'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    </div>
                </div>
            )}

            {/* Locked Badges */}
            <div className="max-w-6xl mx-auto">
                <div className="glass-card p-6 md:p-8">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <Lock className="w-6 h-6 text-white/60" />
                        Locked Badges ({totalCount - earnedCount})
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {allBadges
                            .filter(badge => !earnedBadgeIds.includes(badge.id))
                            .map((badge) => (
                                <div
                                    key={badge.id}
                                    className="bg-white/5 p-6 rounded-2xl border-2 border-white/10 relative group hover:border-white/20 transition-all"
                                >
                                    {/* Lock overlay */}
                                    <div className="absolute top-4 right-4">
                                        <Lock className="w-6 h-6 text-white/40" />
                                    </div>

                                    <div className="opacity-60 group-hover:opacity-80 transition-opacity">
                                        <div className="text-6xl mb-4 text-center grayscale">
                                            {badge.icon}
                                        </div>
                                        <h3 className="text-xl font-bold text-white/80 mb-2 text-center">
                                            {badge.name}
                                        </h3>
                                        <p className="text-white/60 text-sm text-center mb-3">
                                            {badge.description}
                                        </p>
                                        <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Star className="w-4 h-4 text-yellow-400/60" />
                                                <p className="text-xs font-semibold text-white/70">How to unlock:</p>
                                            </div>
                                            <p className="text-xs text-white/60">
                                                {badge.requirement}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            </div>

            {/* Motivational Footer */}
            <div className="max-w-6xl mx-auto mt-8">
                <div className="glass-card p-6 text-center">
                    <Zap className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
                    <h3 className="text-xl font-bold mb-2">Keep Going!</h3>
                    <p className="text-white/60">
                        Every habit you complete brings you closer to unlocking more achievements. Stay consistent! 🔥
                    </p>
                </div>
            </div>
        </div>
    );
}
