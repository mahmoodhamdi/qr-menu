import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const restaurants = await prisma.restaurant.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: restaurants });
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch restaurants" },
      { status: 500 }
    );
  }
}
