
import React, { useState, useCallback, useMemo } from 'react';
import { Header } from './components/Header';
import { InputPanel } from './components/InputPanel';
import { OutputPanel } from './components/OutputPanel';
import { InspirationShowcase } from './components/InspirationShowcase';
import { generateVeoPrompt } from './services/geminiService';
import { TEMPLATES, PREDEFINED_EXAMPLES, SHOWCASE_VIDEOS, Example } from './constants';
import { useHistoryState } from './hooks/useHistoryState';

// Define the shape of our history state
interface AppFormState {
    selectedTemplateId: string;
    inputValues: { [key: string]: string };
}

const defaultCss = `/* Example: Style JSON elements */
.json-formatter-container .string {
  color: #a5b4fc; /* Tailwind Indigo-300 */
}
.json-formatter-container .key {
  color: #6ee7b7; /* Tailwind Emerald-300 */
}
.json-formatter-container .number {
  color: #f06595; /* Custom Pink-400 */
}
.json-formatter-container .boolean {
  color: #f9a8d4; /* Tailwind Pink-300 */
}
.json-formatter-container .null {
  color: #94a3b8; /* Tailwind Slate-400 */
}
`;

const App: React.FC = () => {
    const initialState: AppFormState = {
        selectedTemplateId: TEMPLATES[0].id,
        inputValues: {},
    };

    const {
        state: formState,
        set: setFormState,
        undo,
        redo,
        canUndo,
        canRedo,
    } = useHistoryState<AppFormState>(initialState);

    const [generatedJson, setGeneratedJson] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [customCss, setCustomCss] = useState<string>(defaultCss);


    // Derive selectedTemplate from the state's ID for memoization
    const selectedTemplate = useMemo(() => {
        return TEMPLATES.find(t => t.id === formState.selectedTemplateId) || TEMPLATES[0];
    }, [formState.selectedTemplateId]);

    const handleGenerate = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setGeneratedJson('');
        try {
            const jsonOutput = await generateVeoPrompt(selectedTemplate.template, formState.inputValues);
            // A simple check and cleanup for markdown fences
            const cleanedJson = jsonOutput.replace(/^```json\s*|```$/g, '').trim();
            setGeneratedJson(JSON.stringify(JSON.parse(cleanedJson), null, 2));
        } catch (e) {
            console.error(e);
            setError('Failed to generate prompt. Please check your inputs and try again.');
        } finally {
            setIsLoading(false);
        }
    }, [selectedTemplate, formState.inputValues]);

    const handleTemplateChange = (templateId: string) => {
        setFormState({
            selectedTemplateId: templateId,
            inputValues: {} // Reset inputs when template changes
        });
    };

    const handleInputChange = (newInputValues: { [key: string]: string }) => {
        setFormState({
            ...formState,
            inputValues: newInputValues,
        });
    };

    const handleCustomCssChange = (css: string) => {
        setCustomCss(css);
    };

    const handleExampleChange = (exampleId: string) => {
        const example = PREDEFINED_EXAMPLES.find(ex => ex.id === exampleId);
        if (example) {
            setFormState({
                selectedTemplateId: example.templateId,
                inputValues: { ...example.values }
            });
             // Scroll to the top of the form for better UX
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };
    
    return (
        <div className="min-h-screen bg-slate-900 text-slate-200 font-sans flex flex-col">
            <Header />
            <main className="flex-grow container mx-auto p-4 md:p-8 flex flex-col gap-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    <InputPanel
                        templates={TEMPLATES}
                        examples={PREDEFINED_EXAMPLES}
                        selectedTemplate={selectedTemplate}
                        onTemplateChange={handleTemplateChange}
                        onExampleChange={handleExampleChange}
                        inputValues={formState.inputValues}
                        onInputChange={handleInputChange}
                        onGenerate={handleGenerate}
                        isLoading={isLoading}
                        onUndo={undo}
                        onRedo={redo}
                        canUndo={canUndo}
                        canRedo={canRedo}
                        customCss={customCss}
                        onCustomCssChange={handleCustomCssChange}
                    />
                    <OutputPanel
                        jsonOutput={generatedJson}
                        isLoading={isLoading}
                        error={error}
                        customCss={customCss}
                    />
                </div>
                 <InspirationShowcase videos={SHOWCASE_VIDEOS} onLoadExample={handleExampleChange} />
            </main>
             <footer className="text-center p-4 text-slate-500 text-sm">
                <p>Powered by Google Gemini. Designed for creative video professionals.</p>
            </footer>
        </div>
    );
};

export default App;
