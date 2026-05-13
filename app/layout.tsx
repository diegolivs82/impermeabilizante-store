import type { Metadata } from "next";
import { Inter, Bebas_Neue } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Enerseal — Recubrimientos e Impermeabilizantes",
  description:
    "Soluciones premium en impermeabilización y selladores. Productos de nueva generación para proteger tus estructuras.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} ${bebasNeue.variable} font-sans antialiased bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 min-h-screen flex flex-col`}>
        <CartProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <ChatWidget />
        </CartProvider>
      </body>
    </html>
  );
}
