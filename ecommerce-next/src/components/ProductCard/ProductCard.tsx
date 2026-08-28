import type { Product } from "../../Types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "../../Context/CartContext";
import { useUser } from "../../Context/UserContext";
import { toast } from "sonner";

export const ProductCard = ({ product }: { product: Product }) => {
  const { addToCart } = useCart();
  const { user, ownedProductIds } = useUser();
  const navigate = useRouter();

  const isOwned = ownedProductIds.includes(product.id);

  const handleQuickAdd = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!user) {
      toast.error("Acceso restringido", {
        description: "Debes iniciar sesión para añadir productos al carrito.",
      });
      navigate.push("/login");
      return;
    }

    addToCart(product);

    if (isOwned) {
      toast.info("Copia adicional añadida", {
        description: `Ya posees ${product.name}. Se ha añadido como licencia de regalo al carrito.`,
        action: {
          label: "VER CARRITO",
          onClick: () => navigate.push("/cart"),
        },
      });
    } else {
      toast.success(`${product.name} añadido`, {
        description: "El título se encuentra en tu carrito.",
        action: {
          label: "VER CARRITO",
          onClick: () => navigate.push("/cart"),
        },
      });
    }
  };

  return (
    <Link href={`/product/${product.id}`} className="group relative">
      <div
        className={`bg-[#1a1a1a] rounded-2xl overflow-hidden border transition-all duration-300 shadow-xl ${
          isOwned
            ? "border-pg-accent/30 shadow-pg-accent/5"
            : "border-white/5 hover:border-pg-accent/50"
        }`}
      >
        <div className="relative aspect-video overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className={`w-full h-full object-cover transition-transform duration-500 ${
              isOwned ? "opacity-60" : "group-hover:scale-110"
            }`}
          />

          {isOwned && (
            <div className="absolute top-3 left-3">
              <span className="bg-pg-accent/20 backdrop-blur-md text-pg-accent text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-pg-accent/30">
                En Biblioteca
              </span>
            </div>
          )}
        </div>

        <div className="p-5">
          <h3 className="text-white font-bold text-lg truncate group-hover:text-pg-accent transition-colors">
            {product.name}
          </h3>
          <div className="flex justify-between items-center mt-4">
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-500 font-black uppercase tracking-tighter">
                {isOwned ? "Comprar para regalo" : "Precio"}
              </span>
              <span className="text-2xl font-black text-white">
                ${product.price}
              </span>
            </div>

            <button
              onClick={handleQuickAdd}
              className={`text-[10px] font-black px-4 py-2 rounded-xl border transition-all duration-300 ${
                isOwned
                  ? "bg-white/5 border-white/20 text-white hover:bg-pg-accent hover:border-pg-accent"
                  : "bg-pg-accent/10 hover:bg-pg-accent text-pg-accent hover:text-white border-pg-accent/20"
              }`}
            >
              {isOwned ? "RECOMPRAR" : "+ AÑADIR"}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};
