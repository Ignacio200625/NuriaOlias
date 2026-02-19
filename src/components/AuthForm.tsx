import { useState, useEffect } from "react";
import { loginUser, registerUser, loginWithGoogle, resetPassword } from "../lib/auth";
import { sendVerificationCode } from "../lib/emailService";
import { Mail, Lock, ArrowRight, ArrowLeft, ShieldCheck, Timer } from "lucide-react";

interface AuthFormProps {
  onSuccess: () => void;
  onRegistering: (isRegistering: boolean) => void;
}

type AuthStep = 'login' | 'register_email' | 'register_password' | 'verify_code';

const AuthForm: React.FC<AuthFormProps> = ({ onSuccess, onRegistering }) => {
  const [step, setStep] = useState<AuthStep>('login');
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // Verificación por código
  const [generatedCode, setGeneratedCode] = useState<string>("");
  const [inputCode, setInputCode] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState<number>(300); // 5 minutos (300 seg)

  console.log("AuthForm renderizado - Paso actual:", step);

  // ── Temporizador ──────────────────────────────────────────
  useEffect(() => {
    let timer: any;
    if (step === 'verify_code' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && step === 'verify_code') {
      setError("El código ha expirado. Por favor, solicita uno nuevo.");
    }
    return () => clearInterval(timer);
  }, [step, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // ── Olvidé mi contraseña ──────────────────────────────────
  const [resetStatus, setResetStatus] = useState<"idle" | "sent" | "error">("idle");
  const [resetLoading, setResetLoading] = useState(false);

  const handleForgotPassword = async () => {
    if (!email) {
      setResetStatus("error");
      setError("Introduce tu email para restablecer la contraseña");
      return;
    }
    setResetLoading(true);
    try {
      await resetPassword(email);
      setResetStatus("sent");
    } catch {
      setResetStatus("error");
      setError("Error al enviar el email de restablecimiento");
    } finally {
      setResetLoading(false);
    }
  };

  // ── Acciones de Autenticación ──────────────────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      console.log("Intentando login...");
      await loginUser(email, password);
      onRegistering(false);
      onSuccess();
    } catch (err: any) {
      setError("Email o contraseña incorrectos");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStep('register_password');
  };

  const generateCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleStartVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);
    onRegistering(true);
    try {
      const code = generateCode();
      console.log("Generando código de verificación:", code);
      setGeneratedCode(code);
      setTimeLeft(300); // 5 minutos

      // Enviamos el código vía EmailJS (TU GMAIL)
      await sendVerificationCode(email, code);
      console.log("Código enviado correctamente a", email);

      setStep('verify_code');
    } catch (err: any) {
      console.error("Error al enviar código:", err);
      setError("Error al enviar el código de verificación. Revisa tu conexión.");
      onRegistering(false);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (timeLeft <= 0) {
      setError("El código ha caducado. Solicita otro.");
      return;
    }

    if (inputCode === generatedCode) {
      console.log("¡Código verificado con éxito! Creando cuenta en Firebase...");
      setLoading(true);
      try {
        await registerUser(email, password);
        console.log("Cuenta creada con éxito.");
        onRegistering(false);
        onSuccess();
      } catch (err: any) {
        console.error("Error al crear cuenta tras verificar código:", err);
        setError("Error al finalizar el registro: " + err.message);
      } finally {
        setLoading(false);
      }
    } else {
      setError("Código incorrecto. Por favor, comprueba tu bandeja de entrada.");
    }
  };

  const handleResendCode = async () => {
    setError("");
    setLoading(true);
    try {
      const code = generateCode();
      setGeneratedCode(code);
      setTimeLeft(300);
      await sendVerificationCode(email, code);
      console.log("Nuevo código enviado.");
    } catch (err: any) {
      setError("Error al reenviar el código");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      console.log("Iniciando login con Google...");
      await loginWithGoogle();
      onRegistering(false);
      onSuccess();
    } catch (err: any) {
      console.error("Error en Google Login:", err);
      setError("Error al iniciar sesión con Google");
    }
  };

  const handleBackToLogin = () => {
    onRegistering(false);
    setStep('login');
    setError("");
    setPassword("");
    setConfirmPassword("");
    setInputCode("");
  };

  // ── Pantalla de Verificación por Código ───────────────────
  if (step === 'verify_code') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-brand-cream px-4">
        <div className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-md border border-amber-200 text-center animate-in zoom-in duration-300">
          <div className="mb-6 flex justify-center">
            <div className="w-24 h-24 bg-amber-50 rounded-full flex items-center justify-center border-8 border-white shadow-lg ring-1 ring-amber-100">
              <ShieldCheck className="text-amber-500 w-12 h-12" />
            </div>
          </div>
          <h2 className="text-3xl font-serif font-bold text-gray-800 mb-2 tracking-tight">Verifica tu email</h2>
          <p className="text-gray-500 mb-8 text-sm leading-relaxed px-2">
            Introduce el código de 6 dígitos enviado a:<br />
            <strong className="text-brand-black text-base">{email}</strong>
          </p>

          <form onSubmit={handleVerifyAndRegister} className="space-y-6">
            <div className="flex justify-center">
              <input
                type="text"
                maxLength={6}
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                required
                autoFocus
                className="w-full text-center text-5xl font-bold tracking-[0.3em] py-6 border-2 border-gray-100 rounded-2xl focus:border-amber-400 focus:ring-0 transition-all placeholder:text-gray-100 placeholder:tracking-normal bg-gray-50/30"
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-semibold animate-in shake duration-300">
                {error}
              </div>
            )}

            <div className="flex items-center justify-center gap-2 text-base text-gray-400 font-bold font-mono">
              <Timer className={`w-5 h-5 ${timeLeft < 60 ? 'text-red-500 animate-pulse' : ''}`} />
              <span className={timeLeft < 60 ? 'text-red-500' : ''}>
                {formatTime(timeLeft)}
              </span>
            </div>

            <button
              type="submit"
              disabled={loading || inputCode.length < 6}
              className="w-full py-5 bg-brand-black text-white font-bold rounded-2xl hover:bg-gray-800 transition-all shadow-xl shadow-gray-200 active:scale-[0.97] disabled:opacity-50 text-lg"
            >
              {loading ? "Verificando..." : "Confirmar y Crear Cuenta"}
            </button>
          </form>

          <div className="mt-10 pt-6 border-t border-gray-100 space-y-4">
            <button
              onClick={handleResendCode}
              disabled={loading || timeLeft > 240}
              className="text-amber-600 hover:text-amber-700 font-bold text-sm disabled:opacity-30 block w-full transition-colors"
            >
              {loading ? "Enviando..." : "¿No recibiste el código? Reenviar"}
            </button>
            <button
              onClick={handleBackToLogin}
              className="text-gray-400 hover:text-gray-500 text-sm flex items-center justify-center gap-1 mx-auto font-medium"
            >
              <ArrowLeft className="w-4 h-4" /> Cancelar registro
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Pantallas de Login / Registro ─────────────────────────
  return (
    <div className="flex items-center justify-center min-h-screen bg-brand-cream px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md border border-amber-200">

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

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center mb-6 font-medium">
            {error}
          </div>
        )}

        {step === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setResetStatus("idle"); }}
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400/50 transition-all placeholder-gray-400"
              />
            </div>

            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400/50 transition-all placeholder-gray-400"
                />
              </div>

              <div className="flex items-center justify-between px-1">
                {resetStatus === "sent" ? (
                  <p className="text-xs text-green-600 font-medium">✅ Revisa tu bandeja de entrada</p>
                ) : (
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    disabled={resetLoading}
                    className="text-xs text-amber-500 hover:text-amber-600 hover:underline transition-colors disabled:opacity-50"
                  >
                    {resetLoading ? "Enviando..." : "¿Has olvidado tu contraseña?"}
                  </button>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-amber-400 to-amber-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? "Cargando..." : "Iniciar sesión"}
              <ArrowRight className="w-5 h-5" />
            </button>

            <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
              <span className="relative bg-white px-4 text-xs text-gray-400 uppercase tracking-widest">o continúa con</span>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full py-3 border border-gray-200 bg-white text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-all flex items-center justify-center shadow-sm"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 488 512" fill="currentColor">
                <path d="M488 261.8c0-17.7-1.5-34.9-4.3-51.4H249v97.4h134.7c-5.8 31.3-23.6 57.8-50.3 75.5v62.8h81.2c47.5-43.8 74.6-108.2 74.6-184.3zM249 492c66.5 0 122.3-21.9 163-59.3l-81.2-62.8c-22.6 15.1-51.5 24-81.8 24-62.9 0-116.2-42.4-135.3-99.3H30.1v62.4C70.9 437 153.5 492 249 492zM113.7 293.3c-4.3-12.7-6.8-26.2-6.8-40s2.5-27.3 6.8-40V150.9H30.1c-18.7 37.5-29.5 79.6-29.5 122.3s10.8 84.8 29.5 122.3l83.6-62.2zM249 97.9c34.1 0 64.8 11.7 88.9 34.6l66.7-66.7C371.3 27.1 315.5 5.2 249 5.2 153.5 5.2 70.9 60.1 30.1 150.9l83.6 62.4c19-56.8 72.4-99.3 135.3-99.3z" />
              </svg>
              Google
            </button>

            <p className="mt-8 text-center text-gray-500 text-sm">
              ¿No tienes cuenta?{" "}
              <button
                type="button"
                onClick={() => { setStep('register_email'); setError(""); }}
                className="text-amber-500 hover:text-amber-600 font-bold ml-1"
              >
                Registrarse
              </button>
            </p>
          </form>
        )}

        {step === 'register_email' && (
          <form onSubmit={handleRegisterNext} className="space-y-6">
            <h2 className="text-xl font-serif font-bold text-gray-800">Crea tu cuenta</h2>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                placeholder="Introduce tu correo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400/50 transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 transition-all flex items-center justify-center gap-2"
            >
              Continuar
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={handleBackToLogin}
              className="w-full text-center text-gray-400 text-sm hover:underline"
            >
              Volver al inicio
            </button>
          </form>
        )}

        {step === 'register_password' && (
          <form onSubmit={handleStartVerification} className="space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <button
                type="button"
                onClick={() => setStep('register_email')}
                className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-serif font-bold text-gray-800">Elige contraseña</h2>
            </div>

            <div className="space-y-4">
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-400/50"
              />
              <input
                type="password"
                placeholder="Confirma la contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-400/50"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 transition-all shadow-lg shadow-amber-100 disabled:opacity-50"
            >
              {loading ? "Enviando código..." : "Registrarse con código"}
            </button>
          </form>
        )}

      </div>
    </div>
  );
};

export default AuthForm;
