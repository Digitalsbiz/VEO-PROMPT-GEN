import React, { useState } from 'react';
import { ShieldCheckIcon } from './icons';

interface PrivacyPolicyPageProps {
    onBack: () => void;
}

export const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ onBack }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !email || !message) {
            // In a real app, you might show validation errors.
            // For this simulation, we'll just prevent submission.
            return;
        }
        // Simulate sending the form data
        console.log('Form submitted:', { name, email, message });
        setIsSubmitted(true);
    };

    return (
        <div className="min-h-screen bg-slate-900 text-slate-200 font-sans flex flex-col items-center p-4 md:p-8">
            <div className="w-full max-w-4xl">
                <header className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <ShieldCheckIcon className="w-8 h-8 text-indigo-400" />
                        <h1 className="text-3xl font-bold text-slate-100 tracking-tight">
                            Privacy Policy
                        </h1>
                    </div>
                    <button
                        onClick={onBack}
                        className="bg-slate-700 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md transition duration-200 ease-in-out text-sm"
                    >
                        Back
                    </button>
                </header>

                <div className="bg-slate-800/50 border border-slate-700 rounded-lg shadow-lg p-8 space-y-6 text-slate-300 leading-relaxed">
                    <p><strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

                    <section>
                        <h2 className="text-xl font-semibold text-slate-100 mb-2">1. Introduction</h2>
                        <p>
                            Welcome to Veo Prompt Architect ("we," "our," or "us"). We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our application. By using our service, you agree to the collection and use of information in accordance with this policy.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-slate-100 mb-2">2. Information We Collect</h2>
                        <p>
                            Our application is designed to function primarily on your local device. We collect and store the following information directly in your browser's local storage:
                        </p>
                        <ul className="list-disc list-inside mt-2 space-y-1 pl-4">
                            <li><strong>Account Information:</strong> Your email address and a password you provide for authentication purposes.</li>
                            <li><strong>User Data:</strong> Information about your user role (e.g., 'free', 'paid', 'admin') and confirmation status.</li>
                            <li><strong>Generation Data:</strong> A count of the prompts you have generated and the date of your last activity to manage daily limits for free users.</li>
                        </ul>
                        <p className="mt-2">
                            This data remains on your computer and is not transmitted to our servers.
                        </p>
                    </section>
                    
                    <section>
                        <h2 className="text-xl font-semibold text-slate-100 mb-2">3. How We Use Your Information</h2>
                        <p>
                            The information stored locally is used solely to:
                        </p>
                         <ul className="list-disc list-inside mt-2 space-y-1 pl-4">
                            <li>Authenticate you and provide access to the application.</li>
                            <li>Manage your user role and associated permissions (e.g., access to premium templates).</li>
                            <li>Enforce daily generation limits for free-tier users.</li>
                        </ul>
                    </section>

                     <section>
                        <h2 className="text-xl font-semibold text-slate-100 mb-2">4. Third-Party Services</h2>
                        <p>
                            To provide the core functionality of prompt generation, we interact with the Google Gemini API. When you generate a prompt, the following data is sent to Google:
                        </p>
                         <ul className="list-disc list-inside mt-2 space-y-1 pl-4">
                             <li>The content of the template you are using.</li>
                             <li>The text and images you input into the form fields.</li>
                         </ul>
                         <p className="mt-2">
                            We do not send your email address or any other personal identification to the Gemini API. Your interaction with the Google Gemini API is subject to Google's Privacy Policy. We encourage you to review it.
                        </p>
                    </section>

                     <section>
                        <h2 className="text-xl font-semibold text-slate-100 mb-2">5. Data Security & Storage</h2>
                        <p>
                            All user-specific data is stored in your web browser's local storage. This means the data resides on your device. While we do not transmit this personal data to a central server, you are responsible for the security of the device you use to access the application. You can clear this data at any time by clearing your browser's cache and local storage.
                        </p>
                    </section>
                    
                     <section>
                        <h2 className="text-xl font-semibold text-slate-100 mb-2">6. Your Rights</h2>
                        <p>
                           Since your data is stored locally, you have full control over it. You can view, modify, or delete your data by using your browser's developer tools or by clearing your browser's storage for this site. Deleting your local storage data will effectively log you out and remove all user-related information from your device.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-slate-100 mb-2">7. Changes to This Privacy Policy</h2>
                        <p>
                            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
                        </p>
                    </section>
                    
                    <section>
                        <h2 className="text-xl font-semibold text-slate-100 mb-2">8. Contact Us</h2>
                        <p>
                            If you have any questions about this Privacy Policy, you can reach us at <a href="mailto:digitalsbiz@gmail.com" className="text-indigo-400 hover:underline">digitalsbiz@gmail.com</a>, or use the form below.
                        </p>

                        {isSubmitted ? (
                            <div className="mt-6 p-4 bg-emerald-900/50 text-emerald-300 rounded-lg border border-emerald-700 text-center">
                                <p className="font-semibold">Thank you for your message!</p>
                                <p className="text-sm">We'll get back to you as soon as possible.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-slate-400 mb-1">Your Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                        className="w-full bg-slate-900 border border-slate-600 rounded-md shadow-sm p-2 text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                                        placeholder="Jane Doe"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email-contact" className="block text-sm font-medium text-slate-400 mb-1">Your Email</label>
                                    <input
                                        type="email"
                                        id="email-contact"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="w-full bg-slate-900 border border-slate-600 rounded-md shadow-sm p-2 text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                                        placeholder="you@example.com"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-slate-400 mb-1">Message</label>
                                    <textarea
                                        id="message"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        required
                                        rows={4}
                                        className="w-full bg-slate-900 border border-slate-600 rounded-md shadow-sm p-2 text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                                        placeholder="Your question or feedback..."
                                    />
                                </div>
                                <div>
                                    <button
                                        type="submit"
                                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-4 rounded-md transition duration-200 ease-in-out disabled:bg-indigo-800 disabled:cursor-not-allowed"
                                        disabled={!name || !email || !message}
                                    >
                                        Send Message
                                    </button>
                                </div>
                            </form>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
};