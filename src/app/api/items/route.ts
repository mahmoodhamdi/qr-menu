import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const categoryId = searchParams.get("categoryId");

    const items = await prisma.item.findMany({
      where: categoryId ? { categoryId } : undefined,
      include: {
        category: { select: { id: true, name: true, nameAr: true } },
      },
      orderBy: { order: "asc" },
    });

    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    console.error("Error fetching items:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch items" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      categoryId,
      name,
      nameAr,
      description,
      descriptionAr,
      price,
      image,
      isAvailable,
      order,
    } = body;

    if (!categoryId || !name || price === undefined) {
      return NextResponse.json(
        { success: false, error: "Category ID, name, and price are required" },
        { status: 400 }
      );
    }

    const item = await prisma.item.create({
      data: {
        categoryId,
        name,
        nameAr,
        description,
        descriptionAr,
        price: parseFloat(price),
        image,
        isAvailable: isAvailable ?? true,
        order: order ?? 0,
      },
    });

    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch (error) {
    console.error("Error creating item:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create item" },
      { status: 500 }
    );
  }
}
