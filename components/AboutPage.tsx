
import React from 'react';
import { FilmIcon, MagicWandIcon, LightbulbIcon, ShieldCheckIcon } from './icons';

interface AboutPageProps {
    onBackToApp: () => void;
}

const FeatureIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <polyline points="10 9 9 9 8 9"></polyline>
    </svg>
);

export const AboutPage: React.FC<AboutPageProps> = ({ onBackToApp }) => {
    return (
        <div className="min-h-screen bg-slate-900 text-slate-200 font-sans flex flex-col items-center p-4 md:p-8">
            <div className="w-full max-w-4xl">
                <header className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <FilmIcon className="w-8 h-8 text-indigo-400" />
                        <h1 className="text-3xl font-bold text-slate-100 tracking-tight">
                            About Veo Prompt Architect
                        </h1>
                    </div>
                    <button
                        onClick={onBackToApp}
                        className="bg-slate-700 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md transition duration-200 ease-in-out text-sm"
                    >
                        Back to App
                    </button>
                </header>

                <div className="bg-slate-800/50 border border-slate-700 rounded-lg shadow-lg p-8 space-y-8">
                    <section>
                        <h2 className="text-2xl font-semibold text-indigo-300 mb-3">What is Veo Prompt Architect?</h2>
                        <p className="text-slate-300 leading-relaxed">
                            Veo Prompt Architect is a specialized creative tool designed to bridge the gap between a video concept and a production-ready prompt for Google's Veo text-to-video model. It provides structured templates that guide creators, helping them translate their natural language ideas into the detailed, cinematic JSON format that Veo understands best. Whether you're a filmmaker, marketer, or artist, this tool empowers you to craft visually stunning video narratives with precision and ease.
                        </p>
                    </section>
                    
                    <section>
                        <h2 className="text-2xl font-semibold text-emerald-300 mb-3">Powered by Google Gemini</h2>
                        <p className="text-slate-300 leading-relaxed">
                            At its core, Veo Prompt Architect leverages the advanced reasoning and language capabilities of <span className="font-semibold text-white">Google's Gemini model</span>. When you fill in a template and click "Generate," your inputs are sent to Gemini, which acts as a world-class creative director. It enriches your simple descriptions with cinematic language, adheres to the strict JSON structure, and delivers a prompt that is ready to generate breathtaking video content with Veo.
                        </p>
                    </section>
                    
                    <section>
                        <h2 className="text-2xl font-semibold text-amber-300 mb-3">Key Features</h2>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <li className="flex items-start gap-4 p-4 bg-slate-800 rounded-lg">
                                <MagicWandIcon className="w-6 h-6 text-amber-300 flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-semibold text-slate-100">AI-Powered Generation</h3>
                                    <p className="text-slate-400 text-sm">Transform simple inputs into rich, cinematic JSON prompts with the power of Gemini.</p>
                                </div>
                            </li>
                             <li className="flex items-start gap-4 p-4 bg-slate-800 rounded-lg">
                                <FeatureIcon className="w-6 h-6 text-amber-300 flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-semibold text-slate-100">Template-Driven Workflow</h3>
                                    <p className="text-slate-400 text-sm">Start with professionally crafted templates for various styles like product launches, film trailers, and more.</p>
                                </div>
                            </li>
                             <li className="flex items-start gap-4 p-4 bg-slate-800 rounded-lg">
                                <LightbulbIcon className="w-6 h-6 text-amber-300 flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-semibold text-slate-100">Inspiration Showcase</h3>
                                    <p className="text-slate-400 text-sm">Explore examples and load their configurations with a single click to jumpstart your creativity.</p>
                                </div>
                            </li>
                             <li className="flex items-start gap-4 p-4 bg-slate-800 rounded-lg">
                                <ShieldCheckIcon className="w-6 h-6 text-amber-300 flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-semibold text-slate-100">User & Role Management</h3>
                                    <p className="text-slate-400 text-sm">Features premium templates and generation limits, all managed through a comprehensive admin panel.</p>
                                </div>
                            </li>
                        </ul>
                    </section>
                </div>
                 <footer className="text-center p-4 mt-4 text-slate-500 text-sm">
                    <p>Designed for creative video professionals.</p>
                </footer>
            </div>
        </div>
    );
};
