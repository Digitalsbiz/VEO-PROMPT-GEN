
import React, { useMemo, useRef, useState } from 'react';
import { Template, Example, FREE_USER_GENERATION_LIMIT, VisualStyle } from '../constants';
import { MagicWandIcon, ImageIcon, XCircleIcon, SparklesIcon, AlertTriangleIcon, BanIcon, PaletteIcon } from './icons';
import { HistoryControls } from './HistoryControls';
import { Tooltip } from './Tooltip';
import { UserRole, ReferenceImage } from '../App';


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
        <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">{formattedLabel}</label>
            {isTextArea ? (
                 <textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={`e.g., dial, strap, display (one per line)`}
                    className="w-full bg-slate-800 border border-slate-600 rounded-md shadow-sm p-2 text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                    rows={3}
                />
            ) : (
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={`Enter ${formattedLabel}`}
                    className="w-full bg-slate-800 border border-slate-600 rounded-md shadow-sm p-2 text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
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
        <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 shadow-lg flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-slate-100">1. Configure Your Prompt</h2>
                <HistoryControls onUndo={onUndo} onRedo={onRedo} canUndo={canUndo} canRedo={canRedo} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Tooltip text="Choose a foundational structure for your video prompt. Each template provides a different narrative style.">
                    <div>
                        <label htmlFor="template-select" className="block text-sm font-medium text-slate-400 mb-1">Select a Template</label>
                        <select
                            id="template-select"
                            value={selectedTemplate.id}
                            onChange={(e) => onTemplateChange(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-600 rounded-md shadow-sm p-2 text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
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
                        <label htmlFor="example-select" className="block text-sm font-medium text-slate-400 mb-1">Load an Example</label>
                        <select
                            id="example-select"
                            value=""
                            onChange={(e) => onExampleChange(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-600 rounded-md shadow-sm p-2 text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                        >
                            <option value="" disabled>Choose an example...</option>
                            {examples.map(example => (
                                <option key={example.id} value={example.id}>{example.name}</option>
                            ))}
                        </select>
                    </div>
                </Tooltip>
            </div>
            
            <div className="border-t border-slate-700 pt-4">
                <Tooltip text="Select an optional artistic style to influence the overall mood and aesthetic of the generated prompt.">
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-slate-400 mb-2">
                            <PaletteIcon className="w-4 h-4" />
                            <span>Visual Style (Optional)</span>
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {visualStyles.map((style) => (
                                <button
                                    key={style.id}
                                    onClick={() => handleStyleButtonClick(style.id)}
                                    className={`px-3 py-1.5 text-sm font-semibold rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 ${
                                        selectedStyleId === style.id
                                            ? 'bg-indigo-600 text-white ring-indigo-500'
                                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
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
                <div className="text-xs text-slate-400 bg-slate-900/50 p-2 rounded-md text-center border border-slate-700">
                    ✨ Upgrade to a <span className="font-semibold text-amber-300">Paid</span> account to access all PRO templates!
                </div>
            )}

            {placeholders.length > 0 && (
                <div className="flex flex-col gap-4 border-t border-slate-700 pt-4">
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

            <div className="border-t border-slate-700 pt-4">
                <Tooltip text="Specify elements, styles, or concepts to exclude from the generated prompt (e.g., 'no text, cartoon style, bright colors').">
                    <div>
                        <label htmlFor="negative-prompt" className="flex items-center gap-2 text-sm font-medium text-slate-400 mb-1">
                            <BanIcon className="w-4 h-4" />
                            <span>Negative Prompt (Optional)</span>
                        </label>
                        <textarea
                            id="negative-prompt"
                            value={negativePrompt}
                            onChange={(e) => onNegativePromptChange(e.target.value)}
                            placeholder="e.g., no text overlays, no cartoon style"
                            className="w-full bg-slate-900 border border-slate-600 rounded-md shadow-sm p-2 text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                            rows={2}
                            aria-label="Negative Prompt to exclude elements"
                        />
                    </div>
                </Tooltip>
            </div>

            <details className="group border-t border-slate-700 pt-4" open>
                <summary className="cursor-pointer text-sm font-medium text-slate-400 list-none flex justify-between items-center">
                    <span>Reference Image</span>
                    <svg className="w-4 h-4 transition-transform duration-200 group-open:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                </summary>
                
                <div className="flex flex-col gap-4 mt-3">
                    <details className="group/inner bg-slate-900/50 p-4 rounded-lg border border-slate-700">
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
                                className="w-full bg-slate-800 border border-slate-600 rounded-md shadow-sm p-2 text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
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

                    <div className="text-center text