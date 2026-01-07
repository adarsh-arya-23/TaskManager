import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';
import ParticleBackground from './ParticleBackground';
import ThemeToggle from './ThemeToggle';

interface AuthLayoutProps {
    children: ReactNode;
    animationKey: string;
}

export default function AuthLayout({ children, animationKey }: AuthLayoutProps) {
    // Detect reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const pageVariants = {
        initial: prefersReducedMotion
            ? { opacity: 0 }
            : {
                opacity: 0,
                scale: 0.96,
                y: 20,
            },
        animate: {
            opacity: 1,
            scale: 1,
            y: 0,
        },
        exit: prefersReducedMotion
            ? { opacity: 0 }
            : {
                opacity: 0,
                scale: 1.04,
                y: -20,
            },
    };

    const pageTransition = {
        type: 'spring' as const,
        stiffness: 300,
        damping: 30,
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            <ThemeToggle floating />

            {/* Particle Background */}
            <ParticleBackground />

            {/* Animated Content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={animationKey}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={pageVariants}
                    transition={pageTransition}
                    className="w-full max-w-5xl relative z-10"
                >
                    {children}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
