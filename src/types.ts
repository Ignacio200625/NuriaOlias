export interface Service {
    id: string;
    name: string;
    duration: number; // in minutes
    price: number;
}

export interface Appointment {
    id: string;
    date: Date; // ISO string or Date object
    serviceId: string;
    customerName: string;
    customerPhone?: string;
    customerEmail?: string;
    message?: string;
}

export interface TimeSlot {
    time: string;
    available: boolean;
}
