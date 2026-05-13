import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get("category");

        const where: Record<string, unknown> = { active: true };
        if (category && category !== "all") {
            where.category = category;
        }

        const products = await prisma.product.findMany({
            where,
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({ products });
    } catch (error) {
        console.error("Products error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
