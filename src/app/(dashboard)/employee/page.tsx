'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Play,
    Pause,
    Clock,
    Briefcase,
    AlertTriangle,
    Timer as TimerIcon,
    CheckCircle2,
    TrendingUp,
    History,
    Coffee,
    MapPin,
    Zap,
    LogOut as LogOutIcon
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { TaskStatus, Task } from '@/types/data';

export default function EmployeeDashboard() {
    const { user } = useAuth();
    const {
        tasks,
        clients,
        updateTaskStatus,
        updateTaskTime,
        attendance,
        checkIn,
        checkOut
    } = useData();

    const today = new Date().toISOString().split('T')[0];
    const todayRecord = attendance.find(a => a.employeeId === user?.id && a.date === today);
    const isCheckedIn = !!todayRecord && todayRecord.status === 'ACTIVE';
    const isCheckedOut = !!todayRecord && todayRecord.status === 'COMPLETED';

    // Active Timer State
    const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
    const [isActive, setIsActive] = useState(false);
    const [sessionSeconds, setSessionSeconds] = useState(0);

    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Filter tasks for this employee
    const myTasks = tasks.filter(t => t.employeeId === user?.id);
    const activeTask = myTasks.find(t => t.id === activeTaskId);

    // Stats Calculation
    const completedTasks = myTasks.filter(t => t.status === 'COMPLETED').length;
    const totalMyTasks = myTasks.length;
    const efficiency = totalMyTasks > 0 ? Math.round((completedTasks / totalMyTasks) * 100) : 0;
    const totalSecondsLogged = myTasks.reduce((acc, t) => acc + (t.timeSpent || 0), 0);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isActive && activeTaskId) {
            interval = setInterval(() => {
                setSessionSeconds(prev => prev + 1);
            }, 1000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isActive, activeTaskId]);

    // Save session seconds to task when paused or switched
    const saveSession = (taskId: string, seconds: number) => {
        if (seconds > 0) {
            updateTaskTime(taskId, seconds);
        }
    };

    // Handle sudden navigation or close
    useEffect(() => {
        const handleBeforeUnload = () => {
            if (isActive && activeTaskId && sessionSeconds > 0) {
                updateTaskTime(activeTaskId, sessionSeconds);
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [isActive, activeTaskId, sessionSeconds]);

    const formatTime = (s: number) => {
        const hrs = Math.floor(s / 3600);
        const mins = Math.floor((s % 3600) / 60);
        const secs = s % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleStatusUpdate = (id: string, currentStatus: TaskStatus) => {
        const nextStatus: Record<TaskStatus, TaskStatus> = {
            'PENDING': 'IN_PROGRESS',
            'IN_PROGRESS': 'COMPLETED',
            'COMPLETED': 'PENDING'
        };
        updateTaskStatus(id, nextStatus[currentStatus]);
    };

    const toggleTimer = (taskId: string) => {
        if (activeTaskId === taskId) {
            if (isActive) {
                // Pausing
                saveSession(taskId, sessionSeconds);
                setSessionSeconds(0);
            }
            setIsActive(!isActive);
        } else {
            // Switching or starting new
            if (isActive && activeTaskId) {
                saveSession(activeTaskId, sessionSeconds);
            }
            setActiveTaskId(taskId);
            setIsActive(true);
            setSessionSeconds(0);
        }
    };

    return (
        <div className="space-y-8 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-white mb-2 tracking-tight">Focus Mode</h1>
                    <p className="text-neutral-400 font-medium">Tracking work for <span className="text-blue-400">{user?.name}</span> • {myTasks.length} Assigned Tasks</p>
                </div>

                <div className="flex items-center gap-4">
                    <AnimatePresence>
                        {activeTask && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="hidden lg:flex items-center gap-4 bg-white/5 border border-white/10 px-6 py-4 rounded-4xl shadow-2xl"
                            >
                                <div className="text-right border-r border-white/10 pr-4">
                                    <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Active Task</p>
                                    <p className="text-sm font-bold text-white truncate max-w-[150px]">{activeTask.title}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Current Session</p>
                                    <p className="text-2xl font-mono text-white font-black tabular-nums">{formatTime(sessionSeconds)}</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className={`p-1 rounded-[2.2rem] transition-all duration-500 ${isActive ? 'bg-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.2)]' : 'bg-white/5 border border-white/10 shadow-xl'}`}>
                        <button
                            onClick={() => setIsActive(!isActive)}
                            disabled={!activeTaskId}
                            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${isActive
                                ? 'bg-red-500 hover:bg-red-400 shadow-xl'
                                : activeTaskId ? 'bg-emerald-500 hover:bg-emerald-400 shadow-xl' : 'bg-neutral-800 text-neutral-600 cursor-not-allowed'
                                } text-white shadow-2xl`}
                        >
                            {isActive ? <Pause size={24} /> : <Play size={24} fill="currentColor" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Attendance Session Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/5 border border-white/10 p-10 rounded-[3rem] relative overflow-hidden group"
            >
                <div className="absolute inset-0 bg-linear-to-r from-blue-600/5 to-transparent pointer-events-none" />
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
                    <div className="flex items-center gap-6">
                        <div className={`w-16 h-16 rounded-3xl flex items-center justify-center shadow-2xl transition-all duration-500 ${isCheckedIn ? 'bg-emerald-500/20 text-emerald-500 rotate-12' :
                            isCheckedOut ? 'bg-neutral-500/20 text-neutral-500' : 'bg-blue-500/20 text-blue-500'
                            }`}>
                            {isCheckedIn ? <Zap size={32} /> : <Coffee size={32} />}
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-white tracking-tight">
                                {isCheckedIn ? 'Session Active' : isCheckedOut ? 'Workday Completed' : 'Ready to Start?'}
                            </h3>
                            <p className="text-neutral-500 font-bold">
                                {isCheckedIn ? `Started at ${new Date(todayRecord!.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` :
                                    isCheckedOut ? `Log-off: ${new Date(todayRecord!.checkOut!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` :
                                        'Tap Check-in to begin your daily shift.'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {!todayRecord && (
                            <button
                                onClick={() => checkIn(user!.id)}
                                className="px-10 py-5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl shadow-2xl shadow-blue-500/20 transition-all active:scale-95 flex items-center gap-3"
                            >
                                <MapPin size={20} />
                                Check In
                            </button>
                        )}
                        {isCheckedIn && (
                            <button
                                onClick={() => checkOut(user!.id)}
                                className="px-10 py-5 bg-red-600/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white font-black rounded-2xl transition-all active:scale-95 flex items-center gap-3"
                            >
                                <LogOutIcon size={20} />
                                Check Out
                            </button>
                        )}
                        {isCheckedOut && (
                            <div className="flex items-center gap-3 px-8 py-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl font-black italic">
                                <CheckCircle2 size={20} />
                                Logged for today
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                {/* Task List */}
                <div className="xl:col-span-8 space-y-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                                <Briefcase size={22} />
                            </div>
                            Active Assignments
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {myTasks.length === 0 ? (
                            <div className="py-24 text-center bg-white/5 border border-white/10 rounded-[2.5rem] border-dashed">
                                <div className="w-20 h-20 bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-6 text-neutral-600">
                                    <History size={40} />
                                </div>
                                <p className="text-white font-bold text-xl">Queue is empty</p>
                                <p className="text-neutral-500 mt-2">Check back later for new assignments from your Admin.</p>
                            </div>
                        ) : (
                            myTasks.map((task) => {
                                const client = clients.find(c => c.id === task.clientId);
                                const isThisActive = activeTaskId === task.id;
                                const totalTime = (task.timeSpent || 0) + (isThisActive ? sessionSeconds : 0);

                                return (
                                    <motion.div
                                        key={task.id}
                                        layout
                                        className={`relative overflow-hidden group transition-all duration-500 bg-white/5 border border-white/10 p-8 rounded-[2.5rem] hover:bg-white/8 ${isThisActive && isActive ? 'ring-2 ring-emerald-500/50 scale-[1.02] shadow-2xl shadow-emerald-500/10' : ''}`}
                                    >
                                        {isThisActive && isActive && (
                                            <div className="absolute top-0 right-0 p-4">
                                                <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 rounded-full">
                                                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest tabular-nums">Recording</span>
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
                                            <div className="flex-1 space-y-4">
                                                <div className="flex items-center gap-3">
                                                    <span className={`text-[10px] font-black px-3 py-1.5 rounded-full border tracking-widest ${task.status === 'COMPLETED' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                                        task.status === 'IN_PROGRESS' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                                            'bg-neutral-500/10 text-neutral-400 border-neutral-500/20'
                                                        }`}>
                                                        {task.status}
                                                    </span>
                                                    <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest border border-white/5 px-3 py-1.5 rounded-full bg-white/5">{task.type}</span>
                                                </div>

                                                <div>
                                                    <h3 className="text-2xl font-black text-white mb-2 group-hover:text-blue-400 transition-colors tracking-tight">
                                                        {task.title}
                                                    </h3>
                                                    <div className="flex flex-wrap items-center gap-6 text-sm text-neutral-500 font-bold">
                                                        <span className="flex items-center gap-2 group/client">
                                                            <Briefcase size={16} className="text-blue-500" />
                                                            {client?.name}
                                                        </span>
                                                        <span className="flex items-center gap-2">
                                                            <Clock size={16} className="text-amber-500" />
                                                            Due: <span className="text-neutral-300 font-black tabular-nums">{new Date(task.deadline).toLocaleDateString()}</span>
                                                        </span>
                                                        <span className="flex items-center gap-2">
                                                            <TimerIcon size={16} className="text-emerald-500" />
                                                            Time Logged: <span className="text-emerald-400 font-black tabular-nums font-mono">{formatTime(totalTime)}</span>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4">
                                                <button
                                                    onClick={() => handleStatusUpdate(task.id, task.status)}
                                                    className={`flex-1 md:flex-none px-8 py-4 rounded-2xl border font-black text-sm transition-all duration-300 flex items-center justify-center gap-3 ${task.status === 'COMPLETED'
                                                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                                                        : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                                                        }`}
                                                >
                                                    <CheckCircle2 size={18} className={task.status === 'COMPLETED' ? 'text-emerald-500' : 'text-neutral-500'} />
                                                    {task.status === 'COMPLETED' ? 'Mark Pending' : task.status === 'IN_PROGRESS' ? 'Finish Task' : 'Start Task'}
                                                </button>

                                                <button
                                                    onClick={() => toggleTimer(task.id)}
                                                    className={`p-4 rounded-2xl border transition-all duration-500 ${isThisActive && isActive
                                                        ? 'bg-red-500 border-red-400 text-white scale-110 shadow-2xl'
                                                        : 'bg-blue-600/10 border-blue-500/20 text-blue-400 hover:bg-blue-600 hover:text-white transform active:scale-95'
                                                        }`}
                                                >
                                                    {isThisActive && isActive ? <Pause size={24} /> : <TimerIcon size={24} />}
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="xl:col-span-4 space-y-8">
                    <div className="bg-linear-to-br from-indigo-600 to-blue-700 p-10 rounded-[3rem] shadow-2xl shadow-blue-500/20 relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 w-40 h-40 bg-white/20 rounded-full blur-[60px] group-hover:scale-150 transition-transform duration-1000" />
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white mb-8 border border-white/20">
                                <TrendingUp size={24} />
                            </div>
                            <h3 className="text-white font-black text-2xl mb-2 tracking-tight">Performance</h3>
                            <p className="text-blue-100/70 text-[10px] mb-10 uppercase tracking-[0.2em] font-black">Logged Analytics</p>

                            <div className="space-y-8">
                                <div className="space-y-3">
                                    <div className="flex justify-between items-end">
                                        <p className="text-blue-100/60 text-[10px] font-black uppercase tracking-widest">Efficiency</p>
                                        <p className="text-2xl font-black text-white font-mono">{efficiency}%</p>
                                    </div>
                                    <div className="h-1.5 bg-blue-900/40 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${efficiency}%` }}
                                            className="h-full bg-white shadow-[0_0_15px_white]"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white/10 border border-white/10 p-4 rounded-3xl">
                                        <p className="text-blue-100/60 text-[8px] font-black uppercase tracking-widest mb-1">Total Time</p>
                                        <p className="text-sm font-black text-white font-mono">{Math.floor(totalSecondsLogged / 3600)}h {Math.floor((totalSecondsLogged % 3600) / 60)}m</p>
                                    </div>
                                    <div className="bg-white/10 border border-white/10 p-4 rounded-3xl">
                                        <p className="text-blue-100/60 text-[8px] font-black uppercase tracking-widest mb-1">Tasks Done</p>
                                        <p className="text-sm font-black text-white font-mono">{completedTasks}/{totalMyTasks}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem] shadow-xl">
                        <h3 className="text-white font-black mb-8 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                                <AlertTriangle size={18} />
                            </div>
                            Team Bulletin
                        </h3>
                        <div className="space-y-4">
                            <div className="p-6 bg-white/3 border border-white/5 rounded-3xl group hover:bg-white/5 transition-all">
                                <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2">Announcement</p>
                                <p className="text-neutral-300 text-xs font-bold leading-relaxed">
                                    Weekly sync scheduled for Friday 10:00 AM. Prepare your project updates.
                                </p>
                            </div>
                            <div className="p-6 bg-white/3 border border-white/5 rounded-3xl group hover:bg-white/5 transition-all">
                                <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-2">System Notice</p>
                                <p className="text-neutral-400 text-xs font-bold leading-relaxed">
                                    Time tracking is now persisted automatically across sessions.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
