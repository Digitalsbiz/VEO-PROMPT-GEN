
import React, { useState, useRef, useEffect } from 'react';
import { PlayIcon, PauseIcon, Volume2Icon, VolumeXIcon, LockIcon } from './icons';
import { UserRole } from '../types';
import { Tooltip } from './Tooltip';

interface VideoCardProps {
    videoUrl: string;
    title: string;
    description: string;
    onLoadExample: () => void;
    isPremium?: boolean;
    userRole: UserRole;
}

export const VideoCard: React.FC<VideoCardProps> = ({ videoUrl, title, description, onLoadExample, isPremium, userRole }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(true); // Autoplay is on
    const [isMuted, setIsMuted] = useState(true);

    const togglePlayPause = () => {
        if (videoRef.current) {
            if (videoRef.current.paused) {
                videoRef.current.play();
                setIsPlaying(true);
            } else {
                videoRef.current.pause();
                setIsPlaying(false);
            }
        }
    };

    const toggleMute = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent toggling play/pause when clicking mute
        if (videoRef.current) {
            videoRef.current.muted = !videoRef.current.muted;
            setIsMuted(videoRef.current.muted);
        }
    };
    
    // Keyboard accessibility for play/pause
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            togglePlayPause();
        }
    };


    // Ensure state is in sync with video element properties
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => setIsPlaying(false);
        const handleVolumeChange = () => setIsMuted(video.muted);

        video.addEventListener('play', handlePlay);
        video.addEventListener('pause', handlePause);
        video.addEventListener('volumechange', handleVolumeChange);
        
        // Set initial state from element
        setIsPlaying(!video.paused);
        setIsMuted(video.muted);

        return () => {
            video.removeEventListener('play', handlePlay);
            video.removeEventListener('pause', handlePause);
            video.removeEventListener('volumechange', handleVolumeChange);
        };
    }, []);

    const isLocked = isPremium && userRole === 'free';


    return (
        <div className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700 flex flex-col group transition-all duration-300 hover:shadow-2xl hover:border-indigo-500/50">
            <div
                className="relative aspect-video bg-black cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-800 rounded-t-lg"
                onClick={togglePlayPause}
                onKeyDown={handleKeyDown}
                role="button"
                tabIndex={0}
                aria-label={isPlaying ? `Pause video: ${title}` : `Play video: ${title}`}
            >
                <video
                    ref={videoRef}
                    src={videoUrl}
                    className="w-full h-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                    tabIndex={-1} // The container is focusable, not the video element itself
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                    <div className="flex items-center gap-4 p-2 bg-black/50 rounded-full">
                         {isPlaying ? (
                            <PauseIcon className="w-8 h-8 text-white drop-shadow-lg" />
                        ) : (
                            <PlayIcon className="w-8 h-8 text-white drop-shadow-lg" />
                        )}
                    </div>
                </div>
                 <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button 
                        onClick={toggleMute} 
                        className="p-2 bg-black/50 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                        aria-label={isMuted ? 'Unmute' : 'Mute'}
                    >
                        {isMuted ? (
                            <VolumeXIcon className="w-5 h-5 text-white" />
                        ) : (
                            <Volume2Icon className="w-5 h-5 text-white" />
                        )}
                    </button>
                </div>
                {isLocked && (
                    <div className="absolute top-2 left-2 bg-amber-500 text-slate-900 text-xs font-bold px-2 py-1 rounded-full">
                        PRO
                    </div>
                )}
            </div>
            <div className="p-4 flex flex-col flex-grow">
                <h3 className="font-bold text-slate-100 mb-2">{title}</h3>
                <p className="text-slate-400 text-sm mb-4 flex-grow">{description}</p>
                 {isLocked ? (
                    <Tooltip text="This example uses a PRO template. Upgrade to a Paid account to use it.">
                        <button
                            disabled
                            className="w-full mt-auto bg-slate-700 text-slate-500 font-semibold py-2 px-4 rounded-md transition duration-200 ease-in-out text-sm flex items-center justify-center gap-2 cursor-not-allowed"
                        >
                            <LockIcon className="w-4 h-4" />
                            Upgrade to Use
                        </button>
                    </Tooltip>
                 ) : (
                    <button
                        onClick={onLoadExample}
                        className="w-full mt-auto bg-slate-700 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md transition duration-200 ease-in-out text-sm"
                    >
                        Use this Example
                    </button>
                 )}
            </div>
        </div>
    );
};
