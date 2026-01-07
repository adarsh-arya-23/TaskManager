import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import { Habit } from '../types';
import {
    Flame,
    Trophy,
    Target,
    LogOut,
    Plus,
    Dumbbell,
    Book,
    Code,
    Apple,
    Droplet,
    Moon,
    Heart,
    Zap,
    Shield,
    Trash2,
    // Additional icons for custom habits
    Activity, Bike, Footprints, Salad, Pill, Stethoscope, Weight, Smile, Brain,
    GraduationCap, BookOpen, Lightbulb, Languages, Calculator, Microscope, Pencil, FileText,
    Briefcase, Coffee, Laptop, CheckSquare, Calendar, TrendingUp, BarChart, Rocket,
    Music, Camera, Palette, Gamepad2, Plane, ShoppingBag, Gift, Star,
    Sun, Cloud, Leaf, Flower2, Trees, Mountain, Waves, Wind,
    Brush, Film, Mic, Radio, Scissors, Pen, Image, Video,
    Sparkle, CloudRain, Eye, Ear, Hand, Users, MessageCircle, Phone,
    Utensils, CupSoda, Pizza, Soup, Cookie, Carrot,
    Award, Medal, Flag, Bell, Timer, Hourglass, CircleDot
} from 'lucide-react';
import CreateHabitModal from '../components/CreateHabitModal';
import MotivationalMessage from '../components/MotivationalMessage';
import ThemeToggle from '../components/ThemeToggle';

const iconMap: Record<string, any> = {
    // Original templates
    dumbbell: Dumbbell,
    book: Book,
    code: Code,
    apple: Apple,
    droplet: Droplet,
    moon: Moon,
    heart: Heart,
    zap: Zap,
    // Fitness & Health
    activity: Activity,
    bike: Bike,
    footprints: Footprints,
    flame: Flame,
    salad: Salad,
    pill: Pill,
    stethoscope: Stethoscope,
    weight: Weight,
    smile: Smile,
    brain: Brain,
    // Learning & Education
    bookopen: BookOpen,
    graduationcap: GraduationCap,
    lightbulb: Lightbulb,
    languages: Languages,
    calculator: Calculator,
    microscope: Microscope,
    pencil: Pencil,
    filetext: FileText,
    // Productivity & Work
    briefcase: Briefcase,
    coffee: Coffee,
    laptop: Laptop,
    checksquare: CheckSquare,
    calendar: Calendar,
    trendingup: TrendingUp,
    barchart: BarChart,
    rocket: Rocket,
    target: Target,
    // Food & Nutrition
    utensils: Utensils,
    cupsoda: CupSoda,
    pizza: Pizza,
    soup: Soup,
    cookie: Cookie,
    carrot: Carrot,
    // Lifestyle & Hobbies
    music: Music,
    camera: Camera,
    palette: Palette,
    gamepad2: Gamepad2,
    plane: Plane,
    shoppingbag: ShoppingBag,
    gift: Gift,
    star: Star,
    // Nature & Outdoors
    sun: Sun,
    cloud: Cloud,
    leaf: Leaf,
    flower2: Flower2,
    trees: Trees,
    mountain: Mountain,
    waves: Waves,
    wind: Wind,
    // Creative & Arts
    brush: Brush,
    film: Film,
    mic: Mic,
    radio: Radio,
    scissors: Scissors,
    pen: Pen,
    image: Image,
    video: Video,
    // Mindfulness & Social
    sparkle: Sparkle,
    cloudrain: CloudRain,
    eye: Eye,
    ear: Ear,
    hand: Hand,
    users: Users,
    messagecircle: MessageCircle,
    phone: Phone,
    // Goals & Achievements
    trophy: Trophy,
    award: Award,
    medal: Medal,
    flag: Flag,
    bell: Bell,
    timer: Timer,
    hourglass: Hourglass,
    circledot: CircleDot,
};

