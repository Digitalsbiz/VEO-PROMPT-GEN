
import React, { useState } from 'react';
import { FilmIcon } from './icons';

interface LoginPageProps {
    onLogin: (email: string, password: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

    const validate = (): boolean => {
        const newErrors: { email?: string; password?: string } = {};

        // More robust email validation
        if (!email) {
            newErrors.email = 'Email address is required.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = 'Please enter a valid email address.';
        }

        // Password validation with complexity rules
        if (!password) {
            newErrors.password = 'Password is required.';
        } else if (password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters long.';
        } else if (!/(?=.*[A-Z])/.test(password)) {
            newErrors.password = 'Password must contain at least one uppercase letter.';
        } else if (!/(?=.*[0-9])/.test(password)) {
            newErrors.password = 'Password must contain at least one number.';
        }
        
        setErrors(newErrors);
        // Return true if there are no errors
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            onLogin(email, password);
        }
    };

    const inputClass = (hasError: boolean) => 
        `w-full bg-slate-800 border rounded-md shadow-sm p-3 text-slate-200 focus:ring-2 transition duration-150 ease-in-out ${
            hasError 
                ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                : 'border-slate-600 focus:ring-indigo-500 focus:border-indigo-500'
        }`;


    return (
        <div className="min-h-screen bg-slate-900 text-slate-200 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg shadow-lg p-8">
                    <div className="flex flex-col items-center text-center mb-8">
                        <FilmIcon className="w-12 h-12 text-indigo-400 mb-4" />
                        <h1 className="text-3xl font-bold text-slate-100 tracking-tight">Veo Prompt Architect</h1>
                        <p className="text-slate-400 mt-2">Sign in to continue to your workspace.</p>
                    </div>

                    <form onSubmit={handleSubmit} noValidate>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-medium text-slate-400 mb-1">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className={inputClass(!!errors.email)}
                                required
                                autoFocus
                                aria-invalid={!!errors.email}
                                aria-describedby="email-error"
                            />
                             {errors.email && <p id="email-error" className="text-red-400 text-sm mt-1">{errors.email}</p>}
                        </div>
                        <div className="mb-6">
                            <label htmlFor="password" className="block text-sm font-medium text-slate-400 mb-1">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className={inputClass(!!errors.password)}
                                required
                                aria-invalid={!!errors.password}
                                aria-describedby="password-error"
                            />
                            {errors.password && <p id="password-error" className="text-red-400 text-sm mt-1">{errors.password}</p>}
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-md transition duration-200 ease-in-out transform hover:scale-105"
                        >
                            Continue with Email
                        </button>
                    </form>
                </div>
                 <footer className="text-center p-4 mt-4 text-slate-500 text-sm">
                    <p>Powered by Google Gemini.</p>
                </footer>
            </div>
        </div>
    );
};
