
import React, { useMemo } from 'react';
import { Template, Example } from '../constants';
import { MagicWandIcon } from './icons';
import { HistoryControls } from './HistoryControls';

interface InputPanelProps {
    templates: Template[];
    examples: Example[];
    selectedTemplate: Template;
    onTemplateChange: (id: string) => void;
    onExampleChange: (id: string) => void;
    inputValues: { [key: string]: string };
    onInputChange: (values: { [key: string]: string }) => void;
    onGenerate: () => void;
    isLoading: boolean;
    onUndo: () => void;
    onRedo: () => void;
    canUndo: boolean;
    canRedo: boolean;
    customCss: string;
    onCustomCssChange: (css: string) => void;
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
    onGenerate,
    isLoading,
    onUndo,
    onRedo,
    canUndo,
    canRedo,
    customCss,
    onCustomCssChange
}) => {
    const placeholders = useMemo(() => {
        const matches = [...selectedTemplate.template.matchAll(placeholderRegex)];
        // Use a Set to get unique placeholder names
        return [...new Set(matches.map(match => match[1]))];
    }, [selectedTemplate]);

    const handleFieldChange = (field: string, value: string) => {
        onInputChange({ ...inputValues, [field]: value });
    };

    return (
        <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 shadow-lg flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-slate-100">1. Configure Your Prompt</h2>
                <HistoryControls onUndo={onUndo} onRedo={onRedo} canUndo={canUndo} canRedo={canRedo} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="template-select" className="block text-sm font-medium text-slate-400 mb-1">Select a Template</label>
                    <select
                        id="template-select"
                        value={selectedTemplate.id}
                        onChange={(e) => onTemplateChange(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-600 rounded-md shadow-sm p-2 text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                    >
                        {templates.map(template => (
                            <option key={template.id} value={template.id}>{template.name}</option>
                        ))}
                    </select>
                </div>
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
            </div>

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
            
            <details className="group border-t border-slate-700 pt-4">
                <summary className="cursor-pointer text-sm font-medium text-slate-400 list-none flex justify-between items-center">
                    <span>Advanced: Custom CSS Styles</span>
                     <svg className="w-4 h-4 transition-transform duration-200 group-open:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                </summary>
                <div className="mt-3">
                    <textarea
                        value={customCss}
                        onChange={(e) => onCustomCssChange(e.target.value)}
                        placeholder={`.json-formatter-container .string {\n  color: #a5b4fc;\n}`}
                        className="w-full bg-slate-900 border border-slate-600 rounded-md shadow-sm p-2 text-slate-200 font-mono text-xs focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                        rows={8}
                        aria-label="Custom CSS for JSON output"
                    />
                     <p className="text-xs text-slate-500 mt-1">
                        Target classes: <code className="bg-slate-700 px-1 rounded">.key</code>, <code className="bg-slate-700 px-1 rounded">.string</code>, <code className="bg-slate-700 px-1 rounded">.number</code>, <code className="bg-slate-700 px-1 rounded">.boolean</code>, <code className="bg-slate-700 px-1 rounded">.null</code>.
                    </p>
                </div>
            </details>

            <button
                onClick={onGenerate}
                disabled={isLoading}
                className="w-full flex items-center justify-center bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-md transition duration-200 ease-in-out disabled:bg-indigo-800 disabled:cursor-not-allowed transform hover:scale-105 disabled:scale-100"
            >
                {isLoading ? (
                     <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                ) : (
                    <MagicWandIcon className="w-5 h-5 mr-2" />
                )}
                <span>{isLoading ? 'Generating...' : 'Generate Prompt'}</span>
            </button>
        </div>
    );
};
