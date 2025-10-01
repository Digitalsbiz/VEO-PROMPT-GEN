import React from 'react';
import { FilmIcon, LogOutIcon, ShieldCheckIcon, InfoIcon } from './icons';

interface HeaderProps {
    userEmail: string;
    onLogout: () => void;
    isAdmin: boolean;
    onNavigateToAdmin: () => void;
    onNavigateToAbout: () => void;
    onNavigateToPrivacy: () => void;
}

export const Header: React.FC<HeaderProps> = ({ userEmail, onLogout, isAdmin, onNavigateToAdmin, onNavigateToAbout, onNavigateToPrivacy }) => {
    return (
        <header className="bg-slate-950/50 backdrop-blur-sm sticky top-0 z-10 border-b border-cyan-400/20 shadow-[0_5px_15px_rgba(0,0,0,0.3)]">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                     <FilmIcon className="w-8 h-8 text-cyan-400 animate-pulse" />
                    <h1 className="text-2xl font-bold text-slate-100 tracking-wider uppercase">
                        Veo Prompt <span className="text-cyan-400">Architect</span>
                    </h1>
                </div>
                <div className="flex items-center gap-2 md:gap-4 font-sans">
                     <button
                        onClick={onNavigateToAbout}
                        className="flex items-center gap-2 text-slate-400 hover:text-cyan-300 font-semibold py-2 px-3 rounded-md transition duration-200 ease-in-out text-sm"
                        aria-label="About this application"
                    >
                        <InfoIcon className="w-4 h-4" />
                        <span className="hidden md:block">About</span>
                    </button>
                     <button
                        onClick={onNavigateToPrivacy}
                        className="flex items-center gap-2 text-slate-400 hover:text-cyan-300 font-semibold py-2 px-3 rounded-md transition duration-200 ease-in-out text-sm"
                        aria-label="Privacy Policy"
                    >
                        <ShieldCheckIcon className="w-4 h-4" />
                        <span className="hidden md:block">Privacy</span>
                    </button>
                    <span className="text-sm text-cyan-400/70 hidden sm:block">{userEmail}</span>
                    {isAdmin && (
                         <button
                            onClick={onNavigateToAdmin}
                            className="flex items-center gap-2 bg-slate-700/50 border border-amber-400/30 hover:bg-amber-500/20 text-white font-semibold py-2 px-3 rounded-md transition duration-200 ease-in-out text-sm"
                            aria-label="Open Admin Panel"
                        >
                            <ShieldCheckIcon className="w-4 h-4" />
                            <span className="hidden md:block">Admin</span>
                        </button>
                    )}
                    <button
                        onClick={onLogout}
                        className="flex items-center gap-2 bg-slate-700/50 border border-cyan-400/30 hover:bg-cyan-500/20 text-white font-semibold py-2 px-3 rounded-md transition duration-200 ease-in-out text-sm"
                        aria-label="Log out"
                    >
                        <LogOutIcon className="w-4 h-4" />
                        <span className="hidden md:block">Log Out</span>
                    </button>
                </div>
            </div>
        </header>
    );
};