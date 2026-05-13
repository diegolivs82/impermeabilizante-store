"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

interface Order {
    id: number;
    status: string;
    total: number;
    createdAt: string;
    items: { product: { name: string }; quantity: number; unitPrice: number }[];
}

const statusColors: Record<string, string> = {
    PENDING: "bg-gold/20 text-gold-dark dark:text-gold",
    CONFIRMED: "bg-enerseal/10 text-enerseal dark:text-enerseal-light",
    SHIPPED: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    DELIVERED: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    CANCELLED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const statusLabels: Record<string, string> = {
    PENDING: "Pendiente",
    CONFIRMED: "Confirmado",
    SHIPPED: "Enviado",
    DELIVERED: "Entregado",
    CANCELLED: "Cancelado",
};

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/orders")
            .then((r) => r.json())
            .then((data) => {
                setOrders(data.orders || []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-12">
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-32 bg-zinc-100 dark:bg-zinc-800 rounded-2xl animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-heading text-enerseal dark:text-white mb-8 tracking-wide"
            >
                Mis Pedidos
            </motion.h1>

            {orders.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-zinc-500 mb-4">Aún no tienes pedidos.</p>
                    <Link href="/products" className="text-enerseal hover:underline font-medium">
                        Comenzar a comprar
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order, i) => (
                        <motion.div
                            key={order.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5"
                        >
                            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                                <div className="flex items-center gap-3">
                                    <span className="font-mono font-bold text-enerseal dark:text-gold">
                                        #{order.id}
                                    </span>
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[order.status] || statusColors.PENDING}`}>
                                        {statusLabels[order.status] || order.status}
                                    </span>
                                </div>
                                <span className="text-sm text-zinc-500">
                                    {new Date(order.createdAt).toLocaleDateString("es-MX")}
                                </span>
                            </div>

                            <div className="text-sm text-zinc-500 dark:text-zinc-400 mb-3">
                                {order.items.map((item, j) => (
                                    <span key={j}>
                                        {item.product.name} ×{item.quantity}
                                        {j < order.items.length - 1 ? ", " : ""}
                                    </span>
                                ))}
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="font-bold text-gold-dark dark:text-gold">
                                    ${order.total.toLocaleString("es-MX", { minimumFractionDigits: 2 })} MXN
                                </span>
                                <Link href="/tracking" className="text-sm text-enerseal hover:underline">
                                    Rastrear Pedido →
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
