import type{ Service, Appointment } from '../types.ts';

export const services: Service[] = [
    { id: '1', name: 'Corte de Pelo Mujer', duration: 45, price: 25 },
    { id: '2', name: 'Corte de Pelo Hombre', duration: 30, price: 15 },
    { id: '3', name: 'Tinte Completo', duration: 90, price: 40 },
    { id: '4', name: 'Mechas', duration: 120, price: 60 },
    { id: '5', name: 'Peinado', duration: 30, price: 20 },
    { id: '6', name: 'Tratamiento Capilar', duration: 60, price: 35 },
];

export const mockAppointments: Appointment[] = [
    {
        id: '1',
        date: new Date(new Date().setHours(10, 0, 0, 0)), // Today at 10:00
        serviceId: '1',
        customerName: 'Maria García',
    },
    {
        id: '2',
        date: new Date(new Date().setHours(16, 30, 0, 0)), // Today at 16:30
        serviceId: '2',
        customerName: 'Juan Pérez',
    },
];
