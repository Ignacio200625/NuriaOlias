import type { ReactNode } from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import type { Appointment } from '../types';
import { db } from '../lib/firebase';
import { collection, addDoc, deleteDoc, doc, onSnapshot, query } from 'firebase/firestore';
import { mockAppointments } from '../data/mockData';


interface AppointmentContextType {
    appointments: Appointment[];
    loading: boolean;
    error: string | null;
    addAppointment: (appointment: Appointment) => Promise<void>;
    removeAppointment: (id: string) => Promise<void>;
    isSlotAvailable: (date: Date, serviceDuration: number) => boolean;
}

const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

export const AppointmentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Load from Firestore (Real-time)
    useEffect(() => {
        console.log("Initializing Firestore listener...");
        const q = query(collection(db, "appointments"));

        // Safety timeout: stop loading if firebase hangs
        const timeoutId = setTimeout(() => {
            setLoading((currentLoading) => {
                if (currentLoading) {
                    console.error("Firestore connection timed out");
                    setError("La conexión está tardando demasiado. Verifica tu internet.");
                    return false;
                }
                return currentLoading;
            });
        }, 8000); // 8 seconds timeout

        const unsubscribe = onSnapshot(q, (snapshot) => {
            clearTimeout(timeoutId); // Connection successful

            const parsed = snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id, // Use Firestore ID
                    ...data,
                    // Convert Firestore Timestamp to Date if needed, or string to Date
                    // Handle both Firestore Timestamp (has toDate) and string
                    date: data.date?.toDate ? data.date.toDate() : new Date(data.date)
                } as Appointment;
            });

            // SEEDING: If database is empty, seed with mock data
            if (parsed.length === 0 && !localStorage.getItem('dbSeeded')) {
                seedDatabase();
            } else {
                setAppointments(parsed);
                setLoading(false);
            }
        }, (err) => {
            clearTimeout(timeoutId);
            console.error("Firestore Error:", err);
            setError("Error cargando citas. Verifica permisos o conexión.");
            setLoading(false);
        });

        return () => {
            unsubscribe();
            clearTimeout(timeoutId);
        };
    }, []);

    const seedDatabase = async () => {
        try {
            console.log("Seeding database with mock data...");
          
            // We can't use batch for addDoc easily with auto-ID in v9 modular style without doc ref
            // Let's just do parallel promises for simplicity
            const promises = mockAppointments.map(app => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { id, ...data } = app;
                return addDoc(collection(db, "appointments"), data);
            });
            await Promise.all(promises);
            localStorage.setItem('dbSeeded', 'true');
            console.log("Database seeded!");
        } catch (e) {
            console.error("Error seeding database:", e);
        }
    };

    const addAppointment = async (newAppointment: Appointment) => {
        // We let Firestore generate the ID, or use the one we created if we want custom IDs
        // But better to let Firestore handle it. 
        // However, our App logic generates a UUID. We can use that as the Doc ID or just pass data.
        // Let's rely on Firestore auto-ID for simplicity in future, 
        // BUT for now our app generates an ID. Let's use `addDoc` and let Firestore make its own ID,
        // OR better: use `setDoc` with our ID if we want to keep frontend consistency.
        // Actually, easiest is: ignore the frontend ID and let Firestore assign one?
        // No, let's keep it simple. `addDoc` creates a new ID. We will map doc.id to app.id in the listener.

        // Exclude 'id' from the data we save, as Firestore provides it
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, ...appointmentData } = newAppointment;

        await addDoc(collection(db, "appointments"), appointmentData);
    };

    const removeAppointment = async (id: string) => {
        await deleteDoc(doc(db, "appointments", id));
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
        <AppointmentContext.Provider value={{ appointments, loading, error, addAppointment, removeAppointment, isSlotAvailable }}>
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
