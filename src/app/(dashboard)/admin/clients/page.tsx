'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Search,
    MoreVertical,
    Mail,
    Globe,
    X,
    CheckCircle2,
    Trash2,
    ChevronDown,
    Check
} from 'lucide-react';
import { useData } from '@/context/DataContext';
import { ProjectType } from '@/types/data';

export default function ClientsPage() {
    const { clients, addClient, deleteClient } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Form State
    const [name, setName] = useState('');
    const [industry, setIndustry] = useState('');
    const [contact, setContact] = useState('');
    const [email, setEmail] = useState('');
    const [projectType, setProjectType] = useState<ProjectType>('WEB');
    const [success, setSuccess] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const filteredClients = clients.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addClient({ name, industry, contact, email, projectType });
        setSuccess(true);
        setTimeout(() => {
            setSuccess(false);
            setIsModalOpen(false);
            // Reset
            setName('');
            setIndustry('');
            setContact('');
            setEmail('');
            setProjectType('WEB');
        }, 1500);
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Client Management</h1>
                    <p className="text-neutral-400">Manage your business clients and their project categories.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-blue-500/20 font-semibold"
                >
                    <Plus size={20} />
                    Add New Client
                </button>
            </div>

            <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input
                    type="text"
                    placeholder="Search by client name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all shadow-inner"
                />
            </div>

            {filteredClients.length === 0 ? (
                <div className="py-20 text-center bg-white/5 border border-white/10 rounded-3xl">
                    <p className="text-neutral-500 uppercase tracking-widest font-bold text-sm">No clients found</p>
                    <p className="text-neutral-400 mt-2">Start by adding your first business client.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <AnimatePresence mode="popLayout">
                        {filteredClients.map((client, index) => (
                            <motion.div
                                key={client.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-white/5 border border-white/10 p-6 rounded-3xl hover:bg-white/[0.07] transition-all group relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => deleteClient(client.id)}
                                        className="p-2 text-neutral-500 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>

                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">{client.name}</h3>
                                        <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">{client.industry}</span>
                                    </div>
                                </div>

                                <div className="space-y-4 mb-8">
                                    <div className="flex items-center gap-3 text-neutral-400 text-sm">
                                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                                            <Mail size={16} />
                                        </div>
                                        <span>{client.email}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-neutral-400 text-sm">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-[10px] ${client.projectType === 'ALL'
                                                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                                : 'bg-blue-500/10 text-blue-400'
                                            }`}>
                                            {client.projectType === 'ALL' ? 'FULL' : client.projectType}
                                        </div>
                                        <span className={`capitalize ${client.projectType === 'ALL' ? 'text-amber-400 font-bold' : ''}`}>
                                            {client.projectType === 'ALL' ? 'Full Digital Package' : `${client.projectType} Management`}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-neutral-800 border border-white/10 flex items-center justify-center text-sm font-bold text-white shadow-lg">
                                            {client.contact[0]}
                                        </div>
                                        <div>
                                            <p className="text-xs text-neutral-500 uppercase font-bold tracking-tighter leading-none mb-1">Point of Contact</p>
                                            <p className="text-sm font-semibold text-neutral-200">{client.contact}</p>
                                        </div>
                                    </div>
                                    <button className="text-blue-500 text-sm font-bold hover:underline transition-all">
                                        Full Profile
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-70 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                            onClick={() => setIsModalOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 40 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 40 }}
                            className="relative w-full max-w-xl bg-neutral-900 border border-white/10 rounded-[2.5rem] shadow-2xl p-10 overflow-hidden"
                        >
                            {success ? (
                                <div className="py-20 flex flex-col items-center justify-center text-center">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 mb-8"
                                    >
                                        <CheckCircle2 size={48} />
                                    </motion.div>
                                    <h2 className="text-3xl font-bold text-white mb-2">Client Registered</h2>
                                    <p className="text-neutral-400">Successfully added {name} to the database.</p>
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-center justify-between mb-10">
                                        <h2 className="text-3xl font-bold text-white tracking-tight">Register New Client</h2>
                                        <button
                                            onClick={() => setIsModalOpen(false)}
                                            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-neutral-500 hover:text-white transition-all hover:bg-white/10"
                                        >
                                            <X size={20} />
                                        </button>
                                    </div>

                                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2 md:col-span-2 text-left">
                                            <label className="text-xs font-bold text-neutral-500 uppercase ml-2 tracking-widest">Client / Company Name</label>
                                            <input
                                                required
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium"
                                                placeholder="EcoStore International"
                                            />
                                        </div>

                                        <div className="space-y-2 text-left">
                                            <label className="text-xs font-bold text-neutral-500 uppercase ml-2 tracking-widest">Industry</label>
                                            <input
                                                required
                                                value={industry}
                                                onChange={(e) => setIndustry(e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                                                placeholder="E-commerce"
                                            />
                                        </div>

                                        <div className="space-y-2 text-left relative">
                                            <label className="text-xs font-bold text-neutral-500 uppercase ml-2 tracking-widest">Project Category</label>
                                            <div className="relative">
                                                <button
                                                    type="button"
                                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 flex items-center justify-between transition-all"
                                                >
                                                    <span>
                                                        {projectType === 'WEB' ? 'Web Development' :
                                                            projectType === 'SEO' ? 'SEO Optimization' :
                                                                projectType === 'SMM' ? 'Social Media Ads' :
                                                                    'Full Package (All Services)'}
                                                    </span>
                                                    <ChevronDown className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} size={18} />
                                                </button>

                                                <AnimatePresence>
                                                    {isDropdownOpen && (
                                                        <motion.div
                                                            initial={{ opacity: 0, y: 10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0, y: 10 }}
                                                            className="absolute z-50 w-full mt-2 bg-neutral-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden p-1"
                                                        >
                                                            {[
                                                                { value: 'WEB', label: 'Web Development' },
                                                                { value: 'SEO', label: 'SEO Optimization' },
                                                                { value: 'SMM', label: 'Social Media Ads' },
                                                                { value: 'ALL', label: 'Full Package (All Services)' }
                                                            ].map((option) => (
                                                                <button
                                                                    key={option.value}
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setProjectType(option.value as ProjectType);
                                                                        setIsDropdownOpen(false);
                                                                    }}
                                                                    className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/5 flex items-center justify-between group transition-colors"
                                                                >
                                                                    <span className={`text-sm ${projectType === option.value ? 'text-blue-400 font-bold' : 'text-neutral-400 group-hover:text-white'}`}>
                                                                        {option.label}
                                                                    </span>
                                                                    {projectType === option.value && (
                                                                        <Check size={16} className="text-blue-400" />
                                                                    )}
                                                                </button>
                                                            ))}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </div>

                                        <div className="space-y-2 text-left">
                                            <label className="text-xs font-bold text-neutral-500 uppercase ml-2 tracking-widest">Main Contact Person</label>
                                            <input
                                                required
                                                value={contact}
                                                onChange={(e) => setContact(e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                                                placeholder="Sarah Miller"
                                            />
                                        </div>

                                        <div className="space-y-2 text-left">
                                            <label className="text-xs font-bold text-neutral-500 uppercase ml-2 tracking-widest">Email Address</label>
                                            <input
                                                type="email"
                                                required
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                                                placeholder="sarah@company.com"
                                            />
                                        </div>

                                        <div className="md:col-span-2 pt-6">
                                            <button
                                                type="submit"
                                                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-5 rounded-[1.25rem] shadow-xl shadow-blue-500/20 transition-all active:scale-[0.98] text-lg uppercase tracking-tight"
                                            >
                                                Register Client
                                            </button>
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
