export type ProjectType = 'SMM' | 'SEO' | 'WEB' | 'ALL';

export interface Client {
    id: string;
    name: string;
    industry: string;
    contact: string;
    email: string;
    projectType: ProjectType;
    createdAt: string;
}

export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export interface Task {
    id: string;
    title: string;
    clientId: string;
    employeeId: string;
    status: TaskStatus;
    priority: Priority;
    type: ProjectType;
    description: string;
    deadline: string;
    createdAt: string;
    timeSpent: number;
    progress: number;
}

export interface AttendanceRecord {
    id: string;
    employeeId: string;
    date: string;
    checkIn: string;
    checkOut: string | null;
    status: 'ACTIVE' | 'COMPLETED';
    approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
}
