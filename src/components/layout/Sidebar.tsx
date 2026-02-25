'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
    LayoutDashboard,
    Briefcase,
    Users,
    LogOut,
    FolderKanban,
    CheckSquare,
    Clock,
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Sidebar() {
    const { user, logout } = useAuth();
    const pathname = usePathname();

    const adminLinks = [
        { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
        { name: 'Attendance', href: '/admin/attendance', icon: Clock },
        { name: 'Clients', href: '/admin/clients', icon: Briefcase },
        { name: 'Tasks', href: '/admin/tasks', icon: FolderKanban },
        { name: 'Team', href: '/admin/users', icon: Users },
    ];

    const employeeLinks = [
        { name: 'My Tasks', href: '/employee', icon: CheckSquare },
        { name: 'Tracking', href: '/employee/tracking', icon: FolderKanban },
        { name: 'Attendance', href: '/employee/attendance', icon: Clock },
    ];

    const links = user?.role === 'ADMIN' ? adminLinks : employeeLinks;

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-neutral-950 border-r border-white/10 flex flex-col z-50">
            <div className="p-6">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">
                        W
                    </div>
                    <span className="text-xl font-bold text-white tracking-tight">WorkTracker</span>
                </div>

                <nav className="space-y-1">
                    {links.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href;

                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative ${isActive
                                    ? 'text-white'
                                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="sidebar-hover"
                                        className="absolute inset-0 bg-blue-600/20 border border-blue-500/30 rounded-xl"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.2 }}
                                    />
                                )}
                                <Icon size={20} className={isActive ? 'text-blue-500' : ''} />
                                <span className="font-medium">{link.name}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="mt-auto p-6 space-y-4">
                <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                    <div className="flex items-center gap-3 mb-1">
                        <div className="w-10 h-10 bg-neutral-800 rounded-full flex items-center justify-center text-white border border-white/10">
                            {user?.name?.[0]?.toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
                            <p className="text-xs text-neutral-500 capitalize">{user?.role.toLowerCase()}</p>
                        </div>
                    </div>
                </div>

                <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-neutral-400 hover:text-red-400 hover:bg-red-400/10 transition-all"
                >
                    <LogOut size={20} />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </aside>
    );
}
