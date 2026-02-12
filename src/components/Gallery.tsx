import React from 'react';

const images = [
    {
        url: "https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        title: "Coloración Blonde"
    },
    {
        url: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        title: "Corte Bob"
    },
    {
        url: "https://images.unsplash.com/photo-1595476103518-3c8ad04601bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        title: "Ondas Naturales"
    },
    {
        url: "https://images.unsplash.com/photo-1519699047748-40ba5266f2cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        title: "Recogidos"
    },
    {
        url: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        title: "Tratamientos"
    },
    {
        url: "https://images.unsplash.com/photo-1634449571010-02389ed0f9b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        title: "Estilismo"
    },
    {
        url: "https://images.unsplash.com/photo-1560869713-7d0a29430803?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        title: "Mechas Balayage"
    },
    {
        url: "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        title: "Cuidado Capilar"
    },
    {
        url: "https://images.unsplash.com/photo-1481068140073-f01b1a545924?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        title: "Innovación"
    }
];

const Gallery: React.FC = () => {
    const gradients = [
        'from-rose-500/30 to-pink-500/30',
        'from-amber-500/30 to-orange-500/30',
        'from-purple-500/30 to-indigo-500/30',
        'from-cyan-500/30 to-teal-500/30',
        'from-rose-500/30 to-purple-500/30',
        'from-amber-500/30 to-rose-500/30',
        'from-indigo-500/30 to-cyan-500/30',
        'from-pink-500/30 to-orange-500/30',
        'from-teal-500/30 to-purple-500/30'
    ];

    return (
        <section id="gallery" className="py-24 bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-rose-200/30 to-pink-200/30 rounded-full blur-3xl -z-10"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-amber-200/30 to-orange-200/30 rounded-full blur-3xl -z-10"></div>
            <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-gradient-to-br from-purple-200/20 to-indigo-200/20 rounded-full blur-3xl -z-10 transform -translate-x-1/2 -translate-y-1/2"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 px-2">
                    <div className="max-w-2xl">
                        <span className="inline-block px-4 py-2 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 font-medium tracking-widest uppercase mb-4 rounded-full text-xs">Nuestro Portfolio</span>
                        <h2 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-4 md:mb-0">
                            Resultados <span className="bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent italic">Reales</span>
                        </h2>
                    </div>
                    <a
                        href="https://instagram.com/peluqueria.nuriaolias"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hidden md:inline-flex items-center text-gray-900 hover:text-transparent hover:bg-gradient-to-r hover:from-rose-500 hover:to-pink-500 hover:bg-clip-text font-medium transition-all duration-300"
                    >
                        Ver más en Instagram &rarr;
                    </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {images.map((image, index) => (
                        <div
                            key={index}
                            className="group relative h-96 overflow-hidden rounded-2xl cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-white/50"
                        >
                            <img
                                src={image.url}
                                alt={image.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-125"
                            />
                            <div className={`absolute inset-0 bg-gradient-to-t ${gradients[index]} via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-8`}>
                                <span className="text-white font-serif text-xl border-l-4 border-amber-300 pl-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                    {image.title}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center md:hidden">
                    <a
                        href="https://instagram.com/peluqueria.nuriaolias"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-gray-900 hover:text-transparent hover:bg-gradient-to-r hover:from-rose-500 hover:to-pink-500 hover:bg-clip-text font-medium transition-all duration-300"
                    >
                        Ver más en Instagram &rarr;
                    </a>
                </div>
            </div>
        </section>
    );
};

export default Gallery;
