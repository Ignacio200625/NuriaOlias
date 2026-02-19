import { useState } from "react";
import { loginUser, registerUser, loginWithGoogle, resetPassword } from "../lib/auth";

interface AuthFormProps {
  onSuccess: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isRegister, setIsRegister] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // ── Olvidé mi contraseña ──────────────────────────────────
  const [resetStatus, setResetStatus] = useState<"idle" | "sent" | "error">("idle");
  const [resetLoading, setResetLoading] = useState(false);

  const handleForgotPassword = async () => {
    if (!email) {
      setResetStatus("error");
      return;
    }
    setResetLoading(true);
    try {
      await resetPassword(email);
      setResetStatus("sent");
    } catch {
      setResetStatus("error");
    } finally {
      setResetLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      if (isRegister) {
        await registerUser(email, password);
      } else {
        await loginUser(email, password);
      }
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Error en autenticación");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Error al iniciar sesión con Google");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-brand-cream px-4">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md border border-amber-200">

        {/* Logo / Título */}
        <div className="text-center mb-8">
          <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-amber-400 via-amber-500 to-orange-400 bg-clip-text text-transparent">
              Nuria Olias
            </span>
            <span className="text-amber-500">.</span>
          </h1>
          <p className="mt-2 text-sm text-gray-500 tracking-widest uppercase">
            Peluquería &amp; Estética
          </p>
          <div className="w-16 h-[2px] bg-gradient-to-r from-amber-400 to-orange-400 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Error de login */}
        {error && (
          <p className="text-red-600 text-center mb-4 font-medium">{error}</p>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setResetStatus("idle"); }}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 placeholder-gray-400 text-brand-black"
          />

          <div className="space-y-1">
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 placeholder-gray-400 text-brand-black"
            />

            {/* Olvidé mi contraseña — solo visible en modo login */}
            {!isRegister && (
              <div className="flex items-center justify-between min-h-[20px]">
                {resetStatus === "sent" ? (
                  <p className="text-xs text-green-600 font-medium">
                    ✅ Email enviado a <strong>{email}</strong>. Revisa tu bandeja.
                  </p>
                ) : (
                  <>
                    <div className="flex flex-col gap-1">
                      <button
                        type="button"
                        onClick={handleForgotPassword}
                        disabled={resetLoading}
                        className="text-xs text-amber-500 hover:text-amber-700 hover:underline transition-colors disabled:opacity-50 text-left"
                      >
                        {resetLoading ? "Enviando..." : "¿Has olvidado tu contraseña?"}
                      </button>
                      <span className="text-xs text-gray-400">📩 El correo puede llegar a la carpeta de spam</span>
                    </div>
                    {resetStatus === "error" && (
                      <span className="text-xs text-red-500">Escribe tu email primero</span>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-amber-400 to-amber-500 text-white font-medium rounded-lg hover:from-amber-500 hover:to-amber-600 transition-all shadow-md"
          >
            {isRegister ? "Registrarse" : "Iniciar sesión"}
          </button>
        </form>

        {/* Google Login */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full py-3 mt-4 bg-gradient-to-r from-pink-400 to-rose-500 text-white font-medium rounded-lg hover:from-pink-500 hover:to-rose-600 transition-all flex items-center justify-center shadow-md"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 488 512" fill="currentColor">
            <path d="M488 261.8c0-17.7-1.5-34.9-4.3-51.4H249v97.4h134.7c-5.8 31.3-23.6 57.8-50.3 75.5v62.8h81.2c47.5-43.8 74.6-108.2 74.6-184.3zM249 492c66.5 0 122.3-21.9 163-59.3l-81.2-62.8c-22.6 15.1-51.5 24-81.8 24-62.9 0-116.2-42.4-135.3-99.3H30.1v62.4C70.9 437 153.5 492 249 492zM113.7 293.3c-4.3-12.7-6.8-26.2-6.8-40s2.5-27.3 6.8-40V150.9H30.1c-18.7 37.5-29.5 79.6-29.5 122.3s10.8 84.8 29.5 122.3l83.6-62.2zM249 97.9c34.1 0 64.8 11.7 88.9 34.6l66.7-66.7C371.3 27.1 315.5 5.2 249 5.2 153.5 5.2 70.9 60.1 30.1 150.9l83.6 62.4c19-56.8 72.4-99.3 135.3-99.3z" />
          </svg>
          Iniciar sesión con Google
        </button>

        {/* Toggle login/register */}
        <p className="mt-4 text-center text-gray-600 text-sm">
          {isRegister ? "¿Ya tienes cuenta?" : "¿No tienes cuenta?"}{" "}
          <button
            onClick={() => { setIsRegister(!isRegister); setError(""); setResetStatus("idle"); }}
            className="text-amber-500 hover:text-amber-600 font-semibold transition-colors"
          >
            {isRegister ? "Iniciar sesión" : "Registrarse"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
