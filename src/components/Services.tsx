import React from 'react';
import { Scissors, Palette, Sparkles, Heart } from 'lucide-react';

const services = [
    {
        title: "Corte y Estilo",
        description: "Cortes personalizados que realzan tus facciones y se adaptan a tu estilo de vida. Desde clásicos atemporales hasta las últimas tendencias.",
        price: "Desde 35€",
        icon: Scissors
    },
    {
        title: "Coloración Premium",
        description: "Expertos en balayage, babylights y corrección de color. Utilizamos productos de alta gama que cuidan la salud de tu cabello.",
        price: "Desde 50€",
        icon: Palette
    },
    {
        title: "Tratamientos",
        description: "Hidratación profunda, keratina y rituales de spa capilar para recuperar el brillo y la vitalidad de tu melena.",
        price: "Desde 40€",
        icon: Sparkles
    },
    {
        title: "Novias y Eventos",
        description: "Peinados y recogidos exclusivos para tu día más especial. Asesoramiento personalizado para novias e invitadas.",
        price: "Consultar",
        icon: Heart
    }
];

const Services: React.FC = () => {
    const colors = [
        { bg: 'from-rose-50 to-pink-50', icon: 'from-rose-500 to-pink-500', border: 'border-rose-200' },
        { bg: 'from-amber-50 to-orange-50', icon: 'from-amber-500 to-orange-500', border: 'border-amber-200' },
        { bg: 'from-purple-50 to-indigo-50', icon: 'from-purple-500 to-indigo-500', border: 'border-purple-200' },
        { bg: 'from-cyan-50 to-teal-50', icon: 'from-cyan-500 to-teal-500', border: 'border-cyan-200' }
    ];

    return (
        <section id="services" className="py-24 bg-gradient-to-br from-white via-gray-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <span className="inline-block px-4 py-2 bg-gradient-to-r from-rose-100 to-pink-100 text-rose-700 font-medium tracking-widest uppercase mb-4 rounded-full text-xs">Nuestros Servicios</span>
                    <h2 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-4">Experiencia de Lujo</h2>
                    <div className="w-32 h-1.5 bg-gradient-to-r from-rose-500 via-amber-500 to-pink-500 mx-auto rounded-full"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {services.map((service, index) => {
                        const color = colors[index % colors.length];
                        return (
                            <div
                                key={index}
                                className={`group p-8 bg-gradient-to-br ${color.bg} rounded-2xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3 cursor-default border ${color.border} hover:border-gray-300 shadow-lg hover:scale-105`}
                            >
                                <div className={`mb-6 inline-block p-4 rounded-xl bg-gradient-to-br ${color.icon} text-white group-hover:shadow-lg group-hover:shadow-current transition-all duration-300 transform group-hover:scale-110`}>
                                    <service.icon size={32} strokeWidth={1.5} />
                                </div>
                                <h3 className="font-serif text-xl font-bold mb-3 text-gray-900 group-hover:text-gray-900 transition-colors">{service.title}</h3>
                                <p className="text-gray-600 mb-6 text-sm leading-relaxed group-hover:text-gray-700 transition-colors">
                                    {service.description}
                                </p>
                                <span className={`inline-block font-medium text-sm tracking-wide uppercase border-b-2 pb-1 bg-gradient-to-r ${color.icon} bg-clip-text text-transparent`}>
                                    {service.price}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default Services;
