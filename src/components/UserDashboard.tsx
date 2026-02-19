import { useState } from 'react';
import { useAppointments } from '../context/AppointmentContext';
import { Clock, Calendar, Trash2, AlertTriangle, X, ChevronRight, History } from 'lucide-react';
import { services } from '../data/mockData';
import type { Appointment } from '../types';

interface UserDashboardProps {
    userEmail: string;
    onBack: () => void;
}

export default function UserDashboard({ userEmail, onBack }: UserDashboardProps) {
    const { appointments, removeAppointment, loading } = useAppointments();
    const [appointmentToDelete, setAppointmentToDelete] = useState<Appointment | null>(null);

    // Filtrar citas del usuario
    const userAppointments = appointments.filter(app => app.customerEmail === userEmail);

    // Separar en próximas e historial
    const now = new Date();
    const upcoming = userAppointments
        .filter(app => new Date(app.date) >= now)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const history = userAppointments
        .filter(app => new Date(app.date) < now)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const getServiceName = (id: string) => services.find(s => s.id === id)?.name || 'Servicio desconocido';

    const isLateCancellation = (date: Date) => {
        const appTime = new Date(date).getTime();
        const currentTime = new Date().getTime();
        const diffInHours = (appTime - currentTime) / (1000 * 60 * 60);
        return diffInHours < 1;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-brand-cream flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-brand-cream py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <button
                            onClick={onBack}
                            className="text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1 mb-2 transition-colors"
                        >
                            <ChevronRight className="w-4 h-4 rotate-180" /> Volver al Inicio
                        </button>
                        <h1 className="text-4xl font-serif font-bold text-gray-900 tracking-tight">Mis Citas</h1>
                        <p className="text-gray-500 mt-1">Gestiona tus reservas en Nuria Olias</p>
                    </div>
                    <div className="hidden sm:block bg-white px-4 py-2 rounded-2xl shadow-sm border border-amber-100">
                        <span className="text-xs text-gray-400 block uppercase tracking-widest font-bold">Email</span>
                        <span className="text-gray-700 font-medium">{userEmail}</span>
                    </div>
                </header>

                {/* Próximas Citas */}
                <section className="mb-12">
                    <div className="flex items-center gap-2 mb-6">
                        <Calendar className="text-amber-500 w-6 h-6" />
                        <h2 className="text-2xl font-serif font-bold text-gray-800">Próximas Citas</h2>
                    </div>

                    {upcoming.length === 0 ? (
                        <div className="bg-white rounded-3xl p-10 text-center border border-dashed border-gray-200">
                            <p className="text-gray-400">No tienes citas programadas próximamente.</p>
                        </div>
                    ) : (
                        <div className="grid gap-6">
                            {upcoming.map(app => (
                                <div key={app.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-amber-50 rounded-2xl flex flex-col items-center justify-center text-amber-600 border border-amber-100">
                                            <span className="text-xs font-bold uppercase">{new Date(app.date).toLocaleDateString('es-ES', { month: 'short' })}</span>
                                            <span className="text-xl font-bold">{new Date(app.date).getDate()}</span>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 text-lg">{getServiceName(app.serviceId)}</h3>
                                            <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                                                <Clock className="w-4 h-4" />
                                                <span>{new Date(app.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setAppointmentToDelete(app)}
                                        className="flex items-center justify-center gap-2 px-4 py-2 text-red-500 bg-red-50 hover:bg-red-100 rounded-xl font-bold text-sm transition-colors self-start sm:self-center"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Cancelar
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Historial */}
                <section>
                    <div className="flex items-center gap-2 mb-6">
                        <History className="text-gray-400 w-6 h-6" />
                        <h2 className="text-2xl font-serif font-bold text-gray-800">Historial</h2>
                    </div>

                    {history.length === 0 ? (
                        <div className="text-center py-6 text-gray-400 italic">Historial vacío.</div>
                    ) : (
                        <div className="space-y-4 opacity-70">
                            {history.map(app => (
                                <div key={app.id} className="bg-white/50 rounded-2xl p-4 border border-gray-100 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="text-gray-400 font-medium text-sm">
                                            {new Date(app.date).toLocaleDateString()}
                                        </div>
                                        <div className="font-medium text-gray-700">{getServiceName(app.serviceId)}</div>
                                    </div>
                                    <div className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Completada</div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>

            {/* Modal de Confirmación de Cancelación */}
            {appointmentToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-md w-full p-8 transform transition-all animate-in zoom-in duration-300">
                        <div className="flex justify-between items-start mb-6">
                            <div className="bg-red-50 p-4 rounded-3xl">
                                <AlertTriangle className="text-red-500 w-8 h-8" />
                            </div>
                            <button
                                onClick={() => setAppointmentToDelete(null)}
                                className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <h3 className="text-2xl font-serif font-bold text-gray-900 mb-3">¿Cancelar tu cita?</h3>
                        <p className="text-gray-600 mb-6 leading-relaxed">
                            Vas a cancelar tu cita para <span className="font-bold text-gray-900">{getServiceName(appointmentToDelete.serviceId)}</span> el día <span className="font-bold text-gray-900">{new Date(appointmentToDelete.date).toLocaleDateString()}</span>.
                        </p>

                        {isLateCancellation(appointmentToDelete.date) && (
                            <div className="bg-amber-50 border-2 border-amber-200 rounded-3xl p-5 mb-8 animate-pulse">
                                <div className="flex gap-3">
                                    <AlertTriangle className="text-amber-600 w-6 h-6 shrink-0" />
                                    <p className="text-amber-800 text-sm font-bold leading-snug">
                                        ¡AVISO IMPORTANTE!: Falta menos de 1 hora. Si cancelas ahora, se te cobrará un recargo/impuesto por cancelación tardía.
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => setAppointmentToDelete(null)}
                                className="px-6 py-4 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-2xl font-bold transition-colors"
                            >
                                No, mantener
                            </button>
                            <button
                                onClick={() => {
                                    removeAppointment(appointmentToDelete.id);
                                    setAppointmentToDelete(null);
                                }}
                                className="px-6 py-4 text-white bg-red-500 hover:bg-red-600 rounded-2xl font-bold transition-all shadow-lg shadow-red-200"
                            >
                                Sí, cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
