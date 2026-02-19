import emailjs from '@emailjs/browser';

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID as string;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string;

export interface EmailParams {
    customerName: string;
    customerEmail: string;
    serviceName: string;
    appointmentDate: string;
    appointmentTime: string;
    servicePrice: number;
    serviceDuration: number;
}

export const sendConfirmationEmail = async (params: EmailParams): Promise<void> => {
    const isConfigured =
        SERVICE_ID && !SERVICE_ID.includes('your_') &&
        TEMPLATE_ID && !TEMPLATE_ID.includes('your_') &&
        PUBLIC_KEY && !PUBLIC_KEY.includes('your_');

    if (!isConfigured) {
        console.warn('EmailJS: configura las variables en .env.local para activar el envío de correos.');
        return;
    }

    const templateParams = {
        to_email: params.customerEmail,
        to_name: params.customerName,
        service_name: params.serviceName,
        appointment_date: params.appointmentDate,
        appointment_time: params.appointmentTime,
        service_price: `${params.servicePrice}€`,
        service_duration: `${params.serviceDuration} min`,
    };

    await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
};
