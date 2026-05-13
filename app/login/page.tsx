"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const [mode, setMode] = useState<"login" | "register">("login");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [form, setForm] = useState({
        email: "",
        password: "",
        name: "",
        phone: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
        const body =
            mode === "login"
                ? { email: form.email, password: form.password }
                : form;

        try {
            const res = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error);
                setLoading(false);
                return;
            }
            if (data.user.role === "ADMIN") {
                router.push("/admin");
            } else {
                router.push("/products");
            }
            router.refresh();
        } catch {
            setError("Algo salió mal");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-enerseal flex items-center justify-center">
                            <span className="text-white font-bold">E</span>
                        </div>
                    </Link>
                    <h1 className="text-3xl font-heading text-enerseal dark:text-white tracking-wide">
                        {mode === "login" ? "Bienvenido" : "Crear Cuenta"}
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-1">
                        {mode === "login"
                            ? "Inicia sesión en tu cuenta Enerseal"
                            : "Regístrate para ofertas exclusivas"}
                    </p>
                </div>

                {/* Mode Toggle */}
                <div className="flex bg-zinc-100 dark:bg-zinc-800 rounded-full p-1 mb-8">
                    <button
                        onClick={() => { setMode("login"); setError(""); }}
                        className={`flex-1 py-2 rounded-full text-sm font-medium transition-all ${mode === "login"
                                ? "bg-enerseal text-white shadow"
                                : "text-zinc-500"
                            }`}
                    >
                        Iniciar Sesión
                    </button>
                    <button
                        onClick={() => { setMode("register"); setError(""); }}
                        className={`flex-1 py-2 rounded-full text-sm font-medium transition-all ${mode === "register"
                                ? "bg-enerseal text-white shadow"
                                : "text-zinc-500"
                            }`}
                    >
                        Registrarse
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {mode === "register" && (
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                                Nombre Completo
                            </label>
                            <input
                                required
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 outline-none focus:ring-2 focus:ring-enerseal"
                                placeholder="Juan Pérez"
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                            Email
                        </label>
                        <input
                            required
                            type="email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 outline-none focus:ring-2 focus:ring-enerseal"
                            placeholder="tu@email.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                            Contraseña
                        </label>
                        <input
                            required
                            type="password"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 outline-none focus:ring-2 focus:ring-enerseal"
                            placeholder="••••••••"
                            minLength={6}
                        />
                    </div>

                    {mode === "register" && (
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                                Teléfono (opcional)
                            </label>
                            <input
                                value={form.phone}
                                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 outline-none focus:ring-2 focus:ring-enerseal"
                                placeholder="+52 55 1234 5678"
                            />
                        </div>
                    )}

                    {error && (
                        <p className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full px-6 py-3.5 rounded-full bg-enerseal text-white font-semibold hover:bg-enerseal-dark hover:shadow-xl hover:shadow-enerseal/25 transition-all disabled:opacity-50"
                    >
                        {loading
                            ? "Por favor espera..."
                            : mode === "login"
                                ? "Iniciar Sesión"
                                : "Crear Cuenta"}
                    </button>
                </form>
            </motion.div>
        </div>
    );
}
