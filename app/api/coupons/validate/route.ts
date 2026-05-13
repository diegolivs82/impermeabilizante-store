import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { code, orderTotal } = body;

        if (!code) {
            return NextResponse.json(
                { error: "Coupon code is required" },
                { status: 400 }
            );
        }

        const coupon = await prisma.coupon.findUnique({
            where: { code: code.toUpperCase() },
        });

        if (!coupon || !coupon.active) {
            return NextResponse.json(
                { error: "Invalid coupon code" },
                { status: 400 }
            );
        }

        if (coupon.expiresAt && coupon.expiresAt < new Date()) {
            return NextResponse.json(
                { error: "This coupon has expired" },
                { status: 400 }
            );
        }

        if (coupon.usedCount >= coupon.maxUses) {
            return NextResponse.json(
                { error: "This coupon has reached its usage limit" },
                { status: 400 }
            );
        }

        if (orderTotal && orderTotal < coupon.minOrder) {
            return NextResponse.json(
                {
                    error: `Minimum order of $${coupon.minOrder.toFixed(2)} MXN required`,
                },
                { status: 400 }
            );
        }

        const discount =
            coupon.type === "PERCENTAGE"
                ? orderTotal
                    ? (orderTotal * coupon.value) / 100
                    : coupon.value
                : coupon.value;

        return NextResponse.json({
            valid: true,
            coupon: {
                code: coupon.code,
                type: coupon.type,
                value: coupon.value,
                discount: orderTotal ? Math.min(discount, orderTotal) : discount,
            },
        });
    } catch (error) {
        console.error("Coupon validation error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
