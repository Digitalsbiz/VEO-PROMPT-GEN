import React, { useMemo, useRef, useState } from 'react';
import { Template, Example, FREE_USER_GENERATION_LIMIT, VisualStyle } from '../constants';
import { MagicWandIcon, ImageIcon, XCircleIcon, SparklesIcon, AlertTriangleIcon, BanIcon, PaletteIcon } from './icons';
import { HistoryControls } from './HistoryControls';
import { Tooltip } from './Tooltip';
import { UserRole, ReferenceImage } from '../types';


interface InputPanelProps {
    templates: Template[];
    examples: Example[];
    selectedTemplate: Template;
    onTemplateChange: (id: string) => void;
    onExampleChange: (id: string) => void;
    inputValues: { [key: string]: string };
    onInputChange: (values: { [key: string]: string }) => void;
    negativePrompt: string;
    onNegativePromptChange: (prompt: string) => void;
    onGenerate: () => void;
    isLoading: boolean;
    onUndo: () => void;
    onRedo: () => void;
    canUndo: boolean;
    canRedo: boolean;
    customCss: string;
    onCustomCssChange: (css: string) => void;
    referenceImage: ReferenceImage | null;
    onReferenceImageChange: (image: ReferenceImage | null) => void;
    userRole: UserRole;
    generationCount: number;
    onGenerateImage: (prompt: string) => void;
    isGeneratingImage: boolean;
    imageGenerationError: string | null;
    visualStyles: VisualStyle[];
    selectedStyleId: string | null;
    onStyleChange: (id: string | null) => void;
}

// Simple regex to find placeholders like {{BRAND_NAME}}
const placeholderRegex = /{{\s*([A-Z_]+)\s*}}/g;

const LabeledInput: React.FC<{ label: string; value: string; onChange: (value: string) => void }> = ({ label, value, onChange }) => {
    const isTextArea = label.toLowerCase().includes('elements') || label.toLowerCase().includes('props') || label.toLowerCase().includes('parts') || label.toLowerCase().includes('features') || label.toLowerCase().includes('ingredients');
    const formattedLabel = label.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    return (
        <div className="font-sans">
            <label className="block text-sm font-medium text-cyan-300/80 mb-1 uppercase tracking-wider">{formattedLabel}</label>
            {isTextArea ? (
                 <textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={`e.g., dial, strap, display (one per line)`}
                    className="w-full bg-slate-900 border border-slate-700 rounded-md shadow-sm p-2 text-slate-200 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-150 ease-in-out"
                    rows={3}
                />
            ) : (
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={`Enter ${formattedLabel}`}
                    className="w-full bg-slate-900 border border-slate-700 rounded-md shadow-sm p-2 text-slate-200 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-150 ease-in-out"
                />
            )}
        </div>
    );
};


