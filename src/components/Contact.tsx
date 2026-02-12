import React, { useState, useRef } from 'react';
import { Phone, MapPin, Mail, Clock, Send, CheckCircle, AlertCircle } from 'lucide-react';
import emailjs from '@emailjs/browser';

const Contact: React.FC = () => {
    const formRef = useRef<HTMLFormElement>(null);
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formRef.current) return;

        setStatus('sending');

        // NOTE: These are placeholder keys. The user needs to replace them with their own.
        // Service ID: service_id
        // Template ID: template_id
        // Public Key: public_key
        emailjs.sendForm(
            'YOUR_SERVICE_ID',
            'YOUR_TEMPLATE_ID',
            formRef.current,
            'YOUR_PUBLIC_KEY'
        )
            .then((result) => {
                console.log(result.text);
                setStatus('success');
                formRef.current?.reset();
                setTimeout(() => setStatus('idle'), 5000);
            }, (error) => {
                console.log(error.text);
                setStatus('error');
                setTimeout(() => setStatus('idle'), 5000);
            });
    };

    return (
        <section id="contact" className="py-24 bg-gradient-to-br from-white to-gray-50 relative overflow-hidden">
            {/* Decorational Elements */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-rose-200/40 to-pink-200/40 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-amber-200/40 to-orange-200/40 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

                    {/* Contact Info */}
                    <div>
                        <span className="inline-block px-4 py-2 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 font-medium tracking-widest uppercase mb-4 rounded-full text-xs">Contacto</span>
                        <h2 className="font-serif text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-8">Reserva tu Cita</h2>
                        <p className="text-gray-600 mb-12 text-lg leading-relaxed drop-shadow-sm">
                            Estamos deseando atenderte. <span className="text-transparent bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text font-medium">Llámanos para reservar</span> o solicita una cita a través del formulario.
                        </p>

                        <div className="space-y-8">
                            <div className="flex items-start">
                                <div className="flex-shrink-0 p-3 bg-gradient-to-br from-rose-500 to-pink-500 rounded-full text-white">
                                    <Phone size={24} />
                                </div>
                                <div className="ml-6">
                                    <h3 className="font-serif text-xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent mb-1 drop-shadow-sm">Teléfono</h3>
                                    <a href="tel:+34912345678" className="text-gray-700 font-medium hover:text-transparent hover:bg-gradient-to-r hover:from-rose-500 hover:to-pink-500 hover:bg-clip-text text-lg transition-all duration-300 hover:scale-105 inline-block">
                                        +34 912 34 56 78
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="flex-shrink-0 p-3 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full text-white">
                                    <MapPin size={24} />
                                </div>
                                <div className="ml-6">
                                    <h3 className="font-serif text-xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-1 drop-shadow-sm">Ubicación</h3>
                                    <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors">
                                        Av. de la Libertad, 123<br />
                                        <span className="text-amber-600 font-medium">28001 Madrid</span>
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="flex-shrink-0 p-3 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full text-white">
                                    <Mail size={24} />
                                </div>
                                <div className="ml-6">
                                    <h3 className="font-serif text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-1 drop-shadow-sm">Email</h3>
                                    <a href="mailto:info@nuriaolias.com" className="text-gray-600 hover:text-transparent hover:bg-gradient-to-r hover:from-purple-500 hover:to-indigo-500 hover:bg-clip-text font-medium transition-all duration-300 hover:scale-105 inline-block">
                                        info@nuriaolias.com
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="flex-shrink-0 p-3 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-full text-white">
                                    <Clock size={24} />
                                </div>
                                <div className="ml-6">
                                    <h3 className="font-serif text-xl font-bold bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent mb-1 drop-shadow-sm">Horario</h3>
                                    <p className="text-gray-600"><span className="text-cyan-600 font-medium">Lun - Vie:</span> 10:00 - 20:00</p>
                                    <p className="text-gray-600"><span className="text-cyan-600 font-medium">Sáb:</span> 09:00 - 14:00</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form Area */}
                    <div className="bg-gradient-to-br from-white to-gray-50 p-8 md:p-12 rounded-2xl shadow-2xl border border-gray-100 hover:shadow-3xl transition-shadow">
                        <h3 className="font-serif text-2xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Envíanos un mensaje</h3>
                        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="user_name" className="block text-sm font-medium bg-gradient-to-r from-gray-700 to-gray-600 bg-clip-text text-transparent mb-2">Nombre</label>
                                    <input
                                        type="text"
                                        name="user_name"
                                        required
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none transition-all bg-gray-50 hover:bg-white"
                                        placeholder="Tu nombre"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="user_phone" className="block text-sm font-medium bg-gradient-to-r from-gray-700 to-gray-600 bg-clip-text text-transparent mb-2">Teléfono</label>
                                    <input
                                        type="tel"
                                        name="user_phone"
                                        required
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none transition-all bg-gray-50 hover:bg-white"
                                        placeholder="Tu teléfono"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="service" className="block text-sm font-medium bg-gradient-to-r from-gray-700 to-gray-600 bg-clip-text text-transparent mb-2">Servicio</label>
                                <select
                                    name="service"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none transition-all bg-gray-50 hover:bg-white"
                                >
                                    <option value="General">Consulta General</option>
                                    <option value="Corte">Corte & Peinado</option>
                                    <option value="Color">Coloración</option>
                                    <option value="Tratamiento">Tratamientos</option>
                                    <option value="Novias">Novias</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-medium bg-gradient-to-r from-gray-700 to-gray-600 bg-clip-text text-transparent mb-2">Mensaje</label>
                                <textarea
                                    name="message"
                                    rows={4}
                                    required
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none transition-all bg-gray-50 hover:bg-white resize-none"
                                    placeholder="¿En qué podemos ayudarte?"
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={status === 'sending' || status === 'success'}
                                className={`w-full py-4 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl flex justify-center items-center gap-2
                  ${status === 'success'
                                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                                        : status === 'error'
                                            ? 'bg-gradient-to-r from-red-500 to-red-600 text-white'
                                            : 'bg-gradient-to-r from-gray-900 to-black text-white hover:scale-105'
                                    }`}
                            >
                                {status === 'idle' && (
                                    <>Enviar Solicitud <Send size={18} /></>
                                )}
                                {status === 'sending' && 'Enviando...'}
                                {status === 'success' && (
                                    <>Mensaje Enviado <CheckCircle size={18} /></>
                                )}
                                {status === 'error' && (
                                    <>Error al Enviar <AlertCircle size={18} /></>
                                )}
                            </button>

                            {status === 'error' && (
                                <p className="text-xs text-center text-red-500 mt-2">
                                    Hubo un error. Por favor intenta llamar al salón directamente.
                                </p>
                            )}
                        </form>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Contact;
