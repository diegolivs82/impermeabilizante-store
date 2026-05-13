"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface Coupon {
    id: number;
    code: string;
    type: string;
    value: number;
    minOrder: number;
    maxUses: number;
    usedCount: number;
    expiresAt: string | null;
    active: boolean;
}

export default function AdminCouponsPage() {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({
        code: "",
        type: "PERCENTAGE",
        value: 10,
        minOrder: 0,
        maxUses: 100,
        expiresAt: "",
    });

    const fetchCoupons = () => {
        fetch("/api/coupons")
            .then((r) => r.json())
            .then((data) => {
                setCoupons(data.coupons || []);
                setLoading(false);
            });
    };

    useEffect(() => { fetchCoupons(); }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        await fetch("/api/coupons", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...form, expiresAt: form.expiresAt || null }),
        });
        setShowForm(false);
        setForm({ code: "", type: "PERCENTAGE", value: 10, minOrder: 0, maxUses: 100, expiresAt: "" });
        fetchCoupons();
    };

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-12">
                <div className="space-y-4">
                    {[1, 2].map((i) => (
                        <div key={i} className="h-24 bg-zinc-100 dark:bg-zinc-800 rounded-2xl animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-center justify-between mb-8">
                <motion.h1
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-3xl font-heading text-enerseal dark:text-white tracking-wide"
                >
                    Gestión de Cupones
                </motion.h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="px-4 py-2 rounded-full bg-enerseal text-white text-sm font-medium hover:bg-enerseal-dark transition-colors"
                >
                    {showForm ? "Cancelar" : "+ Nuevo Cupón"}
                </button>
            </div>

            {showForm && (
                <motion.form
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    onSubmit={handleCreate}
                    className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4"
                >
                    <div>
                        <label className="block text-sm font-medium mb-1">Código</label>
                        <input
                            required
                            value={form.code}
                            onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                            className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm"
                            placeholder="VERANO20"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Tipo</label>
                        <select
                            value={form.type}
                            onChange={(e) => setForm({ ...form, type: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm"
                        >
                            <option value="PERCENTAGE">Porcentaje (%)</option>
                            <option value="FIXED">Fijo (MXN)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Valor</label>
                        <input required type="number" value={form.value}
                            onChange={(e) => setForm({ ...form, value: parseFloat(e.target.value) })}
                            className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Pedido Mínimo ($)</label>
                        <input type="number" value={form.minOrder}
                            onChange={(e) => setForm({ ...form, minOrder: parseFloat(e.target.value) })}
                            className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Usos Máximos</label>
                        <input type="number" value={form.maxUses}
                            onChange={(e) => setForm({ ...form, maxUses: parseInt(e.target.value) })}
                            className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Fecha de Expiración</label>
                        <input type="date" value={form.expiresAt}
                            onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm"
                        />
                    </div>
                    <div className="sm:col-span-2">
                        <button type="submit" className="px-6 py-2 rounded-full bg-gold text-enerseal-dark font-bold text-sm hover:bg-gold-dark transition-colors">
                            Crear Cupón
                        </button>
                    </div>
                </motion.form>
            )}

            <div className="space-y-3">
                {coupons.map((coupon) => (
                    <div key={coupon.id} className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 flex flex-wrap items-center gap-4">
                        <span className="font-mono font-bold text-lg text-enerseal">{coupon.code}</span>
                        <span className="px-2 py-0.5 rounded bg-gold/20 text-gold-dark text-xs font-medium">
                            {coupon.type === "PERCENTAGE" ? `${coupon.value}% desc.` : `$${coupon.value} desc.`}
                        </span>
                        <span className="text-xs text-zinc-500">Mín: ${coupon.minOrder}</span>
                        <span className="text-xs text-zinc-500">Usado: {coupon.usedCount}/{coupon.maxUses}</span>
                        {coupon.expiresAt && (
                            <span className={`text-xs ${new Date(coupon.expiresAt) < new Date() ? "text-red-500" : "text-zinc-500"}`}>
                                {new Date(coupon.expiresAt) < new Date()
                                    ? "Expirado"
                                    : `Expira: ${new Date(coupon.expiresAt).toLocaleDateString("es-MX")}`}
                            </span>
                        )}
                        <span className={`ml-auto px-2 py-0.5 rounded-full text-xs font-medium ${coupon.active ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                            {coupon.active ? "Activo" : "Inactivo"}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
