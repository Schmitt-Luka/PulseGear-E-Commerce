"use client";

import { useCart } from "@/Context/CartContext";
import { useUser } from "@/Context/UserContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function CartPage() {
  const { cart, removeFromCart, clearCart } = useCart();
  const { user, ownedProductIds, refreshOrders } = useUser();
  const router = useRouter();

  const subtotal =
    cart?.reduce((acc, item) => acc + Number(item.price), 0) || 0;
  const iva = subtotal * 0.21;
  const digitalTax = subtotal * 0.1;
  const total = subtotal + iva + digitalTax;

  const handleCheckout = async () => {
    if (!user?.token) {
      toast.error("Debes iniciar sesión para finalizar la compra 🛡️");
      return router.push("/login");
    }

    try {
      const response = await fetch("http://localhost:3000/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: user.token,
        },
        body: JSON.stringify({ products: cart.map((p) => p.id) }),
      });

      if (!response.ok)
        throw new Error("Fallo en la sincronización con el servidor");

      const hasDuplicates = cart.some((item) =>
        ownedProductIds.includes(item.id),
      );

      toast.success("TRANSACCIÓN COMPLETADA", {
        description: hasDuplicates
          ? "Los juegos extra han sido enviados a tu Pulse Vault."
          : "Los juegos se han añadido a tu biblioteca personal.",
      });

      await refreshOrders();
      clearCart();
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(`Error de Sistema: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-pg-bg text-white p-6 md:p-10 lg:p-20 relative">
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-pg-accent/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="container mx-auto relative z-10">
        <header className="mb-16">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-6xl font-black mb-4 tracking-tighter uppercase italic leading-none"
          >
            Tu <span className="text-pg-accent">Carrito</span>
          </motion.h1>
          <div className="h-1 w-24 bg-pg-accent" />
        </header>

        {cart.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-pg-card p-20 rounded-[3.5rem] text-center border border-dashed border-white/10"
          >
            <p className="text-gray-500 text-2xl mb-8 font-bold italic uppercase tracking-widest">
              Carrito Vacío
            </p>
            <Link
              href="/home"
              className="inline-block bg-pg-accent px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-orange-600 transition-all shadow-lg shadow-pg-accent/20 active:scale-95"
            >
              VOLVER AL CATÁLOGO
            </Link>
          </motion.div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="lg:w-2/3 space-y-5">
              {cart.map((item, index) => {
                const isOwned = ownedProductIds.includes(item.id);
                return (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    key={`${item.id}-${index}`}
                    className={`bg-pg-card p-7 rounded-[2.5rem] flex flex-col sm:flex-row justify-between items-center border transition-all duration-500 group ${
                      isOwned
                        ? "border-pg-accent/30 bg-pg-accent/2"
                        : "border-white/5 hover:border-white/10"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row items-center gap-8 w-full">
                      <div className="relative w-32 h-32 shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover rounded-3xl shadow-2xl"
                        />
                        {isOwned && (
                          <div className="absolute inset-0 bg-pg-accent/10 rounded-3xl border border-pg-accent/50" />
                        )}
                      </div>
                      <div className="text-center sm:text-left grow">
                        <div className="flex flex-col gap-2">
                          <h3 className="text-3xl font-black uppercase italic tracking-tighter leading-none">
                            {item.name}
                          </h3>
                          {isOwned && (
                            <div className="flex items-center gap-2 justify-center sm:justify-start">
                              <span className="text-[9px] font-black text-pg-accent uppercase bg-pg-accent/10 px-3 py-1 rounded-full border border-pg-accent/20 tracking-widest">
                                Juego de Regalo (Pulse Vault)
                              </span>
                            </div>
                          )}
                        </div>
                        <p className="text-pg-accent font-black text-2xl mt-4 italic">
                          ${Number(item.price).toFixed(2)}
                        </p>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="sm:ml-auto p-4 text-red-500/40 hover:text-red-500 transition-colors uppercase font-black text-[10px] tracking-[0.2em] italic border border-transparent hover:border-red-500/20 rounded-2xl"
                      >
                        Quitar
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="lg:w-1/3">
              <aside className="bg-pg-card p-10 rounded-[3rem] border border-white/5 sticky top-28 shadow-2xl overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-pg-accent to-transparent opacity-30" />

                <h2 className="text-2xl font-black mb-10 border-b border-white/5 pb-6 uppercase tracking-tighter italic">
                  Resumen de <span className="text-pg-accent">Compra</span>
                </h2>

                <div className="space-y-6 mb-12">
                  <div className="flex justify-between items-center text-gray-500 font-bold uppercase text-[11px] tracking-widest italic">
                    <span>Subtotal</span>
                    <span className="text-white text-sm">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-gray-500 font-bold uppercase text-[11px] tracking-widest italic">
                    <span>IVA (21%)</span>
                    <span className="text-white text-sm">
                      ${iva.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-gray-500 font-bold uppercase text-[11px] tracking-widest italic">
                    <span>Imp. Digitales (10%)</span>
                    <span className="text-white text-sm">
                      ${digitalTax.toFixed(2)}
                    </span>
                  </div>

                  <div className="pt-6 border-t border-white/5 flex justify-between items-end">
                    <span className="text-xs font-black uppercase tracking-[0.3em] italic text-pg-accent">
                      Total Final
                    </span>
                    <span className="text-5xl font-black text-white tracking-tighter">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-pg-accent text-white py-7 rounded-[1.8rem] font-black text-xl uppercase italic tracking-widest hover:bg-white hover:text-black hover:scale-[1.02] transition-all duration-300 shadow-xl shadow-pg-accent/10 active:scale-95"
                >
                  PAGAR AHORA
                </button>

                <p className="mt-8 text-center text-[9px] text-gray-600 font-bold uppercase tracking-[0.2em] italic">
                  Transacción segura garantizada por PulseGear. Al pagar,
                  aceptas los Términos de Servicio.
                </p>
              </aside>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