export const InputPanel: React.FC<InputPanelProps> = ({
    templates,
    examples,
    selectedTemplate,
    onTemplateChange,
    onExampleChange,
    inputValues,
    onInputChange,
    negativePrompt,
    onNegativePromptChange,
    onGenerate,
    isLoading,
    onUndo,
    onRedo,
    canUndo,
    canRedo,
    customCss,
    onCustomCssChange,
    referenceImage,
    onReferenceImageChange,
    userRole,
    generationCount,
    onGenerateImage,
    isGeneratingImage,
    imageGenerationError,
    visualStyles,
    selectedStyleId,
    onStyleChange,
}) => {
    const placeholders = useMemo(() => {
        const matches = [...selectedTemplate.template.matchAll(placeholderRegex)];
        // Use a Set to get unique placeholder names
        return [...new Set(matches.map(match => match[1]))];
    }, [selectedTemplate]);
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [imagePrompt, setImagePrompt] = useState('');

    const handleFieldChange = (field: string, value: string) => {
        onInputChange({ ...inputValues, [field]: value });
    };

    const isFreeUser = userRole === 'free';
    const limitReached = isFreeUser && generationCount >= FREE_USER_GENERATION_LIMIT;
    const remainingGenerations = Math.max(0, FREE_USER_GENERATION_LIMIT - generationCount);

    const handleImageUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (loadEvent) => {
                const result = loadEvent.target?.result as string;
                if (result) {
                    const [header, data] = result.split(',');
                    const mimeTypeMatch = header.match(/:(.*?);/);
                    if (data && mimeTypeMatch && mimeTypeMatch[1]) {
                        onReferenceImageChange({ data, mimeType: mimeTypeMatch[1] });
                    }
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        onReferenceImageChange(null);
        if(fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };
    
    const handleGenerateImageClick = () => {
        onGenerateImage(imagePrompt);
    };

    const handleStyleButtonClick = (styleId: string) => {
        if (selectedStyleId === styleId) {
            onStyleChange(null); // Deselect if already selected
        } else {
            onStyleChange(styleId);
        }
    };

    return (
        <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-lg border border-cyan-400/30 shadow-2xl shadow-cyan-500/5 flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-slate-100 uppercase tracking-wider">1. Configure <span className="text-cyan-400">Prompt</span></h2>
                <HistoryControls onUndo={onUndo} onRedo={onRedo} canUndo={canUndo} canRedo={canRedo} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans">
                <Tooltip text="Choose a foundational structure for your video prompt. Each template provides a different narrative style.">
                    <div>
                        <label htmlFor="template-select" className="block text-sm font-medium text-cyan-300/80 mb-1 uppercase tracking-wider">Select a Template</label>
                        <select
                            id="template-select"
                            value={selectedTemplate.id}
                            onChange={(e) => onTemplateChange(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-md shadow-sm p-2 text-slate-200 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-150 ease-in-out"
                        >
                            {templates.map(template => (
                                <option key={template.id} value={template.id}>
                                    {template.name}{template.premium ? ' ✨ PRO' : ''}
                                </option>
                            ))}
                        </select>
                    </div>
                </Tooltip>
                 <Tooltip text="Populate the form with a pre-configured example to get started quickly.">
                    <div>
                        <label htmlFor="example-select" className="block text-sm font-medium text-cyan-300/80 mb-1 uppercase tracking-wider">Load an Example</label>
                        <select
                            id="example-select"
                            value=""
                            onChange={(e) => onExampleChange(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-md shadow-sm p-2 text-slate-200 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-150 ease-in-out"
                        >
                            <option value="" disabled>Choose an example...</option>
                            {examples.map(example => (
                                <option key={example.id} value={example.id}>{example.name}</option>
                            ))}
                        </select>
                    </div>
                </Tooltip>
            </div>
            
            <div className="border-t border-cyan-400/20 pt-4 font-sans">
                <Tooltip text="Select an optional artistic style to influence the overall mood and aesthetic of the generated prompt.">
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-cyan-300/80 mb-2 uppercase tracking-wider">
                            <PaletteIcon className="w-4 h-4" />
                            <span>Visual Style (Optional)</span>
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {visualStyles.map((style) => (
                                <button
                                    key={style.id}
                                    onClick={() => handleStyleButtonClick(style.id)}
                                    className={`px-3 py-1.5 text-sm font-semibold rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 ${
                                        selectedStyleId === style.id
                                            ? 'bg-cyan-500 text-slate-900 ring-cyan-400'
                                            : 'bg-slate-700/50 border border-slate-600 text-slate-300 hover:bg-slate-600/50 hover:border-slate-500'
                                    }`}
                                >
                                    {style.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </Tooltip>
            </div>

            {userRole === 'free' && (
                <div className="text-xs text-cyan-200/70 bg-cyan-900/20 p-2 rounded-md text-center border border-cyan-400/20 font-sans">
                    ✨ Upgrade to a <span className="font-semibold text-amber-300">Paid</span> account to access all PRO templates!
                </div>
            )}

            {placeholders.length > 0 && (
                <div className="flex flex-col gap-4 border-t border-cyan-400/20 pt-4">
                    {placeholders.map(placeholder => (
                        <LabeledInput
                            key={placeholder}
                            label={placeholder}
                            value={inputValues[placeholder] || ''}
                            onChange={(value) => handleFieldChange(placeholder, value)}
                        />
                    ))}
                </div>
            )}

            <div className="border-t border-cyan-400/20 pt-4 font-sans">
                <Tooltip text="Specify elements, styles, or concepts to exclude from the generated prompt (e.g., 'no text, cartoon style, bright colors').">
                    <div>
                        <label htmlFor="negative-prompt" className="flex items-center gap-2 text-sm font-medium text-cyan-300/80 mb-1 uppercase tracking-wider">
                            <BanIcon className="w-4 h-4" />
                            <span>Negative Prompt (Optional)</span>
                        </label>
                        <textarea
                            id="negative-prompt"
                            value={negativePrompt}
                            onChange={(e) => onNegativePromptChange(e.target.value)}
                            placeholder="e.g., no text overlays, no cartoon style"
                            className="w-full bg-slate-900 border border-slate-700 rounded-md shadow-sm p-2 text-slate-200 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-150 ease-in-out"
                            rows={2}
                            aria-label="Negative Prompt to exclude elements"
                        />
                    </div>
                </Tooltip>
            </div>

            <details className="group border-t border-cyan-400/20 pt-4 font-sans" open>
                <summary className="cursor-pointer text-sm font-medium text-cyan-300/80 list-none flex justify-between items-center uppercase tracking-wider">
                    <span>Reference Image</span>
                    <svg className="w-4 h-4 transition-transform duration-200 group-open:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                </summary>
                
                <div className="flex flex-col gap-4 mt-3">
                    <details className="group/inner bg-slate-950/50 p-4 rounded-lg border border-slate-700">
                         <summary className="cursor-pointer text-sm font-medium text-slate-300 list-none flex justify-between items-center">
                            <span>Generate Reference from Text</span>
                            <svg className="w-4 h-4 transition-transform duration-200 group-open/inner:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </summary>
                        <div className="mt-3 flex flex-col gap-3">
                             <textarea
                                value={imagePrompt}
                                onChange={(e) => setImagePrompt(e.target.value)}
                                placeholder="e.g., A cinematic shot of a glossy black smartwatch with a glowing interface, on a marble surface."
                                className="w-full bg-slate-900 border border-slate-700 rounded-md shadow-sm p-2 text-slate-200 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-150 ease-in-out"
                                rows={3}
                                aria-label="Prompt for generating a reference image"
                            />
                            {imageGenerationError && (
                                <div className="text-red-400 bg-red-900/50 p-2 rounded-md flex items-center gap-2 text-sm">
                                    <AlertTriangleIcon className="w-4 h-4 flex-shrink-0" />
                                    <span>{imageGenerationError}</span>
                                </div>
                             )}
                            <button
                                onClick={handleGenerateImageClick}
                                disabled={isGeneratingImage}
                                className="w-full flex items-center justify-center bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-4 rounded-md transition duration-200 ease-in-out disabled:bg-emerald-800 disabled:cursor-not-allowed"
                            >
                                {isGeneratingImage ? (
                                     <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : (
                                    <SparklesIcon className="w-5 h-5 mr-2" />
                                )}
                                <span>{isGeneratingImage ? 'Generating Image...' : 'Generate Image'}</span>
                            </button>
                        </div>
                    </details>

                    <div className="text-center text-slate-500 text-sm">or</div>

                    <div className="flex flex-col items-center gap-4">
                        {referenceImage ? (
                            <div className="relative">
                                <img
                                    src={`data:${referenceImage.mimeType};base64,${referenceImage.data}`}
                                    alt="Reference"
                                    className="w-48 h-48 object-cover rounded-lg border-2 border-slate-600"
                                />
                                <button
                                    onClick={handleRemoveImage}
                                    className="absolute -top-2 -right-2 bg-slate-800 border border-slate-700 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
                                    aria-label="Remove reference image"
                                >
                                    <XCircleIcon className="w-6 h-6" />
                                </button>
                            </div>
                        ) : (
                            <div className="w-full border-2 border-dashed border-cyan-400/30 rounded-lg p-8 flex flex-col items-center justify-center text-center bg-cyan-900/10">
                                <ImageIcon className="w-10 h-10 text-cyan-400/50 mb-2" />
                                <span className="text-cyan-200/70 mb-2">Upload an image</span>
                                <button
                                    onClick={handleImageUploadClick}
                                    className="bg-slate-700/50 border border-cyan-400/30 hover:bg-cyan-500/20 text-white font-semibold py-2 px-4 rounded-md transition duration-200 ease-in-out text-sm"
                                >
                                    Choose File
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    className="hidden"
                                    accept="image/png, image/jpeg, image/webp"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </details>

            <div className="border-t border-cyan-400/20 pt-6">
                 {isFreeUser && (
                    <div className="text-center text-sm text-cyan-200/70 mb-4 bg-slate-950/50 p-3 rounded-lg border border-cyan-400/20 font-sans">
                        You have <span className="font-bold text-amber-300">{remainingGenerations}</span> free generation{remainingGenerations !== 1 ? 's' : ''} remaining today.
                    </div>
                )}
                <button
                    onClick={onGenerate}
                    disabled={isLoading || limitReached}
                    className="w-full flex items-center justify-center bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold py-3 px-4 rounded-md transition duration-200 ease-in-out disabled:bg-cyan-800/50 disabled:text-slate-500 disabled:cursor-not-allowed transform hover:scale-105 shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)]"
                >
                    {isLoading ? (
                         <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : (
                        <MagicWandIcon className="w-5 h-5 mr-2" />
                    )}
                    <span className="uppercase tracking-wider">{isLoading ? 'Generating...' : 'Generate Prompt'}</span>
                </button>
            </div>
        </div>
    );
};