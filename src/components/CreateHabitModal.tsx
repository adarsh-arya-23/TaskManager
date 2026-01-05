import { useState } from 'react';
import api from '../utils/api';
import {
    X, Dumbbell, Book, Code, Apple, Droplet, Moon, Heart, Zap, Clock, Target, Sparkles,
    // Fitness & Health
    Activity, Bike, Footprints, Flame, Salad, Pill, Stethoscope, Weight, Smile, Brain,
    // Learning & Education
    GraduationCap, BookOpen, Lightbulb, Languages, Calculator, Microscope, Pencil, FileText,
    // Productivity & Work
    Briefcase, Coffee, Laptop, CheckSquare, Calendar, TrendingUp, BarChart, Rocket,
    // Lifestyle & Hobbies
    Music, Camera, Palette, Gamepad2, Plane, ShoppingBag, Gift, Star,
    // Nature & Outdoors
    Sun, Cloud, Leaf, Flower2, Trees, Mountain, Waves, Wind,
    // Creative & Arts
    Brush, Film, Mic, Radio, Scissors, Pen, Image, Video,
    // Mindfulness & Wellness
    Sparkle, CloudRain, Eye, Ear, Hand, Users, MessageCircle, Phone,
    // Food & Nutrition
    Utensils, CupSoda, Pizza, Soup, Cookie, Carrot,
    // Custom & Misc
    Trophy, Award, Medal, Flag, Bell, Timer, Hourglass, CircleDot
} from 'lucide-react';

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

