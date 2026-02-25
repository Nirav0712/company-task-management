'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Search,
    Filter,
    MoreVertical,
    Clock,
    Calendar,
    AlertTriangle,
    CheckCircle2,
    X,
    User,
    Briefcase,
    Trash2,
    ChevronDown,
    Check
} from 'lucide-react';
import { useData } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';
import { ProjectType, Priority, TaskStatus } from '@/types/data';

export default function TasksPage() {
    const { clients, tasks, addTask, deleteTask, updateTaskStatus } = useData();
    const { users } = useAuth();

    const [activeTab, setActiveTab] = useState<ProjectType | 'ALL'>('ALL');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [success, setSuccess] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<'CLIENT' | 'EMPLOYEE' | 'TYPE' | 'PRIORITY' | null>(null);

    // Form State
    const [title, setTitle] = useState('');
    const [clientId, setClientId] = useState('');
    const [employeeId, setEmployeeId] = useState('');
    const [priority, setPriority] = useState<Priority>('MEDIUM');
    const [type, setType] = useState<ProjectType>('WEB');
    const [deadline, setDeadline] = useState('');
    const [description, setDescription] = useState('');

    const filteredTasks = tasks.filter(t => activeTab === 'ALL' || t.type === activeTab);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addTask({
            title,
            clientId,
            employeeId,
            priority,
            type,
            deadline,
            description
        });
        setSuccess(true);
        setTimeout(() => {
            setSuccess(false);
            setIsModalOpen(false);
            // Reset
            setTitle('');
            setClientId('');
            setEmployeeId('');
            setPriority('MEDIUM');
            setType('WEB');
            setDeadline('');
            setDescription('');
        }, 1500);
    };

    const employees = users.filter(u => u.role === 'EMPLOYEE');

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Task Management</h1>
                    <p className="text-neutral-400">Assign and track performance across all project categories.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-500  text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-blue-500/20 font-bold"
                >
                    <Plus size={20} />
                    Create New Task
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 w-full md:w-auto overflow-x-auto">
                    {['ALL', 'SMM', 'SEO', 'WEB'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab === tab
                                ? 'bg-blue-600 text-white shadow-lg'
                                : 'text-neutral-500 hover:text-white'
                                }`}
                        >
                            {tab === 'ALL' ? 'All Tasks' : tab}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[1000px]">
                        <thead>
                            <tr className="border-b border-white/10 bg-white/5">
                                <th className="px-8 py-5 text-xs font-bold text-neutral-500 uppercase tracking-widest">Task Details</th>
                                <th className="px-8 py-5 text-xs font-bold text-neutral-500 uppercase tracking-widest">Client</th>
                                <th className="px-8 py-5 text-xs font-bold text-neutral-500 uppercase tracking-widest">Assignee</th>
                                <th className="px-8 py-5 text-xs font-bold text-neutral-500 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-5 text-xs font-bold text-neutral-500 uppercase tracking-widest">Priority</th>
                                <th className="px-8 py-5 text-xs font-bold text-neutral-500 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            <AnimatePresence mode="popLayout">
                                {filteredTasks.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-8 py-20 text-center text-neutral-500 italic">
                                            No tasks assigned for this category.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredTasks.map((task) => {
                                        const client = clients.find(c => c.id === task.clientId);
                                        const employee = users.find(u => u.id === task.employeeId);

                                        return (
                                            <motion.tr
                                                key={task.id}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="hover:bg-white/5 transition-colors group"
                                            >
                                                <td className="px-8 py-6">
                                                    <div>
                                                        <p className="text-white font-bold group-hover:text-blue-400 transition-colors mb-1">{task.title}</p>
                                                        <div className="flex items-center gap-3 text-neutral-500 text-xs">
                                                            <span className="flex items-center gap-1 font-bold">
                                                                <Clock size={12} />
                                                                {new Date(task.deadline).toLocaleDateString()}
                                                            </span>
                                                            <span className="w-1 h-1 bg-neutral-700 rounded-full" />
                                                            <span className="font-bold uppercase tracking-tighter">{task.type}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                                                            <Briefcase size={14} />
                                                        </div>
                                                        <span className="text-neutral-300 font-medium">{client?.name || 'Unknown Client'}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-neutral-800 border border-white/10 flex items-center justify-center text-[10px] font-bold text-white uppercase">
                                                            {employee?.name?.[0] || 'U'}
                                                        </div>
                                                        <span className="text-neutral-300 font-medium">{employee?.name || 'Unassigned'}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className={`text-[10px] font-bold px-3 py-1 rounded-full border ${task.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                        task.status === 'IN_PROGRESS' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                                            'bg-neutral-500/10 text-neutral-400 border-neutral-500/20'
                                                        }`}>
                                                        {task.status.replace('_', ' ')}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className={`text-[10px] font-bold px-2 py-1 rounded border flex items-center gap-1 w-fit ${task.priority === 'CRITICAL' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                                        task.priority === 'HIGH' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                                                            task.priority === 'MEDIUM' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                                                'bg-neutral-500/10 text-neutral-400 border-neutral-500/20'
                                                        }`}>
                                                        <AlertTriangle size={10} />
                                                        {task.priority}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <button
                                                        onClick={() => deleteTask(task.id)}
                                                        className="p-2 text-neutral-500 hover:text-red-500 transition-colors"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </td>
                                            </motion.tr>
                                        );
                                    })
                                )}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-70 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                            onClick={() => setIsModalOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 40 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 40 }}
                            className="relative w-full max-w-2xl bg-neutral-900 border border-white/10 rounded-4xl shadow-2xl p-10 overflow-hidden"
                        >
                            {success ? (
                                <div className="py-20 flex flex-col items-center justify-center text-center">
                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 mb-8">
                                        <CheckCircle2 size={48} />
                                    </motion.div>
                                    <h2 className="text-3xl font-bold text-white mb-2">Task Created</h2>
                                    <p className="text-neutral-400">Assignment successful and notification scheduled.</p>
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-center justify-between mb-8">
                                        <h2 className="text-3xl font-bold text-white">Create New Assignment</h2>
                                        <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-neutral-500 hover:text-white transition-all"><X size={20} /></button>
                                    </div>

                                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2 md:col-span-2">
                                            <label className="text-xs font-bold text-neutral-500 uppercase ml-2 tracking-widest">Task Title</label>
                                            <input required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50" placeholder="Monthly SEO Performance Report" />
                                        </div>

                                        <div className="space-y-2 relative">
                                            <label className="text-xs font-bold text-neutral-500 uppercase ml-2 tracking-widest">Select Client</label>
                                            <div className="relative">
                                                <button
                                                    type="button"
                                                    onClick={() => setOpenDropdown(openDropdown === 'CLIENT' ? null : 'CLIENT')}
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 flex items-center justify-between transition-all"
                                                >
                                                    <span className={clientId ? 'text-white' : 'text-neutral-500'}>
                                                        {clients.find(c => c.id === clientId)?.name || 'Select a Client'}
                                                    </span>
                                                    <ChevronDown className={`transition-transform duration-200 ${openDropdown === 'CLIENT' ? 'rotate-180' : ''}`} size={18} />
                                                </button>
                                                <AnimatePresence>
                                                    {openDropdown === 'CLIENT' && (
                                                        <motion.div
                                                            initial={{ opacity: 0, y: 10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0, y: 10 }}
                                                            className="absolute z-50 w-full mt-2 bg-black border border-white/10 rounded-2xl shadow-2xl overflow-hidden p-1 max-h-60 overflow-y-auto"
                                                        >
                                                            {clients.map((c) => (
                                                                <button
                                                                    key={c.id}
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setClientId(c.id);
                                                                        setOpenDropdown(null);
                                                                    }}
                                                                    className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/5 flex items-center justify-between group transition-colors"
                                                                >
                                                                    <span className={`text-sm ${clientId === c.id ? 'text-blue-400 font-bold' : 'text-neutral-400 group-hover:text-white'}`}>
                                                                        {c.name}
                                                                    </span>
                                                                    {clientId === c.id && <Check size={16} className="text-blue-400" />}
                                                                </button>
                                                            ))}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </div>

                                        <div className="space-y-2 relative">
                                            <label className="text-xs font-bold text-neutral-500 uppercase ml-2 tracking-widest">Assign Employee</label>
                                            <div className="relative">
                                                <button
                                                    type="button"
                                                    onClick={() => setOpenDropdown(openDropdown === 'EMPLOYEE' ? null : 'EMPLOYEE')}
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 flex items-center justify-between transition-all"
                                                >
                                                    <span className={employeeId ? 'text-white' : 'text-neutral-500'}>
                                                        {employees.find(e => e.id === employeeId)?.name || 'Select an Employee'}
                                                    </span>
                                                    <ChevronDown className={`transition-transform duration-200 ${openDropdown === 'EMPLOYEE' ? 'rotate-180' : ''}`} size={18} />
                                                </button>
                                                <AnimatePresence>
                                                    {openDropdown === 'EMPLOYEE' && (
                                                        <motion.div
                                                            initial={{ opacity: 0, y: 10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0, y: 10 }}
                                                            className="absolute z-50 w-full mt-2 bg-black border border-white/10 rounded-2xl shadow-2xl overflow-hidden p-1 max-h-60 overflow-y-auto"
                                                        >
                                                            {employees.map((e) => (
                                                                <button
                                                                    key={e.id}
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setEmployeeId(e.id);
                                                                        setOpenDropdown(null);
                                                                    }}
                                                                    className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/5 flex items-center justify-between group transition-colors"
                                                                >
                                                                    <span className={`text-sm ${employeeId === e.id ? 'text-blue-400 font-bold' : 'text-neutral-400 group-hover:text-white'}`}>
                                                                        {e.name}
                                                                    </span>
                                                                    {employeeId === e.id && <Check size={16} className="text-blue-400" />}
                                                                </button>
                                                            ))}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </div>

                                        <div className="space-y-2 relative">
                                            <label className="text-xs font-bold text-neutral-500 uppercase ml-2 tracking-widest">Type</label>
                                            <div className="relative">
                                                <button
                                                    type="button"
                                                    onClick={() => setOpenDropdown(openDropdown === 'TYPE' ? null : 'TYPE')}
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 flex items-center justify-between transition-all"
                                                >
                                                    <span>
                                                        {type === 'WEB' ? 'Web Development' :
                                                            type === 'SEO' ? 'SEO' :
                                                                type === 'SMM' ? 'SMM' : 'Full Package (All)'}
                                                    </span>
                                                    <ChevronDown className={`transition-transform duration-200 ${openDropdown === 'TYPE' ? 'rotate-180' : ''}`} size={18} />
                                                </button>
                                                <AnimatePresence>
                                                    {openDropdown === 'TYPE' && (
                                                        <motion.div
                                                            initial={{ opacity: 0, y: 10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0, y: 10 }}
                                                            className="absolute z-50 w-full mt-2 bg-black border border-white/10 rounded-2xl shadow-2xl overflow-hidden p-1"
                                                        >
                                                            {[
                                                                { value: 'WEB', label: 'Web Development' },
                                                                { value: 'SEO', label: 'SEO' },
                                                                { value: 'SMM', label: 'SMM' },
                                                                { value: 'ALL', label: 'Full Package (All)' }
                                                            ].map((opt) => (
                                                                <button
                                                                    key={opt.value}
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setType(opt.value as ProjectType);
                                                                        setOpenDropdown(null);
                                                                    }}
                                                                    className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/5 flex items-center justify-between group transition-colors"
                                                                >
                                                                    <span className={`text-sm ${type === opt.value ? 'text-blue-400 font-bold' : 'text-neutral-400 group-hover:text-white'}`}>
                                                                        {opt.label}
                                                                    </span>
                                                                    {type === opt.value && <Check size={16} className="text-blue-400" />}
                                                                </button>
                                                            ))}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </div>

                                        <div className="space-y-2 relative">
                                            <label className="text-xs font-bold text-neutral-500 uppercase ml-2 tracking-widest">Priority</label>
                                            <div className="relative">
                                                <button
                                                    type="button"
                                                    onClick={() => setOpenDropdown(openDropdown === 'PRIORITY' ? null : 'PRIORITY')}
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 flex items-center justify-between transition-all"
                                                >
                                                    <span>{priority}</span>
                                                    <ChevronDown className={`transition-transform duration-200 ${openDropdown === 'PRIORITY' ? 'rotate-180' : ''}`} size={18} />
                                                </button>
                                                <AnimatePresence>
                                                    {openDropdown === 'PRIORITY' && (
                                                        <motion.div
                                                            initial={{ opacity: 0, y: 10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0, y: 10 }}
                                                            className="absolute z-50 w-full mt-2 bg-black border border-white/10 rounded-2xl shadow-2xl overflow-hidden p-1"
                                                        >
                                                            {['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map((p) => (
                                                                <button
                                                                    key={p}
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setPriority(p as Priority);
                                                                        setOpenDropdown(null);
                                                                    }}
                                                                    className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/5 flex items-center justify-between group transition-colors"
                                                                >
                                                                    <span className={`text-sm ${priority === p ? 'text-blue-400 font-bold' : 'text-neutral-400 group-hover:text-white'}`}>
                                                                        {p}
                                                                    </span>
                                                                    {priority === p && <Check size={16} className="text-blue-400" />}
                                                                </button>
                                                            ))}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </div>

                                        <div className="space-y-2 md:col-span-2">
                                            <label className="text-xs font-bold text-neutral-500 uppercase ml-2 tracking-widest">Deadline</label>
                                            <input type="date" required value={deadline} onChange={(e) => setDeadline(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
                                        </div>

                                        <div className="space-y-2 md:col-span-2">
                                            <label className="text-xs font-bold text-neutral-500 uppercase ml-2 tracking-widest">Task Description</label>
                                            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 min-h-[100px]" placeholder="Outline the key deliverable details here..." />
                                        </div>

                                        <div className="md:col-span-2 pt-4">
                                            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-5 rounded-2xl shadow-xl shadow-blue-500/20 transition-all uppercase tracking-tight">Assign Task</button>
                                        </div>
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
