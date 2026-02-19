import emailjs from '@emailjs/browser';

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID as string;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string;

export interface EmailParams {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
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
        to_email: params.customerEmail, // ⬅️ Principal: Configura este en el Dashboard de EmailJS
        email: params.customerEmail,    // Alias común 1
        contact_email: params.customerEmail, // Alias común 2
        reply_to: params.customerEmail, // Útil para que puedas responder el correo
        user_name: params.customerName,
        user_email: params.customerEmail,
        user_phone: params.customerPhone || 'No proporcionado',
        service_name: params.serviceName,
        appointment_date: params.appointmentDate,
        appointment_time: params.appointmentTime,
        service_price: `${params.servicePrice}€`,
        service_duration: `${params.serviceDuration} min`,
        message: 'Reserva realizada desde la web',
    };

    console.log('Enviando email con parámetros:', templateParams);

    try {
        const response = await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
        console.log('Respuesta de EmailJS:', response);
    } catch (error) {
        console.error('Error detallado de EmailJS:', error);
        throw error;
    }
};

/**
 * Envía un código de verificación de 6 dígitos mediante EmailJS
 */
export const sendVerificationCode = async (to_email: string, code: string): Promise<void> => {
    const templateParams = {
        to_email: to_email,
        email: to_email,
        verification_code: code,
        user_name: 'Cliente',
        message: `Tu código de verificación para Nuria Olias es: ${code}. Expira en 5 minutos.`,
    };

    console.log('Enviando código de verificación:', code, 'a:', to_email);

    try {
        await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
        console.log('Código de verificación enviado con éxito');
    } catch (error) {
        console.error('Error al enviar código de verificación:', error);
        throw error;
    }
};