// Comprehensive icon library organized by categories
const iconLibrary = {
    'Fitness & Health': [
        { icon: 'dumbbell', name: 'Dumbbell', IconComponent: Dumbbell },
        { icon: 'activity', name: 'Activity', IconComponent: Activity },
        { icon: 'bike', name: 'Bike', IconComponent: Bike },
        { icon: 'footprints', name: 'Footprints', IconComponent: Footprints },
        { icon: 'flame', name: 'Flame', IconComponent: Flame },
        { icon: 'heart', name: 'Heart', IconComponent: Heart },
        { icon: 'weight', name: 'Weight', IconComponent: Weight },
        { icon: 'stethoscope', name: 'Stethoscope', IconComponent: Stethoscope },
        { icon: 'pill', name: 'Pill', IconComponent: Pill },
        { icon: 'smile', name: 'Smile', IconComponent: Smile },
    ],
    'Learning & Education': [
        { icon: 'book', name: 'Book', IconComponent: Book },
        { icon: 'bookopen', name: 'Book Open', IconComponent: BookOpen },
        { icon: 'graduationcap', name: 'Graduation', IconComponent: GraduationCap },
        { icon: 'lightbulb', name: 'Lightbulb', IconComponent: Lightbulb },
        { icon: 'brain', name: 'Brain', IconComponent: Brain },
        { icon: 'languages', name: 'Languages', IconComponent: Languages },
        { icon: 'calculator', name: 'Calculator', IconComponent: Calculator },
        { icon: 'microscope', name: 'Microscope', IconComponent: Microscope },
        { icon: 'pencil', name: 'Pencil', IconComponent: Pencil },
        { icon: 'filetext', name: 'File', IconComponent: FileText },
    ],
    'Productivity & Work': [
        { icon: 'code', name: 'Code', IconComponent: Code },
        { icon: 'zap', name: 'Zap', IconComponent: Zap },
        { icon: 'briefcase', name: 'Briefcase', IconComponent: Briefcase },
        { icon: 'laptop', name: 'Laptop', IconComponent: Laptop },
        { icon: 'checksquare', name: 'Check', IconComponent: CheckSquare },
        { icon: 'calendar', name: 'Calendar', IconComponent: Calendar },
        { icon: 'trendingup', name: 'Trending', IconComponent: TrendingUp },
        { icon: 'barchart', name: 'Chart', IconComponent: BarChart },
        { icon: 'rocket', name: 'Rocket', IconComponent: Rocket },
        { icon: 'target', name: 'Target', IconComponent: Target },
    ],
    'Food & Nutrition': [
        { icon: 'apple', name: 'Apple', IconComponent: Apple },
        { icon: 'salad', name: 'Salad', IconComponent: Salad },
        { icon: 'droplet', name: 'Droplet', IconComponent: Droplet },
        { icon: 'coffee', name: 'Coffee', IconComponent: Coffee },
        { icon: 'utensils', name: 'Utensils', IconComponent: Utensils },
        { icon: 'cupsoda', name: 'Drink', IconComponent: CupSoda },
        { icon: 'pizza', name: 'Pizza', IconComponent: Pizza },
        { icon: 'soup', name: 'Soup', IconComponent: Soup },
        { icon: 'cookie', name: 'Cookie', IconComponent: Cookie },
        { icon: 'carrot', name: 'Carrot', IconComponent: Carrot },
    ],
    'Lifestyle & Hobbies': [
        { icon: 'music', name: 'Music', IconComponent: Music },
        { icon: 'camera', name: 'Camera', IconComponent: Camera },
        { icon: 'palette', name: 'Palette', IconComponent: Palette },
        { icon: 'gamepad2', name: 'Gaming', IconComponent: Gamepad2 },
        { icon: 'plane', name: 'Travel', IconComponent: Plane },
        { icon: 'shoppingbag', name: 'Shopping', IconComponent: ShoppingBag },
        { icon: 'gift', name: 'Gift', IconComponent: Gift },
        { icon: 'star', name: 'Star', IconComponent: Star },
    ],
    'Nature & Outdoors': [
        { icon: 'sun', name: 'Sun', IconComponent: Sun },
        { icon: 'moon', name: 'Moon', IconComponent: Moon },
        { icon: 'cloud', name: 'Cloud', IconComponent: Cloud },
        { icon: 'leaf', name: 'Leaf', IconComponent: Leaf },
        { icon: 'flower2', name: 'Flower', IconComponent: Flower2 },
        { icon: 'trees', name: 'Trees', IconComponent: Trees },
        { icon: 'mountain', name: 'Mountain', IconComponent: Mountain },
        { icon: 'waves', name: 'Waves', IconComponent: Waves },
        { icon: 'wind', name: 'Wind', IconComponent: Wind },
    ],
    'Creative & Arts': [
        { icon: 'brush', name: 'Brush', IconComponent: Brush },
        { icon: 'film', name: 'Film', IconComponent: Film },
        { icon: 'mic', name: 'Microphone', IconComponent: Mic },
        { icon: 'radio', name: 'Radio', IconComponent: Radio },
        { icon: 'scissors', name: 'Scissors', IconComponent: Scissors },
        { icon: 'pen', name: 'Pen', IconComponent: Pen },
        { icon: 'image', name: 'Image', IconComponent: Image },
        { icon: 'video', name: 'Video', IconComponent: Video },
    ],
    'Mindfulness & Social': [
        { icon: 'sparkle', name: 'Sparkle', IconComponent: Sparkle },
        { icon: 'cloudrain', name: 'Rain', IconComponent: CloudRain },
        { icon: 'eye', name: 'Eye', IconComponent: Eye },
        { icon: 'ear', name: 'Ear', IconComponent: Ear },
        { icon: 'hand', name: 'Hand', IconComponent: Hand },
        { icon: 'users', name: 'Users', IconComponent: Users },
        { icon: 'messagecircle', name: 'Message', IconComponent: MessageCircle },
        { icon: 'phone', name: 'Phone', IconComponent: Phone },
    ],
    'Goals & Achievements': [
        { icon: 'trophy', name: 'Trophy', IconComponent: Trophy },
        { icon: 'award', name: 'Award', IconComponent: Award },
        { icon: 'medal', name: 'Medal', IconComponent: Medal },
        { icon: 'flag', name: 'Flag', IconComponent: Flag },
        { icon: 'bell', name: 'Bell', IconComponent: Bell },
        { icon: 'timer', name: 'Timer', IconComponent: Timer },
        { icon: 'hourglass', name: 'Hourglass', IconComponent: Hourglass },
        { icon: 'circledot', name: 'Circle', IconComponent: CircleDot },
    ],
};

