"use client";

import { motion } from "framer-motion";
import { useCart } from "@/lib/cart-context";
import { HiOutlineShoppingCart } from "react-icons/hi";
import Link from "next/link";

interface ProductCardProps {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
    stock: number;
}

export default function ProductCard({
    id,
    name,
    description,
    price,
    image,
    category,
    stock,
}: ProductCardProps) {
    const { addItem } = useCart();

    const categoryLabels: Record<string, string> = {
        impermeabilizante: "Impermeabilizante",
        pintura: "Pintura",
        recubrimiento: "Recubrimiento",
        sellador: "Sellador",
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.3 }}
            className="group bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden hover:shadow-xl hover:shadow-enerseal/10 transition-shadow duration-300"
        >
            <Link href={`/products/${id}`}>
                <div className="relative h-48 bg-gradient-to-br from-zinc-100 to-zinc-50 dark:from-zinc-800 dark:to-zinc-900 flex items-center justify-center overflow-hidden">
                    <img
                        src={image}
                        alt={name}
                        className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-300"
                    />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold bg-gold text-enerseal-dark uppercase tracking-wide">
                        {categoryLabels[category] || category}
                    </span>
                    {stock <= 5 && stock > 0 && (
                        <span className="absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600">
                            Últimas pzas
                        </span>
                    )}
                    {stock === 0 && (
                        <span className="absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600">
                            Agotado
                        </span>
                    )}
                </div>
            </Link>

            <div className="p-5">
                <Link href={`/products/${id}`}>
                    <h3 className="font-heading text-lg text-enerseal dark:text-gold mb-2 line-clamp-2 group-hover:text-enerseal-light transition-colors uppercase tracking-wide">
                        {name}
                    </h3>
                </Link>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4 line-clamp-2">
                    {description}
                </p>

                <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-gold-dark dark:text-gold">
                        ${price.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                        <span className="text-xs font-normal text-zinc-500 ml-1">MXN</span>
                    </span>

                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() =>
                            addItem({ id, name, price, image })
                        }
                        disabled={stock === 0}
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-enerseal text-white text-sm font-medium hover:bg-enerseal-dark hover:shadow-lg hover:shadow-enerseal/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <HiOutlineShoppingCart className="w-4 h-4" />
                        Agregar
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
}
