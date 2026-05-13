"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    HiOutlineShoppingBag,
    HiOutlineClipboardList,
    HiOutlineTicket,
    HiOutlineUsers,
    HiOutlineLogout,
} from "react-icons/hi";

interface DashboardStats {
    totalOrders: number;
    totalProducts: number;
    totalCoupons: number;
    totalCustomers: number;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);

    useEffect(() => {
        Promise.all([
            fetch("/api/orders").then((r) => r.json()),
            fetch("/api/products").then((r) => r.json()),
            fetch("/api/coupons").then((r) => r.json()),
        ]).then(([ordersData, productsData, couponsData]) => {
            setStats({
                totalOrders: ordersData.orders?.length || 0,
                totalProducts: productsData.products?.length || 0,
                totalCoupons: couponsData.coupons?.length || 0,
                totalCustomers: 0,
            });
        });
    }, []);

    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        window.location.href = "/";
    };

    const cards = [
        { title: "Productos", value: stats?.totalProducts ?? "—", icon: HiOutlineShoppingBag, href: "/admin/products", color: "from-enerseal to-enerseal-light" },
        { title: "Pedidos", value: stats?.totalOrders ?? "—", icon: HiOutlineClipboardList, href: "/admin/orders", color: "from-gold to-gold-light" },
        { title: "Cupones", value: stats?.totalCoupons ?? "—", icon: HiOutlineTicket, href: "/admin/coupons", color: "from-emerald-500 to-teal-400" },
        { title: "Clientes", value: stats?.totalCustomers ?? "—", icon: HiOutlineUsers, href: "/admin", color: "from-purple-500 to-pink-400" },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-center justify-between mb-10">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <h1 className="text-4xl font-heading text-enerseal dark:text-white tracking-wide">
                        Panel de Administración
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400">
                        Administra tu tienda Enerseal
                    </p>
                </motion.div>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:border-red-400 hover:text-red-500 transition-all text-sm"
                >
                    <HiOutlineLogout className="w-4 h-4" />
                    Cerrar Sesión
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {cards.map((card, i) => (
                    <motion.div
                        key={card.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <Link
                            href={card.href}
                            className="block p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-gold dark:hover:border-gold transition-colors group"
                        >
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                <card.icon className="w-6 h-6 text-white" />
                            </div>
                            <p className="text-3xl font-bold text-zinc-900 dark:text-white mb-1">
                                {card.value}
                            </p>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                {card.title}
                            </p>
                        </Link>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link href="/admin/products" className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-enerseal transition-colors text-center font-medium">
                    📦 Gestionar Productos
                </Link>
                <Link href="/admin/orders" className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-enerseal transition-colors text-center font-medium">
                    📋 Gestionar Pedidos
                </Link>
                <Link href="/admin/coupons" className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-enerseal transition-colors text-center font-medium">
                    🎟️ Gestionar Cupones
                </Link>
            </div>
        </div>
    );
}
