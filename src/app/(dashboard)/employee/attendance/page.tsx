'use client';

import React from 'react';
import { History, Clock, MapPin, Zap } from 'lucide-react';
import { useData } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';

export default function AttendancePage() {
    const { attendance } = useData();
    const { user } = useAuth();

    const myAttendance = attendance.filter(a => a.employeeId === user?.id).reverse();

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Attendance Logs</h1>
                <p className="text-neutral-400 font-medium">Record of your daily check-in and check-out sessions.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/5 border border-white/10 p-6 rounded-3xl">
                    <p className="text-neutral-500 text-xs font-black uppercase tracking-widest mb-2">Days Present</p>
                    <p className="text-3xl font-black text-white">{myAttendance.length}</p>
                </div>
                <div className="bg-white/5 border border-white/10 p-6 rounded-3xl">
                    <p className="text-neutral-500 text-xs font-black uppercase tracking-widest mb-2">Active Session</p>
                    <p className="text-3xl font-black text-emerald-500">
                        {myAttendance.find(a => a.status === 'ACTIVE') ? 'Live' : 'No'}
                    </p>
                </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden">
                <div className="p-8 border-b border-white/10 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white flex items-center gap-3">
                        <History size={20} className="text-blue-500" />
                        Log History
                    </h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 text-[10px] font-black text-neutral-500 uppercase tracking-widest">
                                <th className="px-8 py-6">Date</th>
                                <th className="px-8 py-6">Check In</th>
                                <th className="px-8 py-6">Check Out</th>
                                <th className="px-8 py-6 text-right">Approval</th>
                                <th className="px-8 py-6 text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {myAttendance.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-8 py-20 text-center">
                                        <History size={48} className="text-neutral-700 mx-auto mb-4" />
                                        <p className="text-neutral-500 font-bold">No history available yet.</p>
                                    </td>
                                </tr>
                            ) : (
                                myAttendance.map((rec) => (
                                    <tr key={rec.id} className="group hover:bg-white/2 transition-all">
                                        <td className="px-8 py-6 font-bold text-white">{new Date(rec.date).toLocaleDateString()}</td>
                                        <td className="px-8 py-6 text-neutral-400 font-mono text-sm">{new Date(rec.checkIn).toLocaleTimeString()}</td>
                                        <td className="px-8 py-6 text-neutral-400 font-mono text-sm">
                                            {rec.checkOut ? new Date(rec.checkOut).toLocaleTimeString() : '--:--'}
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${rec.approvalStatus === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                                rec.approvalStatus === 'REJECTED' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                                                    'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                                }`}>
                                                {rec.approvalStatus.charAt(0) + rec.approvalStatus.slice(1).toLowerCase()}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${rec.status === 'COMPLETED' ? 'bg-neutral-500/10 text-neutral-400 border border-neutral-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                                }`}>
                                                {rec.status}
                                            </span>
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
