import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { orderId, email } = body;

        if (!orderId || !email) {
            return NextResponse.json(
                { error: "Order ID and email are required" },
                { status: 400 }
            );
        }

        const order = await prisma.order.findFirst({
            where: {
                id: parseInt(orderId),
                shippingEmail: email.toLowerCase(),
            },
            include: {
                items: { include: { product: true } },
                statusHistory: { orderBy: { createdAt: "asc" } },
            },
        });

        if (!order) {
            return NextResponse.json(
                { error: "Order not found. Please check your order ID and email." },
                { status: 404 }
            );
        }

        return NextResponse.json({
            order: {
                id: order.id,
                status: order.status,
                total: order.total,
                discount: order.discount,
                trackingNumber: order.trackingNumber,
                shippingName: order.shippingName,
                createdAt: order.createdAt,
                items: order.items.map((item) => ({
                    name: item.product.name,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                })),
                statusHistory: order.statusHistory.map((h) => ({
                    status: h.status,
                    note: h.note,
                    createdAt: h.createdAt,
                })),
            },
        });
    } catch (error) {
        console.error("Tracking error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
