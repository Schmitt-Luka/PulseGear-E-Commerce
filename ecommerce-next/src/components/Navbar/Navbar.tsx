"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@/Context/UserContext";
import { useCart } from "@/Context/CartContext";
import logo from "@/assets/PulseGearLogo.svg";

export const Navbar = () => {
  const { user, logout } = useUser();
  const { cart } = useCart();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <nav className="sticky top-0 z-100 bg-pg-card/90 backdrop-blur-md h-20 border-b border-white/5 flex justify-between items-center px-12 shadow-2xl">
      <Link href="/" className="flex items-center gap-4 group">
        <div className="relative">
          <div className="w-10 h-10 relative transition-all duration-500 group-hover:scale-110 group-hover:rotate-12">
            <Image
              src={logo}
              alt="PulseGear Logo"
              fill
              className="object-contain filter drop-shadow-[0_0_8px_var(--color-pg-accent)]"
              priority
            />
          </div>
          <div
            className="absolute inset-0 blur-2xl rounded-full opacity-0 group-hover:opacity-40 transition-opacity duration-500"
            style={{ backgroundColor: "var(--color-pg-accent)" }}
          />
        </div>
        <div className="flex flex-col">
          <span className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none">
            PULSE<span className="text-pg-accent">GEAR</span>
          </span>
          <span className="text-[7px] font-bold text-gray-500 uppercase tracking-[0.5em] leading-none mt-1">
            LO MEJOR PARA LOS MEJORES
          </span>
        </div>
      </Link>
      <div className="flex items-center gap-8">
        <div className="hidden md:flex items-center gap-6 border-r border-white/10 pr-8">
          <Link
            href="/home"
            className={`font-bold text-sm uppercase tracking-widest transition-colors ${
              pathname === "/home"
                ? "text-pg-accent"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Catálogo
          </Link>

          <div className="relative group">
            <Link
              href={user?.token ? "/cart" : "#"}
              onClick={(e) => !user?.token && e.preventDefault()}
              className={`relative transition-all duration-500 flex items-center ${
                !user?.token
                  ? "opacity-30 grayscale cursor-not-allowed"
                  : "group"
              }`}
            >
              <span
                className={`font-bold text-sm uppercase tracking-widest transition-colors ${
                  user?.token
                    ? "text-gray-400 group-hover:text-pg-accent"
                    : "text-gray-600"
                }`}
              >
                Carrito
              </span>
              {user?.token && cart.length > 0 && (
                <span className="absolute -top-3 -right-4 bg-pg-accent text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-pg-card animate-pulse">
                  {cart.length}
                </span>
              )}
            </Link>

            {!user?.token && (
              <div className="absolute top-10 left-1/2 -translate-x-1/2 w-40 bg-black border border-white/10 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-2xl">
                <p className="text-[8px] text-white font-black uppercase text-center tracking-tighter">
                  Inicia sesión para acceder a tu{" "}
                  <span className="text-pg-accent italic">Carrito</span>
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-6">
          {user?.token ? (
            <div className="flex items-center gap-6">
              <div className="flex flex-col items-end">
                <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest leading-none mb-1">
                  Hola de nuevo!
                </span>
                <span className="text-pg-accent font-bold text-sm italic leading-none">
                  {user.userData?.name?.split(" ")[0] || "OPERADOR"}
                </span>
              </div>
              <Link
                href="/dashboard"
                className="bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-xl text-xs font-bold border border-white/10 uppercase tracking-tighter transition-all"
              >
                Panel de Control
              </Link>
              <button
                onClick={handleLogout}
                className="text-red-500 hover:text-white border border-red-500/20 px-3 py-2 rounded-xl text-[10px] font-black uppercase transition-all hover:bg-red-500/10"
              >
                Cerrar Sesión
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-gray-400 hover:text-white font-bold text-sm uppercase tracking-widest transition-colors"
              >
                Ingresar
              </Link>
              <Link
                href="/register"
                className="bg-pg-accent text-white px-6 py-2.5 rounded-xl font-black text-sm uppercase italic tracking-widest shadow-lg shadow-orange-500/20 hover:scale-105 active:scale-95 transition-all"
              >
                Unirse
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
