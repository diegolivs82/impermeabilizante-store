"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useCart } from "@/lib/cart-context";
import Link from "next/link";
import {
    HiOutlineShoppingCart,
    HiOutlineArrowLeft,
    HiOutlineCheck,
} from "react-icons/hi";

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
    stock: number;
}

export default function ProductDetail({ product }: { product: Product }) {
    const { addItem } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);

    const handleAdd = () => {
        addItem(
            { id: product.id, name: product.name, price: product.price, image: product.image },
            quantity
        );
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <Link
                href="/products"
                className="inline-flex items-center gap-2 text-zinc-500 hover:text-enerseal transition-colors mb-8"
            >
                <HiOutlineArrowLeft className="w-4 h-4" />
                Volver a productos
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Product Image */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-gradient-to-br from-zinc-100 to-zinc-50 dark:from-zinc-800 dark:to-zinc-900 rounded-3xl p-8 flex items-center justify-center aspect-square"
                >
                    <img
                        src={product.image}
                        alt={product.name}
                        className="max-w-full max-h-full object-contain"
                    />
                </motion.div>

                {/* Product Info */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-col"
                >
                    <span className="inline-block w-fit px-3 py-1 rounded-full bg-gold text-enerseal-dark text-sm font-bold mb-4 uppercase tracking-wide">
                        {product.category}
                    </span>

                    <h1 className="text-3xl md:text-4xl font-heading text-enerseal dark:text-gold mb-4 tracking-wide">
                        {product.name}
                    </h1>

                    <p className="text-zinc-600 dark:text-zinc-400 text-lg leading-relaxed mb-6">
                        {product.description}
                    </p>

                    <div className="text-3xl font-bold text-gold-dark dark:text-gold mb-2">
                        ${product.price.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                        <span className="text-base font-normal text-zinc-500 ml-2">MXN</span>
                    </div>

                    <p className={`text-sm mb-8 ${product.stock > 5 ? "text-emerald-600" : product.stock > 0 ? "text-orange-500" : "text-red-500"}`}>
                        {product.stock > 5
                            ? `✓ En stock (${product.stock} disponibles)`
                            : product.stock > 0
                                ? `⚠ Solo quedan ${product.stock}`
                                : "✗ Agotado"}
                    </p>

                    {/* Quantity & Add to Cart */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex items-center border border-zinc-300 dark:border-zinc-700 rounded-full">
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="w-12 h-12 flex items-center justify-center text-lg font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-l-full transition-colors"
                            >
                                −
                            </button>
                            <span className="w-12 text-center font-semibold">{quantity}</span>
                            <button
                                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                className="w-12 h-12 flex items-center justify-center text-lg font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-r-full transition-colors"
                            >
                                +
                            </button>
                        </div>

                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={handleAdd}
                            disabled={product.stock === 0}
                            className="flex-1 flex items-center justify-center gap-2 px-8 py-3 rounded-full bg-enerseal text-white font-semibold hover:bg-enerseal-dark hover:shadow-xl hover:shadow-enerseal/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {added ? (
                                <>
                                    <HiOutlineCheck className="w-5 h-5" />
                                    ¡Agregado!
                                </>
                            ) : (
                                <>
                                    <HiOutlineShoppingCart className="w-5 h-5" />
                                    Agregar al Carrito
                                </>
                            )}
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
