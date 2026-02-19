import React, { useState, useEffect } from 'react';
import { X, Calendar as CalendarIcon, Clock, Check, ChevronLeft, ChevronRight, User, Scissors, Mail } from 'lucide-react';
import type { Service, TimeSlot } from '../types';
import { services } from '../data/mockData';
import { useAppointments } from '../context/AppointmentContext';
import { sendConfirmationEmail } from '../lib/emailService';
import { auth } from '../lib/auth';

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function BookingModal({ isOpen, onClose }: BookingModalProps) {
    const [step, setStep] = useState(1);
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [customerMessage, setCustomerMessage] = useState('');
    const [emailSent, setEmailSent] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const { addAppointment, isSlotAvailable, loading, error } = useAppointments();

    // Reset state when modal opens/closes
    useEffect(() => {
        if (isOpen) {
            setStep(1);
            setSelectedService(null);
            setSelectedDate(null);
            setSelectedTime(null);
            setCustomerName('');
            setCustomerPhone('');
            setCustomerMessage('');
            setEmailSent(false);
            setCurrentMonth(new Date());
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    // Calendar Logic
    const daysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

    const handlePrevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    const generateCalendarDays = () => {
        const days = [];
        const totalDays = daysInMonth(currentMonth);
        const firstDay = firstDayOfMonth(currentMonth);
        // Adjust for Monday start (0 is Sunday in JS)
        const startDay = firstDay === 0 ? 6 : firstDay - 1;

        for (let i = 0; i < startDay; i++) {
            days.push(<div key={`empty-${i}`} className="h-10 w-10"></div>);
        }

        for (let i = 1; i <= totalDays; i++) {
            const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i);
            const isToday = new Date().toDateString() === date.toDateString();
            const isSelected = selectedDate?.toDateString() === date.toDateString();
            const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));

            days.push(
                <button
                    key={i}
                    disabled={isPast}
                    onClick={() => setSelectedDate(date)}
                    className={`h-10 w-10 rounded-full flex items-center justify-center transition-colors
                    ${isSelected ? 'bg-amber-600 text-white' : ''}
                    ${!isSelected && !isPast ? 'hover:bg-amber-100 text-gray-700' : ''}
                    ${isPast ? 'text-gray-300 cursor-not-allowed' : ''}
                    ${isToday && !isSelected ? 'border border-amber-600 text-amber-700' : ''}
                `}
                >
                    {i}
                </button>
            );
        }
        return days;
    };

    // Time Slot Logic
    const generateTimeSlots = (): TimeSlot[] => {
        if (!selectedService || !selectedDate) return [];

        const slots: TimeSlot[] = [];
        const openTime = 9; // 9:00
        const closeTime = 20; // 20:00

        let currentTime = new Date(selectedDate);
        currentTime.setHours(openTime, 0, 0, 0);

        const endTime = new Date(selectedDate);
        endTime.setHours(closeTime, 0, 0, 0);

        while (currentTime < endTime) {
            const timeString = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            // Check availability via context
            const checkDate = new Date(selectedDate);
            checkDate.setHours(currentTime.getHours(), currentTime.getMinutes());

            const isAvailable = isSlotAvailable(checkDate, selectedService.duration);

            slots.push({
                time: timeString,
                available: isAvailable
            });

            currentTime.setMinutes(currentTime.getMinutes() + 30); // 30 min intervals for slots base
        }

        return slots;
    };

    const handleBooking = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedService || !selectedDate || !selectedTime) return;

        // Parse selected time to setup the date object correctly
        const [hours, minutes] = selectedTime.split(':').map(Number);
        const bookingDate = new Date(selectedDate);
        bookingDate.setHours(hours, minutes);

        const newAppointment = {
            id: crypto.randomUUID(),
            date: bookingDate,
            serviceId: selectedService.id,
            customerName,
            customerPhone,
            message: customerMessage
        };

        await addAppointment(newAppointment);

        // Send confirmation email using the logged-in user's email from Firebase Auth
        const userEmail = auth.currentUser?.email;
        if (userEmail) {
            try {
                await sendConfirmationEmail({
                    customerName,
                    customerEmail: userEmail,
                    serviceName: selectedService.name,
                    appointmentDate: bookingDate.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
                    appointmentTime: selectedTime,
                    servicePrice: selectedService.price,
                    serviceDuration: selectedService.duration,
                });
                setEmailSent(true);
            } catch (err) {
                console.error('Error enviando correo de confirmación:', err);
                setEmailSent(false);
            }
        }

        nextStep(); // Go to success screen
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="bg-amber-50 p-4 border-b border-amber-100 flex justify-between items-center">
                    <h2 className="text-xl font-serif text-amber-900 font-medium">Reserva tu Cita</h2>
                    <button onClick={onClose} className="text-amber-800 hover:bg-amber-200 p-2 rounded-full transition"><X size={20} /></button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto flex-1">
                    {loading ? (
                        <div className="flex justify-center items-center h-48">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
                        </div>
                    ) : error ? (
                        <div className="text-center p-8 text-red-600">
                            <p>{error}</p>
                            <button onClick={onClose} className="mt-4 text-gray-600 underline text-sm">Cerrar</button>
                        </div>
                    ) : (
                        <>
                            {step === 1 && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium text-gray-800 mb-2">Selecciona un Servicio</h3>
                                    <div className="grid gap-3">
                                        {services.map(service => (
                                            <button
                                                key={service.id}
                                                onClick={() => { setSelectedService(service); nextStep(); }}
                                                className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-amber-500 hover:bg-amber-50 transition text-left group"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-amber-100 p-2 rounded-lg text-amber-700 group-hover:bg-amber-200"><Scissors size={20} /></div>
                                                    <div>
                                                        <div className="font-medium text-gray-900">{service.name}</div>
                                                        <div className="text-sm text-gray-500">{service.duration} min</div>
                                                    </div>
                                                </div>
                                                <div className="font-bold text-amber-700">{service.price}€</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {step === 2 && (
                                <div>
                                    <button onClick={prevStep} className="text-sm text-gray-500 hover:text-amber-700 mb-4 flex items-center gap-1"><ChevronLeft size={16} /> Volver a servicios</button>
                                    <h3 className="text-lg font-medium text-gray-800 mb-4">Selecciona Fecha y Hora</h3>

                                    {/* Calendar */}
                                    <div className="mb-6 bg-gray-50 p-4 rounded-xl">
                                        <div className="flex justify-between items-center mb-4">
                                            <button onClick={handlePrevMonth} className="p-1 hover:bg-gray-200 rounded-full"><ChevronLeft size={20} /></button>
                                            <span className="font-medium text-gray-900 capitalize">
                                                {currentMonth.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
                                            </span>
                                            <button onClick={handleNextMonth} className="p-1 hover:bg-gray-200 rounded-full"><ChevronRight size={20} /></button>
                                        </div>
                                        <div className="grid grid-cols-7 gap-1 text-center text-sm mb-2 text-gray-400">
                                            <div>L</div><div>M</div><div>X</div><div>J</div><div>V</div><div>S</div><div>D</div>
                                        </div>
                                        <div className="grid grid-cols-7 gap-1">
                                            {generateCalendarDays()}
                                        </div>
                                    </div>

                                    {selectedDate && (
                                        <div className="animate-fade-in">
                                            <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2"><Clock size={16} /> Horarios Disponibles</h4>
                                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                                {generateTimeSlots().map((slot, idx) => (
                                                    <button
                                                        key={idx}
                                                        disabled={!slot.available}
                                                        onClick={() => { setSelectedTime(slot.time); nextStep(); }}
                                                        className={`py-2 px-1 text-sm rounded-lg border transition
                                            ${!slot.available
                                                                ? 'bg-gray-100 text-gray-400 border-transparent cursor-not-allowed decoration-slice'
                                                                : 'border-amber-200 text-amber-900 hover:bg-amber-600 hover:text-white hover:border-amber-600'}
                                        `}
                                                    >
                                                        {slot.time}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {step === 3 && (
                                <div>
                                    <button onClick={prevStep} className="text-sm text-gray-500 hover:text-amber-700 mb-4 flex items-center gap-1"><ChevronLeft size={16} /> Volver a fecha</button>
                                    <h3 className="text-lg font-medium text-gray-800 mb-6">Tus Datos</h3>

                                    <div className="bg-amber-50 p-4 rounded-xl mb-6 flex items-start gap-4">
                                        <CalendarIcon className="text-amber-600 shrink-0 mt-1" />
                                        <div>
                                            <div className="font-medium text-amber-900">{selectedService?.name}</div>
                                            <div className="text-amber-800 text-sm">
                                                {selectedDate?.toLocaleDateString()} a las {selectedTime}
                                            </div>
                                            <div className="text-amber-700 text-sm mt-1">{selectedService?.duration} min - {selectedService?.price}€</div>
                                        </div>
                                    </div>

                                    <form onSubmit={handleBooking} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-3 text-gray-400" size={18} />
                                                <input
                                                    type="text"
                                                    required
                                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                                                    placeholder="Tu nombre"
                                                    value={customerName}
                                                    onChange={e => setCustomerName(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                                            <input
                                                type="tel"
                                                required
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                                                placeholder="600 000 000"
                                                value={customerPhone}
                                                onChange={e => setCustomerPhone(e.target.value)}
                                            />
                                        </div>
                                        {auth.currentUser?.email && (
                                            <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                                                <Mail size={15} className="text-amber-500 shrink-0" />
                                                La confirmación se enviará a <strong className="text-gray-700">{auth.currentUser.email}</strong>
                                            </div>
                                        )}

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Nota (Opcional)</label>
                                            <textarea
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none h-24 resize-none"
                                                placeholder="Algún detalle extra..."
                                                value={customerMessage}
                                                onChange={e => setCustomerMessage(e.target.value)}
                                            />
                                        </div>

                                        <button type="submit" className="w-full bg-amber-600 text-white py-3 rounded-xl font-bold hover:bg-amber-700 transition shadow-lg mt-4">
                                            Confirmar Reserva
                                        </button>
                                    </form>
                                </div>
                            )}

                            {step === 4 && (
                                <div className="text-center py-8">
                                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                                        <Check size={40} />
                                    </div>
                                    <h3 className="text-2xl font-serif text-gray-900 mb-2">¡Reserva Confirmada!</h3>
                                    <p className="text-gray-600 mb-2">
                                        Tu cita para <strong>{selectedService?.name}</strong> está reservada.<br />
                                        Nos vemos el {selectedDate?.toLocaleDateString('es-ES')} a las {selectedTime}.
                                    </p>
                                    {emailSent && (
                                        <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-2 inline-flex items-center gap-2 mb-6">
                                            <Mail size={15} /> Correo de confirmación enviado a <strong>{auth.currentUser?.email}</strong>
                                        </p>
                                    )}
                                    {!emailSent && (
                                        <p className="text-sm text-gray-400 mb-6">Recuerda anotar tu cita en el calendario.</p>
                                    )}
                                    <button onClick={onClose} className="bg-gray-900 text-white px-8 py-3 rounded-xl font-medium hover:bg-gray-800 transition">
                                        Entendido
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
