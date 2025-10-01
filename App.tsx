
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { InputPanel } from './components/InputPanel';
import { OutputPanel } from './components/OutputPanel';
import { InspirationShowcase } from './components/InspirationShowcase';
import { AdminPanel } from './components/AdminPanel';
import { generateVeoPrompt, generateImage } from './services/geminiService';
import { userService } from './services/userService';
import { TEMPLATES, PREDEFINED_EXAMPLES, SHOWCASE_VIDEOS, ADMIN_EMAIL, FREE_USER_GENERATION_LIMIT, VISUAL_STYLES } from './constants';
import { useHistoryState } from './hooks/useHistoryState';
import { LoginPage } from './components/Auth';
import { AboutPage } from './components/AboutPage';
import { PrivacyPolicyPage } from './components/PrivacyPolicyPage';
import { User, UserRole, ReferenceImage, GenerationData, AppView } from './types';

interface AppFormState {
    selectedTemplateId: string;
    inputValues: { [key:string]: string };
    negativePrompt: string;
    selectedStyleId: string | null;
}

const FORM_STATE_STORAGE_KEY = 'veoPromptArchitectFormState';

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

const loadInitialFormState = (): AppFormState => {
    try {
        const savedStateJSON = localStorage.getItem(FORM_STATE_STORAGE_KEY);
        if (savedStateJSON) {
            const savedState: Partial<AppFormState> = JSON.parse(savedStateJSON);
            
            // Validate that the saved template ID is still valid
            const templateExists = TEMPLATES.some(t => t.id === savedState.selectedTemplateId);

            if (templateExists && savedState.inputValues !== undefined) {
                 return {
                    selectedTemplateId: savedState.selectedTemplateId!,
                    inputValues: savedState.inputValues || {},
                    negativePrompt: savedState.negativePrompt || '',
                    selectedStyleId: savedState.selectedStyleId || null,
                };
            }
        }
    } catch (error) {
        console.error("Failed to load or parse form state from localStorage", error);
        localStorage.removeItem(FORM_STATE_STORAGE_KEY); // Clear corrupted data
    }
    // Return default state if nothing is found or data is invalid
    return {
        selectedTemplateId: TEMPLATES[0].id,
        inputValues: {},
        negativePrompt: '',
        selectedStyleId: null,
    };
};


