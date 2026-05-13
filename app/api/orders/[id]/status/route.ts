import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await requireAdmin();
        const { id } = await params;
        const orderId = parseInt(id);
        const body = await request.json();
        const { status, trackingNumber, note } = body;

        if (!status) {
            return NextResponse.json(
                { error: "Status is required" },
                { status: 400 }
            );
        }

        const validStatuses = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];
        if (!validStatuses.includes(status)) {
            return NextResponse.json(
                { error: "Invalid status" },
                { status: 400 }
            );
        }

        const order = await prisma.order.findUnique({
            where: { id: orderId },
        });

        if (!order) {
            return NextResponse.json(
                { error: "Order not found" },
                { status: 404 }
            );
        }

        const updatedOrder = await prisma.$transaction(async (tx) => {
            const updated = await tx.order.update({
                where: { id: orderId },
                data: {
                    status,
                    trackingNumber: trackingNumber || order.trackingNumber,
                },
                include: {
                    items: { include: { product: true } },
                    statusHistory: { orderBy: { createdAt: "desc" } },
                },
            });

            await tx.orderStatusHistory.create({
                data: {
                    orderId,
                    status,
                    note: note || `Status updated to ${status}`,
                },
            });

            return updated;
        });

        return NextResponse.json({ order: updatedOrder });
    } catch (error: unknown) {
        const err = error as Error;
        if (err.message === "Unauthorized" || err.message === "Forbidden") {
            return NextResponse.json({ error: err.message }, { status: 403 });
        }
        console.error("Order status update error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
