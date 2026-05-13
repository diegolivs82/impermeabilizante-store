"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { HiOutlineSearch } from "react-icons/hi";

interface TrackingOrder {
    id: number;
    status: string;
    total: number;
    discount: number;
    trackingNumber: string | null;
    shippingName: string;
    createdAt: string;
    items: { name: string; quantity: number; unitPrice: number }[];
    statusHistory: { status: string; note: string | null; createdAt: string }[];
}

const statusConfig: Record<string, { color: string; label: string; icon: string }> = {
    PENDING: { color: "bg-gold", label: "Pendiente", icon: "⏳" },
    CONFIRMED: { color: "bg-enerseal", label: "Confirmado", icon: "✓" },
    SHIPPED: { color: "bg-purple-500", label: "Enviado", icon: "📦" },
    DELIVERED: { color: "bg-emerald-500", label: "Entregado", icon: "✅" },
    CANCELLED: { color: "bg-red-500", label: "Cancelado", icon: "✗" },
};

const allStatuses = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED"];

export default function TrackingPage() {
    const [orderId, setOrderId] = useState("");
    const [email, setEmail] = useState("");
    const [order, setOrder] = useState<TrackingOrder | null>(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setOrder(null);

        try {
            const res = await fetch("/api/tracking", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderId, email }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error);
            } else {
                setOrder(data.order);
            }
        } catch {
            setError("Error de conexión. Intenta de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    const currentStatusIndex = order ? allStatuses.indexOf(order.status) : -1;

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-4xl font-heading text-enerseal dark:text-white mb-2 tracking-wide">
                    Rastrear Pedido
                </h1>
                <p className="text-zinc-500 dark:text-zinc-400 mb-8">
                    Ingresa tu número de pedido y email para ver el estado.
                </p>

                <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-8">
                    <input
                        required
                        value={orderId}
                        onChange={(e) => setOrderId(e.target.value)}
                        placeholder="# de Pedido (ej. 1)"
                        className="flex-1 px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 outline-none focus:ring-2 focus:ring-enerseal"
                    />
                    <input
                        required
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Correo electrónico"
                        className="flex-1 px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 outline-none focus:ring-2 focus:ring-enerseal"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-3 rounded-xl bg-enerseal text-white font-medium hover:bg-enerseal-dark hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        <HiOutlineSearch className="w-5 h-5" />
                        {loading ? "Buscando..." : "Rastrear"}
                    </button>
                </form>

                {error && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-red-600 dark:text-red-400 text-sm mb-8"
                    >
                        {error}
                    </motion.div>
                )}

                {order && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
                            <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                                <div>
                                    <p className="text-sm text-zinc-500">Pedido</p>
                                    <p className="text-xl font-bold font-mono text-enerseal dark:text-gold">
                                        #{order.id}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-zinc-500">Fecha</p>
                                    <p className="font-medium text-zinc-900 dark:text-white">
                                        {new Date(order.createdAt).toLocaleDateString("es-MX")}
                                    </p>
                                </div>
                            </div>

                            {order.trackingNumber && (
                                <div className="bg-enerseal/10 rounded-lg p-3 mb-6">
                                    <p className="text-sm text-enerseal dark:text-enerseal-light">
                                        📦 Número de Rastreo:{" "}
                                        <span className="font-mono font-bold">{order.trackingNumber}</span>
                                    </p>
                                </div>
                            )}

                            {/* Status Timeline */}
                            {order.status !== "CANCELLED" ? (
                                <div className="flex items-center justify-between mb-6">
                                    {allStatuses.map((status, i) => {
                                        const isActive = i <= currentStatusIndex;
                                        const config = statusConfig[status];
                                        return (
                                            <div key={status} className="flex items-center flex-1">
                                                <div className="flex flex-col items-center">
                                                    <div
                                                        className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold ${isActive ? config.color : "bg-zinc-300 dark:bg-zinc-700"
                                                            }`}
                                                    >
                                                        {config.icon}
                                                    </div>
                                                    <span
                                                        className={`text-xs mt-1 ${isActive
                                                                ? "text-enerseal dark:text-gold font-medium"
                                                                : "text-zinc-400"
                                                            }`}
                                                    >
                                                        {config.label}
                                                    </span>
                                                </div>
                                                {i < allStatuses.length - 1 && (
                                                    <div
                                                        className={`flex-1 h-1 mx-2 rounded ${i < currentStatusIndex
                                                                ? "bg-enerseal"
                                                                : "bg-zinc-200 dark:bg-zinc-700"
                                                            }`}
                                                    />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-6 text-center">
                                    <span className="text-red-600 font-medium">Pedido Cancelado</span>
                                </div>
                            )}

                            {/* Items */}
                            <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4">
                                <h3 className="font-heading text-lg text-enerseal-dark dark:text-white mb-3 tracking-wide">
                                    Artículos
                                </h3>
                                {order.items.map((item, i) => (
                                    <div key={i} className="flex justify-between py-2 text-sm">
                                        <span className="text-zinc-600 dark:text-zinc-400">
                                            {item.name} × {item.quantity}
                                        </span>
                                        <span className="font-medium text-zinc-900 dark:text-white">
                                            ${(item.unitPrice * item.quantity).toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                                        </span>
                                    </div>
                                ))}
                                {order.discount > 0 && (
                                    <div className="flex justify-between py-2 text-sm text-emerald-600">
                                        <span>Descuento</span>
                                        <span>-${order.discount.toLocaleString("es-MX", { minimumFractionDigits: 2 })}</span>
                                    </div>
                                )}
                                <div className="flex justify-between pt-3 border-t border-zinc-200 dark:border-zinc-800 font-bold">
                                    <span>Total</span>
                                    <span className="text-gold-dark dark:text-gold">
                                        ${order.total.toLocaleString("es-MX", { minimumFractionDigits: 2 })} MXN
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Status History */}
                        {order.statusHistory.length > 0 && (
                            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
                                <h3 className="font-heading text-lg text-enerseal-dark dark:text-white mb-4 tracking-wide">
                                    Historial de Estado
                                </h3>
                                <div className="space-y-3">
                                    {order.statusHistory.map((h, i) => (
                                        <div key={i} className="flex items-start gap-3">
                                            <div
                                                className={`w-2 h-2 rounded-full mt-1.5 ${statusConfig[h.status]?.color || "bg-zinc-400"
                                                    }`}
                                            />
                                            <div>
                                                <p className="text-sm font-medium text-zinc-900 dark:text-white">
                                                    {statusConfig[h.status]?.label || h.status}
                                                </p>
                                                {h.note && <p className="text-xs text-zinc-500">{h.note}</p>}
                                                <p className="text-xs text-zinc-400">
                                                    {new Date(h.createdAt).toLocaleString("es-MX")}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}
