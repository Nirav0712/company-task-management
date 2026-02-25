'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Role } from '@/types/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, UserPlus, Shield, User, Mail, Lock, X, CheckCircle2 } from 'lucide-react';

export default function UserManagementPage() {
    const { users, addUser } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<Role>('EMPLOYEE');
    const [success, setSuccess] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addUser(name, email, password, role);
        setSuccess(true);
        setTimeout(() => {
            setSuccess(false);
            setIsModalOpen(false);
            // Reset form
            setName('');
            setEmail('');
            setPassword('');
            setRole('EMPLOYEE');
        }, 1500);
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Team Management</h1>
                    <p className="text-neutral-400">Manage your employees and administrative accounts.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-blue-500/20"
                >
                    <UserPlus size={20} />
                    Add Team Member
                </button>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">User</th>
                                <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-white/2 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center border border-white/10 text-white font-bold">
                                                {user.name[0]}
                                            </div>
                                            <span className="text-white font-medium">{user.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-neutral-400">{user.email}</td>
                                    <td className="px-6 py-4">
                                        <span className={`text-[10px] font-bold px-2 py-1 rounded border flex items-center gap-1 w-fit ${user.role === 'ADMIN' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                            }`}>
                                            {user.role === 'ADMIN' ? <Shield size={12} /> : <User size={12} />}
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className="text-xs text-emerald-500 font-medium">Active</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => setIsModalOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-lg bg-neutral-900 border border-white/10 rounded-3xl shadow-2xl p-8 overflow-hidden"
                        >
                            {success ? (
                                <div className="py-12 flex flex-col items-center justify-center text-center">
                                    <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 mb-6">
                                        <CheckCircle2 size={40} />
                                    </div>
                                    <h2 className="text-2xl font-bold text-white mb-2">Success!</h2>
                                    <p className="text-neutral-400">User has been added to the team.</p>
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-center justify-between mb-8">
                                        <h2 className="text-2xl font-bold text-white">Add Team Member</h2>
                                        <button
                                            onClick={() => setIsModalOpen(false)}
                                            className="text-neutral-500 hover:text-white transition-colors"
                                        >
                                            <X size={24} />
                                        </button>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-neutral-400">Full Name</label>
                                            <div className="relative">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600" size={18} />
                                                <input
                                                    required
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                                    placeholder="John Doe"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-neutral-400">Email Address</label>
                                            <div className="relative">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600" size={18} />
                                                <input
                                                    type="email"
                                                    required
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                                    placeholder="john@example.com"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-neutral-400">Password</label>
                                            <div className="relative">
                                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600" size={18} />
                                                <input
                                                    type="password"
                                                    required
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                                    placeholder="••••••••"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-neutral-400">Role</label>
                                            <div className="flex gap-4">
                                                <button
                                                    type="button"
                                                    onClick={() => setRole('ADMIN')}
                                                    className={`flex-1 py-3 rounded-xl border transition-all ${role === 'ADMIN' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-white/5 border-white/10 text-neutral-500'
                                                        }`}
                                                >
                                                    Admin
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setRole('EMPLOYEE')}
                                                    className={`flex-1 py-3 rounded-xl border transition-all ${role === 'EMPLOYEE' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-white/5 border-white/10 text-neutral-500'
                                                        }`}
                                                >
                                                    Employee
                                                </button>
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98]"
                                        >
                                            Create User
                                        </button>
                                    </form>
                                </>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
