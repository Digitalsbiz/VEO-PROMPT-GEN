import React, { useState } from 'react';
import { FilmIcon, AlertTriangleIcon, MailIcon } from './icons';
import { ADMIN_EMAIL } from '../constants';

interface LoginPageProps {
    onLogin: (email: string, password: string, rememberMe: boolean) => void;
    error: string | null;
    onClearError: () => void;
    onNavigateToPrivacy: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, error, onClearError, onNavigateToPrivacy }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(true);
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
    const [isLoading, setIsLoading] = useState(false);

    const validate = (): boolean => {
        const newErrors: { email?: string; password?: string } = {};

        if (!email) {
            newErrors.email = 'Email address is required.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = 'Please enter a valid email address.';
        }

        if (!password) {
            newErrors.password = 'Password is required.';
        } else if (password.length < 6) {
            // Firebase default minimum is 6
            newErrors.password = 'Password must be at least 6 characters long.';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        onClearError();
        if (validate()) {
            setIsLoading(true);
            await onLogin(email, password, rememberMe);
            setIsLoading(false);
        }
    };
    
    const handleAdminLoginClick = () => {
        onClearError();
        setEmail(ADMIN_EMAIL);
        // Admin password is now managed in Firebase, this just pre-fills the email.
    };

    const inputClass = (hasError: boolean) => 
        `w-full bg-slate-800 border rounded-md shadow-sm p-3 text-slate-200 focus:ring-2 transition duration-150 ease-in-out disabled:opacity-50 ${
            hasError 
                ? 'border-red-500 focus:ring-red-500 focus:border-red-500 pr-10' 
                : 'border-slate-600 focus:ring-indigo-500 focus:border-indigo-500'
        }`;
        
    const isSuccessMessage = error?.startsWith('Registration successful!');

    return (
        <div className="min-h-screen bg-slate-900 text-slate-200 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg shadow-lg p-8">
                    <div className="flex flex-col items-center text-center mb-8">
                        <FilmIcon className="w-12 h-12 text-indigo-400 mb-4" />
                        <h1 className="text-3xl font-bold text-slate-100 tracking-tight">Veo Prompt Architect</h1>
                        <p className="text-slate-400 mt-2">Sign in or create an account to continue.</p>
                    </div>

                    <form onSubmit={handleSubmit} noValidate>
                        {error && (
                             <div className={`mb-4 p-3 rounded-md flex items-center gap-3 text-sm ${
                                isSuccessMessage 
                                    ? 'bg-emerald-900/50 text-emerald-300' 
                                    : 'bg-red-900/50 text-red-400'
                            }`}>
                                {isSuccessMessage ? (
                                    <MailIcon className="w-5 h-5 flex-shrink-0" />
                                ) : (
                                    <AlertTriangleIcon className="w-5 h-5 flex-shrink-0" />
                                )}
                                <span>{error}</span>
                            </div>
                        )}
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-medium text-slate-400 mb-1">
                                Email Address
                            </label>
                             <div className="relative">
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className={inputClass(!!errors.email)}
                                    required
                                    aria-required="true"
                                    autoFocus
                                    aria-invalid={!!errors.email}
                                    aria-describedby="email-error"
                                    disabled={isLoading}
                                />
                                {errors.email && (
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <AlertTriangleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                                    </div>
                                )}
                            </div>
                             {errors.email && <p id="email-error" className="text-red-400 text-sm mt-1">{errors.email}</p>}
                        </div>
                        <div className="mb-4">
                            <label htmlFor="password" className="block text-sm font-medium text-slate-400 mb-1">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className={inputClass(!!errors.password)}
                                    required
                                    aria-required="true"
                                    aria-invalid={!!errors.password}
                                    aria-describedby="password-error"
                                    disabled={isLoading}
                                />
                                 {errors.password && (
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <AlertTriangleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                                    </div>
                                )}
                            </div>
                            {errors.password && <p id="password-error" className="text-red-400 text-sm mt-1">{errors.password}</p>}
                        </div>

                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-500 rounded bg-slate-700 disabled:opacity-50"
                                    disabled={isLoading}
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-400">
                                    Remember me
                                </label>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center items-center bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-md transition duration-200 ease-in-out transform hover:scale-105 disabled:bg-indigo-800 disabled:scale-100 disabled:cursor-not-allowed"
                        >
                             {isLoading && <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
                            {isLoading ? 'Processing...' : 'Continue with Email'}
                        </button>
                        <div className="text-center mt-6">
                            <button
                                type="button"
                                onClick={handleAdminLoginClick}
                                disabled={isLoading}
                                className="text-sm font-medium text-slate-500 hover:text-indigo-400 transition-colors duration-200 disabled:opacity-50"
                            >
                                Sign in as Admin
                            </button>
                        </div>
                    </form>
                </div>
                 <footer className="text-center p-4 mt-4 text-slate-500 text-sm">
                    <p>Powered by Google Gemini.</p>
                    <button
                        type="button"
                        onClick={onNavigateToPrivacy}
                        className="mt-2 text-sm font-medium text-slate-500 hover:text-indigo-400 transition-colors duration-200"
                    >
                        Privacy Policy
                    </button>
                </footer>
            </div>
        </div>
    );
};
