
import React, { useState, useEffect } from 'react';
import { UsersIcon, TrashIcon, AlertTriangleIcon } from './icons';
import { ADMIN_EMAIL } from '../constants';
import { User, UserRole } from '../App';

interface AdminPanelProps {
    users: User[];
    onDeleteUser: (email: string) => void;
    onUpdateUserRole: (email: string, role: UserRole) => void;
    onBackToApp: () => void;
    currentUserEmail: string;
    onConfirmUser: (email: string) => void;
}

const ConfirmationModal: React.FC<{ user: User; onConfirm: () => void; onCancel: () => void }> = ({ user, onConfirm, onCancel }) => {
     // Handle Escape key
    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onCancel();
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
    }, [onCancel]);

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-xl w-full max-w-md p-6">
                <div className="flex items-start">
                    <div className="flex-shrink-0 mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-900 sm:mx-0 sm:h-10 sm:w-10">
                         <AlertTriangleIcon className="h-6 w-6 text-red-400" />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <h3 className="text-lg leading-6 font-medium text-slate-100" id="modal-title">
                            Delete User
                        </h3>
                        <div className="mt-2">
                            <p className="text-sm text-slate-400">
                                Are you sure you want to delete the user <strong className="font-semibold text-slate-200">{user.email}</strong>? This action cannot be undone.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <button
                        type="button"
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 focus:ring-offset-slate-800 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
                        onClick={onConfirm}
                    >
                        Delete
                    </button>
                    <button
                        type="button"
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-slate-600 shadow-sm px-4 py-2 bg-slate-700 text-base font-medium text-slate-200 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-slate-800 sm:mt-0 sm:w-auto sm:text-sm transition-colors"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export const AdminPanel: React.FC<AdminPanelProps> = ({ users, onDeleteUser, onUpdateUserRole, onBackToApp, currentUserEmail, onConfirmUser }) => {
    const [userToDelete, setUserToDelete] = useState<User | null>(null);

    const handleDeleteClick = (user: User) => {
        setUserToDelete(user);
    };

    const confirmDelete = () => {
        if (userToDelete) {
            onDeleteUser(userToDelete.email);
            setUserToDelete(null);
        }
    };

    const cancelDelete = () => {
        setUserToDelete(null);
    };

    const getRoleClass = (role: UserRole) => {
        switch (role) {
            case 'admin':
                return 'bg-amber-900 text-amber-300';
            case 'paid':
                return 'bg-emerald-900 text-emerald-300';
            case 'free':
            default:
                return 'bg-slate-700 text-slate-300';
        }
    };

    return (
        <>
            {userToDelete && <ConfirmationModal user={userToDelete} onConfirm={confirmDelete} onCancel={cancelDelete} />}
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

                    <div className="bg-slate-800/50 border border-slate-700 rounded-lg shadow-lg overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-700">
                            <thead className="bg-slate-800">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                        Email Address
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                        Role
                                    </th>
                                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th scope="col" className="relative px-6 py-3">
                                        <span className="sr-only">Actions</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700">
                                {users.map((user) => (
                                    <tr key={user.email} className="hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-200">{user.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                                            {user.role === 'admin' ? (
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleClass(user.role)}`}>
                                                    Admin
                                                </span>
                                            ) : (
                                                <select
                                                    value={user.role}
                                                    onChange={(e) => onUpdateUserRole(user.email, e.target.value as UserRole)}
                                                    className="w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm p-1.5 text-xs text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                                                    aria-label={`Role for ${user.email}`}
                                                >
                                                    <option value="free">Free</option>
                                                    <option value="paid">Paid</option>
                                                </select>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            {user.confirmed ? (
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-900 text-green-300">
                                                    Confirmed
                                                </span>
                                            ) : (
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-900 text-yellow-300">
                                                    Pending
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end gap-4">
                                                {!user.confirmed && user.role !== 'admin' && (
                                                    <button
                                                        onClick={() => onConfirmUser(user.email)}
                                                        className="font-semibold text-emerald-500 hover:text-emerald-400 transition-colors"
                                                        aria-label={`Confirm user ${user.email}`}
                                                    >
                                                        Confirm User
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDeleteClick(user)}
                                                    disabled={user.role === 'admin'}
                                                    className="text-red-500 hover:text-red-400 disabled:text-slate-600 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                                                    aria-label={`Delete user ${user.email}`}
                                                >
                                                    <TrashIcon className="w-4 h-4" />
                                                    <span>Delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
};
