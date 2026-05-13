"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ProductCard from "@/components/ProductCard";

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
    stock: number;
}

const categories = [
    { value: "all", label: "Todos" },
    { value: "impermeabilizante", label: "Impermeabilizantes" },
    { value: "pintura", label: "Pinturas" },
    { value: "recubrimiento", label: "Recubrimientos" },
    { value: "sellador", label: "Selladores" },
];

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [category, setCategory] = useState("all");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetch(`/api/products?category=${category}`)
            .then((r) => r.json())
            .then((data) => {
                setProducts(data.products);
                setLoading(false);
            });
    }, [category]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-10"
            >
                <h1 className="text-4xl font-heading text-enerseal dark:text-white mb-2 tracking-wide">
                    Productos
                </h1>
                <p className="text-zinc-500 dark:text-zinc-400">
                    Soluciones profesionales de impermeabilización para cada proyecto.
                </p>
            </motion.div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-8">
                {categories.map((cat) => (
                    <button
                        key={cat.value}
                        onClick={() => setCategory(cat.value)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${category === cat.value
                            ? "bg-enerseal text-white shadow-lg shadow-enerseal/25"
                            : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                            }`}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* Products Grid */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <div
                            key={i}
                            className="bg-zinc-100 dark:bg-zinc-900 rounded-2xl h-80 animate-pulse"
                        />
                    ))}
                </div>
            ) : products.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-zinc-500 dark:text-zinc-400 text-lg">
                        No se encontraron productos en esta categoría.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <ProductCard key={product.id} {...product} />
                    ))}
                </div>
            )}
        </div>
    );
}
