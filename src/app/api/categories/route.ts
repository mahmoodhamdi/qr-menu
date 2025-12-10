import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const restaurantId = searchParams.get("restaurantId");

    const categories = await prisma.category.findMany({
      where: restaurantId ? { restaurantId } : undefined,
      include: {
        _count: { select: { items: true } },
      },
      orderBy: { order: "asc" },
    });

    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { restaurantId, name, nameAr, order, isActive } = body;

    if (!restaurantId || !name) {
      return NextResponse.json(
        { success: false, error: "Restaurant ID and name are required" },
        { status: 400 }
      );
    }

    const category = await prisma.category.create({
      data: {
        restaurantId,
        name,
        nameAr,
        order: order ?? 0,
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json({ success: true, data: category }, { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create category" },
      { status: 500 }
    );
  }
}
