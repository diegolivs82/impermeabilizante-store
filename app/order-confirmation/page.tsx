"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Suspense } from "react";
import { HiOutlineCheck, HiOutlineSearch } from "react-icons/hi";

function ConfirmationContent() {
    const params = useSearchParams();
    const orderId = params.get("id");

    return (
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-6">
                    <HiOutlineCheck className="w-10 h-10 text-emerald-600" />
                </div>

                <h1 className="text-4xl font-heading text-enerseal dark:text-white mb-2 tracking-wide">
                    ¡Pedido Confirmado!
                </h1>
                <p className="text-zinc-500 dark:text-zinc-400 mb-2">
                    Gracias por tu compra.
                </p>
                {orderId && (
                    <p className="text-lg font-mono font-semibold text-gold-dark dark:text-gold mb-8">
                        Pedido #{orderId}
                    </p>
                )}

                <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-8">
                    Te enviaremos un email de confirmación con información de rastreo una
                    vez que tu pedido sea enviado.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/products"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-enerseal text-white font-medium hover:bg-enerseal-dark transition-all"
                    >
                        Seguir Comprando
                    </Link>
                    <Link
                        href="/tracking"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                    >
                        <HiOutlineSearch className="w-4 h-4" />
                        Rastrear Pedido
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}

export default function OrderConfirmation() {
    return (
        <Suspense fallback={<div className="py-20 text-center">Cargando...</div>}>
            <ConfirmationContent />
        </Suspense>
    );
}
