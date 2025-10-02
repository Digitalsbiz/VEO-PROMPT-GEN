export type UserRole = 'admin' | 'free' | 'paid';

export interface User {
    uid: string;
    email: string;
    role: UserRole;
    emailVerified: boolean;
}

export interface ReferenceImage {
    data: string;
    mimeType: string;
}

export interface GenerationData {
    count: number;
    lastResetDate: string;
}

export type AppView = 'login' | 'app' | 'admin' | 'about' | 'privacy';