export default function Dashboard() {
    const { user, logout, updateUser } = useAuth();
    const navigate = useNavigate();
    const [habits, setHabits] = useState<Habit[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);

    useEffect(() => {
        fetchHabits();
    }, []);



    const fetchHabits = async () => {
        try {
            const response = await api.get<Habit[]>('/habits');
            setHabits(response.data);
        } catch (error) {
            console.error('Failed to fetch habits:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleDeleteHabit = async (e: React.MouseEvent, habitId: string, habitName: string) => {
        e.stopPropagation();
        if (!window.confirm(`Are you sure you want to delete the habit "${habitName}"? This will remove all your progress, XP, achievements, and history for this habit. This action cannot be undone.`)) {
            return;
        }

        try {
            const response = await api.delete(`/habits/${habitId}`);

            // Update local habits list
            setHabits(habits.filter(h => h._id !== habitId));

            // Update user stats with recalculated values from server
            if (response.data.updatedUser && user) {
                updateUser({
                    ...user,
                    totalXP: response.data.updatedUser.totalXP,
                    level: response.data.updatedUser.level,
                    badges: response.data.updatedUser.badges
                });
            }
        } catch (error) {
            console.error('Failed to delete habit:', error);
            alert('Failed to delete habit. Please try again.');
        }
    };

    const totalStreak = habits.reduce((sum, habit) => sum + habit.currentStreak, 0);
    const totalCompletions = habits.reduce((sum, habit) => sum + habit.totalCompletions, 0);

    return (
        <div className="min-h-screen p-4 md:p-8">
            {/* Header */}
            <header className="max-w-7xl mx-auto mb-8">
                <div className="glass-card p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-2">
                                Welcome back, <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">{user?.username}</span>!
                                <div className="w-10 h-10 md:w-12 md:h-12 -mt-1">
                                    <dotlottie-player
                                        src="/WelcomeAnimation.json"
                                        background="transparent"
                                        speed="1"
                                        style={{ width: '250%', height: '250%' }}
                                        loop
                                        autoplay
                                    ></dotlottie-player>
                                </div>
                            </h1>
                            <p className="text-theme-secondary">Keep up the great work on your habits</p>
                        </div>
                        <div className="flex flex-wrap gap-3 self-start md:self-auto">
                            {user?.role === 'admin' && (
                                <button
                                    onClick={() => navigate('/admin')}
                                    className="btn-secondary flex items-center gap-2 border-red-500/30 hover:bg-red-500/10"
                                >
                                    <Shield className="w-5 h-5 text-red-400" />
                                    Admin Panel
                                </button>
                            )}
                            <button
                                onClick={() => navigate('/achievements')}
                                className="btn-secondary flex items-center gap-2"
                            >
                                <Trophy className="w-5 h-5 text-yellow-400" />
                                Achievements
                            </button>
                            <button
                                onClick={handleLogout}
                                className="btn-secondary flex items-center gap-2"
                            >
                                <LogOut className="w-5 h-5" />
                                Logout
                            </button>
                            <ThemeToggle />
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto">
                <MotivationalMessage user={user} habits={habits} />
            </div>

            {/* Stats Overview */}
            <div className="max-w-7xl mx-auto mb-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="stat-card">
                        <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl mb-3">
                            <Flame className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-3xl font-bold mb-1">{totalStreak}</h3>
                        <p className="text-theme-secondary">Total Streaks</p>
                    </div>

                    <div className="stat-card">
                        <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl mb-3">
                            <Trophy className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-3xl font-bold mb-1">Level {user?.level || 1}</h3>
                        <p className="text-theme-secondary">{user?.totalXP || 0} XP</p>
                    </div>

                    <div className="stat-card">
                        <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl mb-3">
                            <Target className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-3xl font-bold mb-1">{totalCompletions}</h3>
                        <p className="text-theme-secondary">Total Completions</p>
                    </div>
                </div>
            </div>

            {/* Achievement Badges */}
            {user?.badges && user.badges.length > 0 && (
                <div className="max-w-7xl mx-auto mb-8">
                    <div
                        className="glass-card p-6 cursor-pointer hover:scale-[1.02] transition-transform"
                        onClick={() => navigate('/achievements')}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <Trophy className="w-6 h-6 text-yellow-400" />
                                Achievement Badges
                            </h2>
                            <span className="text-sm text-purple-300 font-semibold">
                                View All →
                            </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {user.badges.slice(0, 4).map((badge, index) => (
                                <div
                                    key={index}
                                    className="bg-gradient-to-br from-yellow-400/20 to-orange-500/20 border-2 border-yellow-400/30 rounded-xl p-4 text-center hover:scale-105 transition-transform"
                                >
                                    <div className="text-4xl mb-2">{badge.icon}</div>
                                    <h3 className="font-bold text-sm mb-1">{badge.name}</h3>
                                    <p className="text-xs text-theme-secondary">{badge.description}</p>
                                </div>
                            ))}
                        </div>
                        {user.badges.length > 4 && (
                            <p className="text-center text-sm text-theme-secondary mt-4">
                                +{user.badges.length - 4} more badges
                            </p>
                        )}
                    </div>
                </div>
            )}

            {/* Habits Section */}
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Your Habits</h2>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="btn-primary flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        New Habit
                    </button>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
                    </div>
                ) : habits.length === 0 ? (
                    <div className="glass-card p-12 text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-white/5 rounded-full mb-4">
                            <Target className="w-10 h-10 text-theme-muted" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">No habits yet</h3>
                        <p className="text-theme-secondary mb-6">Create your first habit to start building consistency</p>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="btn-primary inline-flex items-center gap-2"
                        >
                            <Plus className="w-5 h-5" />
                            Create Your First Habit
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {habits.map((habit) => {
                            const IconComponent = iconMap[habit.icon] || Target;
                            return (
                                <div
                                    key={habit._id}
                                    onClick={() => navigate(`/habit/${habit._id}`)}
                                    className="glass-card-hover p-6"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div
                                            className="w-14 h-14 rounded-xl flex items-center justify-center"
                                            style={{ background: habit.color }}
                                        >
                                            <IconComponent className="w-8 h-8 text-white" />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {habit.currentStreak > 0 && (
                                                <div className="flex items-center gap-1 bg-orange-500/20 px-3 py-1 rounded-full border border-orange-500/30">
                                                    <Flame className="w-4 h-4 text-orange-400" />
                                                    <span className="text-sm font-semibold text-orange-300">{habit.currentStreak}</span>
                                                </div>
                                            )}
                                            <button
                                                onClick={(e) => handleDeleteHabit(e, habit._id, habit.name)}
                                                className="p-2 hover:bg-red-500/10 rounded-lg text-red-400 transition-colors group/delete"
                                                title="Delete Habit"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-bold mb-2">{habit.name}</h3>
                                    <p className="text-theme-secondary text-sm mb-4 line-clamp-2">{habit.description}</p>

                                    <div className="flex items-center justify-between text-sm">
                                        <div>
                                            <p className="text-theme-muted">Longest Streak</p>
                                            <p className="font-semibold text-purple-300">{habit.longestStreak} days</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-theme-muted">Completions</p>
                                            <p className="font-semibold text-green-300">{habit.totalCompletions}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Create Habit Modal */}
            {showCreateModal && (
                <CreateHabitModal
                    onClose={() => setShowCreateModal(false)}
                    onSuccess={() => {
                        setShowCreateModal(false);
                        fetchHabits();
                    }}
                />
            )}
        </div>
    );
}
