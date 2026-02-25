'use client';

import React from 'react';
import {
    Users,
    Briefcase,
    CheckCircle2,
    Clock,
    TrendingUp,
    ArrowUpRight,
    Plus,
    Zap
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useData } from '@/context/DataContext';

export default function AdminDashboard() {
    const { clients, tasks } = useData();

    const completedTasks = tasks.filter(t => t.status === 'COMPLETED').length;
    const totalTasks = tasks.length || 1;
    const efficiency = Math.round((completedTasks / totalTasks) * 100);
    const totalSeconds = tasks.reduce((acc, t) => acc + (t.timeSpent || 0), 0);
    const totalHours = Math.floor(totalSeconds / 3600);

    const stats = [
        { label: 'Total Clients', value: clients.length.toString(), icon: Users, trend: '+12%', color: 'blue' },
        { label: 'Logged Hours', value: `${totalHours}h`, icon: Zap, trend: '+8%', color: 'purple' },
        { label: 'Completed', value: completedTasks.toString(), icon: CheckCircle2, trend: '+18%', color: 'emerald' },
        { label: 'Efficiency', value: `${efficiency}%`, icon: TrendingUp, trend: '+2%', color: 'amber' },
    ];

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Enterprise Overview</h1>
                    <p className="text-neutral-400">Monitoring performance and resource allocation in real-time.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="text-right hidden md:block">
                        <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Network Status</p>
                        <div className="flex items-center justify-end gap-2 text-emerald-500 font-bold text-xs uppercase tracking-tighter">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                            Live Feed
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white/5 border border-white/10 p-8 rounded-4xl hover:bg-white/[0.07] transition-all group relative overflow-hidden"
                        >
                            <div className={`absolute -right-6 -top-6 w-32 h-32 bg-${stat.color}-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700`} />

                            <div className="flex items-start justify-between mb-6 relative z-10">
                                <div className={`w-12 h-12 rounded-2xl bg-${stat.color}-500/10 text-${stat.color}-500 border border-${stat.color}-500/20 flex items-center justify-center shadow-lg shadow-${stat.color}-500/10`}>
                                    <Icon size={24} />
                                </div>
                                <div className="flex items-center gap-1 text-emerald-500 text-xs font-black font-mono bg-emerald-500/10 px-2 py-1 rounded-lg">
                                    <ArrowUpRight size={14} />
                                    {stat.trend}
                                </div>
                            </div>

                            <div className="relative z-10">
                                <p className="text-neutral-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                                <div className="flex items-baseline gap-1">
                                    <p className="text-4xl font-black text-white tracking-tighter">{stat.value}</p>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-[2.5rem] p-10 shadow-2xl">
                    <div className="flex items-center justify-between mb-10">
                        <h3 className="text-2xl font-black text-white tracking-tight">Recent Activity Stream</h3>
                        <button className="text-blue-500 text-[10px] font-black uppercase tracking-widest hover:text-blue-400 transition-colors">History Log</button>
                    </div>

                    <div className="space-y-8">
                        {tasks.length === 0 ? (
                            <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                                <p className="text-neutral-500 font-bold italic">No active data streams detected.</p>
                            </div>
                        ) : (
                            tasks.slice(-5).reverse().map((task, i) => (
                                <div key={task.id} className="flex items-center gap-6 group">
                                    <div className="w-12 h-12 rounded-2xl bg-neutral-800 border border-white/10 flex items-center justify-center text-sm font-black text-white transition-all group-hover:bg-blue-600 group-hover:border-blue-500 group-hover:scale-110 shadow-xl">
                                        {task.title[0]}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-1">
                                            <p className="text-lg font-black text-white group-hover:text-blue-400 transition-colors tracking-tight">{task.title}</p>
                                            <span className="text-[8px] font-black bg-white/5 border border-white/10 px-2 py-0.5 rounded text-neutral-500 uppercase tracking-widest">{task.type}</span>
                                        </div>
                                        <p className="text-xs text-neutral-500 font-bold">State change to <span className="text-blue-400 uppercase tracking-widest px-1">{task.status}</span> • Handled by Team</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-neutral-700 uppercase tabular-nums">14:52 PM</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="bg-linear-to-br from-indigo-600 via-blue-600 to-blue-800 rounded-[2.5rem] p-12 relative overflow-hidden group shadow-[0_40px_80px_-20px_rgba(37,99,235,0.4)]">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />
                    <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-[80px] group-hover:scale-150 transition-transform duration-1000" />

                    <div className="relative z-10 flex flex-col h-full">
                        <div className="mb-auto">
                            <h3 className="text-white font-black text-3xl tracking-tighter mb-8 leading-tight">Sector<br />Performance</h3>
                            <div className="space-y-6">
                                {['WEB', 'SEO', 'SMM'].map(type => {
                                    const count = tasks.filter(t => t.type === type).length;
                                    const total = tasks.length || 1;
                                    const percent = Math.round((count / total) * 100);

                                    return (
                                        <div key={type} className="space-y-2">
                                            <div className="flex justify-between text-[10px] font-black text-blue-100/70 uppercase tracking-[0.2em]">
                                                <span>{type} Sector</span>
                                                <span>{percent}%</span>
                                            </div>
                                            <div className="h-2 bg-black/20 rounded-full overflow-hidden backdrop-blur-md">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${percent}%` }}
                                                    className="h-full bg-white shadow-[0_0_20px_white]"
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="pt-12">
                            <button className="w-full bg-white text-blue-600 font-black py-5 rounded-2xl hover:bg-blue-50 transition-all flex items-center justify-center gap-3 shadow-2xl active:scale-95 text-sm uppercase tracking-widest">
                                <Plus size={20} />
                                Generate Sector Audit
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
