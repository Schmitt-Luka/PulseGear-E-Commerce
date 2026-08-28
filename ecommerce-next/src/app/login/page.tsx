"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/Context/UserContext";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useUser();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3001/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        login({
          token: data.token,
          userData: data.user,
        });

        toast.success("ACCESO CONCEDIDO", {
          description: `Bienvenido de nuevo, ${data.user.name || "Operador"}.`,
        });

        router.push("/home");
      } else {
        toast.error("ERROR DE AUTENTICACIÓN", {
          description:
            data.message || "Credenciales no válidas en la base de datos.",
        });
      }
    } catch (error) {
      toast.error("FALLO DE CONEXIÓN", {
        description: "No se pudo establecer contacto con el servidor central.",
      });
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-6 relative">
      <div className="absolute w-96 h-96 bg-pg-accent/5 blur-[120px] rounded-full -z-10" />

      <div className="w-full max-w-md bg-pg-card border border-white/5 p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-pg-accent/50 to-transparent" />

        <div className="mb-8">
          <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none">
            Iniciar <span className="text-pg-accent">Sesión</span>
          </h2>
          <p className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.3em] mt-2 italic">
            Ingreso a la Red PulseGear
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block ml-1">
              Identificador de Usuario (Email)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-pg-accent/50 transition-all font-medium placeholder:text-gray-800"
              placeholder="nombre@ejemplo.com"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block ml-1">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-pg-accent/50 transition-all font-medium placeholder:text-gray-800"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-pg-accent hover:bg-orange-600 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-lg shadow-pg-accent/20 active:scale-[0.98] mt-4"
          >
            Iniciar Sesión
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
            ¿No tenes cuenta?{" "}
            <button
              onClick={() => router.push("/register")}
              className="text-pg-accent hover:underline ml-1"
            >
              Registrate
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
