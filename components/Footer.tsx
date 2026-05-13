import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-enerseal-dark text-zinc-300 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-gold flex items-center justify-center">
                                <span className="text-enerseal-dark font-bold text-sm">E</span>
                            </div>
                            <span className="text-xl font-bold text-white font-heading tracking-wider">
                                ENERSEAL
                            </span>
                        </div>
                        <p className="text-sm leading-relaxed max-w-md text-zinc-400">
                            Fabricante de recubrimientos, pinturas, impermeabilizantes y
                            productos químicos. Ofrecemos soluciones con productos de nueva
                            generación para proteger tus estructuras.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Enlaces Rápidos</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/products" className="hover:text-gold transition-colors">
                                    Productos
                                </Link>
                            </li>
                            <li>
                                <Link href="/tracking" className="hover:text-gold transition-colors">
                                    Rastrear Pedido
                                </Link>
                            </li>
                            <li>
                                <Link href="/cart" className="hover:text-gold transition-colors">
                                    Carrito
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Contacto</h4>
                        <ul className="space-y-2 text-sm">
                            <li>📧 info@enerseal.mx</li>
                            <li>📞 933 277 8155</li>
                            <li>💬 WhatsApp: 993 110 1100</li>
                            <li>🌐 enerseal.mx</li>
                        </ul>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-enerseal text-center text-sm text-zinc-400">
                    © {new Date().getFullYear()} Enerseal™. Todos los derechos reservados.
                </div>
            </div>
        </footer>
    );
}
