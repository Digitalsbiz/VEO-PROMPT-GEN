
import { User, UserRole } from '../types';
import { ADMIN_EMAIL, ADMIN_PASSWORD } from '../constants';

const USERS_STORAGE_KEY = 'veoAllUsers';

const initializeUsers = (): User[] => {
    try {
        const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
        if (storedUsers) {
            const parsedUsers: User[] = JSON.parse(storedUsers);
            const adminExists = parsedUsers.some(u => u.email === ADMIN_EMAIL);
            if (!adminExists) {
                const adminUser: User = { email: ADMIN_EMAIL, password: ADMIN_PASSWORD, role: 'admin', confirmed: true };
                parsedUsers.push(adminUser);
                localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(parsedUsers));
            }
            return parsedUsers;
        }
    } catch (error) {
        console.error("Failed to parse users from localStorage", error);
    }
    
    const adminUser: User = { email: ADMIN_EMAIL, password: ADMIN_PASSWORD, role: 'admin', confirmed: true };
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([adminUser]));
    return [adminUser];
};

let users: User[] = initializeUsers();

const persistUsers = () => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

export const userService = {
    getAllUsers: (): User[] => {
        return [...users];
    },

    getUserByEmail: (email: string): User | undefined => {
        return users.find(u => u.email.toLowerCase() === email.toLowerCase());
    },

    addUser: (newUser: Pick<User, 'email' | 'password'>): User => {
        const user: User = {
            ...newUser,
            role: 'free',
            confirmed: false,
        };
        users.push(user);
        persistUsers();
        return user;
    },

    updateUserRole: (email: string, newRole: UserRole): User | undefined => {
        const userIndex = users.findIndex(u => u.email === email);
        if (userIndex === -1) {
            return undefined;
        }
        users[userIndex].role = newRole;
        persistUsers();
        return users[userIndex];
    },
    
    confirmUser: (email: string): User | undefined => {
        const userIndex = users.findIndex(u => u.email === email);
        if (userIndex === -1) {
            return undefined;
        }
        users[userIndex].confirmed = true;
        persistUsers();
        return users[userIndex];
    },

    deleteUser: (email: string): boolean => {
        const initialLength = users.length;
        users = users.filter(u => u.email !== email);
        if (users.length < initialLength) {
            persistUsers();
            return true;
        }
        return false;
    },
};
