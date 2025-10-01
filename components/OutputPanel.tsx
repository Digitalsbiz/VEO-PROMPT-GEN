import React from 'react';
import { CodeBlock } from './CodeBlock';
import { JsonIcon, AlertTriangleIcon } from './icons';

interface OutputPanelProps {
    jsonOutput: string;
    isLoading: boolean;
    error: string | null;
    customCss: string;
}

const SkeletonLoader: React.FC = () => (
    <div className="animate-pulse space-y-4">
        <div className="h-4 bg-slate-700/50 rounded w-3/4"></div>
        <div className="h-4 bg-slate-700/50 rounded w-1/2"></div>
        <div className="h-4 bg-slate-700/50 rounded w-full"></div>
        <div className="h-4 bg-slate-700/50 rounded w-5/6"></div>
         <div className="h-4 bg-slate-700/50 rounded w-3/4"></div>
        <div className="h-4 bg-slate-700/50 rounded w-1/2"></div>
         <div className="h-4 bg-slate-700/50 rounded w-4/6"></div>
    </div>
);


export const OutputPanel: React.FC<OutputPanelProps> = ({ jsonOutput, isLoading, error, customCss }) => {
    const renderContent = () => {
        if (isLoading) {
            return <SkeletonLoader />;
        }
        if (error) {
            return (
                <div className="text-red-400 bg-red-900/50 p-4 rounded-md flex items-center gap-3">
                    <AlertTriangleIcon className="w-6 h-6 flex-shrink-0" />
                    <span>{error}</span>
                </div>
            );
        }
        if (jsonOutput) {
            return <CodeBlock code={jsonOutput} customCss={customCss} />;
        }
        return (
            <div className="text-center text-slate-500 flex flex-col items-center justify-center h-full font-sans">
                <JsonIcon className="w-16 h-16 mb-4 text-slate-600" />
                <p className="font-medium">Your generated JSON will appear here.</p>
                <p className="text-sm">Fill out the form and click "Generate Prompt" to start.</p>
            </div>
        );
    };

    return (
        <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-lg border border-cyan-400/30 shadow-2xl shadow-cyan-500/5 min-h-[400px] lg:min-h-[500px] flex flex-col">
            <h2 className="text-xl font-semibold text-slate-100 mb-4 flex-shrink-0 uppercase tracking-wider">2. Generated <span className="text-cyan-400">JSON</span> Output</h2>
            <div className="flex-grow bg-slate-950/70 rounded-md p-4 overflow-auto font-sans">
                {renderContent()}
            </div>
        </div>
    );
};