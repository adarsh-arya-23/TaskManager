import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { User } from '../types';
import api from '../utils/api';
import {
    ArrowLeft,
    Users,
    Activity,
    TrendingUp,
    Shield,
    BarChart3,
    UserCheck,
    Search,
    Edit2,
    Download,
    FileType,
    X,
    Save,
    Trash2
} from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';
import { generateFullUserPDFReport, generateFullUserCSVExport } from '../utils/exportUtils';

interface PlatformStats {
    totalUsers: number;
    totalHabits: number;
    totalLogs: number;
    completedLogs: number;
    completionRate: string;
    newUsers: number;
    activeUsers: number;
    habitsByCategory: { _id: string; count: number }[];
}

// User interface removed as it's now imported from ../types


export default function AdminDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState<PlatformStats | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editForm, setEditForm] = useState<Partial<User>>({});
    const [isExporting, setIsExporting] = useState(false);

    useEffect(() => {
        // Check if user is admin
        if (user?.role !== 'admin') {
            navigate('/dashboard');
            return;
        }

        fetchAdminData();
    }, [user, navigate]);

    const fetchAdminData = async () => {
        try {
            const [statsRes, usersRes] = await Promise.all([
                api.get('/admin/stats'),
                api.get('/admin/users')
            ]);

            setStats(statsRes.data);
            setUsers(usersRes.data);
        } catch (error) {
            console.error('Failed to fetch admin data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEditUser = (user: User) => {
        setEditForm({ ...user });
        setIsEditModalOpen(true);
    };

    const handleUpdateUser = async () => {
        if (!editForm._id) return;
        try {
            const response = await api.put(`/admin/users/${editForm._id}`, editForm);
            setUsers(users.map(u => u._id === editForm._id ? response.data : u));
            setIsEditModalOpen(false);
        } catch (error) {
            console.error('Failed to update user:', error);
            alert('Failed to update user details');
        }
    };

    const handleExport = async (user: User, format: 'pdf' | 'csv') => {
        setIsExporting(true);
        try {
            const res = await api.get(`/admin/users/${user._id}/activity`);
            const { habits, allLogs } = res.data;

            if (format === 'pdf') {
                generateFullUserPDFReport(user, habits, allLogs);
            } else {
                generateFullUserCSVExport(user, habits, allLogs);
            }
        } catch (error) {
            console.error('Failed to export data:', error);
            alert('Failed to fetch user data for export');
        } finally {
            setIsExporting(false);
        }
    };

    const handleDeleteUser = async (userId: string) => {
        if (!window.confirm('Are you sure you want to delete this user? This will remove all their habits and logs. This action cannot be undone.')) {
            return;
        }

        try {
            await api.delete(`/admin/users/${userId}`);
            setUsers(users.filter(u => u._id !== userId));
        } catch (error) {
            console.error('Failed to delete user:', error);
            alert('Failed to delete user');
        }
    };

    const filteredUsers = users.filter(u =>
        u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    if (!stats) {
        return null;
    }

    return (
        <div className="min-h-screen p-4 md:p-8">
            {/* Header */}
            <div className="max-w-7xl mx-auto mb-8">
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
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                            <Shield className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold mb-2">Admin Dashboard</h1>
                            <p className="text-theme-secondary">Monitor platform activity and user statistics</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Platform Statistics */}
            <div className="max-w-7xl mx-auto mb-8">
                <h2 className="text-2xl font-bold mb-4">Platform Statistics</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="stat-card">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl mb-3">
                            <Users className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold mb-1">{stats.totalUsers}</h3>
                        <p className="text-white/60 text-sm">Total Users</p>
                        <p className="text-green-400 text-xs mt-1">+{stats.newUsers} this week</p>
                    </div>

                    <div className="stat-card">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl mb-3">
                            <Activity className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold mb-1">{stats.totalHabits}</h3>
                        <p className="text-white/60 text-sm">Total Habits</p>
                    </div>

                    <div className="stat-card">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl mb-3">
                            <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold mb-1">{stats.completionRate}%</h3>
                        <p className="text-white/60 text-sm">Completion Rate</p>
                        <p className="text-white/40 text-xs mt-1">{stats.completedLogs}/{stats.totalLogs} logs</p>
                    </div>

                    <div className="stat-card">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl mb-3">
                            <UserCheck className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold mb-1">{stats.activeUsers}</h3>
                        <p className="text-white/60 text-sm">Active Users</p>
                        <p className="text-white/40 text-xs mt-1">Last 7 days</p>
                    </div>
                </div>
            </div>

            {/* Habits by Category */}
            <div className="max-w-7xl mx-auto mb-8">
                <div className="glass-card p-6">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-purple-400" />
                        Habits by Category
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {stats.habitsByCategory.map((cat) => (
                            <div key={cat._id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                                <p className="text-2xl font-bold">{cat.count}</p>
                                <p className="text-sm text-theme-secondary capitalize">{cat._id}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Users List */}
            <div className="max-w-7xl mx-auto">
                <div className="glass-card p-6">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Users className="w-5 h-5 text-blue-400" />
                        All Users ({users.length})
                    </h2>

                    {/* Search Bar */}
                    <div className="relative mb-6">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-theme-muted" />
                        <input
                            type="text"
                            placeholder="Search by username or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                        />
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="text-left py-3 px-4 text-white/80 font-semibold">Username</th>
                                    <th className="text-left py-3 px-4 text-white/80 font-semibold">Email</th>
                                    <th className="text-left py-3 px-4 text-white/80 font-semibold">Role</th>
                                    <th className="text-left py-3 px-4 text-white/80 font-semibold">Level</th>
                                    <th className="text-left py-3 px-4 text-white/80 font-semibold">XP</th>
                                    <th className="text-left py-3 px-4 text-white/80 font-semibold">Joined</th>
                                    <th className="text-right py-3 px-4 text-white/80 font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((u) => (
                                    <tr key={u._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="py-3 px-4">
                                            <span className="font-medium">{u.username}</span>
                                        </td>
                                        <td className="py-3 px-4 text-theme-secondary">{u.email}</td>
                                        <td className="py-3 px-4">
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${u.role === 'admin'
                                                ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                                                : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                                }`}>
                                                {u.role === 'admin' ? '👑 Admin' : '👤 User'}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className="font-semibold text-purple-300">Lv. {u.level}</span>
                                        </td>
                                        <td className="py-3 px-4 text-theme-secondary">{u.totalXP} XP</td>
                                        <td className="py-3 px-4 text-theme-secondary text-sm">
                                            {new Date(u.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="py-3 px-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleEditUser(u)}
                                                    className="p-2 hover:bg-white/10 rounded-lg text-blue-400 transition-colors"
                                                    title="Edit User"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleExport(u, 'pdf')}
                                                    className="p-2 hover:bg-white/10 rounded-lg text-purple-400 transition-colors"
                                                    title="Download PDF Progress"
                                                    disabled={isExporting}
                                                >
                                                    <FileType className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleExport(u, 'csv')}
                                                    className="p-2 hover:bg-white/10 rounded-lg text-green-400 transition-colors"
                                                    title="Download CSV History"
                                                    disabled={isExporting}
                                                >
                                                    <Download className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteUser(u._id)}
                                                    className="p-2 hover:bg-red-500/10 rounded-lg text-red-400 transition-colors"
                                                    title="Delete User"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Edit User Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="glass-card w-full max-w-md p-6 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold">Edit User Details</h3>
                            <button
                                onClick={() => setIsEditModalOpen(false)}
                                className="p-2 hover:bg-white/10 rounded-full text-theme-muted transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-theme-secondary mb-1">Username</label>
                                <input
                                    type="text"
                                    value={editForm.username || ''}
                                    onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 focus:ring-2 focus:ring-purple-500/50 outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-theme-secondary mb-1">Email Address</label>
                                <input
                                    type="email"
                                    value={editForm.email || ''}
                                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 focus:ring-2 focus:ring-purple-500/50 outline-none transition-all"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-theme-secondary mb-1">Level</label>
                                    <input
                                        type="number"
                                        value={editForm.level || 0}
                                        onChange={(e) => setEditForm({ ...editForm, level: parseInt(e.target.value) })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 focus:ring-2 focus:ring-purple-500/50 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-theme-secondary mb-1">Total XP</label>
                                    <input
                                        type="number"
                                        value={editForm.totalXP || 0}
                                        onChange={(e) => setEditForm({ ...editForm, totalXP: parseInt(e.target.value) })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 focus:ring-2 focus:ring-purple-500/50 outline-none transition-all"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-theme-secondary mb-1">Role</label>
                                <select
                                    value={editForm.role || 'user'}
                                    onChange={(e) => setEditForm({ ...editForm, role: e.target.value as any })}
                                    className="w-full bg-[#1e1432] border border-white/10 rounded-xl px-4 py-2 focus:ring-2 focus:ring-purple-500/50 outline-none transition-all appearance-none"
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-8">
                            <button
                                onClick={() => setIsEditModalOpen(false)}
                                className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl font-semibold transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdateUser}
                                className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-purple-500/25 transition-all"
                            >
                                <Save className="w-4 h-4" />
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
