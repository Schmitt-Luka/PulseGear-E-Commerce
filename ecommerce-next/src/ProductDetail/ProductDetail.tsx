import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCart } from "../Context/CartContext";
import { useUser } from "../Context/UserContext";
import type { Product } from "../Types";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export const ProductDetail = () => {
  const { id } = useParams() as { id: string };
  const navigate = useRouter();
  const { addToCart } = useCart();
  const { user } = useUser();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    setIsLoading(true);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

    fetch(`${API_URL}/products`)
      .then((res) => {
        if (!res.ok) throw new Error("Error al conectar con el servidor");
        return res.json();
      })
      .then((data) => {
        const foundProduct = data.find(
          (p: Product) => p.id.toString() === id.toString(),
        );

        if (foundProduct) {
          setProduct(foundProduct);
        } else {
          toast.error("Producto no encontrado");
          navigate.push("/home");
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error:", err);
        toast.error("No se pudo cargar la información del producto");
        setIsLoading(false);
      });
  }, [id, navigate]);

  const handleAddToCart = () => {
    if (!user) {
      toast.error("Debes iniciar sesión para comprar", {
        action: {
          label: "Ir al Login",
          onClick: () => navigate.push("/login"),
        },
      });
      return;
    }

    if (product) {
      addToCart(product);
      toast.success(`${product.name} añadido correctamente`, {
        description: "¿Quieres finalizar tu compra?",
        action: {
          label: "Ver Carrito",
          onClick: () => navigate.push("/cart"),
        },
      });
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="min-h-screen bg-pg-bg flex items-center justify-center p-10"
        >
          <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="h-125 bg-white/5 animate-pulse rounded-[3rem]" />
            <div className="space-y-6">
              <div className="h-4 w-24 bg-white/10 animate-pulse rounded-full" />
              <div className="h-16 w-full bg-white/10 animate-pulse rounded-2xl" />
              <div className="h-32 w-full bg-white/5 animate-pulse rounded-2xl" />
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="product-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="min-h-screen bg-pg-bg text-white pb-20 overflow-x-hidden"
        >
          <div className="relative h-[65vh] w-full overflow-hidden">
            <motion.img
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.2 }}
              transition={{ duration: 2 }}
              src={product?.image}
              className="w-full h-full object-cover blur-3xl"
              alt="bg"
            />
            <div className="absolute inset-0 bg-linear-to-t from-pg-bg via-pg-bg/80 to-transparent" />
          </div>

          <div className="container mx-auto px-6 relative z-30 mt-[-60vh]">
            <motion.button
              initial={{ x: -20, opacity: 0 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ x: -5 }}
              onClick={() => navigate.push("/home")}
              className="mb-12 flex items-center gap-2 text-gray-400 hover:text-pg-accent transition-colors font-black uppercase text-[10px] tracking-widest"
            >
              ← Volver al catálogo
            </motion.button>
          </div>

          <div className="container mx-auto px-6 relative z-10">
            <div className="flex flex-col lg:flex-row gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, y: 100, scale: 0.9, rotateY: -10 }}
                animate={{ opacity: 1, y: 0, scale: 1, rotateY: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 120,
                  damping: 20,
                  mass: 1.8,
                }}
                className="lg:w-2/3 perspective-1000"
              >
                <div className="relative rounded-[3.5rem] overflow-hidden border border-white/10 shadow-2xl group">
                  <motion.img
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    src={product?.image}
                    alt={product?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>

              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.1, delayChildren: 0.4 },
                  },
                }}
                className="lg:w-1/3 flex flex-col"
              >
                <motion.span
                  variants={{
                    hidden: { opacity: 0, x: 20 },
                    visible: { opacity: 1, x: 0 },
                  }}
                  className="text-amber-400 font-black tracking-widest uppercase text-xs mb-4 block"
                >
                  {(() => {
                    const categoryMap: { [key: number]: string } = {
                      1: "RPG",
                      2: "Estrategia",
                      3: "Acción",
                      4: "Indie",
                      5: "Simulación",
                      6: "Aventura",
                      7: "Terror",
                      8: "Deportes",
                      9: "Multijugador",
                    };

                    return product?.categoryId
                      ? categoryMap[product.categoryId] || "Videojuego"
                      : "Videojuego";
                  })()}
                </motion.span>
                <motion.h1
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  className="text-6xl font-black mb-8 leading-tight uppercase italic tracking-tighter"
                >
                  {product?.name}
                </motion.h1>

                <motion.p
                  variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
                  className="text-gray-400 text-lg leading-relaxed mb-10"
                >
                  {product?.description}
                </motion.p>

                <motion.div
                  variants={{
                    hidden: { opacity: 0, scale: 0.8 },
                    visible: { opacity: 1, scale: 1 },
                  }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="bg-white/5 backdrop-blur-md p-8 rounded-[3rem] border border-white/10 shadow-2xl relative group/btn"
                >
                  <div className="flex items-baseline gap-2 mb-8">
                    <span
                      className={`text-5xl font-black italic transition-opacity duration-500 ${!user ? "opacity-20" : ""}`}
                    >
                      ${product?.price}
                    </span>
                  </div>

                  <motion.button
                    whileHover={user ? { scale: 1.02 } : {}}
                    whileTap={user ? { scale: 0.95 } : {}}
                    onClick={handleAddToCart}
                    className={`w-full py-6 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-lg ${
                      user
                        ? "bg-pg-accent text-white"
                        : "bg-white/10 text-gray-500 cursor-not-allowed opacity-50 grayscale"
                    }`}
                  >
                    {user ? "Añadir al carrito" : "Inicia sesión para comprar"}
                  </motion.button>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
