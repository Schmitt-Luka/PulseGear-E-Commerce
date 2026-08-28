"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    phone: "",
  });
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3001/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("REGISTRO COMPLETADO", {
          description:
            "Tu cuenta ha sido creada con éxito en la red PulseGear.",
        });
        router.push("/login");
      } else {
        toast.error("FALLO EN EL REGISTRO", {
          description: data.message || "No se pudo procesar la solicitud.",
        });
      }
    } catch (error) {
      toast.error("ERROR DE ENLACE", {
        description: "El servidor central no responde. Verifica la conexión.",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-pg-accent/5 blur-[120px] rounded-full -z-10" />

      <div className="w-full max-w-lg bg-pg-card border border-white/5 p-12 rounded-[3rem] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <span className="text-4xl font-black italic tracking-tighter uppercase text-white">
            Bienvenido
          </span>
        </div>

        <header className="mb-10">
          <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-none">
            Crear <span className="text-pg-accent">Cuenta</span>
          </h2>
          <p className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.3em] mt-3 italic">
            Sumate a esta nueva era de comercio digital en la red PulseGear
          </p>
        </header>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5">
          <div className="space-y-2">
            <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest block ml-1">
              Nombre Completo
            </label>
            <input
              type="text"
              name="name"
              onChange={handleChange}
              className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-pg-accent/50 transition-all placeholder:text-gray-800"
              placeholder="Ej: John Doe"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest block ml-1">
              Correo Electrónico
            </label>
            <input
              type="email"
              name="email"
              onChange={handleChange}
              className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-pg-accent/50 transition-all placeholder:text-gray-800"
              placeholder="tu@email.com"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest block ml-1">
                Dirección
              </label>
              <input
                type="text"
                name="address"
                onChange={handleChange}
                className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-pg-accent/50 transition-all placeholder:text-gray-800"
                placeholder="Ej: Calle Falsa 123"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest block ml-1">
                Teléfono de Contacto
              </label>
              <input
                type="text"
                name="phone"
                onChange={handleChange}
                className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-pg-accent/50 transition-all placeholder:text-gray-800"
                placeholder="Ej: 123456789"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest block ml-1">
              Contraseña
            </label>
            <input
              type="password"
              name="password"
              onChange={handleChange}
              className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-pg-accent/50 transition-all placeholder:text-gray-800"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-pg-accent hover:bg-orange-600 text-white py-6 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] transition-all shadow-xl shadow-pg-accent/10 active:scale-[0.98] mt-6"
          >
            Confirmar Registro
          </button>
        </form>

        <p className="mt-10 text-center text-[10px] text-gray-600 font-bold uppercase tracking-widest">
          ¿Ya tenes un usuario?{" "}
          <button
            onClick={() => router.push("/login")}
            className="text-pg-accent hover:underline ml-1"
          >
            Iniciá Sesión AHORA
          </button>
        </p>
      </div>
    </div>
  );
}
