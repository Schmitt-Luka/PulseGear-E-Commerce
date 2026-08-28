import { useState, useEffect } from "react";

export const ThemeSelector = () => {
  const [theme, setTheme] = useState(
    localStorage.getItem("user-theme") || "default",
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("user-theme", theme);
  }, [theme]);

  const themes = [
    { id: "default", name: "Classic Copper", color: "#ff4b1f" },
    { id: "emerald-steam", name: "Emerald Steam", color: "#00ff88" },
    { id: "victorian-velvet", name: "Victorian Gold", color: "#bf953f" },
    { id: "electric-blue", name: "Tesla Blue", color: "#00d4ff" },
  ];

  return (
    <div className="bg-[#151515] p-6 rounded-4xl border border-white/5">
      <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4">
        Paleta de Energía
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {themes.map((t) => (
          <button
            key={t.id}
            onClick={() => setTheme(t.id)}
            className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
              theme === t.id
                ? "border-pg-accent bg-pg-accent/10"
                : "border-white/5 bg-black/20"
            }`}
          >
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: t.color }}
            ></div>
            <span className="text-[10px] font-black uppercase truncate">
              {t.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
