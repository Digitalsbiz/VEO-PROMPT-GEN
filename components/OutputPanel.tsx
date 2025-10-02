import React, { useState, useEffect } from 'react';
import { CodeBlock } from './CodeBlock';
import { JsonIcon, AlertTriangleIcon, ImageIcon } from './icons';
import { ReferenceImage } from '../types';

interface OutputPanelProps {
    jsonOutput: string;
    isLoading: boolean;
    error: string | null;
    customCss: string;
    storyboardImages: ReferenceImage[];
    isGeneratingStoryboard: boolean;
    storyboardError: string | null;
}

const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500 ${
            active
                ? 'bg-slate-950/70 text-cyan-300'
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
        }`}
        role="tab"
        aria-selected={active}
    >
        {children}
    </button>
);


const JsonSkeletonLoader: React.FC = () => (
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

const StoryboardSkeleton: React.FC = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
            <div key={i} className="aspect-video bg-slate-700/50 rounded animate-pulse"></div>
        ))}
    </div>
);

export const OutputPanel: React.FC<OutputPanelProps> = ({ 
    jsonOutput, 
    isLoading, 
    error, 
    customCss,
    storyboardImages,
    isGeneratingStoryboard,
    storyboardError
}) => {
    const [activeTab, setActiveTab] = useState<'json' | 'preview'>('json');
    
    useEffect(() => {
        if (jsonOutput && !isLoading) {
            setActiveTab('json');
        }
    }, [jsonOutput, isLoading]);

    const renderJsonContent = () => {
        if (isLoading) {
            return <JsonSkeletonLoader />;
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

    const renderPreviewContent = () => {
        if (!jsonOutput && !isLoading && !error) {
             return (
                <div className="text-center text-slate-500 flex flex-col items-center justify-center h-full font-sans">
                    <ImageIcon className="w-16 h-16 mb-4 text-slate-600" />
                    <p className="font-medium">A visual preview will appear here after generation.</p>
                </div>
            );
        }

        if (isGeneratingStoryboard || (isLoading && !jsonOutput)) {
            return (
                <div>
                    <p className="text-sm text-slate-400 mb-4 text-center">Generating visual storyboard from JSON...</p>
                    <StoryboardSkeleton />
                </div>
            );
        }
        
        if (storyboardError) {
             return (
                <div className="text-red-400 bg-red-900/50 p-4 rounded-md flex items-center gap-3">
                    <AlertTriangleIcon className="w-6 h-6 flex-shrink-0" />
                    <span>{storyboardError}</span>
                </div>
            );
        }
        
        if (storyboardImages.length > 0) {
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {storyboardImages.map((image, index) => (
                        <div key={index} className="aspect-video rounded-lg overflow-hidden border-2 border-slate-700 bg-slate-800">
                             <img
                                src={`data:${image.mimeType};base64,${image.data}`}
                                alt={`Storyboard frame ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ))}
                </div>
            );
        }
        
        if (jsonOutput && !error) {
            return (
                <div className="text-center text-slate-500 flex flex-col items-center justify-center h-full font-sans">
                    <ImageIcon className="w-16 h-16 mb-4 text-slate-600" />
                    <p className="font-medium">No preview available.</p>
                    <p className="text-sm">Storyboard generation may have completed with no images.</p>
                </div>
           );
        }
        
        // Fallback for initial state before any generation
        return (
            <div className="text-center text-slate-500 flex flex-col items-center justify-center h-full font-sans">
                <ImageIcon className="w-16 h-16 mb-4 text-slate-600" />
                <p className="font-medium">A visual preview will appear here after generation.</p>
            </div>
        );
    };


    return (
        <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-lg border border-cyan-400/30 shadow-2xl shadow-cyan-500/5 min-h-[400px] lg:min-h-[500px] flex flex-col">
             <div className="flex items-end justify-between mb-4 flex-shrink-0">
                 <h2 className="text-xl font-semibold text-slate-100 uppercase tracking-wider">2. Generated <span className="text-cyan-400">Output</span></h2>
                 <div className="flex border-b border-b-slate-700" role="tablist">
                    <TabButton active={activeTab === 'json'} onClick={() => setActiveTab('json')}>
                        <JsonIcon className="w-4 h-4" />
                        <span>JSON</span>
                    </TabButton>
                    <TabButton active={activeTab === 'preview'} onClick={() => setActiveTab('preview')}>
                        <ImageIcon className="w-4 h-4" />
                        <span>Preview</span>
                    </TabButton>
                 </div>
            </div>
            <div className="flex-grow bg-slate-950/70 rounded-md p-4 overflow-auto font-sans">
                {activeTab === 'json' ? renderJsonContent() : renderPreviewContent()}
            </div>
        </div>
    );
};
