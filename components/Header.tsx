
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
        <header className="bg-slate-900/70 backdrop-blur-sm sticky top-0 z-10 border-b border-slate-700">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                     <FilmIcon className="w-8 h-8 text-indigo-400" />
                    <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
                        Veo Prompt Architect
                    </h1>
                </div>
                <div className="flex items-center gap-2 md:gap-4">
                     <button
                        onClick={onNavigateToAbout}
                        className="flex items-center gap-2 text-slate-400 hover:text-slate-100 font-semibold py-2 px-3 rounded-md transition duration-200 ease-in-out text-sm"
                        aria-label="About this application"
                    >
                        <InfoIcon className="w-4 h-4" />
                        <span className="hidden md:block">About</span>
                    </button>
                     <button
                        onClick={onNavigateToPrivacy}
                        className="flex items-center gap-2 text-slate-400 hover:text-slate-100 font-semibold py-2 px-3 rounded-md transition duration-200 ease-in-out text-sm"
                        aria-label="Privacy Policy"
                    >
                        <ShieldCheckIcon className="w-4 h-4" />
                        <span className="hidden md:block">Privacy</span>
                    </button>
                    <span className="text-sm text-slate-400 hidden sm:block">{userEmail}</span>
                    {isAdmin && (
                         <button
                            onClick={onNavigateToAdmin}
                            className="flex items-center gap-2 bg-slate-700 hover:bg-amber-600 text-white font-semibold py-2 px-3 rounded-md transition duration-200 ease-in-out text-sm"
                            aria-label="Open Admin Panel"
                        >
                            <ShieldCheckIcon className="w-4 h-4" />
                            <span className="hidden md:block">Admin</span>
                        </button>
                    )}
                    <button
                        onClick={onLogout}
                        className="flex items-center gap-2 bg-slate-700 hover:bg-indigo-600 text-white font-semibold py-2 px-3 rounded-md transition duration-200 ease-in-out text-sm"
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
