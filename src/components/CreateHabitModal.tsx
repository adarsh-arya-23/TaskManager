import { useState } from 'react';
import api from '../utils/api';
import { X, Dumbbell, Book, Code, Apple, Droplet, Moon, Heart, Zap, Clock, Target, Sparkles } from 'lucide-react';

interface CreateHabitModalProps {
    onClose: () => void;
    onSuccess: () => void;
}

const habitTemplates = [
    { icon: 'dumbbell', name: 'Exercise', color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', IconComponent: Dumbbell },
    { icon: 'book', name: 'Reading', color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', IconComponent: Book },
    { icon: 'code', name: 'Coding', color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', IconComponent: Code },
    { icon: 'apple', name: 'Healthy Eating', color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', IconComponent: Apple },
    { icon: 'droplet', name: 'Hydration', color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', IconComponent: Droplet },
    { icon: 'moon', name: 'Sleep', color: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)', IconComponent: Moon },
    { icon: 'heart', name: 'Meditation', color: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', IconComponent: Heart },
    { icon: 'zap', name: 'Productivity', color: 'linear-gradient(135deg, #ff9a56 0%, #ff6a88 100%)', IconComponent: Zap },
];

const difficultyLevels = [
    { value: 'easy', label: 'Easy', color: 'from-green-400 to-emerald-500', xp: 5 },
    { value: 'medium', label: 'Medium', color: 'from-yellow-400 to-orange-500', xp: 10 },
    { value: 'hard', label: 'Hard', color: 'from-red-400 to-pink-500', xp: 20 },
];

export default function CreateHabitModal({ onClose, onSuccess }: CreateHabitModalProps) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState(habitTemplates[0]);
    const [goalType, setGoalType] = useState<'daily' | 'weekly'>('daily');
    const [difficultyLevel, setDifficultyLevel] = useState<'easy' | 'medium' | 'hard'>('medium');
    const [reminderEnabled, setReminderEnabled] = useState(false);
    const [reminderTime, setReminderTime] = useState('09:00');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await api.post('/habits', {
                name,
                description,
                category: selectedTemplate.name,
                icon: selectedTemplate.icon,
                color: selectedTemplate.color,
                goalType,
                difficultyLevel,
                reminderTime: reminderEnabled ? reminderTime : null,
                reminderEnabled,
            });
            onSuccess();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create habit');
        } finally {
            setLoading(false);
        }
    };

    const selectedDifficulty = difficultyLevels.find(d => d.value === difficultyLevel)!;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="glass-card p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Create Custom Habit</h2>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                        <p className="text-red-300 text-sm">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Habit Name */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-2">
                            Habit Name *
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="input-field"
                            placeholder="e.g., Morning Workout"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-white/80 mb-2">
                            Description *
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="input-field resize-none"
                            rows={3}
                            placeholder="What does this habit mean to you?"
                            required
                        />
                    </div>

                    {/* Icon Selection */}
                    <div>
                        <label className="block text-sm font-medium text-white/80 mb-3">
                            Choose an Icon *
                        </label>
                        <div className="grid grid-cols-4 gap-3">
                            {habitTemplates.map((template) => {
                                const IconComponent = template.IconComponent;
                                return (
                                    <button
                                        key={template.icon}
                                        type="button"
                                        onClick={() => setSelectedTemplate(template)}
                                        className={`p-4 rounded-xl transition-all ${selectedTemplate.icon === template.icon
                                                ? 'ring-2 ring-purple-400 bg-white/10'
                                                : 'bg-white/5 hover:bg-white/10'
                                            }`}
                                    >
                                        <div
                                            className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-2"
                                            style={{ background: template.color }}
                                        >
                                            <IconComponent className="w-7 h-7 text-white" />
                                        </div>
                                        <p className="text-xs text-white/60 text-center">{template.name}</p>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Goal Type */}
                    <div>
                        <label className="block text-sm font-medium text-white/80 mb-3 flex items-center gap-2">
                            <Target className="w-4 h-4" />
                            Goal Type *
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setGoalType('daily')}
                                className={`p-4 rounded-xl transition-all ${goalType === 'daily'
                                        ? 'bg-purple-500/30 border-2 border-purple-400'
                                        : 'bg-white/5 border border-white/20 hover:bg-white/10'
                                    }`}
                            >
                                <div className="text-center">
                                    <p className="font-semibold mb-1">Daily</p>
                                    <p className="text-xs text-white/60">Track every day</p>
                                </div>
                            </button>
                            <button
                                type="button"
                                onClick={() => setGoalType('weekly')}
                                className={`p-4 rounded-xl transition-all ${goalType === 'weekly'
                                        ? 'bg-purple-500/30 border-2 border-purple-400'
                                        : 'bg-white/5 border border-white/20 hover:bg-white/10'
                                    }`}
                            >
                                <div className="text-center">
                                    <p className="font-semibold mb-1">Weekly</p>
                                    <p className="text-xs text-white/60">Track per week</p>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Difficulty Level */}
                    <div>
                        <label className="block text-sm font-medium text-white/80 mb-3 flex items-center gap-2">
                            <Sparkles className="w-4 h-4" />
                            Difficulty Level * ({selectedDifficulty.xp} XP per completion)
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            {difficultyLevels.map((level) => (
                                <button
                                    key={level.value}
                                    type="button"
                                    onClick={() => setDifficultyLevel(level.value as any)}
                                    className={`p-4 rounded-xl transition-all ${difficultyLevel === level.value
                                            ? 'ring-2 ring-purple-400 bg-white/10'
                                            : 'bg-white/5 hover:bg-white/10'
                                        }`}
                                >
                                    <div className={`w-full h-2 rounded-full bg-gradient-to-r ${level.color} mb-2`}></div>
                                    <p className="font-semibold text-sm">{level.label}</p>
                                    <p className="text-xs text-white/60">{level.xp} XP</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Reminder */}
                    <div>
                        <label className="flex items-center gap-3 mb-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={reminderEnabled}
                                onChange={(e) => setReminderEnabled(e.target.checked)}
                                className="w-5 h-5 rounded bg-white/10 border-white/20 text-purple-500 focus:ring-2 focus:ring-purple-500"
                            />
                            <span className="text-sm font-medium text-white/80 flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                Set Daily Reminder
                            </span>
                        </label>

                        {reminderEnabled && (
                            <input
                                type="time"
                                value={reminderTime}
                                onChange={(e) => setReminderTime(e.target.value)}
                                className="input-field"
                            />
                        )}
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-3 pt-4 border-t border-white/10">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn-secondary flex-1"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary flex-1"
                        >
                            {loading ? 'Creating...' : 'Create Habit'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
