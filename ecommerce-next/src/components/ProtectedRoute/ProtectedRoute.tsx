"use client";

import { useUser } from "@/Context/UserContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser();
  const router = useRouter();
  const [status, setStatus] = useState<
    "loading" | "authorized" | "unauthorized"
  >("loading");

  useEffect(() => {
    const savedSession = localStorage.getItem("userSession");
    const token =
      user?.token ||
      localStorage.getItem("userToken") ||
      (savedSession ? JSON.parse(savedSession).token : null);

    if (!token) {
      setStatus("unauthorized");
      router.push("/login");
    } else {
      setStatus("authorized");
    }
  }, [user, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white font-black uppercase italic tracking-[0.5em]">
        <div className="w-10 h-10 border-t-2 border-blue-600 rounded-full animate-spin mb-4"></div>
        Sincronizando...
      </div>
    );
  }

  if (status === "unauthorized") {
    return null;
  }

  return <>{children}</>;
};
