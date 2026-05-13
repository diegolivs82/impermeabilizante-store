import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            items,
            shippingName,
            shippingEmail,
            shippingAddress,
            shippingPhone,
            couponCode,
        } = body;

        if (!items || !items.length || !shippingName || !shippingEmail || !shippingAddress || !shippingPhone) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Get session (optional - supports guest checkout)
        const session = await getSession();

        // Validate products and calculate total
        let total = 0;
        const orderItems: { productId: number; quantity: number; unitPrice: number }[] = [];

        for (const item of items) {
            const product = await prisma.product.findUnique({
                where: { id: item.id },
            });
            if (!product || !product.active) {
                return NextResponse.json(
                    { error: `Product not found: ${item.id}` },
                    { status: 400 }
                );
            }
            if (product.stock < item.quantity) {
                return NextResponse.json(
                    { error: `Insufficient stock for ${product.name}` },
                    { status: 400 }
                );
            }
            total += product.price * item.quantity;
            orderItems.push({
                productId: product.id,
                quantity: item.quantity,
                unitPrice: product.price,
            });
        }

        // Apply coupon if provided
        let discount = 0;
        let coupon = null;
        if (couponCode) {
            coupon = await prisma.coupon.findUnique({
                where: { code: couponCode },
            });
            if (!coupon || !coupon.active) {
                return NextResponse.json(
                    { error: "Invalid coupon code" },
                    { status: 400 }
                );
            }
            if (coupon.expiresAt && coupon.expiresAt < new Date()) {
                return NextResponse.json(
                    { error: "Coupon has expired" },
                    { status: 400 }
                );
            }
            if (coupon.usedCount >= coupon.maxUses) {
                return NextResponse.json(
                    { error: "Coupon usage limit reached" },
                    { status: 400 }
                );
            }
            if (total < coupon.minOrder) {
                return NextResponse.json(
                    { error: `Minimum order of $${coupon.minOrder} required for this coupon` },
                    { status: 400 }
                );
            }
            discount =
                coupon.type === "PERCENTAGE"
                    ? (total * coupon.value) / 100
                    : coupon.value;
            discount = Math.min(discount, total);
        }

        // Create order in a transaction
        const order = await prisma.$transaction(async (tx) => {
            // Create order
            const newOrder = await tx.order.create({
                data: {
                    userId: session?.userId || null,
                    total: total - discount,
                    discount,
                    couponCode: couponCode || null,
                    shippingName,
                    shippingEmail,
                    shippingAddress,
                    shippingPhone,
                    items: {
                        create: orderItems,
                    },
                    statusHistory: {
                        create: {
                            status: "PENDING",
                            note: "Order placed",
                        },
                    },
                },
                include: {
                    items: { include: { product: true } },
                },
            });

            // Decrement stock
            for (const item of orderItems) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: { stock: { decrement: item.quantity } },
                });
            }

            // Record coupon usage
            if (coupon) {
                await tx.coupon.update({
                    where: { id: coupon.id },
                    data: { usedCount: { increment: 1 } },
                });
                await tx.couponUsage.create({
                    data: {
                        couponId: coupon.id,
                        userId: session?.userId || null,
                        orderId: newOrder.id,
                    },
                });
            }

            return newOrder;
        });

        return NextResponse.json({ order }, { status: 201 });
    } catch (error) {
        console.error("Order error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const where =
            session.role === "ADMIN" ? {} : { userId: session.userId };

        const orders = await prisma.order.findMany({
            where,
            include: {
                items: { include: { product: true } },
                statusHistory: { orderBy: { createdAt: "desc" } },
                user: { select: { name: true, email: true } },
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({ orders });
    } catch (error) {
        console.error("Orders GET error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
