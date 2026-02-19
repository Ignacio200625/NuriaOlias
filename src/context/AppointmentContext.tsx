import type { ReactNode } from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import type { Appointment } from '../types';
import { mockAppointments } from '../data/mockData';

interface AppointmentContextType {
    appointments: Appointment[];
    addAppointment: (appointment: Appointment) => void;
    isSlotAvailable: (date: Date, serviceDuration: number) => boolean;
}

const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

export const AppointmentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);

    // Load from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem('appointments');
        if (stored) {
            // Parse dates back to Date objects
            const parsed = JSON.parse(stored).map((app: any) => ({
                ...app,
                date: new Date(app.date)
            }));
            setAppointments(parsed);
        } else {
            // Initialize with mock data if empty
            setAppointments(mockAppointments);
            localStorage.setItem('appointments', JSON.stringify(mockAppointments));
        }
    }, []);

    const addAppointment = (newAppointment: Appointment) => {
        const updated = [...appointments, newAppointment];
        setAppointments(updated);
        localStorage.setItem('appointments', JSON.stringify(updated));
    };

    const isSlotAvailable = (checkDate: Date, durationMinutes: number): boolean => {
        const checkStart = checkDate.getTime();
        const checkEnd = checkStart + durationMinutes * 60000;

        return !appointments.some(app => {
            // Simple overlap check
            // Assuming all existing appointments also have a duration.
            // For this MVP, we'll assume a standard duration for all existing mock/stored apps if not saved, 
            // but our type doesn't have duration on Appointment, it has serviceId.
            // reliable way: just check 30 min buffer or look up service. 
            // For simplicity in this step, let's assume a 30 min buffer for collision 
            // OR better, checking exact time match for start time as per current logic is too weak.
            // We will improve this constraint.

            const appStart = app.date.getTime();
            // Mock duration or look up service. Let's assume 30 mins for safety if unknown, 
            // but ideally we should store duration or look it up.
            // For now, let's just check for direct start time conflict within 30 mins window.
            const appEnd = appStart + 30 * 60000;

            return (checkStart < appEnd && checkEnd > appStart);
        });
    };

    return (
        <AppointmentContext.Provider value={{ appointments, addAppointment, isSlotAvailable }}>
            {children}
        </AppointmentContext.Provider>
    );
};

export const useAppointments = () => {
    const context = useContext(AppointmentContext);
    if (!context) {
        throw new Error('useAppointments must be used within an AppointmentProvider');
    }
    return context;
};
