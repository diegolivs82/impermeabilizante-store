import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Seeding database...");

    // Create admin user
    const adminPassword = await bcrypt.hash("admin123", 10);
    const admin = await prisma.user.upsert({
        where: { email: "admin@enerseal.com" },
        update: {},
        create: {
            email: "admin@enerseal.com",
            password: adminPassword,
            name: "Admin Enerseal",
            role: "ADMIN",
        },
    });
    console.log("✅ Admin user created:", admin.email);

    // Create test customer
    const customerPassword = await bcrypt.hash("customer123", 10);
    const customer = await prisma.user.upsert({
        where: { email: "cliente@test.com" },
        update: {},
        create: {
            email: "cliente@test.com",
            password: customerPassword,
            name: "Cliente Prueba",
            phone: "+52 55 1234 5678",
            address: "Av. Reforma 123, CDMX",
            role: "CUSTOMER",
        },
    });
    console.log("✅ Customer user created:", customer.email);

    // Delete existing products to replace with real ones
    await prisma.orderItem.deleteMany();
    await prisma.product.deleteMany();

    // ═══════════════════════════════════════════════════════════════
    // REAL ENERSEAL PRODUCTS — from official fichas técnicas
    // ═══════════════════════════════════════════════════════════════
    const products = [
        {
            name: "Enerseal Termic-K",
            description:
                "Recubrimiento disipador de calor con antioxidantes a base de agua. Reduce la temperatura interior hasta 12 °C y refleja hasta el 85% de los rayos solares. Biodegradable, no tóxico, anticorrosivo, antihongos y antibacterial. Aplicación directa del envase. Rendimiento: 40 a 60 m²/cubeta de 19 L a dos capas. Ideal para concreto, ladrillo, block, paneles, láminas, muros y techos.",
            price: 1947.46,
            image: "/products/termic-k.png",
            category: "recubrimiento",
            stock: 40,
        },
        {
            name: "Tex-AllSeal",
            description:
                "Recubrimiento texturizado decorativo que funciona como aislante térmico e impermeable. Pasta térmica ecológica de alto rendimiento con propiedades acústicas y antihongos. Retardante al fuego, resistente al intemperismo. Disponible en grano grueso, medio y fino. Rendimiento: 6 a 10 m²/cubeta de 19 L. Aplicación rápida en interior y exterior.",
            price: 1565.84,
            image: "/products/tex-allseal.png",
            category: "recubrimiento",
            stock: 35,
        },
        {
            name: "Cement-Top 100",
            description:
                "Pasta elástica para juntas con base en poliuretano monocomponente. Excelente adherencia a la mayoría de materiales de construcción. No se escurre en juntas verticales, alta resistencia al agua e intemperie. Elasticidad permanente con capacidad de movimiento de ±20%. No contiene solventes. Rendimiento: 3 ml (de 1×1cm) por litro. Cubeta de 19 L.",
            price: 1760.31,
            image: "/products/cement-top.png",
            category: "sellador",
            stock: 30,
        },
        {
            name: "Enerseal Elastomérica",
            description:
                "Pintura acrílica flexible y elástica, ideal para resistir movimientos ligeros de superficies. Brinda gran efectividad contra la lluvia, humedad y rayos del sol. 100% acrílica, acabado mate, antihongos y antibacterial, 100% lavable. Elongación 400% a 600%. Garantía 5 años. Presentación: 19 y 200 litros. Norma NMX-C-423-ONNCE-2019.",
            price: 2302.36,
            image: "/products/elastomerica.png",
            category: "pintura",
            stock: 45,
        },
        {
            name: "Enerseal Premium",
            description:
                "Pintura acrílica antibacterial y antihongos con garantía de 15 años. Elaborada con resinas acrílicas híbridas de gran resistencia y durabilidad para interior y exterior. Acabado mate y satinado. Lavabilidad de 7,500 ciclos, buena retención de color, magnífica adherencia. Rendimiento: 7 a 9 m²/L. Presentación: cubeta 19 L y tambor 200 L.",
            price: 2411.09,
            image: "/products/premium.png",
            category: "pintura",
            stock: 50,
        },
        {
            name: "Enerseal Max",
            description:
                "Impermeabilizante acrílico de máximo rendimiento con tecnología avanzada de protección contra filtraciones. Fórmula concentrada que ofrece cobertura superior y durabilidad extendida. Resistente a rayos UV, antihongos y antibacterial. Fácil aplicación con brocha, rodillo o equipo de aspersión. Presentación: cubeta de 19 L.",
            price: 2044.18,
            image: "/products/max.png",
            category: "impermeabilizante",
            stock: 30,
        },
        {
            name: "Enerseal WR-8",
            description:
                "Sellador vinil-acrílico transparente para uso primario. Protege superficies de la humedad, cubre porosidad y mejora el rendimiento de pinturas e impermeabilizantes. Diluible en agua al 3 a 1. Secado rápido al tacto en 15-30 minutos. 100% impermeable al agua. Rendimiento: 4-10 m²/L. Presentación: cubeta de 19 L y tambor de 200 L.",
            price: 1168.67,
            image: "/products/wr-8.png",
            category: "sellador",
            stock: 60,
        },
        {
            name: "Enertop G6",
            description:
                "Impermeabilizante reforzado elastomérico con durabilidad estimada de 6 años. A base de resinas acrílicas de alta viscosidad con excelente resistencia a rayos UV. Aplicación fácil y rápida directamente del envase, no requiere malla de refuerzo. No contiene solventes. Rendimiento: 18 a 20 m²/cubeta de 19 L a dos manos. Blanco o rojo terracota.",
            price: 1675.98,
            image: "/products/enertop-g6.png",
            category: "impermeabilizante",
            stock: 55,
        },
        {
            name: "Enertop G10",
            description:
                "Impermeabilizante térmico híbrido con 10 años de garantía. Reduce la conducción del calor al interior con tecnología de alto reforzamiento para repeler y aislar rayos UV. Reflectancia solar de 0.89 (ASTM C 1549), SRI de 112. Aplicación rápida directamente del envase, no requiere malla de refuerzo. Ecológico y anticorrosivo. Rendimiento: 1 m²/L. Cubeta 19 L o 200 L.",
            price: 1855.53,
            image: "/products/enertop-g10.png",
            category: "impermeabilizante",
            stock: 40,
        },
        {
            name: "Enertop G12",
            description:
                "Impermeabilizante premium de la más alta gama con 12 años de garantía. Tecnología avanzada elastomérica con máxima protección contra filtraciones, rayos UV y cambios térmicos extremos. Fórmula reforzada con fibras para mayor durabilidad. Aplicación directa sin necesidad de malla de refuerzo. No contiene solventes. Presentación: cubeta de 19 L.",
            price: 2302.36,
            image: "/products/enertop-g12.png",
            category: "impermeabilizante",
            stock: 25,
        },
    ];

    for (const product of products) {
        await prisma.product.create({
            data: product,
        });
    }
    console.log(`✅ ${products.length} productos reales de Enerseal creados`);

    // Create coupons
    await prisma.coupon.deleteMany();
    const coupons = [
        {
            code: "BIENVENIDO10",
            type: "PERCENTAGE" as const,
            value: 10,
            minOrder: 500,
            maxUses: 100,
            expiresAt: new Date("2027-12-31"),
        },
        {
            code: "ENVIOGRATIS",
            type: "FIXED" as const,
            value: 150,
            minOrder: 1000,
            maxUses: 50,
            expiresAt: new Date("2027-06-30"),
        },
        {
            code: "VERANO25",
            type: "PERCENTAGE" as const,
            value: 25,
            minOrder: 2000,
            maxUses: 30,
            expiresAt: new Date("2025-01-01"), // expired on purpose for testing
        },
    ];

    for (const coupon of coupons) {
        await prisma.coupon.upsert({
            where: { code: coupon.code },
            update: coupon,
            create: coupon,
        });
    }
    console.log(`✅ ${coupons.length} cupones creados`);

    console.log("🎉 ¡Seed completo!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
