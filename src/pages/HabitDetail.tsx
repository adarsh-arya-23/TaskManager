import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { Habit, DailyLog } from '../types';
import {
    ArrowLeft,
    Flame,
    Trophy,
    Calendar as CalendarIcon,
    TrendingUp,
    Check,
    X,
    Download,
    FileText,
    Share2,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';
import { useAuth } from '../contexts/AuthContext';
import { generatePDFReport, generateCSVExport, generateShareableReport, copyToClipboard } from '../utils/exportUtils';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isFuture, parseISO, addMonths, subMonths } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function HabitDetail() {
    const { habitId } = useParams<{ habitId: string }>();
    const navigate = useNavigate();
    const [habit, setHabit] = useState<Habit | null>(null);
    const [logs, setLogs] = useState<DailyLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [showNoteModal, setShowNoteModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [noteText, setNoteText] = useState('');
    const [exportMessage, setExportMessage] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        if (habitId) {
            fetchHabitData();
        }
    }, [habitId]);

    const fetchHabitData = async () => {
        try {
            const [habitRes, logsRes] = await Promise.all([
                api.get<Habit>(`/habits/${habitId}`),
                api.get<DailyLog[]>(`/habits/${habitId}/logs`)
            ]);
            setHabit(habitRes.data);
            setLogs(logsRes.data);
        } catch (error) {
            console.error('Failed to fetch habit data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleDay = async (date: Date) => {
        if (isFuture(date) || !habit) return;

        const dateStr = format(date, 'yyyy-MM-dd');
        const existingLog = logs.find(log => format(parseISO(log.date), 'yyyy-MM-dd') === dateStr);

        // Set the selected date and existing note if any
        setSelectedDate(date);
        setNoteText(existingLog?.note || '');
        setShowNoteModal(true);
    };

    const handleSaveNote = async (completed: boolean) => {
        if (!selectedDate || !habit) return;

        const dateStr = format(selectedDate, 'yyyy-MM-dd');
        const existingLog = logs.find(log => format(parseISO(log.date), 'yyyy-MM-dd') === dateStr);

        try {
            if (existingLog) {
                // Update existing log
                await api.put(`/habits/${habitId}/logs/${existingLog._id}`, {
                    completed: completed,
                    note: noteText
                });
            } else {
                // Create new log with note
                await api.post(`/habits/${habitId}/logs`, {
                    date: dateStr,
                    completed: completed,
                    note: noteText
                });
            }
            fetchHabitData();
            setShowNoteModal(false);
            setNoteText('');
        } catch (error) {
            console.error('Failed to update log:', error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    if (!habit) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Habit not found</h2>
                    <button onClick={() => navigate('/dashboard')} className="btn-primary">
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    // Calendar calculations
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

    // Stats calculations
    const completedLogs = logs.filter(log => log.completed);
    const completionRate = logs.length > 0 ? (completedLogs.length / logs.length) * 100 : 0;

    // Chart data (last 30 days)
    const chartData = logs
        .slice(-30)
        .map(log => ({
            date: format(parseISO(log.date), 'MMM dd'),
            completed: log.completed ? 1 : 0
        }));

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

                <div className="glass-card p-6 md:p-8">
                    <div className="flex items-start gap-4">
                        <div
                            className="w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center flex-shrink-0"
                            style={{ background: habit.color }}
                        >
                            <span className="text-3xl md:text-4xl">💪</span>
                        </div>
                        <div className="flex-1">
                            <h1 className="text-3xl md:text-4xl font-bold mb-2">{habit.name}</h1>
                            <p className="text-white/60 mb-4">{habit.description}</p>
                            <div className="flex flex-wrap gap-3">
                                <div className="badge">
                                    <Flame className="w-4 h-4 mr-1" />
                                    {habit.currentStreak} Day Streak
                                </div>
                                <div className="badge">
                                    <Trophy className="w-4 h-4 mr-1" />
                                    Best: {habit.longestStreak} Days
                                </div>
                                <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                                    {habit.goalType === 'daily' ? '📅 Daily Goal' : '📊 Weekly Goal'}
                                </div>
                                <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${habit.difficultyLevel === 'easy' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                                    habit.difficultyLevel === 'medium' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
                                        'bg-red-500/20 text-red-300 border border-red-500/30'
                                    }`}>
                                    {habit.difficultyLevel === 'easy' ? '⭐ Easy' :
                                        habit.difficultyLevel === 'medium' ? '⭐⭐ Medium' :
                                            '⭐⭐⭐ Hard'} ({habit.xpPerCompletion} XP)
                                </div>
                                {habit.reminderEnabled && habit.reminderTime && (
                                    <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                                        🔔 {habit.reminderTime}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Export/Backup Section */}
            <div className="max-w-6xl mx-auto mb-8">
                <div className="glass-card p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <Download className="w-5 h-5 text-purple-400" />
                                Export & Backup
                            </h2>
                            <p className="text-sm text-white/60 mt-1">Download your progress or share with others</p>
                        </div>
                    </div>

                    {exportMessage && (
                        <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-300 text-sm">
                            {exportMessage}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* PDF Report */}
                        <button
                            onClick={() => {
                                if (habit) {
                                    generatePDFReport(habit, logs, user?.username || 'User');
                                    setExportMessage('✅ PDF report downloaded successfully!');
                                    setTimeout(() => setExportMessage(''), 3000);
                                }
                            }}
                            className="flex flex-col items-center gap-3 p-6 bg-gradient-to-br from-red-500/20 to-orange-500/20 border-2 border-red-500/30 rounded-xl hover:scale-105 transition-transform group"
                        >
                            <div className="w-12 h-12 rounded-full bg-red-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <FileText className="w-6 h-6 text-red-300" />
                            </div>
                            <div className="text-center">
                                <h3 className="font-bold text-white mb-1">PDF Report</h3>
                                <p className="text-xs text-white/60">Detailed progress report</p>
                            </div>
                        </button>

                        {/* CSV Export */}
                        <button
                            onClick={() => {
                                if (habit) {
                                    generateCSVExport(habit, logs);
                                    setExportMessage('✅ CSV file downloaded successfully!');
                                    setTimeout(() => setExportMessage(''), 3000);
                                }
                            }}
                            className="flex flex-col items-center gap-3 p-6 bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-2 border-green-500/30 rounded-xl hover:scale-105 transition-transform group"
                        >
                            <div className="w-12 h-12 rounded-full bg-green-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Download className="w-6 h-6 text-green-300" />
                            </div>
                            <div className="text-center">
                                <h3 className="font-bold text-white mb-1">CSV History</h3>
                                <p className="text-xs text-white/60">Raw data export</p>
                            </div>
                        </button>

                        {/* Share Report */}
                        <button
                            onClick={async () => {
                                if (habit) {
                                    const shareText = generateShareableReport(habit, logs, user?.username || 'User');
                                    const success = await copyToClipboard(shareText);
                                    if (success) {
                                        setExportMessage('✅ Report copied to clipboard! Share it with your mentor.');
                                    } else {
                                        setExportMessage('❌ Failed to copy. Please try again.');
                                    }
                                    setTimeout(() => setExportMessage(''), 3000);
                                }
                            }}
                            className="flex flex-col items-center gap-3 p-6 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-2 border-blue-500/30 rounded-xl hover:scale-105 transition-transform group"
                        >
                            <div className="w-12 h-12 rounded-full bg-blue-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Share2 className="w-6 h-6 text-blue-300" />
                            </div>
                            <div className="text-center">
                                <h3 className="font-bold text-white mb-1">Share Report</h3>
                                <p className="text-xs text-white/60">Copy to clipboard</p>
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="max-w-6xl mx-auto mb-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="stat-card">
                        <TrendingUp className="w-8 h-8 text-green-400 mb-2 mx-auto" />
                        <h3 className="text-2xl font-bold mb-1">{completionRate.toFixed(0)}%</h3>
                        <p className="text-white/60 text-sm">Completion Rate</p>
                    </div>
                    <div className="stat-card">
                        <Check className="w-8 h-8 text-blue-400 mb-2 mx-auto" />
                        <h3 className="text-2xl font-bold mb-1">{completedLogs.length}</h3>
                        <p className="text-white/60 text-sm">Completed Days</p>
                    </div>
                    <div className="stat-card">
                        <X className="w-8 h-8 text-red-400 mb-2 mx-auto" />
                        <h3 className="text-2xl font-bold mb-1">{logs.length - completedLogs.length}</h3>
                        <p className="text-white/60 text-sm">Missed Days</p>
                    </div>
                    <div className="stat-card">
                        <Trophy className="w-8 h-8 text-purple-400 mb-2 mx-auto" />
                        <h3 className="text-2xl font-bold mb-1">{habit.totalCompletions}</h3>
                        <p className="text-white/60 text-sm">Total Completions</p>
                    </div>
                </div>
            </div>

            {/* Activity Heatmap - GitHub Style */}
            <div className="max-w-6xl mx-auto mb-8">
                <div className="glass-card p-6 md:p-8">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <Flame className="w-6 h-6" />
                        Activity Heatmap
                    </h2>
                    <p className="text-white/60 text-sm mb-6">
                        Your consistency over the last 12 weeks - darker colors mean better consistency!
                    </p>

                    {/* Heatmap Grid */}
                    <div className="overflow-x-auto">
                        <div className="inline-flex flex-col gap-1 min-w-full">
                            {/* Day labels */}
                            <div className="flex gap-1 mb-2">
                                <div className="w-8"></div>
                                {Array.from({ length: 12 }).map((_, weekIndex) => {
                                    const weekDate = new Date();
                                    weekDate.setDate(weekDate.getDate() - (11 - weekIndex) * 7);
                                    return (
                                        <div key={weekIndex} className="flex-1 min-w-[12px]">
                                            {weekIndex % 2 === 0 && (
                                                <span className="text-xs text-white/40">
                                                    {format(weekDate, 'MMM')}
                                                </span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Heatmap rows for each day of week */}
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((dayName, dayIndex) => (
                                <div key={dayName} className="flex gap-1 items-center">
                                    <div className="w-8 text-xs text-white/40">{dayName}</div>
                                    <div className="flex gap-1 flex-1">
                                        {Array.from({ length: 12 }).map((_, weekIndex) => {
                                            const cellDate = new Date();
                                            cellDate.setDate(cellDate.getDate() - (11 - weekIndex) * 7 - (cellDate.getDay() - dayIndex));

                                            const dateStr = format(cellDate, 'yyyy-MM-dd');
                                            const log = logs.find(l => format(parseISO(l.date), 'yyyy-MM-dd') === dateStr);
                                            const isCompleted = log?.completed;
                                            const isFutureDate = isFuture(cellDate);
                                            const hasNote = log?.note && log.note.trim().length > 0;

                                            let bgColor = 'bg-white/5'; // No activity
                                            if (isFutureDate) {
                                                bgColor = 'bg-white/5 opacity-30';
                                            } else if (isCompleted) {
                                                bgColor = 'bg-green-500/80'; // Completed - bright green
                                            } else if (log && !isCompleted) {
                                                bgColor = 'bg-red-500/40'; // Missed - red
                                            }

                                            return (
                                                <div
                                                    key={`${weekIndex}-${dayIndex}`}
                                                    className={`flex-1 aspect-square rounded-sm ${bgColor} hover:ring-2 hover:ring-purple-400 transition-all cursor-pointer relative group min-w-[12px]`}
                                                    title={`${dateStr}${isCompleted ? ' - Completed' : log ? ' - Missed' : ' - No activity'}${hasNote ? `\n📝 ${log.note}` : ''}`}
                                                    onClick={() => !isFutureDate && handleToggleDay(cellDate)}
                                                >
                                                    {hasNote && (
                                                        <span className="absolute inset-0 flex items-center justify-center text-[8px]">📝</span>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Heatmap Legend */}
                    <div className="flex items-center gap-3 mt-6 pt-6 border-t border-white/10">
                        <span className="text-sm text-white/60">Less</span>
                        <div className="flex gap-1">
                            <div className="w-4 h-4 rounded-sm bg-white/5"></div>
                            <div className="w-4 h-4 rounded-sm bg-green-500/20"></div>
                            <div className="w-4 h-4 rounded-sm bg-green-500/40"></div>
                            <div className="w-4 h-4 rounded-sm bg-green-500/60"></div>
                            <div className="w-4 h-4 rounded-sm bg-green-500/80"></div>
                        </div>
                        <span className="text-sm text-white/60">More</span>
                        <div className="ml-4 flex items-center gap-2">
                            <div className="w-4 h-4 rounded-sm bg-red-500/40"></div>
                            <span className="text-sm text-white/60">Missed</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Calendar */}
            <div className="max-w-6xl mx-auto mb-8">
                <div className="glass-card p-6 md:p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <CalendarIcon className="w-6 h-6" />
                            Activity Calendar
                        </h2>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <div className="text-white/60 font-semibold min-w-[140px] text-center">
                                {format(currentMonth, 'MMMM yyyy')}
                            </div>
                            <button
                                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-2 md:gap-3">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} className="text-center text-white/40 text-xs md:text-sm font-semibold mb-2">
                                {day}
                            </div>
                        ))}

                        {/* Empty cells for days before month starts */}
                        {Array.from({ length: monthStart.getDay() }).map((_, i) => (
                            <div key={`empty-${i}`} />
                        ))}

                        {/* Calendar days */}
                        {daysInMonth.map(day => {
                            const dateStr = format(day, 'yyyy-MM-dd');
                            const log = logs.find(l => format(parseISO(l.date), 'yyyy-MM-dd') === dateStr);
                            const isCompleted = log?.completed;
                            const isMissed = log && !log.completed;
                            const isTodayDate = isToday(day);
                            const isFutureDate = isFuture(day);

                            let className = 'calendar-day ';
                            if (isCompleted) className += 'calendar-day-completed';
                            else if (isMissed) className += 'calendar-day-missed';
                            else if (isTodayDate) className += 'calendar-day-today';
                            else if (isFutureDate) className += 'calendar-day-future';
                            else className += 'bg-white/5 hover:bg-white/10 cursor-pointer';

                            const hasNote = log?.note && log.note.trim().length > 0;

                            return (
                                <button
                                    key={dateStr}
                                    onClick={() => handleToggleDay(day)}
                                    disabled={isFutureDate}
                                    className={className}
                                    title={hasNote ? `${dateStr}\n📝 ${log.note}` : dateStr}
                                >
                                    <div className="relative">
                                        {format(day, 'd')}
                                        {hasNote && (
                                            <span className="absolute -top-1 -right-1 text-xs">📝</span>
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Legend */}
                    <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t border-white/10">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-gradient-to-br from-green-400 to-emerald-500"></div>
                            <span className="text-sm text-white/60">Completed</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-red-500/20 border border-red-500/30"></div>
                            <span className="text-sm text-white/60">Missed</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-purple-500/30 border-2 border-purple-400"></div>
                            <span className="text-sm text-white/60">Today</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm">📝</span>
                            <span className="text-sm text-white/60">Has Note</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Progress Chart */}
            {chartData.length > 0 && (
                <div className="max-w-6xl mx-auto">
                    <div className="glass-card p-6 md:p-8">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <TrendingUp className="w-6 h-6" />
                            30-Day Progress
                        </h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis
                                    dataKey="date"
                                    stroke="rgba(255,255,255,0.5)"
                                    style={{ fontSize: '12px' }}
                                />
                                <YAxis
                                    stroke="rgba(255,255,255,0.5)"
                                    style={{ fontSize: '12px' }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(0,0,0,0.8)',
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        borderRadius: '8px'
                                    }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="completed"
                                    stroke="#a855f7"
                                    strokeWidth={3}
                                    dot={{ fill: '#a855f7', r: 4 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            {/* Enhanced Note Modal */}
            {showNoteModal && selectedDate && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="glass-card p-6 md:p-8 w-full max-w-md">
                        <h3 className="text-xl font-bold mb-2">
                            {format(selectedDate, 'MMMM dd, yyyy')}
                        </h3>
                        <p className="text-white/60 text-sm mb-6">
                            Mark this day and optionally add a note
                        </p>

                        {/* Status Selection */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-white/80 mb-3">
                                Did you complete this habit? *
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => handleSaveNote(true)}
                                    className="p-4 rounded-xl bg-green-500/20 border-2 border-green-500/50 hover:bg-green-500/30 transition-all group"
                                >
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-12 h-12 rounded-full bg-green-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <Check className="w-7 h-7 text-green-300" />
                                        </div>
                                        <span className="font-semibold text-green-300">Completed</span>
                                        <span className="text-xs text-white/60">I did it! ✓</span>
                                    </div>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => handleSaveNote(false)}
                                    className="p-4 rounded-xl bg-red-500/20 border-2 border-red-500/50 hover:bg-red-500/30 transition-all group"
                                >
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-12 h-12 rounded-full bg-red-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <X className="w-7 h-7 text-red-300" />
                                        </div>
                                        <span className="font-semibold text-red-300">Missed</span>
                                        <span className="text-xs text-white/60">Couldn't do it</span>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Optional Note */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-white/80 mb-2">
                                Add a note (optional)
                            </label>
                            <textarea
                                value={noteText}
                                onChange={(e) => setNoteText(e.target.value)}
                                className="input-field resize-none"
                                rows={3}
                                placeholder="e.g., 'Ate salad today!' or 'Missed because of exam'"
                            />
                            <p className="text-xs text-white/40 mt-2">
                                💡 Tip: Add reflections to track your progress better
                            </p>
                        </div>

                        {/* Cancel Button */}
                        <button
                            onClick={() => {
                                setShowNoteModal(false);
                                setNoteText('');
                            }}
                            className="btn-secondary w-full"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
