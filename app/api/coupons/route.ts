import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
    try {
        await requireAdmin();
        const coupons = await prisma.coupon.findMany({
            orderBy: { createdAt: "desc" },
            include: { _count: { select: { usages: true } } },
        });
        return NextResponse.json({ coupons });
    } catch (error: unknown) {
        const err = error as Error;
        if (err.message === "Unauthorized" || err.message === "Forbidden") {
            return NextResponse.json({ error: err.message }, { status: 403 });
        }
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        await requireAdmin();
        const body = await request.json();
        const { code, type, value, minOrder, maxUses, expiresAt } = body;

        if (!code || !type || value === undefined) {
            return NextResponse.json(
                { error: "Code, type, and value are required" },
                { status: 400 }
            );
        }

        const coupon = await prisma.coupon.create({
            data: {
                code: code.toUpperCase(),
                type,
                value,
                minOrder: minOrder || 0,
                maxUses: maxUses || 1,
                expiresAt: expiresAt ? new Date(expiresAt) : null,
            },
        });

        return NextResponse.json({ coupon }, { status: 201 });
    } catch (error: unknown) {
        const err = error as Error;
        if (err.message === "Unauthorized" || err.message === "Forbidden") {
            return NextResponse.json({ error: err.message }, { status: 403 });
        }
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
