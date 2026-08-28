"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/Context/UserContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

type TabId = "biblioteca" | "vault" | "perfil" | "config";

interface NavTab {
  id: TabId;
  label: string;
  extra?: number;
}

export default function DashboardPage() {
  const { user, login, logout, allOwnedProducts } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabId>("biblioteca");

  const [editData, setEditData] = useState({
    name: user?.userData.name || "",
    email: user?.userData.email || "",
    address: user?.userData.address || "",
    phone: user?.userData.phone || "",
  });

  const [currentTheme, setCurrentTheme] = useState("default");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const themes = [
    { id: "default", name: "Electric Blue", color: "#2563eb" },
    { id: "copper-steam", name: "Pulse Copper", color: "#ff4b1f" },
    { id: "emerald-alchemist", name: "Emerald Green", color: "#00ff88" },
    { id: "victorian-velvet", name: "Victorian Gold", color: "#bf953f" },
  ];

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("user-theme") || "default";
      setCurrentTheme(savedTheme);
    }

    if (!user?.token) {
      router.push("/login");
      return;
    }
    setLoading(false);
  }, [user, router]);

  useEffect(() => {
    if (user) {
      setEditData({
        name: user.userData.name || "",
        email: user.userData.email || "",
        address: user.userData.address || "",
        phone: user.userData.phone || "",
      });
    }
  }, [user]);

  const uniqueGamesMap = new Map();
  allOwnedProducts.forEach((game) => {
    if (!uniqueGamesMap.has(game.id)) {
      uniqueGamesMap.set(game.id, game);
    }
  });
  const uniqueGames = Array.from(uniqueGamesMap.values());

  const vaultItems = allOwnedProducts.filter(
    (game, index, self) => self.findIndex((g) => g.id === game.id) !== index,
  );

  const navigationTabs: NavTab[] = [
    { id: "biblioteca", label: "Biblioteca Personal" },
    { id: "vault", label: "Bóveda de Juegos", extra: vaultItems.length },
    { id: "perfil", label: "Mi Perfil" },
    { id: "config", label: "Ajustes de Sistema" },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = () => {
    if (!user) return;
    login({ ...user, userData: { ...user.userData, ...editData } });
    toast.success("¡Perfil actualizado con éxito!");
  };

  const changeTheme = (themeId: string) => {
    const selectedTheme = themes.find((t) => t.id === themeId);
    setCurrentTheme(themeId);
    document.documentElement.setAttribute("data-theme", themeId);
    localStorage.setItem("user-theme", themeId);
    toast.info(
      `Tema cambiado a: ${selectedTheme ? selectedTheme.name : themeId}`,
    );
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-pg-bg flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="rounded-full h-12 w-12 border-t-2 border-pg-accent"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pg-bg text-white p-6 md:p-10 lg:p-20 relative">
      <div className="container mx-auto relative z-10">
        <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl font-black uppercase italic tracking-tighter leading-none"
            >
              Panel de <span className="text-pg-accent">Control</span>
            </motion.h1>
            <p className="text-gray-500 font-bold mt-4 uppercase tracking-[0.3em] text-[10px]">
              Usuario: {(user?.userData as any)?.id || "0000"} //{" "}
              {user?.userData.email}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="text-[10px] w-fit font-black uppercase tracking-widest text-red-500 border border-red-500/20 px-6 py-3 rounded-xl hover:bg-red-500 hover:text-white transition-all active:scale-95"
          >
            Cerrar Sesión
          </button>
        </header>

        <div className="flex flex-col lg:flex-row gap-10 items-start">
          <nav className="lg:w-1/4 w-full flex flex-col gap-3">
            {navigationTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative p-6 rounded-3xl font-black uppercase italic text-sm tracking-widest transition-all text-left overflow-hidden group ${
                  activeTab === tab.id
                    ? "text-white"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTabBackground"
                    className="absolute inset-0 bg-pg-accent"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex justify-between items-center">
                  {tab.label}
                  {tab.id === "vault" && (tab.extra ?? 0) > 0 && (
                    <span className="bg-black/30 text-white text-[10px] px-3 py-1 rounded-full font-black border border-white/10">
                      {tab.extra}
                    </span>
                  )}
                </span>
              </button>
            ))}
          </nav>

          <main className="lg:w-3/4 w-full bg-pg-card rounded-[3.5rem] border border-white/5 p-8 md:p-12 shadow-2xl min-h-175">
            <AnimatePresence mode="wait">
              {activeTab === "biblioteca" && (
                <motion.div
                  key="biblioteca"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-10"
                >
                  <h2 className="text-4xl font-black uppercase italic tracking-tighter">
                    Mi <span className="text-pg-accent">Colección</span>
                  </h2>
                  <h2 className="text-4xl font-black uppercase italic tracking-tighter">
                    Rango de jugador<span className="text-pg-accent">:</span>
                  </h2>
                  {uniqueGames.length < 1 && (
                    <div className="py-28 text-center opacity-20 italic font-black uppercase tracking-[0.4em] text-xs">
                      Jugador lvl 1 - Sin juegos en la biblioteca
                    </div>
                  )}
                  {uniqueGames.length >= 1 && (
                    <div className="py-28 text-center opacity-20 italic font-black uppercase tracking-[0.4em] text-xs">
                      Jugador lvl 2 - Algunos juegos en la biblioteca
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {uniqueGames.length > 0 ? (
                      uniqueGames.map((game, index) => (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.05 }}
                          key={game.id}
                          className="group relative h-72 rounded-[2.5rem] overflow-hidden border border-white/5 hover:border-pg-accent/30 transition-all duration-500"
                        >
                          <img
                            src={game.image}
                            alt={game.name}
                            className="w-full h-full object-cover opacity-30 group-hover:scale-105 group-hover:opacity-60 transition-all duration-700"
                          />
                          <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent" />
                          <div className="absolute bottom-0 p-8 w-full z-10">
                            <h3 className="text-2xl font-black uppercase italic mb-4">
                              {game.name}
                            </h3>
                            <button className="bg-white text-black text-[10px] font-black px-8 py-3 rounded-xl uppercase tracking-widest hover:bg-pg-accent hover:text-white transition-all">
                              Instalar
                            </button>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="col-span-full py-28 text-center border-2 border-dashed border-white/5 rounded-[3.5rem]">
                        <p className="text-gray-600 font-black uppercase italic tracking-widest text-xs">
                          No se han detectado licencias activas
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === "vault" && (
                <motion.div
                  key="vault"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <h2 className="text-4xl font-black uppercase italic tracking-tighter mb-4">
                    Bóveda de <span className="text-pg-accent">Reserva</span>
                  </h2>
                  <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] mb-12 italic">
                    Activos digitales duplicados listos para transferencia
                  </p>
                  <div className="grid grid-cols-1 gap-4">
                    {vaultItems.length > 0 ? (
                      vaultItems.map((game, i) => (
                        <div
                          key={`${game.id}-vault-${i}`}
                          className="bg-white/5 border border-white/5 p-6 rounded-3xl flex items-center justify-between group hover:border-pg-accent/30 transition-all"
                        >
                          <div className="flex items-center gap-6">
                            <img
                              src={game.image}
                              className="w-16 h-16 rounded-2xl object-cover grayscale group-hover:grayscale-0 transition-all"
                              alt={game.name}
                            />
                            <div>
                              <h4 className="font-black uppercase italic tracking-wider text-lg">
                                {game.name}
                              </h4>
                              <p className="text-pg-accent text-[9px] font-black uppercase tracking-widest">
                                Licencia Transferible
                              </p>
                            </div>
                          </div>
                          <button className="text-[10px] font-black uppercase tracking-widest bg-white/5 border border-white/10 px-6 py-3 rounded-xl hover:bg-white hover:text-black transition-all active:scale-95">
                            Regalar
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="py-28 text-center opacity-20 italic font-black uppercase tracking-[0.4em] text-xs">
                        Inventario de reserva vacío
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === "perfil" && (
                <motion.div
                  key="perfil"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <h2 className="text-4xl font-black uppercase italic mb-12 tracking-tighter border-b border-white/5 pb-6">
                    Datos del <span className="text-pg-accent">Operador</span>
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    {[
                      { label: "Nombre Público", name: "name" },
                      { label: "Correo Electrónico", name: "email" },
                      { label: "Dirección de Envío", name: "address" },
                      { label: "Teléfono de Contacto", name: "phone" },
                    ].map((field) => (
                      <div key={field.name} className="flex flex-col gap-2.5">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-2 italic">
                          {field.label}
                        </label>
                        <input
                          type={field.name === "email" ? "email" : "text"}
                          name={field.name}
                          value={(editData as any)[field.name]}
                          onChange={handleInputChange}
                          className="bg-black/50 border border-white/5 p-6 rounded-2xl text-white outline-none focus:border-pg-accent/40 transition-all font-bold"
                        />
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={handleUpdateProfile}
                    className="mt-14 bg-pg-accent text-white px-12 py-5 rounded-2xl font-black uppercase italic tracking-widest transition-all active:scale-95 shadow-[0_10px_30px_rgba(37,99,235,0.3)]"
                  >
                    Actualizar Perfil
                  </button>
                </motion.div>
              )}

              {activeTab === "config" && (
                <motion.div
                  key="config"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-12"
                >
                  <h2 className="text-4xl font-black uppercase italic tracking-tighter border-b border-white/5 pb-6">
                    Ajustes de <span className="text-pg-accent">Sistema</span>
                  </h2>

                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-6 italic">
                      Tema Cromático
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {themes.map((theme) => (
                        <button
                          key={theme.id}
                          onClick={() => changeTheme(theme.id)}
                          className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 ${
                            currentTheme === theme.id
                              ? "border-pg-accent bg-pg-accent/5"
                              : "border-white/5 hover:border-white/20"
                          }`}
                        >
                          <div
                            className="w-8 h-8 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                            style={{ backgroundColor: theme.color }}
                          />
                          <span className="text-[10px] font-black uppercase italic tracking-widest">
                            {theme.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-10 bg-white/5 rounded-[2.5rem] border border-white/5">
                    <div>
                      <h4 className="font-black uppercase italic tracking-widest text-lg">
                        Alertas de Notificación
                      </h4>
                      <p className="text-[10px] text-gray-500 font-bold uppercase mt-1 tracking-wider">
                        Servicio de avisos de red activo
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        setNotificationsEnabled(!notificationsEnabled)
                      }
                      className={`w-16 h-8 rounded-full relative transition-all duration-300 ${notificationsEnabled ? "bg-pg-accent" : "bg-gray-800"}`}
                    >
                      <motion.div
                        animate={{ x: notificationsEnabled ? 32 : 4 }}
                        className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg"
                      />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}
