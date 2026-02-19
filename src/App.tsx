import { useState, useEffect } from "react";
import Layout from "./components/Layout";
import Hero from "./components/Hero";
import Services from "./components/Services";
import Gallery from "./components/Gallery";
import Contact from "./components/Contact";
import BookingModal from "./components/BookingModal";
import AdminDashboard from "./components/AdminDashboard";
import AuthForm from "./components/AuthForm";
import { AppointmentProvider } from "./context/AppointmentContext";
import { observeAuth } from "./lib/auth";
import type { User } from "firebase/auth";

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [isBookingOpen, setIsBookingOpen] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(window.location.hash === "#admin");

  // Observa la autenticación
  useEffect(() => {
    const unsubscribe = observeAuth((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Manejo de hash para admin
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;

      if (hash === "#setup-admin-device") {
        localStorage.setItem("adminDeviceAllowed", "true");
        window.location.hash = "#admin";
        return;
      }

      if (hash === "#admin") {
        const isAllowed = localStorage.getItem("adminDeviceAllowed") === "true";
        if (isAllowed && user) {
          setIsAdmin(true);
        } else {
          window.location.hash = "";
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [user]);

  // Mostrar AuthForm si no hay usuario o si estamos mostrando la pantalla de verificación enviada
  if (!user || isVerifying) {
    return (
      <AuthForm
        onSuccess={() => setIsVerifying(false)}
        onRegistering={(verifying) => setIsVerifying(verifying)}
      />
    );
  }

  // Mostrar admin
  if (isAdmin) {
    return (
      <AppointmentProvider>
        <AdminDashboard />
      </AppointmentProvider>
    );
  }

  // Mostrar app normal
  return (
    <AppointmentProvider>
      <Layout onOpenBooking={() => setIsBookingOpen(true)}>
        <Hero onOpenBooking={() => setIsBookingOpen(true)} />
        <Services />
        <Gallery />
        <Contact />
        <BookingModal
          isOpen={isBookingOpen}
          onClose={() => setIsBookingOpen(false)}
          userEmail={user?.email}
        />
      </Layout>
    </AppointmentProvider>
  );
}

export default App;
