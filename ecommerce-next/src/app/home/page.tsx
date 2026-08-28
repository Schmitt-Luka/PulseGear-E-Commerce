"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "@/components/ProductCard/ProductCard";
import { ProductSkeleton } from "@/components/ProductSkeleton/ProductSkeleton";
import type { Product } from "@/Types";
import { AnimatePresence, motion } from "framer-motion";

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const genres = [
    "RPG",
    "Estrategia",
    "Acción",
    "Indie",
    "Simulación",
    "Aventura",
    "Terror",
    "Deportes",
    "Multijugador",
  ];

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:3001/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setFilteredProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let result = products;

    if (selectedCategory !== "all") {
      result = result.filter((p: any) => p.category?.name === selectedCategory);
    }

    if (searchTerm !== "") {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    setFilteredProducts(result);
  }, [selectedCategory, searchTerm, products]);

  return (
    <div className="flex min-h-screen bg-pg-bg">
      <aside className="w-64 bg-[#1a1a1a] border-r border-white/5 p-6 hidden md:block">
        <div className="sticky top-24">
          <h2 className="text-xs font-black mb-6 text-gray-500 uppercase tracking-[0.2em]">
            Filtro por Género
          </h2>
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => setSelectedCategory("all")}
                className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 text-sm font-bold ${
                  selectedCategory === "all"
                    ? "bg-pg-accent text-white shadow-[0_0_20px_rgba(37,99,235,0.2)]"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                Todos los juegos
              </button>
            </li>
            {genres.map((genre) => (
              <li key={genre}>
                <button
                  onClick={() => setSelectedCategory(genre)}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 text-sm font-bold ${
                    selectedCategory === genre
                      ? "bg-pg-accent text-white shadow-[0_0_20px_rgba(37,99,235,0.2)]"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {genre}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <main className="flex-1 p-8 md:p-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic">
              {selectedCategory === "all" ? "Catálogo " : ""}
              <span className="text-pg-accent">
                {selectedCategory === "all" ? "Completo" : selectedCategory}
              </span>
            </h1>
            <div className="h-1 w-20 bg-pg-accent mt-4 rounded-full" />
          </div>

          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Buscar juegos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-white/10 rounded-2xl py-4 px-6 text-white placeholder:text-gray-600 focus:outline-none focus:border-pg-accent/50 transition-all shadow-2xl font-bold"
            />
            <span className="absolute right-5 top-1/2 -translate-y-1/2 opacity-30 text-xs font-black text-pg-accent uppercase">
              🔍
            </span>
          </div>
        </div>

        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <motion.div
                  key={`skeleton-${i}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <ProductSkeleton />
                </motion.div>
              ))
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map((p) => (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProductCard product={p} />
                </motion.div>
              ))
            ) : (
              <motion.div
                key="no-results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="col-span-full flex flex-col items-center justify-center py-40 bg-[#1a1a1a]/30 rounded-[3rem] border border-dashed border-white/10"
              >
                <span className="text-6xl mb-6 opacity-20 grayscale">📡</span>
                <p className="text-gray-500 text-xl font-black uppercase italic tracking-widest opacity-50">
                  Sin Resultados para: "{searchTerm}"
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>
    </div>
  );
}
