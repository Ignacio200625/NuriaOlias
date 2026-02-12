import React from 'react';
import { ChevronDown } from 'lucide-react';

const Hero: React.FC = () => {
    return (
        <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80"
                    alt="Salon Interior"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/50 to-purple-900/40"></div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-10 right-10 w-32 h-32 bg-gradient-to-br from-amber-400/20 to-rose-400/20 rounded-full blur-2xl"></div>
            <div className="absolute bottom-20 left-20 w-40 h-40 bg-gradient-to-tr from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>

            {/* Content */}
            <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                <span className="block text-amber-300 font-medium tracking-widest uppercase mb-4 animate-fade-in-up">
                    Bienvenida a tu nuevo look
                </span>
                <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-white font-bold mb-8 leading-tight animate-fade-in-up delay-100">
                    Realza tu <span className="italic bg-gradient-to-r from-amber-300 via-rose-300 to-pink-300 bg-clip-text text-transparent">belleza</span> natural
                </h1>
                <p className="text-gray-100 text-lg md:text-xl mb-12 max-w-2xl mx-auto animate-fade-in-up delay-200">
                    Expertos en color, corte y salud capilar. Un espacio exclusivo donde el estilo se encuentra con el bienestar.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in-up delay-300">
                    <a
                        href="#contact"
                        className="px-8 py-4 bg-gradient-to-r from-amber-400 to-amber-500 text-white rounded-full font-medium hover:shadow-lg hover:shadow-amber-400/50 hover:scale-105 transition-all duration-300"
                    >
                        Pedir Cita
                    </a>
                    <a
                        href="#services"
                        className="px-8 py-4 border-2 border-white text-white rounded-full font-medium hover:bg-white hover:text-black transition-all duration-300 backdrop-blur-sm"
                    >
                        Ver Servicios
                    </a>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce text-amber-300/80">
                <ChevronDown size={32} />
            </div>
        </section>
    );
};

export default Hero;
