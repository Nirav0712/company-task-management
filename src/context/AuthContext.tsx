'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState, Role } from '@/types/auth';
import { useRouter } from 'next/navigation';

interface AuthContextType extends AuthState {
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    addUser: (name: string, email: string, password: string, role: Role) => void;
    removeUser: (id: string) => void;
    users: User[];
}

const INITIAL_USERS: (User & { password: string })[] = [
    { id: '1', name: 'Admin', email: 'admin@gmail.com', password: 'admin123', role: 'ADMIN' },
    { id: '2', name: 'Ruchi', email: 'ruchi@gmail.com', password: 'ruchi123', role: 'EMPLOYEE' },
    { id: '3', name: 'Pragati', email: 'pragati@gmail.com', password: 'pragati123', role: 'EMPLOYEE' },
    { id: '4', name: 'Ayushi', email: 'ayushi@gmail.com', password: 'ayushi123', role: 'EMPLOYEE' },
    { id: '5', name: 'Jency', email: 'jency@gmail.com', password: 'jency123', role: 'EMPLOYEE' },
    { id: '6', name: 'Mansi', email: 'mansi@gmail.com', password: 'mansi123', role: 'EMPLOYEE' },
    { id: '7', name: 'Nisha', email: 'nisha@gmail.com', password: 'nisha123', role: 'EMPLOYEE' },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState<AuthState>({
        user: null,
        isLoading: true,
    });
    const [users, setUsers] = useState<User[]>([]);

    const router = useRouter();

    useEffect(() => {
        const storedUsersStr = localStorage.getItem('app_users');
        let finalUsers = INITIAL_USERS;

        if (storedUsersStr) {
            try {
                const parsed = JSON.parse(storedUsersStr);
                if (Array.isArray(parsed)) {
                    // Sync: Add any users from INITIAL_USERS that are missing in localStorage by email
                    const storedEmails = new Set(parsed.map((u: any) => u.email));
                    const missingUsers = INITIAL_USERS.filter(u => !storedEmails.has(u.email));

                    if (missingUsers.length > 0) {
                        finalUsers = [...parsed, ...missingUsers];
                        localStorage.setItem('app_users', JSON.stringify(finalUsers));
                    } else {
                        finalUsers = parsed;
                    }

                    // Migration: Ensure all have passwords (fallback case)
                    if (finalUsers.length > 0 && !finalUsers[0].password) {
                        localStorage.setItem('app_users', JSON.stringify(INITIAL_USERS));
                        finalUsers = INITIAL_USERS;
                    }
                }
            } catch (e) {
                localStorage.setItem('app_users', JSON.stringify(INITIAL_USERS));
            }
        } else {
            localStorage.setItem('app_users', JSON.stringify(INITIAL_USERS));
        }

        setUsers(finalUsers.map(({ password, ...u }: any) => u));

        // Check session
        const savedUser = localStorage.getItem('auth_user');
        if (savedUser) {
            setState({ user: JSON.parse(savedUser), isLoading: false });
        } else {
            setState(s => ({ ...s, isLoading: false }));
        }
    }, []);

    const login = async (email: string, password: string): Promise<boolean> => {
        const storedUsers = JSON.parse(localStorage.getItem('app_users') || '[]');
        const foundUser = storedUsers.find((u: any) => u.email === email && u.password === password);

        if (foundUser) {
            const { password: _, ...userWithoutPassword } = foundUser;
            localStorage.setItem('auth_user', JSON.stringify(userWithoutPassword));
            setState({ user: userWithoutPassword, isLoading: false });
            router.push(userWithoutPassword.role === 'ADMIN' ? '/admin' : '/employee');
            return true;
        }
        return false;
    };

    const addUser = (name: string, email: string, password: string, role: Role) => {
        const storedUsers = JSON.parse(localStorage.getItem('app_users') || '[]');
        const newUser = { id: Math.random().toString(36).substr(2, 9), name, email, password, role };
        const updatedUsers = [...storedUsers, newUser];
        localStorage.setItem('app_users', JSON.stringify(updatedUsers));
        setUsers(updatedUsers.map(({ password, ...u }) => u));
    };

    const removeUser = (id: string) => {
        const storedUsers = JSON.parse(localStorage.getItem('app_users') || '[]');
        const updatedUsers = storedUsers.filter((u: any) => u.id !== id);
        localStorage.setItem('app_users', JSON.stringify(updatedUsers));
        setUsers(updatedUsers.map(({ password, ...u }: any) => u));
    };

    const logout = () => {
        localStorage.removeItem('auth_user');
        setState({ user: null, isLoading: false });
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ ...state, login, logout, addUser, removeUser, users }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
