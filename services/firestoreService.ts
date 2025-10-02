import { doc, setDoc, getDoc, collection, getDocs, updateDoc, query } from 'firebase/firestore';
import { db } from './firebase';
import { User, UserRole } from '../types';
import { ADMIN_EMAIL } from '../constants';

export const firestoreService = {
    async getUserProfile(uid: string): Promise<Pick<User, 'uid' | 'email' | 'role'> | null> {
        const userDocRef = doc(db, 'users', uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
            return userDoc.data() as Pick<User, 'uid' | 'email' | 'role'>;
        }
        return null;
    },

    async createUserProfile(uid: string, email: string): Promise<void> {
        const userDocRef = doc(db, 'users', uid);
        const isAdmin = email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
        await setDoc(userDocRef, {
            uid,
            email,
            role: isAdmin ? 'admin' : 'free',
        });
    },

    async getAllUsers(): Promise<User[]> {
        const usersCollectionRef = collection(db, 'users');
        const q = query(usersCollectionRef);
        const querySnapshot = await getDocs(q);
        const users: User[] = [];
        querySnapshot.forEach((doc) => {
            // Note: emailVerified is part of the auth user, not firestore.
            // We default it to false for display, as we can't fetch it for all users from the client.
            const data = doc.data();
            users.push({
                uid: data.uid,
                email: data.email,
                role: data.role,
                emailVerified: false 
            });
        });
        return users;
    },

    async updateUserRole(uid: string, newRole: UserRole): Promise<void> {
        const userDocRef = doc(db, 'users', uid);
        await updateDoc(userDocRef, {
            role: newRole
        });
    }
};
