"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useCart } from "@/lib/cart-context";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CheckoutPage() {
    const { items, totalPrice, clearCart } = useCart();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [couponCode, setCouponCode] = useState("");
    const [couponDiscount, setCouponDiscount] = useState(0);
    const [couponApplied, setCouponApplied] = useState(false);
    const [couponError, setCouponError] = useState("");
    const [form, setForm] = useState({
        shippingName: "",
        shippingEmail: "",
        shippingAddress: "",
        shippingPhone: "",
    });

    const handleCoupon = async () => {
        setCouponError("");
        try {
            const res = await fetch("/api/coupons/validate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code: couponCode, orderTotal: totalPrice }),
            });
            const data = await res.json();
            if (!res.ok) {
                setCouponError(data.error);
                setCouponDiscount(0);
                setCouponApplied(false);
                return;
            }
            setCouponDiscount(data.coupon.discount);
            setCouponApplied(true);
        } catch {
            setCouponError("Error al validar cupón");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (items.length === 0) return;
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    items: items.map((i) => ({ id: i.id, quantity: i.quantity })),
                    ...form,
                    couponCode: couponApplied ? couponCode : undefined,
                }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error);
                setLoading(false);
                return;
            }
            clearCart();
            router.push(`/order-confirmation?id=${data.order.id}`);
        } catch {
            setError("Algo salió mal. Intenta de nuevo.");
            setLoading(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-20 text-center">
                <h1 className="text-2xl font-heading text-enerseal mb-4">No hay artículos en el carrito</h1>
                <Link href="/products" className="text-enerseal hover:underline">
                    Ver Productos
                </Link>
            </div>
        );
    }

    const finalTotal = totalPrice - couponDiscount;

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-heading text-enerseal dark:text-white mb-8 tracking-wide"
            >
                Checkout
            </motion.h1>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Shipping Info */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                >
                    <h2 className="text-xl font-heading text-enerseal-dark dark:text-white tracking-wide">
                        Información de Envío
                    </h2>

                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                            Nombre Completo *
                        </label>
                        <input
                            required
                            value={form.shippingName}
                            onChange={(e) => setForm({ ...form, shippingName: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-enerseal"
                            placeholder="Juan Pérez"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                            Email *
                        </label>
                        <input
                            required
                            type="email"
                            value={form.shippingEmail}
                            onChange={(e) => setForm({ ...form, shippingEmail: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-enerseal"
                            placeholder="juan@email.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                            Teléfono *
                        </label>
                        <input
                            required
                            value={form.shippingPhone}
                            onChange={(e) => setForm({ ...form, shippingPhone: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-enerseal"
                            placeholder="+52 55 1234 5678"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                            Dirección de Envío *
                        </label>
                        <textarea
                            required
                            value={form.shippingAddress}
                            onChange={(e) => setForm({ ...form, shippingAddress: e.target.value })}
                            rows={3}
                            className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-enerseal resize-none"
                            placeholder="Av. Reforma 123, Col. Juárez, CDMX, CP 06600"
                        />
                    </div>
                </motion.div>

                {/* Order Summary */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <div className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 sticky top-24">
                        <h2 className="text-xl font-heading text-enerseal-dark dark:text-white mb-6 tracking-wide">
                            Resumen del Pedido
                        </h2>

                        <div className="space-y-3 mb-6">
                            {items.map((item) => (
                                <div key={item.id} className="flex justify-between text-sm">
                                    <span className="text-zinc-600 dark:text-zinc-400 truncate pr-4">
                                        {item.name} × {item.quantity}
                                    </span>
                                    <span className="font-medium text-zinc-900 dark:text-white whitespace-nowrap">
                                        ${(item.price * item.quantity).toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Coupon */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                                Código de Cupón
                            </label>
                            <div className="flex gap-2">
                                <input
                                    value={couponCode}
                                    onChange={(e) => {
                                        setCouponCode(e.target.value.toUpperCase());
                                        setCouponApplied(false);
                                        setCouponDiscount(0);
                                        setCouponError("");
                                    }}
                                    className="flex-1 px-3 py-2 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm outline-none focus:ring-2 focus:ring-enerseal"
                                    placeholder="BIENVENIDO10"
                                />
                                <button
                                    type="button"
                                    onClick={handleCoupon}
                                    disabled={!couponCode}
                                    className="px-4 py-2 rounded-lg bg-gold text-enerseal-dark text-sm font-bold hover:bg-gold-dark transition-colors disabled:opacity-50"
                                >
                                    Aplicar
                                </button>
                            </div>
                            {couponError && (
                                <p className="text-red-500 text-xs mt-1">{couponError}</p>
                            )}
                            {couponApplied && (
                                <p className="text-emerald-600 text-xs mt-1">
                                    ✓ ¡Cupón aplicado! -${couponDiscount.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                                </p>
                            )}
                        </div>

                        <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-zinc-500">Subtotal</span>
                                <span>${totalPrice.toLocaleString("es-MX", { minimumFractionDigits: 2 })}</span>
                            </div>
                            {couponDiscount > 0 && (
                                <div className="flex justify-between text-sm text-emerald-600">
                                    <span>Descuento</span>
                                    <span>-${couponDiscount.toLocaleString("es-MX", { minimumFractionDigits: 2 })}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-lg font-bold pt-2">
                                <span>Total</span>
                                <span className="text-gold-dark dark:text-gold">
                                    ${finalTotal.toLocaleString("es-MX", { minimumFractionDigits: 2 })} MXN
                                </span>
                            </div>
                        </div>

                        {error && (
                            <p className="text-red-500 text-sm mt-4 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-6 px-6 py-3.5 rounded-full bg-enerseal text-white font-semibold hover:bg-enerseal-dark hover:shadow-xl hover:shadow-enerseal/25 transition-all disabled:opacity-50"
                        >
                            {loading ? "Procesando..." : "Confirmar Pedido"}
                        </button>
                    </div>
                </motion.div>
            </form>
        </div>
    );
}
