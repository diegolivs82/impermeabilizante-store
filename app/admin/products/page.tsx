"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface Product {
    id: number;
    name: string;
    price: number;
    category: string;
    stock: number;
    active: boolean;
}

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/products?category=all")
            .then((r) => r.json())
            .then((data) => {
                setProducts(data.products || []);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="max-w-5xl mx-auto px-4 py-12">
                <div className="space-y-3">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-16 bg-zinc-100 dark:bg-zinc-800 rounded-xl animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-3xl font-heading text-enerseal dark:text-white mb-8 tracking-wide"
            >
                Gestión de Productos
            </motion.h1>

            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-zinc-200 dark:border-zinc-800">
                                <th className="text-left px-4 py-3 font-medium text-zinc-500">ID</th>
                                <th className="text-left px-4 py-3 font-medium text-zinc-500">Producto</th>
                                <th className="text-left px-4 py-3 font-medium text-zinc-500">Categoría</th>
                                <th className="text-right px-4 py-3 font-medium text-zinc-500">Precio</th>
                                <th className="text-right px-4 py-3 font-medium text-zinc-500">Stock</th>
                                <th className="text-center px-4 py-3 font-medium text-zinc-500">Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr
                                    key={product.id}
                                    className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                                >
                                    <td className="px-4 py-3 font-mono text-zinc-500">{product.id}</td>
                                    <td className="px-4 py-3 font-medium text-enerseal dark:text-gold">
                                        {product.name}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="px-2 py-0.5 rounded bg-gold/20 text-gold-dark text-xs font-medium">
                                            {product.category}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right font-mono text-gold-dark dark:text-gold">
                                        ${product.price.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                                    </td>
                                    <td className={`px-4 py-3 text-right font-mono ${product.stock < 10 ? "text-orange-500" : "text-zinc-700 dark:text-zinc-300"}`}>
                                        {product.stock}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${product.active ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                                            {product.active ? "Activo" : "Inactivo"}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
