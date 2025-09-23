
import React from 'react';
import { UsersIcon, TrashIcon } from './icons';
import { ADMIN_EMAIL } from '../constants';

interface AdminPanelProps {
    users: string[];
    onDeleteUser: (email: string) => void;
    onBackToApp: () => void;
    currentUserEmail: string;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ users, onDeleteUser, onBackToApp, currentUserEmail }) => {
    return (
        <div className="min-h-screen bg-slate-900 text-slate-200 font-sans flex flex-col items-center p-4 md:p-8">
            <div className="w-full max-w-4xl">
                <header className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <UsersIcon className="w-8 h-8 text-indigo-400" />
                        <h1 className="text-3xl font-bold text-slate-100 tracking-tight">
                            Admin Panel
                        </h1>
                    </div>
                    <button
                        onClick={onBackToApp}
                        className="bg-slate-700 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md transition duration-200 ease-in-out text-sm"
                    >
                        Back to App
                    </button>
                </header>

                <div className="bg-slate-800/50 border border-slate-700 rounded-lg shadow-lg overflow-hidden">
                    <div className="p-4 border-b border-slate-700">
                         <h2 className="text-xl font-semibold text-slate-100">User Management</h2>
                         <p className="text-sm text-slate-400 mt-1">Total users: {users.length}</p>
                    </div>
                   
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-slate-300">
                            <thead className="text-xs text-slate-400 uppercase bg-slate-800">
                                <tr>
                                    <th scope="col" className="px-6 py-3">
                                        Email Address
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Role
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((email) => (
                                    <tr key={email} className="bg-slate-800/50 border-b border-slate-700 hover:bg-slate-800/80 transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-100 whitespace-nowrap">
                                            {email}
                                            {email === currentUserEmail && <span className="text-xs text-indigo-400 ml-2">(You)</span>}
                                        </td>
                                        <td className="px-6 py-4">
                                            {email === ADMIN_EMAIL ? (
                                                <span className="bg-amber-500/20 text-amber-300 text-xs font-semibold px-2.5 py-0.5 rounded-full">Admin</span>
                                            ) : (
                                                <span className="bg-slate-700 text-slate-300 text-xs font-semibold px-2.5 py-0.5 rounded-full">User</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => onDeleteUser(email)}
                                                disabled={email === currentUserEmail}
                                                className="font-medium text-red-500 hover:text-red-400 disabled:text-slate-500 disabled:cursor-not-allowed transition duration-150 ease-in-out"
                                                aria-label={`Delete user ${email}`}
                                            >
                                                <TrashIcon className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
             <footer className="text-center p-4 mt-8 text-slate-500 text-sm">
                <p>Powered by Google Gemini.</p>
            </footer>
        </div>
    );
};
