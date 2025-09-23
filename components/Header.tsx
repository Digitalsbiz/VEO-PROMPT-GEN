
import React from 'react';
import { FilmIcon } from './icons';

export const Header: React.FC = () => {
    return (
        <header className="bg-slate-900/70 backdrop-blur-sm sticky top-0 z-10 border-b border-slate-700">
            <div className="container mx-auto px-4 py-4 flex items-center gap-4">
                 <FilmIcon className="w-8 h-8 text-indigo-400" />
                <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
                    Veo Prompt Architect
                </h1>
            </div>
        </header>
    );
};