const App: React.FC = () => {
    const {
        state: formState,
        set: setFormState,
        undo,
        redo,
        canUndo,
        canRedo,
    } = useHistoryState<AppFormState>(loadInitialFormState());

    const [generatedJson, setGeneratedJson] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [customCss, setCustomCss] = useState<string>(defaultCss);
    const [referenceImage, setReferenceImage] = useState<ReferenceImage | null>(null);

    // Image Generation State
    const [isGeneratingImage, setIsGeneratingImage] = useState<boolean>(false);
    const [imageGenerationError, setImageGenerationError] = useState<string | null>(null);
    
    // Auth and View State
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [allUsers, setAllUsers] = useState<User[]>(() => userService.getAllUsers());
    const [view, setView] = useState<AppView>('app');
    const [loginError, setLoginError] = useState<string | null>(null);

    // Generation limit state
    const [generationData, setGenerationData] = useState<GenerationData>({ count: 0, lastResetDate: '' });


    // Auto-save form state to localStorage
    useEffect(() => {
        try {
            localStorage.setItem(FORM_STATE_STORAGE_KEY, JSON.stringify(formState));
        } catch (error) {
            console.error("Failed to save form state to localStorage", error);
        }
    }, [formState]);

    // Load initial user auth state from localStorage
    useEffect(() => {
        const storedEmail = localStorage.getItem('veoUserEmail') || sessionStorage.getItem('veoUserEmail');
        if (storedEmail) {
            setUserEmail(storedEmail);
            setView('app');
        } else {
            setView('login');
        }
    }, []);

    const currentUser = useMemo(() => allUsers.find(u => u.email === userEmail), [allUsers, userEmail]);

    // Load and manage generation count for the current user
    useEffect(() => {
        if (!userEmail || !currentUser) return;

        const storedGenerationsJSON = localStorage.getItem('veoUserGenerations');
        const allGenerations: { [email: string]: GenerationData } = storedGenerationsJSON ? JSON.parse(storedGenerationsJSON) : {};
        
        let userGenData = allGenerations[userEmail] || { count: 0, lastResetDate: '' };
        const today = new Date().toISOString().split('T')[0];

        // Reset count if the date has changed
        if (userGenData.lastResetDate !== today) {
            userGenData = { count: 0, lastResetDate: today };
            allGenerations[userEmail] = userGenData;
            localStorage.setItem('veoUserGenerations', JSON.stringify(allGenerations));
        }
        
        setGenerationData(userGenData);
    }, [userEmail, currentUser]);

    const handleLogin = (email: string, password: string, rememberMe: boolean) => {
        const user = userService.getUserByEmail(email);

        if (user) { // Existing user
            if (user.password === password) {
                if (!user.confirmed) {
                    setLoginError("Your account is not confirmed. Please check your email for the confirmation link.");
                    return;
                }
                if (rememberMe) {
                    localStorage.setItem('veoUserEmail', email);
                } else {
                    sessionStorage.setItem('veoUserEmail', email);
                }
                setUserEmail(email);
                setView('app');
                setLoginError(null);
            } else {
                setLoginError("Invalid password. Please try again.");
            }
        } else { // New user registration
            userService.addUser({ email, password });
            setAllUsers(userService.getAllUsers());
            
            // Show confirmation message instead of logging in
            setLoginError("Registration successful! A confirmation link has been sent to your email. Please verify your account to log in.");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('veoUserEmail');
        sessionStorage.removeItem('veoUserEmail');
        setUserEmail(null);
        setView('login');
    };
    
    const handleDeleteUser = (emailToDelete: string) => {
        if (emailToDelete === ADMIN_EMAIL) {
            console.warn("Attempted to delete the primary admin account.");
            return;
        }
        if (userService.deleteUser(emailToDelete)) {
            setAllUsers(userService.getAllUsers());
        }
    };
    
    const handleUpdateUserRole = (emailToUpdate: string, newRole: UserRole) => {
        if (emailToUpdate === ADMIN_EMAIL) {
            console.warn("Cannot change the primary admin's role.");
            return;
        }
        if (userService.updateUserRole(emailToUpdate, newRole)) {
            setAllUsers(userService.getAllUsers());
        }
    };
    
    const handleConfirmUser = (emailToConfirm: string) => {
        if (userService.confirmUser(emailToConfirm)) {
            setAllUsers(userService.getAllUsers());
        }
    };


    const availableTemplates = useMemo(() => {
        if (currentUser?.role === 'free') {
            return TEMPLATES.filter(t => !t.premium);
        }
        return TEMPLATES; // Admins and paid users get all templates
    }, [currentUser]);
    
    const showcaseVideosWithPremium = useMemo(() => {
        return SHOWCASE_VIDEOS.map(video => {
            const example = PREDEFINED_EXAMPLES.find(ex => ex.id === video.exampleId);
            const template = TEMPLATES.find(t => t.id === example?.templateId);
            return {
                ...video,
                isPremium: !!template?.premium,
            };
        });
    }, []);


    const selectedTemplate = useMemo(() => {
        return TEMPLATES.find(t => t.id === formState.selectedTemplateId) || TEMPLATES[0];
    }, [formState.selectedTemplateId]);

     const handleTemplateChange = useCallback((templateId: string) => {
        setFormState({
            selectedTemplateId: templateId,
            inputValues: {},
            negativePrompt: '',
            selectedStyleId: null,
        });
        setReferenceImage(null);
    }, [setFormState]);

    // Effect to ensure free users don't have a premium template selected
    useEffect(() => {
        const selectedTemplateIsPremium = TEMPLATES.find(t => t.id === formState.selectedTemplateId)?.premium;

        if (currentUser?.role === 'free' && selectedTemplateIsPremium) {
            // Find the first available non-premium template and switch to it.
            const firstFreeTemplate = availableTemplates[0];
            if (firstFreeTemplate) {
                handleTemplateChange(firstFreeTemplate.id);
            }
        }
    }, [formState.selectedTemplateId, currentUser, availableTemplates, handleTemplateChange]);


    const handleGenerate = useCallback(async () => {
        const today = new Date().toISOString().split('T')[0];
        
        // Check limit for free users with robust date checking
        if (currentUser?.role === 'free') {
            const isNewDay = generationData.lastResetDate !== today;
            const currentCount = isNewDay ? 0 : generationData.count;

            if (currentCount >= FREE_USER_GENERATION_LIMIT) {
                setError(`You have reached your daily limit of ${FREE_USER_GENERATION_LIMIT} prompts. Please upgrade for unlimited access.`);
                return;
            }
        }
        
        setIsLoading(true);
        setError(null);
        setGeneratedJson('');
        try {
            const styleName = VISUAL_STYLES.find(s => s.id === formState.selectedStyleId)?.name || null;
            const jsonOutput = await generateVeoPrompt(selectedTemplate.template, formState.inputValues, formState.negativePrompt, referenceImage, styleName);
            const cleanedJson = jsonOutput.replace(/^```json\s*|```$/g, '').trim();
            setGeneratedJson(JSON.stringify(JSON.parse(cleanedJson), null, 2));

            // Increment count for free user on success
            if (currentUser?.role === 'free' && userEmail) {
                const isNewDay = generationData.lastResetDate !== today;
                const currentCount = isNewDay ? 0 : generationData.count;
                const newCount = currentCount + 1;

                const newGenData = { count: newCount, lastResetDate: today };

                setGenerationData(newGenData);

                const storedGenerationsJSON = localStorage.getItem('veoUserGenerations');
                const allGenerations: { [email: string]: GenerationData } = storedGenerationsJSON ? JSON.parse(storedGenerationsJSON) : {};
                allGenerations[userEmail] = newGenData;
                localStorage.setItem('veoUserGenerations', JSON.stringify(allGenerations));
            }
        } catch (e) {
            console.error(e);
            setError('Failed to generate prompt. Please check your inputs and try again.');
        } finally {
            setIsLoading(false);
        }
    }, [selectedTemplate, formState.inputValues, formState.negativePrompt, currentUser, userEmail, generationData, referenceImage, formState.selectedStyleId]);

    const handleGenerateImage = useCallback(async (prompt: string) => {
        if (!prompt) {
            setImageGenerationError('Please enter a prompt to generate an image.');
            return;
        }
        setIsGeneratingImage(true);
        setImageGenerationError(null);
        try {
            const image = await generateImage(prompt);
            setReferenceImage(image);
        } catch (e) {
            console.error(e);
            setImageGenerationError('Failed to generate image. Please try again.');
        } finally {
            setIsGeneratingImage(false);
        }
    }, []);

    const handleInputChange = (newInputValues: { [key:string]: string }) => {
        setFormState({
            ...formState,
            inputValues: newInputValues,
        });
    };

    const handleNegativePromptChange = (prompt: string) => {
        setFormState({
            ...formState,
            negativePrompt: prompt,
        });
    };
    
    const handleStyleChange = (styleId: string | null) => {
        setFormState({
            ...formState,
            selectedStyleId: styleId,
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
                inputValues: { ...example.values },
                negativePrompt: '',
                selectedStyleId: null,
            });
            setReferenceImage(null);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };
    
    // Conditional Rendering Logic
    if (view === 'login' || !userEmail || !currentUser) {
        return <LoginPage 
                    onLogin={handleLogin} 
                    error={loginError} 
                    onClearError={() => setLoginError(null)}
                    onNavigateToPrivacy={() => setView('privacy')}
                />;
    }
    
    if (view === 'admin') {
        return <AdminPanel 
                    users={allUsers} 
                    onDeleteUser={handleDeleteUser} 
                    onUpdateUserRole={handleUpdateUserRole}
                    onBackToApp={() => setView('app')}
                    currentUserEmail={userEmail}
                    onConfirmUser={handleConfirmUser}
                />;
    }
    
    if (view === 'about') {
        return <AboutPage onBackToApp={() => setView('app')} />;
    }

    if (view === 'privacy') {
        return <PrivacyPolicyPage onBack={() => setView(userEmail ? 'app' : 'login')} />;
    }


    return (
        <div className="min-h-screen bg-slate-900 text-slate-200 font-sans flex flex-col">
            <Header 
                userEmail={userEmail} 
                onLogout={handleLogout}
                isAdmin={currentUser.role === 'admin'}
                onNavigateToAdmin={() => setView('admin')}
                onNavigateToAbout={() => setView('about')}
                onNavigateToPrivacy={() => setView('privacy')}
            />
            <main className="flex-grow container mx-auto p-4 md:p-8 flex flex-col gap-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    <InputPanel
                        templates={availableTemplates}
                        examples={PREDEFINED_EXAMPLES}
                        selectedTemplate={selectedTemplate}
                        onTemplateChange={handleTemplateChange}
                        onExampleChange={handleExampleChange}
                        inputValues={formState.inputValues}
                        onInputChange={handleInputChange}
                        negativePrompt={formState.negativePrompt}
                        onNegativePromptChange={handleNegativePromptChange}
                        onGenerate={handleGenerate}
                        isLoading={isLoading}
                        onUndo={undo}
                        onRedo={redo}
                        canUndo={canUndo}
                        canRedo={canRedo}
                        customCss={customCss}
                        onCustomCssChange={handleCustomCssChange}
                        referenceImage={referenceImage}
                        onReferenceImageChange={setReferenceImage}
                        userRole={currentUser.role}
                        generationCount={generationData.count}
                        onGenerateImage={handleGenerateImage}
                        isGeneratingImage={isGeneratingImage}
                        imageGenerationError={imageGenerationError}
                        visualStyles={VISUAL_STYLES}
                        selectedStyleId={formState.selectedStyleId}
                        onStyleChange={handleStyleChange}
                    />
                    <OutputPanel
                        jsonOutput={generatedJson}
                        isLoading={isLoading}
                        error={error}
                        customCss={customCss}
                    />
                </div>
                 <InspirationShowcase videos={showcaseVideosWithPremium} onLoadExample={handleExampleChange} userRole={currentUser.role} />
            </main>
             <footer className="text-center p-4 text-slate-500 text-sm">
                <p>Powered by Google Gemini. Designed for creative video professionals.</p>
            </footer>
        </div>
    );
};

export default App;
