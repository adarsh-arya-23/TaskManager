import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface ThemeToggleProps {
    floating?: boolean;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ floating = false }) => {
    const { theme, toggleTheme } = useTheme();

    const buttonClasses = floating
        ? "fixed top-6 right-6 z-[60] p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-xl hover:scale-110 transition-all duration-300 group"
        : "p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-300 group";

    return (
        <button
            onClick={toggleTheme}
            className={buttonClasses}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
            {theme === 'light' ? (
                <Moon className="w-5 h-5 text-slate-700 group-hover:text-purple-600 transition-colors" />
            ) : (
                <Sun className="w-5 h-5 text-yellow-400 group-hover:text-yellow-300 transition-colors" />
            )}
        </button>
    );
};

export default ThemeToggle;
