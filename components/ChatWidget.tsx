"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineChat, HiOutlineX, HiOutlinePaperAirplane } from "react-icons/hi";

interface Message {
    role: "user" | "assistant";
    content: string;
}

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [sessionId, setSessionId] = useState<number | null>(null);
    const [consented, setConsented] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleConsent = () => {
        setConsented(true);
        setMessages([
            {
                role: "assistant",
                content:
                    "¡Hola! Soy EnersealBot 👋 Puedo ayudarte a encontrar los productos de impermeabilización adecuados, responder preguntas técnicas o asistir con tu pedido. ¿En qué puedo ayudarte?",
            },
        ]);
    };

    const sendMessage = async () => {
        if (!input.trim() || loading) return;
        const userMsg = input.trim();
        setInput("");
        setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
        setLoading(true);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: userMsg,
                    sessionId,
                    consent: true,
                }),
            });
            const data = await res.json();
            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: data.reply },
            ]);
            if (data.sessionId) setSessionId(data.sessionId);
        } catch {
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content:
                        "Lo siento, tengo problemas de conexión. Escríbenos a soporte@enerseal.com o llama al +52 55 1234 5678.",
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Floating Button */}
            <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gold text-enerseal-dark shadow-lg shadow-gold/30 flex items-center justify-center hover:shadow-xl hover:shadow-gold/40 transition-shadow"
            >
                {isOpen ? (
                    <HiOutlineX className="w-6 h-6" />
                ) : (
                    <HiOutlineChat className="w-6 h-6" />
                )}
            </motion.button>

            {/* Chat Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="fixed bottom-24 right-6 z-50 w-[90vw] max-w-[380px] bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col overflow-hidden"
                        style={{ height: "min(500px, 70vh)" }}
                    >
                        {/* Header */}
                        <div className="bg-enerseal px-4 py-3 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center">
                                <span className="text-enerseal-dark text-sm font-bold">E</span>
                            </div>
                            <div>
                                <p className="text-white font-semibold text-sm">EnersealBot</p>
                                <p className="text-blue-200 text-xs">Asistente IA</p>
                            </div>
                        </div>

                        {!consented ? (
                            /* Consent Screen */
                            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                                <div className="w-16 h-16 rounded-full bg-enerseal/10 flex items-center justify-center mb-4">
                                    <HiOutlineChat className="w-8 h-8 text-enerseal" />
                                </div>
                                <h3 className="font-semibold text-zinc-900 dark:text-white mb-2">
                                    Chatea con EnersealBot
                                </h3>
                                <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
                                    Nuestro asistente IA puede ayudarte a encontrar productos y
                                    responder preguntas. Tus mensajes se almacenan de forma segura.
                                </p>
                                <button
                                    onClick={handleConsent}
                                    className="px-6 py-2 rounded-full bg-enerseal text-white text-sm font-medium hover:bg-enerseal-dark hover:shadow-lg transition-all"
                                >
                                    Acepto — Iniciar Chat
                                </button>
                                <p className="text-xs text-zinc-400 mt-3">
                                    Al chatear, aceptas el almacenamiento de datos según nuestra política de privacidad.
                                </p>
                            </div>
                        ) : (
                            <>
                                {/* Messages */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                    {messages.map((msg, i) => (
                                        <div
                                            key={i}
                                            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"
                                                }`}
                                        >
                                            <div
                                                className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${msg.role === "user"
                                                        ? "bg-enerseal text-white rounded-br-md"
                                                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-bl-md"
                                                    }`}
                                            >
                                                {msg.content}
                                            </div>
                                        </div>
                                    ))}
                                    {loading && (
                                        <div className="flex justify-start">
                                            <div className="bg-zinc-100 dark:bg-zinc-800 px-4 py-3 rounded-2xl rounded-bl-md">
                                                <div className="flex gap-1">
                                                    <span className="w-2 h-2 bg-gold rounded-full animate-bounce" />
                                                    <span
                                                        className="w-2 h-2 bg-gold rounded-full animate-bounce"
                                                        style={{ animationDelay: "0.15s" }}
                                                    />
                                                    <span
                                                        className="w-2 h-2 bg-gold rounded-full animate-bounce"
                                                        style={{ animationDelay: "0.3s" }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Input */}
                                <div className="p-3 border-t border-zinc-200 dark:border-zinc-800">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                                            placeholder="Escribe un mensaje..."
                                            className="flex-1 px-4 py-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-enerseal"
                                        />
                                        <button
                                            onClick={sendMessage}
                                            disabled={!input.trim() || loading}
                                            className="w-10 h-10 rounded-full bg-enerseal text-white flex items-center justify-center disabled:opacity-50 hover:bg-enerseal-dark hover:shadow-lg transition-all"
                                        >
                                            <HiOutlinePaperAirplane className="w-4 h-4 rotate-90" />
                                        </button>
                                    </div>
                                    <p className="text-xs text-center text-zinc-400 mt-2">
                                        ¿Necesitas ayuda humana?{" "}
                                        <a
                                            href="mailto:soporte@enerseal.com"
                                            className="text-enerseal hover:underline"
                                        >
                                            Contactar soporte
                                        </a>
                                    </p>
                                </div>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
