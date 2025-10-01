
export type UserRole = 'admin' | 'free' | 'paid';

export interface User {
    email: string;
    password: string;
    role: UserRole;
    confirmed: boolean;
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
