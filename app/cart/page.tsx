"use client";

import { motion } from "framer-motion";
import { useCart } from "@/lib/cart-context";
import Link from "next/link";
import { HiOutlineTrash, HiOutlineArrowRight } from "react-icons/hi";

export default function CartPage() {
    const { items, removeItem, updateQuantity, totalPrice } = useCart();

    if (items.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="w-20 h-20 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-6">
                        <span className="text-4xl">🛒</span>
                    </div>
                    <h1 className="text-3xl font-heading text-enerseal dark:text-white mb-2 tracking-wide">
                        Tu Carrito fantasma 
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400 mb-8">
                        ¡Agrega algunos productos para comenzar!
                    </p>
                    <Link
                        href="/products"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-enerseal text-white font-medium hover:bg-enerseal-dark hover:shadow-lg transition-all"
                    >
                        Ver Productos
                        <HiOutlineArrowRight className="w-4 h-4" />
                    </Link>
                </motion.div>
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
                Carrito de Compras
            </motion.h1>

            <div className="space-y-4 mb-8">
                {items.map((item, i) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-center gap-4 p-4 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800"
                    >
                        <div className="w-16 h-16 rounded-xl bg-enerseal flex items-center justify-center text-white text-xl font-bold font-heading flex-shrink-0">
                            {item.name.charAt(0)}
                        </div>

                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-zinc-900 dark:text-white truncate">
                                {item.name}
                            </h3>
                            <p className="text-sm text-zinc-500">
                                ${item.price.toLocaleString("es-MX", { minimumFractionDigits: 2 })} c/u
                            </p>
                        </div>

                        <div className="flex items-center border border-zinc-300 dark:border-zinc-700 rounded-full">
                            <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-8 h-8 flex items-center justify-center text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-l-full"
                            >
                                −
                            </button>
                            <span className="w-8 text-center text-sm font-medium">
                                {item.quantity}
                            </span>
                            <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-8 h-8 flex items-center justify-center text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-r-full"
                            >
                                +
                            </button>
                        </div>

                        <p className="font-bold text-gold-dark dark:text-gold w-24 text-right">
                            ${(item.price * item.quantity).toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                        </p>

                        <button
                            onClick={() => removeItem(item.id)}
                            className="p-2 text-zinc-400 hover:text-red-500 transition-colors"
                        >
                            <HiOutlineTrash className="w-5 h-5" />
                        </button>
                    </motion.div>
                ))}
            </div>

            {/* Summary */}
            <div className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
                <div className="flex justify-between items-center mb-6">
                    <span className="text-lg font-semibold text-zinc-900 dark:text-white">
                        Total
                    </span>
                    <span className="text-2xl font-bold text-gold-dark dark:text-gold">
                        ${totalPrice.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                        <span className="text-sm font-normal text-zinc-500 ml-1">MXN</span>
                    </span>
                </div>

                <Link
                    href="/checkout"
                    className="flex items-center justify-center gap-2 w-full px-6 py-3.5 rounded-full bg-enerseal text-white font-semibold hover:bg-enerseal-dark hover:shadow-xl hover:shadow-enerseal/25 transition-all"
                >
                    Proceder al Pago
                    <HiOutlineArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
