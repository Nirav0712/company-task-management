'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Client, Task, TaskStatus, AttendanceRecord } from '@/types/data';

interface DataContextType {
    clients: Client[];
    tasks: Task[];
    addClient: (client: Omit<Client, 'id' | 'createdAt'>) => void;
    deleteClient: (id: string) => void;
    addTask: (task: Omit<Task, 'id' | 'createdAt' | 'status' | 'timeSpent' | 'progress'>) => void;
    updateTaskStatus: (id: string, status: TaskStatus) => void;
    updateTaskTime: (id: string, seconds: number) => void;
    updateTaskProgress: (id: string, progress: number) => void;
    deleteTask: (id: string) => void;
    attendance: AttendanceRecord[];
    checkIn: (employeeId: string) => void;
    checkOut: (employeeId: string) => void;
    approveAttendance: (id: string, status: 'APPROVED' | 'REJECTED') => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
    const [clients, setClients] = useState<Client[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);

    useEffect(() => {
        const savedClients = localStorage.getItem('app_clients');
        const savedTasks = localStorage.getItem('app_tasks');
        const savedAttendance = localStorage.getItem('app_attendance');

        if (savedClients) setClients(JSON.parse(savedClients));
        if (savedTasks) setTasks(JSON.parse(savedTasks));
        if (savedAttendance) {
            const parsed = JSON.parse(savedAttendance);
            // Migration/Robustness: Ensure all records have an approvalStatus
            const migrated = parsed.map((rec: any) => ({
                ...rec,
                approvalStatus: rec.approvalStatus || 'PENDING'
            }));
            setAttendance(migrated);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('app_clients', JSON.stringify(clients));
    }, [clients]);

    useEffect(() => {
        localStorage.setItem('app_tasks', JSON.stringify(tasks));
    }, [tasks]);

    useEffect(() => {
        localStorage.setItem('app_attendance', JSON.stringify(attendance));
    }, [attendance]);

    const addClient = (clientData: Omit<Client, 'id' | 'createdAt'>) => {
        const newClient: Client = {
            ...clientData,
            id: Math.random().toString(36).substr(2, 9),
            createdAt: new Date().toISOString(),
        };
        setClients(prev => [...prev, newClient]);
    };

    const deleteClient = (id: string) => {
        setClients(prev => prev.filter(c => c.id !== id));
        setTasks(prev => prev.filter(t => t.clientId !== id));
    };

    const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'status' | 'timeSpent' | 'progress'>) => {
        const newTask: Task = {
            ...taskData,
            id: Math.random().toString(36).substr(2, 9),
            status: 'PENDING',
            timeSpent: 0,
            progress: 0,
            createdAt: new Date().toISOString(),
        };
        setTasks(prev => [...prev, newTask]);
    };

    const updateTaskStatus = (id: string, status: TaskStatus) => {
        setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t));
    };

    const updateTaskTime = (id: string, seconds: number) => {
        setTasks(prev => prev.map(t => t.id === id ? { ...t, timeSpent: t.timeSpent + seconds } : t));
    };

    const updateTaskProgress = (id: string, progress: number) => {
        setTasks(prev => prev.map(t => t.id === id ? { ...t, progress } : t));
    };

    const deleteTask = (id: string) => {
        setTasks(prev => prev.filter(t => t.id !== id));
    };

    const checkIn = (employeeId: string) => {
        const newRecord: AttendanceRecord = {
            id: Math.random().toString(36).substr(2, 9),
            employeeId,
            date: new Date().toISOString().split('T')[0],
            checkIn: new Date().toISOString(),
            checkOut: null,
            status: 'ACTIVE',
            approvalStatus: 'PENDING'
        };
        setAttendance(prev => [...prev, newRecord]);
    };

    const checkOut = (employeeId: string) => {
        const today = new Date().toISOString().split('T')[0];
        setAttendance(prev => prev.map(rec =>
            rec.employeeId === employeeId && rec.date === today && rec.status === 'ACTIVE'
                ? { ...rec, checkOut: new Date().toISOString(), status: 'COMPLETED' }
                : rec
        ));
    };

    const approveAttendance = (id: string, approvalStatus: 'APPROVED' | 'REJECTED') => {
        setAttendance(prev => prev.map(rec =>
            rec.id === id ? { ...rec, approvalStatus } : rec
        ));
    };

    return (
        <DataContext.Provider value={{
            clients,
            tasks,
            addClient,
            deleteClient,
            addTask,
            updateTaskStatus,
            updateTaskTime,
            updateTaskProgress,
            deleteTask,
            attendance,
            checkIn,
            checkOut,
            approveAttendance
        }}>
            {children}
        </DataContext.Provider>
    );
}

export const useData = () => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};
