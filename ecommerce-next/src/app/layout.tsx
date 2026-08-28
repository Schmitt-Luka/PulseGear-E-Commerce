"use client";

import "./globals.css";
import { CartProvider } from "@/Context/CartContext";
import { UserProvider } from "@/Context/UserContext";
import { Navbar } from "@/components/Navbar/Navbar";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <title>PulseGear | Games for Gamers</title>
        <meta
          name="description"
          content="La infraestructura definitiva para tu setup gaming."
        />

        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />

        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />

        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/android-chrome-192x192.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="512x512"
          href="/android-chrome-512x512.png"
        />

        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className="bg-pg-bg">
        <UserProvider>
          <CartProvider>
            <Toaster
              position="bottom-right"
              toastOptions={{
                style: {
                  background: "#0f1114",
                  color: "white",
                  border: "1px solid #2563eb",
                  borderRadius: "1.5rem",
                },
              }}
            />

            <Navbar />
            <main>{children}</main>
          </CartProvider>
        </UserProvider>
      </body>
    </html>
  );
}
