import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';
import GoogleSignInButton from '../components/GoogleSignInButton';
import ThemeToggle from '../components/ThemeToggle';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to login. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSuccess = (token: string, user: any) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        navigate('/dashboard');
        window.location.reload();
    };

    const handleGoogleError = () => {
        setError('Failed to sign in with Google. Please try again.');
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <ThemeToggle floating />
            {/* Background Glows */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse-slow"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse-slow"></div>
            </div>

            <div className="w-full max-w-5xl flex flex-col md:flex-row glass-card overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border-white/10 group relative z-10">
                {/* Left Side: Animation (Hero) */}
                <div className="hidden md:flex md:w-1/2 bg-white flex-col justify-center items-center p-12 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-white pointer-events-none"></div>
                    <div className="w-full max-w-xs relative z-10">
                        <dotlottie-player
                            src="/Login.json"
                            background="transparent"
                            speed="1"
                            style={{ width: '100%', height: 'auto' }}
                            loop
                            autoplay
                        ></dotlottie-player>
                    </div>
                    <div className="text-center mt-8 relative z-10">
                        <h2 className="text-3xl font-black text-slate-800 font-montserrat tracking-tight mb-4">
                            Master Your <span className="text-purple-600">Habits</span>
                        </h2>
                        <p className="text-slate-500 font-medium max-w-sm">
                            Join 10,000+ users building a better version of themselves every single day.
                        </p>
                    </div>
                </div>

                {/* Right Side: Form (Action) */}
                <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-white/5 backdrop-blur-xl">
                    <div className="max-w-md mx-auto w-full">
                        <div className="mb-10 text-center md:text-left">
                            <h1 className="text-4xl font-black mb-3 font-poppins tracking-tight">
                                Welcome <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Back</span>
                            </h1>
                            <p className="text-theme-secondary font-medium">Continue your streak journey</p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-4">
                                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                                <p className="text-red-300 text-sm font-medium">{error}</p>
                            </div>
                        )}

                        <div className="mb-8">
                            <GoogleSignInButton
                                onSuccess={handleGoogleSuccess}
                                onError={handleGoogleError}
                            />
                        </div>

                        <div className="relative mb-8">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-white/10"></div>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold">
                                <span className="px-4 bg-transparent text-theme-muted backdrop-blur-md rounded-full">Or with Email</span>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-theme-muted uppercase tracking-widest mb-2 ml-1">
                                    Email Address
                                </label>
                                <div className="relative group/input">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-theme-muted group-focus-within/input:text-purple-400 transition-colors" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="input-field px-12"
                                        placeholder="name@company.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-theme-muted uppercase tracking-widest mb-2 ml-1">
                                    Password
                                </label>
                                <div className="relative group/input">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-theme-muted group-focus-within/input:text-purple-400 transition-colors" />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="input-field px-12"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-4 rounded-2xl transition-all duration-300 disabled:opacity-50 shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 group/btn active:scale-95"
                            >
                                {loading ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                                ) : (
                                    <>
                                        Sign In
                                        <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-10 text-center">
                            <p className="text-theme-muted font-medium tracking-tight">
                                New here?{' '}
                                <Link to="/signup" className="text-theme-primary hover:text-purple-400 font-bold underline decoration-purple-500/50 underline-offset-4 transition-all">
                                    Create account
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
