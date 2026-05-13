"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface Order {
    id: number;
    status: string;
    total: number;
    trackingNumber: string | null;
    shippingName: string;
    shippingEmail: string;
    createdAt: string;
    user: { name: string; email: string } | null;
    items: { product: { name: string }; quantity: number }[];
}

const statuses = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];
const statusLabels: Record<string, string> = {
    PENDING: "Pendiente",
    CONFIRMED: "Confirmado",
    SHIPPED: "Enviado",
    DELIVERED: "Entregado",
    CANCELLED: "Cancelado",
};
const statusColors: Record<string, string> = {
    PENDING: "bg-gold/20 text-gold-dark",
    CONFIRMED: "bg-enerseal/10 text-enerseal",
    SHIPPED: "bg-purple-100 text-purple-700",
    DELIVERED: "bg-emerald-100 text-emerald-700",
    CANCELLED: "bg-red-100 text-red-700",
};

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState<number | null>(null);

    const fetchOrders = () => {
        fetch("/api/orders")
            .then((r) => r.json())
            .then((data) => {
                setOrders(data.orders || []);
                setLoading(false);
            });
    };

    useEffect(() => { fetchOrders(); }, []);

    const updateStatus = async (orderId: number, status: string, trackingNumber?: string) => {
        setUpdating(orderId);
        try {
            await fetch(`/api/orders/${orderId}/status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status, trackingNumber }),
            });
            fetchOrders();
        } finally {
            setUpdating(null);
        }
    };

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-12">
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-40 bg-zinc-100 dark:bg-zinc-800 rounded-2xl animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-3xl font-heading text-enerseal dark:text-white mb-8 tracking-wide"
            >
                Gestión de Pedidos
            </motion.h1>

            <div className="space-y-4">
                {orders.map((order) => (
                    <motion.div
                        key={order.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5"
                    >
                        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                            <div className="flex items-center gap-3">
                                <span className="font-mono font-bold text-lg text-enerseal">#{order.id}</span>
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                                    {statusLabels[order.status]}
                                </span>
                            </div>
                            <span className="text-sm text-zinc-500">
                                {new Date(order.createdAt).toLocaleDateString("es-MX")}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm">
                            <div>
                                <p className="text-zinc-500">Cliente</p>
                                <p className="font-medium">{order.shippingName}</p>
                                <p className="text-zinc-400">{order.shippingEmail}</p>
                            </div>
                            <div>
                                <p className="text-zinc-500">Artículos</p>
                                {order.items.map((item, i) => (
                                    <p key={i} className="text-zinc-700 dark:text-zinc-300">
                                        {item.product.name} ×{item.quantity}
                                    </p>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-wrap items-end gap-3 pt-3 border-t border-zinc-200 dark:border-zinc-800">
                            <div>
                                <label className="block text-xs text-zinc-500 mb-1">Estado</label>
                                <select
                                    value={order.status}
                                    onChange={(e) => updateStatus(order.id, e.target.value)}
                                    disabled={updating === order.id}
                                    className="px-3 py-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm"
                                >
                                    {statuses.map((s) => (
                                        <option key={s} value={s}>{statusLabels[s]}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs text-zinc-500 mb-1">Número de rastreo</label>
                                <input
                                    defaultValue={order.trackingNumber || ""}
                                    placeholder="Ingresar número"
                                    onBlur={(e) => {
                                        if (e.target.value !== (order.trackingNumber || "")) {
                                            updateStatus(order.id, order.status, e.target.value);
                                        }
                                    }}
                                    className="px-3 py-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm w-48"
                                />
                            </div>
                            <span className="ml-auto font-bold text-lg text-gold-dark dark:text-gold">
                                ${order.total.toLocaleString("es-MX", { minimumFractionDigits: 2 })} MXN
                            </span>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
