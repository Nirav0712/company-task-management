'use client';

import React from 'react';
import { History, Search, Filter, Calendar } from 'lucide-react';
import { useData } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';

export default function TrackingPage() {
    const { tasks } = useData();
    const { user } = useAuth();

    const myTasks = tasks.filter(t => t.employeeId === user?.id);
    const sortedTasks = [...myTasks].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const totalSeconds = myTasks.reduce((acc, t) => acc + (t.timeSpent || 0), 0);
    const totalHours = Math.floor(totalSeconds / 3600);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Time Tracking</h1>
                <p className="text-neutral-400 font-medium">History of time logged against your assigned tasks.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/5 border border-white/10 p-6 rounded-3xl">
                    <p className="text-neutral-500 text-xs font-black uppercase tracking-widest mb-2">Total Logged Time</p>
                    <p className="text-3xl font-black text-white">{totalHours}h {Math.floor((totalSeconds % 3600) / 60)}m</p>
                </div>
                <div className="bg-white/5 border border-white/10 p-6 rounded-3xl">
                    <p className="text-neutral-500 text-xs font-black uppercase tracking-widest mb-2">Total Tasks</p>
                    <p className="text-3xl font-black text-white">{myTasks.length}</p>
                </div>
                <div className="bg-white/5 border border-white/10 p-6 rounded-3xl">
                    <p className="text-neutral-500 text-xs font-black uppercase tracking-widest mb-2">Completed</p>
                    <p className="text-3xl font-black text-white">{myTasks.filter(t => t.status === 'COMPLETED').length}</p>
                </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden">
                <div className="p-8 border-b border-white/10 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white flex items-center gap-3">
                        <History size={20} className="text-blue-500" />
                        Task Duration Logs
                    </h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 text-[10px] font-black text-neutral-500 uppercase tracking-widest">
                                <th className="px-8 py-6">Task Title</th>
                                <th className="px-8 py-6">Time Spent</th>
                                <th className="px-8 py-6">Status</th>
                                <th className="px-8 py-6 text-right">Deadline</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {sortedTasks.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-8 py-20 text-center">
                                        <History size={48} className="text-neutral-700 mx-auto mb-4" />
                                        <p className="text-neutral-500 font-bold">No tasks logged yet.</p>
                                    </td>
                                </tr>
                            ) : (
                                sortedTasks.map((task) => (
                                    <tr key={task.id} className="group hover:bg-white/2 transition-all">
                                        <td className="px-8 py-6">
                                            <p className="font-bold text-white">{task.title}</p>
                                            <p className="text-neutral-500 text-[10px] uppercase font-black">{task.type}</p>
                                        </td>
                                        <td className="px-8 py-6 text-emerald-400 font-mono text-sm font-bold">
                                            {Math.floor(task.timeSpent / 3600)}h {Math.floor((task.timeSpent % 3600) / 60)}m {task.timeSpent % 60}s
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${task.status === 'COMPLETED' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                                                task.status === 'IN_PROGRESS' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                                                    'bg-neutral-500/10 text-neutral-400 border border-neutral-500/20'
                                                }`}>
                                                {task.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right text-neutral-500 text-xs font-bold">
                                            {new Date(task.deadline).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
