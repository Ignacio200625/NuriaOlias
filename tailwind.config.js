/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'brand-gold': '#d4af37',
                'brand-black': '#1a1a1a',
                'brand-cream': '#f9f9f9',
                'brand-rose': '#e6d2cd',
                'brand-sage': '#c4c6b9',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                serif: ['Playfair Display', 'serif'],
            }
        },
    },
    plugins: [],
}
