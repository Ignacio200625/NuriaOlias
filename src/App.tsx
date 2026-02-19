import { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Hero from './components/Hero';
import Services from './components/Services';
import Gallery from './components/Gallery';
import Contact from './components/Contact';
import BookingModal from './components/BookingModal';
import AdminDashboard from './components/AdminDashboard';
import { AppointmentProvider } from './context/AppointmentContext';

function App() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(window.location.hash === '#admin');

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;

      // Secret setup route
      if (hash === '#setup-admin-device') {
        localStorage.setItem('adminDeviceAllowed', 'true');
        window.location.hash = '#admin';
        return;
      }

      // Admin check
      if (hash === '#admin') {
        const isAllowed = localStorage.getItem('adminDeviceAllowed') === 'true';
        if (isAllowed) {
          setIsAdmin(true);
        } else {
          // Not allowed, redirect to home
          window.location.hash = '';
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    };

    // Initial check
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  if (isAdmin) {
    return (
      <AppointmentProvider>
        <AdminDashboard />
      </AppointmentProvider>
    );
  }

  return (
    <AppointmentProvider>
      <Layout onOpenBooking={() => setIsBookingOpen(true)}>
        <Hero onOpenBooking={() => setIsBookingOpen(true)} />
        <Services />
        <Gallery />
        <Contact />
        <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
      </Layout>
    </AppointmentProvider>
  );
}

export default App;
