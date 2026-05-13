"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/lib/cart-context";
import {
    HiOutlineShoppingCart,
    HiOutlineUser,
    HiOutlineMenu,
    HiOutlineX,
} from "react-icons/hi";

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

export default function Navbar() {
    const { totalItems } = useCart();
    const [user, setUser] = useState<User | null>(null);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        fetch("/api/auth/me")
            .then((r) => r.json())
            .then((data) => setUser(data.user))
            .catch(() => setUser(null));
    }, []);

    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        setUser(null);
        window.location.href = "/";
    };

    return (
        <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/90 dark:bg-zinc-950/90 border-b border-zinc-200 dark:border-zinc-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-enerseal flex items-center justify-center">
                            <span className="text-white font-bold text-sm">E</span>
                        </div>
                        <span className="text-xl font-bold text-enerseal font-heading tracking-wider">
                            ENERSEAL
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-6">
                        <Link
                            href="/products"
                            className="text-zinc-600 dark:text-zinc-300 hover:text-enerseal dark:hover:text-gold transition-colors font-medium"
                        >
                            Productos
                        </Link>
                        <Link
                            href="/tracking"
                            className="text-zinc-600 dark:text-zinc-300 hover:text-enerseal dark:hover:text-gold transition-colors font-medium"
                        >
                            Rastrear Pedido
                        </Link>
                        {user?.role === "ADMIN" && (
                            <Link
                                href="/admin"
                                className="text-zinc-600 dark:text-zinc-300 hover:text-enerseal dark:hover:text-gold transition-colors font-medium"
                            >
                                Admin
                            </Link>
                        )}
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center gap-4">
                        <Link
                            href="/cart"
                            className="relative p-2 text-zinc-600 dark:text-zinc-300 hover:text-enerseal transition-colors"
                        >
                            <HiOutlineShoppingCart className="w-6 h-6" />
                            {totalItems > 0 && (
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -top-1 -right-1 w-5 h-5 bg-gold text-enerseal-dark text-xs rounded-full flex items-center justify-center font-bold"
                                >
                                    {totalItems}
                                </motion.span>
                            )}
                        </Link>

                        {user ? (
                            <div className="flex items-center gap-3">
                                <Link
                                    href="/orders"
                                    className="text-sm text-zinc-600 dark:text-zinc-300 hover:text-enerseal transition-colors"
                                >
                                    Mis Pedidos
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="text-sm px-4 py-2 rounded-full border border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:border-red-400 hover:text-red-500 transition-all"
                                >
                                    Salir
                                </button>
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className="flex items-center gap-2 px-4 py-2 rounded-full bg-enerseal text-white text-sm font-medium hover:bg-enerseal-dark hover:shadow-lg hover:shadow-enerseal/25 transition-all"
                            >
                                <HiOutlineUser className="w-4 h-4" />
                                Iniciar Sesión
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex md:hidden items-center gap-3">
                        <Link href="/cart" className="relative p-2 text-zinc-600 dark:text-zinc-300">
                            <HiOutlineShoppingCart className="w-6 h-6" />
                            {totalItems > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gold text-enerseal-dark text-xs rounded-full flex items-center justify-center font-bold">
                                    {totalItems}
                                </span>
                            )}
                        </Link>
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="p-2 text-zinc-600 dark:text-zinc-300"
                        >
                            {menuOpen ? (
                                <HiOutlineX className="w-6 h-6" />
                            ) : (
                                <HiOutlineMenu className="w-6 h-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950"
                    >
                        <div className="px-4 py-4 space-y-3">
                            <Link
                                href="/products"
                                onClick={() => setMenuOpen(false)}
                                className="block py-2 text-zinc-700 dark:text-zinc-300 font-medium"
                            >
                                Productos
                            </Link>
                            <Link
                                href="/tracking"
                                onClick={() => setMenuOpen(false)}
                                className="block py-2 text-zinc-700 dark:text-zinc-300 font-medium"
                            >
                                Rastrear Pedido
                            </Link>
                            {user?.role === "ADMIN" && (
                                <Link
                                    href="/admin"
                                    onClick={() => setMenuOpen(false)}
                                    className="block py-2 text-zinc-700 dark:text-zinc-300 font-medium"
                                >
                                    Panel Admin
                                </Link>
                            )}
                            {user ? (
                                <>
                                    <Link
                                        href="/orders"
                                        onClick={() => setMenuOpen(false)}
                                        className="block py-2 text-zinc-700 dark:text-zinc-300 font-medium"
                                    >
                                        Mis Pedidos
                                    </Link>
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setMenuOpen(false);
                                        }}
                                        className="block w-full text-left py-2 text-red-500 font-medium"
                                    >
                                        Cerrar Sesión
                                    </button>
                                </>
                            ) : (
                                <Link
                                    href="/login"
                                    onClick={() => setMenuOpen(false)}
                                    className="block py-2 text-enerseal font-medium"
                                >
                                    Iniciar Sesión / Registrarse
                                </Link>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
