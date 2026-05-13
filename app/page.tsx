"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  HiOutlineShieldCheck,
  HiOutlineTruck,
  HiOutlineChatAlt2,
  HiOutlineSparkles,
} from "react-icons/hi";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section — Video Background */}
      <section className="relative overflow-hidden h-[85vh] min-h-[600px] flex items-center">
        {/* Video Background */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-enerseal-dark/70 via-enerseal-dark/50 to-enerseal-dark/80" />

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto text-white"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-gold/20 text-gold text-sm font-medium mb-6 border border-gold/30 backdrop-blur-sm">
              Soluciones Profesionales en Impermeabilización
            </span>
            <h1 className="text-5xl md:text-7xl font-heading mb-6 leading-tight tracking-wide drop-shadow-lg">
              Protege Tus Estructuras con{" "}
              <span className="text-gold">
                Enerseal
              </span>
            </h1>
            <p className="text-lg md:text-xl text-zinc-200 mb-8 max-w-2xl mx-auto font-sans normal-case drop-shadow-md">
              Recubrimientos, pinturas e impermeabilizantes de nueva generación.
              Desde techos residenciales hasta instalaciones industriales.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/products"
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-gold text-enerseal-dark font-bold hover:bg-gold-light hover:shadow-xl hover:shadow-gold/25 transition-all text-base uppercase tracking-wide"
              >
                Ver Productos
              </Link>
              <Link
                href="/tracking"
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-full border border-white/40 text-white font-semibold hover:bg-white/10 backdrop-blur-sm transition-all text-base"
              >
                Rastrear Pedido
              </Link>
            </div>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-zinc-950 to-transparent" />
      </section>

      {/* Features */}
      <section className="py-20 bg-white dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-heading text-enerseal dark:text-white mb-4 tracking-wide">
              ¿Por Qué Elegir Enerseal?
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto normal-case">
              Productos líderes en la industria, respaldados por años de
              investigación y rendimiento comprobado.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: HiOutlineShieldCheck,
                title: "Calidad Premium",
                description:
                  "Fórmulas resistentes a UV y de larga duración con hasta 10 años de garantía.",
              },
              {
                icon: HiOutlineTruck,
                title: "Envío Rápido",
                description:
                  "Envío el mismo día en pedidos antes de las 2 PM. Rastreo en tiempo real.",
              },
              {
                icon: HiOutlineChatAlt2,
                title: "Soporte IA",
                description:
                  "Obtén recomendaciones instantáneas de nuestro asistente inteligente.",
              },
              {
                icon: HiOutlineSparkles,
                title: "Recompensas",
                description:
                  "Gana cupones y descuentos con cada compra. Ahorra más comprando.",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-gold dark:hover:border-gold transition-colors group"
              >
                <feature.icon className="w-10 h-10 text-enerseal mb-4 group-hover:text-gold group-hover:scale-110 transition-all" />
                <h3 className="font-heading text-xl text-enerseal-dark dark:text-white mb-2 tracking-wide">
                  {feature.title}
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 normal-case">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gold">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-heading text-enerseal-dark mb-4 tracking-wide">
              ¿Listo Para Impermeabilizar?
            </h2>
            <p className="text-enerseal-dark/70 text-lg mb-8 normal-case">
              Explora nuestro catálogo completo y recibe productos profesionales
              en la puerta de tu casa.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center px-8 py-3.5 rounded-full bg-enerseal text-white font-bold hover:bg-enerseal-dark hover:shadow-xl transition-all uppercase tracking-wide"
            >
              Ver Todos los Productos →
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
