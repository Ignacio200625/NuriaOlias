import React, { useState, useEffect } from 'react';
import { useAppointments } from '../context/AppointmentContext';
import { Clock, User, Phone, MessageSquare, ArrowLeft } from 'lucide-react';
import { services } from '../data/mockData';

export default function AdminDashboard() {
    const { appointments } = useAppointments();
    const [password, setPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Sort appointments by date (newest first)
    const sortedAppointments = [...appointments].sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === 'admin123') { // Simple hardcoded password for MVP
            setIsAuthenticated(true);
            localStorage.setItem('adminAuth', 'true');
        } else {
            alert('Contraseña incorrecta');
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('adminAuth');
        window.location.hash = '';
    }

    useEffect(() => {
        if (localStorage.getItem('adminAuth') === 'true') {
            setIsAuthenticated(true);
        }
    }, []);

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                    <h1 className="text-2xl font-serif font-bold text-gray-900 mb-6 text-center">Panel de Administración</h1>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                            <input
                                type="password"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="w-full bg-amber-600 text-white py-2 rounded-lg font-medium hover:bg-amber-700 transition">
                            Entrar
                        </button>
                        <button type="button" onClick={() => window.location.hash = ''} className="w-full text-gray-500 text-sm hover:text-gray-700 text-center block mt-4">
                            Volver a la web
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    const getServiceName = (id: string) => services.find(s => s.id === id)?.name || 'Servicio desconocido';

    // Group by date
    const groupedAppointments = sortedAppointments.reduce((acc, app) => {
        const dateKey = new Date(app.date).toLocaleDateString();
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(app);
        return acc;
    }, {} as Record<string, typeof appointments>);

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-12">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-4">
                        <button onClick={() => window.location.hash = ''} className="p-2 hover:bg-gray-200 rounded-full transition"><ArrowLeft /></button>
                        <h1 className="text-3xl font-serif font-bold text-gray-900">Citas Programadas</h1>
                    </div>
                    <button onClick={handleLogout} className="text-red-600 font-medium hover:text-red-700">Cerrar Sesión</button>
                </div>

                {Object.keys(groupedAppointments).length === 0 ? (
                    <div className="text-center py-20 text-gray-500 bg-white rounded-xl shadow-sm">
                        No hay citas programadas.
                    </div>
                ) : (
                    <div className="space-y-8">
                        {Object.entries(groupedAppointments).map(([date, apps]) => (
                            <div key={date}>
                                <h2 className="text-xl font-medium text-gray-700 mb-4 sticky top-4 bg-gray-50 py-2 z-10">{date}</h2>
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {apps.map(app => (
                                        <div key={app.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <div className="font-bold text-lg text-gray-900">{getServiceName(app.serviceId)}</div>
                                                    <div className="flex items-center text-amber-600 text-sm font-medium gap-1 mt-1">
                                                        <Clock size={16} />
                                                        {new Date(app.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                </div>
                                                <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">Confirmada</span>
                                            </div>

                                            <div className="space-y-2 text-sm text-gray-600">
                                                <div className="flex items-center gap-2">
                                                    <User size={16} className="text-gray-400" />
                                                    <span className="font-medium text-gray-900">{app.customerName}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Phone size={16} className="text-gray-400" />
                                                    <a href={`tel:${app.customerPhone}`} className="hover:text-amber-600 transition">{app.customerPhone}</a>
                                                </div>
                                                {app.message && (
                                                    <div className="flex items-start gap-2 pt-2 border-t border-gray-50 mt-3">
                                                        <MessageSquare size={16} className="text-gray-400 mt-0.5 shrink-0" />
                                                        <p className="italic text-gray-500">{app.message}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
