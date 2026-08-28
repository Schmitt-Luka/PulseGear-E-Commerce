"use client";

import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

interface UserSession {
  token: string;
  userData: {
    name: string;
    email: string;
    address: string;
    phone: string;
  };
}

interface UserContextType {
  user: UserSession | null;
  ownedProductIds: number[];
  allOwnedProducts: any[];
  login: (userData: UserSession) => void;
  logout: () => void;
  refreshOrders: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserSession | null>(null);
  const [allOwnedProducts, setAllOwnedProducts] = useState<any[]>([]);
  const [ownedProductIds, setOwnedProductIds] = useState<number[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  const API_URL = "http://localhost:3001";

  const fetchOrders = async (token: string) => {
    if (!token) return;
    try {
      const response = await fetch(`${API_URL}/users/orders`, {
        method: "GET",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const orders = await response.json();
        const allProducts = orders.flatMap(
          (order: any) => order.products || [],
        );
        setAllOwnedProducts(allProducts);

        const ids = [...new Set(allProducts.map((p: any) => p.id))] as number[];
        setOwnedProductIds(ids);
      }
    } catch (error) {
      console.error("Error al obtener biblioteca:", error);
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem("userSession");
    if (saved) {
      try {
        const sessionData = JSON.parse(saved);
        setUser(sessionData);
      } catch (e) {
        console.error("Error al parsear la sesión del usuario");
        localStorage.removeItem("userSession");
      }
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized && user?.token) {
      fetchOrders(user.token);
    }
  }, [user, isInitialized]);

  const login = (sessionData: UserSession) => {
    setUser(sessionData);
    localStorage.setItem("userSession", JSON.stringify(sessionData));
    localStorage.setItem("userToken", sessionData.token);
  };

  const logout = () => {
    setUser(null);
    setAllOwnedProducts([]);
    setOwnedProductIds([]);
    localStorage.removeItem("userSession");
    localStorage.removeItem("userToken");
  };

  return (
    <UserContext.Provider
      value={{
        user,
        ownedProductIds,
        allOwnedProducts,
        login,
        logout,
        refreshOrders: () => fetchOrders(user?.token || ""),
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser debe usarse dentro de UserProvider");
  return context;
};
