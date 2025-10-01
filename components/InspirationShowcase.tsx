import React from 'react';
import { ShowcaseVideo } from '../constants';
import { VideoCard } from './VideoCard';
import { LightbulbIcon } from './icons';
import { UserRole } from '../types';

interface InspirationShowcaseProps {
    videos: ShowcaseVideo[];
    onLoadExample: (exampleId: string) => void;
    userRole: UserRole;
}

export const InspirationShowcase: React.FC<InspirationShowcaseProps> = ({ videos, onLoadExample, userRole }) => {
    return (
        <section className="bg-slate-900/60 backdrop-blur-md p-6 rounded-lg border border-cyan-400/30 shadow-2xl shadow-cyan-500/5">
            <div className="flex items-center gap-3 mb-6">
                <LightbulbIcon className="w-8 h-8 text-amber-300" />
                <h2 className="text-2xl font-bold text-slate-100 uppercase tracking-wider">Inspiration <span className="text-cyan-400">Showcase</span></h2>
            </div>
            <p className="text-slate-400 mb-6 max-w-3xl font-sans">
                See what's possible with the Veo Prompt Architect. These short clips were generated from prompts created with our templates.
                Click "Use this Example" on any video to load its configuration and start customizing.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {videos.map(video => (
                    <VideoCard 
                        key={video.id}
                        videoUrl={video.videoUrl}
                        title={video.title}
                        description={video.description}
                        onLoadExample={() => onLoadExample(video.exampleId)}
                        isPremium={video.isPremium}
                        userRole={userRole}
                    />
                ))}
            </div>
        </section>
    );
};