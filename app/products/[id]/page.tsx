import prisma from "@/lib/prisma";
import ProductDetail from "./ProductDetail";
import { notFound } from "next/navigation";

export default async function ProductPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const product = await prisma.product.findUnique({
        where: { id: parseInt(id) },
    });

    if (!product || !product.active) {
        notFound();
    }

    return <ProductDetail product={product} />;
}
