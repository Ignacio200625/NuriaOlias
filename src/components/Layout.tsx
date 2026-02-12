import React, { useState } from 'react';
import { Menu, X, Instagram, Phone, MapPin } from 'lucide-react';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <div className="min-h-screen flex flex-col font-sans text-brand-black bg-brand-cream">
            {/* Navigation */}
            <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-brand-gold/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        {/* Logo */}
                        <div className="flex-shrink-0 flex items-center">
                            <span className="font-serif text-2xl font-bold tracking-tight">
                                Nuria Olias<span className="text-brand-gold">.</span>
                            </span>
                        </div>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center space-x-8">
                            <a href="#home" className="text-sm font-medium hover:text-brand-gold transition-colors">INICIO</a>
                            <a href="#services" className="text-sm font-medium hover:text-brand-gold transition-colors">SERVICIOS</a>
                            <a href="#gallery" className="text-sm font-medium hover:text-brand-gold transition-colors">GALERÍA</a>
                            <a href="#contact" className="text-sm font-medium hover:text-brand-gold transition-colors">CONTACTO</a>
                            <a
                        href="#contact"
                        className="px-8 py-4 bg-gradient-to-r from-amber-400 to-amber-500 text-white rounded-full font-medium hover:shadow-lg hover:shadow-amber-400/50 hover:scale-105 transition-all duration-300"
                    >
                        Pedir Cita
                    </a>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden flex items-center">
                            <button
                                onClick={toggleMenu}
                                className="p-2 rounded-md text-brand-black hover:text-brand-gold focus:outline-none"
                            >
                                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden bg-white border-b border-gray-100">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col items-center">
                            <a
                                href="#home"
                                className="block px-3 py-2 text-base font-medium hover:text-brand-gold"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                INICIO
                            </a>
                            <a
                                href="#services"
                                className="block px-3 py-2 text-base font-medium hover:text-brand-gold"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                SERVICIOS
                            </a>
                            <a
                                href="#gallery"
                                className="block px-3 py-2 text-base font-medium hover:text-brand-gold"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                GALERÍA
                            </a>
                            <a
                                href="#contact"
                                className="block px-3 py-2 text-base font-medium hover:text-brand-gold"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                CONTACTO
                            </a>
                            <a
                                href="#contact"
                                className="px-8 py-4 bg-gradient-to-r from-amber-400 to-amber-500 text-white rounded-full font-medium hover:shadow-lg hover:shadow-amber-400/50 hover:scale-105 transition-all duration-300 mt-4 block w-full text-center bg-brand-black text-white px-6 py-3 rounded-full font-medium hover:bg-brand-gold transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                RESERVAR CITA
                            </a>
                        </div>
                    </div>
                )}
            </nav>

            {/* Main Content */}
            <main className="flex-grow">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white pt-16 pb-8 border-t border-gray-700/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {/* Brand */}
                        <div>
                            <h3 className="font-serif text-3xl font-bold mb-6 bg-gradient-to-r from-white via-amber-100 to-white bg-clip-text text-transparent drop-shadow-lg">Nuria Olias<span className="text-transparent bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text">.</span></h3>
                            <p className="text-gray-300 mb-6 max-w-sm leading-relaxed">
                                Tu destino para el <span className="text-transparent bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text font-medium">cuidado capilar de lujo</span>. Especialistas en coloración, tratamientos y estilismo personalizado.
                            </p>
                            <div className="flex space-x-4">
                                <a href="https://instagram.com/peluqueria.nuriaolias" target="_blank" rel="noopener noreferrer" className="p-3 bg-gradient-to-br from-pink-500/30 to-rose-500/30 rounded-full hover:from-pink-500 hover:to-rose-500 text-white transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-pink-500/50">
                                    <Instagram size={20} />
                                </a>
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div>
                            <h4 className="font-serif text-lg font-bold mb-6 bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent drop-shadow-sm">Contacto</h4>
                            <ul className="space-y-4">
                                <li className="flex items-start group hover:translate-x-2 transition-transform">
                                    <MapPin size={20} className="text-transparent bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text mr-3 mt-1 flex-shrink-0" />
                                    <span className="text-gray-300 group-hover:text-gray-100 transition-colors">Consulta nuestra ubicación en el mapa.</span>
                                </li>
                                <li className="flex items-center group hover:translate-x-2 transition-transform">
                                    <Phone size={20} className="text-transparent bg-gradient-to-r from-rose-400 to-pink-400 bg-clip-text mr-3 flex-shrink-0" />
                                    <span className="text-gray-300 group-hover:text-gray-100 transition-colors font-medium">+34 912 34 56 78</span>
                                </li>
                            </ul>
                        </div>

                        {/* Hours */}
                        <div>
                            <h4 className="font-serif text-lg font-bold mb-6 bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent drop-shadow-sm">Horario</h4>
                            <ul className="space-y-3 text-gray-300">
                                <li className="flex justify-between group hover:bg-white/5 px-3 py-1 rounded transition-colors">
                                    <span className="group-hover:text-cyan-300 transition-colors">Lunes - Viernes</span>
                                    <span className="font-medium text-cyan-400">10:00 - 20:00</span>
                                </li>
                                <li className="flex justify-between group hover:bg-white/5 px-3 py-1 rounded transition-colors">
                                    <span className="group-hover:text-cyan-300 transition-colors">Sábado</span>
                                    <span className="font-medium text-cyan-400">09:00 - 14:00</span>
                                </li>
                                <li className="flex justify-between group hover:bg-white/5 px-3 py-1 rounded transition-colors">
                                    <span className="group-hover:text-pink-300 transition-colors">Domingo</span>
                                    <span className="text-transparent bg-gradient-to-r from-rose-400 to-pink-400 bg-clip-text font-bold">Cerrado</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-gradient-to-r from-transparent via-gray-600 to-transparent mt-16 pt-8 text-center">
                        <p className="text-gray-400 text-sm">&copy; {new Date().getFullYear()} <span className="text-transparent bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text font-medium">Peluquería Nuria Olias</span>. Todos los derechos reservados.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
