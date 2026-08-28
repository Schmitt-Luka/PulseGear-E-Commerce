"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useUser } from "@/Context/UserContext";
import { toast } from "sonner";
import Image from "next/image";
import logo from "@/assets/PulseGearLogo.svg";

export default function LandingPage() {
  const router = useRouter();
  const { user } = useUser();

  const handleAdminClick = () => {
    if (!user?.token) {
      toast.error("ACCESO RESTRINGIDO", {
        description: "Debes iniciar sesión para gestionar tu cuenta.",
      });
      router.push("/login");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-pg-bg text-white overflow-hidden relative">
      <motion.div
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.1, 0.25, 0.1],
        }}
        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
        className="absolute inset-0 bg-[#4a0000] blur-[150px] rounded-full pointer-events-none opacity-40"
      />

      <section className="relative h-screen flex flex-col items-center justify-center text-center p-6 z-10">
        <motion.div
          initial={{ scale: 0, rotate: -180, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 15,
            duration: 1.2,
          }}
          className="relative mb-8"
        >
          <div className="absolute inset-0 bg-pg-accent blur-[80px] rounded-full opacity-20" />

          <Image
            src={logo}
            alt="PulseGear Central Logo"
            width={256}
            height={256}
            priority
            className="w-48 h-48 md:w-64 md:h-64 relative z-10 filter drop-shadow-[0_0_40px_var(--color-pg-accent)]"
          />
        </motion.div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <h1 className="text-6xl md:text-8xl font-black mb-4 uppercase italic tracking-tighter leading-none">
            PULSE<span className="text-pg-accent">GEAR</span>
          </h1>
          <p className="text-gray-400 text-sm md:text-base font-bold uppercase tracking-[0.6em] mb-12 max-w-2xl mx-auto italic">
            Infraestructura Gaming de Vanguardia
          </p>

          <div className="flex flex-wrap justify-center gap-6">
            <button
              onClick={() => router.push("/home")}
              className="bg-white text-black px-10 py-4 rounded-2xl font-black text-lg uppercase italic tracking-widest hover:bg-pg-accent hover:text-white transition-all shadow-[0_20px_50_rgba(255,255,255,0.1)] hover:scale-105 active:scale-95"
            >
              Ver Catálogo
            </button>

            <button
              onClick={handleAdminClick}
              className="border border-white/10 bg-white/5 backdrop-blur-sm text-white px-10 py-4 rounded-2xl font-black text-lg uppercase italic tracking-widest hover:bg-white/10 transition-all hover:border-pg-accent/50"
            >
              Panel Admin
            </button>
          </div>
        </motion.div>
      </section>

      <section className="container mx-auto px-10 py-32 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            {
              title: "Catálogo Épico",
              desc: "Acceso instantáneo a diversos títulos optimizados.",
              icon: "01",
            },
            {
              title: "Gestión Total",
              desc: "Control total, desde la biblioteca hasta preferencias.",
              icon: "02",
            },
            {
              title: "Atencion de Élite",
              desc: "Soporte 24/7 para tus necesidades.",
              icon: "03",
            },
          ].map((feature, i) => (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              key={i}
              className="group bg-pg-card p-10 rounded-[2.5rem] border border-white/5 hover:border-pg-accent/30 transition-all relative overflow-hidden"
            >
              <span className="absolute top-6 right-8 text-5xl font-black text-white/5 italic group-hover:text-pg-accent/10 transition-colors">
                {feature.icon}
              </span>
              <h3 className="text-2xl font-black mb-4 uppercase italic tracking-tighter">
                {feature.title}
              </h3>
              <p className="text-gray-500 font-bold leading-relaxed uppercase text-[11px] tracking-widest">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      <footer className="border-t border-white/5 py-12 text-center">
        <p className="text-gray-600 font-black uppercase tracking-[0.4em] text-[10px]">
          © 2026 PulseGear // TODOS LOS DERECHOS RESERVADOS
        </p>
      </footer>
    </div>
  );
}
