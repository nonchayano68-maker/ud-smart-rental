import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { RentalSchema } from "@/lib/schemas/rental";

export async function GET(request: Request) {
  try {
    const user = verifyToken(request);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const whereCondition = user.role === "CUSTOMER" ? { userId: user.id } : {};

    const rentals = await prisma.rental.findMany({
      where: whereCondition,
      include: {
        user: { select: { id: true, name: true, email: true } },
        items: { include: { equipment: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(rentals);
  } catch (error) {
    return NextResponse.json(
      { message: "เกิดข้อผิดพลาดในการดึงข้อมูล", error: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = verifyToken(request);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validation = RentalSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { message: "ข้อมูลไม่ถูกต้อง", errors: validation.error.format() },
        { status: 400 }
      );
    }

    const { items } = validation.data;

    let totalAmount = 0;
    // กำหนด Type ชัดเจนเพื่อแก้ข้อผิดพลาด TypeScript
    const rentalItemsData: {
      equipmentId: number;
      quantity: number;
      days: number;
      priceDay: number;
    }[] = [];

    for (const item of items) {
      const equipment = await prisma.equipment.findUnique({
        where: { id: item.equipmentId },
      });

      if (!equipment) {
        return NextResponse.json(
          { message: `ไม่พบอุปกรณ์ ID: ${item.equipmentId}` },
          { status: 404 }
        );
      }

      if (equipment.stock < item.quantity) {
        return NextResponse.json(
          { message: `อุปกรณ์ ${equipment.name} มีจำนวนไม่พอ` },
          { status: 400 }
        );
      }

      const itemTotal = equipment.priceDay * item.quantity * item.days;
      totalAmount += itemTotal;

      rentalItemsData.push({
        equipmentId: item.equipmentId,
        quantity: item.quantity,
        days: item.days,
        priceDay: equipment.priceDay,
      });
    }

    const rentalNo = `RN-${Date.now()}`;

    const newRental = await prisma.$transaction(async (tx) => {
      const rental = await tx.rental.create({
        data: {
          rentalNo,
          userId: user.id,
          totalAmount,
          items: { create: rentalItemsData },
        },
        include: { items: true },
      });

      for (const item of items) {
        await tx.equipment.update({
          where: { id: item.equipmentId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return rental;
    });

    return NextResponse.json(newRental, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "เกิดข้อผิดพลาดในการสร้างรายการเช่า", error: String(error) },
      { status: 500 }
    );
  }
}