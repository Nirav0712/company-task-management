'use client';

import React, { useState } from 'react';
import { Check, X, Clock, User, Calendar, ShieldCheck, History, Users, Search } from 'lucide-react';
import { useData } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';

export default function AdminAttendancePage() {
    const { attendance, approveAttendance } = useData();
    const { users } = useAuth();
    const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Map employee ID to Name
    const getEmployeeName = (id: string) => {
        const user = users.find(u => u.id === id);
        return user ? user.name : id;
    };

    // Filter employees who have attendance records
    const employeesWithRecords = Array.from(new Set(attendance.map(a => a.employeeId)))
        .map(id => ({
            id,
            name: getEmployeeName(id),
            pendingCount: attendance.filter(a => a.employeeId === id && a.approvalStatus === 'PENDING').length,
            totalCount: attendance.filter(a => a.employeeId === id).length
        }))
        .filter(e => e.name.toLowerCase().includes(searchQuery.toLowerCase()));

    // Sort attendance to show latest and pending first for the main queue
    const sortedAttendance = [...attendance].sort((a, b) => {
        if (a.approvalStatus === 'PENDING' && b.approvalStatus !== 'PENDING') return -1;
        if (a.approvalStatus !== 'PENDING' && b.approvalStatus === 'PENDING') return 1;
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    const pendingCount = attendance.filter(a => a.approvalStatus === 'PENDING').length;

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Attendance Management</h1>
                    <p className="text-neutral-400 font-medium">Review and approve daily attendance logs from all employees.</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search employee..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-2xl py-2.5 pl-10 pr-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 w-64"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/5 border border-white/10 p-6 rounded-3xl">
                    <p className="text-neutral-500 text-xs font-black uppercase tracking-widest mb-2">Pending Requests</p>
                    <p className="text-3xl font-black text-amber-500">{pendingCount}</p>
                </div>
                <div className="bg-white/5 border border-white/10 p-6 rounded-3xl">
                    <p className="text-neutral-500 text-xs font-black uppercase tracking-widest mb-2">Total Employees</p>
                    <p className="text-3xl font-black text-white">{employeesWithRecords.length}</p>
                </div>
                <div className="bg-white/5 border border-white/10 p-6 rounded-3xl">
                    <p className="text-neutral-500 text-xs font-black uppercase tracking-widest mb-2">Approved Today</p>
                    <p className="text-3xl font-black text-emerald-500">
                        {attendance.filter(a => (a.approvalStatus || 'PENDING') === 'APPROVED' && a.date === new Date().toISOString().split('T')[0]).length}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Employee List Section */}
                <div className="bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-white/10 bg-white/2">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            <Users size={18} className="text-blue-500" />
                            Employees
                        </h2>
                    </div>
                    <div className="overflow-y-auto max-h-[600px] divide-y divide-white/5">
                        {employeesWithRecords.length === 0 ? (
                            <div className="p-10 text-center text-neutral-500 text-sm italic">
                                No employees found.
                            </div>
                        ) : (
                            employeesWithRecords.map(emp => (
                                <button
                                    key={emp.id}
                                    onClick={() => setSelectedEmployeeId(emp.id)}
                                    className={`w-full p-6 text-left hover:bg-white/5 transition-all flex items-center justify-between group ${selectedEmployeeId === emp.id ? 'bg-white/10' : ''}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-2xl bg-neutral-800 border border-white/10 flex items-center justify-center text-xs font-black text-white">
                                            {emp.name[0]}
                                        </div>
                                        <div>
                                            <p className="font-bold text-white group-hover:text-blue-400 transition-colors">{emp.name}</p>
                                            <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">{emp.totalCount} Total Logs</p>
                                        </div>
                                    </div>
                                    {emp.pendingCount > 0 && (
                                        <span className="bg-amber-500 text-black text-[10px] font-black px-2 py-0.5 rounded-full">
                                            {emp.pendingCount}
                                        </span>
                                    )}
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* History/Queue Section */}
                <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col">
                    <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/2">
                        <h2 className="text-lg font-bold text-white flex items-center gap-3">
                            <History size={20} className={selectedEmployeeId ? "text-indigo-500" : "text-amber-500"} />
                            {selectedEmployeeId
                                ? `${getEmployeeName(selectedEmployeeId)}'s History`
                                : 'Approval Queue (Latest First)'}
                        </h2>
                        {selectedEmployeeId && (
                            <button
                                onClick={() => setSelectedEmployeeId(null)}
                                className="text-xs font-black text-neutral-500 uppercase tracking-widest hover:text-white transition-colors"
                            >
                                Show All Queue
                            </button>
                        )}
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/5 text-[10px] font-black text-neutral-500 uppercase tracking-widest">
                                    <th className="px-8 py-6">Date</th>
                                    {!selectedEmployeeId && <th className="px-8 py-6">Employee</th>}
                                    <th className="px-8 py-6">Check In/Out</th>
                                    <th className="px-8 py-6">Status</th>
                                    <th className="px-8 py-6 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {(selectedEmployeeId
                                    ? attendance.filter(a => a.employeeId === selectedEmployeeId).reverse()
                                    : sortedAttendance
                                ).length === 0 ? (
                                    <tr>
                                        <td colSpan={selectedEmployeeId ? 4 : 5} className="px-8 py-20 text-center">
                                            <ShieldCheck size={48} className="text-neutral-700 mx-auto mb-4" />
                                            <p className="text-neutral-500 font-bold italic">No records to display.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    (selectedEmployeeId
                                        ? attendance.filter(a => a.employeeId === selectedEmployeeId).reverse()
                                        : sortedAttendance
                                    ).map((rec) => (
                                        <tr key={rec.id} className="group hover:bg-white/2 transition-all">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2 text-white font-bold text-sm">
                                                    <Calendar size={14} className="text-neutral-600" />
                                                    {new Date(rec.date).toLocaleDateString()}
                                                </div>
                                            </td>
                                            {!selectedEmployeeId && (
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-3">
                                                        <span className="font-bold text-white text-sm">{getEmployeeName(rec.employeeId)}</span>
                                                    </div>
                                                </td>
                                            )}
                                            <td className="px-8 py-6">
                                                <div className="space-y-1">
                                                    <div className="text-[10px] font-black text-neutral-400 uppercase flex items-center gap-1">
                                                        <Clock size={10} /> {new Date(rec.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                    <div className="text-[10px] font-black text-neutral-500 uppercase">
                                                        {rec.checkOut ? (
                                                            <>to {new Date(rec.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</>
                                                        ) : (
                                                            <span className="text-blue-500">Live</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-sm">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${(rec.approvalStatus || 'PENDING') === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                    (rec.approvalStatus || 'PENDING') === 'REJECTED' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                                                        'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                                    }`}>
                                                    {(rec.approvalStatus || 'PENDING').charAt(0) + (rec.approvalStatus || 'PENDING').slice(1).toLowerCase()}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                {(rec.approvalStatus || 'PENDING') === 'PENDING' ? (
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                approveAttendance(rec.id, 'APPROVED');
                                                            }}
                                                            className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500 hover:text-white transition-all shadow-lg"
                                                            title="Approve"
                                                        >
                                                            <Check size={14} strokeWidth={3} />
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                approveAttendance(rec.id, 'REJECTED');
                                                            }}
                                                            className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all shadow-lg"
                                                            title="Reject"
                                                        >
                                                            <X size={14} strokeWidth={3} />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className={`text-[10px] font-black uppercase tracking-widest ${rec.approvalStatus === 'APPROVED' ? 'text-emerald-500' : 'text-rose-500'
                                                        }`}>
                                                        {rec.approvalStatus}
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
