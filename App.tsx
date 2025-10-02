import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, setPersistence, browserLocalPersistence, browserSessionPersistence, sendEmailVerification } from 'firebase/auth';
import { auth } from './services/firebase';
import { firestoreService } from './services/firestoreService';
import { Header } from './components/Header';
import { InputPanel } from './components/InputPanel';
import { OutputPanel } from './components/OutputPanel';
import { InspirationShowcase } from './components/InspirationShowcase';
import { AdminPanel } from './components/AdminPanel';
import { generateVeoPrompt, generateImage, generateStoryboardPrompts } from './services/geminiService';
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
        localStorage.removeItem(FORM_STATE_STORAGE_KEY);
    }
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

    const [isGeneratingImage, setIsGeneratingImage] = useState<boolean>(false);
    const [imageGenerationError, setImageGenerationError] = useState<string | null>(null);
    
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [view, setView] = useState<AppView>('app');
    const [loginError, setLoginError] = useState<string | null>(null);

    const [generationData, setGenerationData] = useState<GenerationData>({ count: 0, lastResetDate: '' });
    
    const [storyboardImages, setStoryboardImages] = useState<ReferenceImage[]>([]);
    const [isGeneratingStoryboard, setIsGeneratingStoryboard] = useState<boolean>(false);
    const [storyboardError, setStoryboardError] = useState<string | null>(null);

    useEffect(() => {
        try {
            localStorage.setItem(FORM_STATE_STORAGE_KEY, JSON.stringify(formState));
        } catch (error) {
            console.error("Failed to save form state to localStorage", error);
        }
    }, [formState]);

    useEffect(() => {
        if (!auth) {
            setIsAuthLoading(false);
            setCurrentUser(null);
            setView('login');
            setLoginError("Firebase authentication is not configured. Please contact the administrator.");
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                const userProfile = await firestoreService.getUserProfile(firebaseUser.uid);
                if (userProfile) {
                    setCurrentUser({
                        uid: firebaseUser.uid,
                        email: firebaseUser.email || '',
                        emailVerified: firebaseUser.emailVerified,
                        role: userProfile.role,
                    });
                     if (!firebaseUser.emailVerified && userProfile.role !== 'admin') {
                        // Keep them on a page where they can be notified
                        // but allow app access for now. Could be stricter.
                    }
                    setView('app');
                } else {
                    // Profile doesn't exist, create it. This can happen on first sign-up.
                    if (firebaseUser.email) {
                        await firestoreService.createUserProfile(firebaseUser.uid, firebaseUser.email);
                        const newUserProfile = await firestoreService.getUserProfile(firebaseUser.uid);
                        if (newUserProfile) {
                            setCurrentUser({
                                uid: firebaseUser.uid,
                                email: firebaseUser.email,
                                emailVerified: firebaseUser.emailVerified,
                                role: newUserProfile.role,
                            });
                            setView('app');
                        }
                    }
                }
            } else {
                setCurrentUser(null);
                setView('login');
            }
            setIsAuthLoading(false);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!currentUser) return;

        const storedGenerationsJSON = localStorage.getItem('veoUserGenerations');
        const allGenerations: { [uid: string]: GenerationData } = storedGenerationsJSON ? JSON.parse(storedGenerationsJSON) : {};
        
        let userGenData = allGenerations[currentUser.uid] || { count: 0, lastResetDate: '' };
        const today = new Date().toISOString().split('T')[0];

        if (userGenData.lastResetDate !== today) {
            userGenData = { count: 0, lastResetDate: today };
            allGenerations[currentUser.uid] = userGenData;
            localStorage.setItem('veoUserGenerations', JSON.stringify(allGenerations));
        }
        
        setGenerationData(userGenData);
    }, [currentUser]);

    const handleLogin = async (email: string, password: string, rememberMe: boolean) => {
        if (!auth) {
            setLoginError("Authentication service is not available.");
            return;
        }
        setLoginError(null);
        try {
            await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            if (!userCredential.user.emailVerified && email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
                await signOut(auth);
                setLoginError("Please verify your email before logging in. You can request a new verification link by attempting to register again.");
            }
        } catch (error: any) {
            if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
                try {
                    const newUserCredential = await createUserWithEmailAndPassword(auth, email, password);
                    await firestoreService.createUserProfile(newUserCredential.user.uid, email);
                    await sendEmailVerification(newUserCredential.user);
                    await signOut(auth);
                    setLoginError("Registration successful! A verification link has been sent to your email. Please verify your account and then log in.");
                } catch (regError: any) {
                    if (regError.code === 'auth/email-already-in-use') {
                        setLoginError("Invalid password. Please try again.");
                    } else {
                        setLoginError(regError.message || 'An unexpected registration error occurred.');
                    }
                }
            } else {
                setLoginError(error.message || 'An unexpected error occurred.');
            }
        }
    };
    
    const handleLogout = async () => {
        if (auth) {
            await signOut(auth);
        }
    };
    
    const handleDeleteUser = (emailToDelete: string) => {
        console.warn("User deletion from the client is not supported for security reasons. This requires a backend with the Firebase Admin SDK.");
    };

    const fetchAllUsers = useCallback(async () => {
        if (currentUser?.role === 'admin') {
            const usersFromDb = await firestoreService.getAllUsers();
            setAllUsers(usersFromDb);
        }
    }, [currentUser]);

    useEffect(() => {
        if (view === 'admin') {
            fetchAllUsers();
        }
    }, [view, fetchAllUsers]);
    
    const handleUpdateUserRole = async (uid: string, newRole: UserRole) => {
        const userToUpdate = allUsers.find(u => u.uid === uid);
        if (userToUpdate && userToUpdate.email === ADMIN_EMAIL) {
            console.warn("Cannot change the primary admin's role.");
            return;
        }
        await firestoreService.updateUserRole(uid, newRole);
        fetchAllUsers();
    };

    const availableTemplates = useMemo(() => {
        if (currentUser?.role === 'free') {
            return TEMPLATES.filter(t => !t.premium);
        }
        return TEMPLATES;
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

    useEffect(() => {
        const selectedTemplateIsPremium = TEMPLATES.find(t => t.id === formState.selectedTemplateId)?.premium;
        if (currentUser?.role === 'free' && selectedTemplateIsPremium) {
            const firstFreeTemplate = availableTemplates[0];
            if (firstFreeTemplate) {
                handleTemplateChange(firstFreeTemplate.id);
            }
        }
    }, [formState.selectedTemplateId, currentUser, availableTemplates, handleTemplateChange]);

    const handleGenerateStoryboard = useCallback(async (jsonOutput: string) => {
        setIsGeneratingStoryboard(true);
        setStoryboardError(null);
        setStoryboardImages([]);
        try {
            const prompts = await generateStoryboardPrompts(jsonOutput);
            const imagePromises = prompts.slice(0, 3).map(prompt => generateImage(prompt)); // Limit to 3 for performance
            const images = await Promise.all(imagePromises);
            setStoryboardImages(images);
        } catch (e) {
            console.error(e);
            setStoryboardError('Failed to generate visual preview. The AI may be experiencing high load.');
        } finally {
            setIsGeneratingStoryboard(false);
        }
    }, []);

    const handleGenerate = useCallback(async () => {
        const today = new Date().toISOString().split('T')[0];
        
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
        setStoryboardImages([]);
        setStoryboardError(null);

        try {
            const styleName = VISUAL_STYLES.find(s => s.id === formState.selectedStyleId)?.name || null;
            const jsonOutput = await generateVeoPrompt(selectedTemplate.template, formState.inputValues, formState.negativePrompt, referenceImage, styleName);
            const cleanedJson = jsonOutput.replace(/^```json\s*|```$/g, '').trim();
            const parsedJson = JSON.stringify(JSON.parse(cleanedJson), null, 2);
            setGeneratedJson(parsedJson);
            
            handleGenerateStoryboard(parsedJson);

            if (currentUser?.role === 'free' && currentUser.uid) {
                const isNewDay = generationData.lastResetDate !== today;
                const currentCount = isNewDay ? 0 : generationData.count;
                const newCount = currentCount + 1;
                const newGenData = { count: newCount, lastResetDate: today };
                setGenerationData(newGenData);

                const storedGenerationsJSON = localStorage.getItem('veoUserGenerations');
                const allGenerations: { [uid: string]: GenerationData } = storedGenerationsJSON ? JSON.parse(storedGenerationsJSON) : {};
                allGenerations[currentUser.uid] = newGenData;
                localStorage.setItem('veoUserGenerations', JSON.stringify(allGenerations));
            }
        } catch (e) {
            console.error(e);
            setError('Failed to generate prompt. Please check your inputs and try again.');
        } finally {
            setIsLoading(false);
        }
    }, [selectedTemplate, formState, currentUser, generationData, referenceImage, handleGenerateStoryboard]);

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
        setFormState({ ...formState, inputValues: newInputValues });
    };

    const handleNegativePromptChange = (prompt: string) => {
        setFormState({ ...formState, negativePrompt: prompt });
    };
    
    const handleStyleChange = (styleId: string | null) => {
        setFormState({ ...formState, selectedStyleId: styleId });
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
            setGeneratedJson('');
            setStoryboardImages([]);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };
    
    if (isAuthLoading) {
         return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white font-futuristic">
                 <svg className="animate-spin h-10 w-10 text-cyan-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-xl tracking-wider">Authenticating...</p>
            </div>
        );
    }

    if (view === 'login' || !currentUser) {
        return <LoginPage onLogin={handleLogin} error={loginError} onClearError={() => setLoginError(null)} onNavigateToPrivacy={() => setView('privacy')} />;
    }
    
    if (view === 'admin') {
        return <AdminPanel users={allUsers} onDeleteUser={handleDeleteUser} onUpdateUserRole={handleUpdateUserRole} onBackToApp={() => setView('app')} currentUser={currentUser} />;
    }
    
    if (view === 'about') {
        return <AboutPage onBackToApp={() => setView('app')} />;
    }

    if (view === 'privacy') {
        return <PrivacyPolicyPage onBack={() => setView(currentUser ? 'app' : 'login')} />;
    }

    return (
        <div className="min-h-screen text-slate-200 flex flex-col font-futuristic">
            <Header userEmail={currentUser.email} onLogout={handleLogout} isAdmin={currentUser.role === 'admin'} onNavigateToAdmin={() => setView('admin')} onNavigateToAbout={() => setView('about')} onNavigateToPrivacy={() => setView('privacy')} />
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
                        storyboardImages={storyboardImages}
                        isGeneratingStoryboard={isGeneratingStoryboard}
                        storyboardError={storyboardError}
                    />
                </div>
                 <InspirationShowcase videos={showcaseVideosWithPremium} onLoadExample={handleExampleChange} userRole={currentUser.role} />
            </main>
             <footer className="text-center p-4 text-cyan-400/50 text-sm font-sans">
                <p>Powered by Google Gemini. Designed for creative video professionals.</p>
            </footer>
        </div>
    );
};

export default App;