// Predefined color gradients
const colorGradients = [
    { name: 'Purple Dream', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { name: 'Pink Sunset', value: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
    { name: 'Ocean Blue', value: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
    { name: 'Fresh Green', value: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
    { name: 'Sunset Orange', value: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
    { name: 'Deep Night', value: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)' },
    { name: 'Soft Pink', value: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' },
    { name: 'Fire Red', value: 'linear-gradient(135deg, #ff9a56 0%, #ff6a88 100%)' },
    { name: 'Golden Hour', value: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)' },
    { name: 'Cool Mint', value: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)' },
    { name: 'Royal Purple', value: 'linear-gradient(135deg, #9d50bb 0%, #6e48aa 100%)' },
    { name: 'Emerald', value: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' },
];

const difficultyLevels = [
    { value: 'easy', label: 'Easy', color: 'from-green-400 to-emerald-500', xp: 5 },
    { value: 'medium', label: 'Medium', color: 'from-yellow-400 to-orange-500', xp: 10 },
    { value: 'hard', label: 'Hard', color: 'from-red-400 to-pink-500', xp: 20 },
];

export default function CreateHabitModal({ onClose, onSuccess }: CreateHabitModalProps) {
    const [mode, setMode] = useState<'template' | 'custom'>('template');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState(habitTemplates[0]);
    const [goalType, setGoalType] = useState<'daily' | 'weekly'>('daily');
    const [difficultyLevel, setDifficultyLevel] = useState<'easy' | 'medium' | 'hard'>('medium');
    const [reminderEnabled, setReminderEnabled] = useState(false);
    const [reminderTime, setReminderTime] = useState('09:00');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Custom habit states
    const [iconSearch, setIconSearch] = useState('');
    const [selectedCustomIcon, setSelectedCustomIcon] = useState<{ icon: string; name: string; IconComponent: any } | null>(null);
    const [selectedColor, setSelectedColor] = useState(colorGradients[0].value);
    const [selectedCategory, setSelectedCategory] = useState<string>('All');

    // Get all icons for filtering
    const getAllIcons = () => {
        const allIcons: { icon: string; name: string; IconComponent: any; category: string }[] = [];
        Object.entries(iconLibrary).forEach(([category, icons]) => {
            icons.forEach(icon => {
                allIcons.push({ ...icon, category });
            });
        });
        return allIcons;
    };

    // Filter icons based on search and category
    const getFilteredIcons = () => {
        let icons = getAllIcons();

        if (selectedCategory !== 'All') {
            icons = icons.filter(icon => icon.category === selectedCategory);
        }

        if (iconSearch.trim()) {
            const search = iconSearch.toLowerCase();
            icons = icons.filter(icon =>
                icon.name.toLowerCase().includes(search) ||
                icon.category.toLowerCase().includes(search)
            );
        }

        return icons;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validation for custom mode
        if (mode === 'custom' && !selectedCustomIcon) {
            setError('Please select an icon for your custom habit');
            return;
        }

        setLoading(true);

        try {
            const habitData = mode === 'template'
                ? {
                    name,
                    description,
                    category: selectedTemplate.name,
                    icon: selectedTemplate.icon,
                    color: selectedTemplate.color,
                    goalType,
                    difficultyLevel,
                    reminderTime: reminderEnabled ? reminderTime : null,
                    reminderEnabled,
                }
                : {
                    name,
                    description,
                    category: 'Custom',
                    icon: selectedCustomIcon!.icon,
                    color: selectedColor,
                    goalType,
                    difficultyLevel,
                    reminderTime: reminderEnabled ? reminderTime : null,
                    reminderEnabled,
                };

            await api.post('/habits', habitData);
            onSuccess();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create habit');
        } finally {
            setLoading(false);
        }
    };

    const selectedDifficulty = difficultyLevels.find(d => d.value === difficultyLevel)!;
    const filteredIcons = getFilteredIcons();
    const categories = ['All', ...Object.keys(iconLibrary)];

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="glass-card p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Create New Habit</h2>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Mode Toggle */}
                <div className="flex gap-2 mb-6 p-1 bg-white/5 rounded-xl">
                    <button
                        type="button"
                        onClick={() => setMode('template')}
                        className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${mode === 'template'
                                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                                : 'text-white/60 hover:text-white/80'
                            }`}
                    >
                        ⚡ Quick Templates
                    </button>
                    <button
                        type="button"
                        onClick={() => setMode('custom')}
                        className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${mode === 'custom'
                                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                                : 'text-white/60 hover:text-white/80'
                            }`}
                    >
                        ✨ Custom Habit
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

                    {/* Icon Selection - Template Mode */}
                    {mode === 'template' && (
                        <div>
                            <label className="block text-sm font-medium text-white/80 mb-3">
                                Choose a Template *
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
                    )}

                    {/* Icon Selection - Custom Mode */}
                    {mode === 'custom' && (
                        <>
                            {/* Icon Search and Category Filter */}
                            <div>
                                <label className="block text-sm font-medium text-white/80 mb-3">
                                    Choose an Icon * {selectedCustomIcon && `(${selectedCustomIcon.name})`}
                                </label>

                                {/* Search Bar */}
                                <input
                                    type="text"
                                    value={iconSearch}
                                    onChange={(e) => setIconSearch(e.target.value)}
                                    className="input-field mb-3"
                                    placeholder="Search icons..."
                                />

                                {/* Category Tabs */}
                                <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                                    {categories.map((category) => (
                                        <button
                                            key={category}
                                            type="button"
                                            onClick={() => setSelectedCategory(category)}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${selectedCategory === category
                                                    ? 'bg-purple-500/30 text-purple-300 border border-purple-400/50'
                                                    : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white/80'
                                                }`}
                                        >
                                            {category}
                                        </button>
                                    ))}
                                </div>

                                {/* Icon Grid */}
                                <div className="grid grid-cols-6 md:grid-cols-8 gap-2 max-h-64 overflow-y-auto p-2 bg-white/5 rounded-xl">
                                    {filteredIcons.length > 0 ? (
                                        filteredIcons.map((icon) => {
                                            const IconComponent = icon.IconComponent;
                                            return (
                                                <button
                                                    key={icon.icon}
                                                    type="button"
                                                    onClick={() => setSelectedCustomIcon(icon)}
                                                    className={`p-3 rounded-lg transition-all ${selectedCustomIcon?.icon === icon.icon
                                                            ? 'ring-2 ring-purple-400 bg-purple-500/20'
                                                            : 'bg-white/5 hover:bg-white/10'
                                                        }`}
                                                    title={icon.name}
                                                >
                                                    <IconComponent className="w-6 h-6 text-white mx-auto" />
                                                </button>
                                            );
                                        })
                                    ) : (
                                        <div className="col-span-full text-center py-8 text-white/40">
                                            No icons found
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Color Selection */}
                            <div>
                                <label className="block text-sm font-medium text-white/80 mb-3">
                                    Choose a Color *
                                </label>
                                <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                                    {colorGradients.map((gradient) => (
                                        <button
                                            key={gradient.name}
                                            type="button"
                                            onClick={() => setSelectedColor(gradient.value)}
                                            className={`h-12 rounded-lg transition-all ${selectedColor === gradient.value
                                                    ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-900 scale-110'
                                                    : 'hover:scale-105'
                                                }`}
                                            style={{ background: gradient.value }}
                                            title={gradient.name}
                                        />
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

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